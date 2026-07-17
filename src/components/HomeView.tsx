import { useState, useEffect } from 'react';
import * as Lucide from 'lucide-react';
import { categories } from '../data/categories';
import { calculators } from '../data/calculators';
import { guides } from '../data/guides';
import SEO from './SEO';

interface HomeViewProps {
  onNavigate: (route: string) => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  const [portfolioValue, setPortfolioValue] = useState(487500);
  const [savingsProgress, setSavingsProgress] = useState(72);

  // Subtle interactive state animation on the hero preview card
  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolioValue((prev) => prev + (Math.random() > 0.5 ? 120 : -80));
      setSavingsProgress((prev) => {
        if (prev >= 90) return 72;
        return prev + 1;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Map string icon names to Lucide elements
  const renderIcon = (name: string, className: string = 'w-6 h-6') => {
    const IconComponent = (Lucide as any)[name];
    if (IconComponent) {
      return <IconComponent className={className} />;
    }
    return <Lucide.Calculator className={className} />;
  };

  return (
    <div className="animate-fade-in">
      <SEO
        title="Free Financial Calculators for Smarter Money Decisions | MoneyMetricsHub"
        description="Calculate investments, mortgages, retirement savings, loans, and more using industry-standard financial formulas. Entirely free, fast, and SEO-optimized."
        schemaType="homepage"
        slug=""
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-900/60 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column (Headline and Text) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider rounded-full border border-blue-100 dark:border-blue-900/60 transition-colors">
                <Lucide.Sparkles className="w-3.5 h-3.5" />
                Industry-Standard Financial Intelligence
              </div>
              
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Free Financial Calculators for <span className="text-blue-600 dark:text-blue-400">Smarter</span> Money Decisions
              </h1>
              
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-md">
                Calculate investments, mortgages, retirement savings, loans, and more using industry-standard financial formulas.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  id="btn-explore-calculators"
                  onClick={() => {
                    const el = document.getElementById('categories-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Explore Calculators
                  <Lucide.ArrowRight className="w-5 h-5" />
                </button>
                <button
                  id="btn-ci-calculator"
                  onClick={() => onNavigate('calculators/compound-interest')}
                  className="px-8 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-base rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  Compound Interest
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 mt-4 pt-6 border-t border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <Lucide.CheckCircle className="w-4 h-4 text-emerald-500" />
                  20+ Financial Calculators
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <Lucide.CheckCircle className="w-4 h-4 text-emerald-500" />
                  Industry Standard Formulas
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <Lucide.CheckCircle className="w-4 h-4 text-emerald-500" />
                  Instant Results
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <Lucide.CheckCircle className="w-4 h-4 text-emerald-500" />
                  Completely Free
                </div>
              </div>
            </div>

            {/* Right Column (Financial Dashboard Preview Card) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[420px] bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl dark:shadow-none border border-slate-100 dark:border-slate-800 space-y-6 relative overflow-hidden transition-all duration-200">
                
                {/* Card Header */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg">Financial Dashboard</h3>
                  <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100 dark:border-emerald-900/40">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    ON TRACK
                  </div>
                </div>

                {/* Dashboard Metrics */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between group cursor-default border-b border-slate-50 dark:border-slate-850 pb-4">
                    <div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Portfolio Growth</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">${portfolioValue.toLocaleString()}</p>
                    </div>
                    <div className="text-emerald-500 font-bold text-sm">+12.4%</div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Mortgage Payment</p>
                      <p className="text-xl font-bold text-slate-800 dark:text-slate-100">$2,145</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Retirement Age</p>
                      <p className="text-xl font-bold text-slate-800 dark:text-slate-100">58</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Savings Goal</p>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{savingsProgress}%</p>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${savingsProgress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Micro Chart Graph Mock */}
                  <div className="pt-2">
                    <svg className="w-full h-16" preserveAspectRatio="none" viewBox="0 0 200 40">
                      <path d="M0,35 Q50,30 80,15 T150,10 T200,5" fill="none" stroke="#10b981" strokeWidth="2" />
                      <path d="M0,35 Q50,30 80,15 T150,10 T200,5 V40 H0 Z" fill="rgba(16, 185, 129, 0.05)" />
                    </svg>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Ads Placeholder */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-slate-100 dark:bg-slate-900/40 text-slate-400 dark:text-slate-500 text-xs py-4 px-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center uppercase tracking-widest transition-colors duration-200">
          Sponsored Financial Content (Google AdSense Ready)
        </div>
      </div>

      {/* Categories Grid Section */}
      <section id="categories-section" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore 8 Financial Categories
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto">
            Our platform provides clean formulas and instant numbers for mortgages, retirement milestones, and compounding accounts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            // Count calculators matching this category
            const count = calculators.filter((calc) => calc.category === cat.id).length;
            
            return (
              <div
                id={`cat-card-${cat.id}`}
                key={cat.id}
                className="premium-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                onClick={() => onNavigate(`categories/${cat.slug}`)}
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 dark:group-hover:bg-blue-600 group-hover:text-white transition-all duration-200">
                    {renderIcon(cat.icon)}
                  </div>
                  
                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {cat.name}
                  </h3>
                  
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6 mt-4 border-t border-slate-50 dark:border-slate-800/60 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span>{count > 0 ? `${count} Calculators` : 'Coming Soon'}</span>
                  <span className="text-blue-600 dark:text-blue-400 group-hover:translate-x-1.5 transition-transform flex items-center gap-1">
                    Manage
                    <Lucide.ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Tools Grid */}
      <section className="bg-slate-50 dark:bg-slate-900/30 py-16 md:py-20 border-y border-slate-100 dark:border-slate-900/60 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Popular Financial Tools
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl">
                Quick-access our most utilized, industry-standard formulas calculated with absolute security.
              </p>
            </div>
            <button
              id="btn-all-tools"
              onClick={() => {
                const el = document.getElementById('categories-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              View All Categories
              <Lucide.ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {calculators.slice(0, 6).map((calc) => (
              <div
                id={`calc-card-featured-${calc.id}`}
                key={calc.id}
                className="premium-card p-6 space-y-4 hover:border-blue-100 dark:hover:border-slate-800 hover:shadow-md dark:hover:shadow-none cursor-pointer transition-all duration-200"
                onClick={() => onNavigate(`calculators/${calc.slug}`)}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Lucide.Calculator className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {calc.name}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {calc.shortDescription}
                </p>
                <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 pt-2 group">
                  Open Calculator
                  <Lucide.ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Wealth & Financial Guides */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Latest Wealth & Financial Guides
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl">
              Deepen your financial intelligence with our newly added research articles and expert-approved cash flow metrics.
            </p>
          </div>
          <button
            onClick={() => onNavigate('blog')}
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            Go to Knowledge Hub
            <Lucide.ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {guides.slice(0, 3).map((guide) => {
            const catDetails = categories.find((c) => c.slug === guide.category) || {
              name: guide.category.charAt(0).toUpperCase() + guide.category.slice(1),
              icon: 'BookOpen'
            };
            const IconComp = (Lucide as any)[catDetails.icon] || Lucide.BookOpen;

            return (
              <div
                key={guide.slug}
                onClick={() => onNavigate(`guides/${guide.slug}`)}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-slate-700 p-6 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 flex flex-col justify-between group h-full"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
                    <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30 px-2 py-0.5 rounded-md border border-blue-100/30">
                      <IconComp className="w-3 h-3" />
                      {catDetails.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Lucide.Clock className="w-3.5 h-3.5" />
                      {guide.readTime}
                    </span>
                  </div>

                  <h3 className="font-display text-base font-extrabold text-slate-850 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                    {guide.title}
                  </h3>
                  
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                    {guide.summary}
                  </p>
                </div>

                <div className="border-t border-slate-50 dark:border-slate-800/80 mt-5 pt-4 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    Amortization & Models Included
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read Guide
                    <Lucide.ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust Indicators / Methodology Banner */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-600 rounded-3xl text-white p-8 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-4">
            <span className="text-blue-200 text-xs font-bold uppercase tracking-widest">Platform Philosophy</span>
            <h3 className="font-display text-2xl md:text-3xl font-bold">Mathematical Transparency & Academic Integrity</h3>
            <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-2xl">
              We list the direct academic formulas, variables, step-by-step worked examples, and official regulatory sources (Investopedia, IRS, SEC) on every single page. No hidden black boxes.
            </p>
          </div>
          <div className="md:col-span-4 flex justify-start md:justify-end">
            <button
              id="btn-learn-about"
              onClick={() => onNavigate('about')}
              className="px-6 py-3 bg-white hover:bg-blue-50 text-blue-700 font-bold rounded-xl transition-all shadow cursor-pointer"
            >
              Our Methodology
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
