// src/navigation/QuizNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { QuizStackParamList } from './types';
import QuizListScreen from '../screens/quiz/QuizListScreen';
import QuizDetailScreen from '../screens/quiz/QuizDetailScreen';
import QuizSessionScreen from '../screens/quiz/QuizSessionScreen';
import QuizResultsScreen from '../screens/quiz/QuizResultsScreen';
import { useTheme } from '../theme/ThemeContext';

const Stack = createStackNavigator<QuizStackParamList>();

const QuizNavigator: React.FC = () => {
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
        name="QuizList" 
        component={QuizListScreen} 
        options={{ title: 'Quizzes' }}
      />
      <Stack.Screen 
        name="QuizDetail" 
        component={QuizDetailScreen} 
        options={({ route }) => ({ title: route.params.quiz.title })}
      />
      <Stack.Screen 
        name="QuizSession" 
        component={QuizSessionScreen} 
        options={{ 
          headerShown: false,
          gestureEnabled: false
        }}
      />
      <Stack.Screen 
        name="QuizResults" 
        component={QuizResultsScreen} 
        options={{ 
          title: 'Quiz Results',
          headerLeft: () => null,
        }}
      />
    </Stack.Navigator>
  );
};

export default QuizNavigator;

