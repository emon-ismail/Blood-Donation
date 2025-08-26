import React, { useState } from 'react';


const DistrictMap = () => {
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const districtData = [
    { name: "ঢাকা", donors: 1250, requests: 45, availability: "high", lat: 23.8103, lng: 90.4125 },
    { name: "চট্টগ্রাম", donors: 890, requests: 32, availability: "medium", lat: 22.3569, lng: 91.7832 },
    { name: "সিলেট", donors: 420, requests: 18, availability: "low", lat: 24.8949, lng: 91.8687 },
    { name: "রাজশাহী", donors: 650, requests: 25, availability: "medium", lat: 24.3745, lng: 88.6042 },
    { name: "খুলনা", donors: 380, requests: 22, availability: "low", lat: 22.8456, lng: 89.5403 },
    { name: "বরিশাল", donors: 290, requests: 15, availability: "critical", lat: 22.7010, lng: 90.3535 },
    { name: "রংপুর", donors: 340, requests: 19, availability: "low", lat: 25.7439, lng: 89.2752 },
    { name: "ময়মনসিংহ", donors: 480, requests: 21, availability: "medium", lat: 24.7471, lng: 90.4203 }
  ];

  const getAvailabilityColor = (availability) => {
    const colors = {
      high: 'bg-success',
      medium: 'bg-warning',
      low: 'bg-error',
      critical: 'bg-destructive'
    };
    return colors?.[availability] || 'bg-muted';
  };

  const getAvailabilityText = (availability) => {
    const texts = {
      high: 'উচ্চ',
      medium: 'মাঝারি',
      low: 'কম',
      critical: 'সংকটাপন্ন'
    };
    return texts?.[availability] || 'অজানা';
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-brand border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary font-bengali">জেলাভিত্তিক রক্তের প্রাপ্যতা</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-xs text-muted-foreground font-bengali">উচ্চ</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span className="text-xs text-muted-foreground font-bengali">মাঝারি</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-error rounded-full"></div>
            <span className="text-xs text-muted-foreground font-bengali">কম</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-destructive rounded-full"></div>
            <span className="text-xs text-muted-foreground font-bengali">সংকটাপন্ন</span>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="w-full h-96 bg-muted rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            title="Bangladesh Districts Map"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=23.6850,90.3563&z=7&output=embed"
            className="rounded-lg"
          />
        </div>

        {/* District Overlay Cards */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="relative w-full h-full">
            {districtData?.map((district, index) => (
              <div
                key={district?.name}
                className={`absolute pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
                  index === 0 ? 'top-1/3 left-1/2' :
                  index === 1 ? 'top-2/3 right-1/4' :
                  index === 2 ? 'top-1/4 right-1/6' :
                  index === 3 ? 'top-1/3 left-1/4' :
                  index === 4 ? 'bottom-1/3 left-1/3' :
                  index === 5 ? 'bottom-1/4 left-1/2' :
                  index === 6 ? 'top-1/6 left-1/3': 'top-1/4 left-2/5'
                }`}
                onClick={() => setSelectedDistrict(selectedDistrict === district?.name ? null : district?.name)}
              >
                <div className={`w-4 h-4 rounded-full ${getAvailabilityColor(district?.availability)} border-2 border-white shadow-brand animate-pulse`}></div>
                
                {selectedDistrict === district?.name && (
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-brand-lg border border-border p-3 min-w-48 z-10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-text-primary font-bengali">{district?.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getAvailabilityColor(district?.availability)}`}>
                        {getAvailabilityText(district?.availability)}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground font-bengali">রক্তদাতা:</span>
                        <span className="text-sm font-medium text-text-primary">{district?.donors}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground font-bengali">অনুরোধ:</span>
                        <span className="text-sm font-medium text-text-primary">{district?.requests}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* District Summary */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {districtData?.slice(0, 4)?.map((district) => (
          <div key={district?.name} className="bg-muted rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${getAvailabilityColor(district?.availability)}`}></div>
              <span className="text-sm font-medium text-text-primary font-bengali">{district?.name}</span>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span className="font-bengali">দাতা:</span>
                <span>{district?.donors}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bengali">অনুরোধ:</span>
                <span>{district?.requests}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DistrictMap;