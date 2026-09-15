const groq = require("../utils/groq");

// ==========================================
// AI RESUME ANALYSIS
// ==========================================

const analyzeResumeAI = async (resumeText) => {
  const prompt = `
You are an expert ATS Resume Analyzer.

Analyze the resume below.

Return ONLY valid JSON.

Schema:

{
  "atsScore": number,
  "strengths": [],
  "weaknesses": [],
  "missingKeywords": [],
  "suggestions": []
}

Rules:

- atsScore must be between 0 and 100.
- strengths must contain useful observations.
- weaknesses must contain genuine weaknesses.
- missingKeywords must contain relevant job/ATS keywords.
- suggestions must be practical and specific.

Resume:

${resumeText}
`;

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",

    temperature: 0.3,

    response_format: {
      type: "json_object",
    },

    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return JSON.parse(
    completion.choices[0].message.content
  );
};


// ==========================================
// GENERATE INTERVIEW QUESTION
// ==========================================

const generateInterviewQuestion = async (
  role,
  difficulty
) => {

  const prompt = `
You are an experienced technical interviewer.

Generate ONE interview question.

Role:
${role}

Difficulty:
${difficulty}

Requirements:

- Make the question relevant to the selected role.
- Match the requested difficulty.
- Do not provide the answer.
- Return ONLY the interview question.
`;

  const completion =
    await groq.chat.completions.create({

      model: "openai/gpt-oss-120b",

      temperature: 0.7,

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

  return completion.choices[0]
    .message.content
    .trim();
};


// ==========================================
// EVALUATE INTERVIEW ANSWER
// ==========================================

const evaluateAnswer = async (
  question,
  answer
) => {

  const prompt = `
You are an expert software engineering interviewer.

Evaluate the candidate's answer.

Question:
${question}

Candidate Answer:
${answer}

Return ONLY valid JSON.

Use exactly this structure:

{
  "score": 0,
  "confidence": "",
  "clarity": "",
  "technicalAccuracy": "",
  "strengths": [],
  "weaknesses": [],
  "betterAnswer": "",
  "tips": []
}

Rules:

- score must be between 0 and 10.
- Evaluate technical correctness.
- Evaluate clarity.
- Evaluate confidence based on the quality and completeness of the answer.
- Give specific strengths.
- Give specific weaknesses.
- Provide a better model answer.
- Give practical improvement tips.
`;

  const completion =
    await groq.chat.completions.create({

      model: "openai/gpt-oss-120b",

      temperature: 0.3,

      response_format: {
        type: "json_object",
      },

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

  return JSON.parse(
    completion.choices[0].message.content
  );
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
  analyzeResumeAI,
  generateInterviewQuestion,
  evaluateAnswer,
};