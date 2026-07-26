-- SyncBoard Enterprise RLS Policies

-- Enable RLS on all tables
ALTER TABLE "Organization" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Workspace" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Membership" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Task" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Invitation" ENABLE ROW LEVEL SECURITY;

-- 1. Organizations
-- Users can only view organizations they are a member of
CREATE POLICY "View organizations if member" ON "Organization"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "Membership" m
      WHERE m.org_id = "Organization".id
      AND m.user_id = auth.uid()
    )
  );

-- 2. Workspaces
-- Users can only view workspaces they are a member of
CREATE POLICY "View workspaces if member" ON "Workspace"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "Membership" m
      WHERE m.workspace_id = "Workspace".id
      AND m.user_id = auth.uid()
    )
  );

-- 3. Projects
-- Users can only view projects in their workspaces
CREATE POLICY "View projects if workspace member" ON "Project"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "Membership" m
      WHERE m.workspace_id = "Project".workspace_id
      AND m.user_id = auth.uid()
    )
  );

-- 4. Tasks
-- Users can only view tasks in their projects
CREATE POLICY "View tasks if project workspace member" ON "Task"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "Project" p
      JOIN "Membership" m ON p.workspace_id = m.workspace_id
      WHERE p.id = "Task".project_id
      AND m.user_id = auth.uid()
    )
  );

-- 5. Invitations
-- Users can view invitations sent to their email or sent from their workspaces
CREATE POLICY "View invitations if recipient or sender workspace member" ON "Invitation"
  FOR SELECT USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR
    EXISTS (
      SELECT 1 FROM "Membership" m
      WHERE m.workspace_id = "Invitation".workspace_id
      AND m.user_id = auth.uid()
      AND m.role IN ('OWNER', 'ADMIN')
    )
  );
