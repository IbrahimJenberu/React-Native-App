// src/screens/courses/CourseDetailScreen.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { CourseDetailScreenProps } from '../../navigation/types';
import { fetchLessonsSuccess, setCurrentCourse } from '../../store/slices/courseSlice';
import { mockLessons } from '../../mocks/courseData';
import Card from '../../components/ui/Card';
import ProgressBar from '../../components/ui/ProgressBar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Lesson } from '../../types/course';

const CourseDetailScreen: React.FC<CourseDetailScreenProps> = ({ navigation, route }) => {
  const { course } = route.params;
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { lessons } = useSelector((state: RootState) => state.courses);

  useEffect(() => {
    dispatch(setCurrentCourse(course));
    // Filter lessons for this course
    const courseLessons = mockLessons.filter(lesson => lesson.courseId === course.id);
    dispatch(fetchLessonsSuccess(courseLessons));
  }, [course.id, dispatch]);

  const courseLessons = lessons.filter(lesson => lesson.courseId === course.id);

  const renderLesson = ({ item, index }: { item: Lesson; index: number }) => (
    <Card
      style={styles.lessonCard}
      onPress={() => navigation.navigate('LessonDetail', { lesson: item, courseId: course.id })}
    >
      <View style={styles.lessonHeader}>
        <View style={[
          styles.lessonNumber,
          {
            backgroundColor: item.completed ? theme.colors.success : theme.colors.primary,
          }
        ]}>
          <Text style={[styles.lessonNumberText, { color: theme.colors.white }]}>
            {item.completed ? '✓' : (index + 1)}
          </Text>
        </View>
        <View style={styles.lessonInfo}>
          <Text style={[styles.lessonTitle, { color: theme.colors.textPrimary }]}>
            {item.title}
          </Text>
          <Text style={[styles.lessonDescription, { color: theme.colors.textSecondary }]}>
            {item.description}
          </Text>
          <View style={styles.lessonMeta}>
            <Text style={[styles.lessonDuration, { color: theme.colors.textSecondary }]}>
              {item.duration} min
            </Text>
            {item.completed && (
              <Badge label="Completed" variant="success" size="small" />
            )}
          </View>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.colors.textSecondary}
        />
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Course Header */}
        <View style={styles.header}>
          <Card style={styles.courseInfoCard}>
            <Text style={[styles.courseTitle, { color: theme.colors.textPrimary }]}>
              {course.title}
            </Text>
            <Text style={[styles.courseDescription, { color: theme.colors.textSecondary }]}>
              {course.description}
            </Text>
            <Badge label={course.category} variant="primary" style={styles.categoryBadge} />
            
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={[styles.progressTitle, { color: theme.colors.textPrimary }]}>
                  Course Progress
                </Text>
                <Text style={[styles.progressPercentage, { color: theme.colors.primary }]}>
                  {Math.round(course.progress)}%
                </Text>
              </View>
              <ProgressBar progress={course.progress} height={8} />
              <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
                {course.completedLessons} of {course.totalLessons} lessons completed
              </Text>
            </View>
          </Card>
        </View>

        {/* Lessons Section */}
        <View style={styles.lessonsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Lessons ({courseLessons.length})
          </Text>
          
          <FlatList
            data={courseLessons}
            renderItem={renderLesson}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  courseInfoCard: {
    padding: 20,
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  progressSection: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressText: {
    fontSize: 12,
    marginTop: 8,
  },
  lessonsSection: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  lessonCard: {
    marginBottom: 12,
    padding: 16,
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  lessonNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  lessonDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  lessonDuration: {
    fontSize: 12,
  },
});

export default CourseDetailScreen;

