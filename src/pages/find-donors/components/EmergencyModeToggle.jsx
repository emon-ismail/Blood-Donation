import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmergencyModeToggle = ({ isEmergencyMode, onToggle }) => {
  return (
    <div className={`fixed top-20 right-4 z-40 transition-all duration-300 ${
      isEmergencyMode ? 'animate-pulse' : ''
    }`}>
      <div className={`rounded-xl shadow-brand-lg p-4 ${
        isEmergencyMode 
          ? 'bg-destructive text-white' :'bg-white border border-border'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            isEmergencyMode ? 'bg-white animate-pulse' : 'bg-destructive'
          }`}></div>
          
          <div>
            <h3 className={`font-bengali font-semibold text-sm ${
              isEmergencyMode ? 'text-white' : 'text-text-primary'
            }`}>
              {isEmergencyMode ? 'জরুরি মোড সক্রিয়' : 'জরুরি মোড'}
            </h3>
            <p className={`text-xs ${
              isEmergencyMode ? 'text-white/80' : 'text-muted-foreground'
            } font-bengali`}>
              {isEmergencyMode ? 'দ্রুত অনুসন্ধান' : 'জরুরি অবস্থার জন্য'}
            </p>
          </div>

          <button
            onClick={onToggle}
            className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
              isEmergencyMode 
                ? 'bg-white/20' :'bg-muted'
            }`}
          >
            <div className={`w-5 h-5 rounded-full transition-all duration-300 ${
              isEmergencyMode 
                ? 'bg-white translate-x-6' :'bg-destructive translate-x-0.5'
            }`}></div>
          </button>
        </div>

        {isEmergencyMode && (
          <div className="mt-3 pt-3 border-t border-white/20">
            <div className="flex items-center space-x-2 text-xs text-white/80 font-bengali">
              <Icon name="Zap" size={12} />
              <span>উচ্চ অগ্রাধিকার অনুসন্ধান</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-white/80 font-bengali mt-1">
              <Icon name="Phone" size={12} />
              <span>তাৎক্ষণিক যোগাযোগ</span>
            </div>
          </div>
        )}
      </div>

      {/* Emergency Hotline */}
      {isEmergencyMode && (
        <div className="mt-3 bg-white rounded-xl shadow-brand-lg p-4 border-l-4 border-destructive">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bengali font-semibold text-sm text-text-primary">
                জরুরি হটলাইন
              </h4>
              <p className="text-xs text-muted-foreground font-bengali">
                ২৪/৭ সহায়তা
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              iconName="Phone"
              onClick={() => window.open('tel:+8801234567890')}
              className="heartbeat"
            >
              <span className="font-bengali">কল</span>
            </Button>
          </div>
          <div className="mt-2 text-lg font-bold text-destructive">
            ০১২৩৪-৫৬৭৮৯০
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyModeToggle;