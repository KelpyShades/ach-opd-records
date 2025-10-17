-- Mock Data Generator for Private Insurance Records
-- This creates 5 records per month from Jan 2020 to Oct 2025
-- Total: ~350 records for demonstration purposes
-- Run this AFTER creating the records_private table
-- TO REMOVE: DELETE FROM records_private WHERE opd_number LIKE 'OPD-%';

-- Temporarily disable RLS for bulk insert
ALTER TABLE records_private DISABLE ROW LEVEL SECURITY;

-- Generate mock data
DO $$
DECLARE
    loop_date DATE;
    end_date DATE := '2025-10-16';
    start_date DATE := '2020-01-01';
    record_counter INT := 0;
    random_day INT;
    random_hour INT;
    random_minute INT;
    mock_timestamp TIMESTAMPTZ;
BEGIN
    -- Loop through each month
    loop_date := start_date;
    
    WHILE loop_date <= end_date LOOP
        -- Generate 5 records for this month
        FOR i IN 1..5 LOOP
            record_counter := record_counter + 1;
            
            -- Random day within the month (1-28 to avoid month-end issues)
            random_day := (RANDOM() * 27 + 1)::INT;
            
            -- Random time during business hours (8 AM - 5 PM)
            random_hour := (RANDOM() * 9 + 8)::INT;
            random_minute := (RANDOM() * 59)::INT;
            
            -- Create timestamp for this record
            mock_timestamp := DATE_TRUNC('month', loop_date) + 
                             (random_day - 1 || ' days')::INTERVAL +
                             (random_hour || ' hours')::INTERVAL +
                             (random_minute || ' minutes')::INTERVAL;
            
            -- Insert the mock record
            INSERT INTO records_private (opd_number, membership_number, phone, created_at, company, name)
            VALUES (
                'OPD-' || LPAD(record_counter::TEXT, 6, '0'),  -- OPD-000001, OPD-000002, etc.
                'Membership Number' || LPAD((RANDOM() * 999999)::INT::TEXT, 6, '0'),  -- Membership Number123456
                'Phone Number' || LPAD((RANDOM() * 999999)::INT::TEXT, 6, '0'),  -- Phone Number123456
                mock_timestamp,  -- created_at (timestamp)
                'Company' || LPAD((RANDOM() * 999999)::INT::TEXT, 6, '0'),  -- Company123456
                'Name' || LPAD((RANDOM() * 999999)::INT::TEXT, 6, '0')  -- Name123456
            );
        END LOOP;
        
        -- Move to next month
        loop_date := loop_date + INTERVAL '1 month';
    END LOOP;
    
    RAISE NOTICE 'Generated % mock records from % to %', record_counter, start_date, end_date;
END $$;

-- Re-enable RLS
ALTER TABLE records_private ENABLE ROW LEVEL SECURITY;

-- Show summary
SELECT 
    DATE_TRUNC('year', created_at)::DATE as year,
    COUNT(*) as record_count
FROM records_private
WHERE opd_number LIKE 'OPD-%'
GROUP BY DATE_TRUNC('year', created_at)
ORDER BY year;

-- Verify total count
SELECT 
    COUNT(*) as total_mock_records,
    MIN(created_at) as earliest_record,
    MAX(created_at) as latest_record
FROM records_private
WHERE opd_number LIKE 'OPD-%';

