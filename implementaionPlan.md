# Enterprise Implementation Plan: SyncBoard

This document serves as the master project specification for generating a modern, enterprise-level codebase using the latest stable versions of every library, while satisfying the MERN Stack Internship Session 2 tasks.

## Technology Stack & Architecture
- **Framework:** Next.js (Latest Stable) with App Router & Server Components
- **Language:** TypeScript (Strict Mode)
- **Database & Auth:** Supabase PostgreSQL & Supabase Auth
- **ORM:** Prisma ORM (Latest)
- **Styling:** Tailwind CSS (Latest), shadcn/ui (Latest), Framer Motion, Lucide React
- **Validation & Forms:** Zod, React Hook Form
- **Real-time:** Supabase Realtime (WebSockets)
- **Canvas:** Native HTML5 Canvas API

---

## Phase 1: Core Setup & Authentication (Task 1 & 2)
*Goal: Initialize the foundation, enforce strict coding standards, and implement secure Supabase authentication.*

### 1. Project Initialization
- Initialize Next.js with TypeScript, Tailwind CSS, and ESLint.
- Install `shadcn/ui`, `lucide-react`, `framer-motion`, `zod`, and `react-hook-form`.
- **Folder Structure:** Setup the enterprise folder structure (`app/(auth)`, `app/dashboard`, `components/ui`, `lib/supabase`, `prisma/`, etc.)
- **Coding Standards:** Enforce strict TypeScript, no `any` types, reusable components, error boundaries, and loading states.
- **Performance:** Ensure optimized rendering, dynamic imports, and code splitting.

### 2. Authentication Flow
- Implement Supabase Client.
- Create secure, responsive pages for Login, Signup, Forgot Password, and Reset Password.
- Implement persistent sessions, middleware protection, and robust error handling.

---

## Phase 2: Professional Dashboard & CRUD (Task 2 Continued)
*Goal: Create a robust, responsive task management dashboard.*

### 1. Database Schema (Supabase & Prisma)
- Create `profiles`, `tasks`, `canvas`, and `activity_logs` tables.
- **Task Schema:** `id`, `title`, `description`, `status`, `priority`, `color`, `created_at`, `updated_at`, `user_id`.
- **Security:** Implement Supabase Row Level Security (RLS), input sanitization, and environment variable protection.

### 2. Dashboard UI & Operations
- Build a Modern SaaS Dashboard: Sidebar, Top Navigation, Profile, Statistics Cards.
- Implement Task CRUD: Create, Read, Update, Delete using React Server Actions.
- Add filtering, sorting, pagination readiness, and skeleton loaders.
- **UI Design:** Ensure Mobile First, Dark/Light theme support, Premium Cards, Smooth Hover Effects, and Glassmorphism aesthetics.

---

## Phase 3: Realtime Sync & Live Updates (Task 3)
*Goal: Achieve zero-refresh live data synchronization.*

### 1. Supabase Realtime Integration
- Subscribe to `INSERT`, `UPDATE`, and `DELETE` payloads on the `tasks` table.
- Dynamically merge incoming database changes into the local React state.
- Implement Online Status, Activity Feed, and Instant Notifications (using Sonner).
- Verify real-time sync across multiple browser sessions without page refresh.

---

## Phase 4: HTML Canvas Integration (Task 4)
*Goal: Implement a high-performance interactive drawing board.*

### 1. Canvas Component
- Build a native HTML5 Canvas drawing tool within the dashboard.
- **Features:** Draw, Erase, Clear, Undo, Redo, Brush Size, Brush Color.
- **Data Storage:** Export as PNG and save Canvas JSON state to Supabase (`canvas` table).
- (Optional) Realtime Canvas Sync.

---

## Phase 5: Chrome Extension (Task 5 - Upcoming)
- **Platform:** Chrome Extension (Manifest V3)
- **Features:** Authentication, View Tasks, Create Task, Quick Note, Notifications, Realtime Updates.

---

## Phase 6: Mobile & Desktop (Task 6 - Upcoming)
- **Expo Mobile:** React Native, Android First, Auth, Realtime Sync, Task List, Responsive.
- **Tauri Desktop:** Rust backend, Native Window, Windows Support, Auth, Dashboard, Tasks, Canvas.

---

## Phase 7: AI, Testing & Future Scalability (Task 7 - Upcoming)
- **AI Integration:** Gemini AI to summarize notes, generate action items, improve writing, and rewrite text.
- **Scalability:** Teams, Workspaces, File Uploads, Comments, Offline Support (PWA), Role-Based Access.
- **Testing:** Manual testing for Auth, CRUD, Realtime, Canvas, Extension, Expo, and Desktop.
- **Deployment:** Vercel for web application, public GitHub repository, Loom Demonstration.
.....................................................
# Goal Description

