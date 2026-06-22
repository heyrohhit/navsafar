export function parseFaqText(value) {
  const lines = String(value || "")
    .replace(/\r\n/g, "\n")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const faq = [];
  let current = null;

  function appendAnswer(answer) {
    if (!current) return;
    current.a = current.a ? `${current.a} ${answer}`.trim() : answer.trim();
  }

  function startQuestion(question) {
    if (current) faq.push(current); 
    current = { q: question.trim(), a: "" };
  }

  lines.forEach((line) => {
    const qLabelMatch = line.match(/^(?:q|question)\s*[:\-–]?\s*(.+)$/i);
    const numberedQuestionMatch = line.match(/^\d+[\).]\s*(.+)$/i);

    if (qLabelMatch) {
      startQuestion(qLabelMatch[1]);
      return;
    }

    if (numberedQuestionMatch) {
      startQuestion(numberedQuestionMatch[1]);
      return;
    }

    const aLabelMatch = line.match(/^(?:a|answer)\s*[:\-–]?\s*(.+)$/i);
    if (aLabelMatch) {
      appendAnswer(aLabelMatch[1]);
      return;
    }

    appendAnswer(line);
  });

  if (current) faq.push(current);

  return faq.filter((item) => item.q && item.a);
}
