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
4. **github.io 강의 페이지**: 1–20강 학습 페이지를 만들었습니다(2026-11-11, `docs/lessons/NN/`, `main`에 반영되면 공개). 주소는 `https://ajitta.github.io/chatgpt-thinking-course/lessons/NN/`(NN은 01~20)입니다. 공개된 뒤 각 네이버 글 끝에 해당 강의 링크를 한꺼번에 넣습니다. 루트 주소는 이제 1강이 아니라 과정 홈이라, 발행된 1강 글의 '1강 학습 페이지' 링크도 이때 `lessons/01/`로 바꿉니다. GitHub(github.com) 링크는 계속 달지 않습니다(`lint_manuscript.py`가 막음).

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
