# 네이버 강의 글 만들기 (2강 이후)

1강 매거진판(2026-11-11)을 만들며 확정한 절차입니다. 강의 하나를 `원고 → 검사 → 썸네일 → 편집기 채우기 → 확인 → 발행 → 기록` 순서로 끝내고 다음 강의로 넘어갑니다. 발행은 강의마다 사용자 승인을 받은 뒤에만 합니다.

진행 상황과 강의별 결정값은 [`lessons-plan.json`](lessons-plan.json)에 둡니다.

## 0. 준비

- `blog/tools/fonts/`에 마루부리 `MaruBuri-Regular/SemiBold/Bold.ttf` (저장소에 올리지 않음). 없으면 `https://hangeul.pstatic.net/hangeul_static/webfont/MaruBuri/MaruBuri-Bold.ttf` 등에서 받습니다.
- Pretendard 글꼴 (`%LOCALAPPDATA%/Microsoft/Windows/Fonts`), Python Pillow, ego-browser(네이버 로그인 상태).
- ego-browser 창이 최소화되어 있으면 스크린샷이 실패합니다. 편집 작업은 최소화 상태에서도 됩니다.

## 1. 원고 쓰기: `blog/lesson-XX-summary.html`

`blog/lesson-01-summary.html`을 형식 기준으로 삼습니다. 맨 위 주석에 `title:` 줄을 둡니다.

내용 규칙
- 사실, 수치, 예문, 연도는 `lessons/*/lesson-XX.md`(원문 편집본)와 `sources/lesson-XX.txt`에 있는 것만 씁니다. 새 주장을 만들지 않습니다.
- **글 제목**에 `ChatGPT`가 들어갑니다(검색 유입). 원문 제목에 없으면 뜻을 바꾸지 않는 선에서 붙입니다.
- **핵심 문장**: 원문이 직접 지목한 문장("가장 중요한 원리", "한 문장으로 정리하면" 등)을 그대로 쓰거나 줄이기만 합니다. 표시가 없으면 원문 문장 중에서 고르고, 고른 위치를 `PROVENANCE.md`에 남깁니다. 앞에 "기억할 것" 같은 표지를 붙이지 않고 따옴표 인용구 하나로 둡니다.
- 보고서·숙제 말투 금지: "핵심 정리", "정리하면", "세 가지 확인" 같은 표지를 쓰지 않고 마무리도 문장으로 닫습니다. em dash, 화살표, 장식용 굵은 글씨를 쓰지 않습니다(antislop).
- 소제목은 번호 없이, 마루부리 19px 기준 **320px 이하**(360px 휴대폰에서 한 줄). 본문 문장 중간에 줄바꿈을 넣지 않습니다.
- 예문은 버티컬 라인 인용구(`data-quote="line"`)로 둡니다.
- 마지막은 참고 자료 링크(원문에 있는 것만, 추적 매개변수 제거), 썸네일. GitHub 링크는 지금 달지 않습니다. 강의별 github.io 학습 페이지를 다 만든 뒤 한꺼번에 넣습니다(`lessons-plan.json`의 `decisions.closing_link`). 그전까지 2강부터는 글 끝에 외부 강의 링크 없이 출처 안내 한 줄과 썸네일만 둡니다.

이미지
- 원문 대화 전체는 `sources/conversation/chatgpt-thinking-공유대화-원본.md`(1~30강, 공유 링크 데이터에서 추출)에 있습니다. 답변 안의 `<box>`, `<text>` 등은 원래 화면의 레이아웃 표기입니다.
- 원문 도식 SVG는 `sources/conversation/assets/`에 있습니다(1·2·3·9강). 이 중 `{a.t}`, `{p.name}`처럼 중괄호가 들어 있는 파일은 화면에서 값이 채워져야 완성되는 틀이라 그대로 쓸 수 없습니다. 쓰려면 공유 페이지에서 렌더링된 그림을 가져오고(1강 `lesson-01-attention.svg` 방식), 중괄호가 없는 파일(3강 `svg-04`)은 그대로 씁니다. 블로그에는 어두운 배경 PNG로 만들고 원본 도식임을 캡션에 밝힙니다.
- 원문에 없는 그림은 새로 만들지 않습니다. 썸네일만 예외입니다.

## 2. 검사

```sh
python blog/tools/lint_manuscript.py 2
```

ERROR가 없어야 다음 단계로 갑니다. WARN(원문에 없는 수치, 보고서 표지)은 직접 확인합니다. 텍스트판은 HTML에서 다시 만듭니다(`blog/naver-summary-XX.txt`).

## 3. 썸네일

```sh
python blog/tools/thumbnail.py 2 "ChatGPT는 어떻게" "숫자로 의미를" "표현할까?" --pretendard "$LOCALAPPDATA/Microsoft/Windows/Fonts" --out blog/assets/thumb-lesson-02.png
```

제목 줄은 직접 나눕니다. 제목이 길어 큰 번호와 겹치면 스크립트가 멈춥니다. 원고의 마지막 이미지로 `data-rep data-small`을 붙여 넣습니다.

## 4. 편집기 채우기 (발행하지 않음)

새 글은 글쓰기 화면, 이미 있는 글은 `PostUpdateForm.naver?blogId=ajitta&logNo=<번호>`를 ego-browser로 연 뒤:

```js
const { buildDraft } = await import("file:///C:/Users/ajitta/Repos/ajitta/chatgpt-thinking-course/blog/tools/naver/build-draft.mjs");
const report = await buildDraft(page, { repo: "C:/Users/ajitta/Repos/ajitta/chatgpt-thinking-course", manuscript: "blog/lesson-02-summary.html" });
console.log(report); // ok: true 여야 함 (제목, 본문 diff [], 서식 style [], 대표 이미지 = 썸네일)
```

뷰포트를 1280×900으로 고정한 상태에서 실행합니다(약 2분 30초). `ok`가 false면 발행하지 않습니다. `style`은 문단별 굵게·마루부리·가운데 정렬·소제목 19px을 원고와 비교한 결과입니다. 버리고 다시 하려면 페이지를 다시 열고 나가기 확인 창을 수락하면 됩니다(저장되지 않음).

## 5. 사용자 확인과 발행

편집기 화면을 캡처해 보여 주고 승인을 받습니다. 승인 후:

```js
const { publish } = await import("file:///.../blog/tools/naver/publish.mjs");
await publish(page, { category: "AI 기본원리", categoryNo: 7, topic: "IT·컴퓨터_30" });   // 새 글은 기본이 낙서장·주제 없음. 다르면 멈춤
```

새 글 쓰기 주소는 `https://blog.naver.com/PostWriteForm.naver?blogId=ajitta`입니다. 카테고리 번호(`categoryNo`)와 주제는 `lessons-plan.json`에 있습니다. 5강, 13강처럼 새 카테고리가 필요하면 블로그 관리에서 먼저 만들고 번호를 기록합니다.

## 6. 발행 후 확인과 기록

- `m.blog.naver.com/ajitta/<번호>`를 360px, 412px로 열어 소제목 한 줄, 가로 넘침 없음, 이미지·링크·인용구 수를 확인하고 캡처합니다.
- `VALIDATION.md`(확인한 것과 못 한 것), `PROVENANCE.md`(핵심 문장 위치, 새로 만든 이미지), `blog/README.md`, `lessons-plan.json`의 `status`와 `logNo`를 갱신합니다.

## 편집기에서 알게 된 제약 (2026-11 기준)

- 본문은 `word-break: break-word`로 음절 단위 줄바꿈이 됩니다. 글에서 바꿀 수 없어 본문을 양끝 정렬합니다.
- 글자 크기 메뉴는 11/13/15/16/19/24/28px뿐입니다. 붙여 넣은 21px은 19px로 바뀝니다.
- 붙여 넣은 `<b>`는 뒤따르는 모든 문단으로 번집니다(1강 첫 발행본이 전부 굵게 나갔음). 굵게는 붙여 넣지 않고 붙여 넣은 뒤 전체 해제 후 지정한 문단만 적용합니다.
- 붙여 넣은 서체는 사라집니다. 마루부리는 문단을 마우스로 선택한 뒤 서체 메뉴로 지정합니다.
- 인용구 안에서는 서체를 바꿀 수 없습니다(버티컬 라인은 나눔바른고딕이라 가늘어 보여 굵게 처리).
- 대표 사진은 본문 안 이미지 중에서만 고를 수 있습니다. 그래서 썸네일을 글 맨 끝에 작게 둡니다.
- HTML 작성, iframe, 스크립트는 지원하지 않습니다. 실습은 웹 페이지로 연결합니다.
