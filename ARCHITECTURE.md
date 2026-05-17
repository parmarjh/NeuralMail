# 📐 Enterprise Architecture Document – NeuralMail AI Email Assistant

Based on premium live product inspirations from **NeuralMail** and modern AI-native email systems. It serves as an **AI Copilot for Communication** rather than a traditional email client.

---

## 1. System Overview & Core References

NeuralMail is an AI-first email operating system combining AI-powered inbox management, semantic search, autonomous drafting, summarization, context memory, and workflow automation.

### 🌐 Core Product References & Inspirations
* 🔗 **[NeuralMail Demo](https://neural-mail.vercel.app/)** – Main AI email assistant inspiration
* 🔗 **[NeuralMail iOS App](https://apps.apple.com/)** – AI email mobile assistant App Store
* 🔗 **[VectorMail](https://github.com/vectormail)** – AI semantic email infrastructure concepts
* 🔗 **[NewMail AI](https://newmail.ai/)** – AI inbox assistant workflows
* 🔗 **[Canary Mail AI](https://canarymail.io/)** – Multi-account AI email workflows & smart triage

### ⚡ Vercel AI-Native Architecture References
* 🔗 **[Vercel AI Chatbot Architecture](https://vercel.com/templates/next.js/nextjs-ai-chatbot)** – Streaming AI & Edge runtime architecture
* 🔗 **[Vercel AI Features Guide](https://sdk.vercel.ai/docs)** – Secure AI infrastructure & tool-calling SDK
* 🔗 **[Vercel Agents Platform](https://vercel.com/blog/agents)** – Agentic workflow & durable execution systems

---

## 2. High-Level Architecture Diagram

```
                   ┌────────────────────┐
                   │    Frontend UI     │
                   │ Next.js + React    │
                   └─────────┬──────────┘
                             │
                    WebSocket / HTTP
                             │
         ┌───────────────────┴──────────────────┐
         │                                      │
 ┌───────▼────────┐                   ┌─────────▼─────────┐
 │ AI Orchestrator│                   │ Authentication    │
 │ Agent Runtime  │                   │ OAuth + Sessions  │
 └───────┬────────┘                   └─────────┬─────────┘
         │                                      │
 ┌───────▼──────────────────────────────────────▼───────┐
 │                 Backend API Layer                    │
 │ Next.js API / FastAPI / Node Microservices           │
 └───────┬──────────────────────────────────────────────┘
         │
 ┌───────▼──────────────────────────────────────────────┐
 │                AI Intelligence Layer                 │
 │ LLM Gateway + RAG + Memory + Tool Registry          │
 └───────┬──────────────────────────────────────────────┘
         │
 ┌───────▼────────┬──────────────┬──────────────────────┐
 │ Vector DB      │ Relational DB│ Cache Layer          │
 │ pgvector       │ PostgreSQL   │ Redis                │
 └───────┬────────┴──────────────┴──────────────────────┘
         │
 ┌───────▼──────────────────────────────────────────────┐
 │ Email Provider Integrations                          │
 │ Gmail API / Microsoft Graph / IMAP / SMTP           │
 └──────────────────────────────────────────────────────┘
```

---

## 3. Core Architecture Stack

| Layer | Recommended Stack | Alternate / Dev Option |
| :--- | :--- | :--- |
| **Frontend** | Next.js 16 (App Router), React 19 | Vite + React + PWA (Standalone) |
| **Styling & UI** | TailwindCSS, shadcn/ui, Framer Motion | Vanilla CSS, Framer Motion |
| **State & Streaming** | Zustand, React Query, Vercel AI SDK | Context API |
| **Backend API** | Next.js Route Handlers, Node.js, FastAPI | Express.js, Node.js |
| **Queue & Realtime** | BullMQ, Kafka, WebSockets / SSE | Simple EventEmitter (In-memory) |
| **AI SDK & RAG** | LangChain, LlamaIndex, Vercel AI Gateway | Raw OpenAI / Anthropic SDKs |
| **LLM Models** | Claude 3.5 Sonnet, GPT-4o, Gemini Flash | Claude 3 Haiku, Llama 3 |
| **Embeddings** | `text-embedding-3-large` | `BGE-small`, `InstructorXL` |
| **Database** | PostgreSQL + `pgvector` | SQLite (Dev Mode) |
| **Cache & Blob** | Redis, Vercel Blob / AWS S3 | Local storage / Memory cache |

---

## 4. Multi-Agent Registry (Agent OS)

NeuralMail operates on an **Agentic Registry System** where specialized tasks are handed off dynamically to autonomous workers.

### The 9-Agent Framework
1. **Inbox Agent** – Evaluates priority, runs triage scoring & pins critical updates.
2. **Drafting Agent** – Formulates contextual reply options matching user styles.
3. **Search Agent** – Processes query indexing and vector similarity matching.
4. **Workflow Agent** – Evaluates and executes user-defined trigger conditions.
5. **Calendar Agent** – Inspects dates, parses scheduling intents, links calendar.
6. **Memory Agent** – Logs personalization variables, styling, and tone patterns.
7. **Security Agent** – Identifies phishing, filters prompt injection threats.
8. **Research Agent** – Performs external web lookup to enrich thread contexts.
9. **Voice Agent** – Translates speech-to-text for audio-driven action prompts.

---

## 5. Skills, Hooks, and Plugin Ecosystems

### Core Skills Registry
* `summarize_thread` – Distill multi-thread conversations into single headlines.
* `semantic_search` – Retrieve context through similarity index searches.
* `reply_generation` – Formulate automated drafts matching distinct style templates.
* `tone_rewrite` – Adapt existing drafts to Formal, Casual, or Brief tones.
* `task_extraction` – Extract exact actionable bullet items and deadlines.
* `phishing_detection` – Audit incoming senders and URLs for security threats.
* `multilingual_translate` – Seamless real-time translation between global languages.
* `workflow_planning` – Auto-configure pipeline actions based on intent.

### Hook Event Registry
* `on_email_received` – Fires sync updates and begins preprocessing triages.
* `before_email_send` – Runs sanitizers and applies security audits before mail exit.
* `after_llm_response` – Commits analytics and performance metrics to history.
* `workflow_started` – Spawns worker jobs inside the scheduler pipeline.
* `on_prompt_injection_detected` – Isolates threat sources and logs alarms.
* `on_memory_update` – Updates long-term semantic preference profiles.

### Plugin Integrations
* **CRM Plugins** – Salesforce, HubSpot sync.
* **Collaboration Plugins** – Slack alerts, Discord triggers.
* **Productivity Plugins** – Notion databases, Jira issues creation.
* **Meeting Plugins** – Zoom / MS Teams auto-scheduler links.
* **Storage Plugins** – Google Drive & Dropbox attachment indexers.
* **Calendar Plugins** – Google Calendar & Microsoft Outlook Calendar integration.

---

## 6. RAG & Semantic Search Pipeline

Search operates semantically rather than relying on exact keyword matching.

```
Email Thread ──► Chunking ──► Embedding Model ──► pgvector Store ──► Hybrid BM25 Retrieval ──► Context Injection ──► LLM Response
```

* Community implementations strongly recommend **Vector Personalization** to ensure LLM drafts match the unique voice of the sender.

---

## 7. Recommended Directory Structure

```
/apps
  /web                  # Next.js web application interface
  /api                  # Node / Express / FastAPI endpoints
  /worker               # Asynchronous queue workers

/agents
  /inbox-agent          # Inbox orchestration
  /drafting-agent       # Auto-draft composer
  /workflow-agent       # Automation executor

/skills
  /semantic-search      # Vector index tools
  /summarization        # Text summarizers

/plugins
  /slack                # Slack connector
  /notion               # Notion integration
  /gmail                # Gmail API plugin

/hooks
  /email-hooks          # Event-driven receivers
  /workflow-hooks       # Queue orchestrators

/packages
  /ui                   # Shared component libraries
  /ai                   # LLM gateway helpers
  /auth                 # Auth rules (OAuth)
  /database             # DB adapters
```

---

## 8. Deployment & Scaling Topology

```
                  Vercel Edge CDN
                         │
                ┌────────▼────────┐
                │  API Gateway    │
                └────────┬────────┘
                         │
        ┌────────────────▼────────────────┐
        │  AI Orchestration Middleware    │
        └────────────────┬────────────────┘
                         │
     ┌───────────────────▼──────────────────┐
     │  Worker Queue (BullMQ / Kafka)       │
     └───────────┬──────────────────┬───────┘
                 ▼                  ▼
        [LLM API Gateway]   [DB & pgvector Store]
```

* **Horizontal Scaling**: Scales database sync tasks independently from expensive LLM gateways and vector embedding calculations.
* **Durable Queues**: Employs in-memory/disk queues (BullMQ/Redis) to guarantee email webhook delivery and automatic retry options.
