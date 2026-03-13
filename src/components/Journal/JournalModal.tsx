import React, { useState, useEffect } from 'react';
import { X, Star, BookOpen, Target, BarChart2, Tag } from 'lucide-react';
import { useAppContext } from '../../store/AppContext';
import { useWeeks } from '../../hooks/useWeeks';
import { PREDEFINED_TAGS, TAG_COLORS } from '../../types';
import type { WeekEntry, WeekMetrics } from '../../types';
import { formatDateRange } from '../../utils/dateUtils';
import './JournalModal.css';

type TabId = 'journal' | 'metrics' | 'tags' | 'plan';

export default function JournalModal() {
  const { state, dispatch } = useAppContext();
  const { getWeek, getEntry } = useWeeks();
  const idx = state.selectedWeekIndex;

  const weekInfo = idx !== null ? getWeek(idx) : null;
  const existingEntry = idx !== null ? getEntry(idx) : null;

  const [tab, setTab] = useState<TabId>('journal');
  const [journalText, setJournalText] = useState('');
  const [isMilestone, setIsMilestone] = useState(false);
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [isPlanned, setIsPlanned] = useState(false);
  const [planText, setPlanText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<WeekMetrics>({ mood: null, productivity: null, exercise: null, creativity: null });

  // Load existing entry
  useEffect(() => {
    if (existingEntry) {
      setJournalText(existingEntry.journalText);
      setIsMilestone(existingEntry.isMilestone);
      setMilestoneTitle(existingEntry.milestoneTitle);
      setIsPlanned(existingEntry.isPlanned);
      setPlanText(existingEntry.planText);
      setSelectedTags(existingEntry.tags);
      setMetrics(existingEntry.metrics);
    } else {
      setJournalText('');
      setIsMilestone(false);
      setMilestoneTitle('');
      setIsPlanned(false);
      setPlanText('');
      setSelectedTags([]);
      setMetrics({ mood: null, productivity: null, exercise: null, creativity: null });
    }
    setTab('journal');
  }, [idx]);

  if (idx === null || !weekInfo) return null;

  const handleClose = () => dispatch({ type: 'SELECT_WEEK', payload: null });

  const handleSave = () => {
    const hasContent = journalText.trim() || isMilestone || isPlanned || selectedTags.length > 0
      || Object.values(metrics).some(v => v !== null);
    if (!hasContent) {
      dispatch({ type: 'DELETE_WEEK_ENTRY', payload: idx });
    } else {
      const partial: Partial<WeekEntry> & { index: number } = {
        index: idx,
        journalText: journalText.trim(),
        isMilestone,
        milestoneTitle: milestoneTitle.trim(),
        isPlanned,
        planText: planText.trim(),
        tags: selectedTags,
        metrics,
      };
      dispatch({ type: 'SAVE_WEEK_ENTRY', payload: partial });
    }
    handleClose();
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const setMetric = (key: keyof WeekMetrics, val: number | null) => {
    setMetrics(prev => ({ ...prev, [key]: prev[key] === val ? null : val }));
  };

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'journal', label: 'Journal', icon: <BookOpen size={13} /> },
    { id: 'metrics', label: 'Metrics', icon: <BarChart2 size={13} /> },
    { id: 'tags', label: 'Tags', icon: <Tag size={13} /> },
    { id: 'plan', label: 'Plans', icon: <Target size={13} /> },
  ];

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && handleClose()}>
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-info">
            <div className="modal-week-label">
              <span className="modal-week-num">Week {idx}</span>
              <span className="modal-week-age">
                {weekInfo.isCurrent ? '← you are here' : `Age ${weekInfo.age}`}
              </span>
            </div>
            <div className="modal-date-range">
              {formatDateRange(weekInfo.startDate, weekInfo.endDate)}
            </div>
          </div>
          <div className="modal-header-actions">
            <button
              className={`modal-milestone-btn ${isMilestone ? 'modal-milestone-btn--active' : ''}`}
              onClick={() => setIsMilestone(!isMilestone)}
              title="Mark as milestone"
            >
              <Star size={14} fill={isMilestone ? 'currentColor' : 'none'} />
              Milestone
            </button>
            <button className="modal-close" onClick={handleClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Milestone title */}
        {isMilestone && (
          <div className="modal-milestone-title-wrap">
            <input
              className="modal-milestone-title-input"
              placeholder="Name this milestone…"
              value={milestoneTitle}
              onChange={e => setMilestoneTitle(e.target.value)}
              autoFocus
            />
          </div>
        )}

        {/* Tabs */}
        <div className="modal-tabs">
          {tabs.map(t => (
            <button
              key={t.id}
              className={`modal-tab ${tab === t.id ? 'modal-tab--active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="modal-content">
          {tab === 'journal' && (
            <div className="modal-journal">
              <textarea
                className="modal-textarea"
                placeholder={
                  weekInfo.isFuture
                    ? "Imagine this week… what do you hope it holds?"
                    : weekInfo.isCurrent
                    ? "What's happening this week?"
                    : "Reflect on this week. What happened? How did you feel?"
                }
                value={journalText}
                onChange={e => setJournalText(e.target.value)}
                autoFocus={tab === 'journal'}
              />
              <div className="modal-journal-meta">
                <span className="modal-char-count">{journalText.length} chars</span>
                {weekInfo.isFuture && (
                  <span className="modal-future-badge">Future week</span>
                )}
              </div>
            </div>
          )}

          {tab === 'metrics' && (
            <div className="modal-metrics">
              {!weekInfo.isFuture ? (
                <>
                  <MetricRow
                    label="Mood"
                    sublabel="How were you feeling overall?"
                    value={metrics.mood}
                    max={5}
                    labels={['😞', '😕', '😐', '🙂', '😄']}
                    onChange={val => setMetric('mood', val)}
                    color="var(--mood-5)"
                  />
                  <MetricRow
                    label="Productivity"
                    sublabel="How much did you get done?"
                    value={metrics.productivity}
                    max={5}
                    labels={['1', '2', '3', '4', '5']}
                    onChange={val => setMetric('productivity', val)}
                    color="var(--tag-career)"
                  />
                  <MetricRow
                    label="Creativity"
                    sublabel="Creative output this week?"
                    value={metrics.creativity}
                    max={5}
                    labels={['1', '2', '3', '4', '5']}
                    onChange={val => setMetric('creativity', val)}
                    color="var(--tag-creativity)"
                  />
                  <div className="metric-row">
                    <div className="metric-row__info">
                      <span className="metric-row__label">Exercise</span>
                      <span className="metric-row__sublabel">Days of exercise this week</span>
                    </div>
                    <div className="metric-row__dots">
                      {[0,1,2,3,4,5,6,7].map(n => (
                        <button
                          key={n}
                          className={`metric-dot metric-dot--square ${metrics.exercise !== null && n <= metrics.exercise ? 'metric-dot--active' : ''}`}
                          style={metrics.exercise !== null && n <= metrics.exercise ? { background: 'var(--tag-health)' } : {}}
                          onClick={() => setMetric('exercise', metrics.exercise === n ? null : n)}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <p className="modal-future-note">Metrics are for past and current weeks.</p>
              )}
            </div>
          )}

          {tab === 'tags' && (
            <div className="modal-tags">
              <p className="modal-tags-hint">Tag this week to find it later in filters and analytics.</p>
              <div className="modal-tags-grid">
                {PREDEFINED_TAGS.map(tag => (
                  <button
                    key={tag}
                    className={`modal-tag ${selectedTags.includes(tag) ? 'modal-tag--active' : ''}`}
                    style={selectedTags.includes(tag) ? { borderColor: TAG_COLORS[tag], color: TAG_COLORS[tag], background: `${TAG_COLORS[tag]}18` } : {}}
                    onClick={() => toggleTag(tag)}
                  >
                    <span className="modal-tag__dot" style={{ background: TAG_COLORS[tag] }} />
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {tab === 'plan' && (
            <div className="modal-plan">
              <label className="modal-plan-label">
                <input
                  type="checkbox"
                  checked={isPlanned}
                  onChange={e => setIsPlanned(e.target.checked)}
                />
                Mark this week as a planned event or goal
              </label>
              {isPlanned && (
                <textarea
                  className="modal-textarea modal-textarea--short"
                  placeholder="Describe what you're planning for this week…"
                  value={planText}
                  onChange={e => setPlanText(e.target.value)}
                />
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="modal-btn-cancel" onClick={handleClose}>Cancel</button>
          <button className="modal-btn-save" onClick={handleSave}>Save Entry</button>
        </div>
      </div>
    </div>
  );
}

function MetricRow({
  label, sublabel, value, max, labels, onChange, color,
}: {
  label: string;
  sublabel: string;
  value: number | null;
  max: number;
  labels: string[];
  onChange: (val: number) => void;
  color: string;
}) {
  return (
    <div className="metric-row">
      <div className="metric-row__info">
        <span className="metric-row__label">{label}</span>
        <span className="metric-row__sublabel">{sublabel}</span>
      </div>
      <div className="metric-row__dots">
        {Array.from({ length: max }, (_, i) => i + 1).map(n => (
          <button
            key={n}
            className={`metric-dot ${value === n ? 'metric-dot--active' : ''}`}
            style={value !== null && n <= value ? { background: color } : {}}
            onClick={() => onChange(n)}
            title={labels[n - 1]}
          >
            {labels[n - 1]}
          </button>
        ))}
      </div>
    </div>
  );
}
