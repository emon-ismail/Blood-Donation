import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

const TranslatedText = ({ 
  textKey, 
  fallback = '', 
  className = '', 
  children,
  ...props 
}) => {
  const { t, isBengali } = useTranslation();
  
  const text = textKey ? t(textKey) : (children || fallback);
  const classes = `${className} ${isBengali ? 'font-bengali' : ''}`.trim();
  
  return (
    <span className={classes} {...props}>
      {text}
    </span>
  );
};

export default TranslatedText;