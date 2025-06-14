// src/screens/courses/CourseListScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { CourseListScreenProps } from '../../navigation/types';
import { fetchCoursesSuccess } from '../../store/slices/courseSlice';
import { mockCourses } from '../../mocks/courseData';
import Card from '../../components/ui/Card';
import ProgressBar from '../../components/ui/ProgressBar';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { Course } from '../../types/course';

const CourseListScreen: React.FC<CourseListScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { courses, loading } = useSelector((state: RootState) => state.courses);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = () => {
    dispatch(fetchCoursesSuccess(mockCourses));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    loadCourses();
    setRefreshing(false);
  };

  const filteredCourses = courses.filter(course => {
    switch (filter) {
      case 'in-progress':
        return course.progress > 0 && course.progress < 100;
      case 'completed':
        return course.progress >= 100;
      default:
        return true;
    }
  });

  const renderCourse = ({ item }: { item: Course }) => (
    <Card
      style={styles.courseCard}
      onPress={() => navigation.navigate('CourseDetail', { course: item })}
    >
      <View style={styles.courseHeader}>
        <View style={[styles.courseIcon, { backgroundColor: theme.colors.primary + '20' }]}>
          <Text style={[styles.courseIconText, { color: theme.colors.primary }]}>
            {item.title.charAt(0)}
          </Text>
        </View>
        <View style={styles.courseInfo}>
          <Text style={[styles.courseTitle, { color: theme.colors.textPrimary }]}>
            {item.title}
          </Text>
          <Text style={[styles.courseCategory, { color: theme.colors.textSecondary }]}>
            {item.category}
          </Text>
          <Badge 
            label={item.progress >= 100 ? 'Completed' : 'In Progress'}
            variant={item.progress >= 100 ? 'success' : 'info'}
            size="small"
            style={styles.courseBadge}
          />
        </View>
      </View>
      
      <Text style={[styles.courseDescription, { color: theme.colors.textSecondary }]}>
        {item.description}
      </Text>
      
      <View style={styles.courseProgress}>
        <View style={styles.progressInfo}>
          <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
            {item.completedLessons}/{item.totalLessons} lessons
          </Text>
          <Text style={[styles.progressPercentage, { color: theme.colors.primary }]}>
            {Math.round(item.progress)}%
          </Text>
        </View>
        <ProgressBar progress={item.progress} height={6} />
      </View>
    </Card>
  );

  const renderFilterButton = (filterType: typeof filter, label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        {
          backgroundColor: filter === filterType ? theme.colors.primary : 'transparent',
          borderColor: theme.colors.primary,
        },
      ]}
      onPress={() => setFilter(filterType)}
    >
      <Text
        style={[
          styles.filterButtonText,
          {
            color: filter === filterType ? theme.colors.white : theme.colors.primary,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (courses.length === 0 && !loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <EmptyState
          title="No Courses Available"
          message="Start your learning journey by enrolling in courses."
          icon={<Ionicons name="book-outline" size={80} color={theme.colors.textSecondary} />}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.filterContainer}>
        {renderFilterButton('all', 'All')}
        {renderFilterButton('in-progress', 'In Progress')}
        {renderFilterButton('completed', 'Completed')}
      </View>

      <FlatList
        data={filteredCourses}
        renderItem={renderCourse}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
  courseCard: {
    marginBottom: 16,
  },
  courseHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  courseIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  courseIconText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  courseCategory: {
    fontSize: 14,
    marginBottom: 8,
  },
  courseBadge: {
    alignSelf: 'flex-start',
  },
  courseDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  courseProgress: {
    marginTop: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default CourseListScreen;

