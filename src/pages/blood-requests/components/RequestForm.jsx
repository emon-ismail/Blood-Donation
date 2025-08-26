import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import PlacesAutocomplete from '../../../components/ui/PlacesAutocomplete';

const RequestForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: '',
    unitsNeeded: '',
    hospital: '',
    location: '',
    contactPerson: '',
    contactPhone: '',
    urgencyLevel: 'standard',
    additionalInfo: '',
    requiredBy: ''
  });

  const [errors, setErrors] = useState({});

  const bloodGroups = [
    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
  ];

  const urgencyLevels = [
    { value: 'emergency', label: 'জরুরি (২৪ ঘন্টার মধ্যে)', color: 'text-red-600' },
    { value: 'urgent', label: 'অত্যাবশ্যক (৪৮ ঘন্টার মধ্যে)', color: 'text-amber-600' },
    { value: 'standard', label: 'সাধারণ (১ সপ্তাহের মধ্যে)', color: 'text-green-600' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.patientName?.trim()) {
      newErrors.patientName = 'রোগীর নাম আবশ্যক';
    }

    if (!formData?.bloodGroup) {
      newErrors.bloodGroup = 'রক্তের গ্রুপ নির্বাচন করুন';
    }

    if (!formData?.unitsNeeded || formData?.unitsNeeded < 1) {
      newErrors.unitsNeeded = 'রক্তের ব্যাগের সংখ্যা দিন';
    }

    if (!formData?.hospital?.trim()) {
      newErrors.hospital = 'হাসপাতালের নাম আবশ্যক';
    }

    if (!formData?.location?.trim()) {
      newErrors.location = 'এলাকার নাম আবশ্যক';
    }

    if (!formData?.contactPerson?.trim()) {
      newErrors.contactPerson = 'যোগাযোগকারীর নাম আবশ্যক';
    }

    if (!formData?.contactPhone?.trim()) {
      newErrors.contactPhone = 'ফোন নম্বর আবশ্যক';
    } else if (!/^(\+88)?01[3-9]\d{8}$/?.test(formData?.contactPhone)) {
      newErrors.contactPhone = 'সঠিক ফোন নম্বর দিন';
    }

    if (!formData?.requiredBy) {
      newErrors.requiredBy = 'কবে রক্তের প্রয়োজন তা উল্লেখ করুন';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-brand p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Heart" size={20} color="white" />
          </div>
          <div>
            <h2 className="text-xl font-bengali font-bold text-text-primary">রক্তের অনুরোধ করুন</h2>
            <p className="text-sm text-muted-foreground font-bengali">সম্প্রদায়ের কাছে সাহায্যের হাত বাড়ান</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <Icon name="X" size={20} />
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-bengali font-semibold text-text-primary flex items-center space-x-2">
            <Icon name="User" size={18} />
            <span>রোগীর তথ্য</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="রোগীর নাম"
              name="patientName"
              value={formData?.patientName}
              onChange={handleInputChange}
              placeholder="রোগীর পূর্ণ নাম লিখুন"
              error={errors?.patientName}
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary font-bengali">
                রক্তের গ্রুপ <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {bloodGroups?.map((group) => (
                  <button
                    key={group}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, bloodGroup: group }))}
                    className={`p-3 rounded-lg border-2 font-bold transition-all duration-200 ${
                      formData?.bloodGroup === group
                        ? 'border-primary bg-primary text-white' :'border-border hover:border-primary hover:bg-muted'
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>
              {errors?.bloodGroup && (
                <p className="text-sm text-red-500 font-bengali">{errors?.bloodGroup}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="রক্তের ব্যাগের সংখ্যা"
              name="unitsNeeded"
              type="number"
              min="1"
              max="10"
              value={formData?.unitsNeeded}
              onChange={handleInputChange}
              placeholder="কতটি ব্যাগ প্রয়োজন"
              error={errors?.unitsNeeded}
              required
            />

            <Input
              label="কবে রক্তের প্রয়োজন"
              name="requiredBy"
              type="datetime-local"
              value={formData?.requiredBy}
              onChange={handleInputChange}
              error={errors?.requiredBy}
              required
            />
          </div>
        </div>

        {/* Hospital Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-bengali font-semibold text-text-primary flex items-center space-x-2">
            <Icon name="MapPin" size={18} />
            <span>হাসপাতালের তথ্য</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary font-bengali">
                হাসপাতালের নাম <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                list="hospitals"
                value={formData?.hospital}
                onChange={(e) => setFormData(prev => ({ ...prev, hospital: e.target.value }))}
                placeholder="যেমন: চট্টগ্রাম মেডিকেল কলেজ হাসপাতাল"
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <datalist id="hospitals">
                <option value="ঢাকা মেডিকেল কলেজ হাসপাতাল" />
                <option value="চট্টগ্রাম মেডিকেল কলেজ হাসপাতাল" />
                <option value="সিলেট এমএজি ওসমানী মেডিকেল কলেজ হাসপাতাল" />
                <option value="রাজশাহী মেডিকেল কলেজ হাসপাতাল" />
                <option value="খুলনা মেডিকেল কলেজ হাসপাতাল" />
                <option value="বরিশাল শের-ই-বাংলা মেডিকেল কলেজ হাসপাতাল" />
                <option value="রংপুর মেডিকেল কলেজ হাসপাতাল" />
                <option value="ময়মনসিংহ মেডিকেল কলেজ হাসপাতাল" />
                <option value="কুমিল্লা মেডিকেল কলেজ হাসপাতাল" />
                <option value="দিনাজপুর মেডিকেল কলেজ হাসপাতাল" />
                <option value="বঙ্গবন্ধু শেখ মুজিব মেডিকেল বিশ্ববিদ্যালয়" />
                <option value="জাতীয় হৃদরোগ ইনস্টিটিউট ও হাসপাতাল" />
                <option value="জাতীয় ক্যান্সার গবেষণা ইনস্টিটিউট ও হাসপাতাল" />
                <option value="স্কয়ার হাসপাতাল" />
                <option value="ইউনাইটেড হাসপাতাল" />
                <option value="অ্যাপোলো হাসপাতাল ঢাকা" />
                <option value="লাবএইড হাসপাতাল" />
                <option value="এভারকেয়ার হাসপাতাল ঢাকা" />
                <option value="ইব্রাহিম কার্ডিয়াক হাসপাতাল" />
                <option value="ইবনে সিনা হাসপাতাল" />
                <option value="পপুলার হাসপাতাল" />
              </datalist>
              {errors?.hospital && (
                <p className="text-sm text-red-500 font-bengali">{errors?.hospital}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary font-bengali">
                এলাকা/জেলা <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                list="locations"
                value={formData?.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="যেমন: চট্টগ্রাম, ঢাকা, সিলেট"
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <datalist id="locations">
                <option value="ঢাকা" />
                <option value="চট্টগ্রাম" />
                <option value="সিলেট" />
                <option value="রাজশাহী" />
                <option value="খুলনা" />
                <option value="বরিশাল" />
                <option value="রংপুর" />
                <option value="ময়মনসিংহ" />
                <option value="কুমিল্লা" />
                <option value="ফরিদপুর" />
                <option value="গাজীপুর" />
                <option value="নারায়ণগঞ্জ" />
                <option value="টাঙ্গাইল" />
                <option value="নরসিংদী" />
                <option value="মানিকগঞ্জ" />
                <option value="মুন্শিগঞ্জ" />
                <option value="গোপালগঞ্জ" />
                <option value="মাদারীপুর" />
                <option value="শরীয়তপুর" />
                <option value="রাজবাড়ী" />
                <option value="কিশোরগঞ্জ" />
                <option value="নোয়াখালী" />
                <option value="ফেনী" />
                <option value="লক্ষ্মীপুর" />
                <option value="চাঁদপুর" />
                <option value="ব্রাহ্মণবাড়িয়া" />
                <option value="রাঙ্গামাটি" />
                <option value="বান্দরবান" />
                <option value="খাগড়াছড়ি" />
                <option value="কক্সবাজার" />
                <option value="হবিগঞ্জ" />
                <option value="মৌলভীবাজার" />
                <option value="সুনামগঞ্জ" />
                <option value="নাটোর" />
                <option value="নওগাঁ" />
                <option value="চাঁপাইনবাবগঞ্জ" />
                <option value="পাবনা" />
                <option value="সিরাজগঞ্জ" />
                <option value="বগুড়া" />
                <option value="জয়পুরহাট" />
                <option value="যশোর" />
                <option value="সাতক্ষীরা" />
                <option value="মেহেরপুর" />
                <option value="নড়াইল" />
                <option value="চুয়াডাঙ্গা" />
                <option value="কুষ্টিয়া" />
                <option value="মাগুরা" />
                <option value="ঝিনাইদহ" />
                <option value="বাগেরহাট" />
                <option value="পিরোজপুর" />
                <option value="ঝালকাঠি" />
                <option value="পটুয়াখালী" />
                <option value="বরগুনা" />
                <option value="ভোলা" />
                <option value="ঠাকুরগাঁও" />
                <option value="পঞ্চগড়" />
                <option value="নীলফামারী" />
                <option value="লালমনিরহাট" />
                <option value="কুড়িগ্রাম" />
                <option value="গাইবান্ধা" />
                <option value="দিনাজপুর" />
                <option value="নেত্রকোনা" />
                <option value="জামালপুর" />
                <option value="শেরপুর" />
              </datalist>
              {errors?.location && (
                <p className="text-sm text-red-500 font-bengali">{errors?.location}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary font-bengali">
              বিস্তারিত ঠিকানা <span className="text-red-500">*</span>
            </label>
            <textarea
              name="detailedAddress"
              value={formData?.detailedAddress || ''}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="যেমন: চট্টগ্রাম মেডিকেল কলেজ হাসপাতাল, আন্দরকিল্লা, চট্টগ্রাম - ৪০০০। রক্তদাতারা দয়া করে ওয়ার্ড নং ৫ এ যোগাযোগ করুন।"
            />
            <p className="text-xs text-muted-foreground font-bengali">
              রক্তদাতাদের সুবিধার জন্য সম্পূর্ণ ঠিকানা, ওয়ার্ড নম্বর এবং যোগাযোগের নির্দেশনা দিন
            </p>
            {errors?.detailedAddress && (
              <p className="text-sm text-red-500 font-bengali">{errors?.detailedAddress}</p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-bengali font-semibold text-text-primary flex items-center space-x-2">
            <Icon name="Phone" size={18} />
            <span>যোগাযোগের তথ্য</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="যোগাযোগকারীর নাম"
              name="contactPerson"
              value={formData?.contactPerson}
              onChange={handleInputChange}
              placeholder="যিনি যোগাযোগ রাখবেন"
              error={errors?.contactPerson}
              required
            />

            <Input
              label="ফোন নম্বর"
              name="contactPhone"
              type="tel"
              value={formData?.contactPhone}
              onChange={handleInputChange}
              placeholder="01XXXXXXXXX"
              error={errors?.contactPhone}
              required
            />
          </div>
        </div>

        {/* Urgency Level */}
        <div className="space-y-4">
          <h3 className="text-lg font-bengali font-semibold text-text-primary flex items-center space-x-2">
            <Icon name="Clock" size={18} />
            <span>জরুরি মাত্রা</span>
          </h3>
          
          <div className="space-y-3">
            {urgencyLevels?.map((level) => (
              <label key={level?.value} className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-muted transition-colors">
                <input
                  type="radio"
                  name="urgencyLevel"
                  value={level?.value}
                  checked={formData?.urgencyLevel === level?.value}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary"
                />
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={level?.value === 'emergency' ? 'AlertTriangle' : level?.value === 'urgent' ? 'Clock' : 'Calendar'} 
                    size={16} 
                    className={level?.color}
                  />
                  <span className={`font-bengali font-medium ${level?.color}`}>{level?.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-bengali font-semibold text-text-primary flex items-center space-x-2">
            <Icon name="FileText" size={18} />
            <span>অতিরিক্ত তথ্য</span>
          </h3>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary font-bengali">
              বিশেষ নির্দেশনা (ঐচ্ছিক)
            </label>
            <textarea
              name="additionalInfo"
              value={formData?.additionalInfo}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="রোগের ধরন, বিশেষ প্রয়োজনীয়তা বা অন্য কোনো গুরুত্বপূর্ণ তথ্য..."
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="submit"
            variant="default"
            size="lg"
            iconName="Send"
            iconPosition="left"
            fullWidth
            className="sm:flex-1"
          >
            <span className="font-bengali">অনুরোধ পাঠান</span>
          </Button>
          
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onCancel}
            className="sm:w-auto"
          >
            <span className="font-bengali">বাতিল</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RequestForm;