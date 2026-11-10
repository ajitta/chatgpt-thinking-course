# Know Your Unknowns · ChatGPT Thinking 원리 이해하기

비전공자를 위한 한국어 1–30강. AI가 답을 만드는 원리에서 시작해, AI 업무 시스템·판단·실행·학습·창의성까지 사례와 실습으로 연결합니다.

**30강 모두 공개 대화에서 본문을 확보했습니다.** 강의별 Markdown은 읽기 위한 정적 편집본이며, 새로 재구성한 강의는 없습니다. 원문의 대화형 실행·이미지·모든 선택 상태까지 복제한 자료는 아닙니다. 10강과 11강은 대화 중 수정되어 뒤에 나온 완결본을 선택했습니다. [출처와 편집 기준](PROVENANCE.md)을 먼저 확인해 주세요.

## 무엇으로 읽을까요?

- **기준 형식: Markdown.** GitHub에서 바로 읽고, 강의별 수정 이력을 비교하고, 다른 형식으로 옮기기 쉽습니다. `lessons/`에 강의마다 파일 하나를 둡니다.
- **네이버 블로그용: 일반 텍스트.** `blog/lesson-01.txt`부터 `lesson-30.txt`까지 한 강의씩 복사해 사용할 수 있습니다. 블로그 편집기에서 제목·단락·표를 다듬어 주세요.
- **1강 대화형 실습: [빈칸 선택과 이해도 퀴즈](https://ajitta.github.io/chatgpt-thinking-course/).** 원문의 두 문제를 웹에서 작동하도록 다시 구현한 보조 자료입니다. 2–30강의 대화형 페이지는 아직 없습니다.
- **네이버 블로그: [1강 공개 글](https://blog.naver.com/ajitta/224472328521).** 실습 페이지 링크를 포함한 첫 게시본입니다. 2–30강은 블로그에 게시하지 않았습니다.
- 나머지 강의의 HTML 학습 사이트와 실습은 필요할 때 Markdown을 기준으로 확장할 수 있습니다.

## 학습 방법

선수 지식은 필요하지 않습니다. 1강부터 순서대로 읽거나 목차에서 필요한 강의를 선택하세요. 실습은 먼저 스스로 답한 뒤 설명과 비교하고, 가상의 수치와 실제 관측을 구분해 기록하세요. 화면에 있던 버튼 이름은 정적 자료에서는 동작하지 않습니다.

## 전체 목차

아래 부 구분은 GitHub 정리를 위해 새로 붙인 편집 분류입니다. 강의 번호와 제목은 원문에서 가져왔습니다. 모든 행의 상태는 **원문 기반 정적 편집**입니다.

### AI Thinking의 기본 원리

| 강의 | 제목 | 블로그용 파일 |
|---|---|---|
| 01 | ['다음 단어 맞히기'가 어떻게 '논리적 사고'가 되었을까?](lessons/01-ai-fundamentals/lesson-01.md) | [텍스트](blog/lesson-01.txt) |
| 02 | [ChatGPT는 어떻게 숫자로 '의미'를 표현할까?](lessons/01-ai-fundamentals/lesson-02.md) | [텍스트](blog/lesson-02.txt) |
| 03 | [ChatGPT는 정말 '이해'하고 '생각'하는 걸까?](lessons/01-ai-fundamentals/lesson-03.md) | [텍스트](blog/lesson-03.txt) |
| 04 | [ChatGPT는 왜 자신 있게 틀린 답을 할까?](lessons/01-ai-fundamentals/lesson-04.md) | [텍스트](blog/lesson-04.txt) |

### AI 활용과 업무 시스템

| 강의 | 제목 | 블로그용 파일 |
|---|---|---|
| 05 | [ChatGPT를 제대로 활용하는 4가지 방법](lessons/02-ai-workflows/lesson-05.md) | [텍스트](blog/lesson-05.txt) |
| 06 | [원하는 답을 얻는 프롬프트 설계법](lessons/02-ai-workflows/lesson-06.md) | [텍스트](blog/lesson-06.txt) |
| 07 | [AI에게 일을 잘 위임하는 방법](lessons/02-ai-workflows/lesson-07.md) | [텍스트](blog/lesson-07.txt) |
| 08 | [AI 에이전트는 어떻게 스스로 일을 수행할까?](lessons/02-ai-workflows/lesson-08.md) | [텍스트](blog/lesson-08.txt) |
| 09 | [AI 여러 명이 팀을 이루면 무슨 일이 일어날까?](lessons/02-ai-workflows/lesson-09.md) | [텍스트](blog/lesson-09.txt) |
| 10 | [나만의 AI 업무 시스템 설계하기](lessons/02-ai-workflows/lesson-10.md) | [텍스트](blog/lesson-10.txt) |
| 11 | [AI 업무 시스템의 성과·비용·오류 관리](lessons/02-ai-workflows/lesson-11.md) | [텍스트](blog/lesson-11.txt) |
| 12 | [AI 업무 시스템을 안전하고 안정적으로 운영하는 방법](lessons/02-ai-workflows/lesson-12.md) | [텍스트](blog/lesson-12.txt) |

### 사람의 사고와 불확실한 판단

| 강의 | 제목 | 블로그용 파일 |
|---|---|---|
| 13 | [AI 시대, 사람의 역할은 어떻게 달라질까?](lessons/03-judgment-and-decisions/lesson-13.md) | [텍스트](blog/lesson-13.txt) |
| 14 | [AI를 활용하면서도 내 사고력을 키우는 방법](lessons/03-judgment-and-decisions/lesson-14.md) | [텍스트](blog/lesson-14.txt) |
| 15 | [AI 시대의 증거 기반 판단과 불확실성 다루기](lessons/03-judgment-and-decisions/lesson-15.md) | [텍스트](blog/lesson-15.txt) |
| 16 | [AI의 확신은 얼마나 믿을 수 있을까?](lessons/03-judgment-and-decisions/lesson-16.md) | [텍스트](blog/lesson-16.txt) |
| 17 | [실패를 미리 찾아내는 프리모텀과 레드팀](lessons/03-judgment-and-decisions/lesson-17.md) | [텍스트](blog/lesson-17.txt) |
| 18 | [예측할 수 없는 위험과 회복탄력성](lessons/03-judgment-and-decisions/lesson-18.md) | [텍스트](blog/lesson-18.txt) |
| 19 | [불확실할수록 작게 결정하고 빠르게 배우는 방법](lessons/03-judgment-and-decisions/lesson-19.md) | [텍스트](blog/lesson-19.txt) |
| 20 | [나만의 AI 의사결정 운영체계 만들기](lessons/03-judgment-and-decisions/lesson-20.md) | [텍스트](blog/lesson-20.txt) |

### 실행·학습·장기 성장

| 강의 | 제목 | 블로그용 파일 |
|---|---|---|
| 21 | [좋은 판단을 습관으로 만드는 방법](lessons/04-learning-and-growth/lesson-21.md) | [텍스트](blog/lesson-21.txt) |
| 22 | [시간과 관심을 어디에 투자할까?](lessons/04-learning-and-growth/lesson-22.md) | [텍스트](blog/lesson-22.txt) |
| 23 | [중요한 것부터 선택하고 집중하는 방법](lessons/04-learning-and-growth/lesson-23.md) | [텍스트](blog/lesson-23.txt) |
| 24 | [목표를 실행으로 바꾸는 시스템 설계](lessons/04-learning-and-growth/lesson-24.md) | [텍스트](blog/lesson-24.txt) |
| 25 | [오래 지속할 수 있는 실행 시스템 만들기](lessons/04-learning-and-growth/lesson-25.md) | [텍스트](blog/lesson-25.txt) |
| 26 | [실패한 뒤 다시 시작하는 방법](lessons/04-learning-and-growth/lesson-26.md) | [텍스트](blog/lesson-26.txt) |
| 27 | [경험을 실력으로 바꾸는 메타인지와 학습 전이](lessons/04-learning-and-growth/lesson-27.md) | [텍스트](blog/lesson-27.txt) |
| 28 | [AI 시대의 전문성 설계와 의도적 연습](lessons/04-learning-and-growth/lesson-28.md) | [텍스트](blog/lesson-28.txt) |

### 창의성과 실제 가치 만들기

| 강의 | 제목 | 블로그용 파일 |
|---|---|---|
| 29 | [AI 시대의 창의성과 문제 재정의](lessons/05-creativity-and-products/lesson-29.md) | [텍스트](blog/lesson-29.txt) |
| 30 | [아이디어를 실제 가치로 만드는 프로토타입과 실험](lessons/05-creativity-and-products/lesson-30.md) | [텍스트](blog/lesson-30.txt) |

## 파일 구성

`README.md`는 목차, `lessons/`는 기준 강의 파일, `blog/`는 블로그용 복사본, `sources/`는 수집 시점의 텍스트와 출처 기록, `docs/`는 1강 실습 페이지입니다.

내용을 고칠 때는 원문과 편집 내용을 구분해 기록하고 블로그용 파일에도 반영해 주세요. 원문에 소개된 31강, 통합 시험, 후속 실습 버튼은 이 1–30강 저장소의 제공 범위에 포함되지 않습니다.

원문: [문제 정의 시작 · 공개 대화](https://chatgpt.com/share/6af33303-9c00-83e8-a5b8-bb134c40db5c). 이 자료는 공식 OpenAI 교육과정이 아닙니다. 외부 참고 자료의 권리는 해당 저작자에게 있으며 저장소에 별도 재사용 라이선스를 지정하지 않았습니다.
