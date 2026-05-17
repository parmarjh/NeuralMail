import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, RefreshCw, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Email } from '../types';

export default function EmailList() {
  const { state, visibleEmails, dispatch, markRead, loadEmails, labels } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEmails(state.activeAccountId ?? undefined);
    setRefreshing(false);
  };

  const handleSelect = (email: Email) => {
    dispatch({ type: 'SELECT_EMAIL', id: email.id });
    if (!email.isRead) markRead(email.id);
  };

  const folderTitle = state.selectedLabel
    ? labels.find(l => l.id === state.selectedLabel)?.name ?? 'Label'
    : state.selectedFolder.charAt(0).toUpperCase() + state.selectedFolder.slice(1);

  return (
    <div className="email-list-pane">
      <div className="list-header">
        <div className="list-header-row">
          <span className="list-title">{folderTitle}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="list-count">{visibleEmails.length} emails</span>
            <button
              id="refresh-btn"
              className="icon-btn"
              onClick={handleRefresh}
              style={{ width: 30, height: 30 }}
            >
              <RefreshCw size={14} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
            </button>
          </div>
        </div>
        <div className="search-bar">
          <Search size={14} color="var(--text3)" />
          <input
            id="search-input"
            placeholder="Search emails…"
            value={state.searchQuery}
            onChange={e => dispatch({ type: 'SET_SEARCH', query: e.target.value })}
          />
        </div>
      </div>

      <div className="email-list">
        {state.isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
            <div className="loading-spinner" />
          </div>
        ) : visibleEmails.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text3)' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
            <div>No emails found</div>
          </div>
        ) : (
          visibleEmails.map(email => (
            <EmailItem
              key={email.id}
              email={email}
              isSelected={state.selectedEmailId === email.id}
              onSelect={handleSelect}
            />
          ))
        )}
      </div>
    </div>
  );
}

function EmailItem({ email, isSelected, onSelect }: { email: Email; isSelected: boolean; onSelect: (e: Email) => void }) {
  const priority = email.aiInsights?.priority ?? 'medium';

  return (
    <div
      id={`email-item-${email.id}`}
      className={`email-item ${isSelected ? 'selected' : ''} ${!email.isRead ? 'unread' : ''}`}
      onClick={() => onSelect(email)}
    >
      <div className="email-item-header">
        <span className="email-sender">{email.from.name}</span>
        <span className="email-date">
          {formatDistanceToNow(new Date(email.date), { addSuffix: true })}
        </span>
      </div>
      <div className="email-subject">{email.subject}</div>
      <div className="email-snippet">{email.snippet}</div>
      <div className="email-item-footer">
        <span className={`priority-badge priority-${priority}`}>{priority}</span>
        {email.attachments.length > 0 && (
          <span style={{ fontSize: 12, color: 'var(--text3)' }}>📎 {email.attachments.length}</span>
        )}
        {email.isStarred && <Star size={12} style={{ color: 'var(--amber)', marginLeft: 2 }} fill="var(--amber)" />}
        {!email.isRead && <span className="unread-dot" />}
      </div>
    </div>
  );
}
