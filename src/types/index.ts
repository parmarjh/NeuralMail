// ─── Core Email Types ───────────────────────────────────────────────────────

export type EmailProvider = 'gmail' | 'outlook' | 'imap_yahoo' | 'imap_aol' | 'imap_custom';

export interface EmailAccount {
  id: string;
  email: string;
  name: string;
  provider: EmailProvider;
  avatar?: string;
  color: string;
  isConnected: boolean;
  unreadCount: number;
}

export interface EmailAddress {
  name: string;
  email: string;
}

export interface EmailAttachment {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  url?: string;
}

export type EmailLabel = {
  id: string;
  name: string;
  color: string;
  count?: number;
};

export type AIPriority = 'critical' | 'high' | 'medium' | 'low' | 'promotional';

export interface AIInsights {
  summary: string;
  replyDraft?: string;
  priority: AIPriority;
  priorityReason: string;
  sentiment: 'positive' | 'neutral' | 'negative' | 'urgent';
  actionRequired: boolean;
  keyPoints: string[];
  estimatedReadTime: number; // seconds
}

export interface Email {
  id: string;
  accountId: string;
  threadId: string;
  subject: string;
  from: EmailAddress;
  to: EmailAddress[];
  cc?: EmailAddress[];
  bcc?: EmailAddress[];
  date: string; // ISO string
  body: string;
  bodyHtml?: string;
  snippet: string;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  labels: string[];
  attachments: EmailAttachment[];
  aiInsights?: AIInsights;
  folder: EmailFolder;
  inReplyTo?: string;
  references?: string[];
}

export type EmailFolder = 'inbox' | 'sent' | 'drafts' | 'archive' | 'trash' | 'spam' | 'starred';

export interface EmailThread {
  id: string;
  accountId: string;
  subject: string;
  participants: EmailAddress[];
  emails: Email[];
  latestEmail: Email;
  unreadCount: number;
  labels: string[];
  isStarred: boolean;
  isArchived: boolean;
}

// ─── Compose Types ──────────────────────────────────────────────────────────

export interface ComposeState {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  body: string;
  inReplyTo?: string;
  threadId?: string;
  mode: 'compose' | 'reply' | 'replyAll' | 'forward';
  isDraft: boolean;
  attachments: File[];
}

// ─── App State Types ─────────────────────────────────────────────────────────

export interface AppState {
  accounts: EmailAccount[];
  activeAccountId: string | null;
  emails: Email[];
  selectedEmailId: string | null;
  selectedFolder: EmailFolder;
  selectedLabel: string | null;
  isComposing: boolean;
  composeState: ComposeState | null;
  searchQuery: string;
  isLoading: boolean;
  isSidebarOpen: boolean;
  isDarkMode: boolean;
  agentStatus: AgentStatus;
}

// ─── Agent Types ─────────────────────────────────────────────────────────────

export type AgentName = 'fetcher' | 'summarizer' | 'prioritizer' | 'composer' | 'searcher' | 'labeler';

export interface AgentStatus {
  [key: string]: {
    status: 'idle' | 'running' | 'done' | 'error';
    lastRun?: string;
    message?: string;
  };
}

export interface AgentTask {
  id: string;
  agentName: AgentName;
  payload: Record<string, unknown>;
  priority: number;
  createdAt: string;
}

export interface AgentResult<T = unknown> {
  taskId: string;
  agentName: AgentName;
  success: boolean;
  data?: T;
  error?: string;
  duration: number;
}

// ─── Search Types ─────────────────────────────────────────────────────────────

export interface SearchFilters {
  query: string;
  from?: string;
  to?: string;
  subject?: string;
  hasAttachment?: boolean;
  isUnread?: boolean;
  isStarred?: boolean;
  dateFrom?: string;
  dateTo?: string;
  labels?: string[];
  folder?: EmailFolder;
  accountId?: string;
}

// ─── Notification Types ───────────────────────────────────────────────────────

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}
