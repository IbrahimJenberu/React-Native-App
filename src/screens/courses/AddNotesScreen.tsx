// src/screens/courses/AddNotesScreen.tsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useDispatch } from 'react-redux';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { CourseStackParamList } from '../../navigation/types';
import { updateLessonNotes } from '../../store/slices/courseSlice';
import Button from '../../components/ui/Button';

type AddNotesScreenRouteProp = RouteProp<CourseStackParamList, 'AddNotes'>;

const AddNotesScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<AddNotesScreenRouteProp>();
  const dispatch = useDispatch();
  
  const { lessonId, notes: initialNotes } = route.params;
  const [notes, setNotes] = useState(initialNotes || '');

  const handleSave = () => {
    dispatch(updateLessonNotes({ lessonId, notes }));
    Alert.alert('Success', 'Notes saved successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: theme.colors.cardBackground,
              color: theme.colors.textPrimary,
              borderColor: theme.colors.border,
            },
          ]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Write your notes here..."
          placeholderTextColor={theme.colors.textSecondary}
          multiline
          textAlignVertical="top"
        />
        
        <View style={styles.buttonContainer}>
          <Button
            title="Save Notes"
            onPress={handleSave}
            fullWidth
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  buttonContainer: {
    paddingBottom: 16,
  },
});

export default AddNotesScreen;