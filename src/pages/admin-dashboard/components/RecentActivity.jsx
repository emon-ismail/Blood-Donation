import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'donor_registration',
      user: 'মোহাম্মদ রহিম',
      action: 'নতুন রক্তদাতা নিবন্ধন করেছেন',
      details: 'A+ রক্তের গ্রুপ, ঢাকা',
      timestamp: new Date(Date.now() - 300000),
      icon: 'UserPlus',
      color: 'success'
    },
    {
      id: 2,
      type: 'blood_request',
      user: 'ফাতেমা খাতুন',
      action: 'জরুরি রক্তের অনুরোধ পোস্ট করেছেন',
      details: 'O- রক্তের প্রয়োজন, চট্টগ্রাম মেডিকেল',
      timestamp: new Date(Date.now() - 600000),
      icon: 'Heart',
      color: 'error'
    },
    {
      id: 3,
      type: 'donation_completed',
      user: 'আব্দুল করিম',
      action: 'সফলভাবে রক্তদান সম্পন্ন করেছেন',
      details: 'B+ রক্ত দান, ঢাকা মেডিকেল কলেজ',
      timestamp: new Date(Date.now() - 900000),
      icon: 'CheckCircle',
      color: 'success'
    },
    {
      id: 4,
      type: 'request_fulfilled',
      user: 'সিস্টেম',
      action: 'রক্তের অনুরোধ পূরণ হয়েছে',
      details: 'AB+ রক্ত সংগ্রহ সম্পন্ন, রাজশাহী',
      timestamp: new Date(Date.now() - 1200000),
      icon: 'Users',
      color: 'trust'
    },
    {
      id: 5,
      type: 'donor_verification',
      user: 'ডা. নাসির উদ্দিন',
      action: 'রক্তদাতা যাচাইকরণ সম্পন্ন',
      details: '৫ জন নতুন দাতা অনুমোদিত',
      timestamp: new Date(Date.now() - 1800000),
      icon: 'Shield',
      color: 'trust'
    },
    {
      id: 6,
      type: 'emergency_alert',
      user: 'সিস্টেম',
      action: 'জরুরি সতর্কতা পাঠানো হয়েছে',
      details: 'O- রক্তের তীব্র সংকট, সিলেট অঞ্চল',
      timestamp: new Date(Date.now() - 2400000),
      icon: 'AlertTriangle',
      color: 'warning'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      success: 'bg-success/10 text-success border-success/20',
      error: 'bg-error/10 text-error border-error/20',
      warning: 'bg-warning/10 text-warning border-warning/20',
      trust: 'bg-trust/10 text-trust border-trust/20',
      primary: 'bg-primary/10 text-primary border-primary/20'
    };
    return colors?.[color] || colors?.primary;
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} মিনিট আগে`;
    if (hours < 24) return `${hours} ঘন্টা আগে`;
    return `${days} দিন আগে`;
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-brand border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary font-bengali">সাম্প্রতিক কার্যক্রম</h3>
        <button className="text-sm text-primary hover:text-primary/80 font-bengali transition-colors duration-200">
          সব দেখুন
        </button>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities?.map((activity) => (
          <div key={activity?.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200">
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${getColorClasses(activity?.color)}`}>
              <Icon name={activity?.icon} size={18} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-text-primary font-bengali truncate">
                  {activity?.user}
                </p>
                <span className="text-xs text-muted-foreground font-bengali flex-shrink-0 ml-2">
                  {formatTimeAgo(activity?.timestamp)}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground font-bengali mb-1">
                {activity?.action}
              </p>
              
              <p className="text-xs text-muted-foreground font-bengali">
                {activity?.details}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Activity Summary */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-success">১২</div>
            <div className="text-xs text-muted-foreground font-bengali">নতুন দাতা</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-error">৮</div>
            <div className="text-xs text-muted-foreground font-bengali">জরুরি অনুরোধ</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-trust">১৫</div>
            <div className="text-xs text-muted-foreground font-bengali">সম্পন্ন দান</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-warning">৩</div>
            <div className="text-xs text-muted-foreground font-bengali">সতর্কতা</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;