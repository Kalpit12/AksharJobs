// Currency utility functions for multi-currency support

// Currency configuration for different countries
export const CURRENCY_CONFIG = {
  // North America
  'US': { code: 'USD', symbol: '$', locale: 'en-US' },
  'CA': { code: 'CAD', symbol: 'C$', locale: 'en-CA' },
  'MX': { code: 'MXN', symbol: '$', locale: 'es-MX' },
  
  // Europe
  'GB': { code: 'GBP', symbol: '£', locale: 'en-GB' },
  'DE': { code: 'EUR', symbol: '€', locale: 'de-DE' },
  'FR': { code: 'EUR', symbol: '€', locale: 'fr-FR' },
  'ES': { code: 'EUR', symbol: '€', locale: 'es-ES' },
  'IT': { code: 'EUR', symbol: '€', locale: 'it-IT' },
  'NL': { code: 'EUR', symbol: '€', locale: 'nl-NL' },
  'BE': { code: 'EUR', symbol: '€', locale: 'fr-BE' },
  'SE': { code: 'SEK', symbol: 'kr', locale: 'sv-SE' },
  'NO': { code: 'NOK', symbol: 'kr', locale: 'nb-NO' },
  'DK': { code: 'DKK', symbol: 'kr', locale: 'da-DK' },
  'CH': { code: 'CHF', symbol: 'CHF', locale: 'de-CH' },
  'PL': { code: 'PLN', symbol: 'zł', locale: 'pl-PL' },
  'IE': { code: 'EUR', symbol: '€', locale: 'en-IE' },
  
  // Asia
  'JP': { code: 'JPY', symbol: '¥', locale: 'ja-JP' },
  'CN': { code: 'CNY', symbol: '¥', locale: 'zh-CN' },
  'IN': { code: 'INR', symbol: '₹', locale: 'en-IN' },
  'SG': { code: 'SGD', symbol: 'S$', locale: 'en-SG' },
  'HK': { code: 'HKD', symbol: 'HK$', locale: 'en-HK' },
  'AU': { code: 'AUD', symbol: 'A$', locale: 'en-AU' },
  'NZ': { code: 'NZD', symbol: 'NZ$', locale: 'en-NZ' },
  'AE': { code: 'AED', symbol: 'د.إ', locale: 'en-AE' },
  'SA': { code: 'SAR', symbol: '﷼', locale: 'ar-SA' },
  'KR': { code: 'KRW', symbol: '₩', locale: 'ko-KR' },
  'TH': { code: 'THB', symbol: '฿', locale: 'th-TH' },
  'MY': { code: 'MYR', symbol: 'RM', locale: 'en-MY' },
  'ID': { code: 'IDR', symbol: 'Rp', locale: 'id-ID' },
  'PH': { code: 'PHP', symbol: '₱', locale: 'en-PH' },
  
  // Africa
  'ZA': { code: 'ZAR', symbol: 'R', locale: 'en-ZA' },
  'NG': { code: 'NGN', symbol: '₦', locale: 'en-NG' },
  'KE': { code: 'KES', symbol: 'KSh', locale: 'en-KE' },
  'EG': { code: 'EGP', symbol: 'E£', locale: 'en-EG' },
  
  // South America
  'BR': { code: 'BRL', symbol: 'R$', locale: 'pt-BR' },
  'AR': { code: 'ARS', symbol: '$', locale: 'es-AR' },
  'CL': { code: 'CLP', symbol: '$', locale: 'es-CL' },
  'CO': { code: 'COP', symbol: '$', locale: 'es-CO' },
  'PE': { code: 'PEN', symbol: 'S/', locale: 'es-PE' },
  
  // Default
  'DEFAULT': { code: 'USD', symbol: '$', locale: 'en-US' }
};

// Basic exchange rates (for demonstration, in a real app this would come from an API)
const EXCHANGE_RATES = {
  'USD': 1,
  'EUR': 0.92,
  'GBP': 0.79,
  'CAD': 1.36,
  'MXN': 17.07,
  'JPY': 151.80,
  'CNY': 7.23,
  'INR': 83.40,
  'SGD': 1.35,
  'HKD': 7.83,
  'AUD': 1.52,
  'NZD': 1.66,
  'ZAR': 18.78,
  'NGN': 1300,
  'KES': 132.00,
  'EGP': 47.30,
  'AED': 3.67,
  'SAR': 3.75,
  'KRW': 1350,
  'THB': 36.50,
  'MYR': 4.75,
  'IDR': 15800,
  'PHP': 56.50,
  'BRL': 5.05,
  'ARS': 860,
  'CLP': 970,
  'COP': 3900,
  'PEN': 3.70,
  'CHF': 0.90,
  'SEK': 10.80,
  'NOK': 10.90,
  'DKK': 6.90,
  'PLN': 4.00,
  'CZK': 23.50,
  'HUF': 360,
};

// Function to get user's country (simplified for client-side)
export const getUserCountry = () => {
  // Try to get from user profile if available (e.g., from AuthContext or localStorage)
  const userProfile = JSON.parse(localStorage.getItem('user') || '{}');
  if (userProfile.country) {
    return userProfile.country;
  }

  // Fallback to browser locale
  const userLocale = navigator.language || navigator.languages[0];
  const countryCodeFromLocale = userLocale.split('-')[1]?.toUpperCase();
  if (countryCodeFromLocale && CURRENCY_CONFIG[countryCodeFromLocale]) {
    return countryCodeFromLocale;
  }

  // Fallback to timezone (less accurate but better than nothing)
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // Basic mapping from timezone to country code
    if (timezone.includes('America/New_York') || timezone.includes('America/Los_Angeles')) return 'US';
    if (timezone.includes('Europe/London')) return 'GB';
    if (timezone.includes('Europe/Berlin')) return 'DE';
    if (timezone.includes('Asia/Tokyo')) return 'JP';
    if (timezone.includes('Asia/Kolkata')) return 'IN';
    if (timezone.includes('Australia/Sydney')) return 'AU';
  } catch (e) {
    console.warn("Could not determine timezone for country detection:", e);
  }

  return 'US'; // Default to US if all else fails
};

export const getCurrencyInfo = (countryCode) => {
  return CURRENCY_CONFIG[countryCode] || CURRENCY_CONFIG['DEFAULT'];
};

export const convertAndFormatCurrency = (amount, fromCurrency, toCurrency, locale) => {
  if (fromCurrency === toCurrency) {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: toCurrency }).format(amount);
  }

  const rateFrom = EXCHANGE_RATES[fromCurrency];
  const rateTo = EXCHANGE_RATES[toCurrency];

  if (!rateFrom || !rateTo) {
    console.warn(`Exchange rate not available for ${fromCurrency} or ${toCurrency}. Using direct format.`);
    return new Intl.NumberFormat(locale, { style: 'currency', currency: toCurrency }).format(amount);
  }

  const amountInUSD = amount / rateFrom;
  const convertedAmount = amountInUSD * rateTo;

  return new Intl.NumberFormat(locale, { style: 'currency', currency: toCurrency }).format(convertedAmount);
};

export const formatSalary = (salaryString, userCountry) => {
  if (!salaryString || typeof salaryString !== 'string') {
    return 'Competitive Salary';
  }

  const { code: currency, locale } = getCurrencyInfo(userCountry);

  // Extract numbers from the salary string (e.g., "$80,000 - $120,000" or "80K - 120K")
  const numbers = salaryString.match(/(\d+(\.\d+)?)/g);

  if (!numbers || numbers.length === 0) {
    return salaryString; // Return original if no numbers found
  }

  const parseValue = (numStr) => {
    let value = parseFloat(numStr.replace(/,/g, ''));
    if (numStr.toLowerCase().includes('k')) {
      value *= 1000;
    } else if (numStr.toLowerCase().includes('m')) {
      value *= 1000000;
    }
    return value;
  };

  const formattedNumbers = numbers.map(numStr => {
    const value = parseValue(numStr);
    // Assuming input salaries are in USD if no currency symbol is present
    return convertAndFormatCurrency(value, 'USD', currency, locale);
  });

  if (formattedNumbers.length === 1) {
    return formattedNumbers[0];
  } else if (formattedNumbers.length >= 2) {
    return `${formattedNumbers[0]} - ${formattedNumbers[1]}`;
  }

  return salaryString;
};

export const formatSalaryRange = (min, max, userCountry) => {
  const { code: currency, locale } = getCurrencyInfo(userCountry);

  // Assuming input min/max are in USD
  const formattedMin = convertAndFormatCurrency(min, 'USD', currency, locale);
  const formattedMax = convertAndFormatCurrency(max, 'USD', currency, locale);

  return `${formattedMin} - ${formattedMax}`;
};