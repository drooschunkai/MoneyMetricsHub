import { useState } from 'react';
import * as Lucide from 'lucide-react';
import { categories } from '../data/categories';
import { calculators } from '../data/calculators';
import SEO from './SEO';

interface CategoriesViewProps {
  onNavigate: (route: string) => void;
}

export default function CategoriesView({ onNavigate }: CategoriesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Map string icon names to Lucide elements
  const renderIcon = (name: string, className: string = 'w-6 h-6') => {
    const IconComponent = (Lucide as any)[name];
    if (IconComponent) {
      return <IconComponent className={className} />;
    }
    return <Lucide.Calculator className={className} />;
  };

  // Filter categories and/or calculators based on user search query
  const filteredCategories = categories.filter((cat) => {
    const matchesCategoryName = cat.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategoryDesc = cat.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Check if any matching calculators belong to this category
    const matchingCalculators = calculators.filter(
      (calc) => calc.category === cat.id && calc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return matchesCategoryName || matchesCategoryDesc || matchingCalculators.length > 0;
  });

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SEO
        title="Browse Financial Categories & Calculators | MoneyMetricsHub"
        description="Explore our organized directory of financial calculators across 8 core domains. Fast, precise, academically verified calculation tools."
        schemaType="basic"
        slug="categories"
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex text-xs text-slate-500 gap-1.5 items-center">
        <button onClick={() => onNavigate('')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">Home</button>
        <Lucide.ChevronRight className="w-3.5 h-3.5 text-slate-450" />
        <span className="text-slate-800 dark:text-slate-200 font-medium">Categories</span>
      </nav>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 text-white p-8 md:p-12 rounded-3xl border border-slate-850 shadow-xl transition-all duration-300">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider rounded-full border border-blue-500/20">
            <Lucide.LayoutGrid className="w-3.5 h-3.5" />
            Taxonomy Directory
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Explore 8 Financial Categories
          </h1>
          <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed">
            All algorithms, formulas, and visual engines on MoneyMetricsHub are organized into dedicated fields. Select a category or search below to locate a precise calculator.
          </p>

          {/* Quick Filter Input */}
          <div className="pt-2 max-w-md relative">
            <Lucide.Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter categories or tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 hover:bg-white/15 focus:bg-white text-slate-100 focus:text-slate-900 border border-transparent focus:border-blue-500 pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all placeholder:text-slate-400 focus:placeholder:text-slate-500 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                <Lucide.X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Google AdSense Ready Slot */}
      <div className="bg-slate-100 dark:bg-slate-900/40 text-slate-400 dark:text-slate-500 text-xs py-4 px-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center uppercase tracking-widest transition-colors duration-200">
        Sponsored Financial Resources (AdSense Compliant Integration)
      </div>

      {/* Organized Category Listing Grid */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Financial Directories
          </h2>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-200/50 dark:border-slate-800">
            Showing {filteredCategories.length} of 8 Divisions
          </span>
        </div>

        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredCategories.map((cat) => {
              // Gather calculators matching this category
              const matchingCalcs = calculators.filter((calc) => calc.category === cat.id);
              // Filter matching calculators based on query if it is active
              const displayedCalcs = searchQuery
                ? matchingCalcs.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                : matchingCalcs;

              return (
                <div
                  key={cat.id}
                  className="premium-card p-6 md:p-8 flex flex-col justify-between hover:border-blue-100 dark:hover:border-slate-850 hover:shadow-lg dark:hover:shadow-none transition-all duration-300 rounded-3xl"
                >
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                        {renderIcon(cat.icon)}
                      </div>
                      <div className="space-y-1">
                        <h3 
                          onClick={() => onNavigate(`categories/${cat.slug}`)}
                          className="font-display text-xl font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors flex items-center gap-1.5"
                        >
                          {cat.name}
                          <Lucide.ArrowUpRight className="w-4 h-4 text-slate-300 dark:text-slate-700" />
                        </h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">
                          {matchingCalcs.length} Calculator Tools Mapped
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-450 leading-relaxed">
                      {cat.description}
                    </p>

                    {/* Mapped Calculators sub-list */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                        Select a Specialized Engine
                      </span>
                      {displayedCalcs.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {displayedCalcs.map((calc) => (
                            <button
                              key={calc.id}
                              onClick={() => onNavigate(`calculators/${calc.slug}`)}
                              className="w-full text-left p-2.5 bg-slate-50 dark:bg-slate-900/50 hover:bg-blue-50/40 dark:hover:bg-slate-800/40 border border-slate-150/60 dark:border-slate-800 hover:border-blue-150 dark:hover:border-blue-900/40 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-350 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-150 flex items-center justify-between group cursor-pointer"
                            >
                              <span className="truncate pr-2">{calc.name}</span>
                              <Lucide.ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/30 border border-slate-150/60 dark:border-slate-800 rounded-xl text-center text-xs text-slate-400 dark:text-slate-500">
                          {searchQuery ? 'No matching tools found inside this division.' : 'Interactive calculators coming soon for this module.'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer link */}
                  <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Methodology: <strong className="text-emerald-600 dark:text-emerald-500">Verified Academic Math</strong>
                    </span>
                    <button
                      onClick={() => onNavigate(`categories/${cat.slug}`)}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      Browse category page
                      <Lucide.ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
            <Lucide.AlertCircle className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-slate-850 dark:text-white font-bold text-lg">No Matching Categories Found</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Your search for "{searchQuery}" did not yield any category names, descriptions, or mapped calculator tools. Try adjusting your search keywords.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl cursor-pointer transition-colors"
            >
              Reset Search Filter
            </button>
          </div>
        )}
      </div>

      {/* Educational Original Content Block (AdSense / EEAT Compliance) */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 md:p-12 space-y-8 transition-colors duration-200">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider rounded-full border border-emerald-100 dark:border-emerald-900/40">
            <Lucide.BookmarkCheck className="w-3.5 h-3.5" />
            E-E-A-T Academic Standards
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Taxonomy & Mathematical Standards of MoneyMetricsHub
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Unlike dynamic financial advisors who customize advice according to subjective profiles, MoneyMetricsHub maintains a rigorous, objective mathematical taxonomy. Every single computation runs locally inside your browser, operating on strict, academically recognized financial formulas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
              Wealth Building & Compound Growth
            </h3>
            <p className="text-slate-500 dark:text-slate-450 text-xs sm:text-sm leading-relaxed">
              Our <strong>Investing</strong> and <strong>Retirement</strong> taxonomies utilize standard compound growth and amortization algorithms. This includes exponential compound interest equations, constant-ratio asset allocation matrices, and safe withdrawal margins (the historic 4% Rule). Users can trace precise historical yield curves to see how fee ratios and tax drag alter final portfolio trajectories over multi-decade scopes.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
              Debt, Loans, and Leverage Analysis
            </h3>
            <p className="text-slate-500 dark:text-slate-450 text-xs sm:text-sm leading-relaxed">
              Our <strong>Loans</strong>, <strong>Debt Management</strong>, and <strong>Business</strong> divisions utilize standard annuities formulas. We calculate monthly Equated Monthly Installments (EMIs), loan principal amortization splits, and comparative payoff structures (Avalanche vs. Snowball models). We guarantee full transparency by detailing the exact mathematical formula and worked example steps on every tool page.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950/25 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 text-xs sm:text-sm text-slate-550 dark:text-slate-400 space-y-2">
          <h4 className="font-bold text-slate-900 dark:text-white">Educational References & Academic Compliance</h4>
          <p className="leading-relaxed">
            All equations and calculations are peer-reviewed against official federal publications, including guidelines issued by the <strong>U.S. Securities and Exchange Commission (SEC.gov)</strong>, the <strong>Internal Revenue Service (IRS.gov)</strong>, and the <strong>Federal Deposit Insurance Corporation (FDIC.gov)</strong>. For deep theoretical overviews, you can explore our individual guide pages or review our complete <button onClick={() => onNavigate('about')} className="text-blue-600 dark:text-blue-400 font-bold underline hover:text-blue-850">About Our Methodology</button> section.
          </p>
        </div>
      </section>
    </div>
  );
}
