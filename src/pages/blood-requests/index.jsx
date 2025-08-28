import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';
import RequestForm from './components/RequestForm';
import RequestCard from './components/RequestCard';
import FilterPanel from './components/FilterPanel';
import StatsPanel from './components/StatsPanel';
import SuccessStories from './components/SuccessStories';
import PledgeDetailsModal from '../../components/PledgeDetailsModal';


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
  const [showPledgeModal, setShowPledgeModal] = useState(false);
  const [selectedRequestPledges, setSelectedRequestPledges] = useState([]);
  const [selectedRequestInfo, setSelectedRequestInfo] = useState(null);


  useEffect(() => {
    loadData();
    // Check if there's a specific request ID in URL
    const urlParams = new URLSearchParams(window.location.search);
    const requestId = urlParams.get('id');
    if (requestId) {
      // Scroll to specific request after data loads
      setTimeout(() => {
        const element = document.getElementById(`request-${requestId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.style.border = '2px solid #ef4444';
          element.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.3)';
          setTimeout(() => {
            element.style.border = '';
            element.style.boxShadow = '';
          }, 3000);
        }
      }, 1000);
    }
    // Track page views for all visible requests
    trackPageViews();
  }, []);
  
  const trackPageViews = async () => {
    try {
      if (requests.length > 0) {
        // Update view count for all visible requests
        const updates = requests.map(request => 
          supabase
            .from('blood_requests')
            .update({ views: (request.views || 0) + 1 })
            .eq('id', request.id)
        );
        await Promise.all(updates);
      }
    } catch (error) {
      console.error('Failed to track views:', error);
    }
  };

  const loadData = async (currentFilters = {}, page = 1, showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      
      let query = supabase
        .from('blood_requests')
        .select('*')
        .in('status', ['active', 'verified']);
      
      // Get current user data from AuthContext
      const donorUser = JSON.parse(localStorage.getItem('donor_user') || 'null');
      let donorData = null;
      
      if (donorUser) {
        // Get donor data from database
        const { data } = await supabase
          .from('donors')
          .select('*')
          .or(`email.eq.${donorUser.email},mobile.eq.${donorUser.email}`);
        donorData = data?.[0] || null;
      }

      // Apply blood group filters
      if (currentFilters.bloodGroups?.length > 0) {
        query = query.in('blood_group', currentFilters.bloodGroups);
      }

      // Apply urgency filters
      if (currentFilters.urgencyLevels?.length > 0) {
        query = query.in('urgency', currentFilters.urgencyLevels);
      }

      // Apply location filters
      if (currentFilters.locations?.length > 0) {
        query = query.in('district', currentFilters.locations);
      }

      // Apply units needed filter
      if (currentFilters.unitsNeeded) {
        query = query.gte('units_needed', parseInt(currentFilters.unitsNeeded));
      }

      const { data: requestsData } = await query.order('created_at', { ascending: false });
      
      // If donor is logged in, check their pledges
      let userPledges = [];
      if (donorData) {
        const { data: pledgeData } = await supabase
          .from('blood_pledges')
          .select('request_id')
          .eq('donor_id', donorData.id);
        userPledges = pledgeData?.map(p => p.request_id) || [];
      }
      
      // Add user pledge status to requests
      const requestsWithPledgeStatus = (requestsData || []).map(request => ({
        ...request,
        userPledged: userPledges.includes(request.request_id) // Use request_id not id
      }));

      setRequests(requestsWithPledgeStatus);
      setTotalItems(requestsData?.length || 0);
      setSuccessStories([]);
      
      const urgent = requestsData?.filter(r => r.urgency === 'urgent' || r.urgency === 'emergency')?.length || 0;
      setStats({ 
        total: requestsData?.length || 0, 
        active: requestsData?.length || 0, 
        urgent, 
        emergency: urgent,
        todayRequests: 0, 
        fulfilled: 0 
      });
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
    requestId: request?.request_id || '',
    patientName: request?.patient_name || '',
    bloodGroup: request?.blood_group || '',
    unitsNeeded: request?.units_needed || 0,
    hospital: request?.hospital_name || '',
    hospitalAddress: request?.hospital_address || '',
    location: `${request?.upazila || ''}, ${request?.district || ''}`,
    contactPerson: request?.contact_person || '',
    contactPhone: request?.contact_mobile || '',
    urgencyLevel: request?.urgency || 'standard',
    requiredBy: request?.needed_by_date || new Date().toISOString(),
    additionalInfo: request?.additional_info || '',
    postedAt: request?.created_at || new Date().toISOString(),
    verified: false,
    pledges: request?.pledges || 0,
    shares: request?.shares || 0,
    views: request?.views || 0,
    userPledged: request?.userPledged || false
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
      const requestId = `BR${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      
      console.log('Form data:', formData);
      
      const { error } = await supabase
        .from('blood_requests')
        .insert({
          request_id: requestId,
          patient_name: formData.patientName || '',
          blood_group: formData.bloodGroup || '',
          units_needed: parseInt(formData.unitsNeeded) || 1,
          urgency: formData.urgencyLevel || 'standard',
          hospital_name: formData.hospital || '',
          hospital_address: formData.detailedAddress || '',
          district: formData.location || '',
          upazila: '',
          contact_person: formData.contactPerson || '',
          contact_mobile: formData.contactPhone || '',
          needed_by_date: formData.requiredBy || new Date().toISOString(),
          additional_info: formData.additionalInfo || '',
          status: 'active'
        });
        
      console.log('Insert error:', error);

      if (error) throw error;

      setShowRequestForm(false);
      setCurrentPage(1);
      await loadData(filters, 1, false);
      alert(`অনুরোধ সফলভাবে জমা দেওয়া হয়েছে! আপনার অনুরোধ ID: ${requestId}`);
    } catch (error) {
      console.error('Failed to submit request:', error);
      alert('অনুরোধ জমা দিতে সমস্যা হয়েছে।');
    }
  };



  const handleContact = (request) => {
    // Open phone dialer
    window.location.href = `tel:${request?.contactPhone}`;
  };

  const handleShowPledges = async (request) => {
    try {
      const { data: pledges, error } = await supabase
        .from('blood_pledges')
        .select('*')
        .eq('request_id', request.requestId) // Use requestId from display object
        .order('created_at', { ascending: false });
      
      console.log('Pledges for request:', request.requestId, pledges);
      
      if (!error) {
        setSelectedRequestPledges(pledges || []);
        setSelectedRequestInfo(request);
        setShowPledgeModal(true);
      }
    } catch (error) {
      console.error('Failed to load pledges:', error);
    }
  };

  const handleShare = async (request) => {
    try {
      // Update share count in database
      const { error } = await supabase
        .from('blood_requests')
        .update({ shares: (request.shares || 0) + 1 })
        .eq('id', request.id);
      
      if (!error) {
        // Update local state
        setRequests(prev => prev.map(r => 
          r.id === request.id ? { ...r, shares: (r.shares || 0) + 1 } : r
        ));
      }
      
      const shareUrl = `${window.location.origin}/blood-requests?id=${request.requestId}`;
      const shareText = `জরুরি সাহায্য প্রয়োজন!

রোগী: ${request?.patientName}
রক্তের গ্রুপ: ${request?.bloodGroup}
প্রয়োজন: ${request?.unitsNeeded} ব্যাগ
হাসপাতাল: ${request?.hospital}
এলাকা: ${request?.location}
যোগাযোগ: ${request?.contactPhone}

লিংক: ${shareUrl}`;
      
      // Always use native share if available
      if (navigator.share) {
        try {
          await navigator.share({
            title: `${request?.patientName} এর জন্য ${request?.bloodGroup} রক্তের প্রয়োজন`,
            text: shareText,
            url: shareUrl
          });
          return;
        } catch (err) {
          if (err.name !== 'AbortError') {
            console.log('Web Share failed, using fallback');
          } else {
            return; // User cancelled
          }
        }
      }
      
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(shareText);
      alert('শেয়ার লিংক কপি করা হয়েছে! এখন যেকোনো অ্যাপে পেস্ট করুন।');
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const handlePledge = async (requestId, pledged) => {
    // Check correct auth key from AuthContext
    const donorUser = JSON.parse(localStorage.getItem('donor_user') || 'null');
    
    console.log('Auth check:', { donorUser });
    
    if (!donorUser) {
      // Store current page for return navigation
      const currentUrl = window.location.href;
      localStorage.setItem('returnUrl', currentUrl);
      
      alert('সাহায্য করতে প্রথমে লগইন করুন');
      window.location.href = '/donor-dashboard';
      return false;
    }
    
    // User is logged in, now get their donor data from database
    const { data: donorData, error } = await supabase
      .from('donors')
      .select('*')
      .or(`email.eq.${donorUser.email},mobile.eq.${donorUser.email}`);
    
    console.log('Donor lookup result:', { donorData, error, userEmail: donorUser.email });
    
    if (error || !donorData || donorData.length === 0) {
      // Store current page for return navigation
      const currentUrl = window.location.href;
      localStorage.setItem('returnUrl', currentUrl);
      
      alert('আপনি এখনো রক্তদাতা হিসেবে নিবন্ধিত নন। প্রথমে নিবন্ধন করুন।');
      window.location.href = '/donor-registration';
      return false;
    }
    
    const actualDonorData = donorData[0];

    try {
      const request = requests.find(r => r.id === requestId);
      if (!request) return;
      
      if (pledged) {
        // Add pledge record using request.request_id (string) instead of request.id (UUID)
        const request = requests.find(r => r.id === requestId);
        console.log('Donor data for pledge:', actualDonorData);
        
        const { error: pledgeError } = await supabase
          .from('blood_pledges')
          .insert({
            request_id: request.request_id, // Use the BR123456 format ID
            donor_id: actualDonorData.donor_id || actualDonorData.id, // Try donor_id first, fallback to id
            donor_name: actualDonorData.full_name,
            donor_phone: actualDonorData.mobile,
            created_at: new Date().toISOString()
          });
        
        if (pledgeError && pledgeError.code !== '23505') { // Ignore duplicate
          console.error('Pledge insert error:', pledgeError);
          throw pledgeError;
        }
      } else {
        // Remove pledge record
        const request = requests.find(r => r.id === requestId);
        await supabase
          .from('blood_pledges')
          .delete()
          .eq('request_id', request.request_id)
          .eq('donor_id', actualDonorData.donor_id || actualDonorData.id);
      }
      
      // Update pledge count
      const foundRequest = requests.find(r => r.id === requestId);
      const { data: pledgeCount } = await supabase
        .from('blood_pledges')
        .select('id')
        .eq('request_id', foundRequest.request_id);
      
      const newPledgeCount = pledgeCount?.length || 0;
      
      await supabase
        .from('blood_requests')
        .update({ pledges: newPledgeCount })
        .eq('request_id', foundRequest.request_id);
        
      console.log('Request data:', { 
        requestId, 
        foundRequestId: foundRequest.id, 
        foundRequestRequestId: foundRequest.request_id,
        newPledgeCount 
      });
      
      setRequests(prev => prev.map(r => 
        r.id === requestId ? { ...r, pledges: newPledgeCount, userPledged: pledged } : r
      ));
      
      return true; // Return success
      
    } catch (error) {
      console.error('Failed to update pledge:', error);
      alert(`সাহায্য করতে সমস্যা: ${error.message}`);
      return false; // Return failure
    }
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
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3 mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Icon name="Heart" size={24} color="white" className="heartbeat sm:w-8 sm:h-8" />
                </div>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bengali font-bold text-center">রক্তের অনুরোধ</h1>
              </div>
              <p className="text-base sm:text-xl font-bengali mb-6 sm:mb-8 opacity-90 px-4">
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
                    availableLocations={[...new Set(requests.map(r => r.district).filter(Boolean))]}
                  />
                </div>

                {/* Success Stories */}
                <SuccessStories stories={displayStories} />
              </div>

              {/* Main Content */}
              <div className="flex-1">
                {/* Results Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bengali font-bold text-text-primary">
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
                    className="w-full sm:w-auto"
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
                      <div key={request?.id} id={`request-${request?.requestId}`}>
                        <RequestCard
                          request={request}
                          onContact={handleContact}
                          onShare={handleShare}
                          onPledge={handlePledge}
                          onShowPledges={handleShowPledges}
                        />
                      </div>
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
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3 mb-4">
              <Icon name="Users" size={24} className="sm:w-8 sm:h-8" />
              <h2 className="text-xl sm:text-3xl font-bengali font-bold text-center">আপনিও হতে পারেন একজন জীবনদাতা</h2>
            </div>
            <p className="text-base sm:text-lg font-bengali mb-6 sm:mb-8 opacity-90 px-4">
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
      
      <PledgeDetailsModal 
        isOpen={showPledgeModal}
        onClose={() => setShowPledgeModal(false)}
        pledges={selectedRequestPledges}
        requestInfo={selectedRequestInfo}
      />
    </div>
  );
};

export default BloodRequestsPage;