import React from 'react';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const BloodInfoStep = ({ formData, setFormData, errors }) => {
  const bloodGroupOptions = [
    { value: 'A+', label: 'A+ (এ পজিটিভ)' },
    { value: 'A-', label: 'A- (এ নেগেটিভ)' },
    { value: 'B+', label: 'B+ (বি পজিটিভ)' },
    { value: 'B-', label: 'B- (বি নেগেটিভ)' },
    { value: 'AB+', label: 'AB+ (এবি পজিটিভ)' },
    { value: 'AB-', label: 'AB- (এবি নেগেটিভ)' },
    { value: 'O+', label: 'O+ (ও পজিটিভ)' },
    { value: 'O-', label: 'O- (ও নেগেটিভ)' }
  ];

  const availabilityOptions = [
    { value: 'available', label: 'সর্বদা উপলব্ধ' },
    { value: 'unavailable', label: 'বর্তমানে অনুপলব্ধ' },
    { value: 'recently_donated', label: 'সম্প্রতি রক্তদান করেছি' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const BloodGroupCard = ({ group, isSelected, onClick }) => (
    <div
      onClick={onClick}
      className={`
        p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 text-center
        ${isSelected 
          ? 'border-primary bg-primary/5 shadow-brand' 
          : 'border-border hover:border-primary/50 hover:bg-primary/5'
        }
      `}
    >
      <div className={`
        w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-xl font-bold
        ${isSelected ? 'bg-primary text-white' : 'bg-muted text-primary'}
      `}>
        {group?.value}
      </div>
      <p className={`
        text-sm font-bengali
        ${isSelected ? 'text-primary font-medium' : 'text-text-secondary'}
      `}>
        {group?.label?.split(' (')?.[1]?.replace(')', '')}
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6 shadow-brand">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Droplets" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="text-lg font-bengali font-semibold text-primary">রক্তের তথ্য</h3>
            <p className="text-sm text-muted-foreground font-bengali">আপনার রক্তের গ্রুপ ও উপলব্ধতা</p>
          </div>
        </div>

        {/* Blood Group Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-text-primary mb-4 font-bengali">
            রক্তের গ্রুপ নির্বাচন করুন *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {bloodGroupOptions?.map((group) => (
              <BloodGroupCard
                key={group?.value}
                group={group}
                isSelected={formData?.bloodGroup === group?.value}
                onClick={() => handleInputChange('bloodGroup', group?.value)}
              />
            ))}
          </div>
          {errors?.bloodGroup && (
            <p className="mt-2 text-sm text-destructive font-bengali">{errors?.bloodGroup}</p>
          )}
        </div>

        {/* Availability */}
        <div className="mb-6">
          <Select
            label="উপলব্ধতা"
            placeholder="কখন রক্তদান করতে পারবেন?"
            options={availabilityOptions}
            value={formData?.availability}
            onChange={(value) => handleInputChange('availability', value)}
            error={errors?.availability}
            required
          />
        </div>

        {/* Health Checkboxes */}
        <div className="space-y-4">
          <h4 className="text-md font-bengali font-semibold text-primary">স্বাস্থ্য সংক্রান্ত তথ্য</h4>
          
          <Checkbox
            label="আমি সুস্থ আছি এবং কোনো গুরুতর অসুখ নেই"
            checked={formData?.isHealthy}
            onChange={(e) => handleCheckboxChange('isHealthy', e?.target?.checked)}
            required
            error={errors?.isHealthy}
          />

          <Checkbox
            label="গত ৩ মাসে কোনো অপারেশন বা রক্তদান করিনি"
            checked={formData?.noRecentDonation}
            onChange={(e) => handleCheckboxChange('noRecentDonation', e?.target?.checked)}
            required
            error={errors?.noRecentDonation}
          />

          <Checkbox
            label="আমার ওজন ৫০ কেজির বেশি"
            checked={formData?.adequateWeight}
            onChange={(e) => handleCheckboxChange('adequateWeight', e?.target?.checked)}
            required
            error={errors?.adequateWeight}
          />

          <Checkbox
            label="আমি নিয়মিত ধূমপান বা মাদক সেবন করি না"
            checked={formData?.noSmokingDrugs}
            onChange={(e) => handleCheckboxChange('noSmokingDrugs', e?.target?.checked)}
            required
            error={errors?.noSmokingDrugs}
          />
        </div>

        <div className="mt-6 p-4 bg-warning/5 rounded-lg border border-warning/20">
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={16} color="var(--color-warning)" className="mt-0.5" />
            <div className="text-sm">
              <p className="font-bengali text-warning font-medium mb-1">রক্তদানের শর্তাবলী:</p>
              <ul className="font-bengali text-warning/80 space-y-1">
                <li>• রক্তদানের আগে ৮ ঘন্টা পূর্ণ ঘুম প্রয়োজন</li>
                <li>• রক্তদানের ২ ঘন্টা আগে পর্যাপ্ত খাবার খান</li>
                <li>• রক্তদানের পর ২৪ ঘন্টা ভারী কাজ এড়িয়ে চলুন</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodInfoStep;