import type { WeekInfo } from '../types';

export const WEEKS_PER_YEAR = 52;

export function getWeekInfo(weekIndex: number, birthDate: Date, _lifespanYears: number): WeekInfo {
  const startDate = new Date(birthDate);
  startDate.setDate(startDate.getDate() + weekIndex * 7);

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);

  const now = new Date();
  const isPast = endDate < now;
  const isCurrent = startDate <= now && endDate >= now;
  const isFuture = startDate > now;

  const lifeYear = Math.floor(weekIndex / WEEKS_PER_YEAR);
  const weekOfYear = weekIndex % WEEKS_PER_YEAR;
  const age = lifeYear;

  return {
    index: weekIndex,
    lifeYear,
    weekOfYear,
    startDate,
    endDate,
    isPast,
    isCurrent,
    isFuture,
    calendarYear: startDate.getFullYear(),
    age,
  };
}

export function getCurrentWeekIndex(birthDate: Date): number {
  const now = new Date();
  const diffMs = now.getTime() - birthDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7);
}

export function getTotalWeeks(lifespanYears: number): number {
  return lifespanYears * WEEKS_PER_YEAR;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateRange(start: Date, end: Date): string {
  return `${formatDate(start)} – ${formatDate(end)}`;
}

export function getAge(birthDate: Date): number {
  const now = new Date();
  const diff = now.getFullYear() - birthDate.getFullYear();
  const m = now.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) return diff - 1;
  return diff;
}

export function getLifeProgress(birthDate: Date, lifespanYears: number): number {
  const totalWeeks = getTotalWeeks(lifespanYears);
  const currentWeek = getCurrentWeekIndex(birthDate);
  return Math.min(100, (currentWeek / totalWeeks) * 100);
}

export function weeksRemaining(birthDate: Date, lifespanYears: number): number {
  const totalWeeks = getTotalWeeks(lifespanYears);
  const currentWeek = getCurrentWeekIndex(birthDate);
  return Math.max(0, totalWeeks - currentWeek);
}

export function weekIndexToDateString(index: number, birthDate: Date): string {
  const info = getWeekInfo(index, birthDate, 90);
  return `Age ${info.age}, Week ${info.weekOfYear + 1}`;
}
