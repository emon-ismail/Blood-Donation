import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilterPanel = ({ filters, onFilterChange, onClearFilters, availableLocations = [] }) => {
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  const urgencyLevels = [
    { value: 'emergency', label: 'জরুরি', color: 'text-red-600' },
    { value: 'urgent', label: 'অত্যাবশ্যক', color: 'text-amber-600' },
    { value: 'standard', label: 'সাধারণ', color: 'text-green-600' }
  ];

  // Use available locations from props, fallback to default districts
  const defaultLocations = ['ঢাকা', 'চট্টগ্রাম', 'সিলেট', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'রংপুর', 'ময়মনসিংহ'];
  const locations = availableLocations.length > 0 ? availableLocations : defaultLocations;

  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const toggleArrayFilter = (key, value) => {
    const currentArray = filters?.[key] || [];
    const newArray = currentArray?.includes(value)
      ? currentArray?.filter(item => item !== value)
      : [...currentArray, value];
    
    handleFilterChange(key, newArray);
  };

  const hasActiveFilters = () => {
    return Object.values(filters)?.some(value => 
      Array.isArray(value) ? value?.length > 0 : value
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-brand p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} className="text-primary" />
          <h3 className="text-lg font-bengali font-bold text-text-primary">ফিল্টার</h3>
        </div>
        {hasActiveFilters() && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
          >
            <span className="font-bengali">সব মুছুন</span>
          </Button>
        )}
      </div>
      <div className="space-y-6">
        {/* Blood Group Filter */}
        <div>
          <h4 className="text-sm font-bengali font-semibold text-text-primary mb-3">রক্তের গ্রুপ</h4>
          <div className="grid grid-cols-4 gap-2">
            {bloodGroups?.map((group) => (
              <button
                key={group}
                onClick={() => toggleArrayFilter('bloodGroups', group)}
                className={`p-2 rounded-lg border-2 font-bold text-sm transition-all duration-200 ${
                  filters?.bloodGroups?.includes(group)
                    ? 'border-primary bg-primary text-white' :'border-border hover:border-primary hover:bg-muted'
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </div>

        {/* Urgency Level Filter */}
        <div>
          <h4 className="text-sm font-bengali font-semibold text-text-primary mb-3">জরুরি মাত্রা</h4>
          <div className="space-y-2">
            {urgencyLevels?.map((level) => (
              <label key={level?.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters?.urgencyLevels?.includes(level?.value) || false}
                  onChange={() => toggleArrayFilter('urgencyLevels', level?.value)}
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <span className={`font-bengali text-sm ${level?.color}`}>{level?.label}</span>
              </label>
            ))}
          </div>
        </div>



        {/* Units Needed Filter */}
        <div>
          <h4 className="text-sm font-bengali font-semibold text-text-primary mb-3">রক্তের ব্যাগ</h4>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="unitsNeeded"
                checked={filters?.unitsNeeded === '1'}
                onChange={() => handleFilterChange('unitsNeeded', '1')}
                className="w-4 h-4 text-primary"
              />
              <span className="font-bengali text-sm text-text-primary">১ ব্যাগ</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="unitsNeeded"
                checked={filters?.unitsNeeded === '2-3'}
                onChange={() => handleFilterChange('unitsNeeded', '2-3')}
                className="w-4 h-4 text-primary"
              />
              <span className="font-bengali text-sm text-text-primary">২-৩ ব্যাগ</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="unitsNeeded"
                checked={filters?.unitsNeeded === '4+'}
                onChange={() => handleFilterChange('unitsNeeded', '4+')}
                className="w-4 h-4 text-primary"
              />
              <span className="font-bengali text-sm text-text-primary">৪+ ব্যাগ</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="unitsNeeded"
                checked={filters?.unitsNeeded === ''}
                onChange={() => handleFilterChange('unitsNeeded', '')}
                className="w-4 h-4 text-primary"
              />
              <span className="font-bengali text-sm text-text-primary">সব</span>
            </label>
          </div>
        </div>

        {/* Verification Status */}
        <div>
          <h4 className="text-sm font-bengali font-semibold text-text-primary mb-3">যাচাইকরণ</h4>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters?.verifiedOnly || false}
                onChange={(e) => handleFilterChange('verifiedOnly', e?.target?.checked)}
                className="w-4 h-4 text-primary rounded focus:ring-primary"
              />
              <div className="flex items-center space-x-2">
                <Icon name="ShieldCheck" size={14} className="text-blue-500" />
                <span className="font-bengali text-sm text-text-primary">শুধু যাচাইকৃত</span>
              </div>
            </label>
          </div>
        </div>

        {/* Time Range */}
        <div>
          <h4 className="text-sm font-bengali font-semibold text-text-primary mb-3">সময়সীমা</h4>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="timeRange"
                checked={filters?.timeRange === '24h'}
                onChange={() => handleFilterChange('timeRange', '24h')}
                className="w-4 h-4 text-primary"
              />
              <span className="font-bengali text-sm text-text-primary">২৪ ঘন্টার মধ্যে</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="timeRange"
                checked={filters?.timeRange === '48h'}
                onChange={() => handleFilterChange('timeRange', '48h')}
                className="w-4 h-4 text-primary"
              />
              <span className="font-bengali text-sm text-text-primary">৪৮ ঘন্টার মধ্যে</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="timeRange"
                checked={filters?.timeRange === '1w'}
                onChange={() => handleFilterChange('timeRange', '1w')}
                className="w-4 h-4 text-primary"
              />
              <span className="font-bengali text-sm text-text-primary">১ সপ্তাহের মধ্যে</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="timeRange"
                checked={filters?.timeRange === ''}
                onChange={() => handleFilterChange('timeRange', '')}
                className="w-4 h-4 text-primary"
              />
              <span className="font-bengali text-sm text-text-primary">সব</span>
            </label>
          </div>
        </div>
      </div>
      {/* Active Filters Summary */}
      {hasActiveFilters() && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Filter" size={14} className="text-primary" />
            <span className="text-sm font-bengali font-medium text-text-primary">সক্রিয় ফিল্টার</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters?.bloodGroups?.map(group => (
              <span key={group} className="px-2 py-1 bg-primary text-white text-xs rounded-full">
                {group}
              </span>
            ))}
            {filters?.urgencyLevels?.map(level => (
              <span key={level} className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-bengali">
                {urgencyLevels?.find(l => l?.value === level)?.label}
              </span>
            ))}

          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;