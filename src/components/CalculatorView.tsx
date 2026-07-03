import { useState, useEffect, useRef } from 'react';
import * as Lucide from 'lucide-react';
import { CalculatorDefinition, FAQItem } from '../types';
import { calculators } from '../data/calculators';
import { categories } from '../data/categories';
import { guides } from '../data/guides';
import SEO from './SEO';
import { isFavorite, toggleFavorite, addToHistory, getPreferences, formatPrefMoney, formatPrefNumber, currencySymbols } from '../lib/preferences';

interface CalculatorViewProps {
  calculatorSlug: string;
  onNavigate: (route: string) => void;
  initialOverrides?: Record<string, any>;
}

export default function CalculatorView({ calculatorSlug, onNavigate, initialOverrides }: CalculatorViewProps) {
  const calculator = calculators.find((calc) => calc.slug === calculatorSlug);

  // Listen to preferences state to force-refresh when update event fires
  const [prefs, setPrefs] = useState(() => getPreferences());
  useEffect(() => {
    const handleUpdate = () => {
      setPrefs(getPreferences());
    };
    window.addEventListener('preferences_updated', handleUpdate);
    return () => {
      window.removeEventListener('preferences_updated', handleUpdate);
    };
  }, []);

  // Fallback if calculator not found
  if (!calculator) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <Lucide.AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-2xl font-bold">Calculator Not Found</h2>
        <p className="text-slate-500">The requested calculator could not be located.</p>
        <button
          onClick={() => onNavigate('')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
        >
          Return Home
        </button>
      </div>
    );
  }

  // Get parent category
  const category = categories.find((cat) => cat.id === calculator.category);

  // Manage calculator inputs state dynamically
  const [inputs, setInputs] = useState<Record<string, any>>(() => {
    try {
      const savedOverride = sessionStorage.getItem(`override_${calculatorSlug}`);
      if (savedOverride) {
        sessionStorage.removeItem(`override_${calculatorSlug}`);
        return JSON.parse(savedOverride);
      }
    } catch (e) {}

    const defaultVals: Record<string, any> = {};
    calculator.inputs.forEach((input) => {
      defaultVals[input.id] = initialOverrides && initialOverrides[input.id] !== undefined
        ? initialOverrides[input.id]
        : input.defaultValue;
    });
    return defaultVals;
  });

  // Re-initialize state if calculatorSlug or initialOverrides changes
  useEffect(() => {
    try {
      const savedOverride = sessionStorage.getItem(`override_${calculatorSlug}`);
      if (savedOverride) {
        sessionStorage.removeItem(`override_${calculatorSlug}`);
        setInputs(JSON.parse(savedOverride));
        return;
      }
    } catch (e) {}

    const defaultVals: Record<string, any> = {};
    calculator.inputs.forEach((input) => {
      defaultVals[input.id] = initialOverrides && initialOverrides[input.id] !== undefined
        ? initialOverrides[input.id]
        : input.defaultValue;
    });
    setInputs(defaultVals);
  }, [calculatorSlug, JSON.stringify(initialOverrides)]);

  const handleInputChange = (id: string, val: any) => {
    setInputs((prev) => ({
      ...prev,
      [id]: val
    }));
  };

  // Toggle favorite state
  const [fav, setFav] = useState(isFavorite(calculator.slug));
  useEffect(() => {
    setFav(isFavorite(calculator.slug));
  }, [calculatorSlug]);

  const handleToggleFavorite = () => {
    const isNowFav = toggleFavorite(calculator.slug);
    setFav(isNowFav);
  };

  // Run calculation engine
  const result = calculator.calculate(inputs);

  // Format the outputs according to preferences
  const formattedSummary = result.summary.map((sum) => {
    // Determine if we should format with preferences
    const isCurrency = typeof sum.rawValue === 'number' && (
      sum.value.includes('$') ||
      /salary|wage|worth|assets|liabilities|payment|fund|balance|interest|principal|fee|disbursed|payout|contribution|savings|cost|value|erosion/i.test(sum.label)
    );

    if (isCurrency && sum.rawValue !== undefined) {
      const isHourly = sum.label.toLowerCase().includes('hourly');
      return {
        ...sum,
        value: formatPrefMoney(sum.rawValue, isHourly ? 2 : 0)
      };
    }
    return sum;
  });

  const formatTextPreferences = (text: string) => {
    if (!text) return text;
    return text.replace(/(-?|\+?)\$(\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+)/g, (match, sign, numStr) => {
      const num = parseFloat(numStr.replace(/,/g, ''));
      if (isNaN(num)) return match;
      const hasDecimals = numStr.includes('.');
      const decimalPlaces = hasDecimals ? numStr.split('.')[1].length : 0;
      
      const formatted = formatPrefMoney(num, decimalPlaces);
      return sign === '-' ? `-${formatted}` : `${sign}${formatted}`;
    });
  };

  const formattedInterpretation = formatTextPreferences(result.interpretation);

  // Save to history log on calculation updates
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formattedSummary && formattedSummary.length > 0) {
        const topResult = formattedSummary[0];
        const summaryText = `${topResult.label}: ${topResult.value}`;
        addToHistory(calculator.slug, calculator.name, inputs, summaryText);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [inputs, calculator.slug, calculator.name, JSON.stringify(formattedSummary)]);

  // Accordion state for FAQs
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // SVG Chart rendering helper
  const renderChart = () => {
    if (!result.chartData || result.chartData.length === 0) return null;

    // Check if it's a Pie/Donut (e.g., balance splits with length of 2 or 3 items)
    const isPieChart = result.chartData.length <= 3 && result.chartData[0]?.name;

    if (isPieChart) {
      // Donut Chart
      const data = result.chartData;
      const total = data.reduce((sum, item) => sum + item.value, 0);
      let cumulativePercent = 0;

      // Colors for split segments
      const sliceColors = ['#3b82f6', '#10b981', '#fbbf24', '#ef4444'];

      return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4">
          <div className="relative w-44 h-44">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="transparent" className="stroke-slate-100 dark:stroke-slate-800 transition-colors duration-200" strokeWidth="12" />
              {data.map((item, index) => {
                if (total === 0) return null;
                const percentage = item.value / total;
                const strokeDasharray = `${percentage * 251.2} 251.2`;
                const strokeDashoffset = `-${cumulativePercent * 251.2}`;
                cumulativePercent += percentage;

                return (
                  <circle
                    key={index}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke={sliceColors[index % sliceColors.length]}
                    strokeWidth="12"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                );
              })}
              <circle cx="50" cy="50" r="28" className="fill-white dark:fill-slate-900 transition-colors duration-200" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total</span>
              <span className="text-base font-bold font-mono text-slate-900 dark:text-white">{formatPrefMoney(total, 0)}</span>
            </div>
          </div>

          <div className="space-y-2.5">
            {data.map((item, index) => {
              const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
              return (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <div className="w-3.5 h-3.5 rounded-md" style={{ backgroundColor: sliceColors[index % sliceColors.length] }}></div>
                  <span className="text-slate-500 font-medium">{item.name}:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{formatPrefMoney(item.value, 0)} ({pct}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Amortization/Growth Column Stacked Chart
    const list = result.chartData;
    const keys = result.chartKeys || [];

    // Find absolute max value
    let maxVal = 0;
    list.forEach((item: any) => {
      let sum = 0;
      keys.forEach((k) => {
        sum += (item[k.key] || 0);
      });
      if (sum > maxVal) maxVal = sum;
    });

    if (maxVal === 0) maxVal = 1;

    return (
      <div className="space-y-4">
        {/* Y-Axis scale references */}
        <div className="flex justify-between text-[10px] font-mono text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-1">
          <span>Growth Path</span>
          <span>Max: {formatPrefMoney(maxVal, 0)}</span>
        </div>

        {/* Scaled Columns layout */}
        <div className="h-44 flex items-end gap-1.5 pt-2">
          {list.map((item: any, idx: number) => {
            return (
              <div key={idx} className="flex-1 flex flex-col justify-end h-full relative group">
                {/* Column stack wrapper */}
                <div className="w-full flex flex-col justify-end rounded-t overflow-hidden h-full max-h-[100%]">
                  {keys.map((k, keyIdx) => {
                    const val = item[k.key] || 0;
                    const heightPct = (val / maxVal) * 100;
                    
                    return (
                      <div
                        key={k.key}
                        style={{ height: `${heightPct}%`, backgroundColor: k.color }}
                        className="w-full opacity-85 hover:opacity-100 transition-opacity duration-150"
                      />
                    );
                  })}
                </div>
                
                {/* Label indicator (condensed to show start, mid, end label) */}
                {(idx === 0 || idx === Math.round(list.length / 2) || idx === list.length - 1) && (
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-slate-400 font-semibold whitespace-nowrap">
                    {item.label}
                  </span>
                )}

                {/* Inline Popover Tooltip on Hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[10px] rounded p-2 shadow-xl border border-slate-800 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-20 mb-2 whitespace-nowrap font-mono">
                  <div className="font-bold text-slate-300 mb-0.5">{item.label}</div>
                  {keys.map((k) => (
                    <div key={k.key} className="flex gap-2 justify-between">
                      <span className="text-slate-400">{k.label}:</span>
                      <span>{formatPrefMoney(item[k.key] || 0, 0)}</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-800 mt-1 pt-1 flex justify-between font-bold text-blue-400">
                    <span>Total:</span>
                    <span>{formatPrefMoney(keys.reduce((s, k) => s + (item[k.key] || 0), 0), 0)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="h-4"></div> {/* spacer for label heights */}

        {/* Chart Legend */}
        <div className="flex flex-wrap justify-center gap-4 pt-3 border-t border-slate-50 dark:border-slate-800 text-xs">
          {keys.map((k) => (
            <div key={k.key} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded" style={{ backgroundColor: k.color }}></span>
              <span className="text-slate-500 dark:text-slate-400 font-medium">{k.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Get active variables description for formulas
  const formatEquation = (eq: string) => {
    return eq;
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SEO
        title={calculator.title}
        description={calculator.metaDescription}
        schemaType="calculator"
        slug={`calculators/${calculator.slug}`}
        faqs={calculator.faqs}
        categoryName={category?.name}
      />

      {/* Breadcrumbs Navigation */}
      <nav className="flex text-xs text-slate-500 gap-1.5 items-center">
        <button onClick={() => onNavigate('')} className="hover:text-blue-600 cursor-pointer">Home</button>
        <Lucide.ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => onNavigate('categories')} className="hover:text-blue-600 cursor-pointer">Categories</button>
        <Lucide.ChevronRight className="w-3.5 h-3.5" />
        {category && (
          <>
            <button onClick={() => onNavigate(`categories/${category.slug}`)} className="hover:text-blue-600 cursor-pointer">
              {category.name}
            </button>
            <Lucide.ChevronRight className="w-3.5 h-3.5" />
          </>
        )}
        <span className="text-slate-800 dark:text-slate-200 font-medium">{calculator.name}</span>
      </nav>

      {/* Header Info Block with Favorite Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 py-1">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-3 animate-fade-in">
            <h1 className="font-display text-2xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
              {calculator.name}
            </h1>
            <button
              onClick={handleToggleFavorite}
              title={fav ? 'Remove from Favorites' : 'Add to Favorites'}
              className="p-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:scale-105 transition-all cursor-pointer text-yellow-500 hover:text-yellow-600 dark:text-yellow-400"
            >
              {fav ? (
                <Lucide.Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              ) : (
                <Lucide.Star className="w-4 h-4 text-slate-300 dark:text-slate-600 fill-none" />
              )}
            </button>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-3xl leading-relaxed">
            {calculator.shortDescription}
          </p>
        </div>
      </div>

      {/* Ads Placeholder */}
      <div className="bg-slate-100 dark:bg-slate-900/40 text-slate-400 dark:text-slate-500 text-xs py-3 px-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center uppercase tracking-widest transition-colors duration-200">
        Sponsored Financial Placement (Google AdSense Ready)
      </div>

      {/* Two-Column Calculator Engine Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6 transition-colors duration-200">
          <div className="flex items-center gap-2 border-b border-slate-50 dark:border-slate-800/60 pb-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg">
              <Lucide.Sliders className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-slate-800 dark:text-white text-base">Adjust Variables</h3>
          </div>

          <div className="space-y-6">
            {calculator.inputs.map((input) => (
              <div key={input.id} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label htmlFor={`input-${input.id}`} className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    {input.label.replace('($)', `(${currencySymbols[prefs.currency] || '$'})`)}
                    {input.helpText && (
                      <span className="group relative text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-help">
                        <Lucide.HelpCircle className="w-3.5 h-3.5" />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] rounded p-2 w-48 shadow-lg hidden group-hover:block leading-normal z-30">
                          {input.helpText}
                        </span>
                      </span>
                    )}
                  </label>
                  
                  {/* Inline numeric display */}
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40 px-2 py-0.5 rounded text-xs transition-colors">
                    {input.prefix === '$' ? (currencySymbols[prefs.currency] || '$') : input.prefix}
                    {input.type === 'select' 
                      ? input.options?.find((o) => o.value === Number(inputs[input.id]))?.label || inputs[input.id]
                      : input.prefix === '$'
                        ? formatPrefNumber(Number(inputs[input.id]))
                        : Number(inputs[input.id]).toLocaleString()}
                    {input.suffix}
                  </span>
                </div>

                {/* Render Slider if requested, otherwise standard type handlers */}
                {input.type === 'slider' ? (
                  <div className="space-y-1">
                    <input
                      id={`input-${input.id}`}
                      type="range"
                      min={input.min}
                      max={input.max}
                      step={input.step || 1}
                      value={inputs[input.id]}
                      onChange={(e) => handleInputChange(input.id, Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                      <span>{input.min}</span>
                      <span>{input.max}</span>
                    </div>
                  </div>
                ) : input.type === 'select' ? (
                  <select
                    id={`input-${input.id}`}
                    value={inputs[input.id]}
                    onChange={(e) => handleInputChange(input.id, Number(e.target.value))}
                    className="w-full bg-slate-50/50 dark:bg-slate-950/20 hover:bg-slate-50 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 font-medium transition-all outline-none cursor-pointer duration-200"
                  >
                    {input.options?.map((opt) => (
                      <option key={opt.value} value={opt.value} className="dark:bg-slate-900 dark:text-slate-100">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : input.type === 'checkbox' ? (
                  <input
                    id={`input-${input.id}`}
                    type="checkbox"
                    checked={inputs[input.id]}
                    onChange={(e) => handleInputChange(input.id, e.target.checked)}
                    className="w-5 h-5 rounded border-slate-200 dark:border-slate-800 dark:bg-slate-950/20 text-blue-600 focus:ring-blue-500"
                  />
                ) : (
                  // Number Text Box with Range Slide backup below it automatically to improve UX
                  <div className="space-y-2">
                    <div className="relative">
                      {input.prefix && (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-medium text-sm">
                          {input.prefix === '$' ? (currencySymbols[prefs.currency] || '$') : input.prefix}
                        </span>
                      )}
                      <input
                        id={`input-${input.id}`}
                        type="number"
                        min={input.min}
                        max={input.max}
                        step={input.step || 1}
                        value={inputs[input.id]}
                        onChange={(e) => handleInputChange(input.id, Number(e.target.value))}
                        className={`w-full bg-slate-50/50 dark:bg-slate-950/20 hover:bg-slate-50 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-100 transition-colors outline-none ${input.prefix ? 'pl-7' : 'pl-4'} ${input.suffix ? 'pr-12' : 'pr-4'}`}
                      />
                      {input.suffix && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-medium text-sm">
                          {input.suffix}
                        </span>
                      )}
                    </div>
                    {/* Add supplementary slider if scale metrics exist */}
                    {input.max !== undefined && input.min !== undefined && (
                      <input
                        type="range"
                        min={input.min}
                        max={input.max}
                        step={input.step || 1}
                        value={inputs[input.id]}
                        onChange={(e) => handleInputChange(input.id, Number(e.target.value))}
                        className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded appearance-none cursor-pointer accent-blue-500"
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Output Results & Dynamic Charts */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Results Card */}
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-8 transition-colors duration-200">
            <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800/60 pb-4">
              <h3 className="font-display font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                <Lucide.PieChart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Calculation Results
              </h3>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                Instant
              </span>
            </div>

             {/* Results Primary Metric Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {formattedSummary.map((sum, index) => (
                <div key={index} className={`p-4 rounded-2xl border border-slate-50 dark:border-slate-800/60 ${index === 0 ? 'bg-blue-50/20 dark:bg-blue-950/20' : 'bg-slate-50/25 dark:bg-slate-900/30'}`}>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium block mb-1">{sum.label}</span>
                  <span className={`font-display text-xl font-bold font-mono tracking-tight ${sum.valueColor || 'text-slate-900 dark:text-white'}`}>
                    {sum.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Dynamic Interactive SVG Chart container */}
            <div className="p-4 bg-slate-50/40 dark:bg-slate-950/10 rounded-2xl border border-slate-100/50 dark:border-slate-800/50">
              {renderChart()}
            </div>

            {/* Premium Callout narrative interpretation of calculated metrics */}
            <div className="bg-blue-50/30 dark:bg-blue-950/20 p-5 rounded-2xl border border-blue-50/50 dark:border-blue-900/40 space-y-2">
              <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                <Lucide.CheckSquare className="w-4 h-4" />
                Result Interpretation
              </h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                {formattedInterpretation}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Ads Placeholder */}
      <div className="bg-slate-100 dark:bg-slate-900/40 text-slate-400 dark:text-slate-500 text-xs py-3 px-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center uppercase tracking-widest transition-colors duration-200">
        Sponsored Financial Placement (Google AdSense Ready)
      </div>

      {/* Under-the-Hood: Math Formulas & Variable transparency */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 transition-colors duration-200">
        <div className="p-6 md:p-8 space-y-4 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Math & Theory</span>
          <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">How It Is Calculated</h3>
          
          <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
            <span className="text-blue-400 font-bold block mb-1">// Financial Formula</span>
            {formatEquation(calculator.formula.equation)}
          </div>

          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            {calculator.formula.explanation}
          </p>

          <div className="space-y-2">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Formula Variables:</h5>
            <div className="grid grid-cols-1 gap-2.5">
              {calculator.formula.variables.map((v) => (
                <div key={v.name} className="flex gap-2 text-xs">
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-1.5 rounded">{v.name}</span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">= {v.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step-by-Step Worked Example & Limitations */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="space-y-4">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Worked Example</span>
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Step-by-Step Scenario</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium italic">
              "{calculator.formula.example.scenario}"
            </p>
            <div className="space-y-2 font-mono text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              {calculator.formula.example.steps.map((step, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">{idx + 1}.</span>
                  <span>{formatTextPreferences(step)}</span>
                </div>
              ))}
              <div className="border-t border-slate-200 dark:border-slate-800 mt-2 pt-2 text-slate-900 dark:text-white font-bold flex gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Outcome:</span>
                <span>{formatTextPreferences(calculator.formula.example.result)}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Lucide.AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              Calculation Limitations
            </h4>
            <ul className="list-disc pl-4 text-xs text-slate-500 dark:text-slate-400 space-y-1">
              {calculator.formula.limitations.map((lim, idx) => (
                <li key={idx}>{lim}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ list with accordions) */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6 transition-colors duration-200">
        <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Lucide.HelpCircle className="w-5.5 h-5.5 text-blue-600 dark:text-blue-400" />
          Frequently Asked Questions
        </h3>

        <div className="space-y-3.5">
          {calculator.faqs.map((faq, index) => (
            <div key={index} className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full text-left px-5 py-4 bg-slate-50/50 dark:bg-slate-950/20 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200 text-sm flex justify-between items-center transition-colors cursor-pointer"
              >
                {faq.question}
                <Lucide.ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === index ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''}`} />
              </button>
              {openFaq === index && (
                <div className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 leading-relaxed bg-white dark:bg-slate-900/40">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Verified Academic and Regulatory References section */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 transition-colors duration-200">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
          <Lucide.FileText className="w-4 h-4" />
          Verified Methodology References
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {calculator.references.map((ref, idx) => (
            <div key={idx} className="p-4 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-100/50 dark:border-slate-800/40 space-y-1.5 flex flex-col justify-between">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">{ref.name}</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">{ref.description}</p>
              </div>
              {ref.url && (
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-0.5 mt-2 transition-colors"
                >
                  Visit Official Source
                  <Lucide.ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Related Elements: Calculators and Guides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        
        {/* Related Calculators */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Related Calculators</h4>
          <div className="space-y-3">
            {calculator.relatedCalculators.map((slug) => {
              const relCalc = calculators.find((c) => c.slug === slug);
              if (!relCalc) return null;
              return (
                <div
                  key={slug}
                  onClick={() => onNavigate(`calculators/${slug}`)}
                  className="p-4 bg-white dark:bg-slate-900 hover:border-blue-100 dark:hover:border-slate-800 hover:bg-slate-50/10 border border-slate-100 dark:border-slate-800 shadow-sm rounded-xl flex justify-between items-center cursor-pointer transition-all duration-200"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg">
                      <Lucide.Calculator className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">{relCalc.name}</span>
                  </div>
                  <Lucide.ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Related Guides */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Educational Guides</h4>
          <div className="space-y-3">
            {calculator.relatedGuides.map((slug) => {
              const relGuide = guides.find((g) => g.slug === slug);
              if (!relGuide) return null;
              return (
                <div
                  key={slug}
                  onClick={() => onNavigate(`guides/${slug}`)}
                  className="p-4 bg-white dark:bg-slate-900 hover:border-blue-100 dark:hover:border-slate-800 hover:bg-slate-50/10 border border-slate-100 dark:border-slate-800 shadow-sm rounded-xl flex justify-between items-center cursor-pointer transition-all duration-200"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg">
                      <Lucide.BookOpen className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block truncate max-w-[200px] sm:max-w-[300px]">{relGuide.title}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{relGuide.readTime}</span>
                    </div>
                  </div>
                  <Lucide.ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
