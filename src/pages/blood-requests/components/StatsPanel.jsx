import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsPanel = ({ stats }) => {
  const statItems = [
    {
      icon: 'Heart',
      label: 'মোট অনুরোধ',
      value: stats?.totalRequests || 0,
      color: 'text-primary',
      bgColor: 'bg-red-50'
    },
    {
      icon: 'AlertTriangle',
      label: 'জরুরি অনুরোধ',
      value: stats?.emergencyRequests || 0,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      icon: 'CheckCircle',
      label: 'পূরণ হয়েছে',
      value: stats?.fulfilledRequests || 0,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: 'Users',
      label: 'সাহায্যকারী',
      value: stats?.totalPledges || 0,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statItems?.map((item, index) => (
        <div key={index} className={`${item?.bgColor} rounded-lg p-4 border border-opacity-20`}>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${item?.bgColor} rounded-lg flex items-center justify-center`}>
              <Icon name={item?.icon} size={20} className={item?.color} />
            </div>
            <div>
              <div className="text-2xl font-bold text-text-primary">{item?.value}</div>
              <div className="text-sm font-bengali text-text-secondary">{item?.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsPanel;