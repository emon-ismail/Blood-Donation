import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Button from './Button';

const LanguageToggle = ({ className = '' }) => {
  const { language, changeLanguage, isEnglish } = useLanguage();

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <Button
        variant={isEnglish ? "default" : "outline"}
        size="sm"
        onClick={() => changeLanguage('en')}
        className="text-xs px-2 py-1"
      >
        EN
      </Button>
      <Button
        variant={!isEnglish ? "default" : "outline"}
        size="sm"
        onClick={() => changeLanguage('bn')}
        className="text-xs px-2 py-1"
      >
        বাং
      </Button>
    </div>
  );
};

export default LanguageToggle;