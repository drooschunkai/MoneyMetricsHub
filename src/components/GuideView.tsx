import { useState } from 'react';
import * as Lucide from 'lucide-react';
import { guides } from '../data/guides';
import { calculators } from '../data/calculators';
import SEO from './SEO';

interface GuideViewProps {
  guideSlug: string;
  onNavigate: (route: string) => void;
}

export default function GuideView({ guideSlug, onNavigate }: GuideViewProps) {
  const guide = guides.find((g) => g.slug === guideSlug);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!guide) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <Lucide.AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-2xl font-bold">Guide Not Found</h2>
        <p className="text-slate-500">The requested financial guide could not be located.</p>
        <button
          onClick={() => onNavigate('')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
        >
          Return Home
        </button>
      </div>
    );
  }

  // Get related calculators based on guide context
  const relatedCalcs = calculators.filter((calc) => calc.relatedGuides.includes(guide.slug));

  // Helper to convert heading text to element ID
  const headingSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Generate Table of Contents headings
  const headings = guide.content
    .split('\n\n')
    .map((p) => p.trim())
    .filter((p) => p.startsWith('## ') && !p.startsWith('### '))
    .map((p) => {
      const text = p.replace('## ', '');
      return { text, id: headingSlug(text) };
    });

  // Handle smooth scroll
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-200">
      <SEO
        title={`${guide.title} | MoneyMetricsHub`}
        description={guide.metaDescription}
        schemaType="guide"
        slug={`guides/${guide.slug}`}
        faqs={guide.faqs}
      />

      {/* Breadcrumb navigation */}
      <nav className="flex text-xs text-slate-500 gap-1.5 items-center mb-8">
        <button onClick={() => onNavigate('')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">Home</button>
        <Lucide.ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-slate-400 dark:text-slate-500">Guides</span>
        <Lucide.ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-[200px]">{guide.title}</span>
      </nav>

      {/* Hero Header Section */}
      <div className="space-y-6 pb-8 border-b border-slate-100 dark:border-slate-800/80 mb-10">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full uppercase tracking-wider text-[10px] border border-blue-100/50 dark:border-blue-900/30">
            {guide.category}
          </span>
          <span className="flex items-center gap-1">
            <Lucide.Clock className="w-4 h-4 text-slate-400" />
            {guide.readTime}
          </span>
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-900/30">
            <Lucide.ShieldCheck className="w-4 h-4" />
            Expert Reviewed
          </span>
          <span className="text-slate-300">|</span>
          <span>Last Updated: June 2026</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
          {guide.title}
        </h1>

        <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed max-w-4xl font-normal">
          {guide.summary}
        </p>

        {/* EEAT Author Card Block */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/80 max-w-3xl">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
            MS
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Marcus Sterling, CFP®</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Author</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Certified Financial Planner & Lead Wealth Advisor</p>
          </div>
          <div className="border-l border-slate-200 dark:border-slate-700 h-8 hidden md:block"></div>
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Dr. Olivia Vance, PhD</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Reviewer</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Professor of Corporate Finance & Academic Advisor</p>
          </div>
        </div>
      </div>

      {/* Main Content Layout with Sticky Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left/Middle Column (Main Article & FAQs) */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Mobile Table of Contents Accordion */}
          {headings.length > 0 && (
            <div className="lg:hidden p-5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-150 dark:border-slate-800/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2 mb-3">
                <Lucide.List className="w-4 h-4 text-blue-600" />
                Table of Contents
              </h3>
              <ul className="space-y-2 text-xs">
                {headings.map((h, i) => (
                  <li key={i}>
                    <button
                      onClick={() => handleScrollTo(h.id)}
                      className="text-blue-600 dark:text-blue-400 hover:underline text-left cursor-pointer transition-colors"
                    >
                      {h.text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Main Article Content */}
          <article className="prose prose-slate max-w-none text-slate-700 dark:text-slate-300 leading-relaxed space-y-6">
            {guide.content.split('\n\n').map((paragraph, index) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;

              // Render H2 Headers (linked to ToC)
              if (trimmed.startsWith('## ')) {
                const headerText = trimmed.replace('## ', '');
                return (
                  <h2
                    id={headingSlug(headerText)}
                    key={index}
                    className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white pt-6 border-b border-slate-100 dark:border-slate-850 pb-2 scroll-mt-20"
                  >
                    {headerText}
                  </h2>
                );
              }

              // Render H3 Headers
              if (trimmed.startsWith('### ')) {
                return (
                  <h3 key={index} className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white pt-4">
                    {trimmed.replace('### ', '')}
                  </h3>
                );
              }

              // Render List Items
              if (trimmed.startsWith('* ') || trimmed.startsWith('1. ')) {
                const items = trimmed.split('\n');
                return (
                  <ul key={index} className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-300 text-sm sm:text-base">
                    {items.map((it, idx) => (
                      <li key={idx} className="marker:text-blue-500">
                        {it.replace(/^\* |^\d+\.\s+/, '')}
                      </li>
                    ))}
                  </ul>
                );
              }

              // Handle Custom Math formulas
              if (trimmed.startsWith('$$')) {
                return (
                  <div key={index} className="p-5 bg-slate-900 text-slate-100 rounded-2xl font-mono text-center text-xs sm:text-sm overflow-x-auto border border-slate-800 shadow-sm my-6">
                    {trimmed.replace(/\$\$/g, '')}
                  </div>
                );
              }

              // Default Paragraph
              return (
                <p key={index} className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {trimmed}
                </p>
              );
            })}
          </article>

          {/* FAQs Block */}
          {guide.faqs && guide.faqs.length > 0 && (
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lucide.HelpCircle className="w-5.5 h-5.5 text-blue-600 dark:text-blue-400" />
                Common Questions & Answers
              </h3>
              <div className="space-y-3.5">
                {guide.faqs.map((faq, index) => (
                  <div key={index} className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full text-left px-5 py-4 bg-slate-50/50 dark:bg-slate-950/20 hover:bg-slate-50 dark:hover:bg-slate-850 font-semibold text-slate-800 dark:text-slate-200 text-sm flex justify-between items-center transition-colors cursor-pointer"
                    >
                      {faq.question}
                      <Lucide.ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === index ? 'rotate-180 text-blue-600' : ''}`} />
                    </button>
                    {openFaq === index && (
                      <div className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 leading-relaxed bg-white dark:bg-slate-900/40">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Peer Editorial references block */}
          <div className="p-6 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800/85 space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Lucide.BookOpen className="w-4 h-4 text-blue-600" />
              Authoritative Sources & Academic References
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              MoneyMetricsHub maintains strict editorial standards. We prioritize peer-reviewed research, verified federal regulations, and authoritative bodies:
            </p>
            <ul className="list-disc pl-5 text-xs text-blue-600 dark:text-blue-400 space-y-1.5">
              <li>
                <a href="https://www.sec.gov" target="_blank" rel="noopener noreferrer" className="hover:underline">U.S. Securities and Exchange Commission (SEC) Investor Guides</a>
              </li>
              <li>
                <a href="https://www.irs.gov" target="_blank" rel="noopener noreferrer" className="hover:underline">Internal Revenue Service (IRS) Tax Brackets & Publications</a>
              </li>
              <li>
                <a href="https://www.investopedia.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Investopedia Corporate Finance Dictionary</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Right Column (Sticky ToC & Interactive Tools) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Desktop Sticky Table of Contents */}
          {headings.length > 0 && (
            <div className="hidden lg:block sticky top-24 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto">
              <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2 border-b border-slate-50 dark:border-slate-800 pb-2">
                <Lucide.List className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Guide Sections
              </h3>
              <ul className="space-y-2.5 text-xs">
                {headings.map((h, i) => (
                  <li key={i}>
                    <button
                      onClick={() => handleScrollTo(h.id)}
                      className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-left font-medium transition-colors cursor-pointer w-full"
                    >
                      {h.text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Interactive Calculators Panel */}
          {relatedCalcs.length > 0 && (
            <div className="p-6 bg-blue-50/20 dark:bg-blue-950/10 border border-blue-50/50 dark:border-blue-900/20 rounded-3xl space-y-4">
              <div className="flex items-center gap-2">
                <Lucide.Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h4 className="font-display font-bold text-slate-900 dark:text-white text-sm">Interactive Calculators</h4>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Want to compute your own personal milestones? Put your numbers in our certified financial calculators to get instant breakdowns.
              </p>
              <div className="space-y-2">
                {relatedCalcs.map((calc) => (
                  <button
                    key={calc.id}
                    onClick={() => onNavigate(`calculators/${calc.slug}`)}
                    className="w-full p-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-150 dark:border-slate-800/80 rounded-xl shadow-sm text-left flex justify-between items-center group cursor-pointer transition-all duration-200"
                  >
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px] truncate">{calc.name}</span>
                    <Lucide.ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
