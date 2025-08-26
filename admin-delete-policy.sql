-- Allow admin to delete blood requests
CREATE POLICY "Admin can delete blood requests" ON blood_requests FOR DELETE USING (true);

-- Or if you want to be more specific, only allow authenticated users
-- CREATE POLICY "Admin can delete blood requests" ON blood_requests FOR DELETE USING (auth.role() = 'authenticated');