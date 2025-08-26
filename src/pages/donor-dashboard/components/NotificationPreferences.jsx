import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const NotificationPreferences = ({ preferences, onUpdatePreferences }) => {
  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [isUpdating, setIsUpdating] = useState(false);

  const notificationTypes = [
    {
      id: 'emergency',
      title: 'জরুরি অনুরোধ',
      description: 'আপনার এলাকায় জরুরি রক্তের প্রয়োজন হলে তাৎক্ষণিক বিজ্ঞপ্তি পান',
      icon: 'Zap',
      color: 'text-error',
      bgColor: 'bg-error/10'
    },
    {
      id: 'scheduled',
      title: 'নির্ধারিত রক্তদান',
      description: 'আপনার পরবর্তী রক্তদানের তারিখ এবং রিমাইন্ডার',
      icon: 'Calendar',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      id: 'drives',
      title: 'রক্তদান ক্যাম্প',
      description: 'আপনার এলাকার রক্তদান ক্যাম্প এবং কমিউনিটি ইভেন্ট',
      icon: 'Users',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      id: 'health',
      title: 'স্বাস্থ্য টিপস',
      description: 'রক্তদাতাদের জন্য স্বাস্থ্য পরামর্শ এবং যত্নের টিপস',
      icon: 'Heart',
      color: 'text-trust',
      bgColor: 'bg-trust/10'
    },
    {
      id: 'achievements',
      title: 'অর্জন ও ব্যাজ',
      description: 'নতুন ব্যাজ অর্জন এবং মাইলস্টোন সম্পূর্ণ হওয়ার বিজ্ঞপ্তি',
      icon: 'Award',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      id: 'community',
      title: 'কমিউনিটি আপডেট',
      description: 'সফল রক্তদান, ধন্যবাদ বার্তা এবং কমিউনিটি খবর',
      icon: 'MessageCircle',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    }
  ];

  const deliveryMethods = [
    {
      id: 'push',
      title: 'পুশ নোটিফিকেশন',
      description: 'মোবাইল অ্যাপে তাৎক্ষণিক বিজ্ঞপ্তি',
      icon: 'Smartphone'
    },
    {
      id: 'sms',
      title: 'SMS',
      description: 'মোবাইল নম্বরে টেক্সট মেসেজ',
      icon: 'MessageSquare'
    },
    {
      id: 'email',
      title: 'ইমেইল',
      description: 'ইমেইল ঠিকানায় বিস্তারিত তথ্য',
      icon: 'Mail'
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      description: 'WhatsApp এ মেসেজ এবং আপডেট',
      icon: 'MessageCircle'
    }
  ];

  const timeSlots = [
    { id: 'morning', label: 'সকাল (৬:০০ - ১২:০০)', value: '6-12' },
    { id: 'afternoon', label: 'দুপুর (১২:০০ - ১৮:০০)', value: '12-18' },
    { id: 'evening', label: 'সন্ধ্যা (১৮:০০ - ২২:০০)', value: '18-22' },
    { id: 'anytime', label: 'যেকোনো সময়', value: 'anytime' }
  ];

  const handleToggleNotification = (type) => {
    setLocalPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev?.notifications,
        [type]: !prev?.notifications?.[type]
      }
    }));
  };

  const handleToggleDeliveryMethod = (method) => {
    setLocalPreferences(prev => ({
      ...prev,
      deliveryMethods: {
        ...prev?.deliveryMethods,
        [method]: !prev?.deliveryMethods?.[method]
      }
    }));
  };

  const handleTimeSlotChange = (slot) => {
    setLocalPreferences(prev => ({
      ...prev,
      preferredTime: slot
    }));
  };

  const handleSavePreferences = async () => {
    setIsUpdating(true);
    try {
      await onUpdatePreferences(localPreferences);
      // Show success message
    } catch (error) {
      console.error('Failed to update preferences:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-brand p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bengali font-bold text-text-primary mb-2">
            বিজ্ঞপ্তি পছন্দসমূহ
          </h3>
          <p className="text-text-secondary font-bengali text-sm">
            আপনার পছন্দ অনুযায়ী বিজ্ঞপ্তি কাস্টমাইজ করুন
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${localPreferences?.enabled ? 'bg-success' : 'bg-error'}`}></div>
          <span className="text-sm font-bengali text-text-secondary">
            {localPreferences?.enabled ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
          </span>
        </div>
      </div>
      {/* Master Toggle */}
      <div className="bg-muted rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Bell" size={20} className="text-primary" />
            </div>
            <div>
              <h4 className="font-bengali font-semibold text-text-primary">
                সকল বিজ্ঞপ্তি
              </h4>
              <p className="text-sm font-bengali text-text-secondary">
                সকল ধরনের বিজ্ঞপ্তি চালু/বন্ধ করুন
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={localPreferences?.enabled}
              onChange={(e) => setLocalPreferences(prev => ({ ...prev, enabled: e?.target?.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>
      {/* Notification Types */}
      <div className="mb-8">
        <h4 className="font-bengali font-semibold text-text-primary mb-4">
          বিজ্ঞপ্তির ধরন
        </h4>
        <div className="space-y-4">
          {notificationTypes?.map((type) => (
            <div
              key={type?.id}
              className={`border border-border rounded-lg p-4 transition-all duration-300 ${
                localPreferences?.notifications?.[type?.id] ? 'bg-white shadow-brand' : 'bg-muted/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className={`w-10 h-10 ${type?.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon name={type?.icon} size={20} className={type?.color} />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bengali font-medium text-text-primary mb-1">
                      {type?.title}
                    </h5>
                    <p className="text-sm font-bengali text-text-secondary">
                      {type?.description}
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localPreferences?.notifications?.[type?.id]}
                    onChange={() => handleToggleNotification(type?.id)}
                    disabled={!localPreferences?.enabled}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-disabled:opacity-50"></div>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Delivery Methods */}
      <div className="mb-8">
        <h4 className="font-bengali font-semibold text-text-primary mb-4">
          বিজ্ঞপ্তি পাঠানোর মাধ্যম
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deliveryMethods?.map((method) => (
            <div
              key={method?.id}
              className={`border border-border rounded-lg p-4 cursor-pointer transition-all duration-300 ${
                localPreferences?.deliveryMethods?.[method?.id] 
                  ? 'bg-primary/5 border-primary/20' :'hover:bg-muted/50'
              }`}
              onClick={() => handleToggleDeliveryMethod(method?.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    localPreferences?.deliveryMethods?.[method?.id] 
                      ? 'bg-primary/10' :'bg-muted'
                  }`}>
                    <Icon 
                      name={method?.icon} 
                      size={16} 
                      className={localPreferences?.deliveryMethods?.[method?.id] ? 'text-primary' : 'text-text-secondary'} 
                    />
                  </div>
                  <div>
                    <h5 className="font-bengali font-medium text-text-primary">
                      {method?.title}
                    </h5>
                    <p className="text-xs font-bengali text-text-secondary">
                      {method?.description}
                    </p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  localPreferences?.deliveryMethods?.[method?.id]
                    ? 'border-primary bg-primary' :'border-border'
                }`}>
                  {localPreferences?.deliveryMethods?.[method?.id] && (
                    <Icon name="Check" size={12} color="white" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Preferred Time */}
      <div className="mb-8">
        <h4 className="font-bengali font-semibold text-text-primary mb-4">
          পছন্দের সময়
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {timeSlots?.map((slot) => (
            <label
              key={slot?.id}
              className={`flex items-center space-x-3 p-3 border border-border rounded-lg cursor-pointer transition-all duration-300 ${
                localPreferences?.preferredTime === slot?.value
                  ? 'bg-primary/5 border-primary/20' :'hover:bg-muted/50'
              }`}
            >
              <input
                type="radio"
                name="timeSlot"
                value={slot?.value}
                checked={localPreferences?.preferredTime === slot?.value}
                onChange={() => handleTimeSlotChange(slot?.value)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                localPreferences?.preferredTime === slot?.value
                  ? 'border-primary bg-primary' :'border-border'
              }`}>
                {localPreferences?.preferredTime === slot?.value && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <span className="font-bengali text-sm text-text-primary">
                {slot?.label}
              </span>
            </label>
          ))}
        </div>
      </div>
      {/* Save Button */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setLocalPreferences(preferences)}
          className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
        >
          <span className="font-bengali">বাতিল</span>
        </button>
        <button
          onClick={handleSavePreferences}
          disabled={isUpdating}
          className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {isUpdating ? (
            <Icon name="Loader2" size={16} className="animate-spin" />
          ) : (
            <Icon name="Save" size={16} />
          )}
          <span className="font-bengali">সংরক্ষণ করুন</span>
        </button>
      </div>
    </div>
  );
};

export default NotificationPreferences;