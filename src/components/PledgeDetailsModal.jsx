import React from 'react';
import Icon from './AppIcon';
import Button from './ui/Button';

const PledgeDetailsModal = ({ isOpen, onClose, pledges, requestInfo }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bengali font-bold">সাহায্যকারী তালিকা</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <Icon name="X" size={20} />
            </button>
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-bengali text-gray-600">
              <span className="font-semibold">{requestInfo?.patientName}</span> এর জন্য 
              <span className="font-semibold text-primary"> {requestInfo?.bloodGroup}</span> রক্তের অনুরোধে
            </p>
          </div>

          {pledges?.length > 0 ? (
            <div className="space-y-3">
              {pledges.map((pledge, index) => (
                <div key={pledge.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} color="white" />
                    </div>
                    <div className="flex-1">
                      <button
                        onClick={() => window.open(`/donor-profile/${pledge.donor_id}`, '_blank')}
                        className="font-medium text-sm text-primary hover:text-primary-dark transition-colors text-left"
                      >
                        {pledge.donor_name}
                      </button>
                      <p className="text-xs text-gray-500 font-bengali">
                        {new Date(pledge.created_at).toLocaleDateString('bn-BD')}
                      </p>
                    </div>
                  </div>
                  <a 
                    href={`tel:${pledge.donor_phone}`}
                    className="flex items-center space-x-1 text-primary hover:text-primary-dark text-sm"
                  >
                    <Icon name="Phone" size={14} />
                    <span className="font-bengali">কল করুন</span>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Icon name="Users" size={32} className="text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 font-bengali">এখনো কেউ সাহায্য করেননি</p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              fullWidth
            >
              <span className="font-bengali">বন্ধ করুন</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PledgeDetailsModal;