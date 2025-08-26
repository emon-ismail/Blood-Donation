import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { bloodRequestService, successStoryService } from '../../lib/bloodRequestService';
import RequestForm from './components/RequestForm';
import RequestCard from './components/RequestCard';
import FilterPanel from './components/FilterPanel';
import StatsPanel from './components/StatsPanel';
import SuccessStories from './components/SuccessStories';

const BloodRequestsPage = () => {
  const navigate = useNavigate();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('urgency');
  const [showFilters, setShowFilters] = useState(false);
  const [requests, setRequests] = useState([]);
  const [successStories, setSuccessStories] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({
    bloodGroups: [],
    urgencyLevels: [],
    locations: [],
    unitsNeeded: '',
    verifiedOnly: false,
    timeRange: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (currentFilters = {}, page = 1, showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const [requestsResult, storiesData, statsData] = await Promise.all([
        bloodRequestService.getActiveRequests(currentFilters, page, itemsPerPage),
        successStoryService.getSuccessStories(3),
        bloodRequestService.getRequestStats()
      ]);

      setRequests(requestsResult.data);
      setTotalItems(requestsResult.count);
      setSuccessStories(storiesData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Reload data when filters or page change
  useEffect(() => {
    loadData(filters, currentPage);
  }, [filters, currentPage]);

  // Transform requests for display with safe defaults
  const displayRequests = (requests || []).map(request => ({
    id: request?.id || '',
    patientName: request?.patient_name || '',
    bloodGroup: request?.blood_group || '',
    unitsNeeded: request?.units_needed || 0,
    hospital: request?.hospital || '',
    location: request?.location || '',
    contactPerson: request?.contact_person || '',
    contactPhone: request?.contact_phone || '',
    urgencyLevel: request?.urgency_level || 'standard',
    requiredBy: request?.required_by || new Date().toISOString(),
    additionalInfo: request?.additional_info || '',
    postedAt: request?.created_at || new Date().toISOString(),
    verified: request?.verified || false,
    pledges: 0,
    shares: 0,
    views: 0
  }));

  // Transform success stories with safe defaults
  const displayStories = (successStories || []).map(story => ({
    patientName: story?.patient_name || '',
    bloodGroup: story?.blood_group || '',
    message: story?.message || '',
    location: story?.location || '',
    donorsHelped: story?.donors_helped || 0,
    completedDate: story?.completed_date ? new Date(story.completed_date).toLocaleDateString('bn-BD') : ''
  }));

  // Stats data
  const displayStats = {
    totalRequests: stats.total || 0,
    emergencyRequests: stats.emergency || 0,
    fulfilledRequests: stats.fulfilled || 0,
    totalPledges: (stats.total || 0) * 2
  };

  // Apply client-side search only (server handles other filters)
  const searchFilteredRequests = searchQuery 
    ? displayRequests.filter(request => {
        const query = searchQuery.toLowerCase();
        return (request.patientName || '').toLowerCase().includes(query) ||
               (request.hospital || '').toLowerCase().includes(query) ||
               (request.location || '').toLowerCase().includes(query) ||
               (request.bloodGroup || '').toLowerCase().includes(query);
      })
    : displayRequests;

  // Sort requests with error handling
  const sortedRequests = [...(searchFilteredRequests || [])].sort((a, b) => {
    try {
      switch (sortBy) {
        case 'urgency':
          const urgencyOrder = { emergency: 0, urgent: 1, standard: 2 };
          return (urgencyOrder[a?.urgencyLevel] || 999) - (urgencyOrder[b?.urgencyLevel] || 999);
        case 'time':
          return new Date(a?.requiredBy || 0) - new Date(b?.requiredBy || 0);
        case 'recent':
          return new Date(b?.postedAt || 0) - new Date(a?.postedAt || 0);
        case 'location':
          return (a?.location || '').localeCompare(b?.location || '');
        default:
          return 0;
      }
    } catch (error) {
      console.error('Sort error:', error);
      return 0;
    }
  });

  const handleRequestSubmit = async (formData) => {
    try {
      await bloodRequestService.createRequest(formData);
      setShowRequestForm(false);
      // Reload data with current filters without showing loading
      setCurrentPage(1); // Reset to first page
      await loadData(filters, 1, false);
      alert('অনুরোধ সফলভাবে জমা দেওয়া হয়েছে!');
    } catch (error) {
      console.error('Failed to submit request:', error);
      alert('অনুরোধ জমা দিতে সমস্যা হয়েছে।');
    }
  };



  const handleContact = (request) => {
    // Open phone dialer
    window.location.href = `tel:${request?.contactPhone}`;
  };

  const handleShare = (request) => {
    if (navigator.share) {
      navigator.share({
        title: `${request?.patientName} এর জন্য ${request?.bloodGroup} রক্তের প্রয়োজন`,
        text: `${request?.hospital}, ${request?.location} এ ${request?.unitsNeeded} ব্যাগ ${request?.bloodGroup} রক্তের জরুরি প্রয়োজন।`,
        url: window.location?.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareText = `${request?.patientName} এর জন্য ${request?.bloodGroup} রক্তের প্রয়োজন। ${request?.hospital}, ${request?.location}। যোগাযোগ: ${request?.contactPhone}`;
      navigator.clipboard?.writeText(shareText);
      alert('শেয়ার লিংক কপি করা হয়েছে!');
    }
  };

  const handlePledge = (requestId, pledged) => {
    console.log(`Request ${requestId} pledged: ${pledged}`);
    // Here you would update the pledge status in your backend
  };

  const clearFilters = () => {
    const clearedFilters = {
      bloodGroups: [],
      urgencyLevels: [],
      locations: [],
      unitsNeeded: '',
      verifiedOnly: false,
      timeRange: ''
    };
    setFilters(clearedFilters);
  };

  useEffect(() => {
    // Set page title
    document.title = 'রক্তের অনুরোধ - LifeLink Bangladesh';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Icon name="Heart" size={32} color="white" className="heartbeat" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bengali font-bold">রক্তের অনুরোধ</h1>
              </div>
              <p className="text-xl font-bengali mb-8 opacity-90">
                সম্প্রদায়ের শক্তিতে জীবন বাঁচান - প্রতিটি অনুরোধ একটি আশার আলো
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="secondary"
                  size="lg"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => setShowRequestForm(true)}
                  className="bg-white text-primary hover:bg-gray-100"
                >
                  <span className="font-bengali">রক্তের অনুরোধ করুন</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  iconName="Search"
                  iconPosition="left"
                  onClick={() => navigate('/find-donors')}
                  className="border-white text-white hover:bg-white hover:text-primary"
                >
                  <span className="font-bengali">রক্তদাতা খুঁজুন</span>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Panel */}
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <StatsPanel stats={displayStats} />
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <div className="lg:w-80 space-y-6">
                {/* Search and Sort */}
                <div className="bg-white rounded-lg shadow-brand p-6">
                  <div className="space-y-4">
                    <Input
                      label="অনুসন্ধান করুন"
                      placeholder="নাম, হাসপাতাল, এলাকা বা রক্তের গ্রুপ..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e?.target?.value)}
                      iconName="Search"
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-text-primary font-bengali mb-2">
                        সাজান
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e?.target?.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="urgency">জরুরি মাত্রা অনুযায়ী</option>
                        <option value="time">সময় অনুযায়ী</option>
                        <option value="recent">সাম্প্রতিক</option>
                        <option value="location">এলাকা অনুযায়ী</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Filter Toggle for Mobile */}
                <div className="lg:hidden">
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Filter"
                    iconPosition="left"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <span className="font-bengali">ফিল্টার</span>
                  </Button>
                </div>

                {/* Filters */}
                <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
                  <FilterPanel
                    filters={filters}
                    onFilterChange={setFilters}
                    onClearFilters={clearFilters}
                    availableLocations={[]}
                  />
                </div>

                {/* Success Stories */}
                <SuccessStories stories={displayStories} />
              </div>

              {/* Main Content */}
              <div className="flex-1">
                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bengali font-bold text-text-primary">
                      রক্তের অনুরোধসমূহ
                    </h2>
                    <p className="text-sm text-muted-foreground font-bengali">
                      {searchQuery ? `${sortedRequests.length} টি অনুসন্ধানের ফলাফল` : `${totalItems} টি অনুরোধ পাওয়া গেছে`}
                    </p>
                  </div>
                  
                  <Button
                    variant="default"
                    iconName="Plus"
                    iconPosition="left"
                    onClick={() => setShowRequestForm(true)}
                  >
                    <span className="font-bengali">নতুন অনুরোধ</span>
                  </Button>
                </div>

                {/* Emergency Banner */}
                {sortedRequests?.some(req => req?.urgencyLevel === 'emergency') && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <Icon name="AlertTriangle" size={20} className="text-red-600" />
                      <div>
                        <h3 className="font-bengali font-semibold text-red-800">জরুরি অনুরোধ!</h3>
                        <p className="text-sm font-bengali text-red-700">
                          {sortedRequests?.filter(req => req?.urgencyLevel === 'emergency')?.length} টি জরুরি অনুরোধ রয়েছে যার দ্রুত সাহায্য প্রয়োজন
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Request Cards */}
                <div className="space-y-6">
                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-lg p-6 shadow-brand animate-pulse">
                          <div className="flex items-center justify-between mb-4">
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-6 bg-gray-200 rounded w-16"></div>
                          </div>
                          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                          <div className="flex space-x-2">
                            <div className="h-8 bg-gray-200 rounded w-20"></div>
                            <div className="h-8 bg-gray-200 rounded w-20"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : sortedRequests?.length > 0 ? (
                    sortedRequests?.map((request) => (
                      <RequestCard
                        key={request?.id}
                        request={request}
                        onContact={handleContact}
                        onShare={handleShare}
                        onPledge={handlePledge}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon name="Search" size={32} className="text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-bengali font-semibold text-text-primary mb-2">
                        কোনো অনুরোধ পাওয়া যায়নি
                      </h3>
                      <p className="text-muted-foreground font-bengali mb-4">
                        আপনার অনুসন্ধান বা ফিল্টার অনুযায়ী কোনো রক্তের অনুরোধ খুঁজে পাওয়া যায়নি
                      </p>
                      <Button
                        variant="outline"
                        onClick={clearFilters}
                        iconName="RefreshCw"
                        iconPosition="left"
                      >
                        <span className="font-bengali">ফিল্টার রিসেট করুন</span>
                      </Button>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {!searchQuery && totalItems > itemsPerPage && (
                  <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
                    <div className="text-sm text-muted-foreground font-bengali">
                      মোট {totalItems} টির মধ্যে {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} টি দেখানো হচ্ছে
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        iconName="ChevronLeft"
                        iconPosition="left"
                      >
                        <span className="font-bengali hidden sm:inline">পূর্ববর্তী</span>
                      </Button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.ceil(totalItems / itemsPerPage) }, (_, i) => i + 1)
                          .filter(page => 
                            page === 1 || 
                            page === Math.ceil(totalItems / itemsPerPage) || 
                            Math.abs(page - currentPage) <= 1
                          )
                          .map((page, index, array) => (
                            <React.Fragment key={page}>
                              {index > 0 && array[index - 1] !== page - 1 && (
                                <span className="px-2 text-muted-foreground">...</span>
                              )}
                              <button
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1 rounded text-sm transition-colors ${
                                  currentPage === page
                                    ? 'bg-primary text-white'
                                    : 'text-muted-foreground hover:text-primary hover:bg-muted'
                                }`}
                              >
                                {page}
                              </button>
                            </React.Fragment>
                          ))
                        }
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(totalItems / itemsPerPage)))}
                        disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
                        iconName="ChevronRight"
                        iconPosition="right"
                      >
                        <span className="font-bengali hidden sm:inline">পরবর্তী</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Icon name="Users" size={32} />
              <h2 className="text-3xl font-bengali font-bold">আপনিও হতে পারেন একজন জীবনদাতা</h2>
            </div>
            <p className="text-lg font-bengali mb-8 opacity-90">
              রক্তদান করুন, জীবন বাঁচান। আজই নিবন্ধন করুন এবং কমিউনিটির অংশ হয়ে উঠুন।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                size="lg"
                iconName="UserPlus"
                iconPosition="left"
                onClick={() => navigate('/donor-registration')}
                className="bg-white text-green-700 hover:bg-gray-100"
              >
                <span className="font-bengali">রক্তদাতা হন</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                iconName="Heart"
                iconPosition="left"
                className="border-white text-white hover:bg-white hover:text-green-700"
              >
                <span className="font-bengali">আরও জানুন</span>
              </Button>
            </div>
          </div>
        </section>
      </main>
      {/* Request Form Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <RequestForm
              onSubmit={handleRequestSubmit}
              onCancel={() => setShowRequestForm(false)}
            />
          </div>
        </div>
      )}
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Icon name="Heart" size={24} className="text-primary" />
              <span className="text-xl font-bengali font-bold">LifeLink Bangladesh</span>
            </div>
            <p className="text-gray-400 font-bengali mb-4">
              রক্তদানের মাধ্যমে জীবন বাঁচানোর প্ল্যাটফর্ম
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <span className="font-bengali">গোপনীয়তা নীতি</span>
              <span className="font-bengali">ব্যবহারের শর্তাবলী</span>
              <span className="font-bengali">যোগাযোগ</span>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-800 text-gray-500 text-sm">
              <p className="font-bengali">© {new Date()?.getFullYear()} LifeLink Bangladesh. সকল অধিকার সংরক্ষিত।</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BloodRequestsPage;