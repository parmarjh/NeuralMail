# NeuralMail – CLAUDE.md

## Project Identity
**NeuralMail** is an AI-first universal email client PWA built with:
- React + TypeScript (frontend)
- Multi-agent orchestration (Agent OS methodology)
- Claude API (AI summaries, reply drafts, prioritization)
- Gmail OAuth2, Microsoft OAuth2, IMAP (Yahoo/AOL) providers

## Agent OS Architecture

### Agents
| Agent | Role | Trigger |
|-------|------|---------|
| `fetcher` | Retrieves emails from all providers | On load / refresh |
| `summarizer` | Generates Claude-powered summaries | On email open |
| `prioritizer` | Ranks emails by urgency + importance | After fetch |
| `composer` | Drafts context-aware replies | On smart-reply request |
| `searcher` | Full-text + semantic search | On query change |
| `labeler` | Auto-classifies emails to labels | After fetch |

### Skills
- `smartReply(email, tone)` – Generate reply draft via composer agent
- `summarize(email)` – Summarize email body via summarizer agent  
- `search(query, emails)` – Search via searcher agent

### Hooks
- `beforeSend(email)` – Pre-send validation and logging
- `afterFetch(emails)` – Post-processing after email load
- `onPriorityAssigned(email, priority)` – Audit log for priority changes

### Plugins
- `gmailOAuth` – Gmail API via OAuth2
- `outlookOAuth` – Microsoft Graph API via OAuth2
- `imapYahoo` – Yahoo Mail via IMAP
- `imapAol` – AOL Mail via IMAP
- `claudeAI` – Anthropic Claude API (summarization, drafting)
- `pushNotifications` – PWA Web Push API

## Development Rules
1. **Types first** – Define types in `src/types/index.ts` before implementation
2. **Agents are pure** – Each agent function: `(payload) => AgentResult<T>`, no side effects
3. **Hooks for side effects** – All logging, analytics, audit go in hooks
4. **Plugins for providers** – Each email provider is a plugin (OAuth or IMAP)
5. **Mock data in dev** – `src/data/mockData.ts` for local dev; real API in production
6. **Tests alongside code** – Each agent must have a corresponding test in `src/agents/__tests__/`
7. **No secrets in code** – All API keys via environment variables (`VITE_CLAUDE_API_KEY`, `VITE_GMAIL_CLIENT_ID`)

## File Structure
```
src/
├── agents/          # Multi-agent system (fetcher, summarizer, prioritizer…)
├── components/      # React UI components
├── context/         # App state (AppContext)
├── data/            # Mock data for development
├── types/           # TypeScript type definitions
└── index.css        # Design system
```

## Environment Variables
```
VITE_CLAUDE_API_KEY=     # Anthropic Claude API key
VITE_GMAIL_CLIENT_ID=    # Google OAuth2 client ID
VITE_OUTLOOK_CLIENT_ID=  # Microsoft OAuth2 client ID
```

## Commands
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run test         # Run agent tests
npm run preview      # Preview production build
```
