// src/types/quiz.ts
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  lessonId?: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timePerQuestion: number; // in seconds
}

export interface QuizResult {
  id: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number; // in seconds
  date: string;
  answerDetails: {
    questionId: string;
    userAnswer: number;
    correct: boolean;
  }[];
}