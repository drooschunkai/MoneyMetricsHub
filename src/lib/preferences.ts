// Global user preferences for internationalization (Phase 2 and Phase 9)
export interface UserPreferences {
  currency: 'USD' | 'EUR' | 'GBP' | 'INR';
  country: 'US' | 'GB' | 'CA' | 'IN';
  numberFormat: 'us' | 'eu' | 'in';
  taxRegion: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  currency: 'USD',
  country: 'US',
  numberFormat: 'us',
  taxRegion: 'standard'
};

// Helper to load preferences
export function getPreferences(): UserPreferences {
  try {
    const saved = localStorage.getItem('money_metrics_preferences');
    if (saved) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Error parsing user preferences', e);
  }
  return DEFAULT_PREFERENCES;
}

// Helper to save preferences
export function savePreferences(prefs: UserPreferences) {
  try {
    localStorage.setItem('money_metrics_preferences', JSON.stringify(prefs));
    // Dispatch custom event to notify components of preference updates
    window.dispatchEvent(new Event('preferences_updated'));
  } catch (e) {
    console.error('Error saving user preferences', e);
  }
}

// Map currencies to symbols
export const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹'
};

// Advanced dynamic money and number formatter
export function formatPrefMoney(value: number, decimalPlaces = 0): string {
  const prefs = getPreferences();
  const symbol = currencySymbols[prefs.currency] || '$';

  // Prevent NaN issues
  if (isNaN(value) || value === null || value === undefined) {
    return symbol + '0';
  }

  // Round value to decimalPlaces
  const factor = Math.pow(10, decimalPlaces);
  const roundedValue = Math.round(value * factor) / factor;

  // 1. Indian Lakhs/Crores numbering format (e.g. 1,23,456.78)
  if (prefs.numberFormat === 'in' || prefs.currency === 'INR') {
    const parts = roundedValue.toFixed(decimalPlaces).split('.');
    let x = parts[0];
    const y = parts.length > 1 ? '.' + parts[1] : '';
    const rgx = /(\d+)(\d{3})/;
    if (rgx.test(x)) {
      x = x.replace(rgx, '$1,$2');
    }
    // Format other parts in two-digit blocks
    while (true) {
      const rgx2 = /(\d+)(\d{2},\d{3})/;
      if (rgx2.test(x)) {
        x = x.replace(rgx2, '$1,$2');
      } else {
        break;
      }
    }
    return symbol + x + y;
  }

  // 2. European dot separation formatting (e.g. 1.234,56 €)
  if (prefs.numberFormat === 'eu' || prefs.currency === 'EUR') {
    const formattedNum = roundedValue
      .toFixed(decimalPlaces)
      .replace('.', ',')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formattedNum} ${symbol}`;
  }

  // 3. US/UK default formatting (e.g. $1,234.56)
  const formattedDefault = roundedValue
    .toFixed(decimalPlaces)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return symbol + formattedDefault;
}

// Dynamic basic number formatter
export function formatPrefNumber(value: number): string {
  const prefs = getPreferences();
  if (isNaN(value) || value === null || value === undefined) return '0';

  if (prefs.numberFormat === 'eu') {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.').replace('.', ',');
  }
  return value.toLocaleString();
}

// --- LOCAL FAVORITES SYSTEM ---
export function getFavorites(): string[] {
  try {
    const saved = localStorage.getItem('money_metrics_favorites');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

export function toggleFavorite(slug: string): boolean {
  try {
    const favs = getFavorites();
    const index = favs.indexOf(slug);
    let added = false;
    if (index >= 0) {
      favs.splice(index, 1);
    } else {
      favs.push(slug);
      added = true;
    }
    localStorage.setItem('money_metrics_favorites', JSON.stringify(favs));
    window.dispatchEvent(new Event('favorites_updated'));
    return added;
  } catch (e) {
    return false;
  }
}

export function isFavorite(slug: string): boolean {
  return getFavorites().includes(slug);
}

// --- CALCULATION HISTORY SYSTEM ---
export interface HistoryRecord {
  id: string;
  slug: string;
  name: string;
  timestamp: number;
  inputs: Record<string, any>;
  summaryText: string;
}

export function getHistory(): HistoryRecord[] {
  try {
    const saved = localStorage.getItem('money_metrics_history');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

export function addToHistory(slug: string, name: string, inputs: Record<string, any>, summaryText: string) {
  try {
    let list = getHistory();
    // Filter duplicates of the same calculator to avoid clutter
    list = list.filter((item) => item.slug !== slug);
    
    const record: HistoryRecord = {
      id: Math.random().toString(36).substring(2, 9),
      slug,
      name,
      timestamp: Date.now(),
      inputs,
      summaryText
    };

    list.unshift(record);
    // Limit to top 15 records
    if (list.length > 15) list = list.slice(0, 15);

    localStorage.setItem('money_metrics_history', JSON.stringify(list));
    window.dispatchEvent(new Event('history_updated'));
  } catch (e) {
    console.error('Error adding to history log', e);
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem('money_metrics_history');
    window.dispatchEvent(new Event('history_updated'));
  } catch (e) {
    console.error('Error clearing history log', e);
  }
}
