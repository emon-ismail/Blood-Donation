import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import StarRating from '../../components/ui/StarRating';
import RatingModal from '../../components/RatingModal';
import { supabase } from '../../lib/supabase';
import { donorService } from '../../lib/donorService';
import { useAuth } from '../../contexts/AuthContext';

const DonorProfile = () => {
  const { donorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [donorRatings, setDonorRatings] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const [ratingsCount, setRatingsCount] = useState(0);

  useEffect(() => {
    // Check if user is logged in
    const donorUser = JSON.parse(localStorage.getItem('donor_user') || 'null');
    
    if (!donorUser) {
      // Store current profile URL for return after login
      localStorage.setItem('returnUrl', window.location.href);
      alert('প্রোফাইল দেখতে প্রথমে লগইন করুন');
      navigate('/donor-dashboard');
      return;
    }
    
    loadDonorProfile();
  }, [donorId, navigate]);

  const loadDonorProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('donors')
        .select('*')
        .eq('id', donorId)
        .single();

      if (error || !data) {
        alert('দাতার প্রোফাইল পাওয়া যায়নি');
        navigate('/blood-requests');
        return;
      }

      // Calculate additional data using same logic as find-donors
      const donorWithExtras = {
        ...data,
        totalDonations: data.total_donations || 0,
        responseTime: `${data.response_time_minutes || 15} মিনিট`,
        rating: parseFloat((data.rating || 0).toFixed(1)),
        reviewCount: 1,
        distance: '0.0 কিমি',
        lastDonation: data.last_donation_date ? new Date(data.last_donation_date).toLocaleDateString('bn-BD') : 'কখনো দান করেননি',
        about: 'নিবন্ধিত রক্তদাতা',
        achievements: ['নতুন দাতা']
      };

      setDonor(donorWithExtras);
      
      // Load ratings count
      if (donorWithExtras.rating > 0) {
        const ratings = await donorService.getDonorRatings(donorWithExtras.id);
        setRatingsCount(ratings.length);
      }
    } catch (error) {
      console.error('Failed to load donor profile:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleContact = (method = 'phone') => {
    const message = `আসসালামু আলাইকুম। আমি LifeLink Bangladesh থেকে যোগাযোগ করছি। আমাদের ${donor.blood_group} রক্তের প্রয়োজন। আপনি কি সাহায্য করতে পারবেন?`;
    
    switch (method) {
      case 'phone':
        window.open(`tel:${donor.mobile}`);
        break;
      case 'sms':
        window.open(`sms:${donor.mobile}?body=${encodeURIComponent(message)}`);
        break;
      case 'email':
        window.open(`mailto:${donor.email || 'donor@example.com'}?subject=রক্তদানের অনুরোধ&body=${encodeURIComponent(message)}`);
        break;
      default:
        break;
    }
  };
  
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
      setDonor(prev => ({ ...prev, rating: parseFloat(result.newRating) }));
      alert('ধন্যবাদ! আপনার রেটিং সংরক্ষিত হয়েছে।');
      // Reload ratings count
      const ratings = await donorService.getDonorRatings(donor.id);
      setRatingsCount(ratings.length);
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Icon name="Loader2" size={32} className="text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground font-bengali">প্রোফাইল লোড হচ্ছে...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!donor) return null;

  const joinDate = new Date(donor.created_at).toLocaleDateString('bn-BD');
  const age = donor.age || 25;
  const gender = donor.gender === 'male' ? 'পুরুষ' : 'মহিলা';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-brand overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="User" size={24} color="white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h1 className="text-xl font-bengali font-bold text-text-primary">
                      {donor.full_name}
                    </h1>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600 font-bengali">উপলব্ধ</span>
                    </div>
                    {donor.is_verified && (
                      <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bengali">
                        যাচাইকৃত
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center space-x-1">
                      <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                        <span className="text-white font-bold text-xs">{donor.blood_group}</span>
                      </div>
                      <span className="font-bengali">রক্তের গ্রুপ</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
                    <Icon name="MapPin" size={14} />
                    <span className="font-bengali">{donor.district}, {donor.upazila || 'chittagong'}</span>
                    <span className="text-primary font-bengali">{donor.distance} দূরে</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="p-6 border-b">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-text-primary">{donor.totalDonations}</div>
                  <div className="text-sm text-muted-foreground font-bengali">মোট দান</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-text-primary">{donor.responseTime}</div>
                  <div className="text-sm text-muted-foreground font-bengali">সাড়া সময়</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-text-primary">{donor.rating}</div>
                  <div className="text-sm text-muted-foreground font-bengali">রেটিং</div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="p-6 border-b">
              <div className="grid grid-cols-2 gap-3">
                <a 
                  href={`tel:${donor.mobile}`}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <Icon name="Phone" size={16} />
                  <span className="font-bengali">কল করুন</span>
                </a>
                <a 
                  href={`https://wa.me/${donor.mobile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Icon name="MessageCircle" size={16} />
                  <span className="font-bengali">WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Detailed Info */}
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-bengali text-sm text-muted-foreground">বয়স:</span>
                  <span className="font-bengali text-sm">{age} বছর</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bengali text-sm text-muted-foreground">লিঙ্গ:</span>
                  <span className="font-bengali text-sm">{gender}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bengali text-sm text-muted-foreground">শেষ দান:</span>
                  <span className="font-bengali text-sm">{donor.lastDonation}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bengali text-sm text-muted-foreground">যোগদান:</span>
                  <span className="font-bengali text-sm">{joinDate}</span>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="font-bengali font-semibold text-text-primary mb-2">সম্পর্কে:</h3>
                  <p className="font-bengali text-sm text-muted-foreground">{donor.about}</p>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="font-bengali font-semibold text-text-primary mb-2">অর্জন:</h3>
                  <div className="flex flex-wrap gap-2">
                    {donor.achievements?.map((achievement, index) => (
                      <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bengali">
                        {achievement}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Reviews Section */}
                {donor.rating > 0 && (
                  <div className="pt-4 border-t">
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
                      <div className="mt-4 space-y-4 max-h-60 overflow-y-auto">
                        {donorRatings.map((rating, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                  <Icon name="User" size={14} color="white" />
                                </div>
                                <div>
                                  <div className="font-medium text-sm text-text-primary">{rating.reviewer_name}</div>
                                  <StarRating rating={rating.rating} size={14} showValue={false} className="mt-1" />
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground font-bengali">
                                {new Date(rating.created_at).toLocaleDateString('bn-BD')}
                              </span>
                            </div>
                            {rating.comment && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-sm text-muted-foreground font-bengali leading-relaxed break-words whitespace-pre-wrap">
                                  "{rating.comment}"
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="pt-4 border-t space-y-3">
                  <button 
                    onClick={() => handleContact('email')}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Icon name="Mail" size={16} />
                    <span className="font-bengali">ইমেইল পাঠান</span>
                  </button>
                  <button 
                    onClick={() => handleContact('sms')}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Icon name="MessageSquare" size={16} />
                    <span className="font-bengali">SMS পাঠান</span>
                  </button>
                  <button 
                    onClick={handleRating}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Icon name="Star" size={16} />
                    <span className="font-bengali">রেটিং দিন</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
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

export default DonorProfile;