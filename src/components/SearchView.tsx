import { useState } from 'react';
import * as Lucide from 'lucide-react';
import { calculators } from '../data/calculators';
import { guides } from '../data/guides';
import { blogArticles } from '../data/blog';
import SEO from './SEO';

interface SearchViewProps {
  initialQuery: string;
  onNavigate: (route: string) => void;
}

export default function SearchView({ initialQuery, onNavigate }: SearchViewProps) {
  const [query, setQuery] = useState(initialQuery);

  // Parse search query
  const trimmedQuery = query.trim().toLowerCase();
  const normalizedQuery = trimmedQuery.replace(/[-_]/g, ' ');

  const matchedCalculators = calculators.filter((calc) => {
    return (
      calc.name.toLowerCase().includes(trimmedQuery) ||
      calc.shortDescription.toLowerCase().includes(trimmedQuery) ||
      calc.category.toLowerCase().includes(trimmedQuery)
    );
  });

  const matchedGuides = guides.filter((g) => {
    return (
      g.title.toLowerCase().includes(trimmedQuery) ||
      g.summary.toLowerCase().includes(trimmedQuery) ||
      g.category.toLowerCase().includes(trimmedQuery)
    );
  });

  const matchedArticles = blogArticles.filter((article) => {
    const slug = article.slug.toLowerCase();
    const title = article.title.toLowerCase();
    const summary = article.summary.toLowerCase();
    const category = article.category.toLowerCase();

    return (
      slug.includes(trimmedQuery) ||
      slug.replace(/[-_]/g, ' ').includes(normalizedQuery) ||
      title.includes(trimmedQuery) ||
      title.includes(normalizedQuery) ||
      summary.includes(trimmedQuery) ||
      summary.includes(normalizedQuery) ||
      category.includes(trimmedQuery) ||
      article.tags.some((tag) => {
        const t = tag.toLowerCase();
        return t.includes(trimmedQuery) || t.includes(normalizedQuery);
      })
    );
  });

  const totalResults = matchedCalculators.length + matchedGuides.length + matchedArticles.length;

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <SEO
        title={`Search results for "${query}" | MoneyMetricsHub`}
        description={`Locate financial calculators, articles, mortgage planning metrics, compound interest indexes, and early retirement guides matching your search.`}
        schemaType="basic"
        slug={`search?q=${encodeURIComponent(query)}`}
      />

      {/* Breadcrumb */}
      <nav className="flex text-xs text-slate-500 gap-1.5 items-center">
        <button onClick={() => onNavigate('')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">Home</button>
        <Lucide.ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 dark:text-slate-200 font-medium">Search Results</span>
      </nav>

      {/* Header section with active input */}
      <div className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Search Results
          </h1>
          <p className="text-slate-500 dark:text-slate-450 text-sm">
            Found {totalResults} matches for <span className="text-blue-600 dark:text-blue-400 font-bold font-mono">"{query}"</span>.
          </p>
        </div>

        {/* Refine Search Input box */}
        <div className="relative">
          <Lucide.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type terms (e.g. compound interest, credit score, mortgage, tax)..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 focus:border-blue-500 rounded-2xl text-sm font-medium text-slate-800 dark:text-slate-100 shadow-sm outline-none transition-colors"
          />
        </div>
      </div>

      {/* Results grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Blog Articles Results (Col 12 or Col 6) */}
        <div className="lg:col-span-12 space-y-6">
          <h3 className="font-display font-bold text-slate-800 dark:text-slate-200 text-lg flex items-center gap-2">
            <Lucide.FileText className="w-5.5 h-5.5 text-indigo-600 dark:text-indigo-400" />
            Matching Blog Articles ({matchedArticles.length})
          </h3>

          {matchedArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {matchedArticles.map((article) => (
                <div
                  key={article.slug}
                  onClick={() => onNavigate(`blog/${article.slug}`)}
                  className="p-5 bg-white dark:bg-slate-900 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow shadow-sm border border-slate-100 dark:border-slate-800 rounded-2xl space-y-3 cursor-pointer transition-all duration-200 group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="uppercase text-[10px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-bold">
                        {article.category}
                      </span>
                      <span className="text-slate-400 text-[11px]">{article.readTime}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                      {article.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {article.summary}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-50 dark:border-slate-800/80 flex justify-between items-center text-[11px] text-slate-400">
                    <span>Published {article.publishDate}</span>
                    <Lucide.ArrowRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-8 text-center rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-sm">
              No blog articles match your current search terms.
            </div>
          )}
        </div>

        {/* Calculators Results (Col 7) */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="font-display font-bold text-slate-800 dark:text-slate-200 text-lg flex items-center gap-2">
            <Lucide.Calculator className="w-5.5 h-5.5 text-blue-600 dark:text-blue-400" />
            Matching Calculators ({matchedCalculators.length})
          </h3>

          {matchedCalculators.length > 0 ? (
            <div className="space-y-4">
              {matchedCalculators.map((calc) => (
                <div
                  key={calc.id}
                  onClick={() => onNavigate(`calculators/${calc.slug}`)}
                  className="p-5 bg-white dark:bg-slate-900 hover:border-blue-100 dark:hover:border-slate-800 hover:shadow shadow-sm border border-slate-100 dark:border-slate-800 rounded-2xl flex justify-between items-center cursor-pointer transition-all duration-200 group"
                >
                  <div className="space-y-1 pr-4">
                    <span className="text-[10px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      {calc.category}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm md:text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {calc.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {calc.shortDescription}
                    </p>
                  </div>
                  <Lucide.ArrowRight className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:translate-x-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all flex-shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-8 text-center rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-sm">
              No calculators match your current search terms.
            </div>
          )}
        </div>

        {/* Guides Results (Col 5) */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="font-display font-bold text-slate-800 dark:text-slate-200 text-lg flex items-center gap-2">
            <Lucide.BookOpen className="w-5.5 h-5.5 text-emerald-600 dark:text-emerald-400" />
            Matching Guides ({matchedGuides.length})
          </h3>

          {matchedGuides.length > 0 ? (
            <div className="space-y-4">
              {matchedGuides.map((g) => (
                <div
                  key={g.slug}
                  onClick={() => onNavigate(`guides/${g.slug}`)}
                  className="p-5 bg-white dark:bg-slate-900 hover:border-emerald-100 dark:hover:border-emerald-900 hover:shadow shadow-sm border border-slate-100 dark:border-slate-800 rounded-2xl space-y-3 cursor-pointer transition-all duration-200 group"
                >
                  <div className="flex justify-between items-start text-xs font-semibold text-slate-400 dark:text-slate-500">
                    <span className="uppercase text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded">
                      {g.category}
                    </span>
                    <span>{g.readTime}</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {g.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {g.summary}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-8 text-center rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-sm">
              No guides match your current search terms.
            </div>
          )}
        </div>

      </div>

      {/* Ads Placeholder */}
      <div className="bg-slate-100 dark:bg-slate-900/40 text-slate-400 dark:text-slate-500 text-xs py-3 px-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center uppercase tracking-widest transition-colors duration-200">
        Sponsored Search Result Placement (Google AdSense Ready)
      </div>
    </div>
  );
}
