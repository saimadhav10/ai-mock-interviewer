import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const dynamic = "force-dynamic";

interface EvaluationResponse {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

interface QuestionResponse {
  question: string;
  role: string;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.trim() === "") {
      return NextResponse.json(
        {
          error:
            "Missing GEMINI_API_KEY. Please set GEMINI_API_KEY in your .env.local file on the server.",
        },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON payload in request body." },
        { status: 400 }
      );
    }

    const { role, question, answer, action } = body;

    if (!role || typeof role !== "string" || role.trim() === "") {
      return NextResponse.json(
        { error: "Field 'role' is required and must be a non-empty string." },
        { status: 400 }
      );
    }

    // Initialize Gemini SDK strictly on the server
    const ai = new GoogleGenAI({ apiKey });
    const primaryModel = process.env.GEMINI_MODEL || "gemini-3.5-flash";
    const fallbackModels = ["gemini-3.5-flash-lite", "gemini-3.6-flash"];

    async function generateWithFallback(contents: string, temperature: number) {
      const candidateModels = [primaryModel, ...fallbackModels.filter(m => m !== primaryModel)];
      let lastErr: unknown = null;

      for (const m of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: m,
            contents,
            config: {
              responseMimeType: "application/json",
              temperature,
            },
          });
          if (response.text) return response.text;
        } catch (err) {
          console.warn(`Model ${m} failed, attempting fallback...`, err);
          lastErr = err;
        }
      }
      throw lastErr || new Error("All Gemini models failed to respond.");
    }

    // Mode 1: Question Generation (Action: 'question' or if no answer is provided)
    if (action === "question" || (!answer && !question)) {
      const questionPrompt = `You are an expert technical interviewer conducting a mock interview for the role of: "${role.trim()}".
Generate a single realistic, concise, and challenging interview question relevant to this role.
Return the result strictly as a valid JSON object matching this schema:
{
  "question": "The interview question text",
  "role": "${role.trim()}"
}`;

      const responseText = await generateWithFallback(questionPrompt, 0.7);
      const cleanJson = responseText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      const parsed: QuestionResponse = JSON.parse(cleanJson);
      return NextResponse.json(parsed, { status: 200 });
    }

    // Mode 2: Evaluation (Default)
    if (!question || typeof question !== "string" || question.trim() === "") {
      return NextResponse.json(
        { error: "Field 'question' is required for answer evaluation." },
        { status: 400 }
      );
    }

    if (!answer || typeof answer !== "string" || answer.trim() === "") {
      return NextResponse.json(
        { error: "Field 'answer' is required for answer evaluation." },
        { status: 400 }
      );
    }

    const evaluationPrompt = `You are an expert AI interview coach evaluating a candidate's answer for the following position:
Role: "${role.trim()}"
Question Asked: "${question.trim()}"
Candidate Answer: "${answer.trim()}"

Provide constructive, professional, and actionable evaluation.
Return your response STRICTLY as a JSON object adhering to this schema:
{
  "score": <number between 1 and 10 representing overall performance>,
  "feedback": "<concise 2-3 sentence overview of how well the candidate answered>",
  "strengths": [
    "<specific strong point 1>",
    "<specific strong point 2>"
  ],
  "improvements": [
    "<actionable suggestion 1>",
    "<actionable suggestion 2>"
  ]
}

Ensure the score is a numeric value between 1 and 10.
`;

    const responseText = await generateWithFallback(evaluationPrompt, 0.3);
    const cleanJson = responseText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsed = JSON.parse(cleanJson);

    // Validate score bounds and types
    const rawScore = Number(parsed.score);
    const score = Math.max(1, Math.min(10, isNaN(rawScore) ? 5 : Math.round(rawScore)));

    const result: EvaluationResponse = {
      score,
      feedback: typeof parsed.feedback === "string" ? parsed.feedback : "Evaluation completed.",
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths.map(String) : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements.map(String) : [],
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    console.error("Error in /api/evaluate route:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";

    return NextResponse.json(
      {
        error: "Failed to process interview request.",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
