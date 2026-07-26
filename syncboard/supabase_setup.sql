-- Supabase Setup Script for SyncBoard

-- Create Tasks Table
CREATE TABLE public.tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  status text DEFAULT 'TODO' NOT NULL,
  priority text DEFAULT 'MEDIUM' NOT NULL,
  color text DEFAULT '#3f3f46',
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create Policies for Tasks
CREATE POLICY "Users can view their own tasks." ON public.tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks." ON public.tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks." ON public.tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks." ON public.tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Enable Realtime for tasks table
alter publication supabase_realtime add table public.tasks;

-- Create Canvas Table
CREATE TABLE public.canvas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  canvas_json text,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.canvas ENABLE ROW LEVEL SECURITY;

-- Create Policies for Canvas
CREATE POLICY "Users can view their own canvas." ON public.canvas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create/update their own canvas." ON public.canvas
  FOR ALL USING (auth.uid() = user_id);
