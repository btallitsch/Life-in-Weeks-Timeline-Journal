import { useMemo } from 'react';
import { useAppContext } from '../store/AppContext';
import { getWeekInfo, getCurrentWeekIndex, getTotalWeeks } from '../utils/dateUtils';
import type { WeekInfo, WeekEntry } from '../types';

export function useWeeks() {
  const { state } = useAppContext();
  const { birthDate, lifespanYears } = state;

  const birthDateObj = useMemo(() => {
    if (!birthDate) return null;
    return new Date(birthDate);
  }, [birthDate]);

  const totalWeeks = useMemo(() => getTotalWeeks(lifespanYears), [lifespanYears]);

  const currentWeekIndex = useMemo(() => {
    if (!birthDateObj) return 0;
    return getCurrentWeekIndex(birthDateObj);
  }, [birthDateObj]);

  const getWeek = (index: number): WeekInfo | null => {
    if (!birthDateObj) return null;
    return getWeekInfo(index, birthDateObj, lifespanYears);
  };

  const getEntry = (index: number): WeekEntry | null => {
    return state.weeksData[index] || null;
  };

  const isFiltered = (index: number): boolean => {
    const { filterTags, filterMilestonesOnly, filterJournaledOnly } = state;
    if (filterTags.length === 0 && !filterMilestonesOnly && !filterJournaledOnly) return true;
    const entry = state.weeksData[index];
    if (!entry) return filterTags.length === 0 && !filterMilestonesOnly && !filterJournaledOnly;
    if (filterMilestonesOnly && !entry.isMilestone) return false;
    if (filterJournaledOnly && !entry.journalText) return false;
    if (filterTags.length > 0 && !filterTags.some(t => entry.tags.includes(t))) return false;
    return true;
  };

  return {
    birthDate: birthDateObj,
    totalWeeks,
    currentWeekIndex,
    getWeek,
    getEntry,
    isFiltered,
  };
}
