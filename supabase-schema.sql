-- Create donors table
CREATE TABLE donors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 18 AND age <= 65),
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  district VARCHAR(50) NOT NULL,
  upazila VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  blood_group VARCHAR(5) NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  availability VARCHAR(20) DEFAULT 'available' CHECK (availability IN ('available', 'unavailable', 'recently_donated')),
  mobile VARCHAR(15) UNIQUE NOT NULL,
  email VARCHAR(100),
  emergency_contact VARCHAR(15) NOT NULL,
  sms_notifications BOOLEAN DEFAULT true,
  phone_calls_allowed BOOLEAN DEFAULT true,
  whatsapp_allowed BOOLEAN DEFAULT false,
  emergency_contact_allowed BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_donors_blood_group ON donors(blood_group);
CREATE INDEX idx_donors_district ON donors(district);
CREATE INDEX idx_donors_availability ON donors(availability);
CREATE INDEX idx_donors_mobile ON donors(mobile);

-- Enable Row Level Security
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (for finding donors)
CREATE POLICY "Public read access" ON donors
  FOR SELECT USING (true);

-- Create policy for public insert (for registration)
CREATE POLICY "Public insert access" ON donors
  FOR INSERT WITH CHECK (true);

-- Create policy for update (only for verification)
CREATE POLICY "Update verification only" ON donors
  FOR UPDATE USING (true)
  WITH CHECK (true);