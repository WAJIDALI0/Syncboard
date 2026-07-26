# Phase 6: Advanced Task Management & Realtime Sync

We have successfully completed the Enterprise Organization and Workspace System (Phase 5). The architecture is stable and hardened. It's time to move forward.

Phase 6 will focus on **Enterprise Task Management** and **Real-Time Collaboration**, turning the app into a fully-fledged productivity engine. 

## Goal
Implement advanced task management features such as subtasks, comments, labels, attachments, and make the Kanban board fully real-time so that when one user moves a task, it instantly updates for everyone else in the workspace.

## Proposed Features

### 1. Advanced Task Management
- **Task Hierarchy**: Implement Subtasks (Prisma model `Subtask`).
- **Task Comments**: Implement comments on tasks (Prisma model `Comment`).
- **Task Attachments**: Implement file attachments (Prisma model `Attachment`).
- **Rich Task Modals**: Update the task view modal to support editing descriptions, adding subtasks, managing comments, and setting due dates/labels.
- **Task Reordering**: Support drag-and-drop reordering *within* columns, not just between columns.

### 2. Realtime Sync (Supabase Realtime)
- Implement `Supabase Realtime` listeners on the Kanban Board.
- When a task is updated (e.g. status changed), all users currently viewing the board will see the update instantly without refreshing the page.

### 3. Project Detail View
- Build out `/dashboard/projects/[id]`.
- Provide a dedicated Kanban board specifically for the selected project.
- Project-level statistics and settings.

## Open Questions

> [!IMPORTANT]
> 1. **Realtime Channels**: For the real-time sync, do you prefer we sync at the Workspace level (all projects inside a workspace sync) or strictly at the Project level?
> 2. **Attachments**: Where should we store attachments? Should I configure Supabase Storage buckets, or would you prefer basic URL linking for now?

Please review this plan. If this looks good to you, simply click **Proceed** and I will begin execution!
