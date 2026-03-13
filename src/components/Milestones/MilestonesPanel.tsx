import { useMemo } from 'react';
import { Star } from 'lucide-react';
import { useAppContext } from '../../store/AppContext';
import { useWeeks } from '../../hooks/useWeeks';
import { formatDateRange } from '../../utils/dateUtils';
import { TAG_COLORS } from '../../types';
import './MilestonesPanel.css';

export default function MilestonesPanel() {
  const { state, dispatch } = useAppContext();
  const { getWeek } = useWeeks();

  const milestones = useMemo(() => {
    return Object.values(state.weeksData)
      .filter(e => e.isMilestone)
      .sort((a, b) => a.index - b.index);
  }, [state.weeksData]);

  const planned = useMemo(() => {
    return Object.values(state.weeksData)
      .filter(e => e.isPlanned)
      .sort((a, b) => a.index - b.index);
  }, [state.weeksData]);

  const handleClick = (idx: number) => {
    dispatch({ type: 'SET_VIEW', payload: 'grid' });
    setTimeout(() => dispatch({ type: 'SELECT_WEEK', payload: idx }), 50);
  };

  if (milestones.length === 0 && planned.length === 0) {
    return (
      <div className="milestones-empty">
        <div className="milestones-empty__icon">✦</div>
        <h2 className="milestones-empty__title">No milestones yet</h2>
        <p className="milestones-empty__text">
          Click any week on your timeline, open a journal entry, and check
          <strong> Mark as milestone</strong> to highlight it here.
        </p>
      </div>
    );
  }

  return (
    <div className="milestones">
      <div className="milestones-header">
        <h2 className="milestones-title">Milestones &amp; Plans</h2>
        <p className="milestones-subtitle">The defining moments of your journey</p>
      </div>

      {milestones.length > 0 && (
        <section className="milestones-section">
          <h3 className="milestones-section-title">
            <Star size={14} fill="currentColor" /> Milestones
          </h3>
          <div className="milestones-list">
            {milestones.map(entry => {
              const info = getWeek(entry.index);
              const primaryTag = entry.tags[0];
              const tagColor = primaryTag ? TAG_COLORS[primaryTag] : null;
              return (
                <button
                  key={entry.index}
                  className="milestone-card"
                  onClick={() => handleClick(entry.index)}
                >
                  <div
                    className="milestone-card__accent"
                    style={{ background: tagColor || 'var(--gold)' }}
                  />
                  <div className="milestone-card__body">
                    <div className="milestone-card__top">
                      <span className="milestone-card__title">
                        {entry.milestoneTitle || `Week ${entry.index}`}
                      </span>
                      <span className="milestone-card__age">
                        Age {info?.age ?? '?'}
                      </span>
                    </div>
                    {info && (
                      <span className="milestone-card__date">
                        {formatDateRange(info.startDate, info.endDate)}
                      </span>
                    )}
                    {entry.journalText && (
                      <p className="milestone-card__excerpt">
                        {entry.journalText.slice(0, 140)}{entry.journalText.length > 140 ? '…' : ''}
                      </p>
                    )}
                    {entry.tags.length > 0 && (
                      <div className="milestone-card__tags">
                        {entry.tags.map(tag => (
                          <span
                            key={tag}
                            className="milestone-card__tag"
                            style={{ color: TAG_COLORS[tag], borderColor: TAG_COLORS[tag] }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {planned.length > 0 && (
        <section className="milestones-section">
          <h3 className="milestones-section-title">
            ◎ Planned Events
          </h3>
          <div className="milestones-list">
            {planned.map(entry => {
              const info = getWeek(entry.index);
              return (
                <button
                  key={entry.index}
                  className="milestone-card milestone-card--planned"
                  onClick={() => handleClick(entry.index)}
                >
                  <div className="milestone-card__accent" style={{ background: 'var(--tag-travel)' }} />
                  <div className="milestone-card__body">
                    <div className="milestone-card__top">
                      <span className="milestone-card__title">
                        Week {entry.index} Plan
                      </span>
                      <span className="milestone-card__age">
                        {info?.isFuture ? `Future · Age ${info.age}` : `Age ${info?.age}`}
                      </span>
                    </div>
                    {info && (
                      <span className="milestone-card__date">
                        {formatDateRange(info.startDate, info.endDate)}
                      </span>
                    )}
                    {entry.planText && (
                      <p className="milestone-card__excerpt">{entry.planText.slice(0, 140)}</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
