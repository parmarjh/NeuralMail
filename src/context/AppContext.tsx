import React, { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';
import type { AppState, Email, EmailFolder, ComposeState, AgentName, Notification } from '../types';
import { MOCK_ACCOUNTS, MOCK_LABELS } from '../data/mockData';
import { orchestrateEmailLoad, runSearcherAgent } from '../agents';

// ─── State ────────────────────────────────────────────────────────────────────
const initialState: AppState = {
  accounts: MOCK_ACCOUNTS,
  activeAccountId: null,
  emails: [],
  selectedEmailId: null,
  selectedFolder: 'inbox',
  selectedLabel: null,
  isComposing: false,
  composeState: null,
  searchQuery: '',
  isLoading: false,
  isSidebarOpen: true,
  isDarkMode: true,
  agentStatus: {},
};

// ─── Actions ──────────────────────────────────────────────────────────────────
type Action =
  | { type: 'SET_EMAILS'; emails: Email[] }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SELECT_EMAIL'; id: string | null }
  | { type: 'SELECT_FOLDER'; folder: EmailFolder }
  | { type: 'SELECT_LABEL'; label: string | null }
  | { type: 'SET_ACCOUNT'; accountId: string | null }
  | { type: 'TOGGLE_COMPOSE'; state?: ComposeState }
  | { type: 'CLOSE_COMPOSE' }
  | { type: 'SET_SEARCH'; query: string }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'MARK_READ'; id: string }
  | { type: 'TOGGLE_STAR'; id: string }
  | { type: 'ARCHIVE'; id: string }
  | { type: 'DELETE'; id: string }
  | { type: 'SET_AGENT_STATUS'; agent: AgentName; status: 'idle' | 'running' | 'done' | 'error' }
  | { type: 'UPDATE_AI_INSIGHTS'; emailId: string; insights: Email['aiInsights'] };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_EMAILS': return { ...state, emails: action.emails };
    case 'SET_LOADING': return { ...state, isLoading: action.loading };
    case 'SELECT_EMAIL': return { ...state, selectedEmailId: action.id };
    case 'SELECT_FOLDER': return { ...state, selectedFolder: action.folder, selectedLabel: null, selectedEmailId: null, searchQuery: '' };
    case 'SELECT_LABEL': return { ...state, selectedLabel: action.label, selectedEmailId: null };
    case 'SET_ACCOUNT': return { ...state, activeAccountId: action.accountId, selectedEmailId: null };
    case 'TOGGLE_COMPOSE': return { ...state, isComposing: true, composeState: action.state ?? { to: '', cc: '', bcc: '', subject: '', body: '', mode: 'compose', isDraft: false, attachments: [] } };
    case 'CLOSE_COMPOSE': return { ...state, isComposing: false, composeState: null };
    case 'SET_SEARCH': return { ...state, searchQuery: action.query };
    case 'TOGGLE_SIDEBAR': return { ...state, isSidebarOpen: !state.isSidebarOpen };
    case 'MARK_READ': return { ...state, emails: state.emails.map(e => e.id === action.id ? { ...e, isRead: true } : e) };
    case 'TOGGLE_STAR': return { ...state, emails: state.emails.map(e => e.id === action.id ? { ...e, isStarred: !e.isStarred } : e) };
    case 'ARCHIVE': return { ...state, emails: state.emails.map(e => e.id === action.id ? { ...e, isArchived: true, folder: 'archive' as EmailFolder } : e), selectedEmailId: state.selectedEmailId === action.id ? null : state.selectedEmailId };
    case 'DELETE': return { ...state, emails: state.emails.map(e => e.id === action.id ? { ...e, isDeleted: true, folder: 'trash' as EmailFolder } : e), selectedEmailId: state.selectedEmailId === action.id ? null : state.selectedEmailId };
    case 'SET_AGENT_STATUS': return { ...state, agentStatus: { ...state.agentStatus, [action.agent]: { status: action.status, lastRun: new Date().toISOString() } } };
    case 'UPDATE_AI_INSIGHTS': return { ...state, emails: state.emails.map(e => e.id === action.emailId ? { ...e, aiInsights: action.insights } : e) };
    default: return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
interface AppContextValue {
  state: AppState;
  labels: typeof MOCK_LABELS;
  notifications: Notification[];
  dispatch: React.Dispatch<Action>;
  loadEmails: (accountId?: string) => Promise<void>;
  search: (query: string) => Promise<Email[]>;
  markRead: (id: string) => void;
  toggleStar: (id: string) => void;
  archiveEmail: (id: string) => void;
  deleteEmail: (id: string) => void;
  openCompose: (state?: ComposeState) => void;
  addNotification: (n: Omit<Notification, 'id'>) => void;
  visibleEmails: Email[];
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const addNotification = useCallback((n: Omit<Notification, 'id'>) => {
    const id = crypto.randomUUID();
    setNotifications(prev => [...prev, { ...n, id }]);
    setTimeout(() => setNotifications(prev => prev.filter(x => x.id !== id)), n.duration ?? 4000);
  }, []);

  const loadEmails = useCallback(async (accountId?: string) => {
    dispatch({ type: 'SET_LOADING', loading: true });
    try {
      const emails = await orchestrateEmailLoad(accountId, (agent, status) => {
        dispatch({ type: 'SET_AGENT_STATUS', agent, status });
      });
      dispatch({ type: 'SET_EMAILS', emails });
    } catch {
      addNotification({ type: 'error', title: 'Failed to load emails' });
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false });
    }
  }, [addNotification]);

  const search = useCallback(async (query: string) => {
    dispatch({ type: 'SET_AGENT_STATUS', agent: 'searcher', status: 'running' });
    const result = await runSearcherAgent({ query, emails: state.emails });
    dispatch({ type: 'SET_AGENT_STATUS', agent: 'searcher', status: 'done' });
    return result.data ?? [];
  }, [state.emails]);

  const markRead = useCallback((id: string) => dispatch({ type: 'MARK_READ', id }), []);
  const toggleStar = useCallback((id: string) => dispatch({ type: 'TOGGLE_STAR', id }), []);
  const archiveEmail = useCallback((id: string) => { dispatch({ type: 'ARCHIVE', id }); addNotification({ type: 'success', title: 'Archived' }); }, [addNotification]);
  const deleteEmail = useCallback((id: string) => { dispatch({ type: 'DELETE', id }); addNotification({ type: 'success', title: 'Moved to Trash' }); }, [addNotification]);
  const openCompose = useCallback((s?: ComposeState) => dispatch({ type: 'TOGGLE_COMPOSE', state: s }), []);

  // Compute visible emails
  const visibleEmails = React.useMemo(() => {
    let emails = state.emails;
    if (state.activeAccountId) emails = emails.filter(e => e.accountId === state.activeAccountId);
    if (state.selectedLabel) emails = emails.filter(e => e.labels.includes(state.selectedLabel!));
    else emails = emails.filter(e => e.folder === state.selectedFolder);
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      emails = emails.filter(e => e.subject.toLowerCase().includes(q) || e.from.name.toLowerCase().includes(q) || e.snippet.toLowerCase().includes(q));
    }
    return emails;
  }, [state.emails, state.activeAccountId, state.selectedFolder, state.selectedLabel, state.searchQuery]);

  // Load emails on mount
  React.useEffect(() => { loadEmails(); }, [loadEmails]);

  return (
    <AppContext.Provider value={{ state, labels: MOCK_LABELS, notifications, dispatch, loadEmails, search, markRead, toggleStar, archiveEmail, deleteEmail, openCompose, addNotification, visibleEmails }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
