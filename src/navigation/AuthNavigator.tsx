// src/navigation/AuthNavigator.tsx
import React from 'react';
import { createStackNavigator, TransitionPresets, CardStyleInterpolators } from '@react-navigation/stack';
import { Platform, Dimensions, Easing } from 'react-native';
import { AuthStackParamList } from './types';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import { useTheme } from '../theme/ThemeContext';

const Stack = createStackNavigator<AuthStackParamList>();
const { width: screenWidth } = Dimensions.get('window');

const AuthNavigator: React.FC = () => {
  const { theme } = useTheme();
  
  // Check if we're in dark mode by examining the background color
  const isDark = theme.colors.background === '#181818' || 
                 theme.colors.background.includes('18') ||
                 theme.colors.textPrimary === '#FFFFFF';
  
  // Custom transition configuration for smooth, premium feel
  const customTransitionSpec = {
    animation: 'timing' as const,
    config: {
      duration: 350,
      easing: Easing.out(Easing.poly(4)), // Material Design inspired easing
    },
  };

  // Enhanced header styling with modern glass morphism effect
  const getHeaderStyle = () => ({
    backgroundColor: isDark ? 'rgba(24, 24, 24, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 0,
    elevation: 0,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isDark ? 0.1 : 0.05,
    shadowRadius: 8,
  });

  // Custom card style interpolator for smooth transitions
  const customCardStyleInterpolator = ({ current, layouts }: any) => {
    const translateX = current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [layouts.screen.width, 0],
      extrapolate: 'clamp',
    });

    const opacity = current.progress.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.25, 1],
      extrapolate: 'clamp',
    });

    const scale = current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0.95, 1],
      extrapolate: 'clamp',
    });

    return {
      cardStyle: {
        transform: [{ translateX }, { scale }],
        opacity,
      },
    };
  };

  return (
    <Stack.Navigator
      screenOptions={{
        // Enhanced header styling with premium glass effect
        headerStyle: getHeaderStyle(),
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: {
          fontFamily: Platform.OS === 'ios' ? 'Inter-SemiBold' : 'Inter_600SemiBold',
          fontSize: 18,
          fontWeight: '600',
          letterSpacing: -0.2,
          color: theme.colors.textPrimary,
        },
        // Fixed property name for React Navigation v6+
        headerBackTitle: '', // Empty string to hide back title
        headerLeftContainerStyle: {
          paddingLeft: 16,
        },
        headerRightContainerStyle: {
          paddingRight: 16,
        },
        // Modern card styling with smooth background
        cardStyle: {
          backgroundColor: theme.colors.background,
        },
        // Smooth transitions with custom timing
        transitionSpec: {
          open: customTransitionSpec,
          close: customTransitionSpec,
        },
        cardStyleInterpolator: customCardStyleInterpolator,
        // Gesture configuration for smooth swipe back
        gestureEnabled: true,
        gestureResponseDistance: screenWidth * 0.25,
        gestureVelocityImpact: 0.3,
      }}
    >
      <Stack.Screen 
        name="Welcome" 
        component={WelcomeScreen} 
        options={{ 
          headerShown: false,
          // Welcome screen gets special fade transition
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
          transitionSpec: {
            open: { 
              animation: 'timing', 
              config: { 
                duration: 500,
                easing: Easing.out(Easing.quad),
              } 
            },
            close: { 
              animation: 'timing', 
              config: { 
                duration: 300,
                easing: Easing.in(Easing.quad),
              } 
            },
          },
        }}
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ 
          title: 'Welcome Back',
          headerTitleAlign: 'center',
          headerBackTitle: ' ', // Space to hide back title text
          // Smooth slide transition from right
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{ 
          title: 'Join TopScorer',
          headerTitleAlign: 'center',
          headerBackTitle: ' ', // Space to hide back title text
          // Modal-like presentation for registration
          ...TransitionPresets.ModalPresentationIOS,
          cardStyleInterpolator: ({ current, layouts }) => {
            const translateY = current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.height, 0],
              extrapolate: 'clamp',
            });

            const opacity = current.progress.interpolate({
              inputRange: [0, 0.3, 1],
              outputRange: [0, 0.5, 1],
              extrapolate: 'clamp',
            });

            return {
              cardStyle: {
                transform: [{ translateY }],
                opacity,
              },
            };
          },
        }}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
        options={{ 
          title: 'Reset Password',
          headerTitleAlign: 'center',
          headerBackTitle: ' ', // Space to hide back title text
          // Subtle fade transition for secondary flow
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          transitionSpec: {
            open: { 
              animation: 'timing', 
              config: { 
                duration: 300,
                easing: Easing.out(Easing.cubic),
              } 
            },
            close: { 
              animation: 'timing', 
              config: { 
                duration: 250,
                easing: Easing.in(Easing.cubic),
              } 
            },
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;