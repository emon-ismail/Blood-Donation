import React, { useState, useEffect } from 'react';
import { donorService } from '../../../lib/donorService';
import { useTranslation } from '../../../hooks/useTranslation';


const BloodGroupSelector = ({ selectedBloodGroup, onBloodGroupSelect, isEmergencyMode }) => {
  const { t, isBengali } = useTranslation();
  const [bloodGroupCounts, setBloodGroupCounts] = useState({});
  const [loading, setLoading] = useState(true);

  const bloodGroups = [
    { group: 'A+', color: 'bg-red-500' },
    { group: 'A-', color: 'bg-red-600' },
    { group: 'B+', color: 'bg-blue-500' },
    { group: 'B-', color: 'bg-blue-600' },
    { group: 'AB+', color: 'bg-purple-500' },
    { group: 'AB-', color: 'bg-purple-600' },
    { group: 'O+', color: 'bg-green-500' },
    { group: 'O-', color: 'bg-green-600' }
  ];

  useEffect(() => {
    loadBloodGroupCounts();
  }, []);

  const loadBloodGroupCounts = async () => {
    try {
      const counts = {};
      
      // Get count for each blood group
      for (const bloodGroup of bloodGroups) {
        const donors = await donorService.searchDonors({
          bloodGroup: bloodGroup.group,
          location: '',
          availability: 'available'
        });
        counts[bloodGroup.group] = donors.length;
      }
      
      setBloodGroupCounts(counts);
    } catch (error) {
      console.error('Failed to load blood group counts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-brand p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-semibold text-text-primary ${isBengali ? 'font-bengali' : ''}`}>
          {t('selectBloodGroup')}
        </h2>
        {isEmergencyMode && (
          <div className="flex items-center space-x-2 text-destructive">
            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
            <span className={`text-sm font-medium ${isBengali ? 'font-bengali' : ''}`}>{isBengali ? 'জরুরি মোড' : 'Emergency Mode'}</span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {bloodGroups?.map((blood) => (
          <button
            key={blood?.group}
            onClick={() => onBloodGroupSelect(blood?.group)}
            className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
              selectedBloodGroup === blood?.group
                ? 'border-primary bg-primary/10 shadow-brand'
                : 'border-border hover:border-primary/50 hover:bg-muted'
            } ${isEmergencyMode ? 'min-h-[80px]' : 'min-h-[70px]'}`}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className={`w-8 h-8 ${blood?.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                {blood?.group}
              </div>
              <span className="text-sm font-medium text-text-primary">{blood?.group}</span>
              <span className={`text-xs text-muted-foreground ${isBengali ? 'font-bengali' : ''}`}>
                {loading ? '...' : `${bloodGroupCounts[blood?.group] || 0} ${t('people')} ${t('available')}`}
              </span>
            </div>
            
            {selectedBloodGroup === blood?.group && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </button>
        ))}
      </div>
      <div className="mt-4 p-3 bg-muted rounded-lg">
        <p className={`text-sm text-muted-foreground text-center ${isBengali ? 'font-bengali' : ''}`}>
          💡 {isBengali ? 'টিপস: O- সর্বজনীন দাতা, AB+ সর্বজনীন গ্রহীতা' : 'Tips: O- universal donor, AB+ universal recipient'}
        </p>
      </div>
    </div>
  );
};

export default BloodGroupSelector;