// src/mocks/quizData.ts
import { Quiz, QuizResult } from '../types/quiz';

export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz-1',
    courseId: 'course-1',
    title: 'Calculus Fundamentals',
    description: 'Test your understanding of basic calculus concepts',
    questions: [
      {
        id: 'q1-1',
        question: 'What is the derivative of f(x) = x²?',
        options: ['f\'(x) = x', 'f\'(x) = 2x', 'f\'(x) = 2', 'f\'(x) = x²'],
        correctAnswer: 1,
        explanation: 'The derivative of x² is 2x using the power rule.',
      },
      {
        id: 'q1-2',
        question: 'What is the integral of f(x) = 2x?',
        options: ['F(x) = x² + C', 'F(x) = x + C', 'F(x) = 2x² + C', 'F(x) = x²/2 + C'],
        correctAnswer: 0,
        explanation: 'The integral of 2x is x² + C.',
      },
    ],
    timePerQuestion: 60,
  },
];

export const mockQuizResults: QuizResult[] = [
  {
    id: 'result-1',
    quizId: 'quiz-1',
    score: 80,
    totalQuestions: 2,
    correctAnswers: 1,
    timeTaken: 90,
    date: '2023-06-15T14:30:00Z',
    answerDetails: [
      { questionId: 'q1-1', userAnswer: 1, correct: true },
      { questionId: 'q1-2', userAnswer: 1, correct: false },
    ],
  },
];
