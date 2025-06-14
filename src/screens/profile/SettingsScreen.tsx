// src/screens/profile/SettingsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import Card from '../../components/ui/Card';

const SettingsScreen: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [studyReminders, setStudyReminders] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);

  const settingItems = [
    {
      icon: 'moon-outline',
      title: 'Dark Mode',
      subtitle: 'Switch between light and dark theme',
      value: theme.colors.background === '#121212',
      onToggle: toggleTheme,
    },
    {
      icon: 'notifications-outline',
      title: 'Push Notifications',
      subtitle: 'Receive important updates',
      value: notifications,
      onToggle: setNotifications,
    },
    {
      icon: 'alarm-outline',
      title: 'Study Reminders',
      subtitle: 'Get reminded about your study schedule',
      value: studyReminders,
      onToggle: setStudyReminders,
    },
    {
      icon: 'volume-medium-outline',
      title: 'Sound Effects',
      subtitle: 'Play sounds for interactions',
      value: soundEffects,
      onToggle: setSoundEffects,
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.settingsCard}>
        {settingItems.map((item, index) => (
          <View
            key={index}
            style={[
              styles.settingItem,
              index < settingItems.length - 1 && styles.settingItemBorder
            ]}
          >
            <Ionicons name={item.icon as any} size={24} color={theme.colors.primary} />
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: theme.colors.textPrimary }]}>
                {item.title}
              </Text>
              <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                {item.subtitle}
              </Text>
            </View>
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary + '40',
              }}
              thumbColor={item.value ? theme.colors.primary : theme.colors.textSecondary}
            />
          </View>
        ))}
      </Card>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  settingsCard: {
    padding: 0,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingContent: {
    flex: 1,
    marginLeft: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
  },
});

export default SettingsScreen;

