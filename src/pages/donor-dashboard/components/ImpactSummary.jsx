import React from 'react';
import Icon from '../../../components/AppIcon';

const ImpactSummary = ({ donorData }) => {
  const impactStats = [
    {
      id: 1,
      title: "জীবন বাঁচানো হয়েছে",
      value: donorData?.livesSaved,
      icon: "Heart",
      color: "text-primary",
      bgColor: "bg-primary/10",
      description: "আপনার রক্তদানে সম্ভাব্য জীবন রক্ষা"
    },
    {
      id: 2,
      title: "মোট রক্তদান",
      value: donorData?.totalDonations,
      icon: "Droplets",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      description: "সফল রক্তদানের সংখ্যা"
    },
    {
      id: 3,
      title: "কমিউনিটি র‍্যাঙ্কিং",
      value: `#${donorData?.communityRank}`,
      icon: "Trophy",
      color: "text-warning",
      bgColor: "bg-warning/10",
      description: "জেলায় আপনার অবস্থান"
    },
    {
      id: 4,
      title: "পরবর্তী দান",
      value: `${donorData?.nextDonationDays} দিন`,
      icon: "Calendar",
      color: "text-trust",
      bgColor: "bg-trust/10",
      description: "পরবর্তী রক্তদানের জন্য অপেক্ষা"
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-brand p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bengali font-bold text-text-primary mb-2">
            আপনার প্রভাব সারসংক্ষেপ
          </h2>
          <p className="text-text-secondary font-bengali">
            {donorData?.name} - {donorData?.bloodGroup} গ্রুপ
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <Icon name="Award" size={24} color="white" />
          </div>
          <div className="text-right">
            <p className="text-sm font-bengali text-text-secondary">যাচাইকৃত দাতা</p>
            <div className="flex items-center space-x-1">
              <Icon name="CheckCircle" size={16} color="var(--color-success)" />
              <span className="text-xs font-bengali text-success">সক্রিয়</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {impactStats?.map((stat) => (
          <div
            key={stat?.id}
            className="relative overflow-hidden rounded-lg border border-border p-4 hover:shadow-brand transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-bengali text-text-secondary mb-1">
                  {stat?.title}
                </p>
                <p className={`text-2xl font-bold ${stat?.color} mb-2`}>
                  {stat?.value}
                </p>
                <p className="text-xs font-bengali text-text-secondary">
                  {stat?.description}
                </p>
              </div>
              <div className={`w-10 h-10 ${stat?.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon name={stat?.icon} size={20} className={stat?.color} />
              </div>
            </div>
            
            {/* Progress indicator for next donation */}
            {stat?.id === 4 && (
              <div className="mt-3">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-trust h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(0, 100 - (donorData?.nextDonationDays / 90) * 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Quick Actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200">
          <Icon name="Heart" size={16} />
          <span className="font-bengali text-sm">জরুরি অনুরোধ দেখুন</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors duration-200">
          <Icon name="UserPlus" size={16} />
          <span className="font-bengali text-sm">বন্ধুদের আমন্ত্রণ জানান</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 bg-muted text-text-primary rounded-lg hover:bg-muted/80 transition-colors duration-200">
          <Icon name="Share2" size={16} />
          <span className="font-bengali text-sm">প্রভাব শেয়ার করুন</span>
        </button>
      </div>
    </div>
  );
};

export default ImpactSummary;