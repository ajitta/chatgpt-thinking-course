"""Plain-text copy of a Naver magazine manuscript (blog/naver-summary-XX.txt).

Usage: python blog/tools/summary_text.py 3      (reads blog/lesson-03-summary.html)
Blocks are separated by a blank line: title, quotes in curly quotes, ─── for dividers,
[이미지: file] for images, and "label (url)" for link paragraphs.
"""
import html
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def text_of(fragment):
    return html.unescape(re.sub(r"<[^>]+>", "", fragment)).strip()


def build(n):
    src = (ROOT / f"blog/lesson-{n:02d}-summary.html").read_text(encoding="utf-8")
    title = re.search(r"title:\s*(.+)", src).group(1).strip()
    body = re.sub(r"<!--.*?-->", "", src, flags=re.S)
    out = [title]
    for m in re.finditer(r"<(p|h2|blockquote|hr)([^>]*)>(?:(.*?)</\1>)?", body, flags=re.S):
        tag, inner = m.group(1), m.group(3) or ""
        if tag == "hr":
            out.append("───")
        elif tag == "blockquote":
            out.append("“" + text_of(inner) + "”")
        elif (img := re.search(r'<img[^>]*src="([^"]+)"', inner)):
            out.append(f"[이미지: {img.group(1).split('/')[-1]}]")
        elif (a := re.search(r'<a href="([^"]+)"', inner)):
            out.append(f"{text_of(inner)} ({html.unescape(a.group(1))})")
        else:
            out.append(text_of(inner))
    return "\n\n".join(out) + "\n"


if __name__ == "__main__":
    n = int(sys.argv[1])
    (ROOT / f"blog/naver-summary-{n:02d}.txt").write_text(build(n), encoding="utf-8", newline="\n")
