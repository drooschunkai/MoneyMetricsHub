import React, { useState, useEffect } from 'react';
import * as Lucide from 'lucide-react';
import { categories } from '../data/categories';

interface LayoutProps {
  children: React.ReactNode;
  activeRoute: string;
  onNavigate: (route: string) => void;
}

export default function Layout({ children, activeRoute, onNavigate }: LayoutProps) {
  const [searchVal, setSearchVal] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) {
        return saved === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      onNavigate(`search?q=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      
      {/* Premium Header Nav Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-4">
            
            {/* Logo Brand Brand */}
            <div 
              onClick={() => {
                onNavigate('');
                setSearchVal('');
              }} 
              className="flex items-center gap-2.5 cursor-pointer flex-shrink-0"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                M
              </div>
              <div>
                <span className="font-display font-black text-lg tracking-tight text-slate-900 dark:text-white block leading-none">
                  Money Metric <span className="text-blue-600 dark:text-blue-400">Hubs</span>
                </span>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-0.5 block leading-none">
                  Precision Finance
                </span>
              </div>
            </div>

            {/* Desktop Center Menu Links */}
            <nav className="hidden lg:flex items-center gap-6">
              <button 
                onClick={() => onNavigate('')} 
                className={`text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors ${activeRoute === '' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'}`}
              >
                Home
              </button>
              
              {/* Category selector pill dropdown */}
              <div className="relative group">
                <button 
                  onClick={() => onNavigate('categories')}
                  className={`text-sm font-medium flex items-center gap-1 cursor-pointer transition-colors ${
                    activeRoute === 'categories' || activeRoute === 'category'
                      ? 'text-blue-600 dark:text-blue-400 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  Categories
                  <Lucide.ChevronDown className="w-4 h-4 text-slate-455" />
                </button>
                <div className="absolute top-full left-0 pt-1.5 w-60 hidden group-hover:block z-50 animate-fade-in">
                  <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xl rounded-2xl p-2 transition-colors duration-200">
                    <button
                      onClick={() => onNavigate('categories')}
                      className="w-full text-left px-3.5 py-2 hover:bg-blue-50/70 dark:hover:bg-slate-750 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center justify-between cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-750 mb-1"
                    >
                      <span>View All Categories</span>
                      <Lucide.ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => onNavigate(`categories/${cat.slug}`)}
                        className="w-full text-left px-3.5 py-2 hover:bg-blue-50/50 dark:hover:bg-slate-700/50 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => onNavigate('compare')} 
                className={`text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors ${activeRoute === 'compare' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'}`}
              >
                Compare Scenarios
              </button>
              <button 
                onClick={() => onNavigate('blog')} 
                className={`text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors ${activeRoute === 'blog' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
              >
                Blog
              </button>
              <button 
                onClick={() => onNavigate('about')} 
                className={`text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors ${activeRoute === 'about' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'}`}
              >
                About
              </button>
            </nav>

            {/* Header Search & Theme Toggle */}
            <div className="flex items-center gap-3">
              <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative max-w-xs w-full">
                <Lucide.Search className="absolute left-3.5 text-slate-400 dark:text-slate-500 w-4 h-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search calculators..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-900 border border-transparent focus:border-slate-200 dark:focus:border-slate-700 pl-10 pr-4 py-1.5 rounded-full text-xs font-medium outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-700 dark:text-slate-200"
                />
              </form>

              <button
                type="button"
                onClick={() => onNavigate('preferences')}
                className={`p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-all duration-205 flex items-center justify-center border border-transparent dark:border-slate-800 ${
                  activeRoute === 'preferences' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-blue-600'
                }`}
                title="My Hub & Favorites"
              >
                <Lucide.UserCheck className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsDark(!isDark)}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center border border-transparent dark:border-slate-800"
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                id="theme-toggle-btn"
              >
                {isDark ? (
                  <Lucide.Sun className="w-4 h-4 text-amber-400 animate-[spin_10s_linear_infinite]" />
                ) : (
                  <Lucide.Moon className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Mobile Navigation Drawer Trigger */}
            <div className="flex lg:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                {mobileMenuOpen ? <Lucide.X className="w-6 h-6" /> : <Lucide.Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile menu drawer panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-4 pb-6 space-y-4 shadow-inner transition-colors duration-200">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Lucide.Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 pl-10 pr-4 py-2 rounded-full text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-700 dark:text-slate-200"
              />
            </form>

            <nav className="flex flex-col gap-2.5">
              <button
                onClick={() => {
                  onNavigate('');
                  setMobileMenuOpen(false);
                }}
                className="text-left font-bold text-slate-800 dark:text-slate-100 py-1 px-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors"
              >
                Home
              </button>
              
              <div className="border-t border-slate-100 dark:border-slate-800 pt-2">
                <button
                  onClick={() => {
                    onNavigate('categories');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left font-bold text-slate-800 dark:text-slate-100 py-1.5 px-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors flex justify-between items-center"
                >
                  <span>Categories Overview</span>
                  <Lucide.ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
                <div className="grid grid-cols-2 gap-1 px-4 mt-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onNavigate(`categories/${cat.slug}`);
                        setMobileMenuOpen(false);
                      }}
                      className="text-left text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 font-medium"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    onNavigate('compare');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left font-semibold text-slate-700 dark:text-slate-200 text-sm py-1 px-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors"
                >
                  Compare Scenarios
                </button>
                <button
                  onClick={() => {
                    onNavigate('blog');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left font-semibold text-slate-700 dark:text-slate-200 text-sm py-1 px-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors"
                >
                  Blog
                </button>
                <button
                  onClick={() => {
                    onNavigate('newsletter');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left font-semibold text-slate-700 dark:text-slate-200 text-sm py-1 px-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors"
                >
                  Newsletter BRIEFING
                </button>
                <button
                  onClick={() => {
                    onNavigate('about');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left font-semibold text-slate-700 dark:text-slate-200 text-sm py-1 px-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors"
                >
                  About
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main View Area Container */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Professional structured Multi-Column Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 border-t border-slate-800 dark:border-slate-900 mt-16 pt-16 pb-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
            
            {/* Column 1: Brand pitch (Col 4) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('')}>
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base">
                  M
                </div>
                <span className="font-display font-extrabold text-base tracking-tight text-white">
                  Money Metric <span className="text-blue-400">Hubs</span>
                </span>
              </div>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
                Smarter Financial Decisions Through Better Numbers. Instant calculations built entirely with verified formulas and variables.
              </p>
              <div className="flex items-center gap-3 pt-2 text-slate-500">
                <Lucide.Globe className="w-4 h-4" />
                <span className="text-xs">Worldwide English Edition</span>
              </div>
            </div>

            {/* Column 2: Financial categories (Col 3) */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Financial Fields</h4>
              <ul className="space-y-2 text-xs">
                {categories.slice(0, 5).map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => onNavigate(`categories/${cat.slug}`)}
                      className="hover:text-white transition-colors cursor-pointer text-left"
                    >
                      {cat.name} Calculators
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Legal compliance (Col 3) */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Trust & Legal</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors cursor-pointer">
                    About Our Methodology
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors cursor-pointer">
                    Contact & Feedback
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors cursor-pointer">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors cursor-pointer">
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('disclaimer')} className="hover:text-white transition-colors cursor-pointer">
                    Financial Disclaimer
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: XML Sitemaps, Search Console, & Newsletter (Col 2) */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Sitemaps & Tools</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => onNavigate('newsletter')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Newsletter Signup
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('sitemap')} className="hover:text-white transition-colors cursor-pointer text-left">
                    HTML Sitemap Index
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Search Console Metrics
                  </button>
                </li>
              </ul>
              <div className="p-3 bg-slate-805 dark:bg-slate-900/45 rounded-xl border border-slate-800 dark:border-slate-900 flex items-start gap-1.5 text-[9px] leading-relaxed">
                <Lucide.ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Verified client-side calculation engine.</span>
              </div>
            </div>

          </div>

          {/* Core regulatory disclaimer and copyright line */}
          <div className="border-t border-slate-800 mt-16 pt-8 space-y-4 text-center">
            <p className="text-[10px] text-slate-500 max-w-4xl mx-auto leading-relaxed">
              <strong>Disclaimer:</strong> Money Metric Hubs is an informational and educational publisher, not an investment, legal, or CPA advisor. The formulas, numbers, and calculators displayed here are estimations only. Past return metrics are not indicators of future yield curves. Always consult a professional before entering into binding loan contracts or committing capital.
            </p>
            <p className="text-[11px] text-slate-500 font-semibold tracking-wide">
              © 2026 Money Metric Hubs. All rights reserved. Built for complete mobile and search transparency.
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
