// src/mocks/userData.ts
import { User } from '../types/user';

export const mockUser: User = {
  id: 'user-1',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  avatar: undefined,
  goals: [
    'Score 90% or higher on all quizzes',
    'Complete 3 courses this semester',
    'Study for at least 2 hours daily',
  ],
  streak: 5,
  joinedDate: '2023-03-15T00:00:00Z',
};