Build a cross-platform real-time application ("SyncBoard") that adheres to a 10/10 enterprise-grade architecture. The system will leverage Next.js (App Router), Supabase (Auth, Realtime, Database), Tailwind CSS (v3), shadcn/ui, and Framer Motion. 

This plan translates the master specification into actionable, achievable tasks that meet the rigorous Session 2 Weekly Assignment deadlines, keeping our focus on completing **Tasks 1 to 4 today**.

## User Review Required

> [!IMPORTANT]
> **Database & Environment Setup:** Before executing Phase 1, we require the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your Supabase dashboard. Please ensure the project is created.
> **Tailwind Version:** The plan proceeds with Tailwind CSS v3 as it offers the highest stability and integration with `shadcn/ui` right now. 

## Open Questions

> [!WARNING]
> 1. **Supabase Schema**: I will provide the SQL script to create the `profiles`, `tasks`, and `canvas` tables with Row Level Security (RLS). Do you want me to help execute this in your Supabase SQL editor?
> 2. **Execution Approval**: Once you review this updated professional plan, reply with "Approved" or click the Proceed button so we can initialize the Next.js project and begin coding.

## Proposed Changes

### Phase 1: Enterprise Setup & Auth (Tasks 1 & 2) ✅ [COMPLETED]
**Goal:** Initialize the foundation, enforce strict coding standards, and implement secure Supabase authentication.

- Initialize Next.js with TypeScript, Tailwind CSS v3, and ESLint.
- Install `shadcn/ui`, `lucide-react`, `framer-motion`, `zod`, and `react-hook-form`.
- Setup the enterprise folder structure (App Router, generic components, UI libraries).
- Implement Supabase Client (`@supabase/ssr`).
- Build responsive, animated Login and Signup pages (Glassmorphism, SaaS aesthetics).

#### [NEW] `package.json` (Dependencies setup)
#### [NEW] `lib/supabase/client.ts` & `server.ts`
#### [NEW] `app/(auth)/login/page.tsx`
#### [NEW] `app/(auth)/signup/page.tsx`
#### [NEW] `components/ui/*` (shadcn components)

### Phase 2: Professional Dashboard & CRUD (Task 2 Cont.) ✅ [COMPLETED]
**Goal:** Create a robust, responsive task management dashboard.

- Implement the Dashboard layout with Sidebar and Top Navigation.
- Build the core Task entity CRUD (Create, Read, Update, Delete) using React Server Actions and Supabase.
- Integrate Zod for input validation and Sonner for toast notifications.

#### [NEW] `app/dashboard/layout.tsx`
#### [NEW] `app/dashboard/page.tsx`
#### [NEW] `components/dashboard/TaskBoard.tsx`
#### [NEW] `actions/taskActions.ts`

### Phase 3: Realtime Sync & Live Updates (Task 3) ✅ [COMPLETED]
**Goal:** Achieve zero-refresh live data synchronization.

- Research and implement Supabase Realtime subscriptions (WebSockets).
- Subscribe to `INSERT`, `UPDATE`, and `DELETE` payloads on the `tasks` table.
- Dynamically merge incoming database changes into the local React state.

#### [MODIFY] `components/dashboard/TaskBoard.tsx` (Add realtime hooks)
#### [NEW] `hooks/useRealtimeTasks.ts`

### Phase 4: HTML Canvas Integration (Task 4) ✅ [COMPLETED]
**Goal:** Implement a high-performance interactive drawing board.

- Build a `Canvas` React component using the native HTML5 Canvas API.
- Add features: Draw, Clear, Brush Size/Color adjustments.
- Save canvas states to the Supabase database.

#### [NEW] `app/dashboard/canvas/page.tsx`
#### [NEW] `components/canvas/DrawingBoard.tsx`

--- 
*Note: Phase 5 (Chrome Extension) and Phase 6 (Expo Mobile & Tauri Desktop) will be executed tomorrow following the same enterprise standards once Phase 1-4 are verified.*

## Verification Plan

### Automated Tests
- Type checking (`tsc --noEmit`) to enforce strict TypeScript standards (no `any` types).
- Linting (`npm run lint`) to maintain code readability.

### Manual Verification
- **Security Check:** Attempt to access protected dashboard routes while logged out.
- **Realtime Check:** Open the dashboard in two browsers; verify task modifications reflect globally in under 200ms.
- **Canvas Check:** Verify strokes render smoothly without layout jank, and exports function correctly.
- **UX Check:** Verify glassmorphism effects, Framer Motion micro-animations, and responsive layout across desktop and mobile views.
