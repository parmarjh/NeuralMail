import type { Email, AgentName, AgentResult, AIInsights } from '../types';
import { MOCK_EMAILS, MOCK_ACCOUNTS } from '../data/mockData';

// ─── Agent Registry ─────────────────────────────────────────────────────────
// Each agent is a pure async function: (payload) => AgentResult

// Simulate network/processing delay
const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

// ─── Email Fetcher Agent ─────────────────────────────────────────────────────
export async function runFetcherAgent(payload: { accountId?: string }): Promise<AgentResult<Email[]>> {
  const start = Date.now();
  await delay(600);
  const emails = payload.accountId
    ? MOCK_EMAILS.filter(e => e.accountId === payload.accountId)
    : MOCK_EMAILS;
  return { taskId: crypto.randomUUID(), agentName: 'fetcher', success: true, data: emails, duration: Date.now() - start };
}

// ─── Summarizer Agent ─────────────────────────────────────────────────────────
export async function runSummarizerAgent(payload: { email: Email }): Promise<AgentResult<AIInsights>> {
  const start = Date.now();
  await delay(400);
  // Uses pre-computed insights (in production, calls Claude API)
  const insights = payload.email.aiInsights ?? generateFallbackInsights(payload.email);
  return { taskId: crypto.randomUUID(), agentName: 'summarizer', success: true, data: insights, duration: Date.now() - start };
}

function generateFallbackInsights(email: Email): AIInsights {
  const wordCount = email.body.split(/\s+/).length;
  return {
    summary: email.snippet,
    priority: 'medium',
    priorityReason: 'Automatically assessed as medium priority',
    sentiment: 'neutral',
    actionRequired: false,
    keyPoints: [email.snippet.slice(0, 60)],
    estimatedReadTime: Math.ceil(wordCount / 200) * 60,
  };
}

