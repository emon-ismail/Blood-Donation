import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { donorService } from '../../lib/donorService';
import { bloodRequestService } from '../../lib/bloodRequestService';
import StatsCard from './components/StatsCard';
import DistrictMap from './components/DistrictMap';
import RecentActivity from './components/RecentActivity';
import DonorManagement from './components/DonorManagement';
import RequestMonitoring from './components/RequestMonitoring';
import AnalyticsChart from './components/AnalyticsChart';
import SystemAlerts from './components/SystemAlerts';
import AdminLogin from './components/AdminLogin';

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedView, setSelectedView] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allStats, setAllStats] = useState({});

  useEffect(() => {
    // Check if admin is already logged in
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (adminLoggedIn === 'true') {
      setIsLoggedIn(true);
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Load real statistics only if logged in
    if (isLoggedIn) {
      loadStats();
    }

    return () => clearInterval(timer);
  }, [isLoggedIn]);

  const loadStats = async () => {
    try {
      const [donorStats, requestStats] = await Promise.all([
        donorService.getDonorStats(),
        bloodRequestService.getRequestStats()
      ]);
      setStats(donorStats);
      setAllStats({ donors: donorStats, requests: requestStats });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsData = stats ? [
    {
      title: 'মোট নিবন্ধিত দাতা',
      value: stats.total.toString(),
      change: `+${stats.todayRegistrations}`,
      changeType: 'increase',
      icon: 'Users',
      color: 'primary'
    },
    {
      title: 'যাচাইকৃত দাতা',
      value: stats.verified.toString(),
      change: `${Math.round((stats.verified/stats.total)*100)}%`,
      changeType: 'increase',
      icon: 'CheckCircle',
      color: 'success'
    },
    {
      title: 'উপলব্ধ দাতা',
      value: stats.available.toString(),
      change: `${Math.round((stats.available/stats.total)*100)}%`,
      changeType: 'increase',
      icon: 'Users',
      color: 'trust'
    },
    {
      title: 'আজকের নিবন্ধন',
      value: stats.todayRegistrations.toString(),
      change: 'আজ',
      changeType: 'increase',
      icon: 'UserPlus',
      color: 'secondary'
    },
    {
      title: 'যাচাই অপেক্ষমান',
      value: stats.pending.toString(),
      change: 'পেন্ডিং',
      changeType: 'decrease',
      icon: 'Clock',
      color: 'warning'
    },
    {
      title: 'মোট রক্তের অনুরোধ',
      value: (allStats.requests?.total || 0).toString(),
      change: `+${allStats.requests?.today || 0}`,
      changeType: 'increase',
      icon: 'Heart',
      color: 'secondary'
    }
  ] : [];

  const viewOptions = [
    { id: 'overview', label: 'সংক্ষিপ্ত বিবরণ', icon: 'LayoutDashboard' },
    { id: 'donors', label: 'দাতা ব্যবস্থাপনা', icon: 'Users' },
    { id: 'requests', label: 'অনুরোধ মনিটরিং', icon: 'Heart' },
    { id: 'analytics', label: 'বিশ্লেষণ', icon: 'BarChart3' },
    { id: 'users', label: 'অ্যাডমিন ব্যবস্থাপনা', icon: 'Shield' },
    { id: 'alerts', label: 'সতর্কতা', icon: 'AlertTriangle' }
  ];

  const renderContent = () => {
    switch (selectedView) {
      case 'donors':
        return <DonorManagement />;
      case 'requests':
        return <RequestMonitoring />;
      case 'analytics':
        return <AnalyticsChart />;
      case 'alerts':
        return <SystemAlerts />;
      case 'users':
        return <div className="bg-white rounded-lg p-6 shadow-brand">
          <h3 className="text-lg font-bengali font-bold mb-4">অ্যাডমিন ব্যবস্থাপনা</h3>
          <p className="font-bengali text-muted-foreground">অ্যাডমিন ইউজার যোগ, সম্পাদনা এবং মুছে ফেলার সুবিধা</p>
        </div>;
      default:
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-6 shadow-brand animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statsData?.map((stat, index) => (
                  <StatsCard
                    key={index}
                    title={stat?.title}
                    value={stat?.value}
                    change={stat?.change}
                    changeType={stat?.changeType}
                    icon={stat?.icon}
                    color={stat?.color}
                  />
                ))}
              </div>
            )}
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button variant="default" iconName="UserPlus" onClick={() => setSelectedView('donors')}>
                <span className="font-bengali">দাতা যোগ করুন</span>
              </Button>
              <Button variant="secondary" iconName="Heart" onClick={() => setSelectedView('requests')}>
                <span className="font-bengali">অনুরোধ দেখুন</span>
              </Button>
              <Button variant="outline" iconName="BarChart3" onClick={() => setSelectedView('analytics')}>
                <span className="font-bengali">রিপোর্ট</span>
              </Button>
              <Button variant="outline" iconName="Settings">
                <span className="font-bengali">সেটিংস</span>
              </Button>
            </div>
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <DistrictMap />
                <RecentActivity />
              </div>
              <div className="space-y-6">
                <AnalyticsChart />
                <SystemAlerts />
              </div>
            </div>
          </div>
        );
    }
  };

  // Show login screen if not logged in
  if (!isLoggedIn) {
    return <AdminLogin onLogin={setIsLoggedIn} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          {/* Dashboard Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-3xl font-bold text-text-primary font-bengali mb-2">
                  অ্যাডমিন ড্যাশবোর্ড
                </h1>
                <p className="text-muted-foreground font-bengali">
                  LifeLink Bangladesh প্ল্যাটফর্ম ব্যবস্থাপনা কেন্দ্র
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Clock" size={16} />
                  <span className="font-bengali">
                    {currentTime?.toLocaleDateString('bn-BD')} - {currentTime?.toLocaleTimeString('bn-BD')}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" iconName="Download">
                    <span className="font-bengali">রিপোর্ট এক্সপোর্ট</span>
                  </Button>
                  <Button variant="default" size="sm" iconName="Settings">
                    <span className="font-bengali">সেটিংস</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    iconName="LogOut"
                    onClick={() => {
                      localStorage.removeItem('adminLoggedIn');
                      setIsLoggedIn(false);
                    }}
                  >
                    <span className="font-bengali">লগআউট</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="flex space-x-1 bg-muted rounded-lg p-1 overflow-x-auto">
              {viewOptions?.map((option) => (
                <button
                  key={option?.id}
                  onClick={() => setSelectedView(option?.id)}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                    selectedView === option?.id
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-muted-foreground hover:text-text-primary'
                  }`}
                >
                  <Icon name={option?.icon} size={16} />
                  <span className="font-bengali">{option?.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="mb-8">
            {renderContent()}
          </div>

          {/* Footer */}
          <div className="border-t border-border pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground font-bengali">সিস্টেম স্বাভাবিক</span>
                </div>
                <div className="text-sm text-muted-foreground font-bengali">
                  সর্বশেষ আপডেট: {new Date()?.toLocaleTimeString('bn-BD')}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 font-bengali">
                  সাহায্য ও সহায়তা
                </button>
                <button className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 font-bengali">
                  যোগাযোগ
                </button>
                <div className="text-sm text-muted-foreground font-bengali">
                  © {new Date()?.getFullYear()} LifeLink Bangladesh
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;