// src/navigation/HomeNavigator.tsx
import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { Platform, StatusBar } from 'react-native';
import { HomeStackParamList } from './types';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import NotificationsScreen from '../screens/dashboard/NotificationsScreen';
import ProgressScreen from '../screens/dashboard/ProgressScreen';
import { useTheme } from '../theme/ThemeContext';

const Stack = createStackNavigator<HomeStackParamList>();

const HomeNavigator: React.FC = () => {
  const { theme, isDark } = useTheme();
  
  // Premium education-focused color palette
  const colors = {
    light: {
      primary: '#4F46E5', // Indigo-600
      primarySoft: '#EEF2FF', // Indigo-50
      secondary: '#06B6D4', // Cyan-500
      success: '#10B981', // Emerald-500
      background: '#FEFEFE',
      surface: 'rgba(255, 255, 255, 0.95)',
      surfaceGlass: 'rgba(255, 255, 255, 0.80)',
      textPrimary: '#1F2937', // Gray-800
      textSecondary: '#6B7280', // Gray-500
      border: 'rgba(0, 0, 0, 0.06)',
      shadow: 'rgba(0, 0, 0, 0.08)',
      gradient: ['#4F46E5', '#7C3AED'], // Indigo to Purple
    },
    dark: {
      primary: '#6366F1', // Indigo-500
      primarySoft: '#312E81', // Indigo-900
      secondary: '#22D3EE', // Cyan-400
      success: '#34D399', // Emerald-400
      background: '#0F172A', // Slate-900
      surface: 'rgba(15, 23, 42, 0.95)',
      surfaceGlass: 'rgba(30, 41, 59, 0.80)',
      textPrimary: '#F8FAFC', // Slate-50
      textSecondary: '#94A3B8', // Slate-400
      border: 'rgba(255, 255, 255, 0.08)',
      shadow: 'rgba(0, 0, 0, 0.25)',
      gradient: ['#6366F1', '#8B5CF6'], // Indigo to Purple
    }
  };

  const currentColors = isDark ? colors.dark : colors.light;

  // Premium header styling with glassmorphism
  const headerStyle = {
    backgroundColor: currentColors.surfaceGlass,
    borderBottomWidth: 0,
    elevation: 0,
    shadowOffset: { width: 0, height: 4 },
    shadowColor: currentColors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    ...(Platform.OS === 'ios' && {
      blurType: isDark ? 'dark' : 'light',
      backgroundColor: currentColors.surfaceGlass,
    }),
  };

  // Enhanced transitions for premium feel
  const screenOptions = {
    headerStyle,
    headerTintColor: currentColors.textPrimary,
    headerTitleStyle: {
      fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Inter-SemiBold',
      fontSize: 20,
      fontWeight: '600' as const,
      letterSpacing: -0.2,
      color: currentColors.textPrimary,
    },
    headerBackTitleStyle: {
      fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Inter-Medium',
      fontSize: 16,
      fontWeight: '500' as const,
      color: currentColors.primary,
    },
    cardStyle: {
      backgroundColor: currentColors.background,
    },
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    gestureEnabled: true,
    gestureDirection: 'horizontal' as const,
    transitionSpec: {
      open: {
        animation: 'spring',
        config: {
          stiffness: 300,
          damping: 30,
          mass: 0.8,
        },
      },
      close: {
        animation: 'spring',
        config: {
          stiffness: 300,
          damping: 30,
          mass: 0.8,
        },
      },
    },
    headerTitleAlign: 'center' as const,
    headerShadowVisible: false,
    // Enhanced header styling for premium feel
    headerLeftContainerStyle: {
      paddingLeft: 20,
    },
    headerRightContainerStyle: {
      paddingRight: 20,
    },
    headerTitleContainerStyle: {
      alignItems: 'center',
    },
  };

  // Set status bar for premium look
  React.useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content', true);
    } else {
      StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content', true);
      StatusBar.setBackgroundColor(currentColors.background, true);
    }
  }, [isDark, currentColors.background]);

  return (
    <Stack.Navigator
      screenOptions={screenOptions}
      initialRouteName="Dashboard"
    >
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ 
          headerShown: false,
          gestureEnabled: false, // Disable gesture for main dashboard
        }}
      />
      
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{
          title: "Notifications",
          headerStyle: {
            ...headerStyle,
            backgroundColor: currentColors.surface,
          },
          headerBackTitle: "Back",
          headerTitleStyle: {
            ...screenOptions.headerTitleStyle,
            color: currentColors.textPrimary,
          },
          // Add premium notification icon styling
          headerRight: () => (
            <TouchableOpacity
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: currentColors.primarySoft,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 4,
                shadowColor: currentColors.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
              activeOpacity={0.7}
            >
              <Text style={{ 
                fontSize: 14, 
                fontWeight: '600',
                color: currentColors.primary,
                fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Inter-SemiBold',
              }}>
                ⚡
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      
      <Stack.Screen 
        name="Progress" 
        component={ProgressScreen}
        options={{
          title: "Learning Progress",
          headerStyle: {
            ...headerStyle,
            backgroundColor: currentColors.surface,
          },
          headerBackTitle: "Dashboard",
          headerTitleStyle: {
            ...screenOptions.headerTitleStyle,
            color: currentColors.textPrimary,
          },
          // Add progress indicator in header
          headerRight: () => (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: currentColors.success + '15',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
              marginRight: 4,
            }}>
              <View style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: currentColors.success,
                marginRight: 6,
              }} />
              <Text style={{
                fontSize: 12,
                fontWeight: '600',
                color: currentColors.success,
                fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Inter-SemiBold',
              }}>
                Active
              </Text>
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

// Enhanced TouchableOpacity and View imports
import { TouchableOpacity, View, Text } from 'react-native';

export default HomeNavigator;