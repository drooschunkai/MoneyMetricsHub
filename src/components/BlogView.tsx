import { useState, useEffect } from 'react';
import * as Lucide from 'lucide-react';
import { blogArticles } from '../data/blog';
import { categories } from '../data/categories';
import SEO from './SEO';

interface BlogViewProps {
  articleSlug?: string;
  onNavigate: (route: string) => void;
}

export default function BlogView({ articleSlug, onNavigate }: BlogViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [readingProgress, setReadingProgress] = useState<number>(0);

  // If a slug is specified in the URL, render the active article, otherwise render the article list
  const activeArticle = articleSlug ? blogArticles.find(a => a.slug === articleSlug) : null;

  // Track reading scroll progress for detail article
  useEffect(() => {
    if (!activeArticle) {
      setReadingProgress(0);
      return;
    }

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeArticle]);

  // Filter articles based on category pill selection & search input
  const filteredArticles = blogArticles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Get matching category definition for styling
  const getCategoryDetails = (catId: string) => {
    return categories.find(c => c.id === catId) || { name: catId, icon: 'BookOpen', slug: catId };
  };

  // Dynamically render category icons
  const renderCategoryIcon = (iconName: string, className = "w-4 h-4") => {
    const IconComponent = (Lucide as any)[iconName] || Lucide.BookOpen;
    return <IconComponent className={className} />;
  };

  // Related articles (excluding current one)
  const relatedArticles = activeArticle 
    ? blogArticles.filter(a => a.slug !== activeArticle.slug).slice(0, 3)
    : [];

  if (activeArticle) {
    const catDetails = getCategoryDetails(activeArticle.category);

    return (
      <div className="animate-fade-in transition-colors duration-200">
        <SEO 
          title={`${activeArticle.title} | Money Metric Hubs Blog`}
          description={activeArticle.metaDescription}
          schemaType="guide"
          slug={`blog/${activeArticle.slug}`}
        />

        {/* Scroll Reading Progress Bar Indicator */}
        <div 
          className="fixed top-16 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-emerald-500 z-50 transition-all duration-100"
          style={{ width: `${readingProgress}%` }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          {/* Breadcrumb Path */}
          <nav className="flex text-xs text-slate-500 gap-1.5 items-center mb-8">
            <button onClick={() => onNavigate('')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">Home</button>
            <Lucide.ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <button onClick={() => onNavigate('blog')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors font-semibold">Blog</button>
            <Lucide.ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-400 dark:text-slate-500 truncate max-w-[240px]">{activeArticle.title}</span>
          </nav>

          {/* Return To List Button */}
          <button 
            onClick={() => onNavigate('blog')}
            className="group flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors cursor-pointer"
          >
            <Lucide.ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Articles List
          </button>

          {/* Article Layout Frame */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Primary Article Body Column */}
            <article className="lg:col-span-8 space-y-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 sm:p-10 rounded-3xl shadow-sm">
              
              {/* Category tag & reading times */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
                <button 
                  onClick={() => {
                    onNavigate(`categories/${catDetails.slug}`);
                  }}
                  className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full uppercase tracking-wider text-[10px] border border-blue-100/50 dark:border-blue-900/30 flex items-center gap-1.5 hover:bg-blue-100 transition-colors"
                >
                  {renderCategoryIcon(catDetails.icon, "w-3 h-3")}
                  {catDetails.name}
                </button>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <Lucide.Clock className="w-3.5 h-3.5" />
                  {activeArticle.readTime}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-slate-500 dark:text-slate-400">{activeArticle.publishDate}</span>
              </div>

              {/* Title Header */}
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
                {activeArticle.title}
              </h1>

              {/* EEAT Author Card Bio */}
              <div className="flex items-center gap-3.5 p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-extrabold text-sm shadow">
                  {activeArticle.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {activeArticle.author}
                    <span className="text-[9px] bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 px-1.5 py-0.5 rounded font-black uppercase tracking-widest">FINANCE AUTHOR</span>
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">Expert Columnist • Verified Mathematical Models & Formulas</p>
                </div>
              </div>

              {/* Article Content Render */}
              <div 
                className="prose prose-slate dark:prose-invert max-w-none text-slate-650 dark:text-slate-300 leading-relaxed space-y-6 text-sm sm:text-base 
                  [&>h3]:font-display [&>h3]:text-lg [&>h3]:sm:text-xl [&>h3]:font-bold [&>h3]:text-slate-900 [&>h3]:dark:text-white [&>h3]:pt-4 [&>h3]:pb-1 [&>h3]:border-b [&>h3]:border-slate-50 [&>h3]:dark:border-slate-800/80
                  [&>h4]:font-display [&>h4]:text-sm [&>h4]:sm:text-base [&>h4]:font-bold [&>h4]:text-slate-800 [&>h4]:dark:text-slate-200 [&>h4]:pt-3
                  [&>p]:leading-relaxed [&>p]:text-slate-650 [&>p]:dark:text-slate-300
                  [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5 [&>ul]:text-slate-650 [&>ul]:dark:text-slate-300
                  [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-1.5 [&>ol]:text-slate-650 [&>ol]:dark:text-slate-300
                  [&_strong]:font-bold [&_strong]:text-slate-900 [&_strong]:dark:text-white
                  [&_table]:w-full [&_table]:border-collapse [&_table]:my-6 [&_table]:text-xs [&_th]:bg-slate-50 [&_th]:dark:bg-slate-950 [&_th]:p-3 [&_th]:border [&_th]:border-slate-200 [&_th]:dark:border-slate-800 [&_td]:p-3 [&_td]:border [&_td]:border-slate-150 [&_td]:dark:border-slate-800
                "
                dangerouslySetInnerHTML={{ __html: activeArticle.content }}
              />

              {/* Tags & Share options */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap justify-between items-center gap-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Lucide.Tag className="w-3.5 h-3.5 text-slate-400" />
                  {activeArticle.tags.map(tag => (
                    <span 
                      key={tag}
                      className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Article link copied to clipboard!");
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <Lucide.Share2 className="w-4 h-4" />
                  Copy Link
                </button>
              </div>

            </article>

            {/* Sidebar Columns (Related articles & Categories) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Category jump list */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm border-b border-slate-50 dark:border-slate-800 pb-2">
                  Browse by Category
                </h3>
                <div className="flex flex-col gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onNavigate(`categories/${cat.slug}`);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-slate-850 transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        {renderCategoryIcon(cat.icon, "w-4 h-4 text-slate-400 group-hover:text-blue-500")}
                        <span>{cat.name}</span>
                      </div>
                      <Lucide.ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Related Blog Posts */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm border-b border-slate-50 dark:border-slate-800/80 pb-2 flex items-center gap-2">
                  <Lucide.Sparkles className="w-4 h-4 text-amber-500" />
                  Keep Reading
                </h3>
                <div className="space-y-4">
                  {relatedArticles.map((art) => {
                    const innerCat = getCategoryDetails(art.category);
                    return (
                      <div 
                        key={art.slug} 
                        onClick={() => onNavigate(`blog/${art.slug}`)}
                        className="group space-y-1 cursor-pointer border-b border-slate-50 dark:border-slate-850 pb-3 last:border-0 last:pb-0"
                      >
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400 block">
                          {innerCat.name}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                          {art.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          <span>{art.readTime}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CTA Newsletter block */}
              <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl shadow-md space-y-4">
                <Lucide.MailOpen className="w-8 h-8 text-blue-200" />
                <h4 className="font-display font-black text-base">Weekly Financial Briefing</h4>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Join 12,000+ smart investors and readers. Get verified mathematical analysis, tools, and regulatory changes directly to your inbox.
                </p>
                <button
                  onClick={() => onNavigate('newsletter')}
                  className="w-full py-2.5 bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Join Newsletter
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    );
  }

  // ELSE: ARTICLE LIST VIEW
  return (
    <div className="animate-fade-in transition-colors duration-200">
      <SEO 
        title="Expert Personal Finance Blog | Money Metric Hubs"
        description="Master your money with our verified, expert-reviewed articles, formulas, and guides matching our 8 core financial categories."
        schemaType="basic"
        slug="blog"
      />

      {/* Banner Hero Section */}
      <div className="bg-slate-900 text-white dark:bg-slate-950 py-16 border-b border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3.5 py-1 rounded-full uppercase tracking-widest font-black">
            Our Editorial Blog
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none text-white">
            Precision Financial <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Insights</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Deep diving into our 8 core financial categories. Transparent mathematical models, expert perspectives, and actionable wealth-building strategies.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Filters and Search Bar Container */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm mb-10 space-y-4 transition-colors">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-grow max-w-md">
              <Lucide.Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4.5 h-4.5" />
              <input 
                type="text"
                placeholder="Search articles by keywords or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 pl-11 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium border border-slate-100 dark:border-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="text-xs text-slate-400 font-medium">
              Showing <strong>{filteredArticles.length}</strong> of <strong>{blogArticles.length}</strong> expert articles
            </div>

          </div>

          {/* Category Filter Pills (covers 8 categories) */}
          <div className="border-t border-slate-50 dark:border-slate-805 pt-4">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-2.5 block">
              Filter by Core Category:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
                }`}
              >
                <Lucide.Grid className="w-3.5 h-3.5" />
                All Categories
              </button>
              
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
                  }`}
                >
                  {renderCategoryIcon(cat.icon, "w-3.5 h-3.5")}
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Empty state when no articles match filters */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-16 space-y-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-805 rounded-3xl">
            <Lucide.BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">No Articles Found</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">
              We couldn't find any articles matching your search query or filters. Try choosing a different category or clearing search filters.
            </p>
            <button 
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Bento/Grid list of articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, index) => {
            const catInfo = getCategoryDetails(article.category);
            // Highlight first article as featured hero element if it has no category selected
            const isFeaturedHero = index === 0 && selectedCategory === 'all' && !searchQuery;

            return (
              <div 
                key={article.slug}
                onClick={() => onNavigate(`blog/${article.slug}`)}
                className={`group flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer transition-all duration-200 
                  ${isFeaturedHero ? 'md:col-span-2 lg:col-span-3 lg:flex-row' : ''}`}
              >
                
                {/* Visual Cover Accent (Beautiful color gradients instead of heavy broken image placeholders) */}
                <div className={`relative h-32 bg-gradient-to-tr from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 p-6 flex flex-col justify-between overflow-hidden flex-shrink-0
                  ${isFeaturedHero ? 'lg:w-[35%] lg:h-full lg:min-h-[250px]' : ''}`}
                >
                  {/* Subtle vector grid overlays for professional touch */}
                  <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  
                  <div className="z-10 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-lg p-2 self-start border border-white/10">
                    {renderCategoryIcon(catInfo.icon, "w-6 h-6 text-white")}
                  </div>

                  <span className="z-10 text-[9px] font-extrabold text-blue-300 bg-blue-900/30 px-2 py-0.5 rounded border border-blue-500/20 tracking-wider uppercase self-start">
                    {catInfo.name}
                  </span>
                </div>

                {/* Article Card Context */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-semibold">
                      <span>{article.publishDate}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>

                    <h3 className={`font-display font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-2
                      ${isFeaturedHero ? 'text-lg sm:text-xl lg:text-2xl' : 'text-sm sm:text-base'}`}
                    >
                      {article.title}
                    </h3>

                    <p className={`text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-3`}>
                      {article.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-850">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-350 flex items-center justify-center font-bold text-[9px]">
                        {article.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{article.author}</span>
                    </div>

                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-1.5 transition-transform duration-200">
                      Read Article
                      <Lucide.ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
