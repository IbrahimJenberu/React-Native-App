// src/types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  goals?: string[];
  streak: number;
  joinedDate: string;
}
