import React, { useState, useEffect, useRef } from 'react';
import Icon from '../AppIcon';
import { bangladeshHospitals, bangladeshLocations } from '../../data/bangladeshData';

const PlacesAutocomplete = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  error, 
  required = false,
  type = 'hospital' // 'hospital' or 'location'
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);





  const searchPlaces = (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce search
    timeoutRef.current = setTimeout(() => {
      const dataSource = type === 'hospital' ? bangladeshHospitals : bangladeshLocations;
      
      const filtered = dataSource.filter(item =>
        item.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8);

      setSuggestions(filtered);
      setIsLoading(false);
      setShowSuggestions(true);
    }, 300);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    searchPlaces(newValue);
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow click
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-primary font-bengali">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={() => value && searchPlaces(value)}
            placeholder={placeholder}
            className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
              error ? 'border-red-500' : 'border-border'
            }`}
          />
          
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {isLoading ? (
              <Icon name="Loader2" size={16} className="animate-spin text-muted-foreground" />
            ) : (
              <Icon name="MapPin" size={16} className="text-muted-foreground" />
            )}
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 font-bengali">{error}</p>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-border rounded-lg shadow-brand-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border last:border-b-0 flex items-center space-x-3"
            >
              <Icon 
                name={type === 'hospital' ? 'Building2' : 'MapPin'} 
                size={16} 
                className="text-primary flex-shrink-0" 
              />
              <span className="font-bengali text-sm text-text-primary">{suggestion}</span>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {showSuggestions && suggestions.length === 0 && value && !isLoading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-border rounded-lg shadow-brand-lg p-4">
          <div className="flex items-center space-x-3 text-muted-foreground">
            <Icon name="Search" size={16} />
            <span className="font-bengali text-sm">কোনো ফলাফল পাওয়া যায়নি</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacesAutocomplete;