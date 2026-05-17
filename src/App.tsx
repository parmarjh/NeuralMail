import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import EmailList from './components/EmailList';
import EmailDetail from './components/EmailDetail';
import ComposeModal from './components/ComposeModal';
import AgentStatusBar from './components/AgentStatusBar';
import Notifications from './components/Notifications';
import { Menu } from 'lucide-react';
import './index.css';

function AppShell() {
  const { state, dispatch } = useApp();
  return (
    <div className={`app ${state.isSidebarOpen ? '' : 'sidebar-closed'}`}>
      <Sidebar />
      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
          <button className="icon-btn" onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })} title="Toggle sidebar">
            <Menu size={18} />
          </button>
        </div>
        <EmailList />
        <AgentStatusBar />
      </div>
      <EmailDetail />
      <ComposeModal />
      <Notifications />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
