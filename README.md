# Budgeting App

A simple personal finance web app built with Next.js, Supabase, and TypeScript.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to SQL Editor and run the SQL from `database-schema.sql`
   - Go to Settings > API and copy your project URL and anon key
   - Go to Settings > API and copy your service role key (keep this secret!)

3. **Configure environment variables:**
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
     ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## Features

- Email magic link authentication via Supabase
- Dashboard showing all transactions
- CSV import functionality (QFX/OFX coming soon)
- Row-level security ensuring users can only see their own transactions

## Database Schema

The app uses a `transactions` table with the following structure:
- `id` (UUID, primary key)
- `user_id` (UUID, references auth.users)
- `date` (DATE)
- `description` (TEXT)
- `amount` (NUMERIC(14, 2))
- `created_at` (TIMESTAMPTZ)

See `database-schema.sql` for the complete schema and RLS policies.

## CSV Import Format

CSV files should have the following headers (case-insensitive):
- `date` - Date in YYYY-MM-DD format or any parseable date format
- `description` - Transaction description
- `amount` - Signed number (negative for debits, positive for credits)

Example:
```csv
date,description,amount
2024-01-15,Grocery Store,-45.50
2024-01-16,Salary Deposit,2000.00
```

## Deployment

This app is ready to deploy on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add your environment variables in Vercel project settings
4. Deploy!

