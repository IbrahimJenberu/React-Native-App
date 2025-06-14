// src/types/course.ts
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl?: string;
  summary: string;
  notes?: string;
  completed: boolean;
  duration: number; // in minutes
}