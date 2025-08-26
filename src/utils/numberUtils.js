// Bengali to English number conversion
const bengaliToEnglish = {
  '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
  '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
};

const englishToBengali = {
  '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
  '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
};

export const convertNumber = (number, toBengali = true) => {
  const numStr = number.toString();
  
  if (toBengali) {
    return numStr.replace(/[0-9]/g, (digit) => englishToBengali[digit] || digit);
  } else {
    return numStr.replace(/[০-৯]/g, (digit) => bengaliToEnglish[digit] || digit);
  }
};

export const formatNumber = (number, language = 'bn') => {
  const formatted = number.toLocaleString();
  return language === 'bn' ? convertNumber(formatted, true) : formatted;
};