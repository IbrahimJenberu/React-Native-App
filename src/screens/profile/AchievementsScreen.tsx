// src/screens/profile/AchievementsScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  target?: number;
}

const AchievementsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { courses } = useSelector((state: RootState) => state.courses);
  const { quizResults } = useSelector((state: RootState) => state.quiz);
  const { user } = useSelector((state: RootState) => state.auth);

  // Calculate achievements based on user progress
  const completedCourses = courses.filter(course => course.progress >= 100).length;
  const passedQuizzes = quizResults.filter(result => result.score >= 70).length;
  const streak = user?.streak || 0;

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first lesson',
      icon: 'footsteps',
      unlocked: courses.some(course => course.completedLessons > 0),
    },
    {
      id: '2',
      title: 'Quiz Master',
      description: 'Pass 5 quizzes',
      icon: 'school',
      unlocked: passedQuizzes >= 5,
      progress: passedQuizzes,
      target: 5,
    },
    {
      id: '3',
      title: 'Course Completer',
      description: 'Complete your first course',
      icon: 'trophy',
      unlocked: completedCourses >= 1,
    },
    {
      id: '4',
      title: 'Dedicated Learner',
      description: 'Maintain a 7-day streak',
      icon: 'flame',
      unlocked: streak >= 7,
      progress: streak,
      target: 7,
    },
    {
      id: '5',
      title: 'Perfectionist',
      description: 'Score 100% on a quiz',
      icon: 'medal',
      unlocked: quizResults.some(result => result.score >= 100),
    },
    {
      id: '6',
      title: 'Scholar',
      description: 'Complete 3 courses',
      icon: 'library',
      unlocked: completedCourses >= 3,
      progress: completedCourses,
      target: 3,
    },
  ];

  const renderAchievement = ({ item }: { item: Achievement }) => (
    <Card style={[
      styles.achievementCard,
      { opacity: item.unlocked ? 1 : 0.6 }
    ]}>
      <View style={styles.achievementHeader}>
        <View style={[
          styles.achievementIcon,
          {
            backgroundColor: item.unlocked 
              ? theme.colors.primary + '20' 
              : theme.colors.border + '20'
          }
        ]}>
          <Ionicons
            name={item.icon as any}
            size={24}
            color={item.unlocked ? theme.colors.primary : theme.colors.textSecondary}
          />
        </View>
        <View style={styles.achievementInfo}>
          <View style={styles.achievementTitleRow}>
            <Text style={[
              styles.achievementTitle,
              { color: item.unlocked ? theme.colors.textPrimary : theme.colors.textSecondary }
            ]}>
              {item.title}
            </Text>
            {item.unlocked && <Badge label="Unlocked" variant="success" size="small" />}
          </View>
          <Text style={[styles.achievementDescription, { color: theme.colors.textSecondary }]}>
            {item.description}
          </Text>
          {item.progress !== undefined && item.target !== undefined && (
            <View style={styles.progressContainer}>
              <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
                {item.progress}/{item.target}
              </Text>
              <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
                <View style={[
                  styles.progressFill,
                  {
                    backgroundColor: theme.colors.primary,
                    width: `${Math.min((item.progress / item.target) * 100, 100)}%`
                  }
                ]} />
              </View>
            </View>
          )}
        </View>
      </View>
    </Card>
  );

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.summaryCard}>
        <Text style={[styles.summaryTitle, { color: theme.colors.textPrimary }]}>
          Achievement Progress
        </Text>
        <Text style={[styles.summaryText, { color: theme.colors.textSecondary }]}>
          {unlockedCount} of {achievements.length} achievements unlocked
        </Text>
      </Card>

      <FlatList
        data={achievements}
        renderItem={renderAchievement}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summaryCard: {
    margin: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 14,
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  achievementCard: {
    marginBottom: 12,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  achievementDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressText: {
    fontSize: 12,
    minWidth: 40,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
});

export default AchievementsScreen;