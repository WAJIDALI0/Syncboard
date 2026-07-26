We already have an existing project called "SyncBoard". DO NOT rebuild the project from scratch.

Your job is to act as a Senior Software Architect, Senior Next.js Developer, Senior UI/UX Designer, Senior Database Architect, and Technical Lead.

Your first responsibility is to analyze the entire existing codebase before writing any code.

==================================================
STEP 1 - PROJECT ANALYSIS
==================================================

Analyze the complete project.

Tell me:

• Current architecture
• Folder structure
• Components
• Features already implemented
• Database structure
• API structure
• Authentication flow
• Realtime implementation
• Whiteboard implementation
• UI design system
• Missing features
• Bugs
• Security issues
• Performance issues
• Scalability issues
• Code duplication
• Better folder organization

DO NOT modify anything yet.

Generate an Analysis Report first.

==================================================
STEP 2 - IMPROVEMENT PLAN
==================================================

After analysis create a detailed improvement roadmap.

Separate the improvements into

High Priority

Medium Priority

Low Priority

Do NOT start coding until the roadmap is finished.

==================================================
STEP 3 - TECHNOLOGY STACK
==================================================

Use ONLY latest stable versions.

Next.js (Latest App Router)

React (Latest)

TypeScript

Supabase

PostgreSQL

Prisma ORM

Server Actions

React Hook Form

Zod

Tailwind CSS

shadcn/ui

Framer Motion

Lucide Icons

Sonner

HTML5 Canvas

Supabase Realtime

ESLint

Prettier

Latest npm packages

Do not use deprecated packages.

==================================================
STEP 4 - PROJECT GOAL
==================================================

Transform SyncBoard into an enterprise SaaS collaboration platform.

It should feel like

Notion

ClickUp

Slack

Trello

Jira

Miro

combined together.

==================================================
STEP 5 - MULTI TENANT SYSTEM
==================================================

Current application behaves like a shared board.

Convert it into a true multi-tenant SaaS.

Support:

Personal Workspace

Team Workspace

Organizations

Departments

Projects

Private Projects

Public Projects

Every user gets

Personal Workspace

Every organization has

Owner

Admins

Members

Guests

No data leakage between organizations.

==================================================
STEP 6 - USER MANAGEMENT
==================================================

Implement

Profile

Avatar

Settings

Password Change

Email Verification

Forgot Password

Two Factor Ready

Session Management

Multiple Sessions

==================================================
STEP 7 - TEAM MANAGEMENT
==================================================

Implement

Create Team

Create Organization

Create Workspace

Invite Members

Invite only by verified email.

Never allow random users.

Invitation Flow

Owner sends invite

↓

Email sent

↓

User accepts

↓

User becomes member

↓

Role assigned

Support roles

Owner

Admin

Manager

Member

Guest

Permissions must be role based.

==================================================
STEP 8 - DATABASE
==================================================

Review Prisma schema.

Improve relationships.

Include

User

Organization

Workspace

Team

Invitation

Project

Task

Comment

Activity

Notification

Chat

Canvas

CanvasStroke

Attachment

Tag

Label

Role

Permission

AuditLog

Everything must be properly related.

==================================================
STEP 9 - DASHBOARD
==================================================

Upgrade dashboard into professional SaaS.

Dashboard should contain

Statistics

Charts

Productivity

Activity Feed

Recent Tasks

Upcoming Deadlines

Assigned Tasks

Favorite Projects

Notifications

Search

Filters

Quick Actions

Responsive Design

Dark Mode

Beautiful animations

==================================================
STEP 10 - TASK MANAGEMENT
==================================================

Improve Task System.

Support

Create

Edit

Delete

Assign

Priority

Labels

Tags

Due Dates

Recurring Tasks

Subtasks

Attachments

Comments

Mentions

Task History

Task Activity

==================================================
STEP 11 - REALTIME
==================================================

Improve Supabase Realtime.

Realtime should sync

Tasks

Comments

Notifications

Presence

Online Users

Typing Indicator

Whiteboard

Chat

Activity Feed

without page refresh.

==================================================
STEP 12 - WHITEBOARD
==================================================

Upgrade HTML Canvas.

Support

Pen

Eraser

Text

Sticky Notes

Rectangle

Circle

Arrow

Images

Undo

Redo

Zoom

Pan

Export PNG

Export PDF

Realtime collaboration

Cursor sharing

==================================================
STEP 13 - CHAT
==================================================

Add Team Chat.

Support

Realtime Messaging

Typing

Emoji

File Upload

Reply

Seen Status

Unread Count

==================================================
STEP 14 - NOTIFICATIONS
==================================================

Notification Center

Task Assigned

Mention

Comment

Invitation

Deadline Reminder

System Notification

Realtime Notifications

==================================================
STEP 15 - AI FEATURES
==================================================

Integrate Gemini AI.

Features

Generate Task

Generate Project Plan

Summarize Notes

Generate Subtasks

Weekly Report

Daily Report

Meeting Summary

Smart Search

AI Assistant

==================================================
STEP 16 - SEARCH
==================================================

Global Search.

Search

Tasks

Projects

Users

Chat

Files

Whiteboards

==================================================
STEP 17 - SETTINGS
==================================================

Professional Settings.

Profile

Appearance

Notifications

Security

Workspace

Organization

Members

Billing Ready

API Keys Ready

==================================================
STEP 18 - SECURITY
==================================================

Review everything.

Implement

Supabase Row Level Security

Protected API

Input Validation

Authorization

Role Permissions

Ownership Validation

Prevent unauthorized access.

==================================================
STEP 19 - PERFORMANCE
==================================================

Optimize

Server Components

Client Components

Lazy Loading

Image Optimization

Code Splitting

Caching

Realtime Cleanup

Database Queries

==================================================
STEP 20 - CODE QUALITY
==================================================

Refactor project.

Feature based architecture.

Reusable components.

Reusable hooks.

Reusable services.

Reusable utilities.

Reusable validations.

Reusable types.

==================================================
STEP 21 - PREPARE FOR NEXT TASKS
==================================================

Do NOT create separate backend.

Everything must use Next.js App Router.

The same backend will later be reused for

Chrome Extension

Expo React Native

Desktop Application (Tauri)

All applications must use the same Supabase database and authentication.

==================================================
IMPORTANT
==================================================

DO NOT break existing functionality.

DO NOT remove existing features.

Only improve and extend.

Always explain WHY each improvement is needed.

Before modifying any file, analyze the impact.

When finished with one phase, stop and ask for approval before moving to the next phase.

Work like a Senior Software Architect building a production-grade SaaS application.