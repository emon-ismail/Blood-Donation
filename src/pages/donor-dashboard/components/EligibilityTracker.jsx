import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const EligibilityTracker = ({ eligibilityData }) => {
  const [showHealthTips, setShowHealthTips] = useState(false);

  const healthTips = [
    {
      id: 1,
      title: "পানি পান করুন",
      description: "দৈনিক ৮-১০ গ্লাস পানি পান করুন রক্তের পরিমাণ ঠিক রাখতে",
      icon: "Droplets",
      color: "text-trust"
    },
    {
      id: 2,
      title: "আয়রন সমৃদ্ধ খাবার",
      description: "কলিজা, পালং শাক, ডাল খান হিমোগ্লোবিন বৃদ্ধির জন্য",
      icon: "Apple",
      color: "text-secondary"
    },
    {
      id: 3,
      title: "নিয়মিত ব্যায়াম",
      description: "সপ্তাহে ৩-৪ দিন হালকা ব্যায়াম করুন রক্ত চলাচল বৃদ্ধির জন্য",
      icon: "Activity",
      color: "text-warning"
    },
    {
      id: 4,
      title: "পর্যাপ্ত ঘুম",
      description: "দৈনিক ৭-৮ ঘন্টা ঘুমান শরীরের পুনরুদ্ধারের জন্য",
      icon: "Moon",
      color: "text-primary"
    }
  ];

  const getEligibilityStatus = () => {
    if (eligibilityData?.daysUntilEligible <= 0) {
      return {
        status: 'eligible',
        message: 'আপনি রক্তদানের জন্য যোগ্য',
        color: 'text-success',
        bgColor: 'bg-success/10',
        icon: 'CheckCircle'
      };
    } else if (eligibilityData?.daysUntilEligible <= 7) {
      return {
        status: 'soon',
        message: 'শীঘ্রই রক্তদানের জন্য যোগ্য হবেন',
        color: 'text-warning',
        bgColor: 'bg-warning/10',
        icon: 'Clock'
      };
    } else {
      return {
        status: 'waiting',
        message: 'রক্তদানের জন্য অপেক্ষা করুন',
        color: 'text-text-secondary',
        bgColor: 'bg-muted',
        icon: 'Calendar'
      };
    }
  };

  const eligibilityStatus = getEligibilityStatus();
  const progressPercentage = Math.max(0, 100 - (eligibilityData?.daysUntilEligible / 90) * 100);

  return (
    <div className="bg-white rounded-xl shadow-brand p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bengali font-bold text-text-primary mb-2">
            যোগ্যতা ট্র্যাকার
          </h3>
          <p className="text-text-secondary font-bengali text-sm">
            পরবর্তী রক্তদানের জন্য প্রস্তুতি
          </p>
        </div>
        <button
          onClick={() => setShowHealthTips(!showHealthTips)}
          className="flex items-center space-x-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
        >
          <Icon name="Heart" size={16} />
          <span className="font-bengali text-sm">স্বাস্থ্য টিপস</span>
        </button>
      </div>
      {/* Eligibility Status Card */}
      <div className={`${eligibilityStatus?.bgColor} border border-opacity-20 rounded-lg p-6 mb-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 ${eligibilityStatus?.bgColor} rounded-full flex items-center justify-center`}>
              <Icon name={eligibilityStatus?.icon} size={24} className={eligibilityStatus?.color} />
            </div>
            <div>
              <h4 className={`font-bengali font-semibold ${eligibilityStatus?.color}`}>
                {eligibilityStatus?.message}
              </h4>
              <p className="text-text-secondary font-bengali text-sm">
                {eligibilityData?.daysUntilEligible > 0 
                  ? `${eligibilityData?.daysUntilEligible} দিন বাকি`
                  : 'এখনই দান করতে পারেন'
                }
              </p>
            </div>
          </div>
          
          {eligibilityData?.daysUntilEligible > 0 && (
            <div className="text-right">
              <p className="text-2xl font-bold text-text-primary">
                {eligibilityData?.daysUntilEligible}
              </p>
              <p className="text-sm font-bengali text-text-secondary">দিন</p>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bengali text-text-secondary">অগ্রগতি</span>
            <span className="text-sm font-medium text-text-primary">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-border rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                eligibilityStatus?.status === 'eligible' ? 'bg-success' : 
                eligibilityStatus?.status === 'soon' ? 'bg-warning' : 'bg-primary'
              }`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Next Donation Date */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={16} className="text-text-secondary" />
            <span className="font-bengali text-sm text-text-secondary">পরবর্তী দানের তারিখ:</span>
          </div>
          <span className="font-bengali font-medium text-text-primary">
            {eligibilityData?.daysUntilEligible <= 0 ? 
              'এখনই দান করতে পারেন' : 
              eligibilityData.nextEligibleDate?.toLocaleDateString('bn-BD', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            }
          </span>
        </div>
      </div>
      {/* Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Activity" size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-bengali text-text-secondary">শেষ চেকআপ</p>
              <p className="font-bengali font-medium text-text-primary">
                {eligibilityData?.lastHealthCheck}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Icon name="Droplets" size={20} className="text-secondary" />
            </div>
            <div>
              <p className="text-sm font-bengali text-text-secondary">হিমোগ্লোবিন</p>
              <p className="font-medium text-text-primary">
                {eligibilityData?.hemoglobin} g/dL
              </p>
            </div>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-trust/10 rounded-lg flex items-center justify-center">
              <Icon name="Weight" size={20} className="text-trust" />
            </div>
            <div>
              <p className="text-sm font-bengali text-text-secondary">ওজন</p>
              <p className="font-medium text-text-primary">
                {eligibilityData?.weight} কেজি
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Health Tips Section */}
      {showHealthTips && (
        <div className="border-t border-border pt-6">
          <h4 className="font-bengali font-semibold text-text-primary mb-4">
            স্বাস্থ্য টিপস ও পরামর্শ
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {healthTips?.map((tip) => (
              <div key={tip?.id} className="bg-muted rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <Icon name={tip?.icon} size={16} className={tip?.color} />
                  </div>
                  <div>
                    <h5 className="font-bengali font-medium text-text-primary mb-1">
                      {tip?.title}
                    </h5>
                    <p className="text-sm font-bengali text-text-secondary">
                      {tip?.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mt-6">
        {eligibilityData?.daysUntilEligible <= 0 ? (
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            <Icon name="Heart" size={16} />
            <span className="font-bengali">রক্তদানের জন্য প্রস্তুত</span>
          </button>
        ) : (
          <button className="flex items-center space-x-2 px-4 py-2 bg-muted text-text-primary rounded-lg hover:bg-muted/80 transition-colors">
            <Icon name="Bell" size={16} />
            <span className="font-bengali">রিমাইন্ডার সেট করুন</span>
          </button>
        )}
        
        <button className="flex items-center space-x-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors">
          <Icon name="Calendar" size={16} />
          <span className="font-bengali">অ্যাপয়েন্টমেন্ট বুক করুন</span>
        </button>
        
        <button className="flex items-center space-x-2 px-4 py-2 bg-trust text-white rounded-lg hover:bg-trust/90 transition-colors">
          <Icon name="FileText" size={16} />
          <span className="font-bengali">স্বাস্থ্য রিপোর্ট</span>
        </button>
      </div>
    </div>
  );
};

export default EligibilityTracker;