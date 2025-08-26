import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import DonorCard from './DonorCard';

const SearchResults = ({ 
  donors, 
  isLoading, 
  searchQuery, 
  onContactDonor, 
  onQuickCall, 
  onWhatsApp, 
  onContactMultiple,
  isEmergencyMode 
}) => {
  const [selectedDonors, setSelectedDonors] = useState([]);
  const [sortBy, setSortBy] = useState('distance');

  const handleSelectDonor = (donorId) => {
    setSelectedDonors(prev => 
      prev?.includes(donorId) 
        ? prev?.filter(id => id !== donorId)
        : [...prev, donorId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDonors?.length === donors?.length) {
      setSelectedDonors([]);
    } else {
      setSelectedDonors(donors?.map(donor => donor?.id));
    }
  };

  const sortOptions = [
    { value: 'distance', label: 'দূরত্ব অনুযায়ী' },
    { value: 'availability', label: 'উপলব্ধতা অনুযায়ী' },
    { value: 'donations', label: 'দান সংখ্যা অনুযায়ী' },
    { value: 'rating', label: 'রেটিং অনুযায়ী' },
    { value: 'response_time', label: 'সাড়া সময় অনুযায়ী' }
  ];

  const getSortedDonors = () => {
    const sorted = [...donors];
    switch (sortBy) {
      case 'distance':
        return sorted?.sort((a, b) => parseFloat(a?.distance) - parseFloat(b?.distance));
      case 'availability':
        return sorted?.sort((a, b) => {
          const order = { 'available': 0, 'recently_donated': 1, 'unavailable': 2 };
          return order?.[a?.availability] - order?.[b?.availability];
        });
      case 'donations':
        return sorted?.sort((a, b) => b?.totalDonations - a?.totalDonations);
      case 'rating':
        return sorted?.sort((a, b) => parseFloat(b?.rating) - parseFloat(a?.rating));
      case 'response_time':
        return sorted?.sort((a, b) => parseInt(a?.responseTime) - parseInt(b?.responseTime));
      default:
        return sorted;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-brand p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-bengali">রক্তদাতা খোঁজা হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!donors || donors?.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-brand p-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Icon name="Search" size={32} color="var(--color-muted-foreground)" />
          </div>
          <h3 className="text-lg font-bengali font-semibold text-text-primary">
            কোনো রক্তদাতা পাওয়া যায়নি
          </h3>
          <p className="text-muted-foreground font-bengali">
            আপনার অনুসন্ধানের মাপদণ্ড অনুযায়ী কোনো দাতা খুঁজে পাওয়া যায়নি।\n
            ফিল্টার কমিয়ে বা এলাকা বাড়িয়ে আবার চেষ্টা করুন।
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" iconName="RotateCcw" iconPosition="left">
              <span className="font-bengali">আবার খুঁজুন</span>
            </Button>
            <Button variant="default" iconName="Plus" iconPosition="left">
              <span className="font-bengali">রক্তের অনুরোধ পোস্ট করুন</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const sortedDonors = getSortedDonors();

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="bg-white rounded-xl shadow-brand p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bengali font-semibold text-text-primary">
              অনুসন্ধানের ফলাফল
            </h2>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-bengali">
              {donors?.length} জন পাওয়া গেছে
            </span>
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-3">
            <span className="text-sm text-muted-foreground font-bengali">সাজান:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm font-bengali focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {sortOptions?.map(option => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {donors?.length > 1 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSelectAll}
                  className="flex items-center space-x-2 text-sm text-primary hover:text-primary/80 transition-colors duration-300"
                >
                  <Icon name={selectedDonors?.length === donors?.length ? "CheckSquare" : "Square"} size={16} />
                  <span className="font-bengali">
                    {selectedDonors?.length === donors?.length ? 'সব বাতিল করুন' : 'সব নির্বাচন করুন'}
                  </span>
                </button>
                {selectedDonors?.length > 0 && (
                  <span className="text-sm text-muted-foreground font-bengali">
                    {selectedDonors?.length} জন নির্বাচিত
                  </span>
                )}
              </div>

              {selectedDonors?.length > 0 && (
                <Button
                  variant="default"
                  size="sm"
                  iconName="Users"
                  iconPosition="left"
                  onClick={() => onContactMultiple(selectedDonors)}
                  className="font-bengali"
                >
                  একসাথে যোগাযোগ করুন ({selectedDonors?.length})
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Emergency Mode Alert */}
      {isEmergencyMode && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <Icon name="AlertTriangle" size={20} color="var(--color-destructive)" />
            <div>
              <h3 className="font-bengali font-semibold text-destructive">জরুরি মোড সক্রিয়</h3>
              <p className="text-sm text-destructive/80 font-bengali">
                দ্রুত যোগাযোগের জন্য সরাসরি কল করুন বা WhatsApp ব্যবহার করুন
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Donor Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedDonors?.map((donor) => (
          <div key={donor?.id} className="relative">
            {/* Selection Checkbox */}
            {donors?.length > 1 && (
              <button
                onClick={() => handleSelectDonor(donor?.id)}
                className="absolute top-4 left-4 z-10 w-6 h-6 rounded border-2 border-border bg-white flex items-center justify-center hover:border-primary transition-colors duration-300"
              >
                {selectedDonors?.includes(donor?.id) && (
                  <Icon name="Check" size={14} color="var(--color-primary)" />
                )}
              </button>
            )}

            <DonorCard
              donor={donor}
              onContact={onContactDonor}
              onQuickCall={onQuickCall}
              onWhatsApp={onWhatsApp}
              isEmergencyMode={isEmergencyMode}
            />
          </div>
        ))}
      </div>
      {/* Load More */}
      {donors?.length >= 10 && (
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            iconName="ChevronDown"
            iconPosition="right"
            className="font-bengali"
          >
            আরও দাতা দেখুন
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;