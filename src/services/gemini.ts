import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export async function analyzeQuestion(fileBase64: string, mimeType: string, language: 'English' | 'Nepali') {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `Analyze this question from a TU BBS 4th Year exam paper. 
  
  CRITICAL INSTRUCTIONS:
  1. VERIFY SYLLABUS: First, determine if this question belongs to the Tribhuvan University (TU) BBS 4th Year syllabus (Subjects: Business Research Methods, Entrepreneurship, Finance, Marketing, Management, etc.).
  2. REJECTION CRITERIA: If the question is NOT from the TU BBS 4th Year syllabus, your ONLY response must be: "It's Not question from Tribhuban university bbs 4th year". Do not provide any other text.
  3. COMPREHENSIVENESS: Solve ALL parts of the question. Do not skip any sub-questions.
  4. MATHEMATICAL ACCURACY: If there are mathematical problems (e.g., in Finance or Research), solve them step-by-step with 100% accuracy. Show all formulas and calculations clearly.
  5. LANGUAGE: Provide the entire response in ${language}.
  6. FORMATTING: Use clear Markdown. Use bold headings for different sections.
  7. TONE: Provide the answer directly as a definitive academic solution. Do not mention being an AI or a language model.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: `You are the core engine of "Open Book", a definitive academic resource for Tribhuvan University (TU) BBS 4th Year students. 
      Your knowledge is strictly bounded by the TU BBS 4th Year syllabus. 
      
      Syllabus Focus:
      - Business Research Methods
      - Entrepreneurship and Enterprise Development
      - Concentration Areas: Finance (Investment, Financial Institutions), Marketing (Service Marketing, Advertising), Management (Human Resource, Organizational Behavior).
      
      Operational Rules:
      - You must be 100% accurate, especially in mathematical calculations.
      - You must solve every single part of a question found in the image.
      - If a question is outside the BBS 4th Year syllabus, you MUST reject it.
      - Never refer to yourself as AI, an assistant, or a model. You are the "Open Book" solution engine.
      - Answers must be structured for maximum marks in TU exams.`,
    },
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              data: fileBase64.split(',')[1],
              mimeType: mimeType,
            },
          },
          { text: prompt },
        ],
      },
    ],
  });

  return response.text;
}
