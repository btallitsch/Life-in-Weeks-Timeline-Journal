import { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid,
} from 'recharts';
import { useAppContext } from '../../store/AppContext';
import { getMoodTimeline, getTagStats, getOverallStats } from '../../utils/analytics';
import { TAG_COLORS } from '../../types';
import './AnalyticsDashboard.css';

export default function AnalyticsDashboard() {
  const { state } = useAppContext();

  const birthDate = useMemo(() => state.birthDate ? new Date(state.birthDate) : null, [state.birthDate]);

  const moodData = useMemo(() =>
    birthDate ? getMoodTimeline(state.weeksData, birthDate) : [],
    [state.weeksData, birthDate]
  );

  const tagStats = useMemo(() => getTagStats(state.weeksData), [state.weeksData]);
  const overallStats = useMemo(() => getOverallStats(state), [state]);

  const hasData = Object.keys(state.weeksData).length > 0;

  if (!hasData) {
    return (
      <div className="analytics-empty">
        <div className="analytics-empty__icon">◈</div>
        <h2 className="analytics-empty__title">No data yet</h2>
        <p className="analytics-empty__text">
          Start journaling weeks on your timeline to see insights here.
          Add mood, productivity, and creativity scores to unlock charts.
        </p>
      </div>
    );
  }

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h2 className="analytics-title">Life Insights</h2>
        <p className="analytics-subtitle">Patterns and reflections across your timeline</p>
      </div>

      {/* Stats row */}
      <div className="analytics-stats">
        <StatCard label="Weeks Journaled" value={overallStats.totalEntries} suffix="weeks" />
        <StatCard label="Milestones" value={overallStats.totalMilestones} suffix="total" />
        <StatCard
          label="Avg Mood"
          value={overallStats.avgMood ?? '—'}
          suffix={overallStats.avgMood ? '/ 5' : ''}
        />
        <StatCard label="Top Theme" value={overallStats.topTag ?? '—'} suffix="" />
      </div>

      {/* Mood timeline */}
      {moodData.length > 1 && (
        <div className="analytics-card">
          <h3 className="analytics-card-title">Mood Over Time</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={moodData} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis
                dataKey="age"
                tick={{ fill: 'var(--text-3)', fontFamily: 'var(--font-mono)', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={v => `${v}`}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                tick={{ fill: 'var(--text-3)', fontFamily: 'var(--font-mono)', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-3)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: 'var(--text-1)',
                }}
                labelFormatter={v => `Age ${v}`}
                formatter={(val: unknown) => [(val as number).toFixed(1), 'Mood']}
              />
              <Line
                type="monotoneX"
                dataKey="mood"
                stroke="var(--gold)"
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 3, fill: 'var(--gold)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Tag distribution */}
      {tagStats.length > 0 && (
        <div className="analytics-card">
          <h3 className="analytics-card-title">Life Themes</h3>
          <div className="analytics-tags">
            {tagStats.map(stat => (
              <div key={stat.tag} className="analytics-tag-row">
                <span className="analytics-tag-name" style={{ color: TAG_COLORS[stat.tag] || 'var(--text-1)' }}>
                  {stat.tag}
                </span>
                <div className="analytics-tag-bar-wrap">
                  <div
                    className="analytics-tag-bar"
                    style={{
                      width: `${stat.percentage}%`,
                      background: TAG_COLORS[stat.tag] || 'var(--gold)',
                    }}
                  />
                </div>
                <span className="analytics-tag-count">{stat.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Productivity bar chart */}
      {moodData.length > 1 && (
        <div className="analytics-card">
          <h3 className="analytics-card-title">Mood Distribution</h3>
          <MoodDistribution weeksData={state.weeksData} />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, suffix }: { label: string; value: string | number; suffix: string }) {
  return (
    <div className="stat-card">
      <span className="stat-card__label">{label}</span>
      <span className="stat-card__value">{value}</span>
      {suffix && <span className="stat-card__suffix">{suffix}</span>}
    </div>
  );
}

function MoodDistribution({ weeksData }: { weeksData: Record<number, import('../../types').WeekEntry> }) {
  const dist = [1, 2, 3, 4, 5].map(n => ({
    mood: n,
    label: ['😞 Low', '😕 Poor', '😐 Okay', '🙂 Good', '😄 Great'][n - 1],
    count: Object.values(weeksData).filter(e => e.metrics.mood === n).length,
  }));

  const moodColors = ['#c44', '#c84', '#c8c840', '#6c4', '#3c8'];

  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={dist} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
        <CartesianGrid stroke="rgba(255,255,255,0.04)" horizontal={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: 'var(--text-3)', fontFamily: 'var(--font-mono)', fontSize: 9 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fill: 'var(--text-3)', fontFamily: 'var(--font-mono)', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            background: 'var(--bg-3)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'var(--text-1)',
          }}
          formatter={(val: unknown) => [val as number, 'weeks']}
        />
        {dist.map((d, i) => (
          <Bar key={d.mood} dataKey="count" fill={moodColors[i]} radius={[2, 2, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
