// src/screens/profile/UserProfileScreen.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { UserProfileScreenProps } from '../../navigation/types';
import { logout } from '../../store/slices/authSlice';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfileScreen: React.FC<UserProfileScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
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

  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('user');
              dispatch(logout());
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  };

  const completedCourses = courses.filter(course => course.progress >= 100).length;
  const avgQuizScore = quizResults.length > 0
    ? quizResults.reduce((sum, result) => sum + result.score, 0) / quizResults.length
    : 0;

  const menuItems = [
    {
      icon: 'person-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      color: premiumColors.primary,
      bgColor: `${premiumColors.primary}20`,
      onPress: () => {
        Alert.alert(
          'Edit Profile',
          'Profile editing feature coming soon!',
          [{ text: 'OK', style: 'default' }]
        );
      },
    },
    {
      icon: 'settings-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Settings',
      subtitle: 'App preferences and notifications',
      color: premiumColors.secondary,
      bgColor: `${premiumColors.secondary}20`,
      onPress: () => navigation.navigate('Settings'),
    },
    {
      icon: 'notifications-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Study Reminders',
      subtitle: 'Manage your study schedule',
      color: premiumColors.accent,
      bgColor: `${premiumColors.accent}20`,
      onPress: () => navigation.navigate('StudyReminders'),
    },
    {
      icon: 'trophy-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Achievements',
      subtitle: 'View your learning milestones',
      color: premiumColors.warning,
      bgColor: `${premiumColors.warning}20`,
      onPress: () => {
        Alert.alert(
          'Achievements',
          'Achievements feature coming soon! Keep learning to unlock more badges.',
          [{ text: 'OK', style: 'default' }]
        );
      },
    },
    {
      icon: 'help-circle-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      color: premiumColors.primary,
      bgColor: `${premiumColors.primary}20`,
      onPress: () => {
        Alert.alert(
          'Help & Support',
          'Contact us at support@topscorer.com or visit our help center for assistance.',
          [
            { text: 'Email Support', onPress: () => console.log('Open email app') },
            { text: 'OK', style: 'default' }
          ]
        );
      },
    },
  ];

  const renderProfileHeader = () => (
    <Animated.View 
      style={[
        styles.profileContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={[styles.profileCard, { backgroundColor: premiumColors.cardBackground }]}>
        <View style={[styles.profileBanner, { backgroundColor: `${premiumColors.primary}15` }]}>
          <View style={styles.profileContent}>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatarRing, { borderColor: premiumColors.primary }]}>
                <Avatar name={user?.name} size="large" />
              </View>
              <TouchableOpacity 
                style={[styles.editAvatarButton, { backgroundColor: premiumColors.primary }]}
                onPress={() => {
                  Alert.alert(
                    'Edit Avatar',
                    'Avatar editing feature coming soon!',
                    [{ text: 'OK', style: 'default' }]
                  );
                }}
              >
                <Ionicons name="camera" size={16} color="white" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={[styles.userName, { color: premiumColors.textPrimary }]}>
                {user?.name || 'Student'}
              </Text>
              <Text style={[styles.userEmail, { color: premiumColors.textSecondary }]}>
                {user?.email || 'student@example.com'}
              </Text>
              
              <View style={styles.profileBadges}>
                <View style={[styles.streakBadge, { backgroundColor: `${premiumColors.warning}20` }]}>
                  <Ionicons name="flame" size={16} color={premiumColors.warning} />
                  <Text style={[styles.streakText, { color: premiumColors.warning }]}>
                    {user?.streak || 0} day streak
                  </Text>
                </View>
                
                <View style={[styles.levelBadge, { backgroundColor: `${premiumColors.accent}20` }]}>
                  <Ionicons name="star" size={16} color={premiumColors.accent} />
                  <Text style={[styles.levelText, { color: premiumColors.accent }]}>
                    Level {Math.floor((completedCourses + quizResults.length) / 5) + 1}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const renderStats = () => {
    const statsData = [
      {
        value: courses.length,
        label: 'Enrolled Courses',
        icon: 'book' as keyof typeof Ionicons.glyphMap,
        color: premiumColors.primary,
        progress: 75,
      },
      {
        value: completedCourses,
        label: 'Completed Courses',
        icon: 'checkmark-circle' as keyof typeof Ionicons.glyphMap,
        color: premiumColors.success,
        progress: completedCourses > 0 ? (completedCourses / courses.length) * 100 : 0,
      },
      {
        value: quizResults.length,
        label: 'Quizzes Taken',
        icon: 'trophy' as keyof typeof Ionicons.glyphMap,
        color: premiumColors.secondary,
        progress: quizResults.length > 0 ? Math.min(quizResults.length * 20, 100) : 0,
      },
      {
        value: `${avgQuizScore.toFixed(1)}%`,
        label: 'Average Score',
        icon: 'stats-chart' as keyof typeof Ionicons.glyphMap,
        color: avgQuizScore >= 70 
          ? premiumColors.success 
          : avgQuizScore >= 50 
          ? premiumColors.warning 
          : premiumColors.error,
        progress: avgQuizScore,
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
          <View style={styles.statsHeader}>
            <View style={[styles.cardIconContainer, { backgroundColor: `${premiumColors.primary}20` }]}>
              <Ionicons name="analytics" size={20} color={premiumColors.primary} />
            </View>
            <Text style={[styles.sectionTitle, { color: premiumColors.textPrimary }]}>
              Learning Progress
            </Text>
          </View>
          
          <View style={styles.statsGrid}>
            {statsData.map((stat, index) => (
              <TouchableOpacity 
                key={index}
                style={[styles.premiumStatCard, { backgroundColor: `${stat.color}08` }]}
                activeOpacity={0.8}
              >
                <View style={styles.statCardContent}>
                  <View style={[styles.statIconContainer, { backgroundColor: stat.color }]}>
                    <Ionicons name={stat.icon} size={18} color="white" />
                  </View>
                  <View style={styles.statInfo}>
                    <Text style={[styles.statValue, { color: stat.color }]}>
                      {stat.value}
                    </Text>
                    <Text style={[styles.statLabel, { color: premiumColors.textSecondary }]}>
                      {stat.label}
                    </Text>
                  </View>
                </View>
                <View style={styles.statProgressContainer}>
                  <View style={[styles.statProgressTrack, { backgroundColor: `${stat.color}20` }]}>
                    <View style={[
                      styles.statProgressFill, 
                      { 
                        backgroundColor: stat.color,
                        width: `${Math.min(stat.progress, 100)}%`
                      }
                    ]} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderGoals = () => {
    if (!user?.goals || user.goals.length === 0) return null;

    return (
      <Animated.View 
        style={[
          styles.goalsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={[styles.premiumCard, { backgroundColor: premiumColors.cardBackground }]}>
          <View style={styles.goalsHeader}>
            <View style={[styles.cardIconContainer, { backgroundColor: `${premiumColors.secondary}20` }]}>
              <Ionicons name="flag" size={20} color={premiumColors.secondary} />
            </View>
            <Text style={[styles.sectionTitle, { color: premiumColors.textPrimary }]}>
              My Goals
            </Text>
          </View>
          
          <View style={styles.goalsList}>
            {user.goals.map((goal, index) => (
              <View key={index} style={[styles.goalItem, { backgroundColor: premiumColors.surface }]}>
                <View style={[styles.goalIconContainer, { backgroundColor: `${premiumColors.primary}20` }]}>
                  <Ionicons name="checkmark-circle" size={16} color={premiumColors.primary} />
                </View>
                <Text style={[styles.goalText, { color: premiumColors.textPrimary }]}>
                  {goal}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderMenu = () => (
    <Animated.View 
      style={[
        styles.menuContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={[styles.premiumCard, { backgroundColor: premiumColors.cardBackground }]}>
        <View style={styles.menuHeader}>
          <View style={[styles.cardIconContainer, { backgroundColor: `${premiumColors.accent}20` }]}>
            <Ionicons name="grid" size={20} color={premiumColors.accent} />
          </View>
          <Text style={[styles.sectionTitle, { color: premiumColors.textPrimary }]}>
            Quick Actions
          </Text>
        </View>
        
        <View style={styles.menuList}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && { 
                  borderBottomWidth: 1, 
                  borderBottomColor: premiumColors.surface 
                }
              ]}
              onPress={item.onPress}
              activeOpacity={0.8}
            >
              <View style={[styles.menuItemIcon, { backgroundColor: item.bgColor }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <View style={styles.menuItemContent}>
                <Text style={[styles.menuItemTitle, { color: premiumColors.textPrimary }]}>
                  {item.title}
                </Text>
                <Text style={[styles.menuItemSubtitle, { color: premiumColors.textSecondary }]}>
                  {item.subtitle}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={premiumColors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Animated.View>
  );

  const renderLogout = () => (
    <Animated.View 
      style={[
        styles.logoutContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={[styles.premiumLogoutCard, { backgroundColor: premiumColors.cardBackground }]}>
        <TouchableOpacity
          style={[styles.premiumLogoutButton, { backgroundColor: `${premiumColors.error}08` }]}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <View style={styles.logoutContent}>
            <View style={[styles.logoutIconContainer, { backgroundColor: `${premiumColors.error}20` }]}>
              <Ionicons name="log-out-outline" size={22} color={premiumColors.error} />
            </View>
            <View style={styles.logoutTextContainer}>
              <Text style={[styles.logoutTitle, { color: premiumColors.error }]}>
                Logout
              </Text>
              <Text style={[styles.logoutSubtitle, { color: premiumColors.textSecondary }]}>
                Sign out of your account
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={premiumColors.error} />
        </TouchableOpacity>
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
        {renderProfileHeader()}
        {renderStats()}
        {renderGoals()}
        {renderMenu()}
        {renderLogout()}
        
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

  // Premium Card Styles
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

  cardIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },

  // Profile Header Section
  profileContainer: {
    marginBottom: 24,
  },
  profileCard: {
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  profileBanner: {
    padding: 24,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  avatarRing: {
    borderRadius: 50,
    borderWidth: 3,
    padding: 4,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  profileBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },

  // Stats Section
  statsContainer: {
    marginBottom: 24,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statsGrid: {
    gap: 16,
  },
  premiumStatCard: {
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 16,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  statCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  statProgressContainer: {
    marginTop: 8,
  },
  statProgressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  statProgressFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Goals Section
  goalsContainer: {
    marginBottom: 24,
  },
  goalsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalsList: {
    gap: 8,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  goalIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalText: {
    fontSize: 14,
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },

  // Menu Section
  menuContainer: {
    marginBottom: 24,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  menuList: {
    gap: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  menuItemSubtitle: {
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },

  // Premium Logout Section
  logoutContainer: {
    marginBottom: 24,
  },
  premiumLogoutCard: {
    borderRadius: 20,
    padding: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  premiumLogoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 16,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoutIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logoutTextContainer: {
    flex: 1,
  },
  logoutTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  logoutSubtitle: {
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },

  bottomSpacer: {
    height: 40,
  },
});

export default UserProfileScreen;