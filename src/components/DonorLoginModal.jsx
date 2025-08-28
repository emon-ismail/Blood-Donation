import React, { useState } from 'react';
import Icon from './AppIcon';
import Button from './ui/Button';
import Input from './ui/Input';
import { useDonor } from '../contexts/DonorContext';

const DonorLoginModal = ({ isOpen, onClose, onSuccess }) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginDonor } = useDonor();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await loginDonor(phone, name);
    
    if (result.success) {
      onSuccess();
      onClose();
    } else {
      alert(result.message);
    }
    
    setLoading(false);
  };

  const handleRegisterRedirect = () => {
    onClose();
    window.location.href = '/donor-registration';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bengali font-bold">রক্তদাতা লগইন</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <Icon name="X" size={20} />
          </button>
        </div>

        <p className="text-sm text-gray-600 font-bengali mb-4">
          সাহায্য করতে প্রথমে রক্তদাতা হিসেবে লগইন করুন
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="মোবাইল নম্বর"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="01XXXXXXXXX"
            required
          />
          
          <Input
            label="নাম"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="আপনার নাম"
            required
          />

          <div className="flex space-x-3">
            <Button
              type="submit"
              variant="default"
              loading={loading}
              className="flex-1"
            >
              <span className="font-bengali">লগইন করুন</span>
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleRegisterRedirect}
              className="flex-1"
            >
              <span className="font-bengali">নিবন্ধন করুন</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonorLoginModal;