export interface Streaks {
  total: number;
  activitiesToday: number;
  days: StreakDays;
}

export type StreakDays = StreakDate[];

export interface StreakDate {
  date: string;
  activities: number;
  state: 'INCOMPLETE' | 'COMPLETED' | 'SAVED' | 'AT_RISK';
}

export interface DateWithActivities {
  [date: string]: number;
}
