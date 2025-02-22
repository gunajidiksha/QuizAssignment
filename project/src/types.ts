export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizAttempt {
  id: string;
  date: number;
  score: number;
  totalQuestions: number;
  timePerQuestion: number[];
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: number[];
  timePerQuestion: number[];
  isComplete: boolean;
}