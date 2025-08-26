import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import ImpactSummary from './components/ImpactSummary';
import AchievementBadges from './components/AchievementBadges';
import DonationHistory from './components/DonationHistory';
import EligibilityTracker from './components/EligibilityTracker';
import NotificationPreferences from './components/NotificationPreferences';
import ReferralSystem from './components/ReferralSystem';
import Icon from '../../components/AppIcon';

const DonorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [donorData, setDonorData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock donor data
  const mockDonorData = {
    id: "DN001",
    name: "মোহাম্মদ রহিম উদ্দিন",
    bloodGroup: "B+",
    phone: "+880 1712-345678",
    email: "rahim.uddin@email.com",
    location: "ঢাকা, বাংলাদেশ",
    district: "ঢাকা",
    joinDate: "2023-01-15",
    verified: true,
    livesSaved: 12,
    totalDonations: 8,
    communityRank: 23,
    nextDonationDays: 45,
    lastDonationDate: "2024-06-15",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  };

  const mockAchievements = [
    {
      id: 1,
      name: "প্রথম দান বীর",
      description: "আপনার প্রথম রক্তদান সম্পন্ন করেছেন",
      type: "first-donation",
      category: "milestone",
      level: "bronze",
      earned: true,
      earnedDate: "2023-01-20",
      progress: 100,
      requirement: "১টি রক্তদান সম্পন্ন করুন"
    },
    {
      id: 2,
      name: "রমজান দাতা",
      description: "রমজান মাসে রক্তদান করেছেন",
      type: "ramadan-giver",
      category: "cultural",
      level: "gold",
      earned: true,
      earnedDate: "2024-03-25",
      progress: 100,
      requirement: "রমজান মাসে রক্তদান করুন"
    },
    {
      id: 3,
      name: "জেলা চ্যাম্পিয়ন",
      description: "আপনার জেলায় শীর্ষ ১০ দাতার মধ্যে রয়েছেন",
      type: "district-champion",
      category: "community",
      level: "platinum",
      earned: true,
      earnedDate: "2024-07-10",
      progress: 100,
      requirement: "জেলায় শীর্ষ ১০ দাতা হন"
    },
    {
      id: 4,
      name: "জীবন রক্ষাকারী",
      description: "১০টি জীবন বাঁচানোতে অবদান রেখেছেন",
      type: "life-saver",
      category: "milestone",
      level: "diamond",
      earned: true,
      earnedDate: "2024-08-01",
      progress: 100,
      requirement: "১০টি জীবন বাঁচান"
    },
    {
      id: 5,
      name: "নিয়মিত দাতা",
      description: "৬ মাসে ৩টি রক্তদান সম্পন্ন করুন",
      type: "regular-donor",
      category: "milestone",
      level: "silver",
      earned: false,
      progress: 67,
      requirement: "৬ মাসে ৩টি রক্তদান"
    },
    {
      id: 6,
      name: "জরুরি বীর",
      description: "৫টি জরুরি অনুরোধে সাড়া দিয়েছেন",
      type: "emergency-hero",
      category: "special",
      level: "gold",
      earned: false,
      progress: 80,
      requirement: "৫টি জরুরি অনুরোধে সাড়া দিন"
    }
  ];

  const mockDonationHistory = [
    {
      id: "DON001",
      hospital: "ঢাকা মেডিকেল কলেজ হাসপাতাল",
      date: "2024-06-15",
      time: "১০:৩০ AM",
      location: "ঢাকা",
      amount: 450,
      type: "emergency",
      status: "completed",
      patientName: "সালমা খাতুন",
      patientMessage: "আপনার রক্তদানের জন্য আমাদের পরিবারের পক্ষ থেকে অসংখ্য ধন্যবাদ। আল্লাহ আপনার মঙ্গল করুন।",
      patientFamily: "মোহাম্মদ করিম (স্বামী)",
      contactNumber: "+880 1812-345678",
      certificate: true
    },
    {
      id: "DON002",
      hospital: "বঙ্গবন্ধু শেখ মুজিব মেডিকেল বিশ্ববিদ্যালয়",
      date: "2024-03-20",
      time: "২:১৫ PM",
      location: "ঢাকা",
      amount: 450,
      type: "scheduled",
      status: "completed",
      patientName: "আব্দুল হামিদ",
      patientMessage: "আপনার মতো মানুষের কারণেই আজ আমি বেঁচে আছি। আল্লাহ আপনাকে উত্তম প্রতিদান দিন।",
      patientFamily: "ফাতেমা বেগম (স্ত্রী)",
      contactNumber: "+880 1712-987654",
      certificate: true
    },
    {
      id: "DON003",
      hospital: "চট্টগ্রাম মেডিকেল কলেজ হাসপাতাল",
      date: "2024-01-10",
      time: "১১:০০ AM",
      location: "চট্টগ্রাম",
      amount: 450,
      type: "drive",
      status: "completed",
      patientName: "রক্তদান ক্যাম্প",
      patientMessage: "আপনার অংশগ্রহণের জন্য ধন্যবাদ। এই রক্ত অনেক রোগীর কাজে আসবে।",
      patientFamily: "রক্তদান সংগঠন",
      contactNumber: "+880 1812-111222",
      certificate: true
    }
  ];

  const mockEligibilityData = {
    daysUntilEligible: 45,
    nextEligibleDate: "2024-10-15",
    lastHealthCheck: "২৫ জুলাই, ২০২ৄ",
    hemoglobin: 14.2,
    weight: 68,
    bloodPressure: "120/80",
    healthStatus: "excellent"
  };

  const mockNotificationPreferences = {
    enabled: true,
    notifications: {
      emergency: true,
      scheduled: true,
      drives: true,
      health: false,
      achievements: true,
      community: false
    },
    deliveryMethods: {
      push: true,
      sms: true,
      email: false,
      whatsapp: true
    },
    preferredTime: "18-22"
  };

  const mockReferralData = {
    referralCode: "RAHIM2024",
    totalInvited: 12,
    joined: 8,
    activeDonors: 5,
    pointsEarned: 650,
    livesSavedThroughReferrals: 15,
    recentReferrals: [
      {
        id: 1,
        name: "করিম উদ্দিন",
        joinedDate: "2024-08-20",
        status: "active",
        pointsEarned: 150
      },
      {
        id: 2,
        name: "সালমা আক্তার",
        joinedDate: "2024-08-15",
        status: "joined",
        pointsEarned: 50
      },
      {
        id: 3,
        name: "রফিক আহমেদ",
        joinedDate: "2024-08-10",
        status: "active",
        pointsEarned: 150
      }
    ]
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setDonorData(mockDonorData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleUpdatePreferences = async (newPreferences) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Preferences updated:', newPreferences);
        resolve();
      }, 1000);
    });
  };

  const tabs = [
    { id: 'overview', name: 'সংক্ষিপ্ত বিবরণ', icon: 'LayoutDashboard' },
    { id: 'history', name: 'দানের ইতিহাস', icon: 'History' },
    { id: 'achievements', name: 'অর্জনসমূহ', icon: 'Award' },
    { id: 'eligibility', name: 'যোগ্যতা', icon: 'Calendar' },
    { id: 'notifications', name: 'বিজ্ঞপ্তি', icon: 'Bell' },
    { id: 'referrals', name: 'রেফারেল', icon: 'Users' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Loader2" size={32} className="text-primary animate-spin" />
                </div>
                <p className="text-text-secondary font-bengali">ড্যাশবোর্ড লোড হচ্ছে...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Icon name="User" size={32} color="white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bengali font-bold mb-1">
                    স্বাগতম, {donorData?.name}
                  </h1>
                  <p className="text-white/80 font-bengali">
                    {donorData?.bloodGroup} গ্রুপ • {donorData?.district} • যোগদান: {new Date(donorData.joinDate)?.getFullYear()}
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">{donorData?.livesSaved}</p>
                  <p className="text-sm font-bengali text-white/80">জীবন বাঁচানো</p>
                </div>
                <div className="w-px h-12 bg-white/20"></div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{donorData?.totalDonations}</p>
                  <p className="text-sm font-bengali text-white/80">রক্তদান</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-xl shadow-brand mb-8">
            <div className="border-b border-border">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span className="font-bengali">{tab?.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <>
                <ImpactSummary donorData={donorData} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <EligibilityTracker eligibilityData={mockEligibilityData} />
                  <div className="space-y-6">
                    <AchievementBadges achievements={mockAchievements?.slice(0, 4)} />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'history' && (
              <DonationHistory donations={mockDonationHistory} />
            )}

            {activeTab === 'achievements' && (
              <AchievementBadges achievements={mockAchievements} />
            )}

            {activeTab === 'eligibility' && (
              <EligibilityTracker eligibilityData={mockEligibilityData} />
            )}

            {activeTab === 'notifications' && (
              <NotificationPreferences 
                preferences={mockNotificationPreferences}
                onUpdatePreferences={handleUpdatePreferences}
              />
            )}

            {activeTab === 'referrals' && (
              <ReferralSystem referralData={mockReferralData} />
            )}
          </div>

          {/* Quick Actions Floating Button */}
          <div className="fixed bottom-6 right-6 z-40">
            <div className="flex flex-col space-y-3">
              <button className="w-14 h-14 bg-primary text-white rounded-full shadow-brand-lg hover:shadow-brand-xl transition-all duration-300 flex items-center justify-center group">
                <Icon name="Heart" size={24} className="group-hover:scale-110 transition-transform heartbeat" />
              </button>
              <button className="w-12 h-12 bg-secondary text-white rounded-full shadow-brand hover:shadow-brand-lg transition-all duration-300 flex items-center justify-center">
                <Icon name="MessageCircle" size={20} />
              </button>
              <button className="w-12 h-12 bg-trust text-white rounded-full shadow-brand hover:shadow-brand-lg transition-all duration-300 flex items-center justify-center">
                <Icon name="Phone" size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;