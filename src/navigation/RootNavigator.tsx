// src/navigation/RootNavigator.tsx
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { RootStackParamList } from './types';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import { useTheme } from '../theme/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { loginSuccess } from '../store/slices/authSlice';

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const onboardingValue = await AsyncStorage.getItem('hasOnboarded');
        const hasCompletedOnboarding = onboardingValue === 'true';
        setHasOnboarded(hasCompletedOnboarding);
        
        // Check if user is logged in (from AsyncStorage)
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          dispatch(loginSuccess(user));
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to get onboarding status', error);
        setIsLoading(false);
      }
    };
    
    checkOnboarding();
  }, [dispatch]);
  
  const getInitialRouteName = () => {
    if (!hasOnboarded) {
      return 'Onboarding';
    } else if (!isAuthenticated) {
      return 'Auth';
    } else {
      return 'Main';
    }
  };
  
  if (isLoading) {
    return null; // Or a loading screen
  }
  
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }}
        initialRouteName={getInitialRouteName()}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;