import React, { useState } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';
import Icon from './AppIcon';

const DonationModal = ({ isOpen, onClose, donor, onSubmit }) => {
  const [formData, setFormData] = useState({
    hospital: '',
    date: new Date().toISOString().split('T')[0],
    amount: 450,
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.hospital || !formData.date) {
      alert('অনুগ্রহ করে সব তথ্য পূরণ করুন');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ ...formData, id: donor.id });
      setFormData({
        hospital: '',
        date: new Date().toISOString().split('T')[0],
        amount: 450,
        notes: ''
      });
      onClose();
    } catch (error) {
      console.error('Donation submission failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🩸 নতুন দান রেকর্ড করুন"
      size="md"
    >
      <div className="space-y-6">
        {/* Donor Info */}
        {donor && (
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-primary">
                  {donor.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div>
                <h4 className="font-bengali font-semibold text-text-primary">
                  {donor.name}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {donor.bloodGroup} • {donor.phone}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="হাসপাতাল/ক্লিনিকের নাম *"
            type="text"
            placeholder="যেমন: ঢাকা মেডিকেল কলেজ হাসপাতাল"
            value={formData.hospital}
            onChange={(e) => setFormData(prev => ({ ...prev, hospital: e.target.value }))}
            required
            className="font-bengali"
          />

          <Input
            label="দানের তারিখ *"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="রক্তের পরিমাণ (মিলি)"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: parseInt(e.target.value) }))}
              min="350"
              max="500"
            />
            <div className="flex items-end">
              <div className="text-sm text-muted-foreground font-bengali">
                সাধারণত ৪৫০ মিলি
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2 font-bengali">
              অতিরিক্ত তথ্য (ঐচ্ছিক)
            </label>
            <textarea
              placeholder="কোনো বিশেষ তথ্য বা মন্তব্য..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary font-bengali"
              rows="3"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 font-bengali"
            >
              বাতিল
            </Button>
            <Button
              type="submit"
              variant="default"
              loading={loading}
              iconName="Plus"
              iconPosition="left"
              className="flex-1 font-bengali"
            >
              {loading ? 'সংরক্ষণ হচ্ছে...' : 'দান রেকর্ড করুন'}
            </Button>
          </div>
        </form>

        {/* Info Box */}
        <div className="bg-trust/5 border border-trust/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={16} color="var(--color-trust)" className="mt-0.5" />
            <div className="text-sm">
              <p className="font-bengali text-trust font-medium mb-1">গুরুত্বপূর্ণ তথ্য:</p>
              <ul className="font-bengali text-trust/80 space-y-1 text-xs">
                <li>• রক্তদানের পর কমপক্ষে ৩ মাস বিরতি নিন</li>
                <li>• দানের পর পর্যাপ্ত বিশ্রাম ও পুষ্টিকর খাবার গ্রহণ করুন</li>
                <li>• কোনো সমস্যা হলে দ্রুত চিকিৎসকের পরামর্শ নিন</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DonationModal;