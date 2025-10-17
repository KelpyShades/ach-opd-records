# Mock Data Instructions for NHIS Records

## 📊 What This Does

Generates **~350 mock records** for demonstration:

- **Period**: January 2020 to October 2025
- **Frequency**: 5 records per month
- **Random timing**: Each record has random day/time within its month
- **Realistic data**: OPD numbers, NHIS numbers, and CCC codes

## 🚀 How to Load Mock Data

### Option 1: Using Supabase Studio (Recommended)

1. Start your Supabase Docker stack:

   ```bash
   cd supabase/docker
   docker compose up -d
   ```

2. Open Supabase Studio: `http://localhost:54323` (or your configured URL)

3. Go to **SQL Editor**

4. Copy and paste the contents of:

   ```
   supabase/docker/migrations/mock_data_nhis.sql
   ```

5. Click **Run** (or press Ctrl+Enter)

6. Check the output - should show:
   ```
   Generated 350 mock records from 2020-01-01 to 2025-10-31
   ```

### Option 2: Using Docker Command

```bash
# Copy the SQL file into the container
docker cp supabase/docker/migrations/mock_data_nhis.sql supabase-db:/tmp/

# Execute the SQL
docker exec supabase-db psql -U postgres -d postgres -f /tmp/mock_data_nhis.sql
```

## ✅ Verify Data Loaded

In Supabase Studio SQL Editor, run:

```sql
-- Check record counts by year
SELECT
    DATE_TRUNC('year', created_at)::DATE as year,
    COUNT(*) as records
FROM records_nhis
WHERE opd_number LIKE 'OPD-%'
GROUP BY year
ORDER BY year;

-- Expected output:
-- 2020: 60 records (12 months × 5)
-- 2021: 60 records
-- 2022: 60 records
-- 2023: 60 records
-- 2024: 60 records
-- 2025: 50 records (10 months × 5)
-- Total: 350 records
```

## 🧪 Test Your Features

With mock data loaded, you can test:

### 1. **Table View**

- Load the page → Should show last 100 records
- Scroll through table
- View dates spanning multiple years

### 2. **Search Functionality**

- Search for "OPD-000001" → Should find first record from 2020
- Search for "OPD-000350" → Should find last record from 2025

### 3. **Date Filters**

- Filter by Year: 2023 → Should show 60 records
- Filter by Year + Month: 2024, January → Should show 5 records
- Use calendar to pick specific day

### 4. **Sorting**

- Records should be sorted newest first
- October 2025 records at top
- January 2020 records at bottom

### 5. **Performance Testing**

- Type in search box → Results appear after 600ms debounce
- Change year filter → Immediate server search
- Clear filters → Returns to showing last 100

## 🧹 Remove Mock Data

After demonstration, run the cleanup script:

### In Supabase Studio:

Copy and paste contents of:

```
supabase/docker/migrations/cleanup_mock_data.sql
```

### Or via Docker:

```bash
docker cp supabase/docker/migrations/cleanup_mock_data.sql supabase-db:/tmp/
docker exec supabase-db psql -U postgres -d postgres -f /tmp/cleanup_mock_data.sql
```

This will:

1. Delete all records with `OPD-` prefix
2. Reset the ID sequence if table is empty
3. Show confirmation of cleanup

## 📋 Mock Data Format

**OPD Numbers**: `OPD-000001`, `OPD-000002`, ... `OPD-000350`

- Sequential, easy to search
- 6-digit padded

**NHIS Numbers**: `NHIS123456`, `NHIS789012`, etc.

- Random 6-digit numbers
- Realistic format

**CCC Codes**: `CCC-A123`, `CCC-B456`, `CCC-Z789`, etc.

- Letter (A-Z) + 3-digit number
- Varied format

**Dates**: Randomly distributed within each month

- Business hours: 8 AM - 5 PM
- Days: 1-28 (avoids month-end issues)

## 🎯 Quick Commands Summary

```bash
# Load mock data
docker exec supabase-db psql -U postgres -d postgres \
  -f /path/to/mock_data_nhis.sql

# Check data
docker exec supabase-db psql -U postgres -d postgres \
  -c "SELECT COUNT(*) FROM records_nhis WHERE opd_number LIKE 'OPD-%';"

# Cleanup
docker exec supabase-db psql -U postgres -d postgres \
  -f /path/to/cleanup_mock_data.sql
```

## ⚠️ Notes

- Mock records use `OPD-` prefix for easy identification
- Real records should use different format (e.g., `OPD/2025/001`)
- Cleanup script only deletes `OPD-` prefixed records
- Safe to run alongside real data
