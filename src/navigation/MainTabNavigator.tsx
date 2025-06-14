// src/navigation/MainTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import HomeNavigator from './HomeNavigator';
import CourseNavigator from './CourseNavigator';
import QuizNavigator from './QuizNavigator';
import ProfileNavigator from './ProfileNavigator';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { View, Platform, Dimensions, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';

const Tab = createBottomTabNavigator<MainTabParamList>();
const { width: screenWidth } = Dimensions.get('window');

// Premium Color Palette - World-class EducationTech inspired
const COLORS = {
  light: {
    primary: '#2563EB',      // Royal Blue - Trustworthy & Professional
    secondary: '#1E40AF',    // Deep Blue - Authority
    accent: '#3B82F6',       // Bright Blue - Interactive
    surface: '#FFFFFF',      // Pure White - Clean
    surfaceVariant: '#F8FAFC', // Light Gray - Subtle backgrounds
    background: '#FFFFFF',
    border: '#E2E8F0',
    shadow: '#0F172A',
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
      tertiary: '#94A3B8'
    },
    glassmorphism: 'rgba(255, 255, 255, 0.95)'
  },
  dark: {
    primary: '#60A5FA',      // Light Blue - Accessible in dark
    secondary: '#3B82F6',    // Medium Blue - Balanced
    accent: '#93C5FD',       // Soft Blue - Gentle on eyes
    surface: '#1E293B',      // Dark Blue Gray - Premium feel
    surfaceVariant: '#334155', // Medium Dark - Layered depth
    background: '#0F172A',
    border: '#334155',
    shadow: '#000000',
    text: {
      primary: '#F8FAFC',
      secondary: '#CBD5E1',
      tertiary: '#94A3B8'
    },
    glassmorphism: 'rgba(30, 41, 59, 0.95)'
  }
};

// Typography Scale - Professional & Readable
const TYPOGRAPHY = {
  tabLabel: {
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
    lineHeight: 14,
  }
};

// Animated Tab Icon Component with Premium Micro-interactions
interface AnimatedTabIconProps {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size: number;
  focused: boolean;
  routeName: string;
}

const AnimatedTabIcon: React.FC<AnimatedTabIconProps> = ({ name, color, size, focused, routeName }) => {
  const scale = useSharedValue(0.9);
  const translateY = useSharedValue(0);
  const iconOpacity = useSharedValue(0.7);
  const glowOpacity = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  React.useEffect(() => {
    // Smooth spring animations with perfect easing curves
    scale.value = withSpring(focused ? 1.1 : 0.95, {
      damping: 20,
      stiffness: 300,
      mass: 0.5,
    });

    translateY.value = withSpring(focused ? -3 : 0, {
      damping: 15,
      stiffness: 200,
    });

    iconOpacity.value = withTiming(focused ? 1 : 0.6, {
      duration: 200,
    });

    glowOpacity.value = withTiming(focused ? 1 : 0, {
      duration: 300,
    });

    // Subtle pulse animation for premium feel
    if (focused) {
      pulseScale.value = withSpring(1.2, {
        damping: 10,
        stiffness: 100,
      }, () => {
        pulseScale.value = withSpring(1, {
          damping: 20,
          stiffness: 200,
        });
      });
    }
  }, [focused]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value }
    ],
    opacity: iconOpacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value * 0.3,
    transform: [{ scale: pulseScale.value }],
  }));

  const activeDotStyle = useAnimatedStyle(() => ({
    opacity: focused ? 1 : 0,
    transform: [{ scale: focused ? 1 : 0 }],
  }));

  return (
    <View style={styles.tabIconContainer}>
      {/* Glow effect behind icon - Pure CSS implementation */}
      <Animated.View style={[styles.iconGlow, glowStyle, { backgroundColor: color }]} />
      
      {/* Main icon */}
      <Animated.View style={animatedIconStyle}>
        <Ionicons name={name} color={color} size={size} />
      </Animated.View>
      
      {/* Active indicator dot */}
      <Animated.View style={[styles.activeDot, activeDotStyle, { backgroundColor: color }]} />
    </View>
  );
};

// Premium Tab Background Component - Zero dependencies, pure React Native
const TabBackground: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const colors = isDark ? COLORS.dark : COLORS.light;
  
  return (
    <View style={styles.tabBackgroundContainer}>
      {/* Base glassmorphism background */}
      <View 
        style={[
          styles.glassBackground,
          {
            backgroundColor: colors.glassmorphism,
          }
        ]}
      />
      
      {/* Gradient effect using multiple layers - No external deps needed */}
      <View style={[styles.gradientLayer1, { backgroundColor: colors.surface, opacity: 0.9 }]} />
      <View style={[styles.gradientLayer2, { backgroundColor: colors.primary, opacity: 0.03 }]} />
      
      {/* Top accent line using pure View */}
      <View 
        style={[
          styles.topAccent,
          {
            backgroundColor: colors.primary,
          }
        ]}
      />
      
      {/* Premium border effect */}
      <View style={[styles.topBorder, { backgroundColor: colors.border }]} />
      
      {/* Subtle inner glow */}
      <View style={[styles.innerGlow, { backgroundColor: colors.primary, opacity: 0.02 }]} />
    </View>
  );
};

