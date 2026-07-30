<div align="center">

# 🎫 SupportDesk AI

### A full-stack customer support & ticketing platform with real-time collaboration and AI-powered replies

🔗 **[Live Demo](https://supportdesk-ai-five.vercel.app)**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Drizzle_ORM-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📖 Overview

**SupportDesk AI** is a modern, feature-rich helpdesk application built to manage the full lifecycle of customer support tickets. It combines a clean, responsive interface with a robust backend, real-time collaboration via WebSockets, and AI-generated reply suggestions powered by the Anthropic API.

The project was built as a **full-stack portfolio piece** to demonstrate end-to-end development skills: from designing a normalized PostgreSQL schema and building a typed REST API, to crafting a polished React frontend with optimistic UI updates, dark mode, and internationalization.

---

## 📸 Screenshots

![Dashboard](./screenshots/dashboard.png)
![Tickets](./screenshots/tickets.png)
![Automation](./screenshots/automation.png)
![Reports](./screenshots/reports.png)
![Email Integration](./screenshots/email-integration.png)
![Dark Mode](./screenshots/dark-mode.png)

---

## ✨ Key Features

### 🎟️ Ticket Management
- Create, view, sort, and manage support tickets
- Ticket detail pages with full conversation threads
- Priority levels (high / medium / low) and custom statuses
- Real-time messaging with AI-powered reply suggestions

### 🤖 Automation & Assignment
- **Assignment Rules** — auto-route tickets to teams based on keywords
- **Automation Rules** — trigger actions (close, notify, reassign) based on conditions
- Toggle rules on/off with instant optimistic UI updates

### 📊 SLA Management
- Define SLA policies with first-response and resolution targets by priority
- Live SLA compliance tracking and breach detection
- Visual breach table with overdue time calculations

### 👥 Teams & Collaboration
- Manage support teams and their members
- **Joint Editing** — real-time collaborative sessions with live chat via **WebSockets**
- See who's online and working on each ticket

### 📧 Email Integration
- Connect and manage multiple mailboxes (Gmail, Outlook, SMTP)
- Visual dashboard cards with received/sent activity
- 7-day email activity charts

### 📈 Reports & Analytics
- Interactive charts for ticket trends and response times
- Agent performance table with resolution stats
- Date-range filtering (Today / Week / Month / Year)

### ⚙️ Settings & UX
- **Dark Mode** — full theme switching with persistence
- **Internationalization (i18n)** — English & Ukrainian support
- Profile management, notification preferences, and security settings
- Custom ticket statuses and saved answer templates

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI library |
| **TypeScript** | Type safety across the app |
| **Vite** | Lightning-fast build tool & dev server |
| **React Router** | Client-side routing |
| **TanStack Query (React Query)** | Server-state management, caching & optimistic updates |
| **Tailwind CSS** | Utility-first styling with dark mode |
| **Framer Motion** | Smooth animations & modal transitions |
| **Recharts** | Data visualization & charts |
| **Lucide React** | Icon system |
| **react-i18next** | Internationalization (EN / UA) |
| **react-hot-toast** | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server |
| **TypeScript** | Type-safe backend |
| **PostgreSQL** | Relational database |
| **Drizzle ORM** | Type-safe database queries & migrations |
| **Zod** | Runtime schema validation |
| **JWT** | Authentication & authorization |
| **bcrypt** | Password hashing |
| **ws (WebSocket)** | Real-time collaboration & chat |
| **Anthropic API** | AI-powered reply suggestions |

---

## 🏗️ Architecture

```
supportdesk-ai/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── schema/          # Drizzle table definitions
│   │   │   ├── migrations/      # Generated SQL migrations
│   │   │   ├── index.ts         # DB connection
│   │   │   └── seed.ts          # Seed data
│   │   ├── routes/              # Express route handlers
│   │   ├── middleware/          # Auth & request middleware
│   │   ├── lib/                 # Auth helpers, utilities
│   │   └── index.ts             # Server entry + WebSocket setup
│   └── drizzle.config.ts
│
└── frontend/
    ├── src/
    │   ├── pages/               # Route-level page components
    │   ├── components/          # Feature-grouped UI components
    │   ├── services/            # Typed API client functions
    │   ├── context/             # Theme context
    │   ├── hooks/               # Custom hooks (WebSocket, etc.)
    │   ├── i18n/                # Translation files (en / ua)
    │   ├── lib/                 # Axios instance
    │   └── App.tsx              # Route definitions
    └── vite.config.ts
```

### Design Patterns
- **Server-state via React Query** — every data fetch is cached by key, with optimistic updates for toggles and mutations, and automatic cache invalidation on success.
- **Typed API layer** — all backend calls go through dedicated service functions, keeping components clean and endpoints centralized.
- **Feature-grouped components** — UI is organized by domain (assignment, automation, sla, etc.) rather than by type.
- **Dual-channel real-time** — collaboration combines REST (for persistence) with WebSockets (for instant delivery).

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+
- **PostgreSQL** 14+
- An **Anthropic API key** (optional, for AI replies)

### 1. Clone the repository
```bash
git clone https://github.com/Fanchuk/supportdesk-ai.git
cd supportdesk-ai
```

### 2. Backend setup
```bash
cd backend
npm install

# Create a .env file
cat > .env << 'EOF'
DATABASE_URL=postgresql://user:password@localhost:5432/supportdesk
JWT_SECRET=your-secret-key
ANTHROPIC_API_KEY=your-anthropic-key
PORT=3000
EOF

# Push schema & seed the database
npx drizzle-kit push
npx tsx src/db/seed.ts

# Start the server
npm run dev
```
The API runs on **http://localhost:3000**

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```
The app runs on **http://localhost:5173**

### 4. Log in
Use the seeded admin credentials:
```
Email:    admin@desk.com
Password: password123
```

---

## 📡 API Overview

| Resource | Endpoints |
|---|---|
| **Auth** | `POST /api/auth/login` · `POST /api/auth/register` · `GET /api/auth/me` · `PATCH /api/auth/me` |
| **Tickets** | `GET /api/tickets` · `POST /api/tickets` · `GET /api/tickets/:id` · `PATCH /api/tickets/:id` |
| **Messages** | `POST /api/tickets/:id/messages` · `POST /api/tickets/:id/messages/ai-reply` |
| **Teams** | `GET /api/teams` · `POST /api/teams` · `POST /api/teams/:id/members` |
| **Assignment Rules** | `GET /api/assignment-rules` · `POST` · `PATCH /:id` |
| **Automation** | `GET /api/automation-rules` · `GET /stats` · `POST` · `PATCH /:id` |
| **SLA** | `GET /api/sla/stats` · `GET /policies` · `GET /breaches` |
| **Custom Statuses** | `GET /api/custom-statuses` · `POST` · `PATCH /:id` · `DELETE /:id` |
| **Saved Answers** | `GET /api/saved-answers` · `POST` · `PATCH /:id` · `DELETE /:id` |
| **Joint Sessions** | `GET /api/joint-sessions` · `GET /stats` · WebSocket for live chat |
| **Reports** | `GET /api/reports/stats` · `/tickets-by-day` · `/agents` |

---

## 🎨 Highlights

- **Optimistic UI** — toggles and edits update instantly, then reconcile with the server, rolling back gracefully on error.
- **Real-time collaboration** — multiple agents can work on the same ticket, chatting live via WebSockets while messages persist to the database.
- **AI replies** — generate contextual, professional response suggestions using the Anthropic API.
- **Dark mode** — a system-aware theme toggle persisted to local storage.
- **i18n** — seamless English ↔ Ukrainian switching without a page reload.
- **Fully responsive** — works across desktop, tablet, and mobile.

---

## 📝 License

This project was built for portfolio and educational purposes.

---

<div align="center">

**Built with ❤️ by [Fanchuk](https://github.com/Fanchuk)**

</div>