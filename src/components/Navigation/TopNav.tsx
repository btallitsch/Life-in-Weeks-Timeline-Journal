import { Grid3x3, BarChart3, Star, Settings } from 'lucide-react';
import { useAppContext } from '../../store/AppContext';
import { useWeeks } from '../../hooks/useWeeks';
import { getLifeProgress, weeksRemaining } from '../../utils/dateUtils';
import './TopNav.css';

interface NavItem {
  view: 'grid' | 'analytics' | 'milestones';
  label: string;
  icon: React.ReactNode;
}

export default function TopNav() {
  const { state, dispatch } = useAppContext();
  const { birthDate, currentWeekIndex } = useWeeks();

  const navItems: NavItem[] = [
    { view: 'grid', label: 'Timeline', icon: <Grid3x3 size={14} /> },
    { view: 'analytics', label: 'Insights', icon: <BarChart3 size={14} /> },
    { view: 'milestones', label: 'Milestones', icon: <Star size={14} /> },
  ];

  const progress = birthDate ? getLifeProgress(birthDate, state.lifespanYears) : 0;
  const remaining = birthDate ? weeksRemaining(birthDate, state.lifespanYears) : 0;

  const handleReset = () => {
    if (confirm('Reset all data? This cannot be undone.')) {
      localStorage.clear();
      location.reload();
    }
  };

  return (
    <header className="topnav">
      <div className="topnav-brand">
        <span className="topnav-ornament">◆</span>
        <div>
          <h1 className="topnav-title">Life in Weeks</h1>
          {state.userName && (
            <span className="topnav-user">{state.userName}</span>
          )}
        </div>
      </div>

      <nav className="topnav-nav">
        {navItems.map(item => (
          <button
            key={item.view}
            className={`topnav-item ${state.currentView === item.view ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_VIEW', payload: item.view })}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="topnav-meta">
        {birthDate && (
          <>
            <div className="topnav-stat">
              <span className="topnav-stat-label">Week</span>
              <span className="topnav-stat-val">{currentWeekIndex.toLocaleString()}</span>
            </div>
            <div className="topnav-stat">
              <span className="topnav-stat-label">Remaining</span>
              <span className="topnav-stat-val">{remaining.toLocaleString()}</span>
            </div>
            <div className="topnav-progress-wrap">
              <div className="topnav-progress-bar">
                <div className="topnav-progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="topnav-progress-pct">{progress.toFixed(1)}%</span>
            </div>
          </>
        )}
        <button className="topnav-settings" onClick={handleReset} title="Reset data">
          <Settings size={14} />
        </button>
      </div>
    </header>
  );
}
