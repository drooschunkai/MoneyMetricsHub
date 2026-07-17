import React, { useState, useMemo } from 'react';
import * as Lucide from 'lucide-react';
import { guides } from '../data/guides';
import { categories } from '../data/categories';
import SEO from './SEO';

interface BlogViewProps {
  onNavigate: (route: string) => void;
}

export default function BlogView({ onNavigate }: BlogViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const postsPerPage = 6;

  // Find category details helper
  const getCategoryDetails = (catSlug: string) => {
    return categories.find((c) => c.slug === catSlug) || {
      name: catSlug.charAt(0).toUpperCase() + catSlug.slice(1),
      icon: 'BookOpen'
    };
  };

  // Filter posts based on category and search query
  const filteredGuides = useMemo(() => {
    return guides.filter((guide) => {
      const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
      const matchesSearch = 
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Paginated posts
  const paginatedGuides = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredGuides.slice(startIndex, startIndex + postsPerPage);
  }, [filteredGuides, currentPage]);

  const totalPages = Math.ceil(filteredGuides.length / postsPerPage);

  // Handle category change
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // Get count for each category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: guides.length };
    guides.forEach((guide) => {
      counts[guide.category] = (counts[guide.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Featured / Hero Post (first investing or retirement post or just first guide)
  const featuredPost = useMemo(() => {
    return guides.find((g) => g.slug === 'what-is-compound-interest') || guides[0];
  }, []);

  // Render Category Icon dynamically
  const renderCategoryIcon = (iconName: string, className: string = "w-4 h-4") => {
    const IconComponent = (Lucide as any)[iconName] || Lucide.BookOpen;
    return <IconComponent className={className} />;
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-200" id="blog-knowledge-hub">
      <SEO
        title="Financial Library & Wealth Guides | Money Metric Hubs"
        description="Explore our library of expert-reviewed guides covering compound interest, retirement planning, debt management, taxes, and business metrics."
        slug="blog"
      />

      {/* Breadcrumbs */}
      <nav className="flex text-xs text-slate-500 gap-1.5 items-center mb-6">
        <button onClick={() => onNavigate('')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">Home</button>
        <Lucide.ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-slate-800 dark:text-slate-200 font-medium">Blog</span>
      </nav>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-850 shadow-xl mb-12 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-2xl space-y-4 relative z-10">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-950/50 border border-blue-900/50 px-3 py-1 rounded-full inline-block">
            Financial Education Hub
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Smarter Financial Decisions Through Better Numbers
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Expand your financial literacy with expert-reviewed guides, detailed formulas, and practical calculators designed to compound your wealth and optimize cash flow.
          </p>
        </div>
      </div>

      {/* Featured Article Spot (Only show when not searching or filtering, on page 1) */}
      {selectedCategory === 'all' && searchQuery === '' && currentPage === 1 && featuredPost && (
        <div className="mb-12">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Featured Guide</h2>
          <div 
            onClick={() => onNavigate(`guides/${featuredPost.slug}`)}
            className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 cursor-pointer"
          >
            {/* Visual Thumbnail side (styled fallback block with modern gradient) */}
            <div className="lg:col-span-5 bg-gradient-to-tr from-blue-600 to-emerald-500 p-8 sm:p-12 flex flex-col justify-between text-white min-h-[240px] relative">
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex justify-between items-start">
                <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/20">
                  {getCategoryDetails(featuredPost.category).name}
                </span>
                <Lucide.Sparkles className="w-5 h-5 text-white/80" />
              </div>
              <div className="space-y-2">
                <p className="text-xs text-white/80 font-mono">{featuredPost.readTime}</p>
                <h3 className="font-display text-2xl sm:text-3xl font-black leading-tight tracking-tight">
                  {featuredPost.title}
                </h3>
              </div>
            </div>

            {/* Meta details side */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                  <Lucide.ShieldCheck className="w-4 h-4" />
                  <span>Expert Mathematical Analysis</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                  {featuredPost.summary}
                </p>
                <div className="text-xs text-slate-400 dark:text-slate-500 pt-1">
                  Covers key economic calculations, compounding frequencies, and standard mathematical formulas used by certified investment analysts.
                </div>
              </div>
              
              <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800/85 pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-400">
                    MM
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Editorial Team</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">Verified Calculator Formulas</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1.5 transition-transform">
                  Read Article
                  <Lucide.ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Categories Sidebar & Article Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Controls (Categories & Search) */}
        <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-24">
          
          {/* Search Box */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-sm space-y-3.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Search Articles</h3>
            <div className="relative">
              <Lucide.Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search keywords..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-500 px-10 py-2.5 rounded-xl text-xs text-slate-800 dark:text-slate-100 outline-none transition-colors"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500"
                >
                  <Lucide.X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Categories Selector */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Library Categories</h3>
            <div className="flex flex-col gap-1.5">
              
              {/* All Option */}
              <button
                onClick={() => handleCategorySelect('all')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Lucide.BookOpen className="w-4 h-4" />
                  <span>All Articles</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedCategory === 'all' ? 'bg-blue-700 text-blue-50' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {categoryCounts.all}
                </span>
              </button>

              {/* Individual Categories */}
              {categories.map((cat) => {
                const count = categoryCounts[cat.id] || 0;
                const isSelected = selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.slug)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {renderCategoryIcon(cat.icon)}
                      <span>{cat.name}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-blue-700 text-blue-50' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}

            </div>
          </div>

        </div>

        {/* Listings Grid */}
        <div className="lg:col-span-9 space-y-8">
          
          {/* Header section listing details */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {selectedCategory === 'all' ? 'All Financial Guides' : `${getCategoryDetails(selectedCategory).name} Collection`}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Showing {filteredGuides.length} {filteredGuides.length === 1 ? 'article' : 'articles'} in this selection
              </p>
            </div>
            
            {/* Sorting Info */}
            <div className="text-[11px] text-slate-400 font-mono">
              Sorting: Chronological Index
            </div>
          </div>

          {/* Fallback Empty State */}
          {filteredGuides.length === 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-400 border border-slate-100 dark:border-slate-800">
                <Lucide.Search className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-slate-800 dark:text-slate-200">No Guides Found</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                We couldn't find any articles matching "{searchQuery}" under the selected filter. Try adjusting your keywords or viewing "All Articles".
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-750 text-white font-semibold text-xs rounded-xl cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Active Article Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paginatedGuides.map((post, postIdx) => {
              const catDetails = getCategoryDetails(post.category);
              return (
                <div
                  key={post.slug}
                  onClick={() => onNavigate(`guides/${post.slug}`)}
                  className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-slate-700 p-6 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 flex flex-col justify-between group h-full"
                >
                  <div className="space-y-4">
                    {/* Card Topline */}
                    <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
                      <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded-md border border-blue-100/30">
                        {renderCategoryIcon(catDetails.icon, "w-3 h-3")}
                        {catDetails.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Lucide.Clock className="w-3.5 h-3.5" />
                        {post.readTime}
                      </span>
                    </div>

                    {/* Card Heading */}
                    <div className="space-y-2">
                      <h3 className="font-display text-base font-extrabold text-slate-850 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                        {post.summary}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom line */}
                  <div className="border-t border-slate-50 dark:border-slate-800/80 mt-5 pt-4 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      Formulas & Mathematical Proofs Included
                    </span>
                    <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read
                      <Lucide.ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Simple Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-slate-150 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Previous Page"
              >
                <Lucide.ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-350" />
              </button>
              
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Page <span className="font-bold text-slate-800 dark:text-slate-200">{currentPage}</span> of {totalPages}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-slate-150 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Next Page"
              >
                <Lucide.ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-350" />
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Suggest / Bottom Interactive widget */}
      <div className="bg-slate-100 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-8 mt-16 text-center space-y-4">
        <h3 className="font-display text-lg font-bold text-slate-850 dark:text-white">Looking for a specific mathematical formula or model?</h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
          Our financial engineering team is constantly building new planners, amortization matrices, and capital gains projections. If you need a custom formula calculated, drop us a line!
        </p>
        <button
          onClick={() => onNavigate('contact')}
          className="px-6 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
        >
          Submit Request to Engineering
        </button>
      </div>

    </div>
  );
}
