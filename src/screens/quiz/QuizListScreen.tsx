// src/screens/quiz/QuizListScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { QuizListScreenProps } from '../../navigation/types';
import { fetchQuizzesSuccess } from '../../store/slices/quizSlice';
import { mockQuizzes } from '../../mocks/quizData';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { Quiz } from '../../types/quiz';

const QuizListScreen: React.FC<QuizListScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { quizzes, loading } = useSelector((state: RootState) => state.quiz);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = () => {
    dispatch(fetchQuizzesSuccess(mockQuizzes));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    loadQuizzes();
    setRefreshing(false);
  };

  const renderQuiz = ({ item }: { item: Quiz }) => (
    <Card
      style={styles.quizCard}
      onPress={() => navigation.navigate('QuizDetail', { quiz: item })}
    >
      <View style={styles.quizHeader}>
        <View style={[styles.quizIcon, { backgroundColor: theme.colors.secondary + '20' }]}>
          <Ionicons name="help-circle" size={24} color={theme.colors.secondary} />
        </View>
        <View style={styles.quizInfo}>
          <Text style={[styles.quizTitle, { color: theme.colors.textPrimary }]}>
            {item.title}
          </Text>
          <Text style={[styles.quizDescription, { color: theme.colors.textSecondary }]}>
            {item.description}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
      </View>
      
      <View style={styles.quizMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="help" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
            {item.questions.length} questions
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="time" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
            {Math.ceil(item.questions.length * item.timePerQuestion / 60)} min
          </Text>
        </View>
        <Badge 
          label="Available" 
          variant="success" 
          size="small" 
        />
      </View>
    </Card>
  );

  if (quizzes.length === 0 && !loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <EmptyState
          title="No Quizzes Available"
          message="Complete some lessons to unlock quizzes."
          icon={<Ionicons name="help-circle-outline" size={80} color={theme.colors.textSecondary} />}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={quizzes}
        renderItem={renderQuiz}
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
  listContainer: {
    padding: 16,
  },
  quizCard: {
    marginBottom: 16,
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  quizIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quizInfo: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quizDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  quizMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    marginLeft: 4,
  },
});

export default QuizListScreen;

