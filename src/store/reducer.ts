import type { AppState, WeekEntry, View } from '../types';

export type Action =
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'SET_BIRTHDATE'; payload: { birthDate: string; userName: string; lifespanYears: number } }
  | { type: 'SELECT_WEEK'; payload: number | null }
  | { type: 'SAVE_WEEK_ENTRY'; payload: Partial<WeekEntry> & { index: number } }
  | { type: 'DELETE_WEEK_ENTRY'; payload: number }
  | { type: 'SET_VIEW'; payload: View }
  | { type: 'TOGGLE_TAG_FILTER'; payload: string }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'TOGGLE_MILESTONES_FILTER' }
  | { type: 'TOGGLE_JOURNALED_FILTER' };

export const initialState: AppState = {
  birthDate: null,
  lifespanYears: 90,
  userName: '',
  weeksData: {},
  currentView: 'grid',
  selectedWeekIndex: null,
  filterTags: [],
  filterMilestonesOnly: false,
  filterJournaledOnly: false,
};

function createEmptyEntry(index: number): WeekEntry {
  return {
    index,
    journalText: '',
    tags: [],
    isMilestone: false,
    milestoneTitle: '',
    isPlanned: false,
    planText: '',
    metrics: { productivity: null, exercise: null, creativity: null, mood: null },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD_STATE':
      return { ...state, ...action.payload };

    case 'SET_BIRTHDATE':
      return {
        ...state,
        birthDate: action.payload.birthDate,
        userName: action.payload.userName,
        lifespanYears: action.payload.lifespanYears,
      };

    case 'SELECT_WEEK':
      return { ...state, selectedWeekIndex: action.payload };

    case 'SAVE_WEEK_ENTRY': {
      const { index, ...data } = action.payload;
      const existing = state.weeksData[index] || createEmptyEntry(index);
      const updated: WeekEntry = {
        ...existing,
        ...data,
        index,
        updatedAt: new Date().toISOString(),
      };
      return {
        ...state,
        weeksData: { ...state.weeksData, [index]: updated },
      };
    }

    case 'DELETE_WEEK_ENTRY': {
      const { [action.payload]: _, ...remaining } = state.weeksData;
      return { ...state, weeksData: remaining };
    }

    case 'SET_VIEW':
      return { ...state, currentView: action.payload };

    case 'TOGGLE_TAG_FILTER': {
      const tag = action.payload;
      const has = state.filterTags.includes(tag);
      return {
        ...state,
        filterTags: has ? state.filterTags.filter(t => t !== tag) : [...state.filterTags, tag],
      };
    }

    case 'CLEAR_FILTERS':
      return { ...state, filterTags: [], filterMilestonesOnly: false, filterJournaledOnly: false };

    case 'TOGGLE_MILESTONES_FILTER':
      return { ...state, filterMilestonesOnly: !state.filterMilestonesOnly };

    case 'TOGGLE_JOURNALED_FILTER':
      return { ...state, filterJournaledOnly: !state.filterJournaledOnly };

    default:
      return state;
  }
}
