import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const LocationSelector = ({ selectedLocation, onLocationSelect, isEmergencyMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

  const districts = [
    { value: 'dhaka', label: 'ঢাকা' },
    { value: 'chittagong', label: 'চট্টগ্রাম' },
    { value: 'sylhet', label: 'সিলেট' },
    { value: 'rajshahi', label: 'রাজশাহী' },
    { value: 'khulna', label: 'খুলনা' },
    { value: 'barisal', label: 'বরিশাল' },
    { value: 'rangpur', label: 'রংপুর' },
    { value: 'mymensingh', label: 'ময়মনসিংহ' }
  ];

  const upazilas = {
    dhaka: [
      { value: 'dhanmondi', label: 'ধানমন্ডি' },
      { value: 'gulshan', label: 'গুলশান' },
      { value: 'uttara', label: 'উত্তরা' },
      { value: 'mirpur', label: 'মিরপুর' },
      { value: 'wari', label: 'ওয়ারী' }
    ],
    chittagong: [
      { value: 'agrabad', label: 'আগ্রাবাদ' },
      { value: 'nasirabad', label: 'নাসিরাবাদ' },
      { value: 'pahartali', label: 'পাহাড়তলী' }
    ],
    sylhet: [
      { value: 'zindabazar', label: 'জিন্দাবাজার' },
      { value: 'ambarkhana', label: 'আম্বরখানা' }
    ]
  };

  useEffect(() => {
    if (selectedDistrict && upazilas?.[selectedDistrict]) {
      setFilteredUpazilas(upazilas?.[selectedDistrict]);
    } else {
      setFilteredUpazilas([]);
    }
  }, [selectedDistrict]);

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation?.getCurrentPosition(
        (position) => {
          const location = {
            type: 'current',
            lat: position?.coords?.latitude,
            lng: position?.coords?.longitude,
            name: 'বর্তমান অবস্থান'
          };
          onLocationSelect(location);
        },
        (error) => {
          console.error('Location access denied:', error);
        }
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-brand p-6 mb-6">
      <h2 className="text-xl font-bengali font-semibold text-text-primary mb-4">
        এলাকা নির্বাচন করুন
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
          <span className="font-bengali font-medium text-primary">
            বর্তমান অবস্থান ব্যবহার করুন
          </span>
        </button>
      </div>
      {/* Manual Location Selection */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary font-bengali mb-2">
              জেলা
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">জেলা নির্বাচন করুন</option>
              {districts.map((district) => (
                <option key={district.value} value={district.value}>
                  {district.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary font-bengali mb-2">
              উপজেলা/থানা
            </label>
            <select
              value={selectedLocation?.upazila || ''}
              onChange={(e) => {
                const value = e.target.value;
                const upazila = filteredUpazilas?.find(u => u?.value === value);
                if (upazila) {
                  onLocationSelect({
                    type: 'manual',
                    district: selectedDistrict,
                    upazila: value,
                    name: `${upazila?.label}, ${districts?.find(d => d?.value === selectedDistrict)?.label}`
                  });
                }
              }}
              disabled={!selectedDistrict}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">উপজেলা নির্বাচন করুন</option>
              {filteredUpazilas.map((upazila) => (
                <option key={upazila.value} value={upazila.value}>
                  {upazila.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-text-primary font-bengali mb-2">
            এলাকার নাম লিখুন
          </label>
          <input
            type="text"
            placeholder="যেমন: ধানমন্ডি ৩২, গুলশান ২, উত্তরা সেক্টর ৭"
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
          <p className="text-xs text-muted-foreground font-bengali mt-1">
            নির্দিষ্ট এলাকা বা রাস্তার নাম লিখুন
          </p>
        </div>
      </div>
      {/* Distance Radius */}
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h3 className="font-bengali font-medium text-text-primary mb-3">
          অনুসন্ধানের পরিসীমা
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
            <span className="text-sm font-bengali text-success">
              নির্বাচিত: {selectedLocation?.name}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;