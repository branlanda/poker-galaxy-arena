
-- Create table for chat messages at poker tables
CREATE TABLE IF NOT EXISTS public.table_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID NOT NULL REFERENCES public.lobby_tables(id) ON DELETE CASCADE,
  player_id UUID NOT NULL,
  player_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_table_chat_message_table_id ON public.table_chat_messages(table_id);
CREATE INDEX IF NOT EXISTS idx_table_chat_message_created_at ON public.table_chat_messages(created_at);

-- Add row-level security policies
ALTER TABLE public.table_chat_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can read messages from a table they can access
CREATE POLICY "Anyone can read table chat messages" 
  ON public.table_chat_messages 
  FOR SELECT 
  USING (true);

-- Only authenticated users can insert their own messages
CREATE POLICY "Users can create their own messages" 
  ON public.table_chat_messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = player_id);

-- Enable realtime for this table
ALTER publication supabase_realtime ADD TABLE public.table_chat_messages;
