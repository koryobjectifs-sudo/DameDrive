-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  package TEXT NOT NULL,
  estimated_hours INTEGER,
  total_amount TEXT,
  message TEXT,
  sessions TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (since the landing page booking form is public)
CREATE POLICY "Enable insert for all users" ON public.bookings FOR INSERT WITH CHECK (true);

-- Only authenticated users (dashboard admins) can read, update, or delete
CREATE POLICY "Enable read access for authenticated users" ON public.bookings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable update for authenticated users" ON public.bookings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete for authenticated users" ON public.bookings FOR DELETE TO authenticated USING (true);
