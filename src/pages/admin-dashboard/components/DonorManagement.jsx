import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import DonationModal from '../../../components/DonationModal';
import { donorService } from '../../../lib/donorService';

const DonorManagement = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDonors, setSelectedDonors] = useState([]);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);

  const handleVerifyDonor = async (donorId) => {
    try {
      await donorService.verifyDonor(donorId);
      loadDonors();
      alert('দাতা সফলভাবে যাচাই করা হয়েছে!');
    } catch (error) {
      console.error('Failed to verify donor:', error);
      alert('যাচাই করতে সমস্যা হয়েছে।');
    }
  };

  const handleAddDonation = (donor) => {
    setSelectedDonor(donor);
    setShowDonationModal(true);
  };

  const handleDonationSubmit = async (donationData) => {
    try {
      await donorService.addDonation(selectedDonor.id, donationData);
      loadDonors();
      alert(`✅ ${selectedDonor.full_name} এর দান সফলভাবে রেকর্ড করা হয়েছে!`);
    } catch (error) {
      console.error('Failed to add donation:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadDonors();
  }, []);

  const loadDonors = async () => {
    try {
      const donorData = await donorService.getAllDonors();
      setDonors(donorData);
    } catch (error) {
      console.error('Failed to load donors:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockDonors = [
    {
      id: 1,
      name: 'মোহাম্মদ আলী',
      phone: '+880 1712-345678',
      bloodGroup: 'A+',
      location: 'ঢাকা, ধানমন্ডি',
      status: 'verified',
      lastDonation: '২০২৪-১১-১৫',
      totalDonations: 8,
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      id: 2,
      name: 'ফাতেমা খাতুন',
      phone: '+880 1812-987654',
      bloodGroup: 'O-',
      location: 'চট্টগ্রাম, আগ্রাবাদ',
      status: 'pending',
      lastDonation: 'কখনো দান করেননি',
      totalDonations: 0,
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
    }
  ];

  const filteredDonors = donors?.filter(donor => {
    const matchesSearch = donor?.full_name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         donor?.mobile?.includes(searchTerm) ||
                         donor?.blood_group?.includes(searchTerm) ||
                         donor?.district?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         donor?.upazila?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const donorStatus = donor?.is_verified ? 'verified' : 'pending';
    const matchesStatus = selectedStatus === 'all' || donorStatus === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-card rounded-lg p-6 shadow-brand border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary font-bengali">রক্তদাতা ব্যবস্থাপনা</h3>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" iconName="Download">
            <span className="font-bengali">এক্সপোর্ট</span>
          </Button>
          <Button variant="default" size="sm" iconName="Plus">
            <span className="font-bengali">নতুন দাতা</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="নাম, ফোন, রক্তের গ্রুপ বা এলাকা দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="w-full"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e?.target?.value)}
          className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="all">সব স্ট্যাটাস</option>
          <option value="verified">যাচাইকৃত</option>
          <option value="pending">অপেক্ষমান</option>
          <option value="suspended">স্থগিত</option>
        </select>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground font-bengali">দাতা</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground font-bengali">রক্তের গ্রুপ</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground font-bengali">এলাকা</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground font-bengali">স্ট্যাটাস</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground font-bengali">কার্যক্রম</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonors?.map((donor) => (
                  <tr key={donor?.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            {donor?.full_name?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-text-primary font-bengali">{donor?.full_name}</div>
                          <div className="text-sm text-muted-foreground">{donor?.mobile}</div>
                          <div className="text-xs text-muted-foreground">{donor?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {donor?.blood_group}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-text-primary font-bengali">
                        <div>{donor?.upazila}, {donor?.district}</div>
                        <div className="text-xs text-muted-foreground">{donor?.address}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                        donor?.is_verified 
                          ? 'bg-success/10 text-success border-success/20' 
                          : 'bg-warning/10 text-warning border-warning/20'
                      }`}>
                        {donor?.is_verified ? 'যাচাইকৃত' : 'অপেক্ষমান'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="p-1 text-muted-foreground hover:text-primary"
                          title="বিস্তারিত দেখুন"
                        >
                          <Icon name="Eye" size={16} />
                        </button>
                        <button 
                          className="p-1 text-muted-foreground hover:text-primary"
                          title="সম্পাদনা করুন"
                        >
                          <Icon name="Edit" size={16} />
                        </button>
                        {!donor?.is_verified && (
                          <button 
                            className="p-1 text-muted-foreground hover:text-success"
                            title="যাচাই করুন"
                            onClick={() => handleVerifyDonor(donor?.id)}
                          >
                            <Icon name="CheckCircle" size={16} />
                          </button>
                        )}
                        <button 
                          className="p-1 text-muted-foreground hover:text-secondary"
                          title="দান যোগ করুন"
                          onClick={() => handleAddDonation(donor)}
                        >
                          <Icon name="Plus" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground font-bengali">
              মোট {filteredDonors?.length} জন দাতার মধ্যে ১-৫ দেখানো হচ্ছে
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" iconName="ChevronLeft" disabled>
                <span className="font-bengali">পূর্ববর্তী</span>
              </Button>
              <Button variant="outline" size="sm">
                <span className="font-bengali">পরবর্তী</span>
              </Button>
            </div>
          </div>
        </>
      )}
      
      {/* Donation Modal */}
      <DonationModal
        isOpen={showDonationModal}
        onClose={() => {
          setShowDonationModal(false);
          setSelectedDonor(null);
        }}
        donor={selectedDonor}
        onSubmit={handleDonationSubmit}
      />
    </div>
  );
};

export default DonorManagement;