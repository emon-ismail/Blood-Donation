import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import StarRating from '../../../components/ui/StarRating';
import RatingModal from '../../../components/RatingModal';
import { donorService } from '../../../lib/donorService';
import { useAuth } from '../../../contexts/AuthContext';

const DonorCard = ({ donor, onContact, onQuickCall, onWhatsApp, isEmergencyMode }) => {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [donorRatings, setDonorRatings] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const [ratingsCount, setRatingsCount] = useState(0);

  useEffect(() => {
    if (donor.rating > 0) {
      donorService.getDonorRatings(donor.id).then(ratings => {
        setRatingsCount(ratings.length);
      });
    }
  }, [donor.id, donor.rating]);

  const handleRating = async () => {
    if (!user?.id) {
      alert('রেটিং দিতে আগে লগইন করুন');
      return;
    }

    try {
      const hasRated = await donorService.hasUserRated(donor.id, user.id);
      if (hasRated) {
        alert('আপনি ইতিমধ্যে এই দাতাকে রেটিং দিয়েছেন');
        return;
      }
      setShowRatingModal(true);
    } catch (error) {
      console.error('Error checking rating:', error);
      setShowRatingModal(true);
    }
  };

  const handleRatingSubmit = async (ratingData) => {
    try {
      const result = await donorService.addRating(ratingData);
      // Update local donor rating immediately
      donor.rating = parseFloat(result.newRating);
      alert('ধন্যবাদ! আপনার রেটিং সংরক্ষিত হয়েছে।');
      // Force re-render by updating parent component
      window.location.reload();
    } catch (error) {
      throw error;
    }
  };

  const getAvailabilityStatus = (status) => {
    switch (status) {
      case 'available':
        return { color: 'bg-success', text: 'উপলব্ধ', textColor: 'text-success' };
      case 'recently_donated':
        return { color: 'bg-warning', text: 'সম্প্রতি দান করেছেন', textColor: 'text-warning' };
      case 'unavailable':
        return { color: 'bg-error', text: 'অনুপলব্ধ', textColor: 'text-error' };
      default:
        return { color: 'bg-muted-foreground', text: 'অজানা', textColor: 'text-muted-foreground' };
    }
  };

  const availability = getAvailabilityStatus(donor?.availability);

  const formatLastDonation = (date) => {
    if (!date) return 'কখনো দান করেননি';
    const now = new Date();
    const donationDate = new Date(date);
    const diffTime = Math.abs(now - donationDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} দিন আগে`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} মাস আগে`;
    return `${Math.floor(diffDays / 365)} বছর আগে`;
  };

  return (
    <div className={`bg-white rounded-xl shadow-brand hover:shadow-brand-lg transition-all duration-300 ${
      isEmergencyMode ? 'border-2 border-destructive/20' : ''
    }`}>
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Image
                src={donor?.avatar}
                alt={donor?.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${availability?.color} rounded-full border-2 border-white`}></div>
            </div>
            
            <div>
              <h3 className="text-lg font-bengali font-semibold text-text-primary">
                {donor?.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`text-sm font-medium ${availability?.textColor}`}>
                  {availability?.text}
                </span>
                {donor?.isVerified && (
                  <div className="flex items-center space-x-1">
                    <Icon name="CheckCircle" size={14} color="var(--color-success)" />
                    <span className="text-xs text-success font-bengali">যাচাইকৃত</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Blood Group Badge */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
              {donor?.bloodGroup}
            </div>
            <span className="text-xs text-muted-foreground mt-1 font-bengali">রক্তের গ্রুপ</span>
          </div>
        </div>

        {/* Location & Distance */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="MapPin" size={16} color="var(--color-muted-foreground)" />
            <span className="text-sm text-muted-foreground font-bengali">{donor?.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Navigation" size={16} color="var(--color-muted-foreground)" />
            <span className="text-sm text-muted-foreground">{donor?.distance} কিমি দূরে</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-primary">{donor?.totalDonations}</div>
            <div className="text-xs text-muted-foreground font-bengali">মোট দান</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-secondary">{donor?.responseTime}</div>
            <div className="text-xs text-muted-foreground font-bengali">সাড়া সময়</div>
          </div>
          <div className="text-center">
            <StarRating 
              rating={parseFloat(donor?.rating)} 
              size={14} 
              showValue={false}
              className="justify-center"
            />
            <div className="text-xs text-muted-foreground font-bengali mt-1">{donor?.rating} রেটিং</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="default"
            size={isEmergencyMode ? "lg" : "default"}
            iconName="Phone"
            iconPosition="left"
            onClick={() => onQuickCall(donor)}
            className="font-bengali"
          >
            কল করুন
          </Button>
          
          <Button
            variant="success"
            size={isEmergencyMode ? "lg" : "default"}
            iconName="MessageCircle"
            iconPosition="left"
            onClick={() => onWhatsApp(donor)}
            className="font-bengali"
          >
            WhatsApp
          </Button>
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-4 flex items-center justify-center space-x-2 py-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
        >
          <span className="font-bengali">{isExpanded ? 'কম দেখুন' : 'আরও দেখুন'}</span>
          <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
        </button>
      </div>
      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-border">
          <div className="pt-4 space-y-4">
            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-text-primary font-bengali">বয়স:</span>
                <span className="text-sm text-muted-foreground ml-2">{donor?.age} বছর</span>
              </div>
              <div>
                <span className="text-sm font-medium text-text-primary font-bengali">লিঙ্গ:</span>
                <span className="text-sm text-muted-foreground ml-2 font-bengali">{donor?.gender}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-text-primary font-bengali">শেষ দান:</span>
                <span className="text-sm text-muted-foreground ml-2 font-bengali">
                  {formatLastDonation(donor?.lastDonation)}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-text-primary font-bengali">যোগদান:</span>
                <span className="text-sm text-muted-foreground ml-2 font-bengali">{donor?.joinedDate}</span>
              </div>
            </div>

            {/* Bio */}
            {donor?.bio && (
              <div>
                <span className="text-sm font-medium text-text-primary font-bengali">সম্পর্কে:</span>
                <p className="text-sm text-muted-foreground mt-1 font-bengali">{donor?.bio}</p>
              </div>
            )}

            {/* Achievements */}
            {donor?.achievements && donor?.achievements?.length > 0 && (
              <div>
                <span className="text-sm font-medium text-text-primary font-bengali">অর্জন:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {donor?.achievements?.map((achievement, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-success/10 text-success text-xs rounded-full font-bengali"
                    >
                      {achievement}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            {donor.rating > 0 && (
              <div className="pt-4 border-t border-border">
                <button
                  onClick={async () => {
                    if (!showReviews) {
                      const ratings = await donorService.getDonorRatings(donor.id);
                      setDonorRatings(ratings);
                      setRatingsCount(ratings.length);
                    }
                    setShowReviews(!showReviews);
                  }}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="text-sm font-medium text-text-primary font-bengali">
                    রিভিউ দেখুন ({ratingsCount})
                  </span>
                  <Icon name={showReviews ? "ChevronUp" : "ChevronDown"} size={16} />
                </button>
                
                {showReviews && (
                  <div className="mt-3 space-y-3 max-h-40 overflow-y-auto">
                    {donorRatings.map((rating, index) => (
                      <div key={index} className="bg-muted/30 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <StarRating rating={rating.rating} size={12} showValue={false} />
                            <span className="text-xs font-medium">{rating.reviewer_name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(rating.created_at).toLocaleDateString('bn-BD')}
                          </span>
                        </div>
                        {rating.comment && (
                          <p className="text-xs text-muted-foreground font-bengali">
                            "{rating.comment}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Contact Options */}
            <div className="pt-4 border-t border-border">
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Mail"
                  iconPosition="left"
                  onClick={() => onContact(donor, 'email')}
                  className="font-bengali"
                >
                  ইমেইল পাঠান
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  iconName="MessageSquare"
                  iconPosition="left"
                  onClick={() => onContact(donor, 'sms')}
                  className="font-bengali"
                >
                  SMS পাঠান
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Star"
                  iconPosition="left"
                  onClick={handleRating}
                  className="font-bengali"
                >
                  রেটিং দিন
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Rating Modal */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        donor={donor}
        onSubmit={handleRatingSubmit}
      />
    </div>
  );
};

export default DonorCard;