import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RequestCard = ({ request, onContact, onShare, onPledge }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [pledged, setPledged] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const required = new Date(request.requiredBy);
      const diff = required - now;

      if (diff <= 0) {
        setTimeLeft('সময় শেষ');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`${days} দিন ${hours} ঘন্টা`);
      } else if (hours > 0) {
        setTimeLeft(`${hours} ঘন্টা ${minutes} মিনিট`);
      } else {
        setTimeLeft(`${minutes} মিনিট`);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [request?.requiredBy]);

  const getUrgencyConfig = (urgency) => {
    switch (urgency) {
      case 'emergency':
        return {
          color: 'bg-red-100 border-red-200',
          badge: 'bg-red-500 text-white',
          icon: 'AlertTriangle',
          label: 'জরুরি',
          textColor: 'text-red-700'
        };
      case 'urgent':
        return {
          color: 'bg-amber-100 border-amber-200',
          badge: 'bg-amber-500 text-white',
          icon: 'Clock',
          label: 'অত্যাবশ্যক',
          textColor: 'text-amber-700'
        };
      default:
        return {
          color: 'bg-green-100 border-green-200',
          badge: 'bg-green-500 text-white',
          icon: 'Calendar',
          label: 'সাধারণ',
          textColor: 'text-green-700'
        };
    }
  };

  const urgencyConfig = getUrgencyConfig(request?.urgencyLevel);

  const handlePledge = () => {
    setPledged(!pledged);
    onPledge(request?.id, !pledged);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`rounded-lg border-2 p-4 sm:p-6 transition-all duration-300 hover:shadow-brand ${urgencyConfig?.color} w-full max-w-full overflow-hidden break-words`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${urgencyConfig?.badge}`}>
            <Icon name={urgencyConfig?.icon} size={10} className="sm:w-3 sm:h-3" />
            <span className="font-bengali text-xs">{urgencyConfig?.label}</span>
          </div>
          {request?.verified && (
            <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center space-x-1">
              <Icon name="ShieldCheck" size={10} className="sm:w-3 sm:h-3" />
              <span className="font-bengali text-xs">যাচাইকৃত</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={() => onShare(request)}>
            <Icon name="Share2" size={16} />
          </Button>
          <div className="text-xs text-muted-foreground font-bengali hidden sm:block">
            {new Date(request.postedAt)?.toLocaleDateString('bn-BD')}
          </div>
        </div>
      </div>
      {/* Patient Info */}
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
          <h3 className="text-base sm:text-lg font-bengali font-bold text-text-primary break-words">{request?.patientName}</h3>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-lg">{request?.bloodGroup}</span>
            </div>
            <div className="text-right">
              <div className="text-xs sm:text-sm font-medium text-text-primary">{request?.unitsNeeded} ব্যাগ</div>
              <div className="text-xs text-muted-foreground font-bengali">প্রয়োজন</div>
            </div>
          </div>
        </div>
      </div>
      {/* Location & Hospital */}
      <div className="space-y-2 mb-4">
        <div className="flex items-start space-x-2 text-sm text-text-secondary">
          <Icon name="MapPin" size={16} className="flex-shrink-0 mt-0.5" />
          <span className="font-bengali break-words">{request?.hospital}</span>
        </div>
        {request?.hospitalAddress && (
          <div className="flex items-start space-x-2 text-sm text-text-secondary">
            <Icon name="Building" size={16} className="flex-shrink-0 mt-0.5" />
            <span className="font-bengali break-words">{request?.hospitalAddress}</span>
          </div>
        )}
        <div className="flex items-start space-x-2 text-sm text-text-secondary">
          <Icon name="Navigation" size={16} className="flex-shrink-0 mt-0.5" />
          <span className="font-bengali break-words">{request?.location}</span>
        </div>
      </div>
      {/* Time Remaining */}
      <div className={`p-3 rounded-lg mb-4 ${urgencyConfig?.color}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className={urgencyConfig?.textColor} />
            <span className={`text-sm font-medium font-bengali ${urgencyConfig?.textColor}`}>
              সময় বাকি: {timeLeft}
            </span>
          </div>
          <div className="text-xs text-muted-foreground font-bengali">
            {formatDate(request?.requiredBy)} এর মধ্যে
          </div>
        </div>
      </div>
      {/* Additional Info */}
      {request?.additionalInfo && (
        <div className="mb-4 p-3 bg-white rounded-lg border">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-text-primary font-bengali mb-1">বিশেষ নির্দেশনা:</div>
              <p className="text-sm text-text-secondary font-bengali break-all word-break-break-all overflow-wrap-anywhere">{request?.additionalInfo}</p>
            </div>
          </div>
        </div>
      )}
      {/* Contact Info */}
      <div className="mb-4 p-3 bg-white rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-text-primary font-bengali">{request?.contactPerson}</div>
            <div className="text-sm text-text-secondary">{request?.contactPhone}</div>
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="Phone"
            iconPosition="left"
            onClick={() => onContact(request)}
          >
            <span className="font-bengali">কল করুন</span>
          </Button>
        </div>
      </div>
      {/* Response Stats */}
      <div className="flex items-center justify-between mb-4 text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-green-600">
            <Icon name="Users" size={14} />
            <span className="font-bengali">{request?.pledges || 0} জন সাহায্য করবেন</span>
          </div>
          <div className="flex items-center space-x-1 text-blue-600">
            <Icon name="Share2" size={14} />
            <span className="font-bengali">{request?.shares || 0} বার শেয়ার</span>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-muted-foreground">
          <Icon name="Eye" size={14} />
          <span className="font-bengali">{request?.views || 0} বার দেখা হয়েছে</span>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Button
          variant={pledged ? "success" : "default"}
          size="sm"
          iconName={pledged ? "Check" : "Heart"}
          iconPosition="left"
          onClick={handlePledge}
          className="w-full"
        >
          <span className="font-bengali text-xs sm:text-sm">
            {pledged ? 'সাহায্য করবেন ✓' : 'সাহায্য করবেন'}
          </span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          iconName="MessageCircle"
          iconPosition="left"
          className="w-full"
        >
          <span className="font-bengali text-xs sm:text-sm">দোয়া করুন</span>
        </Button>
        
        <Button
          variant="secondary"
          size="sm"
          iconName="Share2"
          iconPosition="left"
          onClick={() => onShare(request)}
          className="w-full"
        >
          <span className="font-bengali text-xs sm:text-sm">শেয়ার</span>
        </Button>
      </div>
      {/* Prayer Section */}
      {request?.prayers && request?.prayers?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Heart" size={14} className="text-green-500" />
            <span className="text-sm font-bengali text-text-secondary">
              {request?.prayers?.length} জন দোয়া করেছেন
            </span>
          </div>
          <div className="text-xs text-muted-foreground font-bengali italic">
            "আল্লাহ তাআলা রোগীকে দ্রুত সুস্থতা দান করুন। আমিন।"
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestCard;