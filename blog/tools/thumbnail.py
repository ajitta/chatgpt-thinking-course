"""Series thumbnail for the Naver blog posts (1080x1080 PNG).

Usage:
  python blog/tools/thumbnail.py 1 "ChatGPT는" "다음 단어만 맞히는데," "어떻게 추론까지 할까?" \
      --pretendard <dir with Pretendard-*.otf> \
      --out blog/assets/thumb-lesson-01.png

Title lines are passed as separate arguments so line breaks stay deliberate.
Fonts: MaruBuri (Naver, OFL) for the title and number, Pretendard (OFL) for labels.
"""
import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

DEEP = (32, 59, 48)      # site ink green, background
CREAM = (244, 241, 234)  # article paper, title
ACCENT = (33, 96, 68)    # site link green, lesson number
SOFT = (168, 201, 178)   # labels on the dark background
SIZE, MARGIN = 1080, 96


def build(num, lines, maru, pretendard, out):
    font = lambda d, name, s: ImageFont.truetype(str(Path(d) / name), s)
    im = Image.new("RGB", (SIZE, SIZE), DEEP)
    d = ImageDraw.Draw(im)
    d.text((MARGIN, MARGIN), "ChatGPT Thinking", font=font(pretendard, "Pretendard-Bold.otf", 44), fill=CREAM)
    d.text((MARGIN, MARGIN + 58), "원리 이해하기", font=font(pretendard, "Pretendard-Medium.otf", 34), fill=SOFT)

    size = 74
    while size > 48:
        tf = font(maru, "MaruBuri-Bold.ttf", size)
        if max(tf.getlength(t) for t in lines) <= SIZE - 2 * MARGIN:
            break
        size -= 2
    y = 290
    for t in lines:
        d.text((MARGIN, y), t, font=tf, fill=CREAM)
        y += int(size * 1.32)

    nf = font(maru, "MaruBuri-Bold.ttf", 400)
    anchor = (SIZE - MARGIN + 20, SIZE - MARGIN + 60)
    top = d.textbbox(anchor, f"{num:02d}", font=nf, anchor="rd")[1]
    if top < y:
        raise SystemExit(f"title ends at {y}px but the number starts at {top}px; shorten the title lines")
    d.text(anchor, f"{num:02d}", font=nf, fill=ACCENT, anchor="rd")
    d.text((MARGIN, SIZE - MARGIN), f"{num}강", font=font(pretendard, "Pretendard-SemiBold.otf", 40), fill=SOFT, anchor="ld")
    Path(out).parent.mkdir(parents=True, exist_ok=True)
    im.save(out)


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("num", type=int)
    p.add_argument("lines", nargs="+")
    # MaruBuri lives in blog/tools/fonts/ (git-ignored; download from hangeul.naver.com)
    p.add_argument("--maru", default=str(Path(__file__).parent / "fonts"))
    p.add_argument("--pretendard", required=True)
    p.add_argument("--out", required=True)
    a = p.parse_args()
    build(a.num, a.lines, a.maru, a.pretendard, a.out)
