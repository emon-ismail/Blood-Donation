import React, { createContext, useContext, useState, useEffect } from 'react';
import { donorService } from '../lib/donorService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donorData, setDonorData] = useState(null);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('donor_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('donor_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (identifier) => {
    try {
      console.log('Attempting login with:', identifier);
      const donor = await donorService.getDonorByEmailOrMobile(identifier);
      console.log('Donor found:', donor);
      
      if (donor) {
        const userData = {
          id: donor.id,
          email: donor.email,
          name: donor.full_name,
          bloodGroup: donor.blood_group
        };
        console.log('Setting user data:', userData);
        setUser(userData);
        localStorage.setItem('donor_user', JSON.stringify(userData));
        return { success: true };
      } else {
        console.log('No donor found for identifier:', identifier);
        return { success: false, error: 'এই ইমেইল/মোবাইল দিয়ে কোনো দাতা নিবন্ধিত নেই' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'লগইনে সমস্যা হয়েছে' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('donor_user');
  };

  const updateDonorData = (data) => {
    setDonorData(data);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    donorData,
    updateDonorData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};