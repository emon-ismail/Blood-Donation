import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { donorService } from '../../lib/donorService';
import StatsCard from './components/StatsCard';
import DistrictMap from './components/DistrictMap';
import RecentActivity from './components/RecentActivity';
import DonorManagement from './components/DonorManagement';
import RequestMonitoring from './components/RequestMonitoring';
import AnalyticsChart from './components/AnalyticsChart';
import SystemAlerts from './components/SystemAlerts';
import AdminLogin from './components/AdminLogin';
import AdminManagement from './components/AdminManagement';

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
      // Set default view based on role
      if (userRole === 'moderator') {
        setSelectedView('requests');
      }
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
      const donorStats = await donorService.getDonorStats();
      setStats(donorStats);
      setAllStats({ donors: donorStats, requests: { total: 0, today: 0 } });
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

  // Get admin data from localStorage
  const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
  const userRole = adminData.role || 'admin';

  // Define permissions based on role
  const getViewOptions = (role) => {
    const allOptions = [
      { id: 'overview', label: 'সংক্ষিপ্ত বিবরণ', icon: 'LayoutDashboard' },
      { id: 'donors', label: 'দাতা ব্যবস্থাপনা', icon: 'Users' },
      { id: 'requests', label: 'অনুরোধ মনিটরিং', icon: 'Heart' },
      { id: 'analytics', label: 'বিশ্লেষণ', icon: 'BarChart3' },
      { id: 'users', label: 'অ্যাডমিন ব্যবস্থাপনা', icon: 'Shield' },
      { id: 'alerts', label: 'সতর্কতা', icon: 'AlertTriangle' }
    ];

    switch (role) {
      case 'moderator':
        return [{ id: 'requests', label: 'অনুরোধ মনিটরিং', icon: 'Heart' }];
      case 'admin':
        return allOptions.filter(option => option.id !== 'users');
      case 'super_admin':
        return allOptions;
      default:
        return [{ id: 'overview', label: 'সংক্ষিপ্ত বিবরণ', icon: 'LayoutDashboard' }];
    }
  };

  const viewOptions = getViewOptions(userRole);

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
        return <AdminManagement />;
      default:
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-4 sm:p-6 shadow-brand animate-pulse">
                    <div className="h-3 sm:h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 sm:h-8 bg-gray-200 rounded mb-2"></div>
                    <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
            )
            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <Button variant="default" iconName="UserPlus" onClick={() => setSelectedView('donors')} size="sm" className="text-xs sm:text-sm">
                <span className="font-bengali">দাতা যোগ</span>
              </Button>
              <Button variant="secondary" iconName="Heart" onClick={() => setSelectedView('requests')} size="sm" className="text-xs sm:text-sm">
                <span className="font-bengali">অনুরোধ</span>
              </Button>
              <Button variant="outline" iconName="BarChart3" onClick={() => setSelectedView('analytics')} size="sm" className="text-xs sm:text-sm">
                <span className="font-bengali">রিপোর্ট</span>
              </Button>
              <Button variant="outline" iconName="Settings" size="sm" className="text-xs sm:text-sm">
                <span className="font-bengali">সেটিংস</span>
              </Button>
            </div>
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4 sm:space-y-6">
                <DistrictMap />
                <RecentActivity />
              </div>
              <div className="space-y-4 sm:space-y-6">
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
            <div className="flex flex-col space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary font-bengali mb-2">
                  {userRole === 'moderator' ? 'মডারেটর ড্যাশবোর্ড' : 
                   userRole === 'super_admin' ? 'সুপার অ্যাডমিন ড্যাশবোর্ড' : 
                   'অ্যাডমিন ড্যাশবোর্ড'}
                </h1>
                <p className="text-sm text-muted-foreground font-bengali">
                  {userRole === 'moderator' ? 'রক্তের অনুরোধ যাচাই ও অনুমোদন' : 
                   'LifeLink Bangladesh প্ল্যাটফর্ম ব্যবস্থাপনা কেন্দ্র'}
                </p>
              </div>
              
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                  <Icon name="Clock" size={14} />
                  <span className="font-bengali">
                    {currentTime?.toLocaleDateString('bn-BD')} - {currentTime?.toLocaleTimeString('bn-BD')}
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  {/* Admin Profile */}
                  <div className="flex items-center space-x-3 bg-white rounded-lg px-3 py-2 shadow-sm border w-full sm:w-auto">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center">
                      <Icon name="User" size={12} color="white" className="sm:w-4 sm:h-4" />
                    </div>
                    <div className="text-xs sm:text-sm">
                      <div className="font-medium text-text-primary">
                        {adminData.full_name || adminData.username || 'Admin'}
                      </div>
                      <div className="text-xs text-muted-foreground font-bengali">
                        {userRole === 'super_admin' ? 'সুপার অ্যাডমিন' :
                         userRole === 'moderator' ? 'মডারেটর' : 'অ্যাডমিন'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" iconName="Download" className="flex-1 sm:flex-none">
                      <span className="font-bengali hidden sm:inline">রিপোর্ট</span>
                      <span className="font-bengali sm:hidden">রিপোর্ট</span>
                    </Button>
                    <Button variant="default" size="sm" iconName="Settings" className="flex-1 sm:flex-none">
                      <span className="font-bengali hidden sm:inline">সেটিংস</span>
                      <span className="font-bengali sm:hidden">সেটিংস</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      iconName="LogOut"
                      onClick={() => {
                        localStorage.removeItem('adminLoggedIn');
                        localStorage.removeItem('adminData');
                        setIsLoggedIn(false);
                      }}
                      className="flex-1 sm:flex-none"
                    >
                      <span className="font-bengali">লগআউট</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="flex space-x-1 bg-muted rounded-lg p-1 overflow-x-auto scrollbar-hide">
              {viewOptions?.map((option) => (
                <button
                  key={option?.id}
                  onClick={() => setSelectedView(option?.id)}
                  className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                    selectedView === option?.id
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-muted-foreground hover:text-text-primary'
                  }`}
                >
                  <Icon name={option?.icon} size={14} className="sm:w-4 sm:h-4" />
                  <span className="font-bengali hidden sm:inline">{option?.label}</span>
                  <span className="font-bengali sm:hidden text-xs">
                    {option?.label.split(' ')[0]}
                  </span>
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