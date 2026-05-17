import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, Archive, Trash2, Reply, ReplyAll, Forward, Sparkles, ChevronDown, X, Paperclip } from 'lucide-react';
import { format } from 'date-fns';
import { runComposerAgent } from '../agents';

export default function EmailDetail() {
  const { state, dispatch, toggleStar, archiveEmail, deleteEmail, openCompose, addNotification } = useApp();
  const email = state.emails.find(e => e.id === state.selectedEmailId);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [showDraft, setShowDraft] = useState(false);
  const [draftText, setDraftText] = useState('');

  if (!email) {
    return (
      <div className="email-detail">
        <div className="detail-empty">
          <div style={{ fontSize: 48 }}>✉️</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Select an email to read</div>
          <div style={{ fontSize: 13 }}>NeuralMail AI will summarize and prioritize it for you</div>
        </div>
      </div>
    );
  }

  const ai = email.aiInsights;
  const initials = email.from.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const handleSmartReply = async () => {
    setLoadingDraft(true);
    try {
      const result = await runComposerAgent({ email, tone: 'casual' });
      setDraftText(result.data ?? '');
      setShowDraft(true);
    } catch {
      addNotification({ type: 'error', title: 'Failed to generate draft' });
    } finally {
      setLoadingDraft(false);
    }
  };

  const handleReply = () => openCompose({
    to: email.from.email,
    cc: '', bcc: '',
    subject: `Re: ${email.subject}`,
    body: draftText || '',
    inReplyTo: email.id,
    threadId: email.threadId,
    mode: 'reply',
    isDraft: false,
    attachments: [],
  });

  const handleForward = () => openCompose({
    to: '', cc: '', bcc: '',
    subject: `Fwd: ${email.subject}`,
    body: `\n\n---------- Forwarded message ----------\nFrom: ${email.from.name} <${email.from.email}>\nDate: ${format(new Date(email.date), 'PPpp')}\nSubject: ${email.subject}\n\n${email.body}`,
    mode: 'forward',
    isDraft: false,
    attachments: [],
  });

  return (
    <div className="email-detail">
      {/* Header */}
      <div className="detail-header">
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 4 }}>
            {email.folder.toUpperCase()} · {email.accountId}
          </div>
        </div>
        <div className="detail-header-actions">
          <button id={`star-${email.id}`} className={`icon-btn ${email.isStarred ? 'active' : ''}`} onClick={() => toggleStar(email.id)} title="Star">
            <Star size={16} fill={email.isStarred ? 'var(--amber)' : 'none'} />
          </button>
          <button id={`archive-${email.id}`} className="icon-btn" onClick={() => archiveEmail(email.id)} title="Archive">
            <Archive size={16} />
          </button>
          <button id={`delete-${email.id}`} className="icon-btn danger" onClick={() => deleteEmail(email.id)} title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Subject */}
      <div className="detail-subject">{email.subject}</div>

      {/* Meta */}
      <div className="detail-meta">
        <div className="detail-avatar">{initials}</div>
        <div>
          <div className="detail-from">{email.from.name}</div>
          <div className="detail-from-email">{email.from.email}</div>
        </div>
        <div className="detail-timestamp">
          {format(new Date(email.date), 'MMM d, yyyy · h:mm a')}
        </div>
      </div>

      {/* AI Panel */}
      {ai && (
        <div className="ai-panel">
          <div className="ai-panel-header">
            <Sparkles size={14} color="var(--accent2)" />
            <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>AI Insights</span>
            <span className="ai-badge">✨ CLAUDE</span>
            <span className={`priority-badge priority-${ai.priority}`} style={{ marginLeft: 'auto' }}>{ai.priority}</span>
          </div>
          <div className="ai-summary">{ai.summary}</div>
          {ai.keyPoints.length > 0 && (
            <div className="ai-keypoints">
              {ai.keyPoints.map((kp, i) => <div key={i} className="ai-keypoint">{kp}</div>)}
            </div>
          )}
          <div className="ai-actions">
            <button
              id="smart-reply-btn"
              className="ai-action-btn primary"
              onClick={handleSmartReply}
              disabled={loadingDraft}
            >
              {loadingDraft ? '⏳ Drafting…' : '🤖 Smart Reply'}
            </button>
            <button className="ai-action-btn secondary">📊 {ai.estimatedReadTime}s read</button>
            <button className="ai-action-btn secondary">
              {ai.actionRequired ? '⚡ Action needed' : '✅ No action'}
            </button>
          </div>
        </div>
      )}

      {/* AI Draft */}
      {showDraft && (
        <div style={{ margin: '0 24px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent2)' }}>AI Draft Reply</span>
            <button className="icon-btn" onClick={() => setShowDraft(false)} style={{ width: 24, height: 24 }}>
              <X size={12} />
            </button>
          </div>
          <textarea
            value={draftText}
            onChange={e => setDraftText(e.target.value)}
            style={{ width: '100%', background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 13, lineHeight: 1.7, resize: 'none', minHeight: 100 }}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button className="reply-btn primary" onClick={() => { openCompose({ to: email.from.email, cc: '', bcc: '', subject: `Re: ${email.subject}`, body: draftText, mode: 'reply', isDraft: false, attachments: [] }); setShowDraft(false); }}>
              Use Draft
            </button>
            <button className="reply-btn secondary" onClick={handleSmartReply}>Regenerate</button>
          </div>
        </div>
      )}

      {/* Attachments */}
      {email.attachments.length > 0 && (
        <div style={{ padding: '0 24px 12px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {email.attachments.map(att => (
            <div key={att.id} className="attachment-chip">
              <Paperclip size={12} />
              <span>{att.name}</span>
              <span style={{ color: 'var(--text3)' }}>({Math.round(att.size / 1024)}KB)</span>
            </div>
          ))}
        </div>
      )}

      {/* Body */}
      <div className="detail-body">{email.body}</div>

      {/* Reply Actions */}
      <div className="reply-actions">
        <button id="reply-btn" className="reply-btn primary" onClick={handleReply}>
          <Reply size={14} /> Reply
        </button>
        <button id="reply-all-btn" className="reply-btn secondary" onClick={handleReply}>
          <ReplyAll size={14} /> Reply All
        </button>
        <button id="forward-btn" className="reply-btn secondary" onClick={handleForward}>
          <Forward size={14} /> Forward
        </button>
      </div>
    </div>
  );
}
