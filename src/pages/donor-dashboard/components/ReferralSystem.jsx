import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ReferralSystem = ({ referralData }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const referralStats = [
    {
      id: 1,
      title: "আমন্ত্রিত বন্ধু",
      value: referralData?.totalInvited,
      icon: "UserPlus",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      id: 2,
      title: "যোগদানকারী",
      value: referralData?.joined,
      icon: "Users",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      id: 3,
      title: "সক্রিয় দাতা",
      value: referralData?.activeDonors,
      icon: "Heart",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      id: 4,
      title: "পয়েন্ট অর্জিত",
      value: referralData?.pointsEarned,
      icon: "Star",
      color: "text-warning",
      bgColor: "bg-warning/10"
    }
  ];

  const rewards = [
    {
      id: 1,
      title: "প্রথম রেফারেল",
      description: "প্রথম বন্ধুকে আমন্ত্রণ জানান",
      points: 50,
      icon: "Gift",
      unlocked: referralData?.totalInvited >= 1
    },
    {
      id: 2,
      title: "কমিউনিটি বিল্ডার",
      description: "৫ জন বন্ধুকে আমন্ত্রণ জানান",
      points: 250,
      icon: "Users",
      unlocked: referralData?.totalInvited >= 5
    },
    {
      id: 3,
      title: "নেটওয়ার্ক চ্যাম্পিয়ন",
      description: "১০ জন সক্রিয় দাতা তৈরি করুন",
      points: 500,
      icon: "Crown",
      unlocked: referralData?.activeDonors >= 10
    },
    {
      id: 4,
      title: "জীবন রক্ষাকারী নেটওয়ার্ক",
      description: "২০ জন বন্ধুর মাধ্যমে জীবন বাঁচান",
      points: 1000,
      icon: "Award",
      unlocked: referralData?.livesSavedThroughReferrals >= 20
    }
  ];

  const shareOptions = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: 'MessageCircle',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      message: `আমি LifeLink Bangladesh এ রক্তদাতা হিসেবে যোগ দিয়েছি। আপনিও যোগ দিন এবং জীবন বাঁচান! আমার রেফারেল কোড: ${referralData?.referralCode}`
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'Share',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      message: `রক্তদানের মাধ্যমে জীবন বাঁচানোর এই মহৎ কাজে আমার সাথে যোগ দিন! LifeLink Bangladesh - একসাথে আমরা আরও বেশি জীবন বাঁচাতে পারি।`
    },
    {
      id: 'sms',
      name: 'SMS',
      icon: 'MessageSquare',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      message: `LifeLink Bangladesh এ আমার সাথে যোগ দিন। রক্তদানের মাধ্যমে জীবন বাঁচান। রেফারেল কোড: ${referralData?.referralCode}`
    },
    {
      id: 'email',
      name: 'Email',
      icon: 'Mail',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      message: `আপনাকে LifeLink Bangladesh এ যোগ দিতে আমন্ত্রণ জানাচ্ছি। একসাথে আমরা রক্তদানের মাধ্যমে অনেক জীবন বাঁচাতে পারি।`
    }
  ];

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(referralData?.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleShare = (option) => {
    const encodedMessage = encodeURIComponent(option?.message);
    let shareUrl = '';

    switch (option?.id) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedMessage}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${window.location?.origin}&quote=${encodedMessage}`;
        break;
      case 'sms':
        shareUrl = `sms:?body=${encodedMessage}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=LifeLink Bangladesh এ যোগ দিন&body=${encodedMessage}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-brand p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bengali font-bold text-text-primary mb-2">
            রেফারেল সিস্টেম
          </h3>
          <p className="text-text-secondary font-bengali text-sm">
            বন্ধুদের আমন্ত্রণ জানান এবং পুরস্কার জিতুন
          </p>
        </div>
        <button
          onClick={() => setShowShareModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Icon name="Share2" size={16} />
          <span className="font-bengali">শেয়ার করুন</span>
        </button>
      </div>
      {/* Referral Code */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 mb-6">
        <div className="text-center">
          <h4 className="font-bengali font-semibold text-text-primary mb-2">
            আপনার রেফারেল কোড
          </h4>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-white px-6 py-3 rounded-lg border-2 border-dashed border-primary/30">
              <span className="text-2xl font-bold text-primary font-mono">
                {referralData?.referralCode}
              </span>
            </div>
            <button
              onClick={handleCopyCode}
              className={`p-3 rounded-lg transition-all duration-300 ${
                copiedCode 
                  ? 'bg-success text-white' :'bg-white text-primary hover:bg-primary hover:text-white'
              }`}
            >
              <Icon name={copiedCode ? "Check" : "Copy"} size={20} />
            </button>
          </div>
          <p className="text-sm font-bengali text-text-secondary">
            এই কোডটি বন্ধুদের সাথে শেয়ার করুন
          </p>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {referralStats?.map((stat) => (
          <div key={stat?.id} className="text-center">
            <div className={`w-12 h-12 ${stat?.bgColor} rounded-full flex items-center justify-center mx-auto mb-2`}>
              <Icon name={stat?.icon} size={20} className={stat?.color} />
            </div>
            <p className={`text-2xl font-bold ${stat?.color} mb-1`}>
              {stat?.value}
            </p>
            <p className="text-xs font-bengali text-text-secondary">
              {stat?.title}
            </p>
          </div>
        ))}
      </div>
      {/* Recent Referrals */}
      <div className="mb-6">
        <h4 className="font-bengali font-semibold text-text-primary mb-4">
          সাম্প্রতিক রেফারেল
        </h4>
        {referralData?.recentReferrals?.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="UserPlus" size={24} className="text-text-secondary" />
            </div>
            <p className="text-text-secondary font-bengali">
              এখনো কোন রেফারেল নেই
            </p>
            <p className="text-sm font-bengali text-text-secondary mt-1">
              বন্ধুদের আমন্ত্রণ জানিয়ে শুরু করুন
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {referralData?.recentReferrals?.map((referral) => (
              <div key={referral?.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name="User" size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-bengali font-medium text-text-primary">
                      {referral?.name}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {new Date(referral.joinedDate)?.toLocaleDateString('bn-BD')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    referral?.status === 'active' ?'bg-success/10 text-success' 
                      : referral?.status === 'joined' ?'bg-warning/10 text-warning' :'bg-muted text-text-secondary'
                  }`}>
                    {referral?.status === 'active' && 'সক্রিয়'}
                    {referral?.status === 'joined' && 'যোগদান'}
                    {referral?.status === 'pending' && 'অপেক্ষমাণ'}
                  </span>
                  <span className="text-sm font-medium text-primary">
                    +{referral?.pointsEarned}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Rewards */}
      <div>
        <h4 className="font-bengali font-semibold text-text-primary mb-4">
          পুরস্কার ও অর্জন
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewards?.map((reward) => (
            <div
              key={reward?.id}
              className={`border rounded-lg p-4 transition-all duration-300 ${
                reward?.unlocked 
                  ? 'border-success/20 bg-success/5' :'border-border bg-muted/50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  reward?.unlocked 
                    ? 'bg-success/10' :'bg-muted'
                }`}>
                  <Icon 
                    name={reward?.icon} 
                    size={20} 
                    className={reward?.unlocked ? 'text-success' : 'text-text-secondary'} 
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className={`font-bengali font-medium ${
                      reward?.unlocked ? 'text-text-primary' : 'text-text-secondary'
                    }`}>
                      {reward?.title}
                    </h5>
                    {reward?.unlocked && (
                      <Icon name="CheckCircle" size={16} className="text-success" />
                    )}
                  </div>
                  <p className={`text-sm font-bengali mb-2 ${
                    reward?.unlocked ? 'text-text-secondary' : 'text-text-secondary/70'
                  }`}>
                    {reward?.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Icon name="Star" size={14} className="text-warning" />
                    <span className="text-sm font-medium text-warning">
                      {reward?.points} পয়েন্ট
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-brand-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-bengali font-bold text-text-primary">
                বন্ধুদের আমন্ত্রণ জানান
              </h4>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            
            <div className="space-y-3">
              {shareOptions?.map((option) => (
                <button
                  key={option?.id}
                  onClick={() => handleShare(option)}
                  className={`w-full flex items-center space-x-3 p-3 ${option?.bgColor} rounded-lg hover:opacity-80 transition-opacity`}
                >
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <Icon name={option?.icon} size={20} className={option?.color} />
                  </div>
                  <div className="text-left">
                    <p className="font-bengali font-medium text-text-primary">
                      {option?.name} এ শেয়ার করুন
                    </p>
                    <p className="text-xs text-text-secondary">
                      {option?.message?.substring(0, 50)}...
                    </p>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Gift" size={16} className="text-primary" />
                <span className="font-bengali font-medium text-text-primary">
                  রেফারেল বোনাস
                </span>
              </div>
              <p className="text-sm font-bengali text-text-secondary">
                প্রতিটি সফল রেফারেলের জন্য ৫০ পয়েন্ট পান। যখন আপনার বন্ধু প্রথম রক্তদান করবেন, তখন আরও ১০০ পয়েন্ট বোনাস!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralSystem;