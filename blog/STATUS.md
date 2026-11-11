# 네이버 블로그 작업 현황 (새 세션 시작점)

마지막 갱신: 2026-11-11. 새 세션은 이 문서, [`PLAYBOOK.md`](PLAYBOOK.md), [`lessons-plan.json`](lessons-plan.json) 순서로 읽고 시작합니다.

## 지금 상태

| 강의 | 상태 | 글 |
|---|---|---|
| 1강 | 발행(매거진판, 굵게 오류 수정 후 재발행) | https://blog.naver.com/ajitta/224472328521 |
| 2강 | 발행 | https://blog.naver.com/ajitta/224473420017 |
| 3~20강 | 미작성 | `lessons-plan.json`에 강의별 원문 경로, 카테고리, 원문 도식 목록 |

## 다음에 할 일

1. **2강 발행본의 GitHub 링크**: 발행본 끝에 "2강 원문 전체 읽기"(GitHub) 링크가 남아 있습니다. 원고에서는 지웠습니다. 발행본에서 지울지(재발행) 사용자 결정 대기.
2. **3강**: `naver-lesson` 스킬(또는 "3강 네이버 글 만들어")로 시작. 3강 원문 도식 `sources/conversation/assets/svg-04-lesson-03.svg`(고양이 삼단논법)는 완성본이라 그대로 쓸 수 있습니다.
3. **5강, 13강 전에**: 네이버 블로그 관리에서 `ChatGPT Thinking` 아래 카테고리 "AI 활용과 업무 시스템"(5~12강), "사람의 사고와 불확실한 판단"(13~20강)을 만들고 카테고리 번호를 `lessons-plan.json`의 `categoryNo`에 적습니다.
4. **웹 강의(1~20강)**: 만들었고 아직 공개 전입니다. 병합, 공개 확인, 네이버 1강 글 수정, 글마다 강의 링크 넣기는 아래 '웹 강의 이어서 할 일'을 따릅니다. GitHub(github.com) 링크는 계속 달지 않습니다(`lint_manuscript.py`가 막음).

## 웹 강의 이어서 할 일 (2026-11-11 기준)

1~20강 웹 강의와 코드·내용 리뷰 반영은 브랜치 `ajitta/github-pages-lessons-1`에 커밋해 푸시했습니다. `main`에는 아직 병합하지 않았으므로 사이트는 공개 전입니다. 주소는 과정 홈 `https://ajitta.github.io/chatgpt-thinking-course/`, 강의 `.../lessons/NN/`(NN은 01~20)입니다.

1. **병합**: 브랜치를 `main`에 병합합니다. 그동안 원래 작업 폴더(`main`)에서 네이버 3~6강 작업이 따로 진행됐으므로 `blog/STATUS.md`, `blog/PLAYBOOK.md`, `blog/lessons-plan.json`, `blog/README.md`, `blog/tools/lint_manuscript.py`, `.claude/skills/naver-lesson/SKILL.md`에서 충돌이 날 수 있습니다. 이 브랜치가 이 파일들에서 바꾼 것은 github.io 링크 규칙, 1강 링크 설명, 2강 발행 사실, 이 절뿐이니 양쪽 내용을 합칩니다.
2. **다시 빌드**: 병합 뒤 `node site/build.mjs`(20줄 출력)와 `node --check docs/assets/runtime.js`를 실행하고, `git status`에 생성 파일 차이가 없는지 봅니다.
3. **공개 확인**: `main`을 푸시해 GitHub Pages가 빌드되면 과정 홈과 1~20강이 열리는지, 실습이 동작하는지, 2·3강 원문 이미지가 보이는지 실제 휴대폰과 PC에서 확인하고 `VALIDATION.md`에 적습니다.
4. **네이버 1강 글 수정 (발행물이라 승인 필요)**: 공개한 날, 발행된 1강 글(https://blog.naver.com/ajitta/224472328521)의 "빈칸 문제와 조각 생성 시연은 1강 학습 페이지에서 직접 해 볼 수 있습니다."를 "빈칸 문제와 학습 확인 문제는 1강 학습 페이지에서 직접 풀어 볼 수 있습니다."로, 실습 링크를 `https://ajitta.github.io/chatgpt-thinking-course/lessons/01/`로 바꿉니다. 원고 `blog/lesson-01-summary.html`, `blog/naver-summary-01.txt`도 같이 고칩니다. 조각 생성 시연은 지운 옛 1강 페이지에만 있었습니다. 발행 전 편집기 캡처, 발행 후 360/412px 확인을 합니다.
5. **글마다 강의 링크**: 공개 뒤 발행된 글(2강부터) 끝에 해당 강의 주소 한 줄을 넣습니다(`PLAYBOOK.md`, `lessons-plan.json`의 `decisions.closing_link`). 새 글은 처음부터 넣습니다. 강의마다 따로 승인을 받습니다.
6. **사용자 결정 대기**:
   - 3강 '직접 실험해 보기' 판정 수정을 유지할지. 원문 그대로 두려면 `site/build.mjs`의 `CORRECTIONS`를 지우고 다시 빌드합니다.
   - 16강 GitHub 인용(scikit-learn 문서)을 링크할지. 링크하려면 `docs/assets/runtime.js`의 github.com 예외를 지웁니다.
   - 2·3강 원문 이미지 4장 중 Getty Images 출처 2장(믹싱 콘솔, 사과)을 계속 핫링크로 쓸지.
7. **나중에**: 21~30강 웹 강의는 `AGENTS.md`의 'Extending the site (lessons 21-30)' 절차를 따릅니다. 확인하지 못한 것은 실제 휴대폰 기기, 화면 낭독기, Safari·Firefox입니다(`VALIDATION.md` 범위).

## 강의 하나를 만드는 흐름 (요약)

원고 작성과 승인 → `python blog/tools/lint_manuscript.py N` → `python blog/tools/thumbnail.py N "줄1" "줄2" "줄3" --pretendard "C:/Users/ajitta/AppData/Local/Microsoft/Windows/Fonts" --out blog/assets/thumb-lesson-0N.png` → ego-browser로 `PostWriteForm.naver?blogId=ajitta` 열고 `buildDraft` (`ok: true` 필수) → 캡처 보여 주고 승인 → `publish(page, { category, categoryNo, topic })` → 360px/412px 발행본 확인 → 기록. 자세한 규칙은 `PLAYBOOK.md`.

## 사용자와 합의한 작업 방식

- 글: 매거진형. 보고서·숙제 말투 금지(표지 없이 문장으로), 원문에 있는 사실만, 핵심 문장은 원문 문장 그대로 맨 앞 따옴표 인용, 글 제목에 ChatGPT.
- 디자인: 마루부리(리드·소제목·마무리), 나눔고딕 본문 양끝 정렬, 소제목 19px 한 줄, 예문은 버티컬 라인 인용구(굵게), 구분선, 썸네일은 글 끝 작게 + 대표 이미지.
- 결정은 사용자에게 묻고, 추천안을 함께 제시합니다. "너의 추천대로"는 제시한 추천안 승인입니다.
- 발행은 강의마다 따로 승인을 받은 뒤에만 합니다. 발행 전 편집기 캡처, 발행 후 휴대폰 너비 캡처로 확인합니다.
- 커밋·푸시는 사용자가 말할 때 합니다.

## 환경 메모

- ego-browser 창이 최소화되면 스크린샷이 실패합니다(편집은 됨). 사용자에게 창 복원을 부탁합니다.
- 자동 모드 안전 장치가 네이버 발행을 한 번 막은 적이 있습니다. 사용자가 "너가 발행해"처럼 직접 지시하면 진행됐습니다.
- ChatGPT 공유 링크는 로그인해야 열립니다(로그인은 사용자가 직접).
- 마루부리 글꼴은 `blog/tools/fonts/`(저장소에 올리지 않음).
