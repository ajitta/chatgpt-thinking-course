# 네이버 블로그 작업 현황 (새 세션 시작점)

마지막 갱신: 2026-11-12. 새 세션은 이 문서, [`PLAYBOOK.md`](PLAYBOOK.md), [`lessons-plan.json`](lessons-plan.json) 순서로 읽고 시작합니다.

## 지금 상태

| 강의 | 상태 | 카테고리 |
|---|---|---|
| 1~4강 | 발행 | `ChatGPT Thinking` 아래 AI 기본원리(카테고리 번호 7) |
| 5~12강 | 발행 | `ChatGPT Thinking` 아래 AI 활용과 업무 시스템(카테고리 번호 8) |
| 13~20강 | 발행 | `ChatGPT Thinking` 아래 사람의 사고와 불확실한 판단(카테고리 번호 9) |
| 21~30강 | 미작성 | `lessons-plan.json`에 아직 항목 없음 |

글 주소는 [`blog/README.md`](README.md)의 표, 루트 [`README.md`](../README.md)의 '네이버 글' 칸, `lessons-plan.json`의 `logNo`에 있습니다. 2026-11-11에 한 일:

- 2강 글 끝의 GitHub 링크를 지우고 재발행했습니다.
- 3~20강을 발행했습니다. 기본 원고는 공유 대화 원본이고, 원고마다 맨 위 주석에 핵심·마무리 문장의 행 번호가 있습니다.
- impeccable 평가(critique, 2강 발행본 기준 21/32점)를 받아 휴대폰 길이 규칙을 정했습니다. 1·2·3강 도식 PNG는 휴대폰에서 읽히는 크기로 다시 만들고, 1·2강은 그 PNG로 재발행했습니다. 3강은 새 PNG로 처음 발행했습니다.
- 5강은 마무리 문장이, 12강은 마무리 문장과 소제목 하나가 발행 후 360px에서 줄이 늘어(마무리 세 줄, 소제목 두 줄) 고친 뒤 재발행했습니다.

## 다음에 할 일

1. **GitHub 페이지 브랜치 병합 후 20편 일괄 재발행**(2026-11-12 사용자 결정). 브랜치 `ajitta/github-pages-lessons-1`에 강의별 웹 강의(`docs/lessons/01/`~`20/`)가 있습니다. 병합 뒤 한 번에 처리할 것:
   - 각 글 끝에 해당 웹 강의 링크 `https://ajitta.github.io/chatgpt-thinking-course/lessons/NN/` 한 줄. 1강의 실습 링크는 `lessons/01/`로 바꿉니다(`decisions.closing_link`).
   - 글 끝에 네이버 "이전 글" 링크 한 줄(2강부터).
   - 소제목 다음 빈 줄을 없애 소제목을 자기 절에 붙이기(h2 다음 첫 본문 문단에 `data-tight`). 먼저 한 강의를 편집기에 채워 캡처로 간격을 확인한 뒤 나머지에 적용합니다.
   - 1·2강 원고는 휴대폰 길이 규칙에 맞춰 이미 고쳤습니다(1강 마무리 문장 '는' 덜어 냄, 2강 리드·본문 두 문단 나눔과 마무리 문장 교체). 발행본에는 이 재발행 때 반영됩니다.
   - 병합 때 충돌 예상 파일: `AGENTS.md`, `PROVENANCE.md`, `README.md`, `VALIDATION.md`, `blog/PLAYBOOK.md`, `blog/README.md`, `blog/STATUS.md`, `blog/lessons-plan.json`, `blog/tools/lint_manuscript.py`, `.claude/skills/naver-lesson/SKILL.md`(양쪽에서 고침).
