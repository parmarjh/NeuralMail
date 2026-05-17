import React from 'react';
import { useApp } from '../context/AppContext';
import { AGENT_NAMES, AGENT_DESCRIPTIONS } from '../agents';

export default function AgentStatusBar() {
  const { state } = useApp();
  return (
    <div className="agent-bar">
      <span style={{ fontWeight: 700, color: 'var(--accent2)', flexShrink: 0 }}>Agents:</span>
      {AGENT_NAMES.map(name => {
        const s = state.agentStatus[name]?.status ?? 'idle';
        return (
          <span key={name} title={AGENT_DESCRIPTIONS[name]} style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <span className={`agent-dot agent-${s}`} />
            {name}
          </span>
        );
      })}
    </div>
  );
}
