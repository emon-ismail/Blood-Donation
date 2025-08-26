import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const AchievementBadges = ({ achievements }) => {
  const [selectedBadge, setSelectedBadge] = useState(null);

  const badgeCategories = [
    {
      id: 'milestones',
      name: 'মাইলস্টোন',
      icon: 'Target',
      badges: achievements?.filter(badge => badge?.category === 'milestone')
    },
    {
      id: 'cultural',
      name: 'সাংস্কৃতিক',
      icon: 'Star',
      badges: achievements?.filter(badge => badge?.category === 'cultural')
    },
    {
      id: 'community',
      name: 'কমিউনিটি',
      icon: 'Users',
      badges: achievements?.filter(badge => badge?.category === 'community')
    },
    {
      id: 'special',
      name: 'বিশেষ',
      icon: 'Award',
      badges: achievements?.filter(badge => badge?.category === 'special')
    }
  ];

  const getBadgeIcon = (type) => {
    const iconMap = {
      'first-donation': 'Heart',
      'ramadan-giver': 'Moon',
      'district-champion': 'Crown',
      'life-saver': 'Shield',
      'regular-donor': 'Calendar',
      'emergency-hero': 'Zap',
      'community-builder': 'Users',
      'health-advocate': 'Activity'
    };
    return iconMap?.[type] || 'Award';
  };

  const getBadgeGradient = (level) => {
    const gradients = {
      'bronze': 'from-amber-600 to-amber-800',
      'silver': 'from-gray-400 to-gray-600',
      'gold': 'from-yellow-400 to-yellow-600',
      'platinum': 'from-purple-400 to-purple-600',
      'diamond': 'from-blue-400 to-blue-600'
    };
    return gradients?.[level] || 'from-primary to-secondary';
  };

  return (
    <div className="bg-white rounded-xl shadow-brand p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bengali font-bold text-text-primary mb-2">
            অর্জন ব্যাজ
          </h3>
          <p className="text-text-secondary font-bengali text-sm">
            আপনার রক্তদান যাত্রার স্বীকৃতি
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">
              {achievements?.filter(badge => badge?.earned)?.length}
            </p>
            <p className="text-xs font-bengali text-text-secondary">অর্জিত ব্যাজ</p>
          </div>
        </div>
      </div>
      {/* Badge Categories */}
      <div className="space-y-6">
        {badgeCategories?.map((category) => (
          <div key={category?.id} className="border border-border rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                <Icon name={category?.icon} size={16} className="text-text-primary" />
              </div>
              <h4 className="font-bengali font-semibold text-text-primary">
                {category?.name}
              </h4>
              <span className="text-xs bg-muted px-2 py-1 rounded-full text-text-secondary">
                {category?.badges?.filter(badge => badge?.earned)?.length}/{category?.badges?.length}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {category?.badges?.map((badge) => (
                <div
                  key={badge?.id}
                  className={`relative group cursor-pointer transition-all duration-300 ${
                    badge?.earned ? 'hover:scale-105' : 'opacity-50'
                  }`}
                  onClick={() => setSelectedBadge(badge)}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-brand ${
                    badge?.earned 
                      ? `bg-gradient-to-br ${getBadgeGradient(badge?.level)}` 
                      : 'bg-muted'
                  }`}>
                    <Icon 
                      name={getBadgeIcon(badge?.type)} 
                      size={24} 
                      color={badge?.earned ? "white" : "var(--color-text-secondary)"} 
                    />
                  </div>
                  
                  {badge?.earned && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-success rounded-full flex items-center justify-center">
                      <Icon name="Check" size={12} color="white" />
                    </div>
                  )}
                  
                  <p className="text-xs font-bengali text-center mt-2 text-text-secondary group-hover:text-text-primary transition-colors">
                    {badge?.name}
                  </p>
                  
                  {badge?.earned && badge?.earnedDate && (
                    <p className="text-xs text-center text-success">
                      {new Date(badge.earnedDate)?.toLocaleDateString('bn-BD')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-brand-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bengali font-bold text-text-primary">
                ব্যাজ বিবরণ
              </h4>
              <button
                onClick={() => setSelectedBadge(null)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            
            <div className="text-center mb-6">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-brand ${
                selectedBadge?.earned 
                  ? `bg-gradient-to-br ${getBadgeGradient(selectedBadge?.level)}` 
                  : 'bg-muted'
              }`}>
                <Icon 
                  name={getBadgeIcon(selectedBadge?.type)} 
                  size={32} 
                  color={selectedBadge?.earned ? "white" : "var(--color-text-secondary)"} 
                />
              </div>
              
              <h5 className="text-xl font-bengali font-bold text-text-primary mb-2">
                {selectedBadge?.name}
              </h5>
              
              <p className="text-text-secondary font-bengali text-sm mb-4">
                {selectedBadge?.description}
              </p>
              
              {selectedBadge?.earned ? (
                <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                  <p className="text-success font-bengali text-sm">
                    অর্জিত: {new Date(selectedBadge.earnedDate)?.toLocaleDateString('bn-BD')}
                  </p>
                </div>
              ) : (
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-text-secondary font-bengali text-sm">
                    প্রয়োজন: {selectedBadge?.requirement}
                  </p>
                  <div className="mt-2">
                    <div className="w-full bg-border rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${selectedBadge?.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-text-secondary mt-1">
                      {selectedBadge?.progress}% সম্পন্ন
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {selectedBadge?.earned && (
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                <Icon name="Share2" size={16} />
                <span className="font-bengali">শেয়ার করুন</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementBadges;