import { useAppContext } from '../../store/AppContext';
import { PREDEFINED_TAGS, TAG_COLORS } from '../../types';
import './GridFilters.css';

export default function GridFilters() {
  const { state, dispatch } = useAppContext();
  const { filterTags, filterMilestonesOnly, filterJournaledOnly } = state;

  const hasFilters = filterTags.length > 0 || filterMilestonesOnly || filterJournaledOnly;

  return (
    <div className="grid-filters">
      <div className="grid-filters__tags">
        {PREDEFINED_TAGS.map(tag => (
          <button
            key={tag}
            className={`filter-tag ${filterTags.includes(tag) ? 'filter-tag--active' : ''}`}
            style={filterTags.includes(tag) ? { borderColor: TAG_COLORS[tag], color: TAG_COLORS[tag] } : {}}
            onClick={() => dispatch({ type: 'TOGGLE_TAG_FILTER', payload: tag })}
          >
            <span
              className="filter-tag__dot"
              style={{ background: TAG_COLORS[tag] }}
            />
            {tag}
          </button>
        ))}
      </div>

      <div className="grid-filters__toggles">
        <button
          className={`filter-toggle ${filterMilestonesOnly ? 'filter-toggle--active' : ''}`}
          onClick={() => dispatch({ type: 'TOGGLE_MILESTONES_FILTER' })}
        >
          ★ Milestones
        </button>
        <button
          className={`filter-toggle ${filterJournaledOnly ? 'filter-toggle--active' : ''}`}
          onClick={() => dispatch({ type: 'TOGGLE_JOURNALED_FILTER' })}
        >
          ✎ Journaled
        </button>
        {hasFilters && (
          <button
            className="filter-clear"
            onClick={() => dispatch({ type: 'CLEAR_FILTERS' })}
          >
            ✕ Clear
          </button>
        )}
      </div>
    </div>
  );
}