const MainTabNavigator: React.FC = () => {
  const { theme } = useTheme();
  
  // Robust theme detection that works with various theme context implementations
  const isDark = React.useMemo(() => {
    if (typeof theme === 'string') {
      return theme === 'dark';
    }
    if (typeof theme === 'object' && theme !== null) {
      return (theme as any).mode === 'dark' || 
             (theme as any).name === 'dark' || 
             (theme as any).isDark === true ||
             'dark' in theme;
    }
    return false;
  }, [theme]);
  
  const colors = isDark ? COLORS.dark : COLORS.light;

  const getTabIcon = (routeName: string, focused: boolean): keyof typeof Ionicons.glyphMap => {
    const iconMap: Record<string, { focused: keyof typeof Ionicons.glyphMap; unfocused: keyof typeof Ionicons.glyphMap }> = {
      Home: { focused: 'home', unfocused: 'home-outline' },
      Courses: { focused: 'library', unfocused: 'library-outline' },
      Quiz: { focused: 'flash', unfocused: 'flash-outline' },
      Profile: { focused: 'person-circle', unfocused: 'person-circle-outline' },
    };
    
    return focused ? iconMap[routeName]?.focused : iconMap[routeName]?.unfocused || 'home-outline';
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: 'transparent',
            shadowColor: colors.shadow,
            borderTopColor: 'transparent',
            // Enhanced shadow for iOS
            ...(Platform.OS === 'ios' && {
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.1,
              shadowRadius: 16,
            }),
            // Enhanced elevation for Android
            ...(Platform.OS === 'android' && {
              elevation: 24,
            }),
          }
        ],
        tabBarLabelStyle: [
          TYPOGRAPHY.tabLabel,
          {
            color: colors.text.secondary,
            marginTop: 6,
          }
        ],
        tabBarActiveLabelStyle: {
          color: colors.primary,
          fontWeight: '700',
        },
        tabBarIcon: ({ color, size, focused }) => {
          const iconName = getTabIcon(route.name, focused);
          
          return (
            <AnimatedTabIcon 
              name={iconName}
              color={color} 
              size={focused ? 26 : 24} 
              focused={focused}
              routeName={route.name}
            />
          );
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarBackground: () => <TabBackground isDark={isDark} />,
        // Fix content coverage issue
        tabBarItemStyle: {
          paddingTop: 8,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeNavigator} 
        options={{
          tabBarLabel: 'Home',
          tabBarAccessibilityLabel: 'Home Tab - Navigate to dashboard',
        }}
      />
      <Tab.Screen 
        name="Courses" 
        component={CourseNavigator} 
        options={{
          tabBarLabel: 'Learn',
          tabBarAccessibilityLabel: 'Courses Tab - Browse learning content',
        }}
      />
      <Tab.Screen 
        name="Quiz" 
        component={QuizNavigator} 
        options={{
          tabBarLabel: 'Practice',
          tabBarAccessibilityLabel: 'Quiz Tab - Practice and test knowledge',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileNavigator} 
        options={{
          tabBarLabel: 'Profile',
          tabBarAccessibilityLabel: 'Profile Tab - View personal information',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // Reduced padding to prevent content coverage
    paddingBottom: Platform.OS === 'ios' ? 30 : 12,
    paddingTop: 12,
    paddingHorizontal: 8,
    // Reduced height to prevent content coverage
    height: Platform.OS === 'ios' ? 88 : 76,
    borderTopWidth: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    // Ensure proper layering
    zIndex: 1,
  },
  
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 44,
    height: 44,
  },
  
  iconGlow: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    opacity: 0,
  },
  
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 6,
    position: 'absolute',
    bottom: -8,
  },
  
  tabBackgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  
  glassBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  
  // Gradient layers using pure React Native Views
  gradientLayer1: {
    ...StyleSheet.absoluteFillObject,
  },
  
  gradientLayer2: {
    ...StyleSheet.absoluteFillObject,
  },
  
  topAccent: {
    position: 'absolute',
    top: 0,
    left: '20%',
    right: '20%',
    height: 3,
    borderRadius: 1.5,
    opacity: 0.8,
  },
  
  topBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 0.5,
    opacity: 0.3,
  },
  
  innerGlow: {
    position: 'absolute',
    top: 3,
    left: 0,
    right: 0,
    height: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
});

export default MainTabNavigator;