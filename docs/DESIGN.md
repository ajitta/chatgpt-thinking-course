---
name: Know Your Unknowns · ChatGPT Thinking 원리 이해하기
description: 공개 ChatGPT 대화의 1–20강을 원문 그대로 읽고 실습하는 정적 학습 사이트
colors:
  paper: "#faf9f5"
  ink: "#182720"
  muted: "#48564d"
  faint: "#5f6d63"
  accent: "#216044"
  accent-strong: "#16442f"
  accent-tint: "#e7f0e8"
  line: "#758477"
  rule: "#d4dbd3"
  rule-strong: "#b9c3b9"
  bg-1: "#ffffff"
  bg-2: "#f0f2ec"
  bg-3: "#e1e7df"
  success: "#1d6a3e"
  danger: "#a3352b"
  danger-tint: "#f7e9e6"
  danger-fill: "#c25e4f"
  warning: "#7a5200"
  warning-tint: "#f6eedb"
  warning-fill: "#b9852f"
  diagram: "#8b978e"
  diagram-light: "#bcc7be"
  focus: "#805700"
typography:
  display:
    fontFamily: "system-ui, -apple-system, \"Apple SD Gothic Neo\", \"Malgun Gothic\", \"Noto Sans KR\", sans-serif"
    fontSize: "clamp(32px, 3.4vw, 44px)"
    fontWeight: 750
    lineHeight: 1.3
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "system-ui, -apple-system, \"Apple SD Gothic Neo\", \"Malgun Gothic\", \"Noto Sans KR\", sans-serif"
    fontSize: "clamp(29px, 3.6vw, 42px)"
    fontWeight: 750
    lineHeight: 1.32
    letterSpacing: "-0.035em"
  title-section:
    fontFamily: "system-ui, -apple-system, \"Apple SD Gothic Neo\", \"Malgun Gothic\", \"Noto Sans KR\", sans-serif"
    fontSize: "27px"
    fontWeight: 750
    lineHeight: 1.45
    letterSpacing: "-0.03em"
  title-unit:
    fontFamily: "system-ui, -apple-system, \"Apple SD Gothic Neo\", \"Malgun Gothic\", \"Noto Sans KR\", sans-serif"
    fontSize: "25px"
    fontWeight: 750
    lineHeight: 1.4
    letterSpacing: "-0.03em"
  title-sub:
    fontFamily: "system-ui, -apple-system, \"Apple SD Gothic Neo\", \"Malgun Gothic\", \"Noto Sans KR\", sans-serif"
    fontSize: "21px"
    fontWeight: 700
    lineHeight: 1.55
    letterSpacing: "-0.02em"
  body:
    fontFamily: "system-ui, -apple-system, \"Apple SD Gothic Neo\", \"Malgun Gothic\", \"Noto Sans KR\", sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.85
  body-sm:
    fontFamily: "system-ui, -apple-system, \"Apple SD Gothic Neo\", \"Malgun Gothic\", \"Noto Sans KR\", sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "system-ui, -apple-system, \"Apple SD Gothic Neo\", \"Malgun Gothic\", \"Noto Sans KR\", sans-serif"
    fontSize: "15px"
    fontWeight: 650
    lineHeight: 1.5
  caption:
    fontFamily: "system-ui, -apple-system, \"Apple SD Gothic Neo\", \"Malgun Gothic\", \"Noto Sans KR\", sans-serif"
    fontSize: "14.5px"
    fontWeight: 400
    lineHeight: 1.7
  number:
    fontFamily: "system-ui, -apple-system, \"Apple SD Gothic Neo\", \"Malgun Gothic\", \"Noto Sans KR\", sans-serif"
    fontWeight: 750
    fontFeature: "\"tnum\" 1"
rounded:
  sm: "3px"
  md: "5px"
  lg: "7px"
  xl: "9px"
  full: "999px"
spacing:
  gu: "6px"
  pu: "6px"
  pu-phone: "5px"
  flow: "18px"
  block: "28px"
  unit-gap: "48px"
  section: "64px"
  column-gap: "56px"
  home-gap: "80px"
  gutter: "32px"
  gutter-phone: "20px"
  measure: "720px"
