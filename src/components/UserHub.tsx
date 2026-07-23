import React, { useState, useEffect } from 'react';
import * as Lucide from 'lucide-react';
import {
  getPreferences,
  savePreferences,
  UserPreferences,
  getFavorites,
  getHistory,
  clearHistory,
  toggleFavorite,
  HistoryRecord
} from '../lib/preferences';
import { calculators } from '../data/calculators';

interface UserHubProps {
  onNavigate: (route: string) => void;
}

export default function UserHub({ onNavigate }: UserHubProps) {
  const [prefs, setPrefs] = useState<UserPreferences>(() => getPreferences());
  const [favorites, setFavorites] = useState<string[]>(() => getFavorites());
  const [history, setHistory] = useState<HistoryRecord[]>(() => getHistory());
  const [successMsg, setSuccessMsg] = useState('');

  // Re-fetch local lists if events trigger changes
  useEffect(() => {
    const reloadFavs = () => setFavorites(getFavorites());
    const reloadHistory = () => setHistory(getHistory());

    window.addEventListener('favorites_updated', reloadFavs);
    window.addEventListener('history_updated', reloadHistory);

    return () => {
      window.removeEventListener('favorites_updated', reloadFavs);
      window.removeEventListener('history_updated', reloadHistory);
    };
  }, []);

  const handlePrefChange = (key: keyof UserPreferences, value: string) => {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    savePreferences(updated);
    
    setSuccessMsg('Preferences updated successfully!');
    const timer = setTimeout(() => setSuccessMsg(''), 3000);
    return () => clearTimeout(timer);
  };

  const handleRemoveFavorite = (slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(slug);
    setFavorites(getFavorites());
  };

  const handleRestoreHistory = (record: HistoryRecord) => {
    // Navigate to the calculator view, but we also want to pass these inputs!
    // Since our layout handles state overrides, we can push state or trigger navigation.
    // Let's navigate to /calculators/:slug and let our App pass the overrides or use a session indicator.
    // To make it incredibly robust, we can store temporary overrides in sessionStorage for that slug!
    sessionStorage.setItem(`override_${record.slug}`, JSON.stringify(record.inputs));
    onNavigate(`calculators/${record.slug}`);
  };

  // Map slug back to full calculator metadata
  const favCalculators = calculators.filter((c) => favorites.includes(c.slug));

  return (
    <div className="animate-fade-in max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10" id="user-preferences-hub">
      {/* Page Title */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-950 dark:text-white flex items-center gap-2.5">
          <Lucide.UserCheck className="w-8 h-8 text-blue-600" />
          <span>My Portfolio Hub & Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
          Customize currency outputs, tax localization configurations, number separation systems, and revisit your saved dashboards.
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 rounded-xl border border-emerald-100 dark:border-emerald-800/60 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <Lucide.CheckCircle className="w-4 h-4 text-emerald-500" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Preferences Configuration (Phase 2 & Phase 9) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-6">
          <h2 className="text-md font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Lucide.Settings2 className="w-5 h-5 text-blue-600" />
            <span>Regional Preferences</span>
          </h2>

          <div className="space-y-4">
            {/* Preferred Currency */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Preferred Currency</label>
              <select
                value={prefs.currency || 'USD'}
                onChange={(e) => handlePrefChange('currency', e.target.value as any)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:outline-none"
              >
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
                <option value="INR">INR (₹) - Indian Rupee</option>
              </select>
              <span className="text-[10px] text-slate-400 block leading-normal">
                Changes currency symbols across all calculator outputs and tables.
              </span>
            </div>

            {/* Country Context */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Country & Tax Context</label>
              <select
                value={prefs.country || 'US'}
                onChange={(e) => handlePrefChange('country', e.target.value as any)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:outline-none"
              >
                <option value="US">United States (Federal & IRS Tax Code)</option>
                <option value="GB">United Kingdom (HMRC Regulations)</option>
                <option value="CA">Canada (CRA Guidelines)</option>
                <option value="IN">India (Income Tax Department Guidelines)</option>
              </select>
            </div>

            {/* Number Notation Format */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Number Formatting Style</label>
              <select
                value={prefs.numberFormat || 'us'}
                onChange={(e) => handlePrefChange('numberFormat', e.target.value as any)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:outline-none"
              >
                <option value="us">US/UK Standard (e.g., 1,234,567.89)</option>
                <option value="eu">European Dot-Notation (e.g., 1.234.567,89)</option>
                <option value="in">Indian Lakhs System (e.g., 12,34,567.89)</option>
              </select>
              <span className="text-[10px] text-slate-400 block leading-normal">
                Perfect for aligning large financial numbers with local reading habits.
              </span>
            </div>

            {/* Tax Region Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Tax Structure Tier</label>
              <select
                value={prefs.taxRegion || 'standard'}
                onChange={(e) => handlePrefChange('taxRegion', e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:outline-none"
              >
                <option value="standard">Standard Default Rates</option>
                <option value="custom">State/Regional Customized Surcharge</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Favorites & Calculation Logs (Phase 2) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Favorites List Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-md font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Lucide.Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span>Bookmarked Calculators ({favCalculators.length})</span>
            </h2>

            {favCalculators.length === 0 ? (
              <div className="py-6 text-center space-y-1.5 text-slate-400">
                <Lucide.FolderHeart className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs font-semibold">No Bookmarks Saved Yet</p>
                <p className="text-[10px]">Click the star button on any calculator page to save it here for fast access.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {favCalculators.map((calc) => (
                  <div
                    key={calc.slug}
                    onClick={() => onNavigate(`calculators/${calc.slug}`)}
                    className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-blue-200 hover:bg-slate-100/40 dark:hover:bg-slate-800/40 transition-all cursor-pointer group flex items-start justify-between gap-3"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors">
                        {calc.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-2">
                        {calc.shortDescription}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleRemoveFavorite(calc.slug, e)}
                      title="Remove Bookmark"
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 rounded-lg cursor-pointer transition-colors"
                    >
                      <Lucide.Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Calculations History Logs List Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-md font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Lucide.History className="w-5 h-5 text-indigo-500" />
                <span>Calculation Logs & Saved Scenarios ({history.length})</span>
              </h2>
              {history.length > 0 && (
                <button
                  onClick={() => {
                    clearHistory();
                    setHistory([]);
                  }}
                  className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                >
                  Clear Logs
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="py-6 text-center space-y-1.5 text-slate-400">
                <Lucide.Layers className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs font-semibold">No Calculation History Yet</p>
                <p className="text-[10px]">Your inputs and outputs are saved automatically as you model scenarios.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {history.map((record) => (
                  <div
                    key={record.id}
                    onClick={() => handleRestoreHistory(record)}
                    className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-indigo-200 hover:bg-slate-100/40 dark:hover:bg-slate-800/40 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-slate-200 dark:bg-slate-800 font-extrabold tracking-widest text-slate-500 uppercase py-0.5 px-2 rounded">
                          Log
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">
                          {record.name}
                        </h4>
                      </div>
                      <p className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold leading-normal">
                        {record.summaryText}
                      </p>
                      <p className="text-[9px] text-slate-400">
                        Inputs: {Object.entries(record.inputs).map(([k, v]) => `${k}:${v}`).join(', ')}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-[9px] text-slate-400 block font-semibold">
                        {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-[10px] text-indigo-500 group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5 mt-0.5 font-bold">
                        Restore <Lucide.ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
