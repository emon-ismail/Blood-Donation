-- Blood requests table
CREATE TABLE blood_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name VARCHAR(100) NOT NULL,
  blood_group VARCHAR(5) NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  units_needed INTEGER NOT NULL CHECK (units_needed > 0),
  hospital VARCHAR(200) NOT NULL,
  location VARCHAR(100) NOT NULL,
  district VARCHAR(50) NOT NULL,
  contact_person VARCHAR(100) NOT NULL,
  contact_phone VARCHAR(15) NOT NULL,
  urgency_level VARCHAR(20) NOT NULL CHECK (urgency_level IN ('emergency', 'urgent', 'standard')),
  required_by TIMESTAMP WITH TIME ZONE NOT NULL,
  additional_info TEXT,
  verified BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'fulfilled', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donations table
CREATE TABLE donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_id UUID REFERENCES donors(id),
  request_id UUID REFERENCES blood_requests(id),
  hospital VARCHAR(200) NOT NULL,
  donation_date DATE NOT NULL,
  amount_ml INTEGER DEFAULT 450,
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Success stories table
CREATE TABLE success_stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name VARCHAR(100) NOT NULL,
  blood_group VARCHAR(5) NOT NULL,
  message TEXT NOT NULL,
  location VARCHAR(100) NOT NULL,
  donors_helped INTEGER DEFAULT 1,
  completed_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_blood_requests_blood_group ON blood_requests(blood_group);
CREATE INDEX idx_blood_requests_urgency ON blood_requests(urgency_level);
CREATE INDEX idx_blood_requests_status ON blood_requests(status);
CREATE INDEX idx_donations_donor_id ON donations(donor_id);
CREATE INDEX idx_donations_date ON donations(donation_date);

-- Enable RLS
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE success_stories ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read blood_requests" ON blood_requests FOR SELECT USING (true);
CREATE POLICY "Public insert blood_requests" ON blood_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read donations" ON donations FOR SELECT USING (true);
CREATE POLICY "Public insert donations" ON donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read success_stories" ON success_stories FOR SELECT USING (true);
CREATE POLICY "Public insert success_stories" ON success_stories FOR INSERT WITH CHECK (true);