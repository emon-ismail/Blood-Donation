import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { useNavigate } from 'react-router-dom';

const SuccessMessage = ({ donorData }) => {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate('/donor-dashboard');
  };

  const handleFindDonors = () => {
    navigate('/find-donors');
  };

  return (
    <div className="text-center space-y-8">
      {/* Success Animation */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-success to-secondary rounded-full flex items-center justify-center shadow-brand-lg">
            <Icon name="Check" size={48} color="white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center animate-pulse">
            <Icon name="Heart" size={20} color="white" />
          </div>
          {/* Floating particles */}
          <div className="absolute -top-4 -left-4 w-3 h-3 bg-success rounded-full animate-bounce"></div>
          <div className="absolute -bottom-2 -right-6 w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute -top-6 right-2 w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
      {/* Success Message */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bengali font-bold text-success">
          অভিনন্দন! 🎉
        </h2>
        <p className="text-xl font-bengali text-primary">
          আপনি সফলভাবে রক্তদাতা হিসেবে নিবন্ধিত হয়েছেন
        </p>
        <p className="text-muted-foreground font-bengali max-w-md mx-auto">
          আপনার তথ্য আমাদের ডাটাবেসে যুক্ত হয়েছে। এখন থেকে রক্তের প্রয়োজনে আপনার সাথে যোগাযোগ করা হবে।
        </p>
      </div>
      {/* Donor Card Preview */}
      <div className="bg-gradient-to-br from-primary to-secondary rounded-xl p-6 text-white shadow-brand-lg max-w-sm mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Heart" size={24} color="white" />
            <span className="font-bengali font-bold">LifeLink</span>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-80 font-bengali">ডোনার ID</p>
            <p className="font-bold">LD{Math.floor(Math.random() * 10000)?.toString()?.padStart(4, '0')}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-bengali font-bold text-lg">{donorData?.fullName}</h3>
          <div className="flex items-center justify-between text-sm">
            <span className="font-bengali">রক্তের গ্রুপ:</span>
            <span className="font-bold text-lg">{donorData?.bloodGroup}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-bengali">জেলা:</span>
            <span>{donorData?.district}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-bengali">মোবাইল:</span>
            <span>{donorData?.mobile}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
          <span className="text-xs font-bengali opacity-80">নিবন্ধনের তারিখ</span>
          <span className="text-xs">{new Date()?.toLocaleDateString('bn-BD')}</span>
        </div>
      </div>
      {/* Impact Stats */}
      <div className="bg-card rounded-lg p-6 shadow-brand">
        <h3 className="text-lg font-bengali font-semibold text-primary mb-4">আপনার যোগদানে</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Icon name="Users" size={24} color="var(--color-success)" />
            </div>
            <p className="text-2xl font-bold text-success">১২,৫৪৪</p>
            <p className="text-xs font-bengali text-muted-foreground">মোট দাতা</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Icon name="Heart" size={24} color="var(--color-primary)" />
            </div>
            <p className="text-2xl font-bold text-primary">৮,৭৬৫</p>
            <p className="text-xs font-bengali text-muted-foreground">জীবন রক্ষা</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Icon name="MapPin" size={24} color="var(--color-secondary)" />
            </div>
            <p className="text-2xl font-bold text-secondary">৬৪</p>
            <p className="text-xs font-bengali text-muted-foreground">জেলায় সেবা</p>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <Button
          variant="default"
          onClick={handleGoToDashboard}
          iconName="LayoutDashboard"
          iconPosition="left"
          fullWidth
        >
          <span className="font-bengali">ড্যাশবোর্ড দেখুন</span>
        </Button>

        <Button
          variant="outline"
          onClick={handleFindDonors}
          iconName="Search"
          iconPosition="left"
          fullWidth
        >
          <span className="font-bengali">দাতা খুঁজুন</span>
        </Button>
      </div>
      {/* Next Steps */}
      <div className="bg-trust/5 rounded-lg p-6 border border-trust/20 text-left">
        <h4 className="font-bengali font-semibold text-trust mb-3 flex items-center">
          <Icon name="Lightbulb" size={20} className="mr-2" />
          পরবর্তী পদক্ষেপ
        </h4>
        <ul className="font-bengali text-trust/80 space-y-2 text-sm">
          <li className="flex items-start">
            <Icon name="Check" size={16} className="mr-2 mt-0.5 text-success" />
            আপনার প্রোফাইল সম্পূর্ণ করুন
          </li>
          <li className="flex items-start">
            <Icon name="Check" size={16} className="mr-2 mt-0.5 text-success" />
            রক্তদানের জন্য প্রস্তুত থাকুন
          </li>
          <li className="flex items-start">
            <Icon name="Check" size={16} className="mr-2 mt-0.5 text-success" />
            বন্ধুদের সাথে শেয়ার করুন
          </li>
          <li className="flex items-start">
            <Icon name="Check" size={16} className="mr-2 mt-0.5 text-success" />
            নিয়মিত স্বাস্থ্য পরীক্ষা করান
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SuccessMessage;