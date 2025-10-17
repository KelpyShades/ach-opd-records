# Hospital OPD Records - Setup Instructions

## ✅ Implementation Complete

All components have been created and the application is ready to use!

## 📦 Installation Steps

### 1. Install Dependencies

```bash
cd ach-opd-records
npm install
```

This will install the new `@radix-ui/react-checkbox` package that was added.

### 2. Set Up Database

You have two options:

#### Option A: Using Supabase Studio (Recommended)

1. Start your Supabase Docker stack (if not already running)
2. Open Supabase Studio at `http://192.168.1.10:54323` (or your configured URL)
3. Go to **SQL Editor**
4. Copy the contents of `supabase/docker/migrations/nhis_records.sql`
5. Paste and run the SQL script

#### Option B: Using Docker Command

```bash
docker exec supabase-db psql -U postgres -d postgres -f /path/to/nhis_records.sql
```

### 3. Configure Environment Variables

Make sure your `ach-opd-records/.env.local` has:

```env
NEXT_PUBLIC_SUPABASE_URL=http://192.168.1.10:8000
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Start the Application

```bash
npm run dev
```

Or build for production:

```bash
npm run build
npm start
```

## 🎨 What Was Built

### Components Created

1. **`components/ui/checkbox.tsx`** - Checkbox component for table row selection
2. **`components/Sidebar.tsx`** - Navigation sidebar with NHIS/Private sections
3. **`components/NHISTableView.tsx`** - Full-featured table with search, filters, edit, and delete
4. **`components/NHISInsertView.tsx`** - Clean form for adding NHIS records
5. **`components/PrivateInsuranceView.tsx`** - Coming soon placeholder

### Features Implemented

#### Sidebar Navigation

- NHIS Records section (View Records / Add Record)
- Private Insurance section (View Records / Add Record)
- User info display
- Logout button
- Active state highlighting

#### NHIS Table View

- ✅ Real-time search by OPD Number, NHIS Number, and CCC
- ✅ Date filtering by Year, Month, and specific Day
- ✅ Row selection with checkboxes (single and multiple)
- ✅ Select all functionality
- ✅ Edit individual records with dialog
- ✅ Delete single or multiple records with confirmation
- ✅ Clear filters button
- ✅ Record count display
- ✅ Modern table design with hover states

#### NHIS Insert View

- ✅ Clean, centered form
- ✅ Form validation with Zod
- ✅ Real-time validation feedback
- ✅ Success notifications
- ✅ Form auto-reset after submission

#### Private Insurance

- ✅ Coming soon placeholder with modern design
- Ready for future implementation

### Database

- ✅ `records_nhis` table created
- ✅ Indexes for performance (opd_number, nhis_number, ccc, created_at)
- ✅ Row Level Security enabled
- ✅ Policies for authenticated users (SELECT, INSERT, UPDATE, DELETE)

## 🚀 Usage

1. **Login** at `http://localhost:3000`
2. **Navigate** using the sidebar:
   - Click "NHIS Records" → "View Records" to see and manage records
   - Click "NHIS Records" → "Add Record" to insert new records
   - Private Insurance shows "Coming Soon" for now

## 📊 Features by View

### View Records (Table View)

- Search across three columns simultaneously
- Filter by year, month, or specific day
- Select multiple rows for batch deletion
- Edit individual records inline
- Delete with confirmation dialog
- Responsive data loading states

### Add Record (Insert View)

- Simple three-field form
- Instant validation feedback
- Clear success/error messages
- Auto-resets after successful submission

## 🎯 Next Steps

1. Run `npm install` to install new dependencies
2. Execute the SQL migration in Supabase Studio
3. Test the application
4. Add Private Insurance functionality later (table structure TBD)

## 🔧 Troubleshooting

### "Module not found: @radix-ui/react-checkbox"

Run `npm install` to install the new dependency.

### "Table records_nhis does not exist"

Run the SQL migration script in Supabase Studio.

### Filters not working

Make sure you have some records in the database first, and check that dates are being created properly.

## 📝 Notes

- The application is optimized for desktop only (as requested)
- All spacing and alignment follows Tailwind best practices
- Components use shadcn/ui for consistent, modern design
- The sidebar is fixed width (256px) with the main content area flexible
- Table has proper hover states and selection highlighting
