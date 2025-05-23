
-- Table for storing chat messages for each table
CREATE TABLE IF NOT EXISTS public.table_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID NOT NULL REFERENCES public.lobby_tables(id) ON DELETE CASCADE,
  player_id UUID NOT NULL,
  player_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for faster lookups by table_id
CREATE INDEX IF NOT EXISTS idx_table_chat_messages_table_id 
  ON public.table_chat_messages(table_id);

-- Add RLS policies
ALTER TABLE public.table_chat_messages ENABLE ROW LEVEL SECURITY;

-- Everyone can read chat messages
CREATE POLICY table_chat_messages_select_policy
  ON public.table_chat_messages 
  FOR SELECT 
  USING (true);

-- Only authenticated users can insert messages
CREATE POLICY table_chat_messages_insert_policy
  ON public.table_chat_messages 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (
    auth.uid() = player_id
  );
