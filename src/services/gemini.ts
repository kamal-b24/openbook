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
  4. MATHEMATICAL ACCURACY & FORMATTING: 
     - Solve mathematical problems with 100% accuracy.
     - Present solutions in a clean, structured format using simple readable steps.
     - DO NOT show raw LaTeX or code symbols (like \\frac, \\sqrt, etc.).
     - Write formulas in normal human-readable form (e.g., "Return = (Dividend + Capital Gain) / Initial Price").
     - Substitute values clearly into the formulas.
     - Show step-by-step calculations line by line with proper spacing and alignment.
     - Organize "Given" values and formulas in a neat table or bullet format before solving.
     - Highlight the final answer clearly on a new line.
     - Keep everything beginner-friendly and visually clean.
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
      - You must be 100% accurate, especially in mathematical calculations. This is for university exams; a single mistake can impact a student's future.
      - DOUBLE-CHECK YOUR WORK: Before providing the final answer, mentally re-calculate all numerical steps to ensure zero errors.
      - You must solve every single part of a question found in the image.
      - If a question is outside the BBS 4th Year syllabus, you MUST reject it.
      - Never refer to yourself as AI, an assistant, or a model. You are the "Open Book" solution engine.
      - Answers must be structured for maximum marks in TU exams.
      
      Mathematical Formatting Rules:
      - Present solutions in a clean, structured format using simple readable steps.
      - Use Markdown tables for "Given" values and final results where appropriate.
      - Use horizontal lines (---) to separate different parts of the solution.
      - DO NOT show raw LaTeX or code symbols.
      - Write formulas in normal human-readable form.
      - Substitute values clearly into the formulas.
      - Show step-by-step calculations line by line with proper spacing and alignment.
      - Highlight the final answer clearly on a new line.
      - Keep everything beginner-friendly and visually clean.`,
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
