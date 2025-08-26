import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { donorService } from '../../lib/donorService';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../utils/translations';
import BloodGroupSelector from './components/BloodGroupSelector';
import LocationSelector from './components/LocationSelector';
import AdvancedFilters from './components/AdvancedFilters';
import SearchResults from './components/SearchResults';
import EmergencyModeToggle from './components/EmergencyModeToggle';
import QuickActions from './components/QuickActions';

const FindDonors = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [filters, setFilters] = useState({});
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(true);

  // Load real donors from database on component mount
  useEffect(() => {
    loadAllDonors();
  }, []);

  const loadAllDonors = async () => {
    try {
      const donors = await donorService.searchDonors({
        bloodGroup: '',
        location: '',
        availability: 'all'
      });
      
      // Transform data for display
      const transformedDonors = donors.map(donor => ({
        id: donor.id,
        name: donor.full_name,
        bloodGroup: donor.blood_group,
        location: `${donor.upazila}, ${donor.district}`,
        distance: '0.0',
        availability: donor.availability || 'available',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(donor.full_name)}&background=C41E3A&color=fff`,
        totalDonations: 0,
        responseTime: '১৫ মিনিট',
        rating: '4.5',
        age: donor.age,
        gender: donor.gender === 'male' ? 'পুরুষ' : 'মহিলা',
        lastDonation: '2024-06-15',
        joinedDate: new Date(donor.created_at).toLocaleDateString('bn-BD'),
        isVerified: donor.is_verified,
        bio: 'নিবন্ধিত রক্তদাতা',
        achievements: ['নতুন দাতা'],
        mobile: donor.mobile
      }));
      
      setSearchResults(transformedDonors);
      setHasSearched(true);
    } catch (error) {
      console.error('Failed to load donors:', error);
    }
  };

  // Remove mock donor data


  useEffect(() => {
    // Check for emergency mode in URL params
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams?.get('emergency') === 'true') {
      setIsEmergencyMode(true);
    }
  }, []);

  const handleSearch = async () => {
    if (!selectedBloodGroup) {
      alert('অনুগ্রহ করে রক্তের গ্রুপ নির্বাচন করুন');
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      // Search real donors from database with filters
      const searchFilters = {
        bloodGroup: selectedBloodGroup,
        district: selectedLocation?.district,
        availability: filters?.availability
      };

      const donors = await donorService.searchDonors(searchFilters);
      
      // Transform data for display
      const transformedDonors = donors.map(donor => ({
        id: donor.id,
        name: donor.full_name,
        bloodGroup: donor.blood_group,
        location: `${donor.upazila}, ${donor.district}`,
        distance: '0.0',
        availability: donor.availability || 'available',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(donor.full_name)}&background=C41E3A&color=fff`,
        totalDonations: 0,
        responseTime: '১৫ মিনিট',
        rating: '4.5',
        age: donor.age,
        gender: donor.gender === 'male' ? 'পুরুষ' : 'মহিলা',
        lastDonation: '2024-06-15',
        joinedDate: new Date(donor.created_at).toLocaleDateString('bn-BD'),
        isVerified: donor.is_verified,
        bio: 'নিবন্ধিত রক্তদাতা',
        achievements: ['নতুন দাতা'],
        mobile: donor.mobile
      }));

      setSearchResults(transformedDonors);
    } catch (error) {
      console.error('Search error:', error);
      alert('ডেটা লোড করতে সমস্যা হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactDonor = (donor, method = 'phone') => {
    const message = `আসসালামু আলাইকুম। আমি LifeLink Bangladesh থেকে যোগাযোগ করছি। আমাদের ${selectedBloodGroup} রক্তের প্রয়োজন। আপনি কি সাহায্য করতে পারবেন?`;
    
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

  const handleQuickCall = (donor) => {
    window.open(`tel:${donor.mobile}`);
  };

  const handleWhatsApp = (donor) => {
    const message = `আসসালামু আলাইকুম ${donor?.name}। আমি LifeLink Bangladesh থেকে যোগাযোগ করছি। আমাদের ${selectedBloodGroup} রক্তের জরুরি প্রয়োজন। আপনি কি সাহায্য করতে পারবেন? ধন্যবাদ।`;
    const cleanMobile = donor.mobile.replace(/[^0-9]/g, '');
    const whatsappNumber = cleanMobile.startsWith('88') ? cleanMobile : `88${cleanMobile}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.location.href = whatsappUrl;
  };

  const handleContactMultiple = (donorIds) => {
    const selectedDonors = searchResults?.filter(donor => donorIds?.includes(donor?.id));
    const message = `আসসালামু আলাইকুম। আমি LifeLink Bangladesh থেকে যোগাযোগ করছি। আমাদের ${selectedBloodGroup} রক্তের জরুরি প্রয়োজন। আপনি কি সাহায্য করতে পারবেন?`;
    
    // For demo, just show alert
    alert(`${selectedDonors?.length} জন দাতার সাথে একসাথে যোগাযোগ করা হচ্ছে...`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Emergency Mode Toggle */}
      <EmergencyModeToggle 
        isEmergencyMode={isEmergencyMode}
        onToggle={() => setIsEmergencyMode(!isEmergencyMode)}
      />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <Icon name="Search" size={24} color="white" />
              </div>
              <h1 className={`text-3xl font-bold text-text-primary ${language === 'bn' ? 'font-bengali' : ''}`}>
                {t('findDonors', language)}
              </h1>
            </div>
            <p className="text-muted-foreground font-bengali max-w-2xl mx-auto">
              আপনার এলাকার নিকটতম রক্তদাতাদের খুঁজে পান এবং তাৎক্ষণিক যোগাযোগ করুন।\n
              জরুরি অবস্থায় দ্রুত সাহায্য পেতে জরুরি মোড চালু করুন।
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Search Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Blood Group Selection */}
              <BloodGroupSelector
                selectedBloodGroup={selectedBloodGroup}
                onBloodGroupSelect={setSelectedBloodGroup}
                isEmergencyMode={isEmergencyMode}
              />

              {/* Location Selection */}
              <LocationSelector
                selectedLocation={selectedLocation}
                onLocationSelect={setSelectedLocation}
                isEmergencyMode={isEmergencyMode}
              />

              {/* Advanced Filters */}
              <AdvancedFilters
                filters={filters}
                onFiltersChange={setFilters}
                isExpanded={isFiltersExpanded}
                onToggleExpanded={() => setIsFiltersExpanded(!isFiltersExpanded)}
              />

              {/* Search Button */}
              <div className="text-center">
                <Button
                  variant="default"
                  size={isEmergencyMode ? "xl" : "lg"}
                  iconName="Search"
                  iconPosition="left"
                  onClick={handleSearch}
                  loading={isLoading}
                  className="font-bengali min-w-[200px]"
                >
                  {isLoading ? 'খোঁজা হচ্ছে...' : 'রক্তদাতা খুঁজুন'}
                </Button>
              </div>

              {/* Search Results */}
              <SearchResults
                  donors={searchResults}
                  isLoading={isLoading}
                  searchQuery={selectedBloodGroup}
                  onContactDonor={handleContactDonor}
                  onQuickCall={handleQuickCall}
                  onWhatsApp={handleWhatsApp}
                  onContactMultiple={handleContactMultiple}
                  isEmergencyMode={isEmergencyMode}
                />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <QuickActions
                onPostRequest={() => navigate('/blood-requests')}
                onViewRequests={() => navigate('/blood-requests')}
                onRegisterAsDonor={() => navigate('/donor-registration')}
                isEmergencyMode={isEmergencyMode}
              />

              {/* Recent Searches */}
              <div className="bg-white rounded-xl shadow-brand p-6">
                <h3 className="font-bengali font-semibold text-text-primary mb-4">
                  সাম্প্রতিক অনুসন্ধান
                </h3>
                <div className="space-y-3">
                  {[
                    { bloodGroup: 'A+', location: 'ধানমন্ডি', time: '২ ঘন্টা আগে' },
                    { bloodGroup: 'O+', location: 'গুলশান', time: '১ দিন আগে' },
                    { bloodGroup: 'B+', location: 'উত্তরা', time: '৩ দিন আগে' }
                  ]?.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedBloodGroup(search?.bloodGroup);
                        setSelectedLocation({ name: search?.location });
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">{search?.bloodGroup}</span>
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-medium text-text-primary font-bengali">
                            {search?.location}
                          </div>
                          <div className="text-xs text-muted-foreground font-bengali">
                            {search?.time}
                          </div>
                        </div>
                      </div>
                      <Icon name="ChevronRight" size={16} color="var(--color-muted-foreground)" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-white rounded-xl shadow-brand p-6">
                <h3 className="font-bengali font-semibold text-text-primary mb-4">
                  আজকের পরিসংখ্যান
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-bengali">সফল যোগাযোগ</span>
                    <span className="text-lg font-bold text-success">১২৩</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-bengali">নতুন দাতা</span>
                    <span className="text-lg font-bold text-primary">৪৫</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-bengali">জরুরি সাহায্য</span>
                    <span className="text-lg font-bold text-accent">৮</span>
                  </div>
                </div>
              </div>

              {/* Help & Support */}
              <div className="bg-gradient-to-br from-trust to-trust/80 text-white rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Icon name="HelpCircle" size={24} color="white" />
                  <h3 className="font-bengali font-semibold">সাহায্য প্রয়োজন?</h3>
                </div>
                <p className="text-sm opacity-90 font-bengali mb-4">
                  রক্তদাতা খোঁজার ব্যাপারে কোনো সমস্যা হলে আমাদের সাথে যোগাযোগ করুন।
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="MessageCircle"
                  iconPosition="left"
                  className="text-trust border-white hover:bg-white hover:text-trust font-bengali"
                >
                  সাহায্য নিন
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FindDonors;