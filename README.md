# 🌌 NeuralMail – AI-First Universal Email Client PWA

NeuralMail is a next-generation, premium universal email client designed for the mobile-ready Progressive Web App (PWA) era. Built on **Agent OS Methodology**, it orchestrates **six autonomous agents** working in parallel to fetch, sort, prioritize, summarize, and draft emails from multiple providers including Gmail, Outlook, Yahoo, and AOL.

---

## 🏗️ System Overview

NeuralMail is an AI-native email operating system combining:
* 🧠 **AI-Powered Inbox Management** & prioritization
* 🔍 **Semantic Email Search** (meaning-based retrieval)
* ✍️ **Autonomous Drafting** (Smart suggested responses)
* 📝 **Email Summarization** & estimated read-time calculation
* 💾 **Persistent Context Memory** (User tone, style, calendar preferences)
* 🤖 **Multi-Agent Orchestration** (Agent OS Framework)

> **Core Vision**: *"Users should interact with intent, not interfaces."*

---

## 📐 Enterprise Architecture

For the complete in-depth blueprint, please review the newly created [ARCHITECTURE.md](file:///c:/Users/parma/OneDrive/Desktop/TAJ%20ASLANI%20PUNE/ARCHITECTURE.md).

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
 └─────────┬────────────────────────────────────────────┘
           ▼
 ┌──────────────────────────────────────────────────────┐
 │ Vector DB (pgvector) + PostgreSQL + Redis Cache     │
 └──────────────────────────────────────────────────────┘
```

---

## 🤖 The 6-Agent Framework

Every process inside NeuralMail is driven by specialized, pure agents operating asynchronously:

| Agent Name | Primary Responsibility | Input Payload | Output Result |
| :--- | :--- | :--- | :--- |
| **📧 EmailFetcher** | Retrieves raw emails across all authenticated mailboxes | `accountId` | Array of raw `Email` items |
| **🎯 Prioritizer** | Performs AI triage scoring based on urgency & blocking criteria | Array of `Email` | Ranks and re-sorts emails |
| **✨ Summarizer** | Runs LLM summaries, extracts action points, and read times | Single `Email` | Pre-calculated `AIInsights` |
| **✍️ Composer** | Generates context-aware replies matching user tone selectors | `Email` + Tone | Auto-populated draft string |
| **🔍 Searcher** | Executes local/semantic query indexing over active datasets | query string | Filtered match collections |
| **🏷️ Labeler** | Classifies content categories dynamically | `Email` body | Category strings (Work, Personal...) |

---

## 🔄 Agentic Flow Algorithm (Step-by-Step)

Here is exactly how the multi-agent pipeline works when you load and interact with your inbox:

```mermaid
graph TD
    A[User Opens App / Refreshes] --> B[Trigger Fetcher Agent]
    B -->|Fetch email headers & bodies| C[Trigger Labeler Agent]
    C -->|Auto-assign labels: Work, Personal...| D[Trigger Prioritizer Agent]
    D -->|Triage emails: Critical, High, Low| E[Sorted Unified Inbox Rendered]
    E -->|User clicks an email| F[Trigger Summarizer Agent]
    F -->|Analyze body via Claude API| G[Render AI Summary & Key Points]
    G -->|User clicks Smart Reply| H[Trigger Composer Agent]
    H -->|Analyze thread history + tone selection| I[Generate Inline Draft]
```

### 1️⃣ Step 1: Ingestion (EmailFetcher & Labeler)
* The **Fetcher Agent** authenticates via active provider plugins (like Gmail OAuth or IMAP).
* It downloads email headers, attachments, and snippets in parallel.
* Once retrieved, the **Labeler Agent** instantly scans terms to assign folders and standard labels.

### 2️⃣ Step 2: Intelligent Triage (Prioritizer)
* Raw emails are sent to the **Prioritizer Agent**.
* It computes an importance rating (Critical, High, Medium, Low, Promotional) by analyzing sender, deadlines, blocking actions, and recipient status.
* The inbox is instantly rendered with **Critical** items pinned at the top.

### 3️⃣ Step 3: Synthesis (Summarizer)
* When you open an email, the **Summarizer Agent** is invoked.
* It leverages Claude to generate a 1-sentence headline summary, extracts exact bulleted action items, estimates read-time, and flags if immediate attention is required.

### 4️⃣ Step 4: Generation (Composer)
* Clicking **"Smart Reply"** triggers the **Composer Agent**.
* It takes the email context, sentiment, and your selected tone (`Formal`, `Casual`, `Brief`) to write a contextually accurate reply in seconds.

---

## 🛠️ How to Run & Work With the Code

### 💻 Running Locally

Since you have successfully run `npm install`, you are ready to start:

```powershell
# Start the local development server
npm run dev
```

* This runs the server on **`http://localhost:5173`**.
* The **Agent Status Bar** at the bottom of the UI will light up to display real-time statuses (`idle`, `running`, `done`) as the agents communicate!

### 🧪 Running Unit Tests

We have written rigorous test suites for all 6 agents to ensure complete reliability:

```powershell
npm run test
```

### 🌐 Deploying Live to Vercel

To launch the client publicly on Vercel:

```powershell
# Trigger our automated deploy pipeline batch script
.\VERCEL_DEPLOY.bat
```
