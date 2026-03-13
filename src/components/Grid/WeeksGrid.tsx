import { useCallback } from 'react';
import { useAppContext } from '../../store/AppContext';
import { useWeeks } from '../../hooks/useWeeks';
import WeekCell from './WeekCell';
import GridLegend from './GridLegend';
import GridFilters from './GridFilters';
import { WEEKS_PER_YEAR } from '../../utils/dateUtils';
import './WeeksGrid.css';

export default function WeeksGrid() {
  const { state, dispatch } = useAppContext();
  const { totalWeeks, getWeek, getEntry, isFiltered } = useWeeks();

  const handleCellClick = useCallback((index: number) => {
    dispatch({ type: 'SELECT_WEEK', payload: index });
  }, [dispatch]);

  const rows: number[][] = [];
  for (let year = 0; year < state.lifespanYears; year++) {
    const row: number[] = [];
    for (let week = 0; week < WEEKS_PER_YEAR; week++) {
      const idx = year * WEEKS_PER_YEAR + week;
      if (idx < totalWeeks) row.push(idx);
    }
    rows.push(row);
  }

  return (
    <div className="weeks-grid-container">
      <GridFilters />

      <div className="weeks-grid-scroll">
        <div className="weeks-grid-inner">
          {/* Column header: week numbers */}
          <div className="grid-header-row">
            <div className="grid-year-label" />
            {Array.from({ length: WEEKS_PER_YEAR }, (_, i) => (
              <div key={i} className="grid-col-label">
                {(i + 1) % 4 === 1 ? i + 1 : ''}
              </div>
            ))}
          </div>

          {/* Rows: one per year of life */}
          {rows.map((row, yearIdx) => (
            <div key={yearIdx} className="grid-row">
              <div className="grid-year-label">
                {yearIdx % 5 === 0 ? yearIdx : ''}
              </div>
              {row.map(idx => {
                const info = getWeek(idx);
                const entry = getEntry(idx);
                const filtered = isFiltered(idx);
                if (!info) return null;
                return (
                  <WeekCell
                    key={idx}
                    index={idx}
                    isPast={info.isPast}
                    isCurrent={info.isCurrent}
                    isFuture={info.isFuture}
                    entry={entry}
                    isFiltered={filtered}
                    onClick={() => handleCellClick(idx)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <GridLegend />
    </div>
  );
}
