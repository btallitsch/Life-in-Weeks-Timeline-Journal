import { useAppContext } from './store/AppContext';
import SetupScreen from './components/Setup/SetupScreen';
import TopNav from './components/Navigation/TopNav';
import WeeksGrid from './components/Grid/WeeksGrid';
import JournalModal from './components/Journal/JournalModal';
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard';
import MilestonesPanel from './components/Milestones/MilestonesPanel';
import './App.css';

function AppShell() {
  const { state } = useAppContext();
  if (!state.birthDate) return <SetupScreen />;
  return (
    <div className="app-shell">
      <TopNav />
      <main className="app-main">
        {state.currentView === 'grid' && <WeeksGrid />}
        {state.currentView === 'analytics' && <AnalyticsDashboard />}
        {state.currentView === 'milestones' && <MilestonesPanel />}
      </main>
      {state.selectedWeekIndex !== null && <JournalModal />}
    </div>
  );
}

export default function App() {
  return <AppShell />;
}
