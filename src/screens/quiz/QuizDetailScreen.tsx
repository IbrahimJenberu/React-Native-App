// src/screens/quiz/QuizDetailScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { QuizDetailScreenProps } from '../../navigation/types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const QuizDetailScreen: React.FC<QuizDetailScreenProps> = ({ navigation, route }) => {
  const { quiz } = route.params;
  const { theme } = useTheme();

  const estimatedTime = Math.ceil(quiz.questions.length * quiz.timePerQuestion / 60);

  const handleStartQuiz = () => {
    navigation.navigate('QuizSession', { quiz });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Quiz Header */}
        <Card style={styles.headerCard}>
          <Text style={[styles.quizTitle, { color: theme.colors.textPrimary }]}>
            {quiz.title}
          </Text>
          <Text style={[styles.quizDescription, { color: theme.colors.textSecondary }]}>
            {quiz.description}
          </Text>
        </Card>

        {/* Quiz Info */}
        <Card style={styles.infoCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Quiz Information
          </Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <View style={[styles.infoIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                <Ionicons name="help" size={24} color={theme.colors.primary} />
              </View>
              <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                {quiz.questions.length}
              </Text>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Questions
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <View style={[styles.infoIcon, { backgroundColor: theme.colors.secondary + '20' }]}>
                <Ionicons name="time" size={24} color={theme.colors.secondary} />
              </View>
              <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                {estimatedTime}
              </Text>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Minutes
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <View style={[styles.infoIcon, { backgroundColor: theme.colors.success + '20' }]}>
                <Ionicons name="trophy" size={24} color={theme.colors.success} />
              </View>
              <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                70%
              </Text>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Pass Score
              </Text>
            </View>
          </View>
        </Card>

        {/* Instructions */}
        <Card style={styles.instructionsCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Instructions
          </Text>
          
          <View style={styles.instruction}>
            <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
            <Text style={[styles.instructionText, { color: theme.colors.textSecondary }]}>
              Answer all questions to complete the quiz
            </Text>
          </View>
          
          <View style={styles.instruction}>
            <Ionicons name="time" size={20} color={theme.colors.warning} />
            <Text style={[styles.instructionText, { color: theme.colors.textSecondary }]}>
              Each question has a time limit of {quiz.timePerQuestion} seconds
            </Text>
          </View>
          
          <View style={styles.instruction}>
            <Ionicons name="trophy" size={20} color={theme.colors.info} />
            <Text style={[styles.instructionText, { color: theme.colors.textSecondary }]}>
              Score 70% or higher to pass
            </Text>
          </View>
          
          <View style={styles.instruction}>
            <Ionicons name="refresh" size={20} color={theme.colors.primary} />
            <Text style={[styles.instructionText, { color: theme.colors.textSecondary }]}>
              You can retake the quiz if needed
            </Text>
          </View>
        </Card>

        {/* Start Button */}
        <Button
          title="Start Quiz"
          onPress={handleStartQuiz}
          size="large"
          fullWidth
          leftIcon={<Ionicons name="play" size={20} color={theme.colors.white} />}
          style={styles.startButton}
        />
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
  quizTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  quizDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  infoCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 12,
  },
  instructionsCard: {
    marginBottom: 24,
  },
  instruction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  startButton: {
    marginBottom: 16,
  },
});

export default QuizDetailScreen;

