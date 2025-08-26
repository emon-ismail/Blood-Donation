import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ImpactDashboard = () => {
  const navigate = useNavigate();
  const [animatedStats, setAnimatedStats] = useState({
    totalDonors: 0,
    livesSaved: 0,
    districtsCovered: 0,
    successfulConnections: 0
  });

  const finalStats = {
    totalDonors: 1247,
    livesSaved: 523,
    districtsCovered: 64,
    successfulConnections: 98
  };

  useEffect(() => {
    const animateStats = () => {
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setAnimatedStats({
          totalDonors: Math.floor(finalStats?.totalDonors * progress),
          livesSaved: Math.floor(finalStats?.livesSaved * progress),
          districtsCovered: Math.floor(finalStats?.districtsCovered * progress),
          successfulConnections: Math.floor(finalStats?.successfulConnections * progress)
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setAnimatedStats(finalStats);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    };

    const timer = setTimeout(animateStats, 500);
    return () => clearTimeout(timer);
  }, []);

  const impactMetrics = [
    {
      id: 1,
      title: "নিবন্ধিত রক্তদাতা",
      value: animatedStats?.totalDonors,
      suffix: "+",
      icon: "Users",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "সক্রিয় ও যাচাইকৃত দাতা"
    },
    {
      id: 2,
      title: "জীবন বাঁচানো হয়েছে",
      value: animatedStats?.livesSaved,
      suffix: "+",
      icon: "Heart",
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "সফল রক্তদানের মাধ্যমে"
    },
    {
      id: 3,
      title: "জেলায় সেবা",
      value: animatedStats?.districtsCovered,
      suffix: "/৬৪",
      icon: "MapPin",
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "সারাদেশে নেটওয়ার্ক"
    },
    {
      id: 4,
      title: "সফল সংযোগ",
      value: animatedStats?.successfulConnections,
      suffix: "%",
      icon: "TrendingUp",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "অনুরোধ পূরণের হার"
    }
  ];

  const monthlyData = [
    { month: "জানুয়ারি", donations: 45, requests: 52 },
    { month: "ফেব্রুয়ারি", donations: 52, requests: 48 },
    { month: "মার্চ", donations: 61, requests: 65 },
    { month: "এপ্রিল", donations: 58, requests: 59 },
    { month: "মে", donations: 67, requests: 71 },
    { month: "জুন", donations: 73, requests: 68 }
  ];

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
            <Icon name="BarChart3" size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary font-bengali">প্রভাব ড্যাশবোর্ড</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary font-bengali mb-4">
            আমাদের সম্মিলিত প্রভাব
          </h2>
          <p className="text-lg text-text-secondary font-bengali max-w-2xl mx-auto">
            স্বচ্ছতার সাথে আমরা দেখাচ্ছি কীভাবে আপনাদের অংশগ্রহণ বাংলাদেশে জীবন বাঁচাচ্ছে
          </p>
        </div>

        {/* Main Impact Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {impactMetrics?.map((metric) => (
            <div key={metric?.id} className="bg-white rounded-2xl p-6 shadow-brand hover:shadow-brand-lg transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${metric?.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <Icon name={metric?.icon} size={24} className={metric?.color} />
                </div>
                <div className="text-right">
                  <div className="flex items-baseline space-x-1">
                    <span className={`text-3xl font-bold ${metric?.color}`}>
                      {metric?.value?.toLocaleString()}
                    </span>
                    <span className={`text-lg font-medium ${metric?.color}`}>
                      {metric?.suffix}
                    </span>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-text-primary font-bengali mb-1">
                {metric?.title}
              </h3>
              <p className="text-sm text-text-secondary font-bengali">
                {metric?.description}
              </p>
            </div>
          ))}
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-2xl p-8 shadow-brand mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-text-primary font-bengali mb-2">
                মাসিক প্রবণতা
              </h3>
              <p className="text-text-secondary font-bengali">
                গত ৬ মাসের রক্তদান ও অনুরোধের তুলনা
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-sm text-text-secondary font-bengali">রক্তদান</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-secondary rounded-full"></div>
                <span className="text-sm text-text-secondary font-bengali">অনুরোধ</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {monthlyData?.map((data, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-4">
                  <div className="flex items-end justify-center space-x-1 h-24">
                    <div 
                      className="w-4 bg-primary rounded-t"
                      style={{ height: `${(data?.donations / 80) * 100}%` }}
                    ></div>
                    <div 
                      className="w-4 bg-secondary rounded-t"
                      style={{ height: `${(data?.requests / 80) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-xs font-medium text-text-primary font-bengali mb-1">
                  {data?.month}
                </p>
                <div className="text-xs text-text-secondary space-y-1">
                  <div className="flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>{data?.donations}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    <span>{data?.requests}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blood Group Distribution */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-brand">
            <h3 className="text-xl font-bold text-text-primary font-bengali mb-6">
              রক্তের গ্রুপ বিতরণ
            </h3>
            <div className="space-y-4">
              {[
                { group: 'O+', percentage: 35, count: 436 },
                { group: 'A+', percentage: 28, count: 349 },
                { group: 'B+', percentage: 22, count: 274 },
                { group: 'AB+', percentage: 8, count: 100 },
                { group: 'O-', percentage: 4, count: 50 },
                { group: 'A-', percentage: 2, count: 25 },
                { group: 'B-', percentage: 1, count: 13 }
              ]?.map((item) => (
                <div key={item?.group} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{item?.group}</span>
                    </div>
                    <span className="font-medium text-text-primary">{item?.count} দাতা</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-1000"
                        style={{ width: `${item?.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-text-secondary w-8">{item?.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-brand">
            <h3 className="text-xl font-bold text-text-primary font-bengali mb-6">
              আঞ্চলিক কভারেজ
            </h3>
            <div className="space-y-4">
              {[
                { division: 'ঢাকা', donors: 387, color: 'bg-red-500' },
                { division: 'চট্টগ্রাম', donors: 245, color: 'bg-blue-500' },
                { division: 'রাজশাহী', donors: 156, color: 'bg-green-500' },
                { division: 'খুলনা', donors: 134, color: 'bg-yellow-500' },
                { division: 'সিলেট', donors: 98, color: 'bg-purple-500' },
                { division: 'বরিশাল', donors: 87, color: 'bg-pink-500' },
                { division: 'রংপুর', donors: 76, color: 'bg-indigo-500' },
                { division: 'ময়মনসিংহ', donors: 64, color: 'bg-orange-500' }
              ]?.map((item) => (
                <div key={item?.division} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 ${item?.color} rounded-full`}></div>
                    <span className="font-medium text-text-primary font-bengali">{item?.division}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-text-secondary">{item?.donors} দাতা</span>
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item?.color} rounded-full transition-all duration-1000`}
                        style={{ width: `${(item?.donors / 387) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-center text-white">
          <Icon name="Target" size={48} className="mx-auto mb-4 opacity-80" />
          <h3 className="text-2xl font-bold font-bengali mb-4">
            আমাদের লক্ষ্য: ২০২৫ সালের মধ্যে ৫০০০ দাতা
          </h3>
          <p className="text-lg opacity-90 font-bengali mb-6 max-w-2xl mx-auto">
            আপনিও এই মহৎ উদ্দেশ্যে অংশ নিন। একসাথে আমরা বাংলাদেশে রক্তের সংকট দূর করতে পারি।
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="secondary"
              size="lg"
              iconName="UserPlus"
              iconPosition="left"
              className="px-8 py-4"
              onClick={() => navigate('/donor-registration')}
            >
              <span className="font-bengali">রক্তদাতা হন</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              iconName="Share2"
              iconPosition="left"
              className="px-8 py-4 border-white text-white hover:bg-white hover:text-primary"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'LifeLink Bangladesh',
                    text: 'বাংলাদেশের সবচেয়ে বিশ্বস্ত রক্তদান প্ল্যাটফর্ম',
                    url: window.location?.href
                  });
                }
              }}
            >
              <span className="font-bengali">শেয়ার করুন</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactDashboard;