// Course home: the three parts opened in turn like a textbook's unit pages,
// each lesson a numbered line into the original lesson page.

// From the course's first answer in the shared conversation (message 004 of the .md source).
const GOAL = "인공지능이나 컴퓨터를 전공하지 않았더라도, ChatGPT가 어떻게 답을 만들고, Thinking이 무엇을 다르게 하며, 왜 가끔 틀리는지 자기 말로 설명할 수 있게 되는 것입니다.";

export function homePage({ LESSONS, PARTS, head, esc, pad, SITE, COURSE, BRAND }) {
  const parts = PARTS.map((p, i) => {
    const rows = LESSONS.filter(L => L.n >= p.from && L.n <= p.to).map(L =>
      `<li><a href="lessons/${pad(L.n)}/"><span class="no">${L.n}강</span><span class="ttl">${esc(L.title)}</span></a></li>`).join("\n        ");
    return `    <section class="unit" aria-labelledby="part-${i + 1}">
      <div class="unit-head"><h2 id="part-${i + 1}">${esc(p.name)}</h2><p>${p.from}~${p.to}강</p></div>
      <ol>
        ${rows}
      </ol>
    </section>`;
  }).join("\n");

  return `${head({
    title: `${COURSE} · 1~20강 | ${BRAND}`,
    description: "ChatGPT Thinking 원리 1~20강. 선택 문제·계산·체크리스트 실습을 직접 해 볼 수 있습니다.",
    url: SITE,
    depth: 0
  })}
</head>
<body class="page-home">
<a class="skip" href="#parts">1~20강 목차로 바로 가기</a>
<header class="masthead">
  <span class="brand"><span>${esc(BRAND)}</span></span>
  <span class="masthead-note">1~20강</span>
</header>
<main class="home">
  <section class="intro" aria-labelledby="course-title">
    <h1 id="course-title">${esc(COURSE)}</h1>
    <figure class="goal">
      <blockquote><p><strong>우리의 학습 목표:</strong> ${esc(GOAL)}</p></blockquote>
    </figure>
    <a class="u-btn solid start" href="lessons/01/">1강부터 읽기</a>
    <p class="about">전체 1~30강 가운데 1~20강입니다.</p>
  </section>
  <div class="parts" id="parts" tabindex="-1">
${parts}
  </div>
</main>
<footer class="colophon home-colophon">
  <p>강의를 세 묶음(1~4강, 5~12강, 13~20강)으로 나눈 것은 이 사이트가 붙인 분류입니다.</p>
  <p>OpenAI의 공식 교육 과정이 아니며, 강의에 나온 연구 인용과 수치는 따로 확인하지 않았습니다.</p>
  <p>이 사이트는 실습에서 고르거나 적은 내용과 읽은 기록을 저장하지 않습니다.</p>
</footer>
</body>
</html>
`;
}
