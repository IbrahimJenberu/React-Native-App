// src/screens/profile/StudyRemindersScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

// Define the StudyReminder type
type StudyReminder = {
  id: string;
  title: string;
  time: string;
  days: string[];
  enabled: boolean;
};

// Create mock data
const mockStudyReminders: StudyReminder[] = [
  {
    id: '1',
    title: 'Morning Study',
    time: '08:00 AM',
    days: ['mon', 'wed', 'fri'],
    enabled: true,
  },
  {
    id: '2',
    title: 'Evening Review',
    time: '07:00 PM',
    days: ['tue', 'thu'],
    enabled: false,
  },
  {
    id: '3',
    title: 'Weekend Practice',
    time: '10:00 AM',
    days: ['sat', 'sun'],
    enabled: true,
  },
];

const StudyRemindersScreen: React.FC = () => {
  const { theme } = useTheme();
  const [reminders, setReminders] = useState<StudyReminder[]>(mockStudyReminders);

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id 
        ? { ...reminder, enabled: !reminder.enabled }
        : reminder
    ));
  };

  const formatDays = (days: string[]) => {
    const dayMap: { [key: string]: string } = {
      mon: 'Mon',
      tue: 'Tue',
      wed: 'Wed',
      thu: 'Thu',
      fri: 'Fri',
      sat: 'Sat',
      sun: 'Sun'
    };
    return days.map(day => dayMap[day]).join(', ');
  };

  const renderReminder = ({ item }: { item: StudyReminder }) => (
    <Card style={styles.reminderCard}>
      <View style={styles.reminderHeader}>
        <View style={styles.reminderInfo}>
          <Text style={[styles.reminderTitle, { color: theme.colors.textPrimary }]}>
            {item.title}
          </Text>
          <Text style={[styles.reminderTime, { color: theme.colors.primary }]}>
            {item.time}
          </Text>
          <Text style={[styles.reminderDays, { color: theme.colors.textSecondary }]}>
            {formatDays(item.days)}
          </Text>
        </View>
        <Switch
          value={item.enabled}
          onValueChange={() => toggleReminder(item.id)}
          trackColor={{
            false: theme.colors.border,
            true: theme.colors.primary + '40',
          }}
          thumbColor={item.enabled ? theme.colors.primary : theme.colors.textSecondary}
        />
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={reminders}
        renderItem={renderReminder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      
      <View style={styles.buttonContainer}>
        <Button
          title="Add New Reminder"
          leftIcon={<Ionicons name="add" size={20} color={theme.colors.white} />}
          fullWidth
          onPress={() => {/* Handle add reminder */}}
        />
      </View>
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
  reminderCard: {
    marginBottom: 12,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  reminderTime: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reminderDays: {
    fontSize: 12,
  },
  buttonContainer: {
    padding: 16,
  },
});

export default StudyRemindersScreen;