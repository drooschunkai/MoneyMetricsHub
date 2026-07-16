import React from 'react';
import * as Lucide from 'lucide-react';
import { calculators } from '../data/calculators';
import { categories } from '../data/categories';
import { programmaticSEOPages } from '../data/programmaticSEO';
import SEO from './SEO';

interface SitemapViewProps {
  onNavigate: (route: string) => void;
}

export default function SitemapView({ onNavigate }: SitemapViewProps) {
  // Group calculators by category
  const getCalculatorsByCat = (catId: string) => {
    return calculators.filter((c) => c.category === catId);
  };

  // Group programmatic SEO pages by type
  const getSEOPagesByType = (type: string) => {
    return programmaticSEOPages.filter((p) => p.type === type);
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10" id="html-sitemap-page">
      <SEO
        title="HTML Sitemap | Money Metric Hubs Index"
        description="Comprehensive index of all calculator models, dynamic SEO pages, wealth guides, and regional dashboards."
        slug="sitemap"
      />

      {/* Hero Header */}
      <div className="border-b border-slate-150 dark:border-slate-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-950 dark:text-white flex items-center gap-2.5">
          <Lucide.Map className="w-8 h-8 text-blue-600" />
          <span>Money Metric Hubs HTML Sitemap</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
          Comprehensive structured directory of all mathematical planning calculators, long-tail programmatic insights, and financial guides.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        
        {/* SECTION A: PRIMARY SITE MAP STRUCTURE */}
        <div className="space-y-6">
          <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <Lucide.Compass className="w-4 h-4 text-blue-600" />
            <span>Core Directories</span>
          </h2>
          <ul className="space-y-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <li>
              <button onClick={() => onNavigate('')} className="hover:underline flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <Lucide.Home className="w-3.5 h-3.5 text-slate-450" />
                <span>Homepage</span>
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('newsletter')} className="hover:underline flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <Lucide.MailOpen className="w-3.5 h-3.5 text-slate-450" />
                <span>Newsletter Intelligence Hub</span>
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('compare')} className="hover:underline flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <Lucide.Percent className="w-3.5 h-3.5 text-slate-450" />
                <span>Side-by-Side Comparison Suite</span>
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('preferences')} className="hover:underline flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <Lucide.UserCheck className="w-3.5 h-3.5 text-slate-450" />
                <span>Regional Settings Panel</span>
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('dashboard')} className="hover:underline flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <Lucide.Trophy className="w-3.5 h-3.5 text-slate-450" />
                <span>Search Console Reporting Suite</span>
              </button>
            </li>
          </ul>

          <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 pt-4">
            <Lucide.ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Authority & Trust (EEAT)</span>
          </h2>
          <ul className="space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <li>
              <button onClick={() => onNavigate('about')} className="hover:underline flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <Lucide.Activity className="w-3.5 h-3.5" />
                <span>Editorial & Financial Standards</span>
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('privacy')} className="hover:underline flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <Lucide.Lock className="w-3.5 h-3.5" />
                <span>Privacy & Cookies Compliance</span>
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('terms')} className="hover:underline flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <Lucide.BookOpen className="w-3.5 h-3.5" />
                <span>Terms of Use Guidelines</span>
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('disclaimer')} className="hover:underline flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <Lucide.AlertCircle className="w-3.5 h-3.5" />
                <span>General Financial Disclaimer</span>
              </button>
            </li>
          </ul>
        </div>

        {/* SECTION B: CORE CALCULATORS CHANNELS */}
        <div className="space-y-6">
          <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <Lucide.TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Calculator Channels</span>
          </h2>

          <div className="space-y-4">
            {categories.map((cat) => {
              const catCalcs = getCalculatorsByCat(cat.id);
              if (catCalcs.length === 0) return null;
              return (
                <div key={cat.id} className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{cat.name}</span>
                  <ul className="space-y-1 pl-2.5 border-l border-slate-100 dark:border-slate-800 text-xs font-semibold">
                    {catCalcs.map((calc) => (
                      <li key={calc.slug}>
                        <button
                          onClick={() => onNavigate(`calculators/${calc.slug}`)}
                          className="hover:underline text-blue-600 dark:text-blue-400 text-left"
                        >
                          {calc.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION C: PROGRAMMATIC LONG-TAIL PAGES (Avoid Thin Content Index) */}
        <div className="space-y-6">
          <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <Lucide.Gauge className="w-4 h-4 text-indigo-600" />
            <span>Programmatic SEO Templates</span>
          </h2>

          <div className="space-y-4">
            {/* Mortgage programmatic */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mortgage Scenarios</span>
              <ul className="space-y-1 pl-2.5 border-l border-slate-100 dark:border-slate-800 text-xs font-semibold">
                {getSEOPagesByType('mortgage').map((p) => (
                  <li key={p.slug}>
                    <button
                      onClick={() => onNavigate(`mortgage/${p.slug}`)}
                      className="hover:underline text-blue-600 dark:text-blue-400 text-left"
                    >
                      {p.h1}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Compound Interest programmatic */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Compound Interest Scenarios</span>
              <ul className="space-y-1 pl-2.5 border-l border-slate-100 dark:border-slate-800 text-xs font-semibold">
                {getSEOPagesByType('compound-interest').map((p) => (
                  <li key={p.slug}>
                    <button
                      onClick={() => onNavigate(`compound-interest/${p.slug}`)}
                      className="hover:underline text-blue-600 dark:text-blue-400 text-left"
                    >
                      {p.h1}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Retirement programmatic */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Retirement Horizons</span>
              <ul className="space-y-1 pl-2.5 border-l border-slate-100 dark:border-slate-800 text-xs font-semibold">
                {getSEOPagesByType('retirement').map((p) => (
                  <li key={p.slug}>
                    <button
                      onClick={() => onNavigate(`retirement/${p.slug}`)}
                      className="hover:underline text-blue-600 dark:text-blue-400 text-left"
                    >
                      {p.h1}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* FIRE programmatic */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Early Retirement Goals (FIRE)</span>
              <ul className="space-y-1 pl-2.5 border-l border-slate-100 dark:border-slate-800 text-xs font-semibold">
                {getSEOPagesByType('fire').map((p) => (
                  <li key={p.slug}>
                    <button
                      onClick={() => onNavigate(`fire/${p.slug}`)}
                      className="hover:underline text-blue-600 dark:text-blue-400 text-left"
                    >
                      {p.h1}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Salary programmatic */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Salary & Tax Bracket Breakdowns</span>
              <ul className="space-y-1 pl-2.5 border-l border-slate-100 dark:border-slate-800 text-xs font-semibold">
                {getSEOPagesByType('salary').map((p) => (
                  <li key={p.slug}>
                    <button
                      onClick={() => onNavigate(`salary/${p.slug}`)}
                      className="hover:underline text-blue-600 dark:text-blue-400 text-left"
                    >
                      {p.h1}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

      </div>

      {/* Footer XML Sitemap note */}
      <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400 leading-normal">
        <span>Looking for machine-readable feeds? Our </span>
        <a href="/sitemap.xml" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
          XML Sitemap index
        </a>
        <span> and </span>
        <a href="/sitemap-news.xml" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
          Google News Feed
        </a>
        <span> are dynamically regenerated every 24 hours.</span>
      </div>
    </div>
  );
}
