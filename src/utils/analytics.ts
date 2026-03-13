import type { WeekEntry, AppState } from '../types';
import { getCurrentWeekIndex, WEEKS_PER_YEAR } from './dateUtils';

export interface MoodPoint {
  weekIndex: number;
  age: number;
  mood: number;
  label: string;
}

export interface TagStat {
  tag: string;
  count: number;
  percentage: number;
}

export interface YearSummary {
  year: number;
  age: number;
  weeksJournaled: number;
  avgMood: number | null;
  avgProductivity: number | null;
  milestonesCount: number;
  tags: string[];
}

export function getMoodTimeline(
  weeksData: Record<number, WeekEntry>,
  birthDate: Date,
  limit = 200
): MoodPoint[] {
  const currentIdx = getCurrentWeekIndex(birthDate);
  const points: MoodPoint[] = [];

  for (let i = 0; i <= currentIdx; i++) {
    const entry = weeksData[i];
    if (entry?.metrics?.mood) {
      const age = Math.floor(i / WEEKS_PER_YEAR);
      points.push({
        weekIndex: i,
        age,
        mood: entry.metrics.mood,
        label: `Age ${age}`,
      });
    }
  }

  // Sample if too many
  if (points.length > limit) {
    const step = Math.floor(points.length / limit);
    return points.filter((_, i) => i % step === 0);
  }
  return points;
}

export function getTagStats(weeksData: Record<number, WeekEntry>): TagStat[] {
  const counts: Record<string, number> = {};
  let total = 0;

  Object.values(weeksData).forEach(entry => {
    entry.tags.forEach(tag => {
      counts[tag] = (counts[tag] || 0) + 1;
      total++;
    });
  });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({
      tag,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }));
}

export function getYearSummaries(
  weeksData: Record<number, WeekEntry>,
  birthDate: Date,
  lifespanYears: number
): YearSummary[] {
  const summaries: YearSummary[] = [];
  const currentWeek = getCurrentWeekIndex(birthDate);

  for (let year = 0; year < lifespanYears; year++) {
    const startWeek = year * WEEKS_PER_YEAR;
    if (startWeek > currentWeek) break;

    const weekEntries: WeekEntry[] = [];
    for (let w = startWeek; w < startWeek + WEEKS_PER_YEAR && w <= currentWeek; w++) {
      if (weeksData[w]) weekEntries.push(weeksData[w]);
    }

    if (weekEntries.length === 0) continue;

    const moods = weekEntries.map(e => e.metrics.mood).filter(Boolean) as number[];
    const prods = weekEntries.map(e => e.metrics.productivity).filter(Boolean) as number[];
    const allTags = weekEntries.flatMap(e => e.tags);
    const uniqueTags = [...new Set(allTags)];

    summaries.push({
      year,
      age: year,
      weeksJournaled: weekEntries.filter(e => e.journalText.length > 0).length,
      avgMood: moods.length > 0 ? parseFloat((moods.reduce((a, b) => a + b, 0) / moods.length).toFixed(1)) : null,
      avgProductivity: prods.length > 0 ? parseFloat((prods.reduce((a, b) => a + b, 0) / prods.length).toFixed(1)) : null,
      milestonesCount: weekEntries.filter(e => e.isMilestone).length,
      tags: uniqueTags,
    });
  }

  return summaries;
}

export function getOverallStats(state: AppState) {
  const entries = Object.values(state.weeksData);
  const milestones = entries.filter(e => e.isMilestone);
  const journaled = entries.filter(e => e.journalText.length > 0);
  const moods = entries.map(e => e.metrics.mood).filter(Boolean) as number[];
  const avgMood = moods.length > 0 ? moods.reduce((a, b) => a + b, 0) / moods.length : null;
  const allTags = entries.flatMap(e => e.tags);
  const topTag = allTags.length > 0
    ? Object.entries(
        allTags.reduce((acc, t) => ({ ...acc, [t]: (acc[t] || 0) + 1 }), {} as Record<string, number>)
      ).sort((a, b) => b[1] - a[1])[0]?.[0]
    : null;

  return {
    totalEntries: journaled.length,
    totalMilestones: milestones.length,
    avgMood: avgMood ? parseFloat(avgMood.toFixed(1)) : null,
    topTag,
    totalTags: [...new Set(allTags)].length,
  };
}
