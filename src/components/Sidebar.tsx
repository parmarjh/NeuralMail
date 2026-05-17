import React from 'react';
import { useApp } from '../context/AppContext';
import { Inbox, Send, Archive, Trash2, Star, FileText, Zap } from 'lucide-react';
import type { EmailFolder } from '../types';

const FOLDERS: { id: EmailFolder; label: string; icon: React.ReactNode }[] = [
  { id: 'inbox', label: 'Inbox', icon: <Inbox size={16} /> },
  { id: 'starred', label: 'Starred', icon: <Star size={16} /> },
  { id: 'sent', label: 'Sent', icon: <Send size={16} /> },
  { id: 'drafts', label: 'Drafts', icon: <FileText size={16} /> },
  { id: 'archive', label: 'Archive', icon: <Archive size={16} /> },
  { id: 'trash', label: 'Trash', icon: <Trash2 size={16} /> },
];

export default function Sidebar() {
  const { state, labels, dispatch, openCompose } = useApp();

  const totalUnread = state.accounts.reduce((s, a) => s + a.unreadCount, 0);

  return (
    <aside className={`sidebar ${state.isSidebarOpen ? '' : 'collapsed'}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon"><Zap size={18} color="#fff" /></div>
        {state.isSidebarOpen && <span className="logo-text">NeuralMail</span>}
      </div>

      {/* Compose */}
      <button className="compose-btn" id="compose-btn" onClick={() => openCompose()}>
        <span style={{ fontSize: 18 }}>✏️</span>
        {state.isSidebarOpen && 'Compose'}
      </button>

      <div className="sidebar-section">
        {/* Folders */}
        <div className="sidebar-label">Folders</div>
        {FOLDERS.map(f => {
          const unread = f.id === 'inbox' ? totalUnread : 0;
          return (
            <div
              key={f.id}
              id={`folder-${f.id}`}
              className={`sidebar-item ${state.selectedFolder === f.id && !state.selectedLabel ? 'active' : ''}`}
              onClick={() => dispatch({ type: 'SELECT_FOLDER', folder: f.id })}
            >
              {f.icon}
              {state.isSidebarOpen && <span>{f.label}</span>}
              {unread > 0 && state.isSidebarOpen && <span className="sidebar-badge">{unread}</span>}
            </div>
          );
        })}

        {/* Labels */}
        {state.isSidebarOpen && (
          <>
            <div className="sidebar-label" style={{ marginTop: 16 }}>Labels</div>
            {labels.map(lbl => (
              <div
                key={lbl.id}
                id={`label-${lbl.id}`}
                className={`sidebar-item ${state.selectedLabel === lbl.id ? 'active' : ''}`}
                onClick={() => dispatch({ type: 'SELECT_LABEL', label: lbl.id })}
              >
                <span className="sidebar-dot" style={{ background: lbl.color }} />
                <span>{lbl.name}</span>
                {lbl.count && <span className="label-badge">{lbl.count}</span>}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Accounts */}
      <div className="accounts-section">
        {state.isSidebarOpen && <div className="sidebar-label" style={{ marginBottom: 8 }}>Accounts</div>}
        {state.accounts.map(acc => (
          <div
            key={acc.id}
            id={`account-${acc.id}`}
            className={`account-item ${state.activeAccountId === acc.id ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_ACCOUNT', accountId: state.activeAccountId === acc.id ? null : acc.id })}
          >
            <div className="account-avatar" style={{ background: acc.color }}>
              {acc.name[0]}
            </div>
            {state.isSidebarOpen && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="account-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{acc.name}</div>
                <div className="account-email" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{acc.email}</div>
              </div>
            )}
            {acc.unreadCount > 0 && state.isSidebarOpen && (
              <span className="account-unread">{acc.unreadCount}</span>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
