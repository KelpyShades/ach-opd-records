-- Cleanup Script: Remove Mock Data
-- Run this to delete all mock records after demonstration

-- Delete all mock records (identified by OPD- prefix)
DELETE FROM records_nhis 
WHERE opd_number LIKE 'OPD-%';

-- Verify cleanup
SELECT COUNT(*) as remaining_records FROM records_nhis;

-- Reset sequence if table is empty
DO $$
BEGIN
    IF (SELECT COUNT(*) FROM records_nhis) = 0 THEN
        ALTER SEQUENCE records_nhis_id_seq RESTART WITH 1;
        RAISE NOTICE 'Sequence reset to 1';
    END IF;
END $$;

