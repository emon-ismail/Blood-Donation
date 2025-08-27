import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { supabase } from '../../../lib/supabase';

const RequestMonitoring = () => {
  const [selectedTab, setSelectedTab] = useState('pending');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async (forceRefresh = false) => {
    try {
      setLoading(true);
      // Add timestamp to force fresh data
      const { data } = await supabase
        .from('blood_requests')
        .select('*')
        .in('status', ['active', 'verified'])
        .order('created_at', { ascending: false });
      setRequests(data || []);
    } catch (error) {
      console.error('Failed to load requests:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyRequest = async (requestId) => {
    try {
      const { error } = await supabase
        .from('blood_requests')
        .update({ status: 'verified' })
        .eq('id', requestId);
      
      if (error) throw error;
      
      // Update local state immediately
      setRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: 'verified', verified: true } : req
      ));
      
      alert('অনুরোধটি যাচাই করা হয়েছে');
    } catch (error) {
      console.error('Failed to verify request:', error);
      alert('যাচাই করতে সমস্যা হয়েছে');
    }
  };

  const handleViewDetails = (request) => {
    alert(`রোগী: ${request.patientName}\nরক্তের গ্রুপ: ${request.bloodGroup}\nপ্রয়োজন: ${request.unitsNeeded} ব্যাগ\nহাসপাতাল: ${request.hospital}\nএলাকা: ${request.location}\nযোগাযোগ: ${request.contactPerson} - ${request.contactPhone}\nবিস্তারিত: ${request.description}`);
  };

  const handleContact = (request) => {
    if (confirm(`${request.contactPerson} এর সাথে যোগাযোগ করবেন?\nফোন: ${request.contactPhone}`)) {
      window.location.href = `tel:${request.contactPhone}`;
    }
  };

  const handleReport = (requestId) => {
    const reason = prompt('রিপোর্ট করার কারণ লিখুন:');
    if (reason) {
      alert(`অনুরোধ ID ${requestId} রিপোর্ট করা হয়েছে।\nকারণ: ${reason}`);
    }
  };

  const handleMarkFulfilled = async (requestId) => {
    if (confirm('এই অনুরোধটি কি সম্পন্ন হয়েছে?')) {
      try {
        const { error } = await supabase
          .from('blood_requests')
          .update({ status: 'fulfilled' })
          .eq('id', requestId);
          
        if (error) throw error;
        
        // Update local state immediately
        setRequests(prev => prev.map(req => 
          req.id === requestId ? { ...req, status: 'fulfilled' } : req
        ));
        
        alert('অনুরোধটি সম্পন্ন হিসেবে চিহ্নিত করা হয়েছে');
      } catch (error) {
        console.error('Failed to mark as fulfilled:', error);
        alert('সম্পন্ন করতে সমস্যা হয়েছে');
      }
    }
  };

  const handleCancelRequest = async (requestId) => {
    if (confirm('আপনি কি এই অনুরোধটি বাতিল করতে চান?')) {
      try {
        const { error } = await supabase
          .from('blood_requests')
          .delete()
          .eq('id', requestId);
          
        if (error) throw error;
        
        // Remove from local state immediately
        setRequests(prev => prev.filter(req => req.id !== requestId));
        
        alert('অনুরোধটি বাতিল করা হয়েছে');
      } catch (error) {
        console.error('Failed to cancel request:', error);
        alert('অনুরোধ বাতিল করতে সমস্যা হয়েছে');
      }
    }
  };

  // No mock data - use only real database data

  const getUrgencyColor = (urgency) => {
    const colors = {
      critical: 'bg-destructive text-white',
      high: 'bg-error text-white',
      medium: 'bg-warning text-white',
      low: 'bg-success text-white'
    };
    return colors?.[urgency] || 'bg-muted text-muted-foreground';
  };

  const getUrgencyText = (urgency) => {
    const texts = {
      critical: 'অতি জরুরি',
      high: 'জরুরি',
      medium: 'মাঝারি',
      low: 'কম জরুরি'
    };
    return texts?.[urgency] || 'অজানা';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-warning/10 text-warning border-warning/20',
      verified: 'bg-success/10 text-success border-success/20',
      fulfilled: 'bg-trust/10 text-trust border-trust/20',
      cancelled: 'bg-error/10 text-error border-error/20'
    };
    return colors?.[status] || 'bg-muted/10 text-muted-foreground border-muted/20';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'অপেক্ষমান',
      verified: 'যাচাইকৃত',
      fulfilled: 'সম্পন্ন',
      cancelled: 'বাতিল'
    };
    return texts?.[status] || 'অজানা';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} মিনিট আগে`;
    if (hours < 24) return `${hours} ঘন্টা আগে`;
    return `${days} দিন আগে`;
  };

  // Filter out any requests that might be cached but deleted
  const validRequests = requests.filter(r => r && r.id);
  const displayRequests = validRequests.map(r => ({
    id: r.id,
    patientName: r.patient_name,
    bloodGroup: r.blood_group,
    unitsNeeded: r.units_needed,
    urgency: r.urgency === 'emergency' ? 'critical' : r.urgency,
    hospital: r.hospital_name,
    hospitalAddress: r.hospital_address,
    location: `${r.upazila || ''}, ${r.district || ''}`,
    contactPerson: r.contact_person,
    contactPhone: r.contact_mobile,
    requestDate: new Date(r.created_at),
    status: r.status === 'verified' ? 'verified' : 'pending',
    description: r.additional_info || 'কোন অতিরিক্ত তথ্য নেই',
    responses: 0,
    verified: r.status === 'verified' || r.verified || false
  }));

  const filteredRequests = displayRequests?.filter(request => {
    if (selectedTab === 'all') return true;
    return request?.status === selectedTab;
  });

  const tabs = [
    { id: 'all', label: 'সব অনুরোধ', count: displayRequests?.length },
    { id: 'pending', label: 'অপেক্ষমান', count: displayRequests?.filter(r => r?.status === 'pending')?.length },
    { id: 'verified', label: 'যাচাইকৃত', count: displayRequests?.filter(r => r?.status === 'verified')?.length },
    { id: 'fulfilled', label: 'সম্পন্ন', count: displayRequests?.filter(r => r?.status === 'fulfilled')?.length }
  ];

  return (
    <div className="bg-card rounded-lg p-4 sm:p-6 shadow-brand border border-border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <h3 className="text-base sm:text-lg font-semibold text-text-primary font-bengali">রক্তের অনুরোধ মনিটরিং</h3>
        <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
          <Button variant="outline" size="sm" iconName="Filter" className="flex-1 sm:flex-none">
            <span className="font-bengali text-xs sm:text-sm">ফিল্টার</span>
          </Button>
          <Button variant="outline" size="sm" iconName="Download" className="flex-1 sm:flex-none">
            <span className="font-bengali text-xs sm:text-sm">রিপোর্ট</span>
          </Button>
        </div>
      </div>
      {/* Tabs */}
      <div className="mb-4 sm:mb-6 overflow-hidden">
        <div className="flex space-x-1 bg-muted rounded-lg p-1 overflow-x-auto" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setSelectedTab(tab?.id)}
              className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 font-bengali whitespace-nowrap flex-shrink-0 ${
                selectedTab === tab?.id
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-text-primary'
              }`}
            >
              <span className="hidden sm:inline">{tab?.label} ({tab?.count})</span>
              <span className="sm:hidden">{tab?.label.split(' ')[0]} ({tab?.count})</span>
            </button>
          ))}
        </div>
      </div>
      {/* Requests List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredRequests?.map((request) => (
          <div key={request?.id} className="border border-border rounded-lg p-3 sm:p-4 hover:shadow-brand transition-all duration-200 w-full max-w-full overflow-hidden break-words">
            <div className="flex flex-col sm:flex-row items-start justify-between mb-3 gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request?.urgency)}`}>
                  {getUrgencyText(request?.urgency)}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {request?.bloodGroup}
                </span>
                <span className="text-xs sm:text-sm font-medium text-text-primary">
                  {request?.unitsNeeded} ব্যাগ
                </span>
                {!request?.verified && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning border border-warning/20">
                    <Icon name="AlertTriangle" size={10} className="mr-1" />
                    অযাচাইকৃত
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request?.status)}`}>
                  {getStatusText(request?.status)}
                </span>
                <span className="text-xs text-muted-foreground font-bengali">
                  {formatTimeAgo(request?.requestDate)}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-3">
              <div>
                <h4 className="font-medium text-text-primary font-bengali mb-1">{request?.patientName}</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex items-center space-x-2">
                    <Icon name="MapPin" size={14} />
                    <span className="font-bengali">{request?.hospital}</span>
                  </div>
                  {request?.hospitalAddress && (
                    <div className="flex items-center space-x-2">
                      <Icon name="Building" size={14} />
                      <span className="font-bengali">{request?.hospitalAddress}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Icon name="Navigation" size={14} />
                    <span className="font-bengali">{request?.location}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex items-center space-x-2">
                    <Icon name="User" size={14} />
                    <span className="font-bengali">{request?.contactPerson}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Phone" size={14} />
                    <span>{request?.contactPhone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Users" size={14} />
                    <span className="font-bengali">{request?.responses} জন সাড়া দিয়েছেন</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground font-bengali mb-4 break-all word-break-break-all overflow-wrap-anywhere">
              {request?.description}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {!request?.verified && (
                  <Button 
                    variant="success" 
                    size="sm" 
                    iconName="CheckCircle"
                    onClick={() => handleVerifyRequest(request?.id)}
                    className="flex-1 sm:flex-none"
                  >
                    <span className="font-bengali text-xs">যাচাই</span>
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  iconName="Eye"
                  onClick={() => handleViewDetails(request)}
                  className="flex-1 sm:flex-none"
                >
                  <span className="font-bengali text-xs">বিস্তারিত</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  iconName="MessageSquare"
                  onClick={() => handleContact(request)}
                  className="flex-1 sm:flex-none"
                >
                  <span className="font-bengali text-xs">যোগাযোগ</span>
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {request?.status !== 'fulfilled' && (
                  <Button 
                    variant="success" 
                    size="sm" 
                    iconName="CheckCircle2"
                    onClick={() => handleMarkFulfilled(request?.id)}
                    className="flex-1 sm:flex-none"
                  >
                    <span className="font-bengali text-xs">সম্পন্ন</span>
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  iconName="Flag"
                  onClick={() => handleReport(request?.id)}
                  className="flex-1 sm:flex-none"
                >
                  <span className="font-bengali text-xs">রিপোর্ট</span>
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  iconName="X"
                  onClick={() => handleCancelRequest(request?.id)}
                  className="flex-1 sm:flex-none"
                >
                  <span className="font-bengali text-xs">বাতিল</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Dynamic Summary Stats */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-warning">{displayRequests?.filter(r => r?.status === 'pending')?.length || 0}</div>
            <div className="text-xs text-muted-foreground font-bengali">অপেক্ষমান</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-success">{displayRequests?.filter(r => r?.status === 'verified')?.length || 0}</div>
            <div className="text-xs text-muted-foreground font-bengali">যাচাইকৃত</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-success">{displayRequests?.filter(r => r?.status === 'fulfilled')?.length || 0}</div>
            <div className="text-xs text-muted-foreground font-bengali">সম্পন্ন</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-error">{displayRequests?.filter(r => !r?.verified)?.length || 0}</div>
            <div className="text-xs text-muted-foreground font-bengali">অযাচাইকৃত</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestMonitoring;