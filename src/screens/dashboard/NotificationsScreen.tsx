// src/screens/dashboard/NotificationsScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'reminder';
  timestamp: string;
  read: boolean;
}

const NotificationsScreen: React.FC = () => {
  const { theme } = useTheme();

  // Mock notifications - in a real app, these would come from an API
  const notifications: Notification[] = [
    {
      id: '1',
      title: 'Quiz Available',
      message: 'A new quiz for Advanced Mathematics is now available',
      type: 'info',
      timestamp: '2 hours ago',
      read: false,
    },
    {
      id: '2',
      title: 'Lesson Completed',
      message: 'Great job! You completed "Introduction to Calculus"',
      type: 'success',
      timestamp: '1 day ago',
      read: true,
    },
    {
      id: '3',
      title: 'Study Reminder',
      message: 'Don\'t forget your daily study session at 3:00 PM',
      type: 'reminder',
      timestamp: '2 days ago',
      read: true,
    },
  ];

  const getIconName = (type: string) => {
    switch (type) {
      case 'info': return 'information-circle';
      case 'success': return 'checkmark-circle';
      case 'warning': return 'warning';
      case 'reminder': return 'alarm';
      default: return 'notifications';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'info': return theme.colors.info;
      case 'success': return theme.colors.success;
      case 'warning': return theme.colors.warning;
      case 'reminder': return theme.colors.secondary;
      default: return theme.colors.primary;
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <Card style={[styles.notificationCard, { opacity: item.read ? 0.7 : 1 }]}>
      <View style={styles.notificationHeader}>
        <Ionicons
          name={getIconName(item.type) as any}
          size={24}
          color={getIconColor(item.type)}
        />
        <View style={styles.notificationContent}>
          <View style={styles.titleRow}>
            <Text style={[styles.notificationTitle, { color: theme.colors.textPrimary }]}>
              {item.title}
            </Text>
            {!item.read && <Badge label="New" variant="primary" size="small" />}
          </View>
          <Text style={[styles.notificationMessage, { color: theme.colors.textSecondary }]}>
            {item.message}
          </Text>
          <Text style={[styles.notificationTime, { color: theme.colors.textSecondary }]}>
            {item.timestamp}
          </Text>
        </View>
      </View>
    </Card>
  );

  if (notifications.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <EmptyState
          title="No Notifications"
          message="You're all caught up! Check back later for updates."
          icon={<Ionicons name="notifications-outline" size={80} color={theme.colors.textSecondary} />}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
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
  notificationCard: {
    marginBottom: 12,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationContent: {
    flex: 1,
    marginLeft: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
  },
});

export default NotificationsScreen;