2. **21~30강**: 사용자가 원하면 먼저 `lessons-plan.json`에 21~30강 항목과 카테고리(4부, 5부)를 정합니다. 카테고리 이름은 사용자에게 묻습니다.
3. **정한 것**(2026-11-12): 끝 썸네일은 지금처럼 글 끝에 둡니다(휴대폰에서 전체 폭으로 보이는 것은 플랫폼 제약). 긴 강의는 나누지 않는 것을 추천했습니다(강의 하나 = 네이버 글 하나 = 웹 강의 페이지 하나). 사용자 확인을 기다립니다.
4. **남은 질문**: 핵심 인용구의 기울임을 끌 수 있는지 편집기에서 확인하지 않았습니다.
5. **확인 못 한 것**: 네이버 모바일 앱 화면은 확인하지 않았습니다. 발행본 도식을 휴대폰 화면 캡처로 확인하지 못했습니다(아래 환경 메모 참고).

## 강의 하나를 만드는 흐름 (요약)

원고 작성과 승인 → `python blog/tools/lint_manuscript.py N`(ERROR 0, 휴대폰 길이 WARN은 고침. 마무리 문장 폭 경고만 발행 후 줄 수로 판단) → `python blog/tools/summary_text.py N` → `python blog/tools/thumbnail.py N "줄1" "줄2" "줄3" --pretendard "C:/Users/ajitta/AppData/Local/Microsoft/Windows/Fonts" --out blog/assets/thumb-lesson-NN.png` → ego-browser로 `PostWriteForm.naver?blogId=ajitta` 열고 `buildDraft`(`ok: true` 필수) → `publish(page, { category, categoryNo, topic })` → 다른 페이지에서 `checkLive`(360/412px, `ok: true`) → 기록. 자세한 규칙은 `PLAYBOOK.md`.

## 사용자와 합의한 작업 방식

- 글: 매거진형. 보고서·숙제 말투 금지(표지 없이 문장으로), 원문에 있는 사실만, 핵심 문장은 원문 문장 그대로 맨 앞 따옴표 인용, 글 제목에 ChatGPT. 기본 원고는 공유 대화 원본.
- 디자인: 마루부리(리드·소제목·마무리), 나눔고딕 본문 19px 양끝 정렬, 소제목 한 줄, 예문은 버티컬 라인 인용구(굵게), 구분선, 썸네일은 글 끝 + 대표 이미지. 휴대폰 길이: 본문 문단 160자, 리드 130자, 예문 60자, 마무리 문장 두 줄 이하.
- 이미지: 원문 도식만 씁니다. 대화 원본의 사진은 원 출처와 이용 조건을 확인할 수 있을 때만 씁니다.
- 결정은 사용자에게 묻고, 추천안을 함께 제시합니다. "너의 추천대로"는 제시한 추천안 승인입니다.
- 발행은 강의마다 승인을 받은 뒤에만 합니다. 발행 전 편집기 캡처, 발행 후 휴대폰 너비 확인을 합니다. 3~20강은 한 번의 예외로, 사용자가 "20강 전체를 발행해"로 한꺼번에 승인했고 `buildDraft` `ok: true`와 발행 후 `checkLive` `ok: true`를 조건으로 진행했습니다.
- 커밋·푸시는 사용자가 말할 때 합니다.

## 환경 메모

- ego-browser 창이 최소화되거나 다른 탭이 앞에 있으면 스크린샷이 시간 초과로 실패합니다(편집과 검사는 됨). 캡처가 필요하면 사용자에게 창 복원을 부탁합니다.
- 사용자가 ego-browser 창을 직접 조작하면 작업 공간 제어권이 사용자에게 넘어가 명령이 멈춥니다. 사용자에게 물은 뒤 `takeOverTaskSpace`로 이어 갑니다.
- 뷰포트 설정(`Emulation.setDeviceMetricsOverride`)은 실행마다 사라지므로 매번 다시 겁니다.
- 휴대폰(m.blog)에서는 편집기 19px이 20px로 그려집니다. 소제목 폭은 20px 기준 316px 이하여야 한 줄입니다(lint가 이 기준).
- ChatGPT 공유 링크는 로그인해야 열립니다(로그인은 사용자가 직접).
- 마루부리 글꼴은 `blog/tools/fonts/`(저장소에 올리지 않음).
