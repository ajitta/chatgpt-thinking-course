"use strict";

const explanations = {
  prediction: {
    correct: "정답입니다. ‘칫솔’과 ‘이를’이라는 문맥에 가장 자연스러운 표현은 ‘닦았다’입니다. 실제 모델은 이런 단서를 토큰의 숫자 표현으로 처리합니다.",
    wrong: "다시 생각해 보세요. 칫솔로 보통 무엇을 할까요? 앞의 표현이 다음 말을 고르는 단서가 됩니다."
  },
  reasoning: {
    correct: "정답입니다. 정확한 예측에 유용한 의미·규칙·관계를 학습하면 새로운 문제에도 이를 활용할 수 있습니다. 그렇다고 모든 문제를 정확히 푼다는 뜻은 아닙니다.",
    wrong: "다시 생각해 보세요. 핵심은 답을 전부 외우거나 말을 길게 하는 것이 아니라, 문제에 필요한 의미·규칙·관계를 연결하는 능력입니다."
  }
};

document.querySelectorAll("form[data-answer]").forEach(form => {
  const feedback = document.getElementById(form.id + "-feedback");
  form.addEventListener("submit", event => {
    event.preventDefault();
    const selected = form.querySelector("input:checked");
    if (!selected) {
      feedback.textContent = "먼저 선택지 하나를 골라 주세요.";
      form.querySelector("input").focus();
      return;
    }
    feedback.textContent = explanations[form.id][selected.value === form.dataset.answer ? "correct" : "wrong"];
    feedback.dataset.state = "answered";
  });
  form.addEventListener("reset", () => {
    feedback.textContent = "선택한 뒤 답을 확인해 보세요.";
    delete feedback.dataset.state;
  });
  form.addEventListener("change", () => {
    feedback.textContent = "선택했습니다. ‘답 확인’을 눌러 이유를 확인하세요.";
    delete feedback.dataset.state;
  });
});

const pieces = ["오늘", "날씨가", "정말", "좋네요."];
const tokenOutput = document.getElementById("token-output");
const tokenNext = document.getElementById("token-next");
let pieceCount = 0;
tokenNext.addEventListener("click", () => {
  pieceCount += 1;
  tokenOutput.textContent = pieces.slice(0, pieceCount).join(" ");
  tokenNext.disabled = pieceCount === pieces.length;
});
document.getElementById("token-reset").addEventListener("click", () => {
  pieceCount = 0;
  tokenOutput.textContent = "아직 생성된 조각이 없습니다.";
  tokenNext.disabled = false;
});