components:
  button-solid:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.bg-1}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "9px 18px"
    height: "46px"
  button-solid-hover:
    backgroundColor: "{colors.accent-strong}"
  button-outline:
    backgroundColor: "{colors.bg-1}"
    textColor: "{colors.accent}"
    rounded: "{rounded.md}"
    padding: "9px 18px"
    height: "46px"
  button-outline-hover:
    backgroundColor: "{colors.accent-tint}"
  button-quiet:
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "9px 18px"
    height: "46px"
  button-disabled:
    backgroundColor: "{colors.bg-2}"
    textColor: "{colors.faint}"
  choice:
    backgroundColor: "{colors.bg-1}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "11px 14px"
  choice-checked:
    backgroundColor: "{colors.accent-tint}"
  field:
    backgroundColor: "{colors.bg-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
  badge:
    backgroundColor: "{colors.bg-3}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
  badge-info:
    backgroundColor: "{colors.accent-tint}"
    textColor: "{colors.accent-strong}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
  box-bordered:
    backgroundColor: "{colors.bg-1}"
    rounded: "{rounded.lg}"
  pager-link:
    backgroundColor: "{colors.bg-1}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "18px 20px"
  pager-link-hover:
    backgroundColor: "{colors.accent-tint}"
  unit-row:
    textColor: "{colors.ink}"
    padding: "14px 8px 14px 0"
  unit-row-hover:
    backgroundColor: "{colors.accent-tint}"
---

# Design System: Know Your Unknowns · ChatGPT Thinking 원리 이해하기

## Overview

**Creative North Star: "교과서의 단원 페이지"**

비전공자가 읽고 답을 고르는 학습지입니다. ENERGY 1 / RHYTHM 2 / MOTION 1. 과정 홈은 교과서의 단원 펼침면처럼 세 부(part)를 차례로 엽니다. 각 부는 2px 짙은 선 위에 부 이름과 강의 범위를 두고, 강의는 녹색 번호가 붙은 한 줄씩 이어집니다. 강의 페이지는 같은 종이 위에 원본 ChatGPT 강의 화면(문장, 도표, 실습)을 옮겨 놓은 틀이며, 틀은 원문보다 앞에 나서지 않습니다.

밝은 종이색, 짙은 본문색, 녹색 한 가지 강조색을 씁니다. 강조색은 강의 번호, 링크, 선택 상태, 실행 버튼을 구분합니다. 시스템 글꼴은 한글 가독성과 빠른 로딩을 위해 사용합니다. 장식 이미지, 추적 스크립트, 외부 글꼴, 외부 라이브러리, 계정 기능은 두지 않습니다. 아이콘은 사이트 안의 SVG 스프라이트(`docs/assets/icons.svg`, Lucide)에서 가져옵니다. 원문 이미지는 원래 주소에서 불러오며 원문이 아닌 것을 원문처럼 꾸미지 않습니다.

넓은 화면은 왼쪽 고정 목차(rail)와 읽기 열, 좁은 화면은 본문 위 목차와 한 열의 읽기 영역입니다. 라디오, 체크박스, 구간 선택, 슬라이더, 버튼은 모두 키보드로 조작합니다. 실습의 상태 변화(선택, 정답, 오답, 재시도)는 원문의 피드백 문장으로 화면에 나타나고 `#live-status`(`role="status"`)로 보조 기술에 전달합니다. 페이지는 사용자의 답, 입력, 진도를 저장하지 않습니다.

**Key Characteristics:**
- 종이 바탕, 짙은 녹흑색 글자, 녹색 강조색 하나
- 부의 시작을 알리는 2px 짙은 선이 유일한 굵은 선이자 정체성 표지
- 그림자 없는 평면, 1px 선과 옅은 면색으로 구획
- 번호는 녹색 고정폭 숫자(tabular)
- 한국어는 어절 단위 줄바꿈(`word-break: keep-all`)
- 모션은 색 전환 수준이며 움직임 줄이기 설정을 따름

## Colors

녹색 기운이 도는 중성색 위에 짙은 숲색 강조 하나를 얹은 절제된 팔레트입니다.

### Primary
- **숲 녹색 (accent)**: 강의 번호, 링크, 선택된 선택지·구간의 테두리와 채움, 실행 버튼, 단계 번호 원, 차트의 강조 막대와 선. 종이 위 대비 7.07:1.
- **짙은 숲색 (accent-strong)**: 실행 버튼의 hover 채움, 정보 배지 글자.
- **연녹 면 (accent-tint)**: 선택된 선택지 바탕, 링크형 행과 이전/다음 카드의 hover 바탕, 원문 강조 상자(`bg-accent`).

### Neutral
- **종이 (paper)**: 페이지 바탕.
- **녹흑 잉크 (ink)**: 본문, 제목, 부 시작 선.
- **회녹 (muted)**: 보조 문구, 캡션, 범위 표기, 목차 링크. 종이 위 7.35:1.
- **옅은 회녹 (faint)**: 원문이 지정한 옅은 글자와 비활성 버튼 글자에만. 종이 위 5.17:1이므로 문단 길이의 보조 문구에는 쓰지 않고 muted를 씁니다.
- **선 회녹 (line)**: 입력 요소(선택지, 체크, 구간 선택, 입력란, quiet 버튼)의 테두리와 인용 왼쪽 선.
- **구분선 (rule)**: 1px 구분선, 표의 행 선, 단원 행 밑줄, 안쪽 상자 테두리.
- **진한 구분선 (rule-strong)**: 바깥 상자 테두리, 표 머리 밑줄, 이전/다음 카드 테두리.
- **면 (bg-1 / bg-2 / bg-3)**: 흰 면, 옅은 면, 한 단계 짙은 면. 원문의 `surface` / `surface-secondary` / `surface-tertiary`에 대응합니다.

### Status
- **success / danger / warning**: 원문 피드백의 정답·오류·주의 글자색. 각각의 `-tint`는 상자 바탕, `-fill`은 도표 안의 채움입니다.
- **도표 회녹 (diagram / diagram-light)**: 원문 도표의 중립 막대, 상자, 점선.
- **초점 황토 (focus)**: 모든 `:focus-visible` 외곽선. 녹색과 겹치지 않도록 강조색과 다른 색입니다.

### Named Rules
**The One Green Rule.** 강조색은 녹색 하나뿐입니다. 원문 강의의 파랑은 모두 accent로, 청회색은 diagram으로, 빨강·주황은 danger-fill·warning-fill로 옮깁니다. 이 대응은 `docs/assets/runtime.js`의 `COLORS` 표(원문 lessons 1–20의 모든 색 리터럴)와 `BACKGROUNDS` 표가 맡습니다. 새 원문 색이 나오면 표에 추가해 팔레트 토큰으로 보내고, 원문 색을 그대로 화면에 두지 않습니다.

**The Status Is Not Accent Rule.** 정답·오류·주의 색은 원문 피드백의 의미를 전할 때만 씁니다. 장식이나 강조에 빌려 쓰지 않습니다.

## Typography

**Display Font:** 시스템 한글 산세리프 (`system-ui, -apple-system, "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", sans-serif`)
**Body Font:** 같은 스택

**Character:** 한 가족의 굵기 차이(400 / 600 / 650 / 700 / 750)와 좁힌 자간으로 위계를 만듭니다. 제목은 750에 음수 자간, 본문은 넉넉한 행간 1.85입니다.

### Hierarchy
- **Display** (750, clamp 32–44px, 1.3): 과정 홈의 과정명, 홈의 유일한 h1.
- **Headline** (750, clamp 29–42px, 1.32): 강의 제목(강의 페이지의 h1).
- **Section title** (750, 27px / 휴대폰 24.5px, 1.45): 강의 본문의 h2. 위에 1px 구분선과 64px(휴대폰 52px) 간격.
- **Unit title** (750, 25px / 560px 이하 22px, 1.4): 과정 홈의 부 이름.
- **Sub title** (700, 21px / 휴대폰 19.5px, 1.55): 강의 본문의 h3.
- **Lesson row** (600, 19px / 560px 이하 17.5px, 1.55): 과정 홈의 강의 제목 행.
- **Body** (400, 18px / 860px 이하 17px, 1.85): 본문. 읽기 열 최대 폭 720px.
- **Body small** (400, 16px, 1.75): 표, 입력란, 버튼, 작은 원문 문구.
- **Label** (600–750, 15px, 1.5): 마스트헤드, 목차, 범위 표기.
- **Caption** (400, 14.5px, 1.7): 캡션, 콜로폰. 원문 크기 `s-2xs`(13px)와 배지(14px), 인용 출처 알약(12.5px)이 가장 작은 단계입니다.

원문 제목 크기(`u-title` t-md 18 / t-lg 20 / t-xl 24 / t-2xl 30px)는 원문 화면 안에서만 씁니다.

### Named Rules
**The Tabular Number Rule.** 강의 번호, 범위(1–4강), 위치(N / 20), 표와 차트의 숫자는 고정폭 숫자(`tabular-nums`)로 씁니다. 강의 번호는 녹색 750입니다.

**The No Eyebrow Rule.** 제목 위에 작은 머리글(eyebrow, kicker)을 두지 않습니다. 부의 이름과 범위는 제목 자체와 같은 줄(오른쪽 범위 표기)에 둡니다.

**The Keep-All Rule.** 본문은 `word-break: keep-all`, 제목은 `text-wrap: balance`, 문단은 `text-wrap: pretty`로 한국어 어절을 끊지 않습니다.

## Layout

- **과정 홈**: 데스크톱은 왼쪽 400px 소개 열(고정 위치, sticky)과 오른쪽 부 목록, 열 간격 80px. 860px 이하에서는 한 열이며 소개가 먼저 옵니다.
- **강의 페이지**: 236px 목차 + 최대 720px 읽기 열, 열 간격 56px, 전체 최대 폭 1200px, 좌우 여백 32px. 1080px 이하에서 목차 200px·간격 40px, 860px 이하에서 한 열(목차가 본문 위로, 좌우 여백 20px), 560px 이하에서 마스트헤드가 두 줄로 바뀌고 이전/다음 카드가 세로로 쌓입니다.
- **이전/다음, 콜로폰**: 강의 레이아웃과 같은 격자를 써서 읽기 열에 맞춰 놓입니다.
- **세로 리듬**: 본문 흐름 18px, 상자·표·도표·인용 앞뒤 28px, h2 앞 64px, 부와 부 사이 48px.
- **원문 UI 단위**: 원문의 간격·안쪽 여백은 단위 `--gu` / `--pu`(6px, 560px 이하 `--pu` 5px)에 원문 배수를 곱해 씁니다.
- **컨테이너 쿼리**: 읽기 열(`container: lesson`) 폭 600px 이하에서 3–6열 격자는 2열, 430px 이하에서 1열이 됩니다. 비교표처럼 열을 유지해야 하는 격자는 `.keep`으로 열을 지키고 간격과 안쪽 여백을 줄입니다. 330px 이하에서 상자 안쪽 여백을 4px 단위로 줄입니다.
- **차트**: 원문 차트는 화면에 보이는 폭으로 다시 그려서 휴대폰에서도 글자 크기를 유지합니다.

## Elevation & Depth

그림자로 띄우는 깊이는 없습니다. 깊이는 면색 단계(paper → bg-1 → bg-2 → bg-3)와 1px 선으로 만듭니다. `box-shadow`는 두 곳에서 inset 1px 선으로만 씁니다. 선택된 선택지의 테두리를 2px처럼 두껍게 보이게 할 때와 secondary 배지의 테두리입니다.

### Named Rules
**The Flat Paper Rule.** 모든 면은 종이 위에 평평하게 놓입니다. 떠 있는 카드, 흐린 그림자, 겹친 패널을 만들지 않습니다.

## Shapes

- **모서리 단계**: sm 3px, md 5px(버튼, 선택지, 입력란), lg 7px(이전/다음 카드, 원문 큰 상자), xl 9px(원문 이미지 틀). full(999px)은 배지와 인용 출처 알약 같은 알약형에만, 원형은 단계 번호 원에만 씁니다.
- **선 굵기**: 상자와 구분선의 테두리는 1px입니다. 2px는 부의 시작 선(홈의 단원, 강의 목차의 부 표시)에만 씁니다. 초점 외곽선은 3px입니다.
- **중첩 상자**: 테두리 있는 상자 안의 테두리 상자는 rule로 한 단계 옅게, 면색이 있는 안쪽 상자는 테두리를 지우고 면색만으로 구분합니다.

### Named Rules
**The Unit Opener Rule.** 2px 짙은 잉크 선은 부(part)를 여는 표지입니다. 과정 홈의 각 부와 강의 목차의 부 표시에만 쓰고, 다른 구획이나 상자에 쓰지 않습니다.

**The One Frame Rule.** 면색이 있는 상자가 테두리 있는 상자 안에 들어가면 두 번째 테두리를 그리지 않습니다.

## Components

### Buttons
- **Shape:** 5px 모서리, 최소 높이 46px(small 38px), 안쪽 여백 9px 18px, 16px 650.
- **Solid:** 녹색 채움에 흰 글자. hover는 accent-strong. 홈의 "1강부터 읽기"는 이 버튼의 큰 판(52px, 17px)이며 홈에서 유일한 solid 버튼입니다. 560px 이하에서는 전체 폭입니다.
- **Outline:** 흰 면, 녹색 테두리와 글자. hover는 accent-tint 바탕.
- **Quiet:** line 테두리, 잉크 글자.
- **Disabled:** bg-2 바탕, rule-strong 테두리, faint 글자, `not-allowed` 커서.
- **Press:** 누르는 동안 1px 아래로 내려갑니다. 움직임 줄이기 설정에서는 꺼집니다.
- **Clickable row (`u-press`):** 원문의 누를 수 있는 행. 평소 테두리는 투명하고 hover에 line 테두리가 나타납니다. 동작하지 않는 것은 버튼처럼 꾸미지 않습니다.

### Chips
- **Badge:** 알약형, bg-3 바탕, 14px 600. info는 accent-tint와 accent-strong, warning은 warning-tint와 warning, secondary는 투명 바탕에 inset 1px rule-strong 선.
- **Cite:** 원문 인용 출처의 알약. bg-2 바탕에 muted 12.5px, hover에 accent. github.com 출처는 이름만 두고 링크하지 않습니다.

### Cards / Containers
- **원문 상자 (`u-box`):** 원문이 지정한 테두리(1px rule-strong), 모서리(r-sm–r-xl), 면색(bg-1–3, accent, danger, warning)을 팔레트로 옮긴 것입니다. 그림자는 없습니다.
- **표:** 1px rule 행 선, 머리는 bg-2 바탕에 rule-strong 밑줄, 16px(상자 안 15px, 560px 이하 14.5px). 넘치면 가로 스크롤합니다.
- **이전/다음 카드:** 흰 면, 1px rule-strong, 7px 모서리, 18px 700 제목에 녹색 강의 번호와 22px 화살표. hover에 녹색 테두리와 accent-tint 바탕.

### Inputs / Fields
- **선택지·체크 (`u-choice`, `u-check`):** 흰 면, 1px line 테두리, 5px, 17px 글자(560px 이하 16px). 선택되면 녹색 테두리 + inset 1px 녹색 선 + accent-tint 바탕. 완료된 체크는 취소선과 muted.
- **구간 선택 (`u-seg`):** 1px line 테두리 안의 칸들. 선택된 칸은 녹색 채움에 흰 글자, hover는 bg-2.
- **슬라이더:** 브라우저 기본 range에 `accent-color`, 높이 28px, 아래에 13px muted 눈금.
- **입력란 (`u-field`):** 흰 면, 1px line, 5px, 16px. 초점에 녹색 테두리와 3px 초점 외곽선.
- **Focus:** 모든 요소에 3px focus 색 외곽선, 3px 떨어짐.

