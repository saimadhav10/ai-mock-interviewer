export type InterviewState = "setup" | "active" | "feedback";

export interface EvaluationResult {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export interface QuestionData {
  question: string;
  role: string;
}
