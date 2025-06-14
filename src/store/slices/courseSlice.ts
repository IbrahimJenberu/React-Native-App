// src/store/slices/courseSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Course, Lesson } from '../../types/course';

interface CourseState {
  courses: Course[];
  lessons: Lesson[];
  currentCourse: Course | null;
  currentLesson: Lesson | null;
  loading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  courses: [],
  lessons: [],
  currentCourse: null,
  currentLesson: null,
  loading: false,
  error: null,
};

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    fetchCoursesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCoursesSuccess(state, action: PayloadAction<Course[]>) {
      state.courses = action.payload;
      state.loading = false;
    },
    fetchCoursesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentCourse(state, action: PayloadAction<Course>) {
      state.currentCourse = action.payload;
    },
    fetchLessonsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchLessonsSuccess(state, action: PayloadAction<Lesson[]>) {
      state.lessons = action.payload;
      state.loading = false;
    },
    fetchLessonsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentLesson(state, action: PayloadAction<Lesson>) {
      state.currentLesson = action.payload;
    },
    updateLessonNotes(state, action: PayloadAction<{ lessonId: string; notes: string }>) {
      const { lessonId, notes } = action.payload;
      const lessonIndex = state.lessons.findIndex((lesson: any) => lesson.id === lessonId);
      if (lessonIndex !== -1) {
        state.lessons[lessonIndex].notes = notes;
        if (state.currentLesson?.id === lessonId) {
          state.currentLesson.notes = notes;
        }
      }
    },
    markLessonCompleted(state, action: PayloadAction<string>) {
      const lessonId = action.payload;
      const lessonIndex = state.lessons.findIndex((lesson: any) => lesson.id === lessonId);
      if (lessonIndex !== -1) {
        state.lessons[lessonIndex].completed = true;
        
        // Update course progress
        if (state.currentCourse) {
          const courseId = state.lessons[lessonIndex].courseId;
          const courseIndex = state.courses.findIndex((course: any) => course.id === courseId);
          
          if (courseIndex !== -1) {
            state.courses[courseIndex].completedLessons += 1;
            state.courses[courseIndex].progress = 
              (state.courses[courseIndex].completedLessons / 
               state.courses[courseIndex].totalLessons) * 100;
            
            if (state.currentCourse.id === courseId) {
              state.currentCourse = state.courses[courseIndex];
            }
          }
        }
      }
    },
  },
});

export const {
  fetchCoursesStart,
  fetchCoursesSuccess,
  fetchCoursesFailure,
  setCurrentCourse,
  fetchLessonsStart,
  fetchLessonsSuccess,
  fetchLessonsFailure,
  setCurrentLesson,
  updateLessonNotes,
  markLessonCompleted,
} = courseSlice.actions;
export default courseSlice.reducer;