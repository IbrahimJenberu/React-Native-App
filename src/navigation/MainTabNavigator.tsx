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

// Premium Calming Color System - FULLY SOLID Backgrounds
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
    
    // Tab-specific colors - COMPLETELY SOLID (NO transparency at all)
    tabBar: {
      background: '#2563EB',      // SOLID rich blue background
      backgroundSecondary: '#1D4ED8', // SOLID deeper blue gradient
      border: '#FFFFFF',          // SOLID white border
      shadow: 'rgba(15, 23, 42, 0.3)',
      iconActive: '#FFFFFF',
      iconInactive: '#E2E8F0',    // SOLID light gray
      textActive: '#FFFFFF', 
      textInactive: '#E2E8F0',    // SOLID light gray
      accent: '#60A5FA',          // SOLID accent color
    },
    
    // Enhanced glassmorphism
    glass: {
      primary: '#2563EB',  // SOLID
      secondary: '#1D4ED8', // SOLID
      border: '#FFFFFF',   // SOLID
      backdrop: '#2563EB', // SOLID
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
    
    // Tab-specific dark colors - COMPLETELY SOLID (NO transparency at all)
    tabBar: {
      background: '#334155',       // SOLID rich dark background
      backgroundSecondary: '#1E293B', // SOLID deeper dark gradient
      border: '#475569',          // SOLID border
      shadow: 'rgba(0, 0, 0, 0.5)',
      iconActive: '#FFFFFF',
      iconInactive: '#CBD5E1',    // SOLID light gray
      textActive: '#FFFFFF',
      textInactive: '#CBD5E1',    // SOLID light gray
      accent: '#3B82F6',          // SOLID accent
    },
    
    // Dark glassmorphism
    glass: {
      primary: '#334155',   // SOLID
      secondary: '#1E293B', // SOLID
      border: '#475569',    // SOLID
      backdrop: '#334155',  // SOLID
    }
  }
};

// Enhanced Typography System - MEDIUM SIZES for Better Visibility
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
  
  // MEDIUM sized tab labels - No more tiny text!
  tabLabel: {
    fontSize: 12,             // Increased from 9 to 12
    fontWeight: '600' as const,
    letterSpacing: 0.3,       
    lineHeight: 14,           
  },
  
  tabLabelActive: {
    fontSize: 12,             // Increased from 9 to 12
    fontWeight: '700' as const,
    letterSpacing: 0.2,       
    lineHeight: 14,
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

// Enhanced Tab Icon with MEDIUM Sizes
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

// Premium Tab Background - COMPLETELY SOLID
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
      {/* PRIMARY COMPLETELY SOLID Background */}
      <View 
        style={[
          styles.primaryBackground,
          { backgroundColor: colors.tabBar.background }  // COMPLETELY SOLID
        ]}
      />
      
      {/* SECONDARY COMPLETELY SOLID Layer */}
      <View 
        style={[
          styles.secondaryBackground,
          { backgroundColor: colors.tabBar.backgroundSecondary }  // COMPLETELY SOLID
        ]}
      />
      
      {/* SOLID Moving Accent */}
      <Animated.View 
        style={[
          styles.accentGradient,
          gradientStyle,
          { 
            backgroundColor: colors.tabBar.accent,  // SOLID COLOR
          }
        ]}
      />
      
      {/* SOLID Top Border */}
      <View style={styles.topBorderContainer}>
        <View 
          style={[
            styles.topBorder,
            { backgroundColor: colors.tabBar.border }  // SOLID BORDER
          ]}
        />
        <View 
          style={[
            styles.topHighlight,
            { backgroundColor: colors.tabBar.border }  // SOLID HIGHLIGHT
          ]}
        />
      </View>
      
      {/* SOLID Inner Accent */}
      <View 
        style={[
          styles.innerGlow,
          { 
            backgroundColor: colors.tabBar.accent,  // SOLID ACCENT
          }
        ]}
      />
    </Animated.View>
  );
};

// Enhanced Tab Label - MEDIUM Size with Full Visibility
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

  return (
    <Animated.View style={[styles.labelContainer, animatedStyle]}>
      <Text
        style={[
          focused ? TYPOGRAPHY.tabLabelActive : TYPOGRAPHY.tabLabel,
          {
            color: color,
            fontFamily: TYPOGRAPHY.fontFamily.primary,
            textAlign: 'center',
            includeFontPadding: false,
            textAlignVertical: 'center',
            textShadowColor: 'rgba(0, 0, 0, 0.5)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2,
          }
        ]}
        numberOfLines={1}
        allowFontScaling={false}
        adjustsFontSizeToFit={true}  
        minimumFontScale={0.9}       // Higher minimum scale
      >
        {label}
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
              shadowOpacity: 0.3,
              shadowRadius: 20,
            }),
            ...(Platform.OS === 'android' && {
              elevation: 20,
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
                size={focused ? 28 : 26}  // MEDIUM sizes: 26/28 instead of 22/24
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
          paddingTop: 10,
          paddingBottom: 8,
          marginHorizontal: 4,
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

// Enhanced StyleSheet - MEDIUM Sizes & SOLID Backgrounds
const styles = StyleSheet.create({
  // Tab Bar - LARGER for Medium Sizes
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    paddingTop: 14,
    paddingHorizontal: 16,
    height: Platform.OS === 'ios' ? 92 : 78, // INCREASED height for medium sizes
    borderTopWidth: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    zIndex: 10,
  },
  
  // Tab Item Layout - More Space for Medium Elements
  tabItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3,
    minHeight: 58,  // INCREASED for medium elements
    width: '100%',
    flex: 1,
  },
  
  // Icon Container - MEDIUM Size
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 48,      // INCREASED from 40 to 48
    height: 30,     // INCREASED from 26 to 30
    marginBottom: 4,
  },
  
  // Label Container - WIDER for Medium Text
  labelContainer: {
    width: '100%',
    minHeight: 16,      // INCREASED minimum height
    maxWidth: 72,       // INCREASED max width for "Practice"
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  
  // Enhanced Effects for Medium Icons
  iconShadow: {
    position: 'absolute',
    width: 32,      // INCREASED from 28 to 32
    height: 32,     // INCREASED from 28 to 32
    borderRadius: 16,
    opacity: 0,
  },
  
  iconGlow: {
    position: 'absolute',
    width: 36,      // INCREASED from 32 to 36
    height: 36,     // INCREASED from 32 to 36
    borderRadius: 18,
    opacity: 0,
  },
  
  // COMPLETELY SOLID Background System
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
  
  // COMPLETELY SOLID Primary Background
  primaryBackground: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    opacity: 1.0,  // COMPLETELY SOLID
  },
  
  // COMPLETELY SOLID Secondary Layer
  secondaryBackground: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    opacity: 0.9,  // HIGH OPACITY for solid look
  },
  
  // SOLID Moving Accent
  accentGradient: {
    position: 'absolute',
    top: 0,
    width: screenWidth * 1.5,
    height: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    opacity: 0.15,  // HIGHER opacity for visibility
  },
  
  // SOLID Top Border System
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
    opacity: 1.0,  // COMPLETELY SOLID
  },
  
  topHighlight: {
    position: 'absolute',
    top: 1,
    left: 0,
    right: 0,
    height: 2,
    opacity: 0.8,  // HIGH OPACITY
  },
  
  // SOLID Inner Accent
  innerGlow: {
    position: 'absolute',
    top: 3,
    left: 0,
    right: 0,
    height: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    opacity: 0.1,  // HIGHER opacity for definition
  },
});

export default MainTabNavigator;