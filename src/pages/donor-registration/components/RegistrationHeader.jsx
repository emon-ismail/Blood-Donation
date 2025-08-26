import React from 'react';
import Icon from '../../../components/AppIcon';

const RegistrationHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-brand">
            <Icon name="Heart" size={40} color="white" className="heartbeat" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
            <Icon name="Plus" size={16} color="white" />
          </div>
        </div>
      </div>
      
      <h1 className="text-3xl font-bengali font-bold text-primary mb-3">
        জীবন রক্ষাকারী হন
      </h1>
      <p className="text-lg text-text-secondary font-bengali mb-2">
        রক্তদাতা হিসেবে নিবন্ধন করুন
      </p>
      <p className="text-sm text-muted-foreground font-bengali max-w-md mx-auto">
        আপনার একটি রক্তদান অন্য কারো জীবন বাঁচাতে পারে। আমাদের সাথে যুক্ত হয়ে মানবতার সেবা করুন।
      </p>
      
      <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={16} color="var(--color-success)" />
          <span className="font-bengali">নিরাপদ ও গোপনীয়</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Clock" size={16} color="var(--color-trust)" />
          <span className="font-bengali">২ মিনিটে সম্পন্ন</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Users" size={16} color="var(--color-secondary)" />
          <span className="font-bengali">১২,৫৪৩+ দাতা</span>
        </div>
      </div>
    </div>
  );
};

export default RegistrationHeader;