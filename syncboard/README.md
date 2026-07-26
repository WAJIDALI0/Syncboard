# SyncBoard

SyncBoard is an enterprise-grade SaaS collaboration platform that combines the best features of task management, real-time synchronization, and interactive whiteboarding. It is designed to act as a unified workspace for teams.

## 🚀 Features

- **Authentication:** Secure user login and registration powered by Supabase Auth.
- **SaaS Dashboard:** A modern, glassmorphism-styled dashboard with productivity statistics and activity feeds.
- **Task Management (Kanban):** Create, edit, delete, and drag-and-drop tasks across a beautiful Kanban board. Includes priority levels, due dates, and rich text descriptions.
- **Real-time Sync:** Instant, zero-refresh updates across all clients using Supabase Realtime (WebSockets) and optimistic UI updates for a blazing-fast user experience.
- **Interactive Whiteboard:** A native HTML5 Canvas implementation allowing users to brainstorm, draw, and save their ideas directly to the database.

## 🛠️ Technology Stack

- **Framework:** Next.js (App Router, Server Actions)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, shadcn/ui, Framer Motion
- **Database:** PostgreSQL (via Supabase)
- **ORM:** Prisma
- **State & Real-time:** React Hooks, Supabase Realtime

## 📦 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- A [Supabase](https://supabase.com/) account and project.

### 2. Environment Setup
Create a `.env` and `.env.local` file in the root directory and add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup
1. Open your Supabase project dashboard.
2. Go to the **SQL Editor**.
3. Copy the contents of the `supabase_setup.sql` file and run it. This will create the necessary tables (`tasks`, `canvas`), set up Row Level Security (RLS), and enable Realtime for the tables.
4. Run Prisma db push to sync any additional schema requirements:
```bash
npx prisma db push
```

### 4. Installation
Install the dependencies:

```bash
npm install
```

### 5. Running the Application
Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
