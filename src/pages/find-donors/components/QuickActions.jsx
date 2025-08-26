import React from 'react';
import Icon from '../../../components/AppIcon';


const QuickActions = ({ onPostRequest, onViewRequests, onRegisterAsDonor, isEmergencyMode }) => {
  const actions = [
    {
      id: 'post_request',
      title: 'রক্তের অনুরোধ পোস্ট করুন',
      description: 'আপনার প্রয়োজন কমিউনিটিতে জানান',
      icon: 'Megaphone',
      color: 'bg-primary',
      textColor: 'text-white',
      onClick: onPostRequest
    },
    {
      id: 'view_requests',
      title: 'সব অনুরোধ দেখুন',
      description: 'অন্যদের সাহায্য করুন',
      icon: 'Heart',
      color: 'bg-secondary',
      textColor: 'text-white',
      onClick: onViewRequests
    },
    {
      id: 'register_donor',
      title: 'রক্তদাতা হিসেবে যোগ দিন',
      description: 'জীবন বাঁচানোর মিশনে অংশ নিন',
      icon: 'UserPlus',
      color: 'bg-accent',
      textColor: 'text-white',
      onClick: onRegisterAsDonor
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-brand p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bengali font-semibold text-text-primary">
          দ্রুত কার্যক্রম
        </h2>
        {isEmergencyMode && (
          <div className="flex items-center space-x-2 text-destructive">
            <Icon name="Zap" size={16} />
            <span className="text-sm font-bengali font-medium">জরুরি সহায়তা</span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions?.map((action) => (
          <button
            key={action?.id}
            onClick={action?.onClick}
            className={`${action?.color} ${action?.textColor} rounded-lg p-6 text-left hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-brand hover:shadow-brand-lg`}
          >
            <div className="flex items-start justify-between mb-3">
              <Icon name={action?.icon} size={24} color="white" />
              <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
            </div>
            
            <h3 className="font-bengali font-semibold text-sm mb-2">
              {action?.title}
            </h3>
            
            <p className="text-xs opacity-90 font-bengali">
              {action?.description}
            </p>

            <div className="flex items-center justify-end mt-4">
              <Icon name="ArrowRight" size={16} color="white" />
            </div>
          </button>
        ))}
      </div>
      {/* Emergency Contact Cards */}
      {isEmergencyMode && (
        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="font-bengali font-semibold text-text-primary mb-3">
            জরুরি যোগাযোগ
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center space-x-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
              <div className="w-10 h-10 bg-destructive rounded-full flex items-center justify-center">
                <Icon name="Phone" size={18} color="white" />
              </div>
              <div>
                <div className="font-bengali font-medium text-destructive">জাতীয় হটলাইন</div>
                <div className="text-sm text-destructive/80">৯৯৯ (বিনামূল্যে)</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-success/10 rounded-lg border border-success/20">
              <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
                <Icon name="MessageCircle" size={18} color="white" />
              </div>
              <div>
                <div className="font-bengali font-medium text-success">WhatsApp সহায়তা</div>
                <div className="text-sm text-success/80">০১৭১২-৩৪৫৬৭ৈ</div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Tips Section */}
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Lightbulb" size={20} color="var(--color-warning)" />
          <div>
            <h4 className="font-bengali font-medium text-text-primary mb-2">
              💡 দ্রুত ফলাফলের জন্য টিপস
            </h4>
            <ul className="text-sm text-muted-foreground font-bengali space-y-1">
              <li>• একাধিক রক্তের গ্রুপ নির্বাচন করুন (A+, O+ ইত্যাদি)</li>
              <li>• অনুসন্ধানের পরিসীমা বাড়ান</li>
              <li>• জরুরি মোড চালু করুন তাৎক্ষণিক সাহায্যের জন্য</li>
              <li>• একসাথে একাধিক দাতার সাথে যোগাযোগ করুন</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;