import { memo } from 'react';
import type { WeekEntry } from '../../types';
import { TAG_COLORS } from '../../types';
import './WeekCell.css';

interface Props {
  index: number;
  isPast: boolean;
  isCurrent: boolean;
  isFuture: boolean;
  entry: WeekEntry | null;
  isFiltered: boolean;
  onClick: () => void;
}

function WeekCell({ index, isPast, isCurrent, isFuture, entry, isFiltered, onClick }: Props) {
  const hasJournal = !!entry?.journalText;
  const isMilestone = !!entry?.isMilestone;
  const isPlanned = !!entry?.isPlanned;
  const mood = entry?.metrics?.mood ?? null;
  const primaryTag = entry?.tags?.[0] ?? null;

  const getCellClass = () => {
    const classes = ['week-cell'];
    if (!isFiltered) classes.push('week-cell--dimmed');
    if (isCurrent) classes.push('week-cell--current');
    else if (isMilestone) classes.push('week-cell--milestone');
    else if (hasJournal && isPast) classes.push('week-cell--journaled');
    else if (isPlanned && isFuture) classes.push('week-cell--planned');
    else if (isPast) classes.push('week-cell--past');
    else classes.push('week-cell--future');
    return classes.join(' ');
  };

  const getMoodColor = () => {
    if (!mood) return undefined;
    const colors = ['', '#c44', '#c84', '#c8c840', '#6c4', '#3c8'];
    return colors[mood];
  };

  const tagColor = primaryTag ? TAG_COLORS[primaryTag] : null;

  return (
    <button
      className={getCellClass()}
      onClick={onClick}
      title={`Week ${index}`}
      aria-label={`Week ${index}${hasJournal ? ' (journaled)' : ''}${isMilestone ? ' (milestone)' : ''}`}
    >
      {mood && isPast && (
        <div
          className="week-cell__mood"
          style={{ background: getMoodColor() ?? 'transparent' }}
        />
      )}
      {tagColor && !isCurrent && (
        <div
          className="week-cell__tag-dot"
          style={{ background: tagColor }}
        />
      )}
      {isMilestone && <div className="week-cell__milestone-pip" />}
    </button>
  );
}

export default memo(WeekCell);
