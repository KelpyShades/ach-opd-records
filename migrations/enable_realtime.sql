-- Enable realtime for records_nhis table
-- This allows clients to subscribe to changes (INSERT, UPDATE, DELETE) on this table

ALTER PUBLICATION supabase_realtime ADD TABLE public.records_nhis;

-- Set REPLICA IDENTITY to FULL for DELETE events to work properly
-- This ensures old row data is available in DELETE events
ALTER TABLE public.records_nhis REPLICA IDENTITY FULL;

ALTER TABLE public.records_private REPLICA IDENTITY FULL;