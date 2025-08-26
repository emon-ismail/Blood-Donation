import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { allDistricts } from '../../../data/districts';
import { getUpazilasByDistrict } from '../../../data/upazilas';
import { useLanguage } from '../../../contexts/LanguageContext';

const LocationSelector = ({ selectedLocation, onLocationSelect, isEmergencyMode }) => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

  // Use all 64 districts from districts data - same format as registration
  const districts = allDistricts.map(district => ({
    value: district.en.toLowerCase().replace(/[^a-z0-9]/g, ''),
    label: language === 'bn' ? district.bn : district.en
  }));

  useEffect(() => {
    if (selectedDistrict) {
      const upazilaNames = getUpazilasByDistrict(selectedDistrict, language);
      const upazilaOptions = upazilaNames.map(name => ({
        value: name.toLowerCase().replace(/[^a-z0-9]/g, ''),
        label: name
      }));
      setFilteredUpazilas(upazilaOptions);
    } else {
      setFilteredUpazilas([]);
    }
  }, [selectedDistrict, language]);

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation?.getCurrentPosition(
        async (position) => {
          const lat = position?.coords?.latitude;
          const lng = position?.coords?.longitude;
          
          try {
            // Reverse geocoding to get district name
            const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
            const data = await response.json();
            
            const rawDistrict = data.city || data.locality || data.principalSubdivision || 'Unknown';
            
            // Map common district name variations
            const districtMapping = {
              'chattogram': 'chittagong',
              'chittagong': 'chittagong',
              'dhaka': 'dhaka',
              'sylhet': 'sylhet',
              'rajshahi': 'rajshahi',
              'khulna': 'khulna',
              'barishal': 'barishal',
              'rangpur': 'rangpur',
              'mymensingh': 'mymensingh'
            };
            
            const normalizedDistrict = districtMapping[rawDistrict.toLowerCase()] || rawDistrict.toLowerCase().replace(/[^a-z0-9]/g, '');
            
            const location = {
              type: 'current',
              lat: lat,
              lng: lng,
              district: normalizedDistrict,
              name: `বর্তমান অবস্থান (${rawDistrict})`
            };
            
            onLocationSelect(location);
          } catch (error) {
            console.error('Failed to get location details:', error);
            // Fallback without district info
            const location = {
              type: 'current',
              lat: lat,
              lng: lng,
              name: 'বর্তমান অবস্থান'
            };
            onLocationSelect(location);
          }
        },
        (error) => {
          console.error('Location access denied:', error);
          alert('অবস্থান অ্যাক্সেস করতে পারছি না। অনুগ্রহ করে ব্রাউজারে location permission দিন।');
        }
      );
    } else {
      alert('আপনার ব্রাউজার geolocation সাপোর্ট করে না।');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-brand p-6 mb-6">
      <h2 className={`text-xl font-semibold text-text-primary mb-4 ${language === 'bn' ? 'font-bengali' : ''}`}>
        {language === 'bn' ? 'এলাকা নির্বাচন করুন' : 'Select Location'}
      </h2>
      {/* Current Location Button */}
      <div className="mb-4">
        <button
          onClick={handleCurrentLocation}
          className={`w-full flex items-center justify-center space-x-3 p-4 rounded-lg border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-300 ${
            isEmergencyMode ? 'min-h-[60px]' : 'min-h-[50px]'
          }`}
        >
          <Icon name="MapPin" size={20} color="var(--color-primary)" />
          <span className={`font-medium text-primary ${language === 'bn' ? 'font-bengali' : ''}`}>
            {language === 'bn' ? 'বর্তমান অবস্থান ব্যবহার করুন' : 'Use Current Location'}
          </span>
        </button>
      </div>
      {/* Manual Location Selection */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium text-text-primary mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {language === 'bn' ? 'জেলা' : 'District'}
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedDistrict(value);
                if (value) {
                  const districtObj = districts?.find(d => d?.value === value);
                  onLocationSelect({
                    type: 'manual',
                    district: value,
                    name: districtObj?.label
                  });
                } else {
                  onLocationSelect(null);
                }
              }}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">{language === 'bn' ? 'জেলা নির্বাচন করুন' : 'Select District'}</option>
              {districts.map((district, index) => (
                <option key={`district-${district.value || index}`} value={district.value}>
                  {district.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium text-text-primary mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {language === 'bn' ? 'উপজেলা/থানা' : 'Upazila/Thana'}
            </label>
            <select
              value={selectedLocation?.upazila || ''}
              onChange={(e) => {
                const value = e.target.value;
                const upazila = filteredUpazilas?.find(u => u?.value === value);
                if (upazila) {
                  const districtObj = districts?.find(d => d?.value === selectedDistrict);
                  onLocationSelect({
                    type: 'manual',
                    district: selectedDistrict,
                    upazila: upazila?.label,
                    name: `${upazila?.label}, ${districtObj?.label}`
                  });
                }
              }}
              disabled={!selectedDistrict}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">{language === 'bn' ? 'উপজেলা নির্বাচন করুন' : 'Select Upazila'}</option>
              {filteredUpazilas.map((upazila, index) => (
                <option key={`upazila-${upazila.value || index}`} value={upazila.value}>
                  {upazila.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div>
          <label className={`block text-sm font-medium text-text-primary mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
            {language === 'bn' ? 'এলাকার নাম লিখুন' : 'Enter Area Name'}
          </label>
          <input
            type="text"
            placeholder={language === 'bn' ? 'যেমন: ধানমন্ডি ৩২, গুলশান ২, উত্তরা সেক্টর ৭' : 'e.g: Dhanmondi 32, Gulshan 2, Uttara Sector 7'}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value) {
                onLocationSelect({
                  type: 'search',
                  name: e.target.value,
                  district: selectedDistrict
                });
              }
            }}
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <p className={`text-xs text-muted-foreground mt-1 ${language === 'bn' ? 'font-bengali' : ''}`}>
            {language === 'bn' ? 'নির্দিষ্ট এলাকা বা রাস্তার নাম লিখুন' : 'Enter specific area or street name'}
          </p>
        </div>
      </div>
      {/* Distance Radius */}
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h3 className={`font-medium text-text-primary mb-3 ${language === 'bn' ? 'font-bengali' : ''}`}>
          {language === 'bn' ? 'অনুসন্ধানের পরিসীমা' : 'Search Radius'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 5, label: '৫ কিমি' },
            { value: 10, label: '১০ কিমি' },
            { value: 20, label: '২০ কিমি' },
            { value: 50, label: '৫০ কিমি' }
          ]?.map((radius) => (
            <button
              key={radius?.value}
              onClick={() => {
                if (selectedLocation) {
                  onLocationSelect({
                    ...selectedLocation,
                    radius: radius.value
                  });
                }
              }}
              className={`px-4 py-2 rounded-lg border transition-all duration-300 text-sm font-bengali ${
                selectedLocation?.radius === radius.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary hover:bg-primary/10'
              }`}
            >
              {radius?.label}
            </button>
          ))}
        </div>
      </div>
      {selectedLocation && (
        <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} color="var(--color-success)" />
            <span className={`text-sm text-success ${language === 'bn' ? 'font-bengali' : ''}`}>
              {language === 'bn' ? 'নির্বাচিত:' : 'Selected:'} {selectedLocation?.name}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;