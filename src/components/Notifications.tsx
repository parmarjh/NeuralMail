import React from 'react';
import { useApp } from '../context/AppContext';

export default function Notifications() {
  const { notifications } = useApp();
  if (!notifications.length) return null;
  return (
    <div className="notifications">
      {notifications.map(n => (
        <div key={n.id} className={`notification ${n.type}`}>
          <span>{n.type === 'success' ? '✓' : n.type === 'error' ? '✕' : 'ℹ'}</span>
          <span>{n.title}</span>
          {n.message && <span style={{ opacity: 0.8, fontSize: 12 }}>{n.message}</span>}
        </div>
      ))}
    </div>
  );
}
