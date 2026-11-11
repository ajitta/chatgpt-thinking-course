"""Extract the original lesson UI programs (lessons 1-20) from the shared-conversation data.

The shared ChatGPT conversation stores each visible answer twice: as the text in
`sources/conversation/chatgpt-thinking-공유대화-원본.md` and as a compiled UI
program (`metadata.model_dil_v2`) with its resolved links, citations, images and
charts. The site renders the compiled program, so this script copies only what
rendering needs into `sources/conversation/ui/lesson-XX.json`.

Not copied: the reader's saved selections (`view_state`), private reasoning,
search tool calls, and every other message.

Usage:
    python site/extract_lessons.py <share.json>

`share.json` is the conversation data read from the shared link
(https://chatgpt.com/share/6af33303-9c00-83e8-a5b8-bb134c40db5c) in a logged-in
browser on 2026-11-11. It is not stored in this repository.
"""

import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MD = ROOT / "sources" / "conversation" / "chatgpt-thinking-공유대화-원본.md"
OUT = ROOT / "sources" / "conversation" / "ui"

# Lesson -> (conversation message number in the .md file, message id).
# Lesson 10 uses the complete version inside message 037 (see PROVENANCE.md);
# the site starts rendering it at the lesson 10 title.
LESSONS = {
    1: (7, "da3be32b-1f8f-4071-8fe1-fc303f34c43e"),
    2: (10, "a1feee55-c28b-46c0-b26a-a246f32abb7b"),
    3: (13, "3fba95f2-fe0b-41d5-9d9b-fef8a75f9b46"),
    4: (16, "e00dc08f-a5ed-4ba9-8c64-0f52c7fdf920"),
    5: (19, "d45fce59-dffb-4f01-8d34-ffd9fd2a4d1b"),
    6: (22, "f6edb45e-d3e6-41a6-a6b4-c0baabf90343"),
    7: (25, "55c608c3-eec1-4e7b-871d-661570d1260d"),
    8: (28, "13fd5d7a-2b0d-43d7-9b28-e8213ba7f55b"),
    9: (31, "8872426e-b034-4e86-b58c-1332425b9524"),
    10: (37, "0f28c55f-ed94-4e6c-b8e4-6331785c08de"),
    11: (40, "13349ccf-fead-461a-ad40-6c1e7f5125d1"),
    12: (43, "a00ad9d2-6f41-433f-a1a2-e53e5ecacea7"),
    13: (46, "313bd912-ff78-4c43-85b9-40e9035587cf"),
    14: (49, "44741a67-f41d-4702-b18b-c87a44ef76c5"),
    15: (52, "7d1c3abf-61e2-4848-8946-92efa69d5317"),
    16: (55, "c238568b-cade-4b71-ba11-dcf2e09dbc6b"),
    17: (58, "66ed7149-5421-404f-b4d3-f60c6cfb437b"),
    18: (61, "6cc5d694-49c7-447d-8f6e-2724002025ec"),
    19: (64, "438e3023-7280-4be9-a5d3-39f042899f2e"),
    20: (67, "29c0cdba-4d8b-4122-ada5-075bfccd052b"),
}
START_AT_TITLE = {10: "10강. 나만의 AI 업무 시스템 설계하기"}


def md_messages():
    text = MD.read_text(encoding="utf-8")
    parts = re.split(r"\n\*\*\[(\d{3})\] (사용자|ChatGPT)\*\* · [^\n]*\n", text)
    out = {}
    for i in range(1, len(parts), 3):
        body = parts[i + 2].strip()
        body = re.sub(r"\n---\s*$", "", body).strip()
        out[int(parts[i])] = body
    return out


def squash(s):
    return re.sub(r"\s+", "", s)


def main(share_path):
    data = json.loads(Path(share_path).read_text(encoding="utf-8"))
    messages = {n["message"]["id"]: n["message"] for n in data["linear_conversation"] if n.get("message")}
    md = md_messages()
    OUT.mkdir(parents=True, exist_ok=True)
    for lesson, (md_no, mid) in LESSONS.items():
        m = messages[mid]
        text = m["content"]["parts"][0]
        if squash(text) != squash(md[md_no]):
            raise SystemExit(f"lesson {lesson}: message {mid} does not match .md message {md_no}")
        dil = m["metadata"]["model_dil_v2"]
        gen = (dil.get("appData") or {}).get("opGenui") or {}
        widgets = [
            c["data"]["content"]
            for c in m["metadata"].get("content_references", [])
            if c.get("type") == "client_defined_widget"
        ]
        record = {
            "lesson": lesson,
            "source": {
                "share_url": "https://chatgpt.com/share/6af33303-9c00-83e8-a5b8-bb134c40db5c",
                "conversation_md_message": md_no,
                "message_id": mid,
                "text_sha256": hashlib.sha256(text.encode("utf-8")).hexdigest(),
            },
            "start_at_title": START_AT_TITLE.get(lesson),
            "code": dil["code"],
            "constants": dil["constants"],
            "resolutions": gen.get("componentResults") or {},
            "bindings": gen.get("modelDataBindings") or {},
            "widgets": widgets,
        }
        path = OUT / f"lesson-{lesson:02d}.json"
        path.write_text(json.dumps(record, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        print(path.relative_to(ROOT), len(dil["code"]), "chars of code,", len(widgets), "charts")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    main(sys.argv[1])
