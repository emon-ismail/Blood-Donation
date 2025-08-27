import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ImpactSummary from './components/ImpactSummary';
import AchievementBadges from './components/AchievementBadges';
import DonationHistory from './components/DonationHistory';
import EligibilityTracker from './components/EligibilityTracker';
import NotificationPreferences from './components/NotificationPreferences';
import ReferralSystem from './components/ReferralSystem';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import { donorService } from '../../lib/donorService';
import { supabase } from '../../lib/supabase';
import DonationModal from '../../components/DonationModal';

const DonorDashboard = () => {
  const { user, donorData, updateDonorData, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [localDonorData, setLocalDonorData] = useState(donorData);
  const [loading, setLoading] = useState(true);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [impactData, setImpactData] = useState(null);

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

  // Calculate eligibility data from real impact data
  const getEligibilityData = () => {
    const daysUntilEligible = localDonorData?.nextDonationDays || 90;
    const nextEligibleDate = daysUntilEligible > 0 ? 
      new Date(Date.now() + daysUntilEligible * 24 * 60 * 60 * 1000) : 
      new Date();
    
    return {
      daysUntilEligible,
      nextEligibleDate,
      lastHealthCheck: "২৫ জুলাই, ২০২৪",
      hemoglobin: 14.2,
      weight: 68,
      bloodPressure: "120/80",
      healthStatus: "excellent"
    };
  };

  // Function to refresh impact data
  const refreshImpactData = async () => {
    if (!localDonorData?.id) return;
    
    try {
      const updatedImpact = await donorService.getDonorImpact(localDonorData.id);
      setLocalDonorData(prev => ({
        ...prev,
        totalDonations: updatedImpact.totalDonations,
        livesSaved: updatedImpact.livesSaved,
        communityRank: updatedImpact.communityRank,
        nextDonationDays: updatedImpact.nextDonationDays,
        lastDonationDate: updatedImpact.lastDonationDate
      }));
      setImpactData(updatedImpact);
    } catch (error) {
      console.error('Failed to refresh impact data:', error);
    }
  };

  // Auto-refresh impact data every 30 seconds
  useEffect(() => {
    if (!localDonorData?.id) return;
    
    const interval = setInterval(refreshImpactData, 30000);
    return () => clearInterval(interval);
  }, [localDonorData?.id]);

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
    if (!user?.email) {
      setLoading(false);
      navigate('/donor-login');
      return;
    }

    const loadDonorData = async () => {
      try {
        if (donorData && donorData.email === user.email) {
          setLocalDonorData(donorData);
          setLoading(false);
          return;
        }
        
        // Use simple query without impact data to avoid loops
        const { data: donor, error } = await supabase
          .from('donors')
          .select('*')
          .eq('email', user.email)
          .limit(1)
          .single();
          
        if (error || !donor) {
          navigate('/donor-login');
          return;
        }
        
        // Get impact data
        const impact = await donorService.getDonorImpact(donor.id);
        
        const formattedData = {
          id: donor.id,
          donorId: donor.donor_id || `DN${donor.id.toString().slice(-6).padStart(6, '0')}`,
          name: donor.full_name,
          bloodGroup: donor.blood_group,
          phone: donor.mobile,
          email: donor.email,
          location: `${donor.upazila}, ${donor.district}`,
          district: donor.district,
          joinDate: donor.created_at,
          verified: donor.is_verified,
          livesSaved: impact.livesSaved,
          totalDonations: impact.totalDonations,
          communityRank: impact.communityRank,
          nextDonationDays: impact.nextDonationDays,
          lastDonationDate: impact.lastDonationDate,
          latitude: donor.latitude,
          longitude: donor.longitude,
          profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(donor.full_name)}&background=C41E3A&color=fff`
        };
        setLocalDonorData(formattedData);
        setImpactData(impact);
        updateDonorData(formattedData);
      } catch (error) {
        console.error('Failed to load donor data:', error);
        navigate('/donor-login');
      } finally {
        setLoading(false);
      }
    };

    loadDonorData();
  }, [user, navigate, donorData, updateDonorData]);

  const handleUpdatePreferences = async (newPreferences) => {
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
          <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Icon name="User" size={24} className="sm:w-8 sm:h-8" color="white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-2xl font-bengali font-bold mb-1">
                    স্বাগতম, {localDonorData?.name || 'দাতা'}
                  </h1>
                  <p className="text-sm sm:text-base text-white/80 font-bengali">
                    {localDonorData?.bloodGroup} গ্রুপ • {localDonorData?.district} • ID: {localDonorData?.donorId || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex sm:hidden items-center justify-between bg-white/10 rounded-lg p-3">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-xl font-bold">{localDonorData?.livesSaved || 0}</p>
                    <p className="text-xs font-bengali text-white/80">সেবার অবদান</p>
                  </div>
                  <div className="w-px h-8 bg-white/20"></div>
                  <div className="text-center">
                    <p className="text-xl font-bold">{localDonorData?.totalDonations || 0}</p>
                    <p className="text-xs font-bengali text-white/80">রক্তদান</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/donor-login');
                  }}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bengali transition-colors"
                >
                  লগআউট
                </button>
              </div>
              <div className="hidden sm:flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">{localDonorData?.livesSaved || 0}</p>
                  <p className="text-sm font-bengali text-white/80">সেবার অবদান</p>
                </div>
                <div className="w-px h-12 bg-white/20"></div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{localDonorData?.totalDonations || 0}</p>
                  <p className="text-sm font-bengali text-white/80">রক্তদান</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/donor-login');
                  }}
                  className="ml-4 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-bengali transition-colors"
                >
                  লগআউট
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-xl shadow-brand mb-6 sm:mb-8">
            <div className="border-b border-border">
              <nav className="flex overflow-x-auto px-4 sm:px-6" aria-label="Tabs">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-1 sm:space-x-2 py-3 sm:py-4 px-2 sm:px-1 mr-4 sm:mr-8 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors duration-200 ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                    }`}
                  >
                    <Icon name={tab?.icon} size={14} className="sm:w-4 sm:h-4" />
                    <span className="font-bengali">{tab?.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Location Update Prompt for donors without GPS */}
          {localDonorData && (!localDonorData.latitude || !localDonorData.longitude) && (
            <div className="bg-warning/10 border border-warning/20 rounded-xl p-6 mb-6">
              <div className="flex items-start space-x-4">
                <Icon name="MapPin" size={24} color="var(--color-warning)" />
                <div className="flex-1">
                  <h3 className="font-bengali font-semibold text-warning mb-2">
                    📍 আপনার অবস্থান আপডেট করুন
                  </h3>
                  <p className="text-sm text-warning/80 font-bengali mb-4">
                    আপনার GPS অবস্থান সংরক্ষিত নেই। এটি যোগ করলে রক্তের প্রয়োজনে আপনাকে দ্রুত খুঁজে পাওয়া যাবে।
                  </p>
                  <button
                    onClick={async () => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          async (position) => {
                            try {
                              await donorService.updateDonorLocation(localDonorData.id, {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude
                              });
                              
                              setLocalDonorData(prev => ({
                                ...prev,
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude
                              }));
                              
                              alert('✅ আপনার অবস্থান সফলভাবে আপডেট হয়েছে!');
                            } catch (error) {
                              console.error('Location update failed:', error);
                              alert('অবস্থান আপডেট করতে সমস্যা হয়েছে।');
                            }
                          },
                          (error) => {
                            alert('অবস্থান অ্যাক্সেস করতে পারছি না। অনুগ্রহ করে browser এ location permission দিন।');
                          }
                        );
                      }
                    }}
                    className="px-4 py-2 bg-warning text-white rounded-lg hover:bg-warning/90 font-bengali text-sm"
                  >
                    📍 এখনই অবস্থান যোগ করুন
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <>
                <ImpactSummary 
                  donorData={localDonorData} 
                  onRefresh={refreshImpactData}
                />
                
                {/* Add Donation Card */}
                <div className="bg-gradient-to-r from-secondary to-accent rounded-xl p-4 sm:p-6 text-white mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div>
                      <h3 className="text-base sm:text-lg font-bengali font-semibold mb-2">
                        🏅 নতুন দান যোগ করুন
                      </h3>
                      <p className="text-white/80 font-bengali text-sm">
                        আপনি কি সম্প্রতি রক্তদান করেছেন? এখানে রেকর্ড করুন।
                      </p>
                    </div>
                    <button
                      onClick={() => setShowDonationModal(true)}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-white/20 hover:bg-white/30 rounded-lg font-bengali font-semibold transition-all duration-300 text-sm sm:text-base w-full sm:w-auto"
                    >
                      🩸 দান যোগ করুন
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <EligibilityTracker eligibilityData={getEligibilityData()} />
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
              <EligibilityTracker eligibilityData={getEligibilityData()} />
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
          <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
            <div className="flex flex-col space-y-2 sm:space-y-3">
              <button className="w-12 h-12 sm:w-14 sm:h-14 bg-primary text-white rounded-full shadow-brand-lg hover:shadow-brand-xl transition-all duration-300 flex items-center justify-center group">
                <Icon name="Heart" size={20} className="sm:w-6 sm:h-6 group-hover:scale-110 transition-transform heartbeat" />
              </button>
              <button className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary text-white rounded-full shadow-brand hover:shadow-brand-lg transition-all duration-300 flex items-center justify-center">
                <Icon name="MessageCircle" size={16} className="sm:w-5 sm:h-5" />
              </button>
              <button className="w-10 h-10 sm:w-12 sm:h-12 bg-trust text-white rounded-full shadow-brand hover:shadow-brand-lg transition-all duration-300 flex items-center justify-center">
                <Icon name="Phone" size={16} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Donation Modal */}
      <DonationModal
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        donor={localDonorData}
        onSubmit={async (donationData) => {
          try {
            await donorService.addDonation(localDonorData.id, donationData);
            
            // Refresh impact data after donation
            const updatedImpact = await donorService.getDonorImpact(localDonorData.id);
            
            setLocalDonorData(prev => ({
              ...prev,
              totalDonations: updatedImpact.totalDonations,
              livesSaved: updatedImpact.livesSaved,
              communityRank: updatedImpact.communityRank,
              nextDonationDays: updatedImpact.nextDonationDays,
              lastDonationDate: updatedImpact.lastDonationDate
            }));
            setImpactData(updatedImpact);
            setShowDonationModal(false);
            alert('ধন্যবাদ! দান সফলভাবে রেকর্ড হয়েছে।');
          } catch (error) {
            console.error('Donation submission failed:', error);
            alert('দান রেকর্ড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
          }
        }}
      />
    </div>
  );
};

export default DonorDashboard;