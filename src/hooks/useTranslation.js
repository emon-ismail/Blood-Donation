import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translations';

export const useTranslation = () => {
  const { language } = useLanguage();
  
  return {
    t: (key) => t(key, language),
    language,
    isEnglish: language === 'en',
    isBengali: language === 'bn'
  };
};