import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const DonationHistory = ({ donations }) => {
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredDonations = donations?.filter(donation => {
    if (filter === 'all') return true;
    if (filter === 'recent') return new Date(donation.date) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    if (filter === 'emergency') return donation?.type === 'emergency';
    return donation?.status === filter;
  });

  const getStatusColor = (status) => {
    const colors = {
      'completed': 'text-success bg-success/10',
      'pending': 'text-warning bg-warning/10',
      'cancelled': 'text-error bg-error/10'
    };
    return colors?.[status] || 'text-text-secondary bg-muted';
  };

  const getTypeIcon = (type) => {
    const icons = {
      'emergency': 'Zap',
      'scheduled': 'Calendar',
      'drive': 'Users',
      'replacement': 'RefreshCw'
    };
    return icons?.[type] || 'Droplets';
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-brand p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bengali font-bold text-text-primary mb-2">
            রক্তদানের ইতিহাস
          </h3>
          <p className="text-text-secondary font-bengali text-sm">
            আপনার সকল রক্তদানের বিস্তারিত তথ্য
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e?.target?.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm font-bengali focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">সব দান</option>
            <option value="recent">সাম্প্রতিক</option>
            <option value="emergency">জরুরি</option>
            <option value="completed">সম্পন্ন</option>
            <option value="pending">অপেক্ষমাণ</option>
          </select>
        </div>
      </div>
      {filteredDonations?.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Droplets" size={24} className="text-text-secondary" />
          </div>
          <p className="text-text-secondary font-bengali">কোন রক্তদানের তথ্য পাওয়া যায়নি</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDonations?.map((donation) => (
            <div
              key={donation?.id}
              className="border border-border rounded-lg p-4 hover:shadow-brand transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedDonation(donation)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name={getTypeIcon(donation?.type)} size={20} className="text-primary" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-bengali font-semibold text-text-primary">
                        {donation?.hospital}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donation?.status)}`}>
                        {donation?.status === 'completed' && 'সম্পন্ন'}
                        {donation?.status === 'pending' && 'অপেক্ষমাণ'}
                        {donation?.status === 'cancelled' && 'বাতিল'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-text-secondary mb-2">
                      <div className="flex items-center space-x-1">
                        <Icon name="Calendar" size={14} />
                        <span className="font-bengali">{formatDate(donation?.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="MapPin" size={14} />
                        <span className="font-bengali">{donation?.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Droplets" size={14} />
                        <span>{donation?.amount}ml</span>
                      </div>
                    </div>
                    
                    {donation?.patientMessage && (
                      <div className="bg-muted rounded-lg p-3 mt-3">
                        <p className="text-sm font-bengali text-text-primary">
                          "{donation?.patientMessage}"
                        </p>
                        <p className="text-xs text-text-secondary mt-1">
                          - {donation?.patientFamily}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {donation?.certificate && (
                    <button className="p-2 text-trust hover:bg-trust/10 rounded-lg transition-colors">
                      <Icon name="Download" size={16} />
                    </button>
                  )}
                  <Icon name="ChevronRight" size={16} className="text-text-secondary" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Donation Detail Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-brand-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border p-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bengali font-bold text-text-primary">
                  রক্তদানের বিবরণ
                </h4>
                <button
                  onClick={() => setSelectedDonation(null)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={getTypeIcon(selectedDonation?.type)} size={24} className="text-primary" />
                </div>
                
                <div className="flex-1">
                  <h5 className="text-xl font-bengali font-bold text-text-primary mb-2">
                    {selectedDonation?.hospital}
                  </h5>
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedDonation?.status)}`}>
                      {selectedDonation?.status === 'completed' && 'সম্পন্ন'}
                      {selectedDonation?.status === 'pending' && 'অপেক্ষমাণ'}
                      {selectedDonation?.status === 'cancelled' && 'বাতিল'}
                    </span>
                    <span className="text-sm text-text-secondary">
                      ID: {selectedDonation?.id}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Icon name="Calendar" size={18} className="text-text-secondary" />
                    <div>
                      <p className="text-sm text-text-secondary font-bengali">তারিখ</p>
                      <p className="font-bengali font-medium">{formatDate(selectedDonation?.date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Icon name="Clock" size={18} className="text-text-secondary" />
                    <div>
                      <p className="text-sm text-text-secondary font-bengali">সময়</p>
                      <p className="font-bengali font-medium">{selectedDonation?.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Icon name="MapPin" size={18} className="text-text-secondary" />
                    <div>
                      <p className="text-sm text-text-secondary font-bengali">স্থান</p>
                      <p className="font-bengali font-medium">{selectedDonation?.location}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Icon name="Droplets" size={18} className="text-text-secondary" />
                    <div>
                      <p className="text-sm text-text-secondary font-bengali">পরিমাণ</p>
                      <p className="font-medium">{selectedDonation?.amount}ml</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Icon name="User" size={18} className="text-text-secondary" />
                    <div>
                      <p className="text-sm text-text-secondary font-bengali">রোগীর নাম</p>
                      <p className="font-bengali font-medium">{selectedDonation?.patientName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Icon name="Phone" size={18} className="text-text-secondary" />
                    <div>
                      <p className="text-sm text-text-secondary font-bengali">যোগাযোগ</p>
                      <p className="font-medium">{selectedDonation?.contactNumber}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedDonation?.patientMessage && (
                <div className="bg-muted rounded-lg p-4 mb-6">
                  <h6 className="font-bengali font-semibold text-text-primary mb-2">
                    পরিবারের বার্তা
                  </h6>
                  <p className="text-text-primary font-bengali mb-2">
                    "{selectedDonation?.patientMessage}"
                  </p>
                  <p className="text-sm text-text-secondary">
                    - {selectedDonation?.patientFamily}
                  </p>
                </div>
              )}
              
              <div className="flex flex-wrap gap-3">
                {selectedDonation?.certificate && (
                  <button className="flex items-center space-x-2 px-4 py-2 bg-trust text-white rounded-lg hover:bg-trust/90 transition-colors">
                    <Icon name="Download" size={16} />
                    <span className="font-bengali">সার্টিফিকেট ডাউনলোড</span>
                  </button>
                )}
                <button className="flex items-center space-x-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors">
                  <Icon name="Share2" size={16} />
                  <span className="font-bengali">শেয়ার করুন</span>
                </button>
                {selectedDonation?.status === 'completed' && (
                  <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                    <Icon name="MessageCircle" size={16} />
                    <span className="font-bengali">প্রতিক্রিয়া দিন</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationHistory;