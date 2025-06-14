// src/navigation/ProfileNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfileStackParamList } from './types';
import UserProfileScreen from '../screens/profile/UserProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import StudyRemindersScreen from '../screens/profile/StudyRemindersScreen';
import AchievementsScreen from '../screens/profile/AchievementsScreen';
import { useTheme } from '../theme/ThemeContext';

const Stack = createStackNavigator<ProfileStackParamList>();

const ProfileNavigator: React.FC = () => {
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
        name="UserProfile" 
        component={UserProfileScreen} 
        options={{ title: 'My Profile' }}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen} 
        options={{ title: 'Edit Profile' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'Settings' }}
      />
      <Stack.Screen 
        name="StudyReminders" 
        component={StudyRemindersScreen} 
        options={{ title: 'Study Reminders' }}
      />
      <Stack.Screen 
        name="Achievements" 
        component={AchievementsScreen} 
        options={{ title: 'My Achievements' }}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;

