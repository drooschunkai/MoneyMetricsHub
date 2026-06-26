import React from 'react';
import * as Lucide from 'lucide-react';

// --- ADSENSE OPTIMIZATION COMPONENT ---
interface AdUnitProps {
  placement: 'after-results' | 'before-faq' | 'near-related' | 'after-intro' | 'mid-article' | 'before-conclusion' | 'sidebar';
  className?: string;
}

export function AdSenseUnit({ placement, className = '' }: AdUnitProps) {
  const labelMap = {
    'after-results': 'Sponsored Link | After Results',
    'before-faq': 'Advertisement | Before Frequently Asked Questions',
    'near-related': 'Sponsored Resource | Recommended Options',
    'after-intro': 'Advertisement | Key Partners',
    'mid-article': 'Sponsored Context | High Yield Resources',
    'before-conclusion': 'Advertisement | Final Summary Partners',
    'sidebar': 'Sponsored Ad'
  };

  return (
    <div className={`my-6 mx-auto w-full max-w-4xl p-3 bg-slate-100/60 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center select-none ${className}`} id={`adsense-${placement}`}>
      <div className="text-[10px] font-mono tracking-widest text-slate-400 dark:text-slate-500 uppercase font-bold mb-1.5 flex items-center justify-center gap-1">
        <Lucide.Info className="w-3 h-3" />
        {labelMap[placement]}
      </div>
      <div className="py-5 px-4 flex flex-col items-center justify-center bg-white dark:bg-slate-900/60 rounded-lg border border-slate-100 dark:border-slate-800/80 shadow-inner">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">High Yield Savings Partner</span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 max-w-md">
          Earn up to 4.85% APY with our vetted FDIC-insured banking partners. No hidden fees or minimum balances.
        </span>
        <button className="mt-3.5 px-4 py-1.5 bg-blue-600/10 hover:bg-blue-600 text-blue-600 hover:text-white rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm">
          Compare Best Rates
        </button>
      </div>
    </div>
  );
}

// --- AFFILIATE INFRASTRUCTURE ---
interface AffiliateOfferProps {
  category: 'investing' | 'savings' | 'mortgage' | 'credit' | 'taxes' | 'business';
  className?: string;
}

export function AffiliateOffer({ category, className = '' }: AffiliateOfferProps) {
  const getOfferData = () => {
    switch (category) {
      case 'investing':
        return {
          title: 'Top-Rated Commission-Free Brokerage',
          partner: 'NexusInvest',
          description: 'Get up to 15 free stocks when you fund a new account with at least $100. Trade stocks, options, and ETFs with zero commissions and advanced analysis tools.',
          features: ['SIP Auto-Investment support', '4.5% APY on uninvested cash sweep', 'Comprehensive stock analysis reports'],
          badge: 'Exclusive Referral',
          cta: 'Claim Free Stocks',
          link: 'https://example.com/brokerage-offer',
          icon: <Lucide.TrendingUp className="w-6 h-6 text-emerald-500" />
        };
      case 'savings':
        return {
          title: 'High-Yield Savings Account (HYSA)',
          partner: 'Summit Bank (Member FDIC)',
          description: 'Earn 5.12% APY—over 10x the national average savings account yield. Unlimited transfers, zero monthly fees, and instant mobile check deposits.',
          features: ['No monthly maintenance fees', '$1 minimum opening balance', 'Up to $2M FDIC insurance via partner networks'],
          badge: 'Best HYSA Rate',
          cta: 'Open Account Securely',
          link: 'https://example.com/savings-offer',
          icon: <Lucide.Percent className="w-6 h-6 text-indigo-500" />
        };
      case 'mortgage':
        return {
          title: 'Direct Mortgage Comparison & Pre-Approval Service',
          partner: 'LendMatch Advisors',
          description: 'Compare locked-in mortgage and refinance rates across 40+ lending partners in 90 seconds. Find the absolute lowest APR before closing on your contract.',
          features: ['Free soft-pull rate estimate', 'Zero obligation, zero broker fees', 'Dedicated closing support agent'],
          badge: 'Popular Lender Match',
          cta: 'Check Rates Instantly',
          link: 'https://example.com/mortgage-offer',
          icon: <Lucide.Home className="w-6 h-6 text-blue-500" />
        };
      case 'credit':
      default:
        return {
          title: 'Premium Cash-Back & Balance Transfer Credit Card',
          partner: 'Apex Sapphire Card',
          description: 'Get a 21-month 0% intro APR on purchases and balance transfers. Earn unlimited 2% cash back on every purchase with no annual fee.',
          features: ['$200 introductory cash bonus', 'Zero annual fees', 'Cell phone premium protection coverage'],
          badge: 'Editor\'s Choice Card',
          cta: 'Apply in 2 Minutes',
          link: 'https://example.com/credit-offer',
          icon: <Lucide.CreditCard className="w-6 h-6 text-amber-500" />
        };
    }
  };

  const offer = getOfferData();

  return (
    <div className={`bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-200 hover:shadow-md ${className}`} id={`affiliate-${category}-card`}>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {offer.icon}
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{offer.partner}</span>
            <h5 className="text-sm font-bold text-slate-900 dark:text-white leading-tight mt-0.5">{offer.title}</h5>
          </div>
        </div>
        <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full">
          {offer.badge}
        </span>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
        {offer.description}
      </p>

      <ul className="space-y-1.5 mb-5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
        {offer.features.map((feat, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <Lucide.Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            <span>{feat}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between gap-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80">
        <div className="text-[10px] text-slate-400 leading-relaxed flex items-center gap-1">
          <Lucide.ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          <span>Vetted Partner. Rates updated daily.</span>
        </div>
        <button
          onClick={() => window.open(offer.link, '_blank', 'referrerPolicy=no-referrer')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1"
        >
          <span>{offer.cta}</span>
          <Lucide.ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
