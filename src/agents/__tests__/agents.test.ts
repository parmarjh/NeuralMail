import { describe, it, expect, vi } from 'vitest';
import {
  runFetcherAgent,
  runSummarizerAgent,
  runPrioritizerAgent,
  runComposerAgent,
  runSearcherAgent,
  runLabelerAgent,
} from '../agents';
import { MOCK_EMAILS } from '../data/mockData';

describe('Fetcher Agent', () => {
  it('returns all emails when no accountId provided', async () => {
    const result = await runFetcherAgent({});
    expect(result.success).toBe(true);
    expect(result.data?.length).toBeGreaterThan(0);
  });
  it('filters by accountId', async () => {
    const result = await runFetcherAgent({ accountId: 'acc1' });
    expect(result.data?.every(e => e.accountId === 'acc1')).toBe(true);
  });
});

describe('Summarizer Agent', () => {
  it('returns AI insights for email with existing insights', async () => {
    const email = MOCK_EMAILS.find(e => e.aiInsights)!;
    const result = await runSummarizerAgent({ email });
    expect(result.success).toBe(true);
    expect(result.data?.summary).toBeTruthy();
  });
  it('generates fallback insights for email without insights', async () => {
    const email = { ...MOCK_EMAILS[0], aiInsights: undefined };
    const result = await runSummarizerAgent({ email });
    expect(result.success).toBe(true);
    expect(result.data?.priority).toBe('medium');
  });
});

describe('Prioritizer Agent', () => {
  it('sorts critical emails first', async () => {
    const result = await runPrioritizerAgent({ emails: MOCK_EMAILS });
    expect(result.success).toBe(true);
    const priorities = result.data?.map(e => e.aiInsights?.priority);
    expect(priorities?.[0]).toBe('critical');
  });
});

describe('Composer Agent', () => {
  it('returns a draft for email with existing reply draft', async () => {
    const email = MOCK_EMAILS.find(e => e.aiInsights?.replyDraft)!;
    const result = await runComposerAgent({ email, tone: 'casual' });
    expect(result.success).toBe(true);
    expect(result.data?.length).toBeGreaterThan(10);
  });
  it('adapts tone to brief', async () => {
    const email = MOCK_EMAILS.find(e => e.aiInsights?.replyDraft)!;
    const casual = await runComposerAgent({ email, tone: 'casual' });
    const brief = await runComposerAgent({ email, tone: 'brief' });
    expect(brief.data!.length).toBeLessThanOrEqual(casual.data!.length);
  });
});

describe('Searcher Agent', () => {
  it('finds emails matching query', async () => {
    const result = await runSearcherAgent({ query: 'roadmap', emails: MOCK_EMAILS });
    expect(result.success).toBe(true);
    expect(result.data?.length).toBeGreaterThan(0);
  });
  it('returns empty for no match', async () => {
    const result = await runSearcherAgent({ query: 'xyznotfound9999', emails: MOCK_EMAILS });
    expect(result.data?.length).toBe(0);
  });
});

describe('Labeler Agent', () => {
  it('returns labels for email', async () => {
    const email = MOCK_EMAILS.find(e => e.labels.length > 0)!;
    const result = await runLabelerAgent({ email });
    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
  });
});
