import React from 'react';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const ContactStep = ({ formData, setFormData, errors }) => {
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6 shadow-brand">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Phone" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="text-lg font-bengali font-semibold text-primary">যোগাযোগের তথ্য</h3>
            <p className="text-sm text-muted-foreground font-bengali">আপনার সাথে যোগাযোগের মাধ্যম</p>
          </div>
        </div>

        <div className="space-y-6">
          <Input
            label="মোবাইল নম্বর"
            type="tel"
            placeholder="০১৭xxxxxxxx"
            value={formData?.mobile}
            onChange={(e) => handleInputChange('mobile', e?.target?.value)}
            error={errors?.mobile}
            required
            description="এই নম্বরে OTP পাঠানো হবে"
          />

          <Input
            label="ইমেইল ঠিকানা"
            type="email"
            placeholder="example@email.com"
            value={formData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            error={errors?.email}
            required
            description="লগইন এবং গুরুত্বপূর্ণ আপডেটের জন্য"
          />


        </div>

        {/* Communication Preferences */}
        <div className="mt-8">
          <h4 className="text-md font-bengali font-semibold text-primary mb-4">যোগাযোগের পছন্দ</h4>
          
          <div className="space-y-4">
            <Checkbox
              label="SMS এর মাধ্যমে রক্তের অনুরোধ পেতে চাই"
              checked={formData?.smsNotifications}
              onChange={(e) => handleCheckboxChange('smsNotifications', e?.target?.checked)}
            />

            <Checkbox
              label="ফোন কলের মাধ্যমে যোগাযোগ গ্রহণযোগ্য"
              checked={formData?.phoneCallsAllowed}
              onChange={(e) => handleCheckboxChange('phoneCallsAllowed', e?.target?.checked)}
            />

            <Checkbox
              label="WhatsApp এ যোগাযোগ করা যাবে"
              checked={formData?.whatsappAllowed}
              onChange={(e) => handleCheckboxChange('whatsappAllowed', e?.target?.checked)}
            />

            <Checkbox
              label="জরুরি অবস্থায় যেকোনো সময় যোগাযোগ করা যাবে"
              checked={formData?.emergencyContactAllowed}
              onChange={(e) => handleCheckboxChange('emergencyContactAllowed', e?.target?.checked)}
            />
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-6 p-4 bg-success/5 rounded-lg border border-success/20">
          <div className="flex items-start space-x-3">
            <Icon name="Shield" size={16} color="var(--color-success)" className="mt-0.5" />
            <div className="text-sm">
              <p className="font-bengali text-success font-medium mb-1">গোপনীয়তার নিশ্চয়তা:</p>
              <ul className="font-bengali text-success/80 space-y-1">
                <li>• আপনার ব্যক্তিগত তথ্য সম্পূর্ণ সুরক্ষিত থাকবে</li>
                <li>• শুধুমাত্র রক্তের প্রয়োজনে যোগাযোগ করা হবে</li>
                <li>• তৃতীয় পক্ষের সাথে তথ্য শেয়ার করা হবে না</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="mt-6">
          <Checkbox
            label="আমি শর্তাবলী ও গোপনীয়তা নীতি পড়েছি এবং সম্মত আছি"
            checked={formData?.agreeToTerms}
            onChange={(e) => handleCheckboxChange('agreeToTerms', e?.target?.checked)}
            required
            error={errors?.agreeToTerms}
          />
          {errors?.submit && (
            <p className="mt-2 text-sm text-destructive font-bengali">{errors?.submit}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactStep;