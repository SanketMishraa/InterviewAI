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

  return completion.choices[0].message.content.trim();
};

// ==========================================
// GENERATE AI FOLLOW-UP QUESTION
// ==========================================

const generateFollowUpQuestion = async (
  role,
  difficulty,
  previousQuestion,
  candidateAnswer,
  evaluation
) => {
  const prompt = `
You are an experienced technical interviewer conducting a realistic interview.

Your job is to ask ONE intelligent follow-up question based on the candidate's previous answer.

Candidate Role:
${role}

Interview Difficulty:
${difficulty}

Previous Interview Question:
${previousQuestion}

Candidate's Answer:
${candidateAnswer}

Previous AI Evaluation:

Score:
${evaluation?.score ?? "N/A"}

Confidence:
${evaluation?.confidence ?? "N/A"}

Clarity:
${evaluation?.clarity ?? "N/A"}

Technical Accuracy:
${evaluation?.technicalAccuracy ?? "N/A"}

Weaknesses:
${JSON.stringify(
  evaluation?.weaknesses || []
)}

Requirements:

1. The follow-up question MUST be directly related to the previous question or the candidate's answer.
2. Use the candidate's answer to decide what should be explored next.
3. If the candidate missed an important concept, ask a question that tests that concept.
4. If the candidate gave a strong answer, ask a deeper question.
5. If the candidate mentioned a technology, concept, example, or claim, you may ask them to explain or apply it.
6. Match the selected difficulty.
7. Do not repeat the previous question.
8. Do not provide an answer or explanation.
9. Ask exactly ONE question.
10. Return ONLY the question as plain text.

Generate the follow-up question now.
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

  return completion.choices[0].message.content.trim();
};

// ==========================================
// EVALUATE INTERVIEW ANSWER
// ==========================================

const evaluateAnswer = async (
  question,
  answer
) => {
  const prompt = `
You are an expert technical interviewer evaluating a candidate during a real interview.

Evaluate the candidate's answer carefully.

Question:

${question}

Candidate Answer:

${answer}

IMPORTANT:

You must evaluate TWO separate things:

1. The quality of the candidate's answer.
2. Whether the answer appears to have been generated or copied from an AI system.

AI-GENERATED ANSWER DETECTION:

You cannot know with absolute certainty whether an answer was copied from AI.

Therefore, DO NOT claim that an answer definitely came from ChatGPT, Gemini, Claude, or another AI.

Instead, estimate whether the writing APPEARS AI-generated based on textual evidence.

Look for signals such as:

- unusually polished language compared with the expected interview level
- generic textbook-style explanations
- overly structured answers
- excessive detail for a simple question
- unnatural consistency
- repeated generic phrases
- unnecessarily formal language
- broad explanations that avoid personal reasoning
- answer style that appears significantly more sophisticated than expected
- phrases that sound like generated instructional content
- lack of natural imperfections when those would normally be expected
- suspiciously comprehensive coverage of the question

Do NOT mark an answer as AI-generated simply because:

- it is grammatically correct
- it is technically strong
- it is well structured
- the candidate uses professional language
- the candidate gives a correct answer

A strong human answer can be highly polished.

If there is insufficient evidence, set:

"aiGenerated": false

and:

"aiDetectionConfidence": "Low"

The AI detection should be treated as a warning signal, NOT proof of cheating.

Return ONLY valid JSON.

Use exactly this structure:

{
  "score": 0,
  "confidence": "",
  "clarity": "",
  "technicalAccuracy": "",

  "aiGenerated": false,
  "aiDetectionConfidence": "",
  "aiDetectionReason": "",

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

AI detection rules:

- aiGenerated must be either true or false.
- aiDetectionConfidence must be exactly one of:
  "Low"
  "Medium"
  "High"

- aiDetectionReason must explain the textual evidence behind the detection decision.
- If there is little or no evidence of AI generation, use aiGenerated=false.
- Do not accuse the candidate.
- Do not state that AI use is proven.
- Do not use the candidate's score alone as evidence of AI generation.
- Do not use grammar alone as evidence of AI generation.
- A technically excellent answer can still be human-written.
- A technically weak answer can still be AI-generated.
- Focus on writing patterns and answer characteristics.

Return ONLY the JSON object.
`;

  const completion =
    await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      temperature: 0.2,
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
// JOB DESCRIPTION + RESUME MATCH
// ==========================================

const analyzeJobMatchAI = async (
  resumeText,
  jobDescription
) => {
  const prompt = `
You are an expert ATS recruiter, resume analyzer, and technical hiring specialist.

Your task is to compare a candidate's resume against a specific job description.

Analyze both carefully.

CANDIDATE RESUME:

${resumeText}

JOB DESCRIPTION:

${jobDescription}

Return ONLY valid JSON.

Use exactly this structure:

{
  "matchScore": 0,
  "matchingSkills": [],
  "missingSkills": [],
  "matchingKeywords": [],
  "missingKeywords": [],
  "relevantExperience": [],
  "skillsToLearn": [],
  "resumeSuggestions": [],
  "summary": ""
}

Rules:

1. matchScore must be a number between 0 and 100.

2. matchingSkills:
   - List technical and professional skills that appear relevant to both the resume and job description.
   - Only include skills supported by the resume.

3. missingSkills:
   - List important skills required by the job description that are not clearly demonstrated in the resume.

4. matchingKeywords:
   - List important job-description keywords that are already represented in the resume.

5. missingKeywords:
   - List important ATS keywords from the job description that are missing or insufficiently represented in the resume.

6. relevantExperience:
   - Identify resume experience, projects, education, or achievements that are relevant to this specific job.
   - Keep each item concise and specific.

7. skillsToLearn:
   - Suggest important skills or technologies the candidate should learn or strengthen based on the job description.
   - Do not invent skills that are already clearly demonstrated.

8. resumeSuggestions:
   - Give practical suggestions for improving the resume specifically for this job.

9. summary:
   - Give a concise overall explanation of how well the resume matches the job description.
   - Mention the most important strengths and gaps.

10. Do not assume the candidate has a skill simply because it is common for the role.

11. Do not invent experience, projects, certifications, technologies, or achievements.

12. Base the analysis only on the provided resume and job description.

13. Return ONLY the JSON object.
`;

  const completion =
    await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      temperature: 0.2,
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
// FINAL AI INTERVIEW REPORT
// ==========================================

const generateFinalInterviewReport = async (
  role,
  difficulty,
  interviews
) => {
  const prompt = `
You are a senior technical interviewer reviewing a completed AI mock interview.

Create a professional final interview assessment based ONLY on the interview data provided below.

Candidate Role:
${role}

Interview Difficulty:
${difficulty}

Completed Interview Data:

${JSON.stringify(
  interviews,
  null,
  2
)}

Return ONLY valid JSON.

Use exactly this structure:

{
  "overallScore": 0,
  "performanceLevel": "",
  "technicalPerformance": "",
  "confidence": "",
  "clarity": "",
  "strongestAreas": [],
  "weakestAreas": [],
  "keyStrengths": [],
  "keyWeaknesses": [],
  "improvementPlan": [],
  "nextSteps": [],
  "summary": ""
}

Rules:

1. overallScore must be between 0 and 10.

2. Calculate the overall assessment using the candidate's complete interview performance.

3. performanceLevel must be one of:
   "Excellent"
   "Strong"
   "Good"
   "Developing"
   "Needs Improvement"

4. technicalPerformance:
   - Assess the candidate's technical knowledge based only on the provided evaluations.

5. confidence:
   - Assess confidence using the confidence evaluations and answer quality.

6. clarity:
   - Assess how clearly and logically the candidate communicated answers.

7. strongestAreas:
   - Identify the strongest technical or communication areas demonstrated.

8. weakestAreas:
   - Identify the areas where the candidate needs the most improvement.

9. keyStrengths:
   - Give specific strengths supported by the interview answers.

10. keyWeaknesses:
   - Give specific weaknesses supported by the interview answers.

11. improvementPlan:
   - Give practical actions the candidate can take to improve interview performance.

12. nextSteps:
   - Give concrete recommendations for the candidate's next practice sessions.

13. summary:
   - Provide a concise professional assessment of the complete interview.

14. Do not invent skills, experience, technologies, or achievements.

15. Do not evaluate anything that is not supported by the supplied interview data.

16. Return ONLY the JSON object.
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
  generateFollowUpQuestion,
  evaluateAnswer,
  analyzeJobMatchAI,
  generateFinalInterviewReport,
};