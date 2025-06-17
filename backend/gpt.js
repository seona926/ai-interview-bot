const axios = require("axios");
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

async function generateInterviewQuestion(resumeText, previousQuestions = []) {
    const previousList = previousQuestions.length > 0
    ? `\n지금까지 나온 질문들:\n${previousQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`
        : '';
    
  const prompt = `다음 자소서를 기반으로 새로운 면접 질문을 하나 생성해 주세요.${previousList}
    새로운 관점, 주제 또는 상황을 반영하여 이전과 다른 질문을 만들어 주세요.
    질문은 한 문장으로 해 주세요.

    자소서:
    ${resumeText}
    `;

  const response = await axios.post(GEMINI_ENDPOINT, {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ]
  });

  return response.data.candidates?.[0]?.content?.parts?.[0]?.text || "(질문 생성 실패)";
}

async function giveFeedback(answerText) {
  const prompt = `다음 답변에 대한 면접관의 피드백을 300자에서 500자 이내로 해 주세요:\n\n${answerText}`;
  const response = await axios.post(GEMINI_ENDPOINT, {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ]
  });

  return response.data.candidates?.[0]?.content?.parts?.[0]?.text || "(피드백 생성 실패)";
}

module.exports = { generateInterviewQuestion, giveFeedback };
