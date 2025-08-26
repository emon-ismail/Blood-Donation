import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SuccessStoriesCarousel = () => {
  const [currentStory, setCurrentStory] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const successStories = [
    {
      id: 1,
      type: 'patient',
      name: 'রহিমা খাতুন',
      age: 35,
      location: 'ঢাকা',
      story: `আমার ছোট মেয়ের জরুরি অপারেশনের জন্য O- রক্তের প্রয়োজন ছিল। রাত ২টায় LifeLink-এ পোস্ট করার ১৫ মিনিটের মধ্যেই ৩ জন দাতা যোগাযোগ করেন। আল্লাহর রহমতে আমার মেয়ে আজ সুস্থ।`,
      image: 'https://images.unsplash.com/photo-1594824388853-2c5899d87b29?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      donorName: 'সাকিব হাসান',
      bloodGroup: 'O-',
      date: '১৫ আগস্ট, ২০২৪',
      impact: 'জীবন বাঁচানো'
    },
    {
      id: 2,
      type: 'donor',
      name: 'ডাঃ আহমেদ করিম',
      age: 42,
      location: 'চট্টগ্রাম',
      story: `গত ২ বছরে LifeLink-এর মাধ্যমে ১২ বার রক্তদান করেছি। প্রতিবার যখন কোনো পরিবার ধন্যবাদ জানায়, মনে হয় এর চেয়ে বড় পুরস্কার আর কিছু নেই। রক্তদান আমার জীবনের অংশ হয়ে গেছে।`,
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bloodGroup: 'A+',
      totalDonations: 12,
      date: '২০ আগস্ট, ২০২৪',
      impact: '১২টি জীবন স্পর্শ'
    },
    {
      id: 3,
      type: 'family',
      name: 'নাসির উদ্দিন পরিবার',
      location: 'সিলেট',
      story: `আমার বাবার হার্ট সার্জারির জন্য ৪ ব্যাগ B+ রক্ত লাগত। LifeLink কমিউনিটির সাহায্যে ৬ ঘন্টার মধ্যে সব রক্ত সংগ্রহ হয়ে যায়। এই প্ল্যাটফর্ম আমাদের পরিবারের জন্য আশীর্বাদ।`,
      image: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bloodGroup: 'B+',
      unitsReceived: 4,
      date: '২৫ আগস্ট, ২০২৪',
      impact: 'পরিবার রক্ষা'
    },
    {
      id: 4,
      type: 'community',
      name: 'রাজশাহী বিশ্ববিদ্যালয় ছাত্রলীগ',
      location: 'রাজশাহী',
      story: `আমাদের ক্যাম্পাসে LifeLink-এর সাথে অংশীদারিত্বে মাসিক রক্তদান ক্যাম্প করি। গত ৬ মাসে ২০০+ ছাত্র-ছাত্রী রক্তদান করেছে। এটি আমাদের সামাজিক দায়বদ্ধতার অংশ।`,
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      totalParticipants: 200,
      date: '৩০ আগস্ট, ২০২৪',
      impact: 'কমিউনিটি সেবা'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPlaying) {
        setCurrentStory((prev) => (prev + 1) % successStories?.length);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [isPlaying, successStories?.length]);

  const getStoryTypeIcon = (type) => {
    const icons = {
      patient: 'Heart',
      donor: 'User',
      family: 'Users',
      community: 'Building'
    };
    return icons?.[type] || 'Heart';
  };

  const getStoryTypeColor = (type) => {
    const colors = {
      patient: 'text-red-600 bg-red-50',
      donor: 'text-blue-600 bg-blue-50',
      family: 'text-green-600 bg-green-50',
      community: 'text-purple-600 bg-purple-50'
    };
    return colors?.[type] || 'text-red-600 bg-red-50';
  };

  const getStoryTypeLabel = (type) => {
    const labels = {
      patient: 'রোগীর গল্প',
      donor: 'দাতার গল্প',
      family: 'পরিবারের গল্প',
      community: 'কমিউনিটির গল্প'
    };
    return labels?.[type] || 'গল্প';
  };

  return (
    <section className="bg-gradient-to-br from-green-50 to-blue-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-success/10 rounded-full px-4 py-2 mb-4">
            <Icon name="MessageCircle" size={16} className="text-success" />
            <span className="text-sm font-medium text-success font-bengali">সফলতার গল্প</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary font-bengali mb-4">
            আপনাদের অনুপ্রেরণার গল্প
          </h2>
          <p className="text-lg text-text-secondary font-bengali max-w-2xl mx-auto">
            প্রতিটি রক্তদান একটি জীবন বাঁচায়। শুনুন তাদের কথা যারা এই মহৎ কাজের অংশ হয়েছেন।
          </p>
        </div>

        {/* Main Story Display */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-brand-lg overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Story Image */}
              <div className="relative h-64 md:h-auto">
                <img
                  src={successStories?.[currentStory]?.image}
                  alt={successStories?.[currentStory]?.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                
                {/* Story Type Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${getStoryTypeColor(successStories?.[currentStory]?.type)}`}>
                  <div className="flex items-center space-x-1">
                    <Icon name={getStoryTypeIcon(successStories?.[currentStory]?.type)} size={12} />
                    <span className="font-bengali">{getStoryTypeLabel(successStories?.[currentStory]?.type)}</span>
                  </div>
                </div>

                {/* Audio Play Button */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="absolute bottom-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-brand hover:shadow-brand-lg transition-all duration-300"
                >
                  <Icon name={isPlaying ? "Pause" : "Play"} size={20} className="text-primary" />
                </button>
              </div>

              {/* Story Content */}
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-text-primary font-bengali">
                      {successStories?.[currentStory]?.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-text-secondary">
                      {successStories?.[currentStory]?.age && (
                        <>
                          <span>{successStories?.[currentStory]?.age} বছর</span>
                          <span>•</span>
                        </>
                      )}
                      <div className="flex items-center space-x-1">
                        <Icon name="MapPin" size={12} />
                        <span className="font-bengali">{successStories?.[currentStory]?.location}</span>
                      </div>
                    </div>
                  </div>
                  {successStories?.[currentStory]?.bloodGroup && (
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {successStories?.[currentStory]?.bloodGroup}
                      </span>
                    </div>
                  )}
                </div>

                {/* Story Text */}
                <blockquote className="text-text-primary font-bengali leading-relaxed mb-6 text-lg">
                  "{successStories?.[currentStory]?.story}"
                </blockquote>

                {/* Story Metrics */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    {successStories?.[currentStory]?.donorName && (
                      <div className="text-sm">
                        <p className="text-text-secondary font-bengali">দাতা</p>
                        <p className="font-medium text-text-primary font-bengali">
                          {successStories?.[currentStory]?.donorName}
                        </p>
                      </div>
                    )}
                    {successStories?.[currentStory]?.totalDonations && (
                      <div className="text-sm">
                        <p className="text-text-secondary font-bengali">মোট দান</p>
                        <p className="font-medium text-text-primary">
                          {successStories?.[currentStory]?.totalDonations} বার
                        </p>
                      </div>
                    )}
                    {successStories?.[currentStory]?.unitsReceived && (
                      <div className="text-sm">
                        <p className="text-text-secondary font-bengali">প্রাপ্ত ব্যাগ</p>
                        <p className="font-medium text-text-primary">
                          {successStories?.[currentStory]?.unitsReceived} ব্যাগ
                        </p>
                      </div>
                    )}
                    {successStories?.[currentStory]?.totalParticipants && (
                      <div className="text-sm">
                        <p className="text-text-secondary font-bengali">অংশগ্রহণকারী</p>
                        <p className="font-medium text-text-primary">
                          {successStories?.[currentStory]?.totalParticipants}+
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center space-x-1 bg-success/10 rounded-full px-3 py-1">
                      <Icon name="Award" size={12} className="text-success" />
                      <span className="text-xs font-medium text-success font-bengali">
                        {successStories?.[currentStory]?.impact}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mt-1 font-bengali">
                      {successStories?.[currentStory]?.date}
                    </p>
                  </div>
                </div>

                {/* Share Button */}
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Share2"
                  iconPosition="left"
                  className="w-full"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: `${successStories?.[currentStory]?.name}এর গল্প - LifeLink Bangladesh`,
                        text: successStories?.[currentStory]?.story?.substring(0, 100) + '...',
                        url: window.location?.href
                      });
                    }
                  }}
                >
                  <span className="font-bengali">গল্পটি শেয়ার করুন</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center space-x-4 mt-8">
            <button
              onClick={() => setCurrentStory((prev) => (prev - 1 + successStories?.length) % successStories?.length)}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-brand hover:shadow-brand-lg transition-all duration-300"
            >
              <Icon name="ChevronLeft" size={20} />
            </button>

            {/* Story Indicators */}
            <div className="flex space-x-2">
              {successStories?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStory(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentStory ? 'bg-primary w-8' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentStory((prev) => (prev + 1) % successStories?.length)}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-brand hover:shadow-brand-lg transition-all duration-300"
            >
              <Icon name="ChevronRight" size={20} />
            </button>
          </div>
        </div>

        {/* Story Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-2xl mx-auto">
          {[
            { type: 'patient', count: 156, label: 'রোগীর গল্প' },
            { type: 'donor', count: 89, label: 'দাতার গল্প' },
            { type: 'family', count: 67, label: 'পরিবারের গল্প' },
            { type: 'community', count: 23, label: 'কমিউনিটির গল্প' }
          ]?.map((category) => (
            <div key={category?.type} className="bg-white rounded-xl p-4 text-center shadow-brand">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${getStoryTypeColor(category?.type)}`}>
                <Icon name={getStoryTypeIcon(category?.type)} size={16} />
              </div>
              <p className="text-2xl font-bold text-text-primary">{category?.count}</p>
              <p className="text-xs text-text-secondary font-bengali">{category?.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesCarousel;