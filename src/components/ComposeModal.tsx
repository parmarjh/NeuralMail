import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Send, Paperclip, Minimize2 } from 'lucide-react';

export default function ComposeModal() {
  const { state, dispatch, addNotification } = useApp();
  const [minimized, setMinimized] = useState(false);

  if (!state.isComposing || !state.composeState) return null;

  const cs = state.composeState;

  const update = (field: string, value: string) => {
    dispatch({ type: 'TOGGLE_COMPOSE', state: { ...cs, [field]: value } });
  };

  const handleSend = () => {
    if (!cs.to.trim()) { addNotification({ type: 'error', title: 'Add a recipient first' }); return; }
    if (!cs.subject.trim()) { addNotification({ type: 'warning', title: 'No subject — send anyway?' }); }
    dispatch({ type: 'CLOSE_COMPOSE' });
    addNotification({ type: 'success', title: 'Email sent!', message: `To: ${cs.to}` });
  };

  const modeLabel = { compose: 'New Message', reply: 'Reply', replyAll: 'Reply All', forward: 'Forward' }[cs.mode];

  return (
    <div className="compose-overlay" id="compose-overlay" onClick={e => { if (e.target === e.currentTarget) dispatch({ type: 'CLOSE_COMPOSE' }); }}>
      <div className="compose-modal" style={{ maxHeight: minimized ? 56 : undefined }}>
        <div className="compose-header">
          <span className="compose-title">{modeLabel}</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="icon-btn" onClick={() => setMinimized(m => !m)} style={{ width: 28, height: 28 }}>
              <Minimize2 size={14} />
            </button>
            <button id="close-compose-btn" className="icon-btn danger" onClick={() => dispatch({ type: 'CLOSE_COMPOSE' })} style={{ width: 28, height: 28 }}>
              <X size={14} />
            </button>
          </div>
        </div>

        {!minimized && (
          <>
            <div className="compose-field">
              <span className="compose-field-label">To</span>
              <input id="compose-to" placeholder="recipient@example.com" value={cs.to} onChange={e => update('to', e.target.value)} />
            </div>
            <div className="compose-field">
              <span className="compose-field-label">Cc</span>
              <input id="compose-cc" placeholder="cc@example.com" value={cs.cc} onChange={e => update('cc', e.target.value)} />
            </div>
            <div className="compose-field">
              <span className="compose-field-label">Subject</span>
              <input id="compose-subject" placeholder="Subject" value={cs.subject} onChange={e => update('subject', e.target.value)} />
            </div>
            <div className="compose-body">
              <textarea
                id="compose-body"
                placeholder="Write your message…"
                value={cs.body}
                onChange={e => update('body', e.target.value)}
              />
            </div>
            <div className="compose-footer">
              <button id="send-btn" className="send-btn" onClick={handleSend}>
                <Send size={14} /> Send
              </button>
              <button className="icon-btn" title="Attach file"><Paperclip size={16} /></button>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text3)' }}>
                {cs.body.length} chars
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
