// src/screens/auth/WelcomeScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Animated,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import Button from '../../components/ui/Button';
import { WelcomeScreenProps } from '../../navigation/types';
import { motivationalQuotes } from '../../mocks/quotesData';

const { width, height } = Dimensions.get('window');

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [quote, setQuote] = useState(motivationalQuotes[0]);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;
  const quoteAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  // Detect if it's dark mode based on theme
  const isDark = theme.colors.background === '#000000' || 
                 theme.colors.background === '#0F172A' || 
                 theme.colors.textPrimary === '#FFFFFF' ||
                 theme.colors.textPrimary === '#F8FAFC';

  // Premium education-focused color palette
  const colors = {
    light: {
      primary: '#4F46E5',
      secondary: '#06B6D4',
      accent: '#10B981',
      background: '#4F46E5',
      backgroundGradient: '#6366F1',
      cardBg: 'rgba(255, 255, 255, 0.90)',
      cardBorder: 'rgba(255, 255, 255, 0.50)',
      textPrimary: '#FFFFFF',
      textSecondary: '#1F2937',
      textMuted: 'rgba(255, 255, 255, 0.8)',
      shadow: 'rgba(0, 0, 0, 0.1)',
      buttonPrimary: '#FFFFFF',
      buttonPrimaryText: '#4F46E5',
      buttonSecondary: 'rgba(255, 255, 255, 0.15)',
      buttonSecondaryBorder: 'rgba(255, 255, 255, 0.3)',
    },
    dark: {
      primary: '#6366F1',
      secondary: '#22D3EE',
      accent: '#34D399',
      background: '#0F172A',
      backgroundGradient: '#1E293B',
      cardBg: 'rgba(30, 41, 59, 0.95)',
      cardBorder: 'rgba(148, 163, 184, 0.20)',
      textPrimary: '#F8FAFC',
      textSecondary: '#F8FAFC',
      textMuted: 'rgba(248, 250, 252, 0.7)',
      shadow: 'rgba(0, 0, 0, 0.3)',
      buttonPrimary: '#6366F1',
      buttonPrimaryText: '#FFFFFF',
      buttonSecondary: 'rgba(99, 102, 241, 0.15)',
      buttonSecondaryBorder: 'rgba(99, 102, 241, 0.3)',
    }
  };

  const currentColors = isDark ? colors.dark : colors.light;
  
  useEffect(() => {
    // Get random quote on mount
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setQuote(motivationalQuotes[randomIndex]);

    // Staggered entrance animations
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(quoteAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  const handleLogin = () => {
    navigation.navigate('Login');
  };
  
  const handleRegister = () => {
    navigation.navigate('Register');
  };
  
  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Subtle Background Gradient */}
      <View style={[styles.gradientOverlay, { 
        backgroundColor: currentColors.backgroundGradient,
        opacity: 0.4,
      }]} />

      {/* Minimal Floating Elements */}
      <View style={styles.floatingElements}>
        <Animated.View style={[
          styles.floatingCircle, 
          { 
            top: height * 0.15, 
            right: width * 0.85,
            backgroundColor: currentColors.accent + '20',
            opacity: fadeAnim,
          }
        ]} />
        <Animated.View style={[
          styles.floatingCircle, 
          { 
            bottom: height * 0.25, 
            left: width * 0.05,
            backgroundColor: currentColors.secondary + '15',
            opacity: fadeAnim,
          }
        ]} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          {/* Logo Section - Compact Design */}
          <Animated.View style={[
            styles.logoSection,
            {
              opacity: logoAnim,
              transform: [{
                scale: logoAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                })
              }]
            }
          ]}>
            <View style={[styles.logoContainer, {
              backgroundColor: currentColors.cardBg,
              borderColor: currentColors.cardBorder,
              shadowColor: currentColors.shadow,
            }]}>
              <View style={[styles.logoIcon, {
                backgroundColor: currentColors.primary,
              }]}>
                <Text style={styles.logoEmoji}>🎓</Text>
              </View>
              <Text style={[styles.logoText, {
                color: currentColors.textSecondary,
              }]}>TopScorer</Text>
              <Text style={[styles.logoSubtext, {
                color: currentColors.textSecondary,
                opacity: 0.7,
              }]}>Excel in Every Subject</Text>
            </View>
          </Animated.View>
          
          {/* Quote Section - Improved Layout */}
          <Animated.View style={[
            styles.quoteSection,
            {
              opacity: quoteAnim,
              transform: [{
                translateY: quoteAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                })
              }]
            }
          ]}>
            <View style={[styles.quoteCard, {
              backgroundColor: currentColors.cardBg,
              borderColor: currentColors.cardBorder,
              shadowColor: currentColors.shadow,
            }]}>
              <View style={styles.quoteHeader}>
                <Text style={styles.quoteIcon}>💡</Text>
                <Text style={[styles.quoteLabel, {
                  color: currentColors.textSecondary,
                  opacity: 0.6,
                }]}>Daily Inspiration</Text>
              </View>
              
              <Text style={[styles.quoteText, {
                color: currentColors.textSecondary,
              }]}>"{quote.text}"</Text>
              
              <Text style={[styles.quoteAuthor, {
                color: currentColors.textSecondary,
                opacity: 0.7,
              }]}>— {quote.author}</Text>
            </View>
          </Animated.View>
          
          {/* Action Buttons - Clean Design */}
          <Animated.View style={[
            styles.buttonSection,
            {
              opacity: buttonAnim,
              transform: [{
                translateY: buttonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                })
              }]
            }
          ]}>
            <TouchableOpacity
              style={[styles.primaryButton, {
                backgroundColor: currentColors.buttonPrimary,
                shadowColor: currentColors.shadow,
              }]}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <View>
                  <Text style={[styles.primaryButtonText, {
                    color: currentColors.buttonPrimaryText,
                  }]}>
                    Sign In
                  </Text>
                  <Text style={[styles.buttonSubtext, {
                    color: currentColors.buttonPrimaryText,
                    opacity: 0.7,
                  }]}>
                    Continue your learning
                  </Text>
                </View>
                <View style={[styles.buttonIcon, {
                  backgroundColor: currentColors.buttonPrimaryText + '15',
                }]}>
                  <Text style={[styles.buttonIconText, {
                    color: currentColors.buttonPrimaryText,
                  }]}>→</Text>
                </View>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.secondaryButton, {
                backgroundColor: currentColors.buttonSecondary,
                borderColor: currentColors.buttonSecondaryBorder,
              }]}
              onPress={handleRegister}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <View>
                  <Text style={[styles.secondaryButtonText, {
                    color: currentColors.textPrimary,
                  }]}>
                    Create Account
                  </Text>
                  <Text style={[styles.buttonSubtext, {
                    color: currentColors.textPrimary,
                    opacity: 0.7,
                  }]}>
                    Start your journey
                  </Text>
                </View>
                <View style={styles.secondaryButtonIcon}>
                  <Text style={[styles.buttonIconText, {
                    color: currentColors.textPrimary,
                  }]}>✨</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Bottom Features - Simple Icon + Text Only */}
          <View style={styles.featuresContainer}>
            {[
              { icon: '📚', text: 'Expert Content' },
              { icon: '🏆', text: 'Track Progress' },
              { icon: '💯', text: 'Top Scores' },
            ].map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <Text style={[styles.featureText, {
                  color: currentColors.textMuted,
                }]}>{feature.text}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  floatingElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  floatingCircle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 60 : 40,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 32,
    borderRadius: 20,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  logoIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoEmoji: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  logoSubtext: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  quoteSection: {
    marginVertical: 20,
  },
  quoteCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  quoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  quoteIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  quoteLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  quoteText: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  quoteAuthor: {
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'italic',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  buttonSection: {
    marginBottom: 20,
  },
  primaryButton: {
    borderRadius: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  buttonSubtext: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  buttonIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIconText: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderRadius: 16,
    borderWidth: 1.5,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  secondaryButtonIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: 18,
    marginBottom: 6,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
});

export default WelcomeScreen;