import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { donorService } from '../../../lib/donorService';

const VerificationStep = ({ formData, onVerificationComplete, errors }) => {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const handleVerifyOTP = async () => {
    setIsVerifying(true);
    
    try {
      // Mock OTP verification - in real app, this would call SMS API
      if (otp === '123456') {
        // Verify donor in database
        await donorService.verifyDonor(formData.donorId);
        onVerificationComplete(true);
      } else {
        onVerificationComplete(false);
      }
    } catch (error) {
      console.error('Verification error:', error);
      onVerificationComplete(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = () => {
    setTimeLeft(120);
    setCanResend(false);
    setOtp('');
    // Mock resend OTP logic
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6 shadow-brand">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Shield" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="text-lg font-bengali font-semibold text-primary">মোবাইল যাচাইকরণ</h3>
            <p className="text-sm text-muted-foreground font-bengali">আপনার নম্বর নিশ্চিত করুন</p>
          </div>
        </div>

        {/* Phone Number Display */}
        <div className="bg-muted rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="Phone" size={20} color="var(--color-primary)" />
              <div>
                <p className="font-bengali text-sm text-muted-foreground">OTP পাঠানো হয়েছে</p>
                <p className="font-semibold text-primary">{formData?.mobile}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bengali text-muted-foreground">সময় বাকি</p>
              <p className="font-bold text-primary">{formatTime(timeLeft)}</p>
            </div>
          </div>
        </div>

        {/* OTP Input */}
        <div className="mb-6">
          <Input
            label="OTP কোড"
            type="text"
            placeholder="৬ সংখ্যার কোড লিখুন"
            value={otp}
            onChange={(e) => setOtp(e?.target?.value)}
            error={errors?.otp}
            required
            maxLength="6"
            className="text-center text-2xl tracking-widest"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="default"
            onClick={handleVerifyOTP}
            loading={isVerifying}
            disabled={otp?.length !== 6}
            iconName="Check"
            iconPosition="left"
            fullWidth
          >
            <span className="font-bengali">যাচাই করুন</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleResendOTP}
            disabled={!canResend}
            iconName="RefreshCw"
            iconPosition="left"
            fullWidth
          >
            <span className="font-bengali">পুনরায় পাঠান</span>
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-trust/5 rounded-lg border border-trust/20">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={16} color="var(--color-trust)" className="mt-0.5" />
            <div className="text-sm">
              <p className="font-bengali text-trust font-medium mb-2">OTP না পেলে:</p>
              <ul className="font-bengali text-trust/80 space-y-1">
                <li>• নেটওয়ার্ক সংযোগ চেক করুন</li>
                <li>• স্প্যাম ফোল্ডার দেখুন</li>
                <li>• ২ মিনিট পর পুনরায় চেষ্টা করুন</li>
                <li>• সমস্যা থাকলে সাহায্য নিন</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mock Credentials Info */}
        <div className="mt-4 p-3 bg-warning/5 rounded-lg border border-warning/20">
          <div className="flex items-center space-x-2">
            <Icon name="Key" size={16} color="var(--color-warning)" />
            <p className="text-sm font-bengali text-warning">
              <strong>পরীক্ষার জন্য:</strong> OTP কোড হিসেবে <strong>123456</strong> ব্যবহার করুন
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationStep;