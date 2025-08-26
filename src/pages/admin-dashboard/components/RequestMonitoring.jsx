import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { bloodRequestService } from '../../../lib/bloodRequestService';

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
      const requestData = await bloodRequestService.getActiveRequests({}, 1, 50);
      setRequests(requestData.data || []);
    } catch (error) {
      console.error('Failed to load requests:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyRequest = async (requestId) => {
    try {
      // Add verification logic here
      console.log('Verifying request:', requestId);
      loadRequests();
    } catch (error) {
      console.error('Failed to verify request:', error);
    }
  };

  const handleCancelRequest = async (requestId) => {
    console.log('Attempting to cancel request ID:', requestId, 'Type:', typeof requestId);
    console.log('All requests:', requests.map(r => ({ id: r.id, type: typeof r.id })));
    if (confirm('আপনি কি এই অনুরোধটি বাতিল করতে চান?')) {
      try {
        const result = await bloodRequestService.cancelRequest(requestId);
        console.log('Cancel result:', result);
        alert('অনুরোধটি বাতিল করা হয়েছে');
        // Remove from local state immediately
        setRequests(prev => prev.filter(req => req.id !== requestId));
        // Then reload fresh data
        await loadRequests(true);
      } catch (error) {
        console.error('Failed to cancel request:', error);
        alert('অনুরোধ বাতিল করতে সমস্যা হয়েছে: ' + error.message);
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
      in_progress: 'bg-trust/10 text-trust border-trust/20',
      fulfilled: 'bg-success/10 text-success border-success/20',
      cancelled: 'bg-error/10 text-error border-error/20'
    };
    return colors?.[status] || 'bg-muted/10 text-muted-foreground border-muted/20';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'অপেক্ষমান',
      in_progress: 'প্রক্রিয়াধীন',
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
    urgency: r.urgency_level === 'emergency' ? 'critical' : r.urgency_level,
    hospital: r.hospital,
    location: r.location,
    contactPerson: r.contact_person,
    contactPhone: r.contact_phone,
    requestDate: new Date(r.created_at),
    status: 'pending',
    description: r.additional_info || 'কোন অতিরিক্ত তথ্য নেই',
    responses: 0,
    verified: r.verified || false
  }));

  const filteredRequests = displayRequests?.filter(request => {
    if (selectedTab === 'all') return true;
    return request?.status === selectedTab;
  });

  const tabs = [
    { id: 'all', label: 'সব অনুরোধ', count: displayRequests?.length },
    { id: 'pending', label: 'অপেক্ষমান', count: displayRequests?.filter(r => r?.status === 'pending')?.length },
    { id: 'in_progress', label: 'প্রক্রিয়াধীন', count: displayRequests?.filter(r => r?.status === 'in_progress')?.length },
    { id: 'fulfilled', label: 'সম্পন্ন', count: displayRequests?.filter(r => r?.status === 'fulfilled')?.length }
  ];

  return (
    <div className="bg-card rounded-lg p-6 shadow-brand border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary font-bengali">রক্তের অনুরোধ মনিটরিং</h3>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" iconName="Filter">
            <span className="font-bengali">ফিল্টার</span>
          </Button>
          <Button variant="outline" size="sm" iconName="Download">
            <span className="font-bengali">রিপোর্ট</span>
          </Button>
        </div>
      </div>
      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-muted rounded-lg p-1">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setSelectedTab(tab?.id)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 font-bengali ${
              selectedTab === tab?.id
                ? 'bg-white text-primary shadow-sm'
                : 'text-muted-foreground hover:text-text-primary'
            }`}
          >
            {tab?.label} ({tab?.count})
          </button>
        ))}
      </div>
      {/* Requests List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredRequests?.map((request) => (
          <div key={request?.id} className="border border-border rounded-lg p-4 hover:shadow-brand transition-all duration-200 w-full max-w-full overflow-hidden break-words">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(request?.urgency)}`}>
                    {getUrgencyText(request?.urgency)}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {request?.bloodGroup}
                  </span>
                  <span className="text-sm font-medium text-text-primary">
                    {request?.unitsNeeded} ব্যাগ
                  </span>
                </div>
                {!request?.verified && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning border border-warning/20">
                    <Icon name="AlertTriangle" size={12} className="mr-1" />
                    অযাচাইকৃত
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
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

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {!request?.verified && (
                  <Button variant="success" size="sm" iconName="CheckCircle">
                    <span className="font-bengali">যাচাই করুন</span>
                  </Button>
                )}
                <Button variant="outline" size="sm" iconName="Eye">
                  <span className="font-bengali">বিস্তারিত</span>
                </Button>
                <Button variant="outline" size="sm" iconName="MessageSquare">
                  <span className="font-bengali">যোগাযোগ</span>
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" iconName="Flag">
                  <span className="font-bengali">রিপোর্ট</span>
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  iconName="X"
                  onClick={() => handleCancelRequest(request?.id)}
                >
                  <span className="font-bengali">বাতিল</span>
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
            <div className="text-lg font-bold text-trust">{displayRequests?.filter(r => r?.status === 'in_progress')?.length || 0}</div>
            <div className="text-xs text-muted-foreground font-bengali">প্রক্রিয়াধীন</div>
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