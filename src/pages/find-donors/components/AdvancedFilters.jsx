import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const AdvancedFilters = ({ filters, onFiltersChange, isExpanded, onToggleExpanded }) => {
  const availabilityOptions = [
    { value: 'available', label: 'এখনই উপলব্ধ' },
    { value: 'within_week', label: 'এক সপ্তাহের মধ্যে' },
    { value: 'within_month', label: 'এক মাসের মধ্যে' },
    { value: 'any', label: 'যেকোনো সময়' }
  ];

  const lastDonationOptions = [
    { value: 'never', label: 'কখনো দান করেননি' },
    { value: 'within_3months', label: '৩ মাসের মধ্যে' },
    { value: 'within_6months', label: '৬ মাসের মধ্যে' },
    { value: 'over_6months', label: '৬ মাসের বেশি আগে' }
  ];

  const ageRangeOptions = [
    { value: '18-25', label: '১৮-২৫ বছর' },
    { value: '26-35', label: '২৬-৩৫ বছর' },
    { value: '36-45', label: '৩৬-৪৫ বছর' },
    { value: '46-60', label: '৪৬-৬০ বছর' }
  ];

  const genderOptions = [
    { value: 'any', label: 'যেকোনো' },
    { value: 'male', label: 'পুরুষ' },
    { value: 'female', label: 'মহিলা' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-brand mb-6">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={onToggleExpanded}
      >
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} color="var(--color-primary)" />
          <h2 className="text-lg font-bengali font-semibold text-text-primary">
            উন্নত ফিল্টার
          </h2>
          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-bengali">
            {Object.values(filters)?.filter(Boolean)?.length} সক্রিয়
          </span>
        </div>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          color="var(--color-muted-foreground)" 
        />
      </div>
      {/* Expanded Filters */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {/* Availability Status */}
            <Select
              label="উপলব্ধতার অবস্থা"
              placeholder="অবস্থা নির্বাচন করুন"
              options={availabilityOptions}
              value={filters?.availability || ''}
              onChange={(value) => onFiltersChange({ ...filters, availability: value })}
            />

            {/* Last Donation */}
            <Select
              label="শেষ রক্তদান"
              placeholder="সময়কাল নির্বাচন করুন"
              options={lastDonationOptions}
              value={filters?.lastDonation || ''}
              onChange={(value) => onFiltersChange({ ...filters, lastDonation: value })}
            />

            {/* Age Range */}
            <Select
              label="বয়সের সীমা"
              placeholder="বয়স নির্বাচন করুন"
              options={ageRangeOptions}
              value={filters?.ageRange || ''}
              onChange={(value) => onFiltersChange({ ...filters, ageRange: value })}
            />

            {/* Gender */}
            <Select
              label="লিঙ্গ"
              placeholder="লিঙ্গ নির্বাচন করুন"
              options={genderOptions}
              value={filters?.gender || 'any'}
              onChange={(value) => onFiltersChange({ ...filters, gender: value })}
            />
          </div>

          {/* Additional Options */}
          <div className="mt-6 space-y-4">
            <h3 className="font-bengali font-medium text-text-primary">অতিরিক্ত বিকল্প</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Checkbox
                label="শুধুমাত্র যাচাইকৃত দাতা"
                checked={filters?.verifiedOnly || false}
                onChange={(e) => onFiltersChange({ ...filters, verifiedOnly: e?.target?.checked })}
                description="পরিচয় যাচাই করা দাতারা"
              />

              <Checkbox
                label="দ্রুত সাড়াদানকারী"
                checked={filters?.quickResponders || false}
                onChange={(e) => onFiltersChange({ ...filters, quickResponders: e?.target?.checked })}
                description="১ ঘন্টার মধ্যে সাড়া দেন"
              />

              <Checkbox
                label="একাধিকবার দাতা"
                checked={filters?.multipleDonors || false}
                onChange={(e) => onFiltersChange({ ...filters, multipleDonors: e?.target?.checked })}
                description="৩+ বার রক্তদান করেছেন"
              />

              <Checkbox
                label="জরুরি পরিস্থিতিতে সাহায্যকারী"
                checked={filters?.emergencyHelpers || false}
                onChange={(e) => onFiltersChange({ ...filters, emergencyHelpers: e?.target?.checked })}
                description="জরুরি অবস্থায় সাহায্য করেন"
              />
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <button
              onClick={() => onFiltersChange({})}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-bengali text-muted-foreground hover:text-text-primary transition-colors duration-300"
            >
              <Icon name="RotateCcw" size={16} />
              <span>সব ফিল্টার মুছুন</span>
            </button>

            <div className="flex items-center space-x-2 text-sm text-muted-foreground font-bengali">
              <Icon name="Info" size={16} />
              <span>ফিল্টার যত বেশি, ফলাফল তত কম</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;