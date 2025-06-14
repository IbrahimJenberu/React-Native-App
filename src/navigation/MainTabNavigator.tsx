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
import { View, Platform, Dimensions, StyleSheet, Text } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  interpolate,
  Extrapolate,
  runOnJS,
  useAnimatedReaction
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

const Tab = createBottomTabNavigator<MainTabParamList>();
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// World-Class Premium Color System - Inspired by Stripe & Linear
const COLORS = {
  light: {
    // Primary gradient - Trustworthy blues with modern sophistication
    primary: '#1E40AF',        // Deep Royal Blue - Authority & Trust
    primaryLight: '#3B82F6',   // Bright Blue - Interactive elements
    primaryDark: '#1E3A8A',    // Deep Navy - Depth & stability
    
    // Secondary palette - Calming teals for balance
    secondary: '#0891B2',      // Professional Teal
    secondaryLight: '#06B6D4', // Bright Cyan - Highlights
    secondaryDark: '#0E7490',  // Deep Teal - Contrast
    
    // Surface & Background - Pure, clean foundation
    surface: '#FFFFFF',
    surfaceElevated: '#FEFEFE',
    surfaceVariant: '#F8FAFC',
    background: '#FFFFFF',
    backgroundSecondary: '#F1F5F9',
    
    // Interactive states
    accent: '#6366F1',         // Indigo - CTAs & focus states
    accentLight: '#8B5CF6',    // Purple - Premium highlights
    success: '#10B981',        // Emerald - Success states
    warning: '#F59E0B',        // Amber - Attention
    error: '#EF4444',          // Red - Errors
    
    // Borders & Dividers
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    borderFocus: '#3B82F6',
    
    // Shadows & Overlays
    shadow: '#0F172A',
    overlay: 'rgba(15, 23, 42, 0.6)',
    
    // Text hierarchy - Optimized for readability
    text: {
      primary: '#0F172A',      // High contrast headlines
      secondary: '#475569',    // Body text
      tertiary: '#64748B',     // Supporting text
      quaternary: '#94A3B8',   // Subtle text
      inverse: '#FFFFFF',      // Text on dark backgrounds
    },
    
    // Glassmorphism effects
    glass: {
      primary: 'rgba(255, 255, 255, 0.95)',
      secondary: 'rgba(255, 255, 255, 0.8)',
      border: 'rgba(255, 255, 255, 0.2)',
    }
  },
  dark: {
    // Primary palette - Accessible blues for dark mode
    primary: '#60A5FA',        // Light Blue - High contrast on dark
    primaryLight: '#93C5FD',   // Soft Blue - Gentle interactions
    primaryDark: '#3B82F6',    // Medium Blue - Depth
    
    // Secondary palette - Sophisticated teals
    secondary: '#22D3EE',      // Bright Cyan
    secondaryLight: '#67E8F9', // Light Cyan - Highlights  
    secondaryDark: '#0891B2',  // Professional Teal
    
    // Dark surfaces - Layered depth system
    surface: '#1E293B',        // Primary surface
    surfaceElevated: '#334155', // Elevated cards
    surfaceVariant: '#475569', // Subtle variants
    background: '#0F172A',     // Deep background
    backgroundSecondary: '#1E293B',
    
    // Interactive states - Optimized for dark mode
    accent: '#8B5CF6',         // Purple - Premium feel
    accentLight: '#A78BFA',    // Light Purple
    success: '#34D399',        // Bright Emerald
    warning: '#FBBF24',        // Bright Amber
    error: '#F87171',          // Soft Red
    
    // Borders optimized for dark themes
    border: '#334155',
    borderLight: '#475569',
    borderFocus: '#60A5FA',
    
    // Shadows & Overlays
    shadow: '#000000',
    overlay: 'rgba(0, 0, 0, 0.8)',
    
    // Text hierarchy - WCAG AAA compliant
    text: {
      primary: '#F8FAFC',      // High contrast
      secondary: '#CBD5E1',    // Standard body text
      tertiary: '#94A3B8',     // Supporting text
      quaternary: '#64748B',   // Subtle text
      inverse: '#0F172A',      // Text on light backgrounds
    },
    
    // Dark glassmorphism
    glass: {
      primary: 'rgba(30, 41, 59, 0.95)',
      secondary: 'rgba(30, 41, 59, 0.8)',
      border: 'rgba(255, 255, 255, 0.1)',
    }
  }
};

// Premium Typography System - Production-ready font stack
const TYPOGRAPHY = {
  // System font stack prioritizing platform natives then web-safe fallbacks
  fontFamily: {
    primary: Platform.select({
      ios: 'SF Pro Text',
      android: 'Roboto',
      default: 'System'
    }),
    secondary: Platform.select({
      ios: 'SF Pro Display', 
      android: 'Roboto',
      default: 'System'
    }),
    mono: Platform.select({
      ios: 'SF Mono',
      android: 'Roboto Mono', 
      default: 'monospace'
    })
  },
  
  // Refined scale for tab navigation
  tabLabel: {
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 0.4,
    lineHeight: 14,
  },
  
  tabLabelActive: {
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 0.3,
    lineHeight: 14,
  },
  
  // Accessibility badge text
  badge: {
    fontSize: 9,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
    lineHeight: 12,
  }
};

// Enhanced Animation Configuration - Butter-smooth 60fps
const ANIMATION = {
  spring: {
    gentle: { damping: 20, stiffness: 200, mass: 0.8 },
    bouncy: { damping: 15, stiffness: 300, mass: 0.5 },
    snappy: { damping: 25, stiffness: 400, mass: 0.3 },
  },
  timing: {
    fast: { duration: 150 },
    normal: { duration: 250 },
    slow: { duration: 400 },
    elastic: { duration: 600 },
  }
};

// Sophisticated Tab Icon with Premium Micro-interactions
interface AnimatedTabIconProps {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size: number;
  focused: boolean;
  routeName: string;
  isDark: boolean;
}

const AnimatedTabIcon: React.FC<AnimatedTabIconProps> = ({ 
  name, 
  color, 
  size, 
  focused, 
  routeName,
  isDark 
}) => {
  const colors = isDark ? COLORS.dark : COLORS.light;
  
  // Animation values for sophisticated micro-interactions
  const scale = useSharedValue(0.9);
  const translateY = useSharedValue(0);
  const iconOpacity = useSharedValue(0.7);
  const glowScale = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const rippleScale = useSharedValue(0);
  const rippleOpacity = useSharedValue(0);
  const backgroundScale = useSharedValue(0);
  const rotation = useSharedValue(0);

  // Enhanced animation sequence on focus change
  React.useEffect(() => {
    if (focused) {
      // Entry animation sequence
      scale.value = withSequence(
        withSpring(1.2, ANIMATION.spring.bouncy),
        withSpring(1.1, ANIMATION.spring.gentle)
      );
      
      translateY.value = withSpring(-4, ANIMATION.spring.gentle);
      iconOpacity.value = withTiming(1, ANIMATION.timing.fast);
      
      // Glow effect
      glowScale.value = withSequence(
        withTiming(0, { duration: 0 }),
        withSpring(1.3, ANIMATION.spring.bouncy)
      );
      glowOpacity.value = withTiming(0.6, ANIMATION.timing.normal);
      
      // Background highlight
      backgroundScale.value = withSpring(1, ANIMATION.spring.gentle);
      
      // Subtle ripple effect
      rippleScale.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1.5, ANIMATION.timing.slow)
      );
      rippleOpacity.value = withSequence(
        withTiming(0.4, ANIMATION.timing.fast),
        withDelay(200, withTiming(0, ANIMATION.timing.normal))
      );
      
      // Playful rotation for some icons
      if (routeName === 'Quiz') {
        rotation.value = withSequence(
          withTiming(5, ANIMATION.timing.fast),
          withTiming(0, ANIMATION.timing.normal)
        );
      }
    } else {
      // Exit animation
      scale.value = withSpring(0.9, ANIMATION.spring.gentle);
      translateY.value = withSpring(0, ANIMATION.spring.gentle);
      iconOpacity.value = withTiming(0.65, ANIMATION.timing.normal);
      glowScale.value = withTiming(0, ANIMATION.timing.fast);
      glowOpacity.value = withTiming(0, ANIMATION.timing.fast);
      backgroundScale.value = withTiming(0, ANIMATION.timing.normal);
      rotation.value = withTiming(0, ANIMATION.timing.normal);
    }
  }, [focused, routeName]);

  // Animated styles with smooth transitions
  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` }
    ],
    opacity: iconOpacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }));

  const rippleStyle = useAnimatedStyle(() => ({
    opacity: rippleOpacity.value,
    transform: [{ scale: rippleScale.value }],
  }));

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: focused ? 0.08 : 0,
    transform: [{ scale: backgroundScale.value }],
  }));

  const activeDotStyle = useAnimatedStyle(() => ({
    opacity: withTiming(focused ? 1 : 0, ANIMATION.timing.normal),
    transform: [{ 
      scale: withSpring(focused ? 1 : 0, ANIMATION.spring.gentle) 
    }],
  }));

  return (
    <View style={styles.tabIconContainer}>
      {/* Ripple effect for tap feedback */}
      <Animated.View 
        style={[
          styles.ripple, 
          rippleStyle, 
          { backgroundColor: color }
        ]} 
      />
      
      {/* Background highlight circle */}
      <Animated.View 
        style={[
          styles.iconBackground, 
          backgroundStyle, 
          { backgroundColor: color }
        ]} 
      />
      
      {/* Soft glow effect */}
      <Animated.View 
        style={[
          styles.iconGlow, 
          glowStyle, 
          { 
            backgroundColor: color,
            shadowColor: color,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 8,
          }
        ]} 
      />
      
      {/* Main icon with enhanced styling */}
      <Animated.View style={animatedIconStyle}>
        <Ionicons 
          name={name} 
          color={color} 
          size={size}
          style={{
            textShadowColor: focused ? colors.glass.border : 'transparent',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2,
          }}
        />
      </Animated.View>
      
      {/* Premium active indicator */}
      <Animated.View 
        style={[
          styles.activeDot, 
          activeDotStyle, 
          { 
            backgroundColor: color,
            shadowColor: color,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.4,
            shadowRadius: 3,
          }
        ]} 
      />
    </View>
  );
};

// World-Class Tab Background with Advanced Visual Effects
interface TabBackgroundProps {
  isDark: boolean;
  activeTab?: string;
}

const TabBackground: React.FC<TabBackgroundProps> = ({ isDark, activeTab }) => {
  const colors = isDark ? COLORS.dark : COLORS.light;
  const backgroundOpacity = useSharedValue(0);
  const gradientPosition = useSharedValue(0);

  React.useEffect(() => {
    backgroundOpacity.value = withTiming(1, ANIMATION.timing.slow);
    gradientPosition.value = withTiming(1, ANIMATION.timing.elastic);
  }, []);

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  const gradientStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      gradientPosition.value,
      [0, 1],
      [-screenWidth, screenWidth],
      Extrapolate.CLAMP
    );
    
    return {
      transform: [{ translateX }],
      opacity: 0.03,
    };
  });

  return (
    <Animated.View style={[styles.tabBackgroundContainer, backgroundStyle]}>
      {/* Native blur effect for supported platforms */}
      {Platform.OS === 'ios' ? (
        <BlurView 
          style={styles.blurLayer}
          intensity={95}
          tint={isDark ? 'dark' : 'light'}
        />
      ) : (
        <View 
          style={[
            styles.blurLayer,
            { backgroundColor: colors.glass.primary }
          ]}
        />
      )}
      
      {/* Multi-layer gradient system for depth */}
      <View 
        style={[
          styles.gradientBase,
          { backgroundColor: colors.surface }
        ]}
      />
      
      <Animated.View 
        style={[
          styles.gradientAccent,
          gradientStyle,
          { backgroundColor: colors.primary }
        ]}
      />
      
      <View 
        style={[
          styles.gradientOverlay,
          { backgroundColor: colors.primaryLight, opacity: 0.02 }
        ]}
      />
      
      {/* Premium top accent line with gradient */}
      <View style={styles.topAccentContainer}>
        <View 
          style={[
            styles.topAccentBase,
            { backgroundColor: colors.borderLight }
          ]}
        />
        <View 
          style={[
            styles.topAccentGradient,
            { backgroundColor: colors.primary }
          ]}
        />
      </View>
      
      {/* Sophisticated border system */}
      <View 
        style={[
          styles.topBorder,
          { backgroundColor: colors.glass.border }
        ]}
      />
      
      {/* Inner glow for premium depth */}
      <View 
        style={[
          styles.innerGlow,
          { 
            backgroundColor: colors.primary,
            opacity: isDark ? 0.03 : 0.02,
          }
        ]}
      />
      
      {/* Bottom gradient fade */}
      <View 
        style={[
          styles.bottomGradient,
          { backgroundColor: colors.background, opacity: 0.1 }
        ]}
      />
    </Animated.View>
  );
};

// Enhanced Tab Label with Typography Excellence
interface AnimatedTabLabelProps {
  label: string;
  focused: boolean;
  color: string;
  isDark: boolean;
}

const AnimatedTabLabel: React.FC<AnimatedTabLabelProps> = ({ 
  label, 
  focused, 
  color,
  isDark 
}) => {
  const colors = isDark ? COLORS.dark : COLORS.light;
  const opacity = useSharedValue(0.7);
  const scale = useSharedValue(0.95);
  const letterSpacing = useSharedValue(0.4);

  React.useEffect(() => {
    opacity.value = withTiming(focused ? 1 : 0.65, ANIMATION.timing.normal);
    scale.value = withSpring(focused ? 1 : 0.95, ANIMATION.spring.gentle);
    letterSpacing.value = withTiming(focused ? 0.3 : 0.4, ANIMATION.timing.normal);
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Text
        style={[
          focused ? TYPOGRAPHY.tabLabelActive : TYPOGRAPHY.tabLabel,
          {
            color: color,
            fontFamily: TYPOGRAPHY.fontFamily.primary,
            letterSpacing: letterSpacing.value,
            textAlign: 'center',
            includeFontPadding: false,
            textAlignVertical: 'center',
          }
        ]}
        numberOfLines={1}
        allowFontScaling={false}
      >
        {label}
      </Text>
    </Animated.View>
  );
};

// Main Navigator Component
const MainTabNavigator: React.FC = () => {
  const { theme } = useTheme();
  const activeTab = useSharedValue('Home');
  
  // Robust theme detection with fallback
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

  // Enhanced icon mapping with better semantics
  const getTabIcon = (routeName: string, focused: boolean): keyof typeof Ionicons.glyphMap => {
    const iconMap: Record<string, { focused: keyof typeof Ionicons.glyphMap; unfocused: keyof typeof Ionicons.glyphMap }> = {
      Home: { focused: 'home', unfocused: 'home-outline' },
      Courses: { focused: 'library', unfocused: 'library-outline' },
      Quiz: { focused: 'flash', unfocused: 'flash-outline' },
      Profile: { focused: 'person-circle', unfocused: 'person-circle-outline' },
    };
    
    return focused ? iconMap[routeName]?.focused : iconMap[routeName]?.unfocused || 'home-outline';
  };

  // Tab labels for consistent branding
  const getTabLabel = (routeName: string): string => {
    const labelMap: Record<string, string> = {
      Home: 'Home',
      Courses: 'Learn',
      Quiz: 'Practice', 
      Profile: 'Profile',
    };
    return labelMap[routeName] || routeName;
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
            // Enhanced shadows for premium feel
            ...(Platform.OS === 'ios' && {
              shadowOffset: { width: 0, height: -8 },
              shadowOpacity: isDark ? 0.3 : 0.15,
              shadowRadius: 24,
            }),
            ...(Platform.OS === 'android' && {
              elevation: 32,
            }),
          }
        ],
        tabBarLabelStyle: { opacity: 0 }, // Hide default labels
        tabBarIcon: ({ color, size, focused }) => {
          const iconName = getTabIcon(route.name, focused);
          
          return (
            <View style={styles.tabItemContainer}>
              <AnimatedTabIcon 
                name={iconName}
                color={color} 
                size={focused ? 28 : 24} 
                focused={focused}
                routeName={route.name}
                isDark={isDark}
              />
              <AnimatedTabLabel
                label={getTabLabel(route.name)}
                focused={focused}
                color={color}
                isDark={isDark}
              />
            </View>
          );
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarBackground: () => <TabBackground isDark={isDark} activeTab={route.name} />,
        tabBarItemStyle: {
          paddingTop: 12,
          paddingBottom: 8,
          marginHorizontal: 4,
        },
        // Enhanced accessibility
        tabBarAccessibilityLabel: `${getTabLabel(route.name)} Tab`,
        tabBarTestID: `tab-${route.name.toLowerCase()}`,
      })}
      screenListeners={{
        state: (e) => {
          const routeName = e.data?.state?.routes[e.data.state.index]?.name;
          if (routeName) {
            activeTab.value = routeName;
          }
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeNavigator} 
        options={{
          tabBarAccessibilityLabel: 'Home Tab - Navigate to dashboard and overview',
        }}
      />
      <Tab.Screen 
        name="Courses" 
        component={CourseNavigator} 
        options={{
          tabBarAccessibilityLabel: 'Learn Tab - Browse courses and learning content',
        }}
      />
      <Tab.Screen 
        name="Quiz" 
        component={QuizNavigator} 
        options={{
          tabBarAccessibilityLabel: 'Practice Tab - Take quizzes and practice exercises',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileNavigator} 
        options={{
          tabBarAccessibilityLabel: 'Profile Tab - View and edit personal information',
        }}
      />
    </Tab.Navigator>
  );
};

// World-Class StyleSheet - Production-ready and optimized
const styles = StyleSheet.create({
  // Tab Bar Foundation
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    paddingTop: 16,
    paddingHorizontal: 12,
    height: Platform.OS === 'ios' ? 98 : 80,
    borderTopWidth: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    zIndex: 10,
  },
  
  // Tab Item Layout
  tabItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minHeight: 56,
  },
  
  // Icon Container with Perfect Spacing
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 48,
    height: 32,
    marginBottom: 6,
  },
  
  // Enhanced Visual Effects
  ripple: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    opacity: 0,
  },
  
  iconBackground: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    opacity: 0,
  },
  
  iconGlow: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    opacity: 0,
  },
  
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
    position: 'absolute',
    bottom: -2,
    opacity: 0,
  },
  
  // Background System - Multi-layer Architecture
  tabBackgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  
  blurLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  
  gradientBase: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.95,
  },
  
  gradientAccent: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.03,
  },
  
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  
  // Premium Top Accent System
  topAccentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  
  topAccentBase: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
  },
  
  topAccentGradient: {
    position: 'absolute',
    top: 0,
    left: '25%',
    right: '25%',
    height: 3,
    borderRadius: 1.5,
    opacity: 0.8,
  },
  
  topBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    opacity: 0.15,
  },
  
  innerGlow: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    height: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
});

export default MainTabNavigator;