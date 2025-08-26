import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeroSection = () => {
  const navigate = useNavigate();
  const [liveStats, setLiveStats] = useState({
    livesSaved: 523,
    activeDonors: 1247,
    pendingRequests: 18
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        livesSaved: prev?.livesSaved + Math.floor(Math.random() * 2),
        activeDonors: prev?.activeDonors + Math.floor(Math.random() * 3),
        pendingRequests: Math.max(1, prev?.pendingRequests + Math.floor(Math.random() * 3) - 1)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-accent rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Live Stats Banner */}
            <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-brand border border-green-100">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-success font-bengali">লাইভ</span>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Icon name="Heart" size={16} className="text-primary heartbeat" />
                  <span className="font-bold text-primary">{liveStats?.livesSaved}</span>
                  <span className="text-text-secondary font-bengali">জীবন বাঁচানো</span>
                </div>
                <div className="w-px h-4 bg-border"></div>
                <div className="flex items-center space-x-1">
                  <Icon name="Users" size={16} className="text-secondary" />
                  <span className="font-bold text-secondary">{liveStats?.activeDonors}</span>
                  <span className="text-text-secondary font-bengali">সক্রিয় দাতা</span>
                </div>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-primary font-bengali block">আপনার রক্ত,</span>
                <span className="text-secondary font-bengali block">তাদের আশা</span>
              </h1>
              <p className="text-lg sm:text-xl text-text-secondary font-inter italic">
                Your Blood, Their Hope
              </p>
            </div>

            {/* Description */}
            <p className="text-lg text-text-secondary max-w-2xl font-bengali leading-relaxed">
              বাংলাদেশের সবচেয়ে বিশ্বস্ত রক্তদান প্ল্যাটফর্ম। জরুরি মুহূর্তে রক্তের প্রয়োজনে আমরা আছি আপনার পাশে। একসাথে গড়ি একটি সুস্থ ও নিরাপদ বাংলাদেশ।
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                variant="default"
                size="lg"
                iconName="UserPlus"
                iconPosition="left"
                className="text-lg px-8 py-4 shadow-brand hover:shadow-brand-lg transition-all duration-300"
                onClick={() => navigate('/donor-registration')}
              >
                <span className="font-bengali">রক্তদাতা হন</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                iconName="Search"
                iconPosition="left"
                className="text-lg px-8 py-4 border-2 hover:bg-primary hover:text-white transition-all duration-300"
                onClick={() => navigate('/find-donors')}
              >
                <span className="font-bengali">রক্ত খুঁজুন</span>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-8">
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <Icon name="Shield" size={16} className="text-trust" />
                <span className="font-bengali">১০০% নিরাপদ</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <Icon name="Clock" size={16} className="text-warning" />
                <span className="font-bengali">২৪/৭ সেবা</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <Icon name="MapPin" size={16} className="text-success" />
                <span className="font-bengali">সারাদেশে</span>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            {/* Main Hero Image */}
            <div className="relative z-10 bg-white rounded-3xl shadow-brand-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Blood donation hero"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              
              {/* Floating Stats Cards */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-brand">
                <div className="flex items-center space-x-2">
                  <Icon name="TrendingUp" size={20} className="text-success" />
                  <div>
                    <p className="text-xs text-text-secondary font-bengali">আজকের দান</p>
                    <p className="text-lg font-bold text-success">১২৩</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-brand">
                <div className="flex items-center space-x-2">
                  <Icon name="Users" size={20} className="text-primary" />
                  <div>
                    <p className="text-xs text-text-secondary font-bengali">নতুন দাতা</p>
                    <p className="text-lg font-bold text-primary">৪৫</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center float-up">
              <Icon name="Heart" size={32} className="text-primary heartbeat" />
            </div>
            
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary/10 rounded-full flex items-center justify-center float-up" style={{ animationDelay: '1s' }}>
              <Icon name="Users" size={40} className="text-secondary" />
            </div>
          </div>
        </div>

        {/* Emergency Alert Banner */}
        <div className="mt-16 bg-destructive/10 border border-destructive/20 rounded-2xl p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-destructive rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={24} className="text-white heartbeat" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-destructive font-bengali">জরুরি প্রয়োজন</h3>
                <p className="text-text-secondary font-bengali">
                  ঢাকা মেডিকেল কলেজে O- রক্তের জরুরি প্রয়োজন - {liveStats?.pendingRequests}টি অনুরোধ অপেক্ষমাণ
                </p>
              </div>
            </div>
            <Button
              variant="destructive"
              iconName="Phone"
              iconPosition="left"
              className="heartbeat"
              onClick={() => navigate('/blood-requests')}
            >
              <span className="font-bengali">সাহায্য করুন</span>
            </Button>
          </div>
        </div>
      </div>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          variant="default"
          size="icon"
          className="w-16 h-16 rounded-full shadow-brand-lg hover:shadow-brand-xl transition-all duration-300 heartbeat"
          onClick={() => navigate('/donor-registration')}
        >
          <Icon name="Plus" size={24} />
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;