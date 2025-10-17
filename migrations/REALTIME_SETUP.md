# Supabase Realtime Setup Guide

## What is Realtime?

Supabase Realtime allows your application to listen to database changes in real-time. When any user inserts, updates, or deletes a record, all connected clients will automatically receive the update without refreshing the page.

## Setup Steps

### 1. ✅ Docker Compose (Already Configured)

Your `docker-compose.yml` already includes the realtime service. No changes needed.

### 2. Enable Realtime on Database Table

Run the migration to enable realtime on the `records_nhis` table:

```bash
# Option A: Apply migration directly via psql
docker exec -i supabase-db psql -U postgres -d postgres < supabase/docker/migrations/enable_realtime.sql

# Option B: Restart services (migrations auto-run on startup if properly configured)
cd supabase/docker
docker compose down
docker compose up -d
```

### 3. ✅ Frontend Code (Already Updated)

`NHISTableView.tsx` has been updated with realtime subscriptions.

## How It Works

### Realtime Subscription

The component now subscribes to changes on the `records_nhis` table:

```typescript
const channel = supabase
  .channel("records_nhis_changes")
  .on(
    "postgres_changes",
    {
      event: "*", // INSERT, UPDATE, DELETE
      schema: "public",
      table: "records_nhis",
    },
    (payload) => {
      // Handle changes automatically
    }
  )
  .subscribe();
```

### What Happens Now?

The realtime implementation is **smart** and respects the 100-record limit and search filters:

1. **INSERT**:
   - ✅ When viewing "last 100" (no search active): New records appear instantly at the top, maintaining the 100-record limit
   - ⏸️ When in search mode: New records don't appear (user needs to clear search or refresh)
2. **UPDATE**:
   - ✅ If the record is currently visible: Changes appear immediately
   - ⏸️ If the record is not in current view: No update (doesn't add it to view)
3. **DELETE**:
   - ✅ If the record is currently visible: It disappears instantly
   - ⏸️ If the record is not in view: Nothing happens (already not visible)

### Why This Approach?

**Problem**: Blindly adding all realtime events would:

- Break the 100-record limit (inserts would grow infinitely)
- Show records that don't match current search filters
- Try to update records that aren't even visible

**Solution**: Smart realtime that:

- Only updates what's currently visible
- Maintains the 100-record limit for inserts
- Respects search mode (user can refresh search to see new data)

## Testing Realtime

1. Open your app in two browser windows/tabs
2. Login on both
3. In one window, add a new NHIS record
4. Watch the other window - it should appear instantly!
5. Try editing and deleting records to see realtime updates

## Important Notes

### When Realtime Updates Appear

✅ **Updates are received when**:

- You're viewing the table (NHISTableView)
- Another user inserts/updates/deletes a record
- The app is actively subscribed (page is open)

❌ **Updates are NOT received when**:

- The component is unmounted (you navigate away)
- The subscription isn't active
- Network connection is lost

### Performance Considerations

- Realtime is optimized for many concurrent users
- Each client maintains a single WebSocket connection
- Filters applied in the UI don't affect realtime (all events are received)
- The subscription is cleaned up when the component unmounts

### Manual Refresh Still Available

The refresh button still works to manually re-fetch data:

- Useful if connection was lost
- Ensures data consistency
- Fetches full dataset with current filters

## Troubleshooting

### Realtime not working?

1. **Check realtime service is running**:

   ```bash
   docker ps | grep realtime
   ```

2. **Verify table is enabled for realtime**:

   ```sql
   SELECT schemaname, tablename
   FROM pg_publication_tables
   WHERE pubname = 'supabase_realtime';
   ```

3. **Check browser console** for subscription errors

4. **Verify environment variables**:
   - `NEXT_PUBLIC_SUPABASE_URL` is set
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set

### Connection Issues?

- Check that port 4000 is accessible (realtime service)
- Ensure Kong gateway is healthy (it proxies realtime)
- Verify JWT_SECRET matches across services

## Advanced: Filtering Realtime Events

If you want to filter realtime events (e.g., only receive updates for specific records), you can modify the subscription:

```typescript
// Example: Only listen to records from a specific year
const channel = supabase
  .channel("records_2024")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "records_nhis",
      filter: "created_at=gte.2024-01-01",
    },
    (payload) => {
      // Handle changes
    }
  )
  .subscribe();
```

## Optional: Remove Manual Refetch After Operations

Currently, the code still calls `fetchRecords()` after insert/update/delete operations. Since realtime handles this automatically, you could remove these calls:

**Current behavior**: Manual refetch + realtime update (redundant but safe)
**Optimized behavior**: Only realtime update (more efficient)

To optimize, remove `fetchRecords()` calls from:

- `handleEdit()` - line ~310
- `handleDelete()` - line ~332

But keeping them provides extra safety in case realtime fails.

## Summary

✅ Realtime is now enabled on your OPD Records system!

Your multi-user data entry system now updates in real-time across all connected clients, providing a seamless collaborative experience.
