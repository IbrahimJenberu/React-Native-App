// src/screens/quiz/QuizResultsScreen.tsx
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
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { QuizResultsScreenProps } from '../../navigation/types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const QuizResultsScreen: React.FC<QuizResultsScreenProps> = ({ navigation, route }) => {
  const { quizId, resultId } = route.params;
  const { theme } = useTheme();
  const { quizResults, quizzes } = useSelector((state: RootState) => state.quiz);
  
  const result = quizResults.find(r => r.id === resultId);
  const quiz = quizzes.find(q => q.id === quizId);
  
  if (!result || !quiz) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text>Quiz result not found</Text>
      </SafeAreaView>
    );
  }

  const isPassed = result.score >= 70;
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRetakeQuiz = () => {
    navigation.navigate('QuizSession', { quiz });
  };

  const handleBackToList = () => {
    navigation.navigate('QuizList');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Result Header */}
        <Card style={styles.resultCard}>
          <View style={styles.resultIcon}>
            <Ionicons
              name={isPassed ? 'checkmark-circle' : 'close-circle'}
              size={80}
              color={isPassed ? theme.colors.success : theme.colors.error}
            />
          </View>
          
          <Text style={[styles.resultTitle, { color: theme.colors.textPrimary }]}>
            {isPassed ? 'Congratulations!' : 'Keep Practicing!'}
          </Text>
          
          <Text style={[styles.resultSubtitle, { color: theme.colors.textSecondary }]}>
            {isPassed 
              ? 'You passed the quiz successfully!' 
              : 'You can retake the quiz to improve your score.'
            }
          </Text>
          
          <View style={styles.scoreContainer}>
            <Text style={[
              styles.scoreValue,
              { color: isPassed ? theme.colors.success : theme.colors.error }
            ]}>
              {Math.round(result.score)}%
            </Text>
            <Badge 
              label={isPassed ? 'Passed' : 'Failed'}
              variant={isPassed ? 'success' : 'error'}
            />
          </View>
        </Card>

        {/* Statistics */}
        <Card style={styles.statsCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Quiz Statistics
          </Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.success }]}>
                {result.correctAnswers}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Correct
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.error }]}>
                {result.totalQuestions - result.correctAnswers}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Incorrect
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                {formatTime(result.timeTaken)}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Time Taken
              </Text>
            </View>
          </View>
        </Card>

        {/* Answer Review */}
        <Card style={styles.reviewCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Answer Review
          </Text>
          
          {result.answerDetails.map((answer, index) => {
            const question = quiz.questions.find(q => q.id === answer.questionId);
            if (!question) return null;
            
            return (
              <View key={answer.questionId} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={[styles.questionNumber, { color: theme.colors.textPrimary }]}>
                    Q{index + 1}
                  </Text>
                  <Ionicons
                    name={answer.correct ? 'checkmark-circle' : 'close-circle'}
                    size={20}
                    color={answer.correct ? theme.colors.success : theme.colors.error}
                  />
                </View>
                
                <Text style={[styles.reviewQuestion, { color: theme.colors.textSecondary }]}>
                  {question.question}
                </Text>
                
                <View style={styles.answerInfo}>
                  <Text style={[styles.answerLabel, { color: theme.colors.textSecondary }]}>
                    Your answer: {question.options[answer.userAnswer] || 'Not answered'}
                  </Text>
                  {!answer.correct && (
                    <Text style={[styles.correctAnswer, { color: theme.colors.success }]}>
                      Correct: {question.options[question.correctAnswer]}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {!isPassed && (
            <Button
              title="Retake Quiz"
              onPress={handleRetakeQuiz}
              leftIcon={<Ionicons name="refresh" size={20} color={theme.colors.white} />}
              style={styles.actionButton}
            />
          )}
          
          <Button
            title="Back to Quizzes"
            variant="outline"
            onPress={handleBackToList}
            style={styles.actionButton}
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
  scrollContainer: {
    padding: 16,
  },
  resultCard: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
  },
  resultIcon: {
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  scoreContainer: {
    alignItems: 'center',
    gap: 8,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  statsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  reviewCard: {
    marginBottom: 24,
  },
  reviewItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  reviewQuestion: {
    fontSize: 14,
    marginBottom: 8,
  },
  answerInfo: {
    gap: 4,
  },
  answerLabel: {
    fontSize: 12,
  },
  correctAnswer: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    marginBottom: 8,
  },
});

export default QuizResultsScreen;