# 📐 Enterprise Architecture Document – NeuralMail AI Email Assistant

Based on premium live product inspirations from **NeuralMail** and modern AI-native email systems. It serves as an **AI Copilot for Communication** rather than a traditional email client.

---

## 1. System Overview

NeuralMail is an AI-first email operating system combining:
* 🧠 **AI-Powered Inbox Management** & prioritization
* 🔍 **Semantic Email Search** (meaning-based retrieval)
* ✍️ **Autonomous Drafting** (Smart suggested responses)
* 📝 **Email Summarization** & estimated read-time calculation
* 💾 **Persistent Context Memory** (User tone, style, calendar preferences)
* 🤖 **Multi-Agent Orchestration** (Agent OS Framework)
* ⚙️ **Workflow Automation** (triggers, conditions, AI-decisions, actions)
* 🎙️ **Natural Language Command Execution**

> **Core Vision**: *"Users should interact with intent, not interfaces."*

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

## 3. Core Architecture Layers

### A. Frontend Layer
* **Tech Stack**: Next.js 16 App Router, React 19, TypeScript, TailwindCSS, shadcn/ui, Zustand, React Query, Framer Motion.
* **Key Components**:
  * `InboxView`: Decoupled email thread viewport rendering.
  * `AIAssistantPanel`: Streamed copilot sidebar chat panel.
  * `ComposeEditor`: Autocomplete smart email composer.
  * `SearchInterface`: Semantic search controller with semantic-similarity ranking.

### B. Backend API Layer
* **Tech Stack**: Next.js API Routes / Node.js Express microservices, FastAPI (Python) for AI pipeline pipelines.
* **Core Services**:
  * **Auth Service**: OAuth2 + JWT tokens.
  * **Sync Service**: High-speed incremental polling via Gmail/Outlook APIs.
  * **AI Gateway**: Intelligent routing to Claude Sonnet / GPT-4o / Gemini Flash.
  * **Vector Engine**: Embedding generator and vector search indexing.

---

## 4. Multi-Agent Orchestration (Agent OS)

NeuralMail operates on an **Agentic Registry System** where specialized tasks are handed off dynamically to autonomous workers.

```
Incoming Email ──► [Inbox Agent] ──► [Prioritizer] ──► Unified Inbox
                         │
                         ├──► [Summarizer] ──► keyPoints & Sentiment
                         │
                         └──► [Compliance Agent] ──► Threat Scanners
```

### Registered Agents:
* **Inbox Agent**: Runs triage and structural cataloging.
* **Drafting Agent**: Auto-generates smart contextual reply templates.
* **Search Agent**: Indexes contents for vector similarity retrieval.
* **Calendar Agent**: Parses deadlines to manage dates and schedules.
* **Compliance Agent**: Ensures prompt injection and phishing sanitization.

### Active Tool Registry:
* `send_email(to, subject, body)`
* `summarize_thread(threadId)`
* `semantic_search(query)`
* `schedule_meeting(dateTime, duration)`
* `archive_email(emailId)`

---

## 5. RAG & Semantic Search Architecture

Search operates semantically rather than relying on exact keyword matching.

```
User Query ("investor meeting")
       │
       ▼
[Embedding Model] ──► text-embedding-3-large
       │
       ▼
[Vector Database] ──► Similarity Search (pgvector)
       │
       ▼
[Hybrid BM25 + Re-ranking] ──► LLM Context Injection ──► Unified Results
```

### Memory Architecture:
```json
{
  "tone_preference": "concise",
  "signature_included": true,
  "preferred_meeting_hours": "14:00-17:00",
  "frequent_contacts": ["Sarah Chen", "Emily Watson"]
}
```
* **Episodic**: Stores historical interaction patterns.
* **Semantic**: Remembers context rules and writing preferences.

---

## 6. Real-Time Email Synchronization Engine

Uses secure OAuth login flow to handle rapid synchronization cycles.

```
OAuth Login ──► Initial Sync ──► Delta Sync ──► Webhook Trigger ──► Incremental Updates
```
* Integrates with **Gmail Push Notifications** (Cloud Pub/Sub Webhooks) and **Microsoft Graph webhooks**.
* Incremental sync fetches deltas using the history ID pipeline, making updates instant and serverless-friendly.

---

## 7. Security Architecture
* **OAuth2 Authentication**: Scoped API permissions.
* **Data Protection**: Encrypted database indexes (AES-256) and TLS transit pipelines.
* **AI Safety Boundary**: Prompt injection firewalls, complete email sanitization prior to LLM ingest, and **Human-in-the-loop validation** (Never auto-send emails without manual user confirmation).

---

## 8. Recommended Enterprise Tech Stack

| Layer | Recommended Technology | Alternate |
| :--- | :--- | :--- |
| **Frontend** | Next.js + React | Vite + PWA (Standalone) |
| **Backend** | Node.js + FastAPI | Go Microservices |
| **LLM Models** | Anthropic Claude 3.5 Sonnet | OpenAI GPT-4o / Gemini Flash |
| **Database** | PostgreSQL | SQLite (Dev) |
| **Vector Index** | `pgvector` | Pinecone / Qdrant |
| **Realtime Queue** | BullMQ | Apache Kafka |
| **Hosting** | Vercel Edge CDN | Kubernetes / Railway |
