import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UrgentRequestsTicker = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const urgentRequests = [
    {
      id: 1,
      bloodGroup: "O-",
      location: "ঢাকা মেডিকেল কলেজ হাসপাতাল",
      district: "ঢাকা",
      urgency: "জরুরি",
      timePosted: "১৫ মিনিট আগে",
      unitsNeeded: 3,
      patientAge: 45,
      contact: "+880 1712-345678"
    },
    {
      id: 2,
      bloodGroup: "A+",
      location: "চট্টগ্রাম মেডিকেল কলেজ",
      district: "চট্টগ্রাম",
      urgency: "অতি জরুরি",
      timePosted: "৩০ মিনিট আগে",
      unitsNeeded: 2,
      patientAge: 28,
      contact: "+880 1812-345678"
    },
    {
      id: 3,
      bloodGroup: "B+",
      location: "রাজশাহী মেডিকেল কলেজ",
      district: "রাজশাহী",
      urgency: "জরুরি",
      timePosted: "১ ঘন্টা আগে",
      unitsNeeded: 1,
      patientAge: 35,
      contact: "+880 1912-345678"
    },
    {
      id: 4,
      bloodGroup: "AB-",
      location: "সিলেট এম এ জি ওসমানী মেডিকেল কলেজ",
      district: "সিলেট",
      urgency: "জরুরি",
      timePosted: "২ ঘন্টা আগে",
      unitsNeeded: 2,
      patientAge: 52,
      contact: "+880 1612-345678"
    },
    {
      id: 5,
      bloodGroup: "O+",
      location: "বরিশাল শের-ই-বাংলা মেডিকেল কলেজ",
      district: "বরিশাল",
      urgency: "জরুরি",
      timePosted: "৩ ঘন্টা আগে",
      unitsNeeded: 4,
      patientAge: 38,
      contact: "+880 1512-345678"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % urgentRequests?.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [urgentRequests?.length]);

  const getBloodGroupColor = (bloodGroup) => {
    const colors = {
      'O+': 'bg-red-500',
      'O-': 'bg-red-700',
      'A+': 'bg-blue-500',
      'A-': 'bg-blue-700',
      'B+': 'bg-green-500',
      'B-': 'bg-green-700',
      'AB+': 'bg-purple-500',
      'AB-': 'bg-purple-700'
    };
    return colors?.[bloodGroup] || 'bg-gray-500';
  };

  const getUrgencyColor = (urgency) => {
    return urgency === 'অতি জরুরি' ? 'text-red-600' : 'text-orange-600';
  };

  return (
    <section className="bg-white py-16 border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-red-50 rounded-full px-4 py-2 mb-4">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-red-600 font-bengali">জরুরি অনুরোধসমূহ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary font-bengali mb-4">
            এখনই সাহায্য প্রয়োজন
          </h2>
          <p className="text-lg text-text-secondary font-bengali max-w-2xl mx-auto">
            সারাদেশে জরুরি রক্তের প্রয়োজন। আপনার একটি দান কারো জীবন বাঁচাতে পারে।
          </p>
        </div>

        {/* Ticker Container */}
        <div className="relative overflow-hidden bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 shadow-brand">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Icon name="AlertCircle" size={24} className="text-red-500 heartbeat" />
              <h3 className="text-xl font-bold text-text-primary font-bengali">লাইভ অনুরোধ</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentIndex((prev) => (prev - 1 + urgentRequests?.length) % urgentRequests?.length)}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-brand hover:shadow-brand-lg transition-all duration-300"
              >
                <Icon name="ChevronLeft" size={16} />
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % urgentRequests?.length)}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-brand hover:shadow-brand-lg transition-all duration-300"
              >
                <Icon name="ChevronRight" size={16} />
              </button>
            </div>
          </div>

          {/* Current Request Card */}
          <div className="bg-white rounded-xl p-6 shadow-brand transition-all duration-500">
            <div className="grid md:grid-cols-3 gap-6 items-center">
              {/* Blood Group & Urgency */}
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 ${getBloodGroupColor(urgentRequests?.[currentIndex]?.bloodGroup)} rounded-full flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">{urgentRequests?.[currentIndex]?.bloodGroup}</span>
                </div>
                <div>
                  <p className={`text-sm font-bold ${getUrgencyColor(urgentRequests?.[currentIndex]?.urgency)} font-bengali`}>
                    {urgentRequests?.[currentIndex]?.urgency}
                  </p>
                  <p className="text-xs text-text-secondary font-bengali">
                    {urgentRequests?.[currentIndex]?.timePosted}
                  </p>
                </div>
              </div>

              {/* Location & Details */}
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Icon name="MapPin" size={16} className="text-primary mt-1" />
                  <div>
                    <p className="font-medium text-text-primary font-bengali text-sm">
                      {urgentRequests?.[currentIndex]?.location}
                    </p>
                    <p className="text-xs text-text-secondary font-bengali">
                      {urgentRequests?.[currentIndex]?.district}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-xs text-text-secondary">
                  <div className="flex items-center space-x-1">
                    <Icon name="Droplets" size={12} />
                    <span className="font-bengali">{urgentRequests?.[currentIndex]?.unitsNeeded} ব্যাগ</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="User" size={12} />
                    <span className="font-bengali">{urgentRequests?.[currentIndex]?.patientAge} বছর</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="default"
                  size="sm"
                  iconName="Phone"
                  iconPosition="left"
                  className="flex-1"
                  onClick={() => window.open(`tel:${urgentRequests?.[currentIndex]?.contact}`)}
                >
                  <span className="font-bengali">কল করুন</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="MessageCircle"
                  iconPosition="left"
                  className="flex-1"
                  onClick={() => navigate('/blood-requests')}
                >
                  <span className="font-bengali">বিস্তারিত</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center space-x-2 mt-6">
            {urgentRequests?.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-primary w-6' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-red-50 rounded-xl p-4 text-center">
            <Icon name="AlertTriangle" size={24} className="text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">১৮</p>
            <p className="text-sm text-text-secondary font-bengali">জরুরি অনুরোধ</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <Icon name="Clock" size={24} className="text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">২৪/৭</p>
            <p className="text-sm text-text-secondary font-bengali">সেবা সময়</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <Icon name="MapPin" size={24} className="text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">৬৪</p>
            <p className="text-sm text-text-secondary font-bengali">জেলায় সেবা</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <Icon name="Users" size={24} className="text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">৯৮%</p>
            <p className="text-sm text-text-secondary font-bengali">সফল সংযোগ</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button
            variant="default"
            size="lg"
            iconName="Heart"
            iconPosition="left"
            className="px-8 py-4 text-lg shadow-brand hover:shadow-brand-lg transition-all duration-300"
            onClick={() => navigate('/blood-requests')}
          >
            <span className="font-bengali">সব অনুরোধ দেখুন</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default UrgentRequestsTicker;