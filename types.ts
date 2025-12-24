export type Frequency = 'daily' | 'weekly' | 'weekdays';

export interface Routine {
  id: string;
  title: string;
  description?: string;
  time: string; // HH:mm format
  frequency: Frequency;
  completedDates: string[]; // ISO Date strings (YYYY-MM-DD)
  notifyBefore: number; // minutes
  color?: string; // hex color code
}

export interface Event {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  description?: string;
  notifyBefore: number; // minutes
}

export type AppView = 'dashboard' | 'routines' | 'timetable' | 'events' | 'calendar' | 'settings';

export interface DailyStats {
  date: string;
  completed: number;
  total: number;
  percentage: number; // 0-100
}