// src/navigation/types.ts
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Course, Lesson } from '../types/course';
import { Quiz } from '../types/quiz';

// Auth Stack
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Main Tab Navigator
export type MainTabParamList = {
  Home: undefined;
  Courses: undefined;
  Quiz: undefined;
  Profile: undefined;
};

// Home Stack Navigator
export type HomeStackParamList = {
  Dashboard: undefined;
  Notifications: undefined;
  Progress: undefined;
};

// Course Stack Navigator
export type CourseStackParamList = {
  CourseList: undefined;
  CourseDetail: { course: Course };
  LessonDetail: { lesson: Lesson; courseId: string };
  AddNotes: { lessonId: string; notes?: string };
};

// Quiz Stack Navigator
export type QuizStackParamList = {
  QuizList: undefined;
  QuizDetail: { quiz: Quiz };
  QuizSession: { quiz: Quiz };
  QuizResults: { quizId: string; resultId: string };
};

// Profile Stack Navigator
export type ProfileStackParamList = {
  UserProfile: undefined;
  EditProfile: undefined;
  Settings: undefined;
  StudyReminders: undefined;
  Achievements: undefined;
};

// Root Stack Navigator (combines Auth and Main)
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Onboarding: undefined;
};

// Navigation Props for each screen
export type WelcomeScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'Welcome'>;
  route: RouteProp<AuthStackParamList, 'Welcome'>;
};

export type LoginScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'Login'>;
  route: RouteProp<AuthStackParamList, 'Login'>;
};

export type RegisterScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'Register'>;
  route: RouteProp<AuthStackParamList, 'Register'>;
};

export type DashboardScreenProps = {
  navigation: StackNavigationProp<HomeStackParamList, 'Dashboard'>;
  route: RouteProp<HomeStackParamList, 'Dashboard'>;
};

export type CourseListScreenProps = {
  navigation: StackNavigationProp<CourseStackParamList, 'CourseList'>;
  route: RouteProp<CourseStackParamList, 'CourseList'>;
};

export type CourseDetailScreenProps = {
  navigation: StackNavigationProp<CourseStackParamList, 'CourseDetail'>;
  route: RouteProp<CourseStackParamList, 'CourseDetail'>;
};

export type LessonDetailScreenProps = {
  navigation: StackNavigationProp<CourseStackParamList, 'LessonDetail'>;
  route: RouteProp<CourseStackParamList, 'LessonDetail'>;
};

export type QuizListScreenProps = {
  navigation: StackNavigationProp<QuizStackParamList, 'QuizList'>;
  route: RouteProp<QuizStackParamList, 'QuizList'>;
};

export type QuizDetailScreenProps = {
  navigation: StackNavigationProp<QuizStackParamList, 'QuizDetail'>;
  route: RouteProp<QuizStackParamList, 'QuizDetail'>;
};

export type QuizSessionScreenProps = {
  navigation: StackNavigationProp<QuizStackParamList, 'QuizSession'>;
  route: RouteProp<QuizStackParamList, 'QuizSession'>;
};

export type QuizResultsScreenProps = {
  navigation: StackNavigationProp<QuizStackParamList, 'QuizResults'>;
  route: RouteProp<QuizStackParamList, 'QuizResults'>;
};

export type UserProfileScreenProps = {
  navigation: StackNavigationProp<ProfileStackParamList, 'UserProfile'>;
  route: RouteProp<ProfileStackParamList, 'UserProfile'>;
};

export type EditProfileScreenProps = {
  navigation: StackNavigationProp<ProfileStackParamList, 'EditProfile'>;
  route: RouteProp<ProfileStackParamList, 'EditProfile'>;
};

export type SettingsScreenProps = {
  navigation: StackNavigationProp<ProfileStackParamList, 'Settings'>;
  route: RouteProp<ProfileStackParamList, 'Settings'>;
};

