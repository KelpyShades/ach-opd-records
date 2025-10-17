-- Create NHIS Records Table
CREATE TABLE IF NOT EXISTS public.records_nhis (
    id BIGSERIAL PRIMARY KEY,
    opd_number TEXT NOT NULL,
    nhis_number TEXT NOT NULL,
    ccc TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_records_nhis_created_at ON public.records_nhis(created_at DESC);
CREATE INDEX idx_records_nhis_opd_number ON public.records_nhis(opd_number);
CREATE INDEX idx_records_nhis_nhis_number ON public.records_nhis(nhis_number);
CREATE INDEX idx_records_nhis_ccc ON public.records_nhis(ccc);

-- Enable Row Level Security
ALTER TABLE public.records_nhis ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for authenticated users
CREATE POLICY "Authenticated users can view NHIS records"
    ON public.records_nhis FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can insert NHIS records"
    ON public.records_nhis FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update NHIS records"
    ON public.records_nhis FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can delete NHIS records"
    ON public.records_nhis FOR DELETE
    TO authenticated
    USING (true);

-- Grant permissions
GRANT ALL ON public.records_nhis TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE records_nhis_id_seq TO authenticated;

