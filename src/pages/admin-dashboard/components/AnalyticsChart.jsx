import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const AnalyticsChart = () => {
  const [selectedChart, setSelectedChart] = useState('donations');

  const donationData = [
    { month: 'জানুয়ারি', donations: 145, requests: 89 },
    { month: 'ফেব্রুয়ারি', donations: 178, requests: 112 },
    { month: 'মার্চ', donations: 203, requests: 134 },
    { month: 'এপ্রিল', donations: 189, requests: 98 },
    { month: 'মে', donations: 234, requests: 156 },
    { month: 'জুন', donations: 267, requests: 178 },
    { month: 'জুলাই', donations: 298, requests: 189 },
    { month: 'আগস্ট', donations: 312, requests: 201 },
    { month: 'সেপ্টেম্বর', donations: 289, requests: 167 },
    { month: 'অক্টোবর', donations: 345, requests: 223 },
    { month: 'নভেম্বর', donations: 378, requests: 245 },
    { month: 'ডিসেম্বর', donations: 423, requests: 289 }
  ];

  const bloodGroupData = [
    { name: 'O+', value: 35, color: '#C41E3A' },
    { name: 'A+', value: 28, color: '#228B22' },
    { name: 'B+', value: 22, color: '#FF6B35' },
    { name: 'AB+', value: 8, color: '#2E5BBA' },
    { name: 'O-', value: 4, color: '#EF4444' },
    { name: 'A-', value: 2, color: '#F59E0B' },
    { name: 'B-', value: 1, color: '#10B981' },
    { name: 'AB-', value: 0.5, color: '#8B5CF6' }
  ];

  const districtData = [
    { district: 'ঢাকা', donors: 1250, donations: 423 },
    { district: 'চট্টগ্রাম', donors: 890, donations: 312 },
    { district: 'রাজশাহী', donors: 650, donations: 234 },
    { district: 'সিলেট', donors: 420, donations: 189 },
    { district: 'খুলনা', donors: 380, donations: 156 },
    { district: 'বরিশাল', donors: 290, donations: 134 },
    { district: 'রংপুর', donors: 340, donations: 145 },
    { district: 'ময়মনসিংহ', donors: 480, donations: 178 }
  ];

  const chartOptions = [
    { id: 'donations', label: 'দান ও অনুরোধ', icon: 'BarChart3' },
    { id: 'bloodgroups', label: 'রক্তের গ্রুপ', icon: 'PieChart' },
    { id: 'districts', label: 'জেলাভিত্তিক', icon: 'Map' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-white p-3 border border-border rounded-lg shadow-brand">
          <p className="font-medium text-text-primary font-bengali">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              <span className="font-bengali">
                {entry?.dataKey === 'donations' ? 'দান: ' : 
                 entry?.dataKey === 'requests' ? 'অনুরোধ: ' :
                 entry?.dataKey === 'donors' ? 'দাতা: ' : ''}
              </span>
              {entry?.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (selectedChart) {
      case 'donations':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={donationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis 
                dataKey="month" 
                stroke="#666666"
                fontSize={12}
                tick={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}
              />
              <YAxis stroke="#666666" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="donations" fill="#C41E3A" radius={[4, 4, 0, 0]} />
              <Bar dataKey="requests" fill="#228B22" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'bloodgroups':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bloodGroupData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {bloodGroupData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}%`, 'শতাংশ']}
                labelFormatter={(label) => `রক্তের গ্রুপ: ${label}`}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'districts':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={districtData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis 
                dataKey="district" 
                stroke="#666666"
                fontSize={12}
                tick={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}
              />
              <YAxis stroke="#666666" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="donors" 
                stroke="#2E5BBA" 
                strokeWidth={3}
                dot={{ fill: '#2E5BBA', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="donations" 
                stroke="#FF6B35" 
                strokeWidth={3}
                dot={{ fill: '#FF6B35', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-brand border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary font-bengali">বিশ্লেষণ ও পরিসংখ্যান</h3>
        <div className="flex items-center space-x-2">
          <select className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
            <option value="2024">২০২৪</option>
            <option value="2023">২০২৩</option>
            <option value="2022">২০২২</option>
          </select>
        </div>
      </div>
      {/* Chart Type Selector */}
      <div className="flex space-x-1 mb-6 bg-muted rounded-lg p-1">
        {chartOptions?.map((option) => (
          <button
            key={option?.id}
            onClick={() => setSelectedChart(option?.id)}
            className={`flex items-center space-x-2 flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              selectedChart === option?.id
                ? 'bg-white text-primary shadow-sm'
                : 'text-muted-foreground hover:text-text-primary'
            }`}
          >
            <Icon name={option?.icon} size={16} />
            <span className="font-bengali">{option?.label}</span>
          </button>
        ))}
      </div>
      {/* Chart Container */}
      <div className="w-full" aria-label={`${chartOptions?.find(opt => opt?.id === selectedChart)?.label} Chart`}>
        {renderChart()}
      </div>
      {/* Chart Legend/Summary */}
      <div className="mt-6 pt-4 border-t border-border">
        {selectedChart === 'donations' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <div className="w-3 h-3 bg-primary rounded"></div>
                <span className="text-sm font-medium text-text-primary font-bengali">মোট দান</span>
              </div>
              <div className="text-lg font-bold text-primary">৩,৪৬১</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <div className="w-3 h-3 bg-secondary rounded"></div>
                <span className="text-sm font-medium text-text-primary font-bengali">মোট অনুরোধ</span>
              </div>
              <div className="text-lg font-bold text-secondary">২,২৮১</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-text-primary font-bengali mb-1">সফলতার হার</div>
              <div className="text-lg font-bold text-success">৯২%</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-text-primary font-bengali mb-1">গড় সময়</div>
              <div className="text-lg font-bold text-trust">২.৫ ঘন্টা</div>
            </div>
          </div>
        )}

        {selectedChart === 'bloodgroups' && (
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {bloodGroupData?.map((group) => (
              <div key={group?.name} className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: group?.color }}></div>
                  <span className="text-sm font-medium text-text-primary">{group?.name}</span>
                </div>
                <div className="text-sm font-bold" style={{ color: group?.color }}>
                  {group?.value}%
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedChart === 'districts' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <div className="w-3 h-3 bg-trust rounded"></div>
                <span className="text-sm font-medium text-text-primary font-bengali">মোট দাতা</span>
              </div>
              <div className="text-lg font-bold text-trust">৪,৭০০</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <div className="w-3 h-3 bg-accent rounded"></div>
                <span className="text-sm font-medium text-text-primary font-bengali">মোট দান</span>
              </div>
              <div className="text-lg font-bold text-accent">২,২৬০</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-text-primary font-bengali mb-1">সর্বোচ্চ</div>
              <div className="text-lg font-bold text-primary font-bengali">ঢাকা</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-text-primary font-bengali mb-1">সর্বনিম্ন</div>
              <div className="text-lg font-bold text-error font-bengali">বরিশাল</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsChart;