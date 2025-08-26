import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { allDistricts } from '../../../data/districts';

const PersonalInfoStep = ({ formData, setFormData, errors }) => {
  const genderOptions = [
    { value: 'male', label: 'পুরুষ' },
    { value: 'female', label: 'মহিলা' },
    { value: 'other', label: 'অন্যান্য' }
  ];

  // Use all 64 districts from districts data
  const districtOptions = allDistricts.map(district => ({
    value: district.en.toLowerCase().replace(/[^a-z0-9]/g, ''),
    label: district.bn
  }));

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6 shadow-brand">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="User" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="text-lg font-bengali font-semibold text-primary">ব্যক্তিগত তথ্য</h3>
            <p className="text-sm text-muted-foreground font-bengali">আপনার মৌলিক তথ্য প্রদান করুন</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="পূর্ণ নাম"
            type="text"
            placeholder="আপনার পূর্ণ নাম লিখুন"
            value={formData?.fullName}
            onChange={(e) => handleInputChange('fullName', e?.target?.value)}
            error={errors?.fullName}
            required
            className="font-bengali"
          />

          <Input
            label="বয়স"
            type="number"
            placeholder="বছর"
            value={formData?.age}
            onChange={(e) => handleInputChange('age', e?.target?.value)}
            error={errors?.age}
            required
            min="18"
            max="65"
          />

          <Select
            label="লিঙ্গ"
            placeholder="লিঙ্গ নির্বাচন করুন"
            options={genderOptions}
            value={formData?.gender}
            onChange={(value) => handleInputChange('gender', value)}
            error={errors?.gender}
            required
          />

          <Select
            label="জেলা"
            placeholder="আপনার জেলা নির্বাচন করুন"
            options={districtOptions}
            value={formData?.district}
            onChange={(value) => handleInputChange('district', value)}
            error={errors?.district}
            required
            searchable
          />

          <Input
            label="উপজেলা/থানা"
            type="text"
            placeholder="উপজেলা বা থানার নাম"
            value={formData?.upazila}
            onChange={(e) => handleInputChange('upazila', e?.target?.value)}
            error={errors?.upazila}
            required
            className="font-bengali"
          />

          <Input
            label="পূর্ণ ঠিকানা"
            type="text"
            placeholder="বিস্তারিত ঠিকানা"
            value={formData?.address}
            onChange={(e) => handleInputChange('address', e?.target?.value)}
            error={errors?.address}
            required
            className="font-bengali md:col-span-1"
          />
        </div>

        <div className="mt-6 p-4 bg-trust/5 rounded-lg border border-trust/20">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={16} color="var(--color-trust)" className="mt-0.5" />
            <div className="text-sm">
              <p className="font-bengali text-trust font-medium mb-1">গুরুত্বপূর্ণ তথ্য:</p>
              <ul className="font-bengali text-trust/80 space-y-1">
                <li>• রক্তদানের জন্য বয়স ১৮-৬৫ বছরের মধ্যে হতে হবে</li>
                <li>• সকল তথ্য সঠিক ও সত্য হতে হবে</li>
                <li>• আপনার তথ্য সম্পূর্ণ গোপনীয় রাখা হবে</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;