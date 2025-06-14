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
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

const Tab = createBottomTabNavigator<MainTabParamList>();
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Premium Calming Color System - Blues, Teals, Greens, Purples
const COLORS = {
  light: {
    // Calming Blue Gradient - Professional & Trustworthy
    primary: '#2563EB',        // Vibrant Blue - Clear authority
    primaryLight: '#60A5FA',   // Soft Blue - Gentle interactions
    primaryDark: '#1D4ED8',    // Deep Blue - Stability
    
    // Soothing Teal Accents - Balance & Focus
    secondary: '#0D9488',      // Professional Teal
    secondaryLight: '#2DD4BF', // Bright Teal - Highlights
    secondaryDark: '#0F766E',  // Deep Teal - Depth
    
    // Fresh Green Support - Growth & Positivity
    tertiary: '#059669',       // Emerald Green
    tertiaryLight: '#34D399',  // Light Green - Success
    tertiaryDark: '#047857',   // Deep Green - Stability
    
    // Elegant Purple Touch - Creativity & Premium
    quaternary: '#7C3AED',     // Royal Purple
    quaternaryLight: '#A78BFA', // Soft Purple - Highlights
    quaternaryDark: '#6D28D9', // Deep Purple - Luxury
    
    // Clean Surfaces - Pure & Minimal
    surface: '#FFFFFF',
    background: '#FFFFFF',
    
    // Tab-specific colors - Sophisticated gradient background
    tabBar: {
      background: 'rgba(37, 99, 235, 0.95)',      // Rich blue background
      backgroundSecondary: 'rgba(29, 78, 216, 0.98)', // Deeper blue gradient
      border: 'rgba(255, 255, 255, 0.2)',
      shadow: 'rgba(15, 23, 42, 0.15)',
      iconActive: '#FFFFFF',
      iconInactive: 'rgba(255, 255, 255, 0.7)',
      textActive: '#FFFFFF', 
      textInactive: 'rgba(255, 255, 255, 0.8)',
      accent: 'rgba(96, 165, 250, 0.3)',
    },
    
    // Enhanced glassmorphism
    glass: {
      primary: 'rgba(37, 99, 235, 0.95)',
      secondary: 'rgba(37, 99, 235, 0.85)',
      border: 'rgba(255, 255, 255, 0.2)',
      backdrop: 'rgba(37, 99, 235, 0.1)',
    }
  },
  dark: {
    // Refined Blue Palette - High Contrast Dark Mode
    primary: '#3B82F6',        // Bright Blue - Accessible
    primaryLight: '#60A5FA',   // Soft Blue - Gentle
    primaryDark: '#1D4ED8',    // Deep Blue - Contrast
    
    // Sophisticated Teal - Dark Mode Optimized
    secondary: '#14B8A6',      // Bright Teal
    secondaryLight: '#2DD4BF', // Light Teal - Highlights
    secondaryDark: '#0D9488',  // Professional Teal
    
    // Vibrant Green - Dark Mode Balance
    tertiary: '#10B981',       // Bright Emerald
    tertiaryLight: '#34D399',  // Light Green
    tertiaryDark: '#059669',   // Deep Green
    
    // Premium Purple - Dark Elegance
    quaternary: '#8B5CF6',     // Bright Purple
    quaternaryLight: '#A78BFA', // Soft Purple
    quaternaryDark: '#7C3AED', // Royal Purple
    
    // Sophisticated Dark Surfaces
    surface: '#1E293B',
    background: '#0F172A',
    
    // Tab-specific dark colors - Rich dark gradient
    tabBar: {
      background: 'rgba(30, 41, 59, 0.95)',       // Rich dark background
      backgroundSecondary: 'rgba(15, 23, 42, 0.98)', // Deeper dark gradient
      border: 'rgba(255, 255, 255, 0.1)',
      shadow: 'rgba(0, 0, 0, 0.4)',
      iconActive: '#FFFFFF',
      iconInactive: 'rgba(255, 255, 255, 0.7)',
      textActive: '#FFFFFF',
      textInactive: 'rgba(255, 255, 255, 0.8)',
      accent: 'rgba(59, 130, 246, 0.3)',
    },
    
    // Dark glassmorphism
    glass: {
      primary: 'rgba(30, 41, 59, 0.95)',
      secondary: 'rgba(30, 41, 59, 0.85)',
      border: 'rgba(255, 255, 255, 0.1)',
      backdrop: 'rgba(30, 41, 59, 0.1)',
    }
  }
};

// Enhanced Typography System - Better Text Visibility
const TYPOGRAPHY = {
  fontFamily: {
    primary: Platform.select({
      ios: 'SF Pro Text',
      android: 'Roboto',
      default: 'System'
    }),
    display: Platform.select({
      ios: 'SF Pro Display', 
      android: 'Roboto',
      default: 'System'
    }),
  },
  
  // Improved tab labels with better sizing
  tabLabel: {
    fontSize: 10,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
    lineHeight: 12,
  },
  
  tabLabelActive: {
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: 0.2,
    lineHeight: 12,
  },
};

// Smooth Animation Configuration
const ANIMATION = {
  spring: {
    gentle: { damping: 22, stiffness: 180, mass: 0.8 },
    bouncy: { damping: 15, stiffness: 300, mass: 0.5 },
    snappy: { damping: 25, stiffness: 400, mass: 0.3 },
  },
  timing: {
    fast: { duration: 150 },
    normal: { duration: 200 },
    slow: { duration: 350 },
  }
};

// Enhanced Tab Icon with 3D Effects
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
  
  // Smooth animation values
  const scale = useSharedValue(0.9);
  const translateY = useSharedValue(0);
  const iconOpacity = useSharedValue(0.7);
  const glowOpacity = useSharedValue(0);
  const glowScale = useSharedValue(0);
  const rotation = useSharedValue(0);
  const shadowOpacity = useSharedValue(0);

  React.useEffect(() => {
    if (focused) {
      // Smooth entry animations
      scale.value = withSequence(
        withSpring(1.15, ANIMATION.spring.bouncy),
        withSpring(1.05, ANIMATION.spring.gentle)
      );
      
      translateY.value = withSpring(-2, ANIMATION.spring.gentle);
      iconOpacity.value = withTiming(1, ANIMATION.timing.normal);
      shadowOpacity.value = withTiming(0.4, ANIMATION.timing.normal);
      
      // Enhanced glow effect
      glowScale.value = withSpring(1.2, ANIMATION.spring.gentle);
      glowOpacity.value = withTiming(0.6, ANIMATION.timing.normal);
      
      // Subtle rotation for Quiz icon
      if (routeName === 'Quiz') {
        rotation.value = withSequence(
          withTiming(3, ANIMATION.timing.fast),
          withTiming(0, ANIMATION.timing.normal)
        );
      }
    } else {
      // Smooth exit animations
      scale.value = withSpring(0.9, ANIMATION.spring.gentle);
      translateY.value = withSpring(0, ANIMATION.spring.gentle);
      iconOpacity.value = withTiming(0.7, ANIMATION.timing.normal);
      shadowOpacity.value = withTiming(0, ANIMATION.timing.normal);
      glowScale.value = withTiming(0, ANIMATION.timing.fast);
      glowOpacity.value = withTiming(0, ANIMATION.timing.fast);
      rotation.value = withTiming(0, ANIMATION.timing.normal);
    }
  }, [focused, routeName]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` }
    ],
    opacity: iconOpacity.value,
  }));

  const shadowStyle = useAnimatedStyle(() => ({
    opacity: shadowOpacity.value,
    transform: [
      { scale: scale.value * 1.1 },
      { translateY: translateY.value + 4 },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }));

  return (
    <View style={styles.tabIconContainer}>
      {/* 3D Shadow Effect */}
      <Animated.View 
        style={[
          styles.iconShadow, 
          shadowStyle, 
          { backgroundColor: 'rgba(0, 0, 0, 0.2)' }
        ]} 
      />
      
      {/* Soft Glow Effect */}
      <Animated.View 
        style={[
          styles.iconGlow, 
          glowStyle, 
          { 
            backgroundColor: color,
            shadowColor: color,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 12,
          }
        ]} 
      />
      
      {/* Main Icon */}
      <Animated.View style={animatedIconStyle}>
        <Ionicons 
          name={name} 
          color={color} 
          size={size}
          style={{
            textShadowColor: 'rgba(0, 0, 0, 0.3)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 3,
          }}
        />
      </Animated.View>
    </View>
  );
};

// Premium Tab Background with 3D Depth
interface TabBackgroundProps {
  isDark: boolean;
}

const TabBackground: React.FC<TabBackgroundProps> = ({ isDark }) => {
  const colors = isDark ? COLORS.dark : COLORS.light;
  const backgroundOpacity = useSharedValue(0);
  const gradientPosition = useSharedValue(0);

  React.useEffect(() => {
    backgroundOpacity.value = withTiming(1, ANIMATION.timing.slow);
    gradientPosition.value = withTiming(1, { duration: 800 });
  }, []);

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  const gradientStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      gradientPosition.value,
      [0, 1],
      [-screenWidth * 0.3, screenWidth * 0.3],
      Extrapolate.CLAMP
    );
    
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <Animated.View style={[styles.tabBackgroundContainer, backgroundStyle]}>
      {/* Primary Background - Rich Gradient */}
      <View 
        style={[
          styles.primaryBackground,
          { backgroundColor: colors.tabBar.background }
        ]}
      />
      
      {/* Secondary Gradient Layer */}
      <View 
        style={[
          styles.secondaryBackground,
          { backgroundColor: colors.tabBar.backgroundSecondary }
        ]}
      />
      
      {/* Moving Accent Gradient */}
      <Animated.View 
        style={[
          styles.accentGradient,
          gradientStyle,
          { 
            backgroundColor: colors.tabBar.accent,
            opacity: 0.4
          }
        ]}
      />
      
      {/* Top Border with 3D Effect */}
      <View style={styles.topBorderContainer}>
        <View 
          style={[
            styles.topBorder,
            { backgroundColor: colors.tabBar.border }
          ]}
        />
        <View 
          style={[
            styles.topHighlight,
            { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
          ]}
        />
      </View>
      
      {/* Inner Glow for Depth */}
      <View 
        style={[
          styles.innerGlow,
          { 
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          }
        ]}
      />
    </Animated.View>
  );
};

// Enhanced Tab Label with Perfect Text Visibility
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
  const opacity = useSharedValue(0.8);
  const scale = useSharedValue(0.95);

  React.useEffect(() => {
    opacity.value = withTiming(focused ? 1 : 0.8, ANIMATION.timing.normal);
    scale.value = withSpring(focused ? 1 : 0.95, ANIMATION.spring.gentle);
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  // Truncate long labels intelligently
  const truncatedLabel = React.useMemo(() => {
    if (label.length > 8) {
      return label.substring(0, 7) + '...';
    }
    return label;
  }, [label]);

  return (
    <Animated.View style={animatedStyle}>
      <Text
        style={[
          focused ? TYPOGRAPHY.tabLabelActive : TYPOGRAPHY.tabLabel,
          {
            color: color,
            fontFamily: TYPOGRAPHY.fontFamily.primary,
            textAlign: 'center',
            includeFontPadding: false,
            textAlignVertical: 'center',
            textShadowColor: 'rgba(0, 0, 0, 0.3)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2,
          }
        ]}
        numberOfLines={1}
        allowFontScaling={false}
        ellipsizeMode="tail"
      >
        {truncatedLabel}
      </Text>
    </Animated.View>
  );
};

// Main Navigator Component
const MainTabNavigator: React.FC = () => {
  const { theme } = useTheme();
  
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
        tabBarActiveTintColor: colors.tabBar.iconActive,
        tabBarInactiveTintColor: colors.tabBar.iconInactive,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: 'transparent',
            shadowColor: colors.tabBar.shadow,
            borderTopColor: 'transparent',
            ...(Platform.OS === 'ios' && {
              shadowOffset: { width: 0, height: -8 },
              shadowOpacity: 0.25,
              shadowRadius: 20,
            }),
            ...(Platform.OS === 'android' && {
              elevation: 16,
            }),
          }
        ],
        tabBarLabelStyle: { opacity: 0 },
        tabBarIcon: ({ color, size, focused }) => {
          const iconName = getTabIcon(route.name, focused);
          
          return (
            <View style={styles.tabItemContainer}>
              <AnimatedTabIcon 
                name={iconName}
                color={color} 
                size={focused ? 24 : 22} 
                focused={focused}
                routeName={route.name}
                isDark={isDark}
              />
              <AnimatedTabLabel
                label={getTabLabel(route.name)}
                focused={focused}
                color={focused ? colors.tabBar.textActive : colors.tabBar.textInactive}
                isDark={isDark}
              />
            </View>
          );
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarBackground: () => <TabBackground isDark={isDark} />,
        tabBarItemStyle: {
          paddingTop: 8,
          paddingBottom: 6,
          marginHorizontal: 2,
        },
        tabBarAccessibilityLabel: `${getTabLabel(route.name)} Tab`,
        tabBarTestID: `tab-${route.name.toLowerCase()}`,
      })}
    >
      <Tab.Screen name="Home" component={HomeNavigator} />
      <Tab.Screen name="Courses" component={CourseNavigator} />
      <Tab.Screen name="Quiz" component={QuizNavigator} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
};

// Refined StyleSheet with Perfect Spacing and 3D Effects
const styles = StyleSheet.create({
  // Reduced Tab Bar - Compact & Clean
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingTop: 12,
    paddingHorizontal: 16,
    height: Platform.OS === 'ios' ? 78 : 68, // Reduced height
    borderTopWidth: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    zIndex: 10,
  },
  
  // Tab Item Layout - Perfect Spacing
  tabItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    minHeight: 50,
    width: '100%',
  },
  
  // Icon Container - Optimized Size
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 40,
    height: 26,
    marginBottom: 4,
  },
  
  // 3D Shadow Effect
  iconShadow: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    opacity: 0,
  },
  
  // Enhanced Glow Effect
  iconGlow: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    opacity: 0,
  },
  
  // Premium Background System
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
  
  // Rich Primary Background
  primaryBackground: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  
  // Gradient Secondary Layer
  secondaryBackground: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    opacity: 0.8,
  },
  
  // Moving Accent Gradient
  accentGradient: {
    position: 'absolute',
    top: 0,
    width: screenWidth * 1.5,
    height: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  
  // 3D Top Border System
  topBorderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  
  topBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    opacity: 0.6,
  },
  
  topHighlight: {
    position: 'absolute',
    top: 1,
    left: 0,
    right: 0,
    height: 2,
    opacity: 0.3,
  },
  
  // Inner Glow for Depth
  innerGlow: {
    position: 'absolute',
    top: 3,
    left: 0,
    right: 0,
    height: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default MainTabNavigator;