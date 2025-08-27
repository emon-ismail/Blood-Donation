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

        {/* Auto Location Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={async () => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    try {
                      // Get location details from coordinates
                      const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
                      const data = await response.json();
                      
                      const district = data.city || data.locality || data.principalSubdivision || '';
                      const upazila = data.localityInfo?.administrative?.[3]?.name || data.locality || '';
                      const address = `${data.localityInfo?.informative?.[0]?.name || ''}, ${upazila}, ${district}`.replace(/^,\s*|,\s*$/g, '');
                      
                      // District mapping for consistency
                      const districtMapping = {
                        'chattogram': 'chittagong',
                        'chittagong': 'chittagong',
                        'dhaka': 'dhaka',
                        'sylhet': 'sylhet'
                      };
                      
                      const normalizedDistrict = districtMapping[district.toLowerCase()] || district.toLowerCase().replace(/[^a-z0-9]/g, '');
                      
                      // Auto-fill all location fields
                      handleInputChange('district', normalizedDistrict);
                      handleInputChange('upazila', upazila);
                      handleInputChange('address', address);
                      handleInputChange('latitude', lat);
                      handleInputChange('longitude', lng);
                      
                      alert(`✅ অবস্থান সংরক্ষিত হয়েছে!\n📍 জেলা: ${district}\n📍 উপজেলা: ${upazila}\n📍 ঠিকানা: ${address}`);
                    } catch (error) {
                      console.error('Location details error:', error);
                      // Save coordinates even if reverse geocoding fails
                      handleInputChange('latitude', lat);
                      handleInputChange('longitude', lng);
                      alert('GPS অবস্থান সংরক্ষিত হয়েছে! অনুগ্রহ করে জেলা ও উপজেলা manually নির্বাচন করুন।');
                    }
                  },
                  (error) => {
                    console.error('Location access error:', error);
                    alert('অবস্থান অ্যাক্সেস করতে পারছি না। অনুগ্রহ করে browser এ location permission দিন।');
                  }
                );
              } else {
                alert('আপনার browser geolocation support করে না।');
              }
            }}
            className="w-full flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all duration-300 font-bengali font-semibold"
          >
            <span className="text-2xl">📍</span>
            <span>বর্তমান অবস্থান সংরক্ষণ করুন</span>
            <span className="text-sm opacity-80">(জেলা, উপজেলা, ঠিকানা auto-fill হবে)</span>
          </button>
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
            placeholder="বিস্তারিত ঠিকানা (রাস্তা, এলাকা, ল্যান্ডমার্ক)"
            value={formData?.address}
            onChange={(e) => handleInputChange('address', e?.target?.value)}
            error={errors?.address}
            required
            className="font-bengali md:col-span-2"
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