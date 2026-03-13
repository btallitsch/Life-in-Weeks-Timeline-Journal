export interface WeekMetrics {
  productivity: number | null; // 1-5
  exercise: number | null;     // 0-7 days
  creativity: number | null;   // 1-5
  mood: number | null;         // 1-5
}

export interface WeekEntry {
  index: number;
  journalText: string;
  tags: string[];
  isMilestone: boolean;
  milestoneTitle: string;
  isPlanned: boolean;
  planText: string;
  metrics: WeekMetrics;
  createdAt: string;
  updatedAt: string;
}

export type View = 'grid' | 'analytics' | 'milestones';

export interface AppState {
  birthDate: string | null;
  lifespanYears: number;
  userName: string;
  weeksData: Record<number, WeekEntry>;
  currentView: View;
  selectedWeekIndex: number | null;
  filterTags: string[];
  filterMilestonesOnly: boolean;
  filterJournaledOnly: boolean;
}

export interface WeekInfo {
  index: number;
  lifeYear: number;   // 0-based year of life
  weekOfYear: number; // 0-51 within life year
  startDate: Date;
  endDate: Date;
  isPast: boolean;
  isCurrent: boolean;
  isFuture: boolean;
  calendarYear: number;
  age: number;
}

export const PREDEFINED_TAGS = [
  'career', 'relationship', 'travel', 'health', 'creativity',
  'family', 'education', 'finance', 'adventure', 'loss',
  'joy', 'challenge', 'growth', 'friendship', 'milestone',
];

export const TAG_COLORS: Record<string, string> = {
  career: '#4a90d9',
  relationship: '#e85d9e',
  travel: '#50c8a8',
  health: '#6bcf7f',
  creativity: '#f0a04b',
  family: '#d97b4a',
  education: '#9b7fe8',
  finance: '#4ac8d9',
  adventure: '#e8c44a',
  loss: '#8a8a9e',
  joy: '#f7e96a',
  challenge: '#e87b50',
  growth: '#7bcf50',
  friendship: '#e87bbf',
  milestone: '#c9a84c',
};
