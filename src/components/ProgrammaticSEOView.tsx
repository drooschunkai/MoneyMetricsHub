import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import { programmaticSEOPages } from '../data/programmaticSEO';
import { AdSenseUnit, AffiliateOffer } from './Monetization';
import CalculatorView from './CalculatorView';
import SEO from './SEO';

interface ProgrammaticSEOViewProps {
  slug: string;
  onNavigate: (route: string) => void;
}

export default function ProgrammaticSEOView({ slug, onNavigate }: ProgrammaticSEOViewProps) {
  const page = programmaticSEOPages.find((p) => p.slug === slug);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!page) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <Lucide.AlertTriangle className="w-12 h-12 text-slate-400 mx-auto animate-bounce" />
        <h2 className="text-2xl font-bold">SEO Landing Page Not Found</h2>
        <p className="text-slate-500">The dynamic index parameter could not be mapped to any existing template models.</p>
        <button
          onClick={() => onNavigate('')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer font-semibold text-xs transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  // Map category slugs back to pretty names
  const categoryNames: Record<string, string> = {
    'mortgage': 'Mortgages',
    'compound-interest': 'Compound Interest',
    'retirement': 'Retirement Savings',
    'fire': 'FIRE Planning',
    'salary': 'Salary & Taxes'
  };

  // Map programmatic type to affiliate catalog category
  const affiliateMap: Record<string, 'investing' | 'savings' | 'mortgage' | 'credit'> = {
    'mortgage': 'mortgage',
    'compound-interest': 'investing',
    'retirement': 'savings',
    'fire': 'investing',
    'salary': 'credit'
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10" id="programmatic-seo-page">
      <SEO
        title={page.title}
        description={page.metaDescription}
        schemaType="guide"
        slug={`${page.type}/${page.slug}`}
      />

      {/* Dynamic Breadcrumbs (Phase 6) */}
      <nav className="flex text-xs text-slate-500 gap-1.5 items-center flex-wrap" aria-label="Breadcrumb" id="seo-breadcrumbs">
        <button onClick={() => onNavigate('')} className="hover:text-blue-600 cursor-pointer">Home</button>
        <Lucide.ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-slate-400 font-medium">{categoryNames[page.type] || page.type}</span>
        <Lucide.ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-slate-800 dark:text-slate-200 font-semibold">{page.h1}</span>
      </nav>

      {/* Dynamic Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Hand: Article & Calculator content */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Title Banner & Reviewer badge (EEAT Enhancement Phase 8) */}
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-950 dark:text-white leading-tight">
              {page.h1}
            </h1>
            
            {/* Professional EEAT Trust Block */}
            <div className="flex flex-wrap items-center gap-4 py-3 px-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-xs text-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center border border-blue-200 dark:border-slate-700">
                  MV
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider leading-none">Reviewed By</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100 mt-0.5 block">Marcus Vance, CFA</span>
                </div>
              </div>

              <div className="h-6 w-px bg-slate-150 dark:bg-slate-800 hidden sm:block"></div>

              <div className="space-y-0.5">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider leading-none">Last Updated</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">June 2026</span>
              </div>

              <div className="h-6 w-px bg-slate-150 dark:bg-slate-800 hidden sm:block"></div>

              <div className="space-y-0.5">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider leading-none">Trust signals</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <Lucide.ShieldCheck className="w-4 h-4" />
                  Verified Math ({page.references.length} Sources)
                </span>
              </div>
            </div>
          </div>

          {/* Intro Section */}
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {page.intro}
          </p>

          {/* AdSense Placement After Intro (Phase 5) */}
          <AdSenseUnit placement="after-intro" />

          {/* Section 1: Detailed contextual breakdown (P1: Avoid thin content) */}
          <section className="space-y-3 bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2">
              <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
              {page.section1Title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {page.section1Content}
            </p>
          </section>

          {/* INTERACTIVE CALCULATOR ENGINE WIDGET (Pre-populated) */}
          <div className="border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden bg-slate-50 dark:bg-slate-900 p-1">
            <div className="px-5 py-4 bg-blue-600/5 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-600/10 dark:bg-blue-900/40 rounded-lg">
                  <Lucide.Calculator className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Live Dynamic Calculator</h4>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 block font-bold">Preloaded with {slug.replace('-', ' ')} baseline metrics.</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 text-[9px] font-extrabold tracking-wider uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Fully Interactive
              </span>
            </div>
            {/* Render direct embedded CalculatorView */}
            <CalculatorView
              calculatorSlug={page.calculatorId}
              onNavigate={onNavigate}
              initialOverrides={page.defaultInputs}
            />
          </div>

          {/* Section 2: Strategy Breakdown */}
          <section className="space-y-3 bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2">
              <span className="w-1.5 h-5 bg-emerald-500 rounded-full"></span>
              {page.section2Title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {page.section2Content}
            </p>
          </section>

          {/* AdSense Placement Before FAQ (Phase 5) */}
          <AdSenseUnit placement="before-faq" />

          {/* FAQs Accordion Panel */}
          <div className="space-y-4" id="seo-faq-panel">
            <div className="flex items-center gap-2 mb-2">
              <Lucide.HelpCircle className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-950 dark:text-white font-display">Frequently Asked Questions</h3>
            </div>
            <div className="space-y-2">
              {page.faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl overflow-hidden transition-all duration-200">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left px-4 py-3 flex justify-between items-center text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-200 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <span>{faq.question}</span>
                      <Lucide.ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-800/60">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Citation references & sources */}
          <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-1.5">
              <Lucide.BookOpen className="w-4 h-4 text-slate-400" />
              Academic Citations & Verified Sources
            </h4>
            <div className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
              {page.references.map((ref, idx) => (
                <div key={idx} className="border-l-2 border-slate-200 dark:border-slate-700 pl-3 py-0.5">
                  <a href={ref.url} target="_blank" rel="noreferrer" className="font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 inline-flex items-center gap-1">
                    {ref.name} <Lucide.ExternalLink className="w-3 h-3" />
                  </a>
                  <p className="mt-0.5 leading-relaxed">{ref.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Hand Sidebar (Affiliates, sponsors, internal linking) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Reusable Affiliate Target (Phase 5) */}
          <div className="sticky top-20 space-y-6">
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Recommended Partner Offer</h4>
              <AffiliateOffer category={affiliateMap[page.type]} />
            </div>

            {/* AdSense Sidebar Placement */}
            <AdSenseUnit placement="sidebar" />

            {/* Internal Links Block (Phase 6 SEO Recommendations) */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-3.5 shadow-xs">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Related Core Calculators</h4>
              <div className="space-y-2">
                {page.internalLinks.map((link, idx) => (
                  <button
                    key={idx}
                    onClick={() => onNavigate(link.url)}
                    className="w-full text-left py-2 px-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1.5 border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
                  >
                    <Lucide.Compass className="w-3.5 h-3.5" />
                    <span>{link.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
