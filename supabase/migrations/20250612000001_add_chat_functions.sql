
-- Create RPC function to get table chat messages
CREATE OR REPLACE FUNCTION public.get_table_chat_messages(p_table_id UUID)
RETURNS SETOF table_chat_messages AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.table_chat_messages
  WHERE table_id = p_table_id
  ORDER BY created_at ASC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql;

-- Create RPC function to insert chat messages
CREATE OR REPLACE FUNCTION public.insert_chat_message(
  p_table_id UUID,
  p_player_id UUID,
  p_player_name TEXT,
  p_message TEXT
)
RETURNS UUID AS $$
DECLARE
  v_message_id UUID;
BEGIN
  INSERT INTO public.table_chat_messages (
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
$$ LANGUAGE plpgsql;

