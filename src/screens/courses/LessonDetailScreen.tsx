// src/screens/courses/LessonDetailScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { useDispatch } from 'react-redux';
import { LessonDetailScreenProps } from '../../navigation/types';
import { markLessonCompleted } from '../../store/slices/courseSlice';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const LessonDetailScreen: React.FC<LessonDetailScreenProps> = ({ navigation, route }) => {
  const { lesson, courseId } = route.params;
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const [isCompleted, setIsCompleted] = useState(lesson.completed);

  const handleMarkAsCompleted = () => {
    if (!isCompleted) {
      Alert.alert(
        'Mark as Completed',
        'Are you sure you want to mark this lesson as completed?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Yes',
            onPress: () => {
              dispatch(markLessonCompleted(lesson.id));
              setIsCompleted(true);
            },
          },
        ]
      );
    }
  };

  const handleTakeNotes = () => {
    navigation.navigate('AddNotes', {
      lessonId: lesson.id,
      notes: lesson.notes,
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Lesson Header */}
        <Card style={styles.headerCard}>
          <View style={styles.lessonHeader}>
            <Text style={[styles.lessonTitle, { color: theme.colors.textPrimary }]}>
              {lesson.title}
            </Text>
            {isCompleted && <Badge label="Completed" variant="success" />}
          </View>
          <Text style={[styles.lessonDescription, { color: theme.colors.textSecondary }]}>
            {lesson.description}
          </Text>
          <View style={styles.lessonMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="time" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                {lesson.duration} minutes
              </Text>
            </View>
          </View>
        </Card>

        {/* Video Section */}
        {lesson.videoUrl && (
          <Card style={styles.videoCard}>
            <View style={styles.videoPlaceholder}>
              <Ionicons name="play-circle" size={64} color={theme.colors.primary} />
              <Text style={[styles.videoText, { color: theme.colors.textSecondary }]}>
                Video Content
              </Text>
            </View>
          </Card>
        )}

        {/* Lesson Summary */}
        <Card style={styles.summaryCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Lesson Summary
          </Text>
          <Text style={[styles.summaryText, { color: theme.colors.textSecondary }]}>
            {lesson.summary}
          </Text>
        </Card>

        {/* Notes Section */}
        <Card style={styles.notesCard}>
          <View style={styles.notesHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              My Notes
            </Text>
            <TouchableOpacity onPress={handleTakeNotes}>
              <Ionicons name="create" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          {lesson.notes ? (
            <Text style={[styles.notesText, { color: theme.colors.textSecondary }]}>
              {lesson.notes}
            </Text>
          ) : (
            <Text style={[styles.notesPlaceholder, { color: theme.colors.textSecondary }]}>
              No notes yet. Tap the edit icon to add notes.
            </Text>
          )}
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="Take Notes"
            variant="outline"
            onPress={handleTakeNotes}
            leftIcon={<Ionicons name="create" size={20} color={theme.colors.primary} />}
            style={styles.actionButton}
          />
          
          {!isCompleted && (
            <Button
              title="Mark as Completed"
              onPress={handleMarkAsCompleted}
              leftIcon={<Ionicons name="checkmark" size={20} color={theme.colors.white} />}
              style={styles.actionButton}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 12,
  },
  lessonDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    marginLeft: 4,
  },
  videoCard: {
    marginBottom: 16,
    padding: 40,
  },
  videoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoText: {
    fontSize: 16,
    marginTop: 8,
  },
  summaryCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
  },
  notesCard: {
    marginBottom: 24,
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  notesText: {
    fontSize: 16,
    lineHeight: 24,
  },
  notesPlaceholder: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    marginBottom: 8,
  },
});

export default LessonDetailScreen;