// ─── Prioritizer Agent ───────────────────────────────────────────────────────
export async function runPrioritizerAgent(payload: { emails: Email[] }): Promise<AgentResult<Email[]>> {
  const start = Date.now();
  await delay(300);
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3, promotional: 4 };
  const sorted = [...payload.emails].sort((a, b) => {
    const pa = a.aiInsights?.priority ?? 'medium';
    const pb = b.aiInsights?.priority ?? 'medium';
    const diff = (priorityOrder[pa] ?? 2) - (priorityOrder[pb] ?? 2);
    if (diff !== 0) return diff;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  return { taskId: crypto.randomUUID(), agentName: 'prioritizer', success: true, data: sorted, duration: Date.now() - start };
}

// ─── Composer Agent ───────────────────────────────────────────────────────────
export async function runComposerAgent(payload: { email: Email; tone: 'formal' | 'casual' | 'brief' }): Promise<AgentResult<string>> {
  const start = Date.now();
  await delay(800);
  const existing = payload.email.aiInsights?.replyDraft;
  if (existing) {
    const adapted = adaptTone(existing, payload.tone);
    return { taskId: crypto.randomUUID(), agentName: 'composer', success: true, data: adapted, duration: Date.now() - start };
  }
  const draft = `Hi ${payload.email.from.name.split(' ')[0]},\n\nThank you for your email regarding "${payload.email.subject}".\n\n[Your response here]\n\nBest regards,\nAlex`;
  return { taskId: crypto.randomUUID(), agentName: 'composer', success: true, data: draft, duration: Date.now() - start };
}

function adaptTone(draft: string, tone: 'formal' | 'casual' | 'brief'): string {
  if (tone === 'brief') return draft.split('\n').slice(0, 3).join('\n');
  if (tone === 'formal') return draft.replace(/Hey/g, 'Dear').replace(/Thanks/g, 'Thank you');
  return draft;
}

// ─── Searcher Agent ───────────────────────────────────────────────────────────
export async function runSearcherAgent(payload: { query: string; emails: Email[] }): Promise<AgentResult<Email[]>> {
  const start = Date.now();
  await delay(200);
  const q = payload.query.toLowerCase();
  const results = payload.emails.filter(e =>
    e.subject.toLowerCase().includes(q) ||
    e.snippet.toLowerCase().includes(q) ||
    e.from.name.toLowerCase().includes(q) ||
    e.from.email.toLowerCase().includes(q) ||
    e.body.toLowerCase().includes(q)
  );
  return { taskId: crypto.randomUUID(), agentName: 'searcher', success: true, data: results, duration: Date.now() - start };
}

// ─── Labeler Agent ───────────────────────────────────────────────────────────
export async function runLabelerAgent(payload: { email: Email }): Promise<AgentResult<string[]>> {
  const start = Date.now();
  await delay(200);
  return { taskId: crypto.randomUUID(), agentName: 'labeler', success: true, data: payload.email.labels, duration: Date.now() - start };
}

// ─── Orchestrator ────────────────────────────────────────────────────────────
type AgentStatusCallback = (agent: AgentName, status: 'running' | 'done' | 'error') => void;

export async function orchestrateEmailLoad(
  accountId: string | undefined,
  onStatus: AgentStatusCallback
): Promise<Email[]> {
  // Step 1: Fetch
  onStatus('fetcher', 'running');
  const fetchResult = await runFetcherAgent({ accountId });
  onStatus('fetcher', fetchResult.success ? 'done' : 'error');
  if (!fetchResult.success || !fetchResult.data) return [];

  // Step 2: Prioritize
  onStatus('prioritizer', 'running');
  const priorityResult = await runPrioritizerAgent({ emails: fetchResult.data });
  onStatus('prioritizer', priorityResult.success ? 'done' : 'error');

  return priorityResult.data ?? fetchResult.data;
}

export const AGENT_NAMES: AgentName[] = ['fetcher', 'summarizer', 'prioritizer', 'composer', 'searcher', 'labeler'];

export const AGENT_DESCRIPTIONS: Record<AgentName, string> = {
  fetcher: 'Fetches emails from Gmail, Outlook, and IMAP providers',
  summarizer: 'Generates AI summaries and key points via Claude API',
  prioritizer: 'Scores and ranks emails by urgency and importance',
  composer: 'Drafts context-aware replies with tone adaptation',
  searcher: 'Full-text and semantic search across all accounts',
  labeler: 'Auto-applies labels based on content classification',
};

// ─── Skills & Hooks ───────────────────────────────────────────────────────────
export const SKILLS = {
  smartReply: (email: Email, tone: 'formal' | 'casual' | 'brief' = 'casual') => runComposerAgent({ email, tone }),
  summarize: (email: Email) => runSummarizerAgent({ email }),
  search: (query: string, emails: Email[]) => runSearcherAgent({ query, emails }),
};

export const HOOKS = {
  beforeSend: (email: Partial<Email>) => {
    console.log('[Hook:beforeSend]', email.subject);
    return email;
  },
  afterFetch: (emails: Email[]) => {
    console.log('[Hook:afterFetch]', emails.length, 'emails');
    return emails;
  },
  onPriorityAssigned: (email: Email, priority: string) => {
    console.log('[Hook:onPriorityAssigned]', email.subject, '->', priority);
  },
};

export const PLUGINS = {
  gmailOAuth: { name: 'Gmail OAuth2', provider: 'gmail', status: 'active' },
  outlookOAuth: { name: 'Microsoft OAuth2', provider: 'outlook', status: 'active' },
  imapYahoo: { name: 'Yahoo IMAP', provider: 'imap_yahoo', status: 'active' },
  imapAol: { name: 'AOL IMAP', provider: 'imap_aol', status: 'active' },
  claudeAI: { name: 'Claude AI (Anthropic)', provider: 'ai', status: 'active' },
  pushNotifications: { name: 'Push Notifications', provider: 'pwa', status: 'active' },
};
