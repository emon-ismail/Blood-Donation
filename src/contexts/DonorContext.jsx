import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const DonorContext = createContext();

export const useDonor = () => {
  const context = useContext(DonorContext);
  if (!context) {
    throw new Error('useDonor must be used within a DonorProvider');
  }
  return context;
};

export const DonorProvider = ({ children }) => {
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkDonorAuth();
  }, []);

  const checkDonorAuth = () => {
    const donorData = localStorage.getItem('donorData');
    if (donorData) {
      setDonor(JSON.parse(donorData));
    }
    setLoading(false);
  };

  const loginDonor = async (phone, name) => {
    try {
      // Check if donor exists by phone
      const { data: existingDonor, error } = await supabase
        .from('donors')
        .select('*')
        .eq('phone', phone)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (existingDonor) {
        // Donor exists, log them in
        localStorage.setItem('donorData', JSON.stringify(existingDonor));
        setDonor(existingDonor);
        return { success: true, donor: existingDonor };
      } else {
        // Donor doesn't exist
        return { success: false, message: 'এই মোবাইল নম্বর দিয়ে কোনো রক্তদাতা পাওয়া যায়নি। প্রথমে নিবন্ধন করুন।' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।' };
    }
  };

  const logoutDonor = () => {
    localStorage.removeItem('donorData');
    setDonor(null);
  };

  const value = {
    donor,
    loading,
    loginDonor,
    logoutDonor,
    isLoggedIn: !!donor
  };

  return (
    <DonorContext.Provider value={value}>
      {children}
    </DonorContext.Provider>
  );
};