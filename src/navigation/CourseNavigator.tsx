// src/navigation/CourseNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CourseStackParamList } from './types';
import CourseListScreen from '../screens/courses/CourseListScreen';
import CourseDetailScreen from '../screens/courses/CourseDetailScreen';
import LessonDetailScreen from '../screens/courses/LessonDetailScreen';
import AddNotesScreen from '../screens/courses/AddNotesScreen';
import { useTheme } from '../theme/ThemeContext';

const Stack = createStackNavigator<CourseStackParamList>();

const CourseNavigator: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen 
        name="CourseList" 
        component={CourseListScreen} 
        options={{ title: 'My Courses' }}
      />
      <Stack.Screen 
        name="CourseDetail" 
        component={CourseDetailScreen} 
        options={({ route }) => ({ title: route.params.course.title })}
      />
      <Stack.Screen 
        name="LessonDetail" 
        component={LessonDetailScreen} 
        options={({ route }) => ({ title: route.params.lesson.title })}
      />
      <Stack.Screen 
        name="AddNotes" 
        component={AddNotesScreen} 
        options={{ title: 'My Notes' }}
      />
    </Stack.Navigator>
  );
};

export default CourseNavigator;

