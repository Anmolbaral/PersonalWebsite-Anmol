-- Create notes table for storing user submissions
CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  contact_info TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);

-- Enable Row Level Security (optional - you can enable this for additional security)
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows inserting notes (public access)
CREATE POLICY "Allow public insert on notes" ON notes
  FOR INSERT
  WITH CHECK (true);

-- Create a policy for reading notes (you can restrict this to authenticated users only)
CREATE POLICY "Allow authenticated read on notes" ON notes
  FOR SELECT
  USING (true);
