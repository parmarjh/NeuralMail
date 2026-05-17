# NeuralMail – Architecture

## Agent Data Flow
```
Load → Fetcher → Prioritizer → UI renders sorted inbox
Open → Summarizer (Claude API) → AI Panel shown  
Reply → Composer Agent → Draft → User edits → Send
Search → Searcher Agent → Filtered results
```

## Plugins
- gmailOAuth → Google Gmail API + OAuth2  
- outlookOAuth → Microsoft Graph API  
- imapYahoo → Yahoo IMAP:993  
- imapAol → AOL IMAP:993  
- claudeAI → Anthropic claude-3-5-sonnet  
- pushNotif → Web Push API

## Deployment
Frontend: Vercel Static (React PWA)  
Backend: Vercel Serverless Functions  
DB: SQLite → Vercel Postgres (prod)
