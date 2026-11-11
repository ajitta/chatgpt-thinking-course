"""Check a Naver magazine manuscript before it goes into the editor.

Usage: python blog/tools/lint_manuscript.py 2      (checks blog/lesson-02-summary.html)
Exit code 1 when any ERROR is found. WARN lines need a human look.
"""
import html
import re
import sys
from pathlib import Path

from PIL import ImageFont

ROOT = Path(__file__).resolve().parents[2]
FONT = ROOT / "blog/tools/fonts/MaruBuri-Bold.ttf"
COLUMN_PX = 320          # text column of m.blog.naver.com on a 360px phone (measured)
HEADING_PX = 19          # editor menu has no 21px; 24px headings wrap on phones
REPORT_LABELS = ["핵심 정리", "정리하면", "요약하면", "결론적으로", "기억해야 할", "세 가지 확인", "참고 자료:"]


def text_of(fragment):
    return html.unescape(re.sub(r"<[^>]+>", "", fragment)).strip()


def main(n):
    src_path = ROOT / f"blog/lesson-{n:02d}-summary.html"
    lesson_md = next(ROOT.glob(f"lessons/*/lesson-{n:02d}.md"))
    src = src_path.read_text(encoding="utf-8")
    source_text = lesson_md.read_text(encoding="utf-8")
    body = re.sub(r"<!--.*?-->", "", src, flags=re.S)
    plain = text_of(body)
    errors, warns = [], []

    title = re.search(r"title:\s*(.+)", src)
    if not title:
        errors.append("no 'title:' line in the header comment")
    elif "ChatGPT" not in title.group(1):
        errors.append(f"title lacks 'ChatGPT': {title.group(1)}")

    for ch, name in (("—", "em dash"), ("–", "en dash"), ("→", "arrow"), ("↗", "arrow")):
        if ch in plain:
            errors.append(f"{name} in text")

    blocks = re.findall(r"<(p|h2|blockquote|hr)([^>]*)>", body)
    first_real = [b for b in blocks if b[0] != "p" or "42715a" not in b[1]]
    if not first_real or first_real[0][0] != "blockquote" or 'data-quote="mark"' not in first_real[0][1]:
        errors.append("the first block after the meta line must be the key-sentence quote (data-quote=\"mark\")")
    if body.count('data-quote="mark"') != 1:
        errors.append("exactly one key-sentence quote expected")

    if FONT.exists():
        f = ImageFont.truetype(str(FONT), HEADING_PX)
        for h in re.findall(r"<h2[^>]*>(.*?)</h2>", body, flags=re.S):
            w = f.getlength(text_of(h))
            if w > COLUMN_PX:
                errors.append(f"heading wraps on a 360px phone ({int(w)}px > {COLUMN_PX}px): {text_of(h)}")
    else:
        warns.append(f"font missing, heading widths not checked: {FONT}")

    for num in sorted(set(re.findall(r"\d+(?:\.\d+)?", plain))):
        if num not in source_text and num not in {str(n), f"{n:02d}"}:
            warns.append(f"number not found in the lesson source: {num}")

    for src_img in re.findall(r'<img[^>]*src="([^"]+)"', body):
        if not (ROOT / "blog" / src_img).exists():
            errors.append(f"image missing: blog/{src_img}")
    imgs = re.findall(r"<img[^>]*>", body)
    if not imgs or "data-rep" not in imgs[-1] or "thumb-lesson" not in imgs[-1]:
        errors.append("last image must be the lesson thumbnail with data-rep")

    for p in re.findall(r"<p[^>]*>(.*?)</p>", body, flags=re.S):
        if "<a " in p and text_of(re.sub(r"</?a[^>]*>", "", p)) != text_of(re.search(r"<a[^>]*>(.*?)</a>", p).group(1)):
            errors.append(f"link must wrap its whole paragraph: {text_of(p)[:40]}")

    if "github.com" in body:
        errors.append("no github.com links: link the github.io lesson page (.../chatgpt-thinking-course/lessons/NN/) once the site is live (lessons-plan.json decisions)")

    for label in REPORT_LABELS:
        if label in plain:
            warns.append(f"report-style label: {label}")

    for e in errors:
        print("ERROR", e)
    for w in warns:
        print("WARN ", w)
    print(f"{src_path.name}: {len(errors)} error(s), {len(warns)} warning(s)")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main(int(sys.argv[1])))