### Navigation
- **Masthead:** 아래 1px rule. 왼쪽은 녹색 브랜드와 과정명, 오른쪽은 이전·다음 링크와 "N강 / 20". 링크 hover는 accent-tint 바탕.
- **Rail:** 데스크톱에서 sticky. 맨 위에 2px 잉크 선과 부 이름, "범위 중 N번째". 이어서 이 강의 차례(왼쪽 1px 선, 현재 항목은 잉크 선과 650)와 접힌 전체 강의 목록(녹색 번호). 860px 이하에서는 본문 위에 놓이고 부 표시는 숨깁니다.
- **Pager:** 위의 이전/다음 카드. 처음과 끝에서는 목차로 돌아가는 카드가 그 자리를 채웁니다.

### Unit Opener (signature)
과정 홈의 부. 2px 잉크 선, 아래 16px에 부 이름(25px 750)과 오른쪽 끝의 범위(15px muted, tabular). 강의 행은 60px(560px 이하 48px) 번호 칸 + 제목, 행마다 1px rule 밑줄, hover에 accent-tint 바탕과 녹색 밑줄.

### Steps
번호 목록은 32px 녹색 원에 흰 고정폭 숫자, 원 사이를 1px rule-strong 세로선으로 잇습니다. 번호 없는 단계 목록은 12px 녹색 점입니다.

### Charts
원문 차트 데이터를 SVG로 다시 그립니다. 강조 계열은 accent 실선 2.5px, 두 번째 계열은 warning 점선, 격자는 rule, 눈금은 12px muted 고정폭 숫자. 범례는 차트 위에 둡니다.

### Motion
hover와 선택에서 바탕색·테두리색이 .15s ease-out으로 바뀌고, 목차 펼침 표시가 .2s로 회전하며, 버튼이 눌릴 때 1px 내려갑니다. 이 밖의 움직임은 없고 `prefers-reduced-motion: reduce`에서는 모두 끕니다.

## Do's and Don'ts

### Do:
- **Do** 원문의 모든 색을 `COLORS` 표로 팔레트 토큰에 대응시키세요(파랑 → accent, 청회색 → diagram, 빨강·주황 → danger-fill·warning-fill).
- **Do** 부를 열 때만 2px 잉크 선을 쓰고, 그 밖의 테두리와 구분선은 1px로 두세요.
- **Do** 테두리 있는 상자 안의 면색 상자는 테두리 없이 면색만으로 구분하세요.
- **Do** 강의 번호와 숫자는 녹색 또는 잉크의 고정폭 숫자로 쓰세요.
- **Do** 모서리는 3 / 5 / 7 / 9px 단계에서 고르고, 999px는 알약형 배지와 출처에만 쓰세요.
- **Do** 모든 조작 요소에 3px focus 외곽선을 보이고 키보드로 조작되게 하세요.
- **Do** 상태 변화는 원문 피드백 문장으로 보이고 `role="status"`로 전달하세요.
- **Do** 읽기 열의 격자는 컨테이너 쿼리로 줄이고, 열을 지켜야 하는 비교 격자에는 `.keep`을 붙이세요.
- **Do** 모션은 색 전환(.15s ease-out)에 머물게 하고 움직임 줄이기 설정을 따르세요.

### Don't:
- **Don't** 원문의 파랑이나 두 번째 강조색을 화면에 남기지 마세요.
- **Don't** 제목 위에 eyebrow나 kicker 같은 작은 머리글을 두지 마세요.
- **Don't** 그림자로 상자를 띄우지 마세요. inset 1px 선만 테두리 대용으로 씁니다.
- **Don't** 2px 잉크 선을 일반 구획, 카드, 강조에 쓰지 마세요.
- **Don't** faint를 문단 길이의 보조 문구에 쓰지 마세요(종이 위 5.17:1). 보조 문구는 muted입니다.
- **Don't** 외부 글꼴, 외부 라이브러리, 추적 스크립트, 계정 기능, 응답·진도 저장을 넣지 마세요.
- **Don't** 원문의 "ChatGPT에 이어서 묻기" 버튼을 싣거나, 동작하지 않는 것을 버튼처럼 꾸미지 마세요.
- **Don't** 장식 이미지를 넣거나 원문이 아닌 그림을 원문처럼 보이게 하지 마세요.
