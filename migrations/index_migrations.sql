-- Drop old B-tree indexes
DROP INDEX IF EXISTS idx_records_nhis_created_at;
DROP INDEX IF EXISTS idx_records_nhis_opd_number;
DROP INDEX IF EXISTS idx_records_nhis_nhis_number;
DROP INDEX IF EXISTS idx_records_nhis_ccc;

-- Enable pg_trgm
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- records_nhis indexes
CREATE INDEX idx_records_nhis_created_at_brin 
    ON public.records_nhis USING BRIN (created_at) 
    WITH (pages_per_range = 128);

CREATE INDEX idx_records_nhis_opd_trgm 
    ON public.records_nhis USING GIN (opd_number gin_trgm_ops);

CREATE INDEX idx_records_nhis_nhis_trgm 
    ON public.records_nhis USING GIN (nhis_number gin_trgm_ops);

CREATE INDEX idx_records_nhis_ccc_trgm 
    ON public.records_nhis USING GIN (ccc gin_trgm_ops);


-- records_private indexes
CREATE INDEX idx_records_private_created_at_brin 
    ON public.records_private USING BRIN (created_at) 
    WITH (pages_per_range = 128);

CREATE INDEX idx_records_private_opd_trgm 
    ON public.records_private USING GIN (opd_number gin_trgm_ops);

CREATE INDEX idx_records_private_phone_trgm 
    ON public.records_private USING GIN (phone gin_trgm_ops);

CREATE INDEX idx_records_private_membership_number_trgm 
    ON public.records_private USING GIN (membership_number gin_trgm_ops);

CREATE INDEX idx_records_private_name_trgm 
    ON public.records_private USING GIN (name gin_trgm_ops);