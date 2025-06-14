// src/screens/quiz/QuizSessionScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { useDispatch } from 'react-redux';
import { QuizSessionScreenProps } from '../../navigation/types';
import { startQuiz, answerQuestion, finishQuiz } from '../../store/slices/quizSlice';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';

const QuizSessionScreen: React.FC<QuizSessionScreenProps> = ({ navigation, route }) => {
  const { quiz } = route.params;
  const { theme } = useTheme();
  const dispatch = useDispatch();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>(new Array(quiz.questions.length).fill(-1));
  const [timeRemaining, setTimeRemaining] = useState(quiz.timePerQuestion);

  useEffect(() => {
    dispatch(startQuiz(quiz));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleNextQuestion();
          return quiz.timePerQuestion;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex]);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);
    dispatch(answerQuestion({ questionIndex: currentQuestionIndex, answer: answerIndex }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeRemaining(quiz.timePerQuestion);
    } else {
      handleFinishQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setTimeRemaining(quiz.timePerQuestion);
    }
  };

  const handleFinishQuiz = () => {
    const correctAnswers = userAnswers.reduce((count, answer, index) => {
      return answer === quiz.questions[index].correctAnswer ? count + 1 : count;
    }, 0);

    const score = (correctAnswers / quiz.questions.length) * 100;
    const resultId = Date.now().toString();

    const quizResult = {
      id: resultId,
      quizId: quiz.id,
      score,
      totalQuestions: quiz.questions.length,
      correctAnswers,
      timeTaken: (quiz.questions.length * quiz.timePerQuestion) - timeRemaining,
      date: new Date().toISOString(),
      answerDetails: userAnswers.map((answer, index) => ({
        questionId: quiz.questions[index].id,
        userAnswer: answer,
        correct: answer === quiz.questions[index].correctAnswer,
      })),
    };

    dispatch(finishQuiz(quizResult));
    navigation.replace('QuizResults', { quizId: quiz.id, resultId });
  };

  const handleQuitQuiz = () => {
    Alert.alert(
      'Quit Quiz',
      'Are you sure you want to quit? Your progress will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Quit', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleQuitQuiz}>
          <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <Text style={[styles.progressText, { color: theme.colors.textPrimary }]}>
            {currentQuestionIndex + 1} of {quiz.questions.length}
          </Text>
          <ProgressBar progress={progress} height={4} style={styles.progressBar} />
        </View>
        <View style={[styles.timer, { backgroundColor: theme.colors.error + '20' }]}>
          <Text style={[styles.timerText, { color: theme.colors.error }]}>
            {timeRemaining}s
          </Text>
        </View>
      </View>

      {/* Question */}
      <Card style={styles.questionCard}>
        <Text style={[styles.questionText, { color: theme.colors.textPrimary }]}>
          {currentQuestion.question}
        </Text>
      </Card>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.option,
              {
                backgroundColor: userAnswers[currentQuestionIndex] === index 
                  ? theme.colors.primary + '20' 
                  : theme.colors.cardBackground,
                borderColor: userAnswers[currentQuestionIndex] === index 
                  ? theme.colors.primary 
                  : theme.colors.border,
              },
            ]}
            onPress={() => handleAnswerSelect(index)}
          >
            <View style={[
              styles.optionIndicator,
              {
                backgroundColor: userAnswers[currentQuestionIndex] === index 
                  ? theme.colors.primary 
                  : 'transparent',
                borderColor: theme.colors.border,
              }
            ]}>
              {userAnswers[currentQuestionIndex] === index && (
                <Ionicons name="checkmark" size={16} color={theme.colors.white} />
              )}
            </View>
            <Text style={[
              styles.optionText,
              {
                color: userAnswers[currentQuestionIndex] === index 
                  ? theme.colors.primary 
                  : theme.colors.textPrimary,
              }
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Navigation */}
      <View style={styles.navigation}>
        <Button
          title="Previous"
          variant="outline"
          onPress={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          style={styles.navButton}
        />
        <Button
          title={currentQuestionIndex === quiz.questions.length - 1 ? "Finish" : "Next"}
          onPress={handleNextQuestion}
          disabled={userAnswers[currentQuestionIndex] === -1}
          style={styles.navButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  progressContainer: {
    flex: 1,
  },
  progressText: {
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  progressBar: {
    marginBottom: 0,
  },
  timer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  timerText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  questionCard: {
    margin: 16,
    padding: 24,
  },
  questionText: {
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  optionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 16,
  },
  navButton: {
    flex: 1,
  },
});

export default QuizSessionScreen;

