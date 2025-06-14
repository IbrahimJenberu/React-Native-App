// src/mocks/studyRemindersData.ts
export interface StudyReminder {
  id: string;
  title: string;
  time: string; // HH:MM format
  days: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
  enabled: boolean;
}

export const mockStudyReminders: StudyReminder[] = [
  {
    id: 'reminder-1',
    title: 'Morning Study Session',
    time: '08:00',
    days: ['mon', 'tue', 'wed', 'thu', 'fri'],
    enabled: true,
  },
  {
    id: 'reminder-2',
    title: 'Afternoon Review',
    time: '15:30',
    days: ['mon', 'wed', 'fri'],
    enabled: true,
  },
  {
    id: 'reminder-3',
    title: 'Weekend Catch-up',
    time: '10:00',
    days: ['sat', 'sun'],
    enabled: false,
  },
];