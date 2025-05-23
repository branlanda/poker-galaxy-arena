
-- Functions for table chat management

-- Function to get chat messages for a table
CREATE OR REPLACE FUNCTION public.get_table_chat_messages(p_table_id UUID)
RETURNS TABLE (
  id UUID,
  table_id UUID,
  player_id UUID,
  player_name TEXT,
  message TEXT,
  created_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.table_id,
    m.player_id,
    m.player_name,
    m.message,
    m.created_at
  FROM 
    table_chat_messages m
  WHERE 
    m.table_id = p_table_id
  ORDER BY 
    m.created_at ASC;
END;
$$;

-- Function to insert a chat message
CREATE OR REPLACE FUNCTION public.insert_chat_message(
  p_table_id UUID,
  p_player_id UUID,
  p_player_name TEXT,
  p_message TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_message_id UUID;
BEGIN
  INSERT INTO table_chat_messages (
    table_id,
    player_id,
    player_name,
    message
  ) VALUES (
    p_table_id,
    p_player_id,
    p_player_name,
    p_message
  )
  RETURNING id INTO v_message_id;
  
  RETURN v_message_id;
END;
$$;
