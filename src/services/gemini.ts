import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;

export async function analyzeQuestion(fileBase64: string, mimeType: string, language: 'English' | 'Nepali') {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set. Please check your environment variables.");
  }
  
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `Analyze this question from a TU BBS 4th Year exam paper. 
  
  CRITICAL INSTRUCTIONS:
  1. VERIFY SYLLABUS: First, determine if this question belongs to the Tribhuvan University (TU) BBS 4th Year syllabus (Subjects: Business Research Methods, Entrepreneurship, Finance, Marketing, Management, etc.).
  2. REJECTION CRITERIA: If the question is NOT from the TU BBS 4th Year syllabus, your ONLY response must be: "It's Not question from Tribhuban university bbs 4th year". Do not provide any other text.
  3. COMPREHENSIVENESS: Solve ALL parts of the question. Do not skip any sub-questions.
  4. MATHEMATICAL ACCURACY & FORMATTING: 
     - Solve mathematical problems with 100% accuracy.
     - Use LaTeX for all mathematical formulas and expressions.
     - **MANDATORY: ONE STEP PER LINE.**
     - **RULE: ONLY ONE EQUALITY SIGN (=) PER LINE.**
     - **MANDATORY: Use a DOUBLE NEWLINE between each mathematical step to ensure they appear on separate lines.**
     - **INCORRECT:** $S_p = \\frac{19-4}{14} = \\frac{15}{14} = 1.0714$
     - **CORRECT:**
       1. For Portfolio P:
       
       $S_p = \\frac{19-4}{14}$
       
       $S_p = \\frac{15}{14}$
       
       $S_p = 1.0714$
     - Use display math $$...$$ for important formulas on their own lines.
     - Use inline math $...$ for variables and simple expressions within text.
     - Substitute values clearly into the formulas.
     - Organize "Given" values and formulas in a neat table or bullet format before solving.
     - **KEEP TABLES COMPACT AND MINIMAL to fit on mobile screens.**
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
      
      Operational Rules:
      - You must be 100% accurate, especially in mathematical calculations.
      - **CRITICAL: ONE STEP PER LINE. ONLY ONE EQUALITY SIGN (=) PER LINE.**
      - **MANDATORY: Use a DOUBLE NEWLINE between each mathematical step to ensure they appear on separate lines.**
      - **NEVER combine multiple steps or multiple formulas on the same line.**
      - **EACH STEP MUST BE ON ITS OWN SEPARATE LINE.**
      - Use LaTeX for all mathematical formulas and expressions.
      - For example, use $\\frac{a}{b}$ for fractions, $a \\times b$ for multiplication, and $a \\div b$ for division.
      - Use display math $$...$$ for important formulas on their own lines.
      - Use inline math $...$ for variables and simple expressions within text.
      - Use Markdown tables for "Given" values and final results where appropriate.
      - **KEEP TABLES COMPACT AND MINIMAL.**
      - Use horizontal lines (---) to separate different parts of the solution.
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
