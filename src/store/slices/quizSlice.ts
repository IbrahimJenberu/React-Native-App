// src/store/slices/quizSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Quiz, QuizQuestion, QuizResult } from '../../types/quiz';

interface QuizState {
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  quizResults: QuizResult[];
  currentQuizResult: QuizResult | null;
  activeQuestion: number;
  userAnswers: number[];
  timeRemaining: number;
  quizInProgress: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: QuizState = {
  quizzes: [],
  currentQuiz: null,
  quizResults: [],
  currentQuizResult: null,
  activeQuestion: 0,
  userAnswers: [],
  timeRemaining: 0,
  quizInProgress: false,
  loading: false,
  error: null,
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    fetchQuizzesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchQuizzesSuccess(state, action: PayloadAction<Quiz[]>) {
      state.quizzes = action.payload;
      state.loading = false;
    },
    fetchQuizzesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    startQuiz(state, action: PayloadAction<Quiz>) {
      state.currentQuiz = action.payload;
      state.activeQuestion = 0;
      state.userAnswers = new Array(action.payload.questions.length).fill(-1);
      state.timeRemaining = action.payload.timePerQuestion;
      state.quizInProgress = true;
    },
    answerQuestion(state, action: PayloadAction<{ questionIndex: number; answer: number }>) {
      const { questionIndex, answer } = action.payload;
      if (state.userAnswers.length > questionIndex) {
        state.userAnswers[questionIndex] = answer;
      }
    },
    nextQuestion(state) {
      if (state.currentQuiz && state.activeQuestion < state.currentQuiz.questions.length - 1) {
        state.activeQuestion += 1;
        state.timeRemaining = state.currentQuiz.timePerQuestion;
      }
    },
    previousQuestion(state) {
      if (state.activeQuestion > 0) {
        state.activeQuestion -= 1;
        if (state.currentQuiz) {
          state.timeRemaining = state.currentQuiz.timePerQuestion;
        }
      }
    },
    updateTimeRemaining(state, action: PayloadAction<number>) {
      state.timeRemaining = action.payload;
    },
    finishQuiz(state, action: PayloadAction<QuizResult>) {
      state.quizInProgress = false;
      state.currentQuizResult = action.payload;
      state.quizResults.push(action.payload);
    },
    resetQuiz(state) {
      state.currentQuiz = null;
      state.currentQuizResult = null;
      state.activeQuestion = 0;
      state.userAnswers = [];
      state.timeRemaining = 0;
      state.quizInProgress = false;
    },
  },
});

export const {
  fetchQuizzesStart,
  fetchQuizzesSuccess,
  fetchQuizzesFailure,
  startQuiz,
  answerQuestion,
  nextQuestion,
  previousQuestion,
  updateTimeRemaining,
  finishQuiz,
  resetQuiz,
} = quizSlice.actions;
export default quizSlice.reducer;