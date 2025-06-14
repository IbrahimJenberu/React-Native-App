// src/mocks/courseData.ts
import { Course, Lesson } from '../types/course';

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Advanced Mathematics',
    description: 'Master calculus, linear algebra, and statistics for competitive exams',
    thumbnail: 'https://example.com/math.jpg',
    category: 'Mathematics',
    progress: 35,
    totalLessons: 12,
    completedLessons: 4,
  },
  {
    id: 'course-2',
    title: 'Physics Fundamentals',
    description: 'Learn mechanics, electromagnetism, and modern physics concepts',
    thumbnail: 'https://example.com/physics.jpg',
    category: 'Science',
    progress: 75,
    totalLessons: 8,
    completedLessons: 6,
  },
  {
    id: 'course-3',
    title: 'English Literature',
    description: 'Explore classic and contemporary literature with in-depth analysis',
    thumbnail: 'https://example.com/literature.jpg',
    category: 'Language',
    progress: 50,
    totalLessons: 10,
    completedLessons: 5,
  },
];

export const mockLessons: Lesson[] = [
  {
    id: 'lesson-1-1',
    courseId: 'course-1',
    title: 'Introduction to Calculus',
    description: 'Understanding the fundamentals of differentiation and integration',
    videoUrl: 'https://example.com/videos/calculus-intro.mp4',
    summary: 'This lesson covers the basic concepts of calculus including limits, derivatives, and integrals.',
    notes: 'Remember that the derivative measures the rate of change.',
    completed: true,
    duration: 45,
  },
  {
    id: 'lesson-1-2',
    courseId: 'course-1',
    title: 'Advanced Calculus',
    description: 'Complex calculus problems and applications',
    videoUrl: 'https://example.com/videos/advanced-calculus.mp4',
    summary: 'Advanced calculus techniques and real-world applications.',
    notes: '',
    completed: false,
    duration: 60,
  },
];


