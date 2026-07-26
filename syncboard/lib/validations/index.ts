import { z } from 'zod'

export const CreateWorkspaceSchema = z.object({
  name: z.string().min(2, 'Workspace name must be at least 2 characters').max(50, 'Workspace name must be less than 50 characters'),
  organizationId: z.string().uuid('Invalid organization ID')
})

export const CreateOrganizationSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters').max(50, 'Organization name must be less than 50 characters')
})

export const CreateProjectSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters').max(50, 'Project name must be less than 50 characters'),
  description: z.string().max(255, 'Description is too long').optional(),
  workspaceId: z.string().uuid('Invalid workspace ID')
})

export const InviteMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['ADMIN', 'MANAGER', 'MEMBER', 'GUEST']),
  workspaceId: z.string().uuid('Invalid workspace ID'),
  orgId: z.string().uuid('Invalid organization ID')
})

export const CreateTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(100, 'Title is too long'),
  description: z.string().optional(),
  projectId: z.string().uuid('Invalid project ID'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM')
})
