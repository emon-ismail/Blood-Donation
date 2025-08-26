import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SystemAlerts = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'critical',
      title: 'O- রক্তের তীব্র সংকট',
      message: 'সিলেট অঞ্চলে O- রক্তের মাত্র ২ ব্যাগ স্টক রয়েছে। জরুরি দাতা প্রয়োজন।',
      timestamp: new Date(Date.now() - 300000),
      location: 'সিলেট',
      actionRequired: true,
      dismissed: false,
      affectedUsers: 15
    },
    {
      id: 2,
      type: 'warning',
      title: 'সার্ভার লোড বৃদ্ধি',
      message: 'বর্তমানে সিস্টেমে স্বাভাবিকের চেয়ে ৩০% বেশি ট্রাফিক রয়েছে। পারফরমেন্স মনিটর করুন।',
      timestamp: new Date(Date.now() - 600000),
      location: 'সিস্টেম',
      actionRequired: false,
      dismissed: false,
      affectedUsers: 0
    },
    {
      id: 3,
      type: 'info',
      title: 'নতুন দাতা নিবন্ধন বৃদ্ধি',
      message: 'গত ২৪ ঘন্টায় ৪৫ জন নতুন দাতা নিবন্ধন করেছেন। গড়ের চেয়ে ২০% বেশি।',
      timestamp: new Date(Date.now() - 1800000),
      location: 'সারাদেশ',
      actionRequired: false,
      dismissed: false,
      affectedUsers: 45
    },
    {
      id: 4,
      type: 'error',
      title: 'SMS গেটওয়ে সমস্যা',
      message: 'SMS নোটিফিকেশন সিস্টেমে সাময়িক সমস্যা। ইমেইল নোটিফিকেশন চালু রয়েছে।',
      timestamp: new Date(Date.now() - 2400000),
      location: 'সিস্টেম',
      actionRequired: true,
      dismissed: false,
      affectedUsers: 0
    },
    {
      id: 5,
      type: 'success',
      title: 'ব্যাকআপ সম্পন্ন',
      message: 'দৈনিক ডেটা ব্যাকআপ সফলভাবে সম্পন্ন হয়েছে। সব ডেটা নিরাপদ।',
      timestamp: new Date(Date.now() - 3600000),
      location: 'সিস্টেম',
      actionRequired: false,
      dismissed: false,
      affectedUsers: 0
    }
  ]);

  const getAlertColor = (type) => {
    const colors = {
      critical: 'bg-destructive/10 text-destructive border-destructive/20',
      error: 'bg-error/10 text-error border-error/20',
      warning: 'bg-warning/10 text-warning border-warning/20',
      info: 'bg-trust/10 text-trust border-trust/20',
      success: 'bg-success/10 text-success border-success/20'
    };
    return colors?.[type] || colors?.info;
  };

  const getAlertIcon = (type) => {
    const icons = {
      critical: 'AlertTriangle',
      error: 'XCircle',
      warning: 'AlertCircle',
      info: 'Info',
      success: 'CheckCircle'
    };
    return icons?.[type] || 'Info';
  };

  const getAlertText = (type) => {
    const texts = {
      critical: 'অতি জরুরি',
      error: 'ত্রুটি',
      warning: 'সতর্কতা',
      info: 'তথ্য',
      success: 'সফল'
    };
    return texts?.[type] || 'তথ্য';
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

  const handleDismissAlert = (alertId) => {
    setAlerts(prev => prev?.map(alert => 
      alert?.id === alertId ? { ...alert, dismissed: true } : alert
    ));
  };

  const handleResolveAlert = (alertId) => {
    setAlerts(prev => prev?.filter(alert => alert?.id !== alertId));
  };

  const activeAlerts = alerts?.filter(alert => !alert?.dismissed);
  const criticalAlerts = activeAlerts?.filter(alert => alert?.type === 'critical' || alert?.type === 'error');

  return (
    <div className="bg-card rounded-lg p-6 shadow-brand border border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-text-primary font-bengali">সিস্টেম সতর্কতা</h3>
          {criticalAlerts?.length > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-destructive text-white animate-pulse">
              {criticalAlerts?.length} জরুরি
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" iconName="Settings">
            <span className="font-bengali">সেটিংস</span>
          </Button>
          <Button variant="outline" size="sm" iconName="RefreshCw">
            <span className="font-bengali">রিফ্রেশ</span>
          </Button>
        </div>
      </div>
      {/* Alert Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="text-center p-3 bg-destructive/10 rounded-lg">
          <div className="text-lg font-bold text-destructive">
            {alerts?.filter(a => a?.type === 'critical' && !a?.dismissed)?.length}
          </div>
          <div className="text-xs text-muted-foreground font-bengali">অতি জরুরি</div>
        </div>
        <div className="text-center p-3 bg-error/10 rounded-lg">
          <div className="text-lg font-bold text-error">
            {alerts?.filter(a => a?.type === 'error' && !a?.dismissed)?.length}
          </div>
          <div className="text-xs text-muted-foreground font-bengali">ত্রুটি</div>
        </div>
        <div className="text-center p-3 bg-warning/10 rounded-lg">
          <div className="text-lg font-bold text-warning">
            {alerts?.filter(a => a?.type === 'warning' && !a?.dismissed)?.length}
          </div>
          <div className="text-xs text-muted-foreground font-bengali">সতর্কতা</div>
        </div>
        <div className="text-center p-3 bg-trust/10 rounded-lg">
          <div className="text-lg font-bold text-trust">
            {alerts?.filter(a => a?.type === 'info' && !a?.dismissed)?.length}
          </div>
          <div className="text-xs text-muted-foreground font-bengali">তথ্য</div>
        </div>
        <div className="text-center p-3 bg-success/10 rounded-lg">
          <div className="text-lg font-bold text-success">
            {alerts?.filter(a => a?.type === 'success' && !a?.dismissed)?.length}
          </div>
          <div className="text-xs text-muted-foreground font-bengali">সফল</div>
        </div>
      </div>
      {/* Alerts List */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {activeAlerts?.map((alert) => (
          <div
            key={alert?.id}
            className={`border rounded-lg p-4 transition-all duration-200 ${getAlertColor(alert?.type)} ${
              alert?.type === 'critical' ? 'animate-pulse' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-3">
                <Icon name={getAlertIcon(alert?.type)} size={20} />
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium font-bengali">{alert?.title}</h4>
                    <span className="text-xs px-2 py-1 rounded-full bg-current/10">
                      {getAlertText(alert?.type)}
                    </span>
                  </div>
                  <p className="text-sm opacity-90 font-bengali">{alert?.message}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  onClick={() => handleDismissAlert(alert?.id)}
                  className="p-1 hover:bg-current/10 rounded transition-colors duration-200"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs opacity-75">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Icon name="MapPin" size={12} />
                  <span className="font-bengali">{alert?.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={12} />
                  <span className="font-bengali">{formatTimeAgo(alert?.timestamp)}</span>
                </div>
                {alert?.affectedUsers > 0 && (
                  <div className="flex items-center space-x-1">
                    <Icon name="Users" size={12} />
                    <span className="font-bengali">{alert?.affectedUsers} জন প্রভাবিত</span>
                  </div>
                )}
              </div>
              
              {alert?.actionRequired && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResolveAlert(alert?.id)}
                    className="text-xs"
                  >
                    <span className="font-bengali">সমাধান</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {activeAlerts?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="CheckCircle" size={48} className="mx-auto text-success mb-3" />
          <h4 className="font-medium text-text-primary font-bengali mb-1">কোনো সতর্কতা নেই</h4>
          <p className="text-sm text-muted-foreground font-bengali">সব সিস্টেম স্বাভাবিকভাবে কাজ করছে</p>
        </div>
      )}
      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground font-bengali">
            সর্বশেষ আপডেট: {new Date()?.toLocaleTimeString('bn-BD')}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="Bell">
              <span className="font-bengali">নোটিফিকেশন সেটিংস</span>
            </Button>
            <Button variant="outline" size="sm" iconName="History">
              <span className="font-bengali">সতর্কতার ইতিহাস</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAlerts;