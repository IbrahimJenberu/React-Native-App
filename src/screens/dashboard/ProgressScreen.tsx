// src/screens/dashboard/ProgressScreen.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Animated,
  Platform,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Card from '../../components/ui/Card';
import ProgressBar from '../../components/ui/ProgressBar';
import Badge from '../../components/ui/Badge';

const ProgressScreen: React.FC = () => {
  const { theme } = useTheme();
  const { courses } = useSelector((state: RootState) => state.courses);
  const { quizResults } = useSelector((state: RootState) => state.quiz);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
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

  // Calculate overall statistics
  const totalLessons = courses.reduce((sum: number, course: any) => sum + course.totalLessons, 0);
  const completedLessons = courses.reduce((sum: number, course: any) => sum + course.completedLessons, 0);
  const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  
  const avgQuizScore = quizResults.length > 0
    ? quizResults.reduce((sum: number, result: any) => sum + result.score, 0) / quizResults.length
    : 0;

  const passedQuizzes = quizResults.filter((r: any) => r.score >= 70).length;
  const passRate = quizResults.length > 0 ? (passedQuizzes / quizResults.length) * 100 : 0;

  const renderHeader = () => (
    <Animated.View 
      style={[
        styles.headerContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={[styles.headerCard, { backgroundColor: premiumColors.cardBackground }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, { color: premiumColors.textPrimary }]}>
              Learning Analytics
            </Text>
            <Text style={[styles.headerSubtitle, { color: premiumColors.textSecondary }]}>
              Track your progress and achievements
            </Text>
          </View>
          <View style={[styles.headerIcon, { backgroundColor: `${premiumColors.primary}20` }]}>
            <Ionicons name="analytics" size={24} color={premiumColors.primary} />
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const renderOverallProgress = () => (
    <Animated.View 
      style={[
        styles.overallContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={[styles.premiumCard, { backgroundColor: premiumColors.cardBackground }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.cardIconContainer, { backgroundColor: `${premiumColors.primary}20` }]}>
            <Ionicons name="trending-up" size={20} color={premiumColors.primary} />
          </View>
          <Text style={[styles.cardTitle, { color: premiumColors.textPrimary }]}>
            Overall Progress
          </Text>
        </View>
        
        <View style={styles.progressRing}>
          <View style={[styles.progressCircle, { borderColor: premiumColors.surface }]}>
            <View style={[styles.progressFill, { 
              borderColor: premiumColors.primary,
              transform: [{ rotate: `${(overallProgress / 100) * 360}deg` }]
            }]} />
            <View style={styles.progressCenter}>
              <Text style={[styles.progressPercentage, { color: premiumColors.primary }]}>
                {Math.round(overallProgress)}%
              </Text>
              <Text style={[styles.progressLabel, { color: premiumColors.textSecondary }]}>
                Complete
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.overallStats}>
          <View style={styles.statItem}>
            <View style={[styles.statIconContainer, { backgroundColor: `${premiumColors.success}20` }]}>
              <Ionicons name="checkmark-circle" size={16} color={premiumColors.success} />
            </View>
            <Text style={[styles.statValue, { color: premiumColors.success }]}>
              {completedLessons}
            </Text>
            <Text style={[styles.statLabel, { color: premiumColors.textSecondary }]}>
              Lessons Done
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={[styles.statIconContainer, { backgroundColor: `${premiumColors.secondary}20` }]}>
              <Ionicons name="library" size={16} color={premiumColors.secondary} />
            </View>
            <Text style={[styles.statValue, { color: premiumColors.secondary }]}>
              {totalLessons}
            </Text>
            <Text style={[styles.statLabel, { color: premiumColors.textSecondary }]}>
              Total Lessons
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={[styles.statIconContainer, { backgroundColor: `${premiumColors.warning}20` }]}>
              <Ionicons name="time" size={16} color={premiumColors.warning} />
            </View>
            <Text style={[styles.statValue, { color: premiumColors.warning }]}>
              {totalLessons - completedLessons}
            </Text>
            <Text style={[styles.statLabel, { color: premiumColors.textSecondary }]}>
              Remaining
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const renderCourseProgress = () => (
    <Animated.View 
      style={[
        styles.coursesContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={[styles.premiumCard, { backgroundColor: premiumColors.cardBackground }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.cardIconContainer, { backgroundColor: `${premiumColors.secondary}20` }]}>
            <Ionicons name="school" size={20} color={premiumColors.secondary} />
          </View>
          <Text style={[styles.cardTitle, { color: premiumColors.textPrimary }]}>
            Course Progress
          </Text>
        </View>
        
        <View style={styles.coursesGrid}>
          {courses.map((course: any, index: number) => (
            <TouchableOpacity 
              key={course.id} 
              style={[styles.courseCard, { backgroundColor: premiumColors.surface }]}
              activeOpacity={0.95}
            >
              <View style={styles.courseCardHeader}>
                <View style={[
                  styles.courseIconContainer,
                  { 
                    backgroundColor: index % 3 === 0 
                      ? premiumColors.primary 
                      : index % 3 === 1 
                      ? premiumColors.secondary 
                      : premiumColors.accent
                  }
                ]}>
                  <Text style={styles.courseIcon}>
                    {course.title.charAt(0)}
                  </Text>
                </View>
                <View style={styles.courseInfo}>
                  <Text style={[styles.courseName, { color: premiumColors.textPrimary }]} numberOfLines={1}>
                    {course.title}
                  </Text>
                  <Text style={[styles.courseCategory, { color: premiumColors.textSecondary }]}>
                    {course.category}
                  </Text>
                </View>
                <View style={[
                  styles.courseBadge,
                  { 
                    backgroundColor: course.progress >= 100 
                      ? `${premiumColors.success}20` 
                      : `${premiumColors.primary}20`
                  }
                ]}>
                  <Text style={[
                    styles.courseBadgeText,
                    { 
                      color: course.progress >= 100 
                        ? premiumColors.success 
                        : premiumColors.primary
                    }
                  ]}>
                    {course.progress >= 100 ? '✓' : `${Math.round(course.progress)}%`}
                  </Text>
                </View>
              </View>
              
              <View style={styles.courseProgress}>
                <View style={[styles.progressBarTrack, { backgroundColor: `${premiumColors.textMuted}20` }]}>
                  <View 
                    style={[
                      styles.progressBarFill, 
                      { 
                        width: `${course.progress}%`,
                        backgroundColor: index % 3 === 0 
                          ? premiumColors.primary 
                          : index % 3 === 1 
                          ? premiumColors.secondary 
                          : premiumColors.accent
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.courseStats, { color: premiumColors.textMuted }]}>
                  {course.completedLessons} of {course.totalLessons} lessons
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Animated.View>
  );

  const renderQuizStats = () => (
    <Animated.View 
      style={[
        styles.quizContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={[styles.premiumCard, { backgroundColor: premiumColors.cardBackground }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.cardIconContainer, { backgroundColor: `${premiumColors.accent}20` }]}>
            <Ionicons name="trophy" size={20} color={premiumColors.accent} />
          </View>
          <Text style={[styles.cardTitle, { color: premiumColors.textPrimary }]}>
            Quiz Performance
          </Text>
        </View>
        
        <View style={styles.quizOverview}>
          <View style={[styles.quizMetricCard, { backgroundColor: `${premiumColors.primary}10` }]}>
            <Ionicons name="clipboard" size={24} color={premiumColors.primary} />
            <Text style={[styles.quizMetricValue, { color: premiumColors.primary }]}>
              {quizResults.length}
            </Text>
            <Text style={[styles.quizMetricLabel, { color: premiumColors.textSecondary }]}>
              Quizzes Taken
            </Text>
          </View>
          
          <View style={[styles.quizMetricCard, { 
            backgroundColor: avgQuizScore >= 70 
              ? `${premiumColors.success}10` 
              : avgQuizScore >= 50 
              ? `${premiumColors.warning}10` 
              : `${premiumColors.error}10`
          }]}>
            <Ionicons 
              name="stats-chart" 
              size={24} 
              color={avgQuizScore >= 70 
                ? premiumColors.success 
                : avgQuizScore >= 50 
                ? premiumColors.warning 
                : premiumColors.error
              } 
            />
            <Text style={[
              styles.quizMetricValue,
              { 
                color: avgQuizScore >= 70 
                  ? premiumColors.success 
                  : avgQuizScore >= 50 
                  ? premiumColors.warning 
                  : premiumColors.error 
              }
            ]}>
              {avgQuizScore.toFixed(1)}%
            </Text>
            <Text style={[styles.quizMetricLabel, { color: premiumColors.textSecondary }]}>
              Average Score
            </Text>
          </View>
          
          <View style={[styles.quizMetricCard, { backgroundColor: `${premiumColors.success}10` }]}>
            <Ionicons name="checkmark-circle" size={24} color={premiumColors.success} />
            <Text style={[styles.quizMetricValue, { color: premiumColors.success }]}>
              {passRate.toFixed(0)}%
            </Text>
            <Text style={[styles.quizMetricLabel, { color: premiumColors.textSecondary }]}>
              Pass Rate
            </Text>
          </View>
        </View>

        {quizResults.length > 0 && (
          <View style={styles.recentQuizzes}>
            <Text style={[styles.subTitle, { color: premiumColors.textPrimary }]}>
              Recent Quiz Results
            </Text>
            <View style={styles.quizResultsList}>
              {quizResults.slice(0, 5).map((result: any, index: number) => (
                <View key={result.id} style={[styles.quizResultItem, { backgroundColor: premiumColors.surface }]}>
                  <View style={styles.quizResultContent}>
                    <View style={[
                      styles.quizResultIcon,
                      { 
                        backgroundColor: result.score >= 70 
                          ? `${premiumColors.success}20` 
                          : `${premiumColors.error}20`
                      }
                    ]}>
                      <Ionicons 
                        name={result.score >= 70 ? "checkmark" : "close"} 
                        size={16} 
                        color={result.score >= 70 ? premiumColors.success : premiumColors.error} 
                      />
                    </View>
                    <View style={styles.quizResultInfo}>
                      <Text style={[styles.quizResultTitle, { color: premiumColors.textPrimary }]}>
                        Quiz #{quizResults.length - index}
                      </Text>
                      <Text style={[styles.quizResultDate, { color: premiumColors.textMuted }]}>
                        Recently completed
                      </Text>
                    </View>
                  </View>
                  <View style={[
                    styles.quizScoreBadge,
                    { 
                      backgroundColor: result.score >= 70 
                        ? `${premiumColors.success}20` 
                        : `${premiumColors.error}20`
                    }
                  ]}>
                    <Text style={[
                      styles.quizScoreText,
                      { 
                        color: result.score >= 70 
                          ? premiumColors.success 
                          : premiumColors.error
                      }
                    ]}>
                      {Math.round(result.score)}%
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </Animated.View>
  );

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
      >
        {renderHeader()}
        {renderOverallProgress()}
        {renderCourseProgress()}
        {renderQuizStats()}
        
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

  // Header Section
  headerContainer: {
    marginBottom: 24,
  },
  headerCard: {
    borderRadius: 20,
    padding: 20,
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Overall Progress Section
  overallContainer: {
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  progressRing: {
    alignItems: 'center',
    marginBottom: 24,
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressFill: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: 'transparent',
    borderTopColor: '#3B82F6',
  },
  progressCenter: {
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  overallStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
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

  // Courses Section
  coursesContainer: {
    marginBottom: 24,
  },
  coursesGrid: {
    gap: 12,
  },
  courseCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
  courseCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  courseIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  courseIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  courseCategory: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  courseBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  courseBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  courseProgress: {
    gap: 6,
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  courseStats: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },

  // Quiz Section
  quizContainer: {
    marginBottom: 24,
  },
  quizOverview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  quizMetricCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  quizMetricValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  quizMetricLabel: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  recentQuizzes: {
    marginTop: 8,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  quizResultsList: {
    gap: 8,
  },
  quizResultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  quizResultContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  quizResultIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quizResultInfo: {
    flex: 1,
  },
  quizResultTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  quizResultDate: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  quizScoreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  quizScoreText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },

  bottomSpacer: {
    height: 40,
  },
});

export default ProgressScreen;