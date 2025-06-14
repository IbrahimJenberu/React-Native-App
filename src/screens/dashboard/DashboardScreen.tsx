// src/screens/dashboard/DashboardScreen.tsx
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { DashboardScreenProps } from '../../navigation/types';
import { fetchCoursesSuccess } from '../../store/slices/courseSlice';
import { fetchQuizzesSuccess } from '../../store/slices/quizSlice';
import { mockCourses } from '../../mocks/courseData';
import { mockQuizzes, mockQuizResults } from '../../mocks/quizData';
import { motivationalQuotes } from '../../mocks/quotesData';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import ProgressBar from '../../components/ui/ProgressBar';
import Badge from '../../components/ui/Badge';

const { width: screenWidth } = Dimensions.get('window');

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { courses } = useSelector((state: RootState) => state.courses);
  const { quizResults } = useSelector((state: RootState) => state.quiz);
  
  const [refreshing, setRefreshing] = useState(false);
  const [quote, setQuote] = useState(motivationalQuotes[0]);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  useEffect(() => {
    loadData();
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setQuote(motivationalQuotes[randomIndex]);
    
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  const loadData = () => {
    dispatch(fetchCoursesSuccess(mockCourses));
    dispatch(fetchQuizzesSuccess(mockQuizzes));
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    loadData();
    setRefreshing(false);
  };
  
  const premiumColors = {
    primary: '#3B82F6',
    primaryLight: '#60A5FA',
    primaryDark: '#1E40AF',
    secondary: '#10B981',
    accent: '#8B5CF6',
    background: theme.dark ? '#0F0F23' : '#FAFBFF',
    cardBackground: theme.dark ? '#1A1B3E' : '#FFFFFF',
    surface: theme.dark ? '#252754' : '#F8FAFF',
    textPrimary: theme.dark ? '#F1F5F9' : '#1E293B',
    textSecondary: theme.dark ? '#94A3B8' : '#64748B',
    textMuted: theme.dark ? '#64748B' : '#94A3B8',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    gradientStart: theme.dark ? '#1E1B4B' : '#EFF6FF',
    gradientMid: theme.dark ? '#312E81' : '#DBEAFE',
    gradientEnd: theme.dark ? '#3730A3' : '#BFDBFE',
  };
  
  const renderGreeting = () => {
    const hours = new Date().getHours();
    let greeting = '';
    let iconName: keyof typeof Ionicons.glyphMap = 'sunny-outline';
    
    if (hours < 12) {
      greeting = 'Good Morning';
      iconName = 'sunny-outline';
    } else if (hours < 17) {
      greeting = 'Good Afternoon';
      iconName = 'partly-sunny-outline';
    } else {
      greeting = 'Good Evening';
      iconName = 'moon-outline';
    }
    
    return (
      <Animated.View 
        style={[
          styles.greetingContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={[styles.greetingGradient, { backgroundColor: premiumColors.cardBackground }]}>
          <View style={styles.greetingContent}>
            <View style={styles.userInfo}>
              <View style={styles.greetingRow}>
                <Ionicons 
                  name={iconName} 
                  size={20} 
                  color={premiumColors.primaryLight} 
                  style={styles.greetingIcon}
                />
                <Text style={[styles.greeting, { color: premiumColors.textPrimary }]}>
                  {greeting}
                </Text>
              </View>
              <Text style={[styles.userName, { color: premiumColors.textPrimary }]}>
                {user?.name || 'Student'}
              </Text>
              <Text style={[styles.welcomeSubtext, { color: premiumColors.textSecondary }]}>
                Ready to continue learning?
              </Text>
            </View>
            
            <TouchableOpacity
              onPress={() => navigation.navigate('Notifications')}
              style={[styles.notificationButton, { backgroundColor: premiumColors.surface }]}
              activeOpacity={0.7}
            >
              <Ionicons
                name="notifications-outline"
                size={22}
                color={premiumColors.primary}
              />
              <View style={[styles.notificationBadge, { backgroundColor: premiumColors.error }]} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };
  
  const renderQuickStats = () => {
    const totalProgress = courses.length > 0 
      ? courses.reduce((sum: number, course: any) => sum + course.progress, 0) / courses.length
      : 0;
    
    const quizStats = {
      completed: quizResults.length,
      averageScore: quizResults.length > 0
        ? quizResults.reduce((sum: number, result: any) => sum + result.score, 0) / quizResults.length
        : 0,
    };
    
    const statsData = [
      {
        value: courses.length,
        label: 'Active Courses',
        icon: 'book-outline' as keyof typeof Ionicons.glyphMap,
        color: premiumColors.primary,
        bgColor: `${premiumColors.primary}20`,
      },
      {
        value: quizStats.completed,
        label: 'Quizzes Done',
        icon: 'checkmark-circle-outline' as keyof typeof Ionicons.glyphMap,
        color: premiumColors.secondary,
        bgColor: `${premiumColors.secondary}20`,
      },
      {
        value: user?.streak || 0,
        label: 'Day Streak',
        icon: 'flame-outline' as keyof typeof Ionicons.glyphMap,
        color: premiumColors.warning,
        bgColor: `${premiumColors.warning}20`,
      },
      {
        value: `${quizStats.averageScore.toFixed(1)}%`,
        label: 'Avg Score',
        icon: 'trophy-outline' as keyof typeof Ionicons.glyphMap,
        color: quizStats.averageScore >= 70 
          ? premiumColors.success 
          : quizStats.averageScore >= 50 
          ? premiumColors.warning 
          : premiumColors.error,
        bgColor: quizStats.averageScore >= 70 
          ? `${premiumColors.success}20`
          : quizStats.averageScore >= 50 
          ? `${premiumColors.warning}20`
          : `${premiumColors.error}20`,
      },
    ];
    
    return (
      <Animated.View 
        style={[
          styles.statsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={[styles.premiumCard, { backgroundColor: premiumColors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: premiumColors.textPrimary }]}>
            Your Progress Overview
          </Text>
          
          <View style={styles.statsGrid}>
            {statsData.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: stat.bgColor }]}>
                  <Ionicons name={stat.icon} size={20} color={stat.color} />
                </View>
                <Text style={[styles.statValue, { color: stat.color }]}>
                  {stat.value}
                </Text>
                <Text style={[styles.statLabel, { color: premiumColors.textSecondary }]}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
          
          <View style={[styles.progressSection, { borderTopColor: premiumColors.surface }]}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressTitle, { color: premiumColors.textPrimary }]}>
                Overall Learning Progress
              </Text>
              <Text style={[styles.progressPercentage, { color: premiumColors.primary }]}>
                {Math.round(totalProgress)}%
              </Text>
            </View>
            
            <View style={[styles.progressBarContainer, { backgroundColor: premiumColors.surface }]}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { 
                    width: `${totalProgress}%`,
                    backgroundColor: premiumColors.primary
                  }
                ]} 
              />
            </View>
            
            <Text style={[styles.progressDescription, { color: premiumColors.textSecondary }]}>
              {totalProgress < 30 
                ? '🚀 Just getting started! Keep building momentum!' 
                : totalProgress < 70 
                ? '⚡ Excellent progress! Stay consistent to reach your goals!' 
                : '🎉 Outstanding! You\'re mastering your courses!'}
            </Text>
            
            <TouchableOpacity
              onPress={() => navigation.navigate('Progress')}
              style={[styles.viewDetailsButton, { backgroundColor: premiumColors.surface }]}
              activeOpacity={0.8}
            >
              <Text style={[styles.viewDetailsText, { color: premiumColors.primary }]}>
                View Detailed Analytics
              </Text>
              <Ionicons name="arrow-forward" size={16} color={premiumColors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };
  
  const renderRecentCourses = () => {
    const recentCourses = courses.slice(0, 3);
    
    return (
      <Animated.View 
        style={[
          styles.sectionContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: premiumColors.textPrimary }]}>
            Continue Learning
          </Text>
          <TouchableOpacity 
            onPress={() => (navigation as any).navigate('Courses')}
            style={styles.seeAllButton}
            activeOpacity={0.7}
          >
            <Text style={[styles.seeAllText, { color: premiumColors.primary }]}>
              View All
            </Text>
            <Ionicons name="arrow-forward" size={14} color={premiumColors.primary} />
          </TouchableOpacity>
        </View>
        
        {recentCourses.map((course: any, index: number) => (
          <TouchableOpacity
            key={course.id}
            style={[styles.courseCard, { backgroundColor: premiumColors.cardBackground }]}
            onPress={() => {
              (navigation as any).navigate('Courses', {
                screen: 'CourseDetail',
                params: { course }
              });
            }}
            activeOpacity={0.95}
          >
            <View style={[styles.courseCardGradient, { backgroundColor: `${premiumColors.primary}08` }]}>
              <View style={styles.courseCardContent}>
                <View style={[
                  styles.courseIconContainer,
                  { 
                    backgroundColor: index % 2 === 0 
                      ? premiumColors.primary 
                      : premiumColors.secondary
                  }
                ]}>
                  <Text style={styles.courseIcon}>
                    {course.title.charAt(0)}
                  </Text>
                </View>
                
                <View style={styles.courseInfo}>
                  <Text 
                    style={[styles.courseTitle, { color: premiumColors.textPrimary }]}
                    numberOfLines={1}
                  >
                    {course.title}
                  </Text>
                  <View style={styles.courseMeta}>
                    <Text 
                      style={[styles.courseCategory, { color: premiumColors.textSecondary }]}
                      numberOfLines={1}
                    >
                      {course.category}
                    </Text>
                    <View style={[styles.courseBadge, { backgroundColor: premiumColors.surface }]}>
                      <Text style={[styles.courseBadgeText, { color: premiumColors.primary }]}>
                        {course.level || 'Beginner'}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.progressContainer}>
                    <View style={styles.progressInfo}>
                      <Text style={[styles.progressText, { color: premiumColors.textMuted }]}>
                        {course.completedLessons}/{course.totalLessons} lessons
                      </Text>
                      <Text style={[styles.progressPercentageSmall, { color: premiumColors.primary }]}>
                        {Math.round(course.progress)}%
                      </Text>
                    </View>
                    <View style={[styles.progressBarTrack, { backgroundColor: premiumColors.surface }]}>
                      <View 
                        style={[
                          styles.progressBarFill, 
                          { 
                            width: `${course.progress}%`,
                            backgroundColor: index % 2 === 0 
                              ? premiumColors.primary 
                              : premiumColors.secondary
                          }
                        ]} 
                      />
                    </View>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={[styles.continueButton, { backgroundColor: premiumColors.surface }]}
                  activeOpacity={0.8}
                >
                  <Ionicons name="play" size={16} color={premiumColors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </Animated.View>
    );
  };
  
  const renderMotivationalQuote = () => {
    return (
      <Animated.View 
        style={[
          styles.quoteContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={[
          styles.quoteCard, 
          { 
            backgroundColor: premiumColors.cardBackground,
          }
        ]}>
          <View style={styles.quoteHeader}>
            <View style={[styles.quoteIconContainer, { backgroundColor: premiumColors.accent }]}>
              <Ionicons name="bulb" size={20} color="white" />
            </View>
            <Text style={[styles.quoteLabel, { color: premiumColors.textSecondary }]}>
              Daily Inspiration
            </Text>
          </View>
          
          <Text style={[styles.quoteText, { color: premiumColors.textPrimary }]}>
            "{quote.text}"
          </Text>
          <Text style={[styles.quoteAuthor, { color: premiumColors.textSecondary }]}>
            — {quote.author}
          </Text>
        </View>
      </Animated.View>
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: premiumColors.background }]}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={premiumColors.background}
        translucent
      />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[premiumColors.primary]}
            tintColor={premiumColors.primary}
            progressBackgroundColor={premiumColors.cardBackground}
          />
        }
      >
        {renderGreeting()}
        {renderQuickStats()}
        {renderRecentCourses()}
        {renderMotivationalQuote()}
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
  },
  
  // Greeting Section
  greetingContainer: {
    marginBottom: 24,
  },
  greetingGradient: {
    borderRadius: 20,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  greetingContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfo: {
    flex: 1,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  greetingIcon: {
    marginRight: 8,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  welcomeSubtext: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  
  // Stats Section
  statsContainer: {
    marginBottom: 24,
  },
  premiumCard: {
    borderRadius: 20,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  progressSection: {
    paddingTop: 20,
    borderTopWidth: 1,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  
  // Courses Section
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  courseCard: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  courseCardGradient: {
    padding: 16,
  },
  courseCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  courseIcon: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  courseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  courseCategory: {
    fontSize: 13,
    fontWeight: '500',
    marginRight: 12,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  courseBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  courseBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  progressContainer: {
    gap: 6,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  progressPercentageSmall: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  continueButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  
  // Quote Section
  quoteContainer: {
    marginBottom: 24,
  },
  quoteCard: {
    borderRadius: 20,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  quoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  quoteIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quoteLabel: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 24,
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  quoteAuthor: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  
  bottomSpacer: {
    height: 40,
  },
});

export default DashboardScreen;