import * as Lucide from 'lucide-react';
import { categories } from '../data/categories';
import { calculators } from '../data/calculators';
import { categoryVideos } from '../data/categoryVideos';
import CategoryVideoEmbed from './CategoryVideoEmbed';
import SEO from './SEO';

interface CategoryViewProps {
  categorySlug: string;
  onNavigate: (route: string) => void;
}

export default function CategoryView({ categorySlug, onNavigate }: CategoryViewProps) {
  const category = categories.find((cat) => cat.slug === categorySlug);
  const videoConfig = category ? categoryVideos[category.slug] || categoryVideos[category.id] : null;

  // Fallback if category not found
  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <Lucide.AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-2xl font-bold">Category Not Found</h2>
        <p className="text-slate-500">The requested financial category does not exist.</p>
        <button
          onClick={() => onNavigate('')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
        >
          Return Home
        </button>
      </div>
    );
  }

  // Get calculators belonging to this category
  const matchingCalculators = calculators.filter((calc) => calc.category === category.id);

  const renderIcon = (name: string, className: string = 'w-10 h-10') => {
    const IconComponent = (Lucide as any)[name];
    if (IconComponent) {
      return <IconComponent className={className} />;
    }
    return <Lucide.Calculator className={className} />;
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <SEO
        title={`${category.name} Calculators | MoneyMetricsHub`}
        description={category.description}
        schemaType="category"
        slug={`categories/${category.slug}`}
        categoryName={category.name}
      />

      {/* Breadcrumb */}
      <nav className="flex text-xs text-slate-500 gap-1.5 items-center">
        <button onClick={() => onNavigate('')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">Home</button>
        <Lucide.ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => onNavigate('categories')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">Categories</button>
        <Lucide.ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 dark:text-slate-200 font-medium">{category.name}</span>
      </nav>

      {/* Hero Header & Video Explainer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Category Description & Metrics */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6 transition-colors duration-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
              {renderIcon(category.icon, "w-8 h-8")}
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400 block">Financial Channel</span>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {category.name} Calculators
              </h1>
            </div>
          </div>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            {category.description}
          </p>

          <div className="bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category Overview Metrics</h4>
            <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-xs">Available Calculators:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono text-base">{matchingCalculators.length}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-xs">Methodology Status:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Verified Math</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Video Explainer Embed */}
        <div className="lg:col-span-5">
          {videoConfig && (
            <CategoryVideoEmbed video={videoConfig} categoryName={category.name} />
          )}
        </div>
      </div>

      {/* Ads Placeholder */}
      <div className="bg-slate-100 dark:bg-slate-900/40 text-slate-400 dark:text-slate-500 text-xs py-3 px-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center uppercase tracking-widest transition-colors duration-200">
        Sponsored Financial Listing (Google AdSense Ready)
      </div>

      {/* Tools Grid */}
      <div className="space-y-6">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Select a {category.name} Calculator
        </h2>

        {matchingCalculators.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchingCalculators.map((calc) => (
              <div
                id={`calc-card-list-${calc.id}`}
                key={calc.id}
                className="premium-card p-6 flex flex-col justify-between hover:border-blue-100 hover:shadow-md cursor-pointer transition-all duration-200"
                onClick={() => onNavigate(`calculators/${calc.slug}`)}
              >
                <div className="space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Lucide.Calculator className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {calc.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {calc.shortDescription}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 pt-4 mt-4 border-t border-slate-50 dark:border-slate-800">
                  Open Calculator
                  <Lucide.ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm max-w-xl">
            <Lucide.Hourglass className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h4 className="text-slate-900 dark:text-white font-bold mb-2">Calculators Coming Soon</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              We are currently programming our certified {category.name} calculators. Sign up to our newsletter below to get notified as soon as these calculations go live.
            </p>
          </div>
        )}
      </div>

      {/* SEO Editorial block */}
      <div className="bg-slate-50 dark:bg-slate-950/20 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
        <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Lucide.Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          About {category.name} Formulas & Analysis
        </h3>
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          {category.seoText}
        </p>
      </div>

      {/* Quick links to other categories */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-slate-400 dark:text-slate-500">Other Financial Fields</h4>
        <div className="flex flex-wrap gap-2">
          {categories
            .filter((cat) => cat.slug !== categorySlug)
            .map((cat) => (
              <button
                key={cat.id}
                onClick={() => onNavigate(`categories/${cat.slug}`)}
                className="px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                {cat.name}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
