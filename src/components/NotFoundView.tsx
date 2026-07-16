import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import SEO from './SEO';

interface NotFoundProps {
  onNavigate: (route: string) => void;
}

export default function NotFoundView({ onNavigate }: NotFoundProps) {
  const [searchVal, setSearchVal] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      onNavigate(`search?q=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  const popularCalculators = [
    { name: 'Mortgage Amortization', slug: 'calculators/mortgage-amortization', icon: 'Home' },
    { name: 'Compound Interest', slug: 'calculators/compound-interest', icon: 'Percent' },
    { name: 'Retirement Planner', slug: 'calculators/retirement', icon: 'TrendingUp' },
    { name: 'Debt Snowball Payoff', slug: 'calculators/debt-snowball', icon: 'Compass' }
  ];

  return (
    <div className="animate-fade-in max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-12 transition-colors duration-200">
      <SEO
        title="Page Not Found (404) | Money Metric Hubs"
        description="The page you requested could not be found. Use our helpful search tool or explore our financial calculators."
        schemaType="basic"
        slug="404"
      />

      {/* Hero Visual */}
      <div className="space-y-4 max-w-md mx-auto">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-800 text-blue-600 dark:text-blue-400 mb-2">
          <Lucide.AlertCircle className="w-12 h-12" />
        </div>
        <h1 className="font-display text-7xl font-black text-slate-900 dark:text-white tracking-tight">404</h1>
        <h2 className="font-display text-2xl font-extrabold text-slate-800 dark:text-slate-200 tracking-tight">Page Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
      </div>

      {/* Helpful Search Box */}
      <div className="max-w-md mx-auto bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Search Our Platform</h3>
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Lucide.Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Search calculators or guides..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 focus:border-blue-500 px-10 py-3 rounded-2xl text-sm text-slate-800 dark:text-slate-100 outline-none transition-colors"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-750 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl cursor-pointer transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Shortcut Blocks */}
      <div className="space-y-4 max-w-xl mx-auto">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Or Explore Popular Calculators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
          {popularCalculators.map((calc, idx) => {
            return (
              <div
                key={idx}
                onClick={() => onNavigate(calc.slug)}
                className="p-4 bg-white dark:bg-slate-900 hover:bg-blue-50/20 dark:hover:bg-slate-800/20 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between cursor-pointer transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    {calc.icon === 'Home' && <Lucide.Home className="w-4.5 h-4.5" />}
                    {calc.icon === 'Percent' && <Lucide.Percent className="w-4.5 h-4.5" />}
                    {calc.icon === 'TrendingUp' && <Lucide.TrendingUp className="w-4.5 h-4.5" />}
                    {calc.icon === 'Compass' && <Lucide.Compass className="w-4.5 h-4.5" />}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {calc.name}
                  </span>
                </div>
                <Lucide.ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:translate-x-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
        <button
          onClick={() => onNavigate('')}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-750 text-white font-semibold rounded-2xl cursor-pointer shadow-sm hover:shadow transition-all"
        >
          <Lucide.Home className="w-4.5 h-4.5" />
          Back to Homepage
        </button>
        <button
          onClick={() => onNavigate('categories')}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer transition-colors"
        >
          Explore Categories
        </button>
      </div>
    </div>
  );
}
