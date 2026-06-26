import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import SEO from './SEO';

export default function NewsletterView() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [topics, setTopics] = useState({
    investing: true,
    retirement: true,
    debt: false,
    savings: true,
    fire: false
  });

  const handleToggleTopic = (topic: keyof typeof topics) => {
    setTopics((prev) => ({ ...prev, [topic]: !prev[topic] }));
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulate API registration successfully
    setSubscribed(true);
  };

  return (
    <div className="animate-fade-in max-w-xl mx-auto px-4 sm:px-6 py-12" id="newsletter-page">
      <SEO
        title="Subscribe to MoneyMetrics Newsletter | Wealth Intelligence"
        description="Join 10,000+ readers learning about smarter money decisions, investing models, early retirement, and tax hacks."
        slug="newsletter"
      />

      {subscribed ? (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-lg text-center space-y-5 animate-fade-in">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Lucide.Sparkles className="w-8 h-8 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-display font-black text-slate-950 dark:text-white">Welcome to MoneyMetrics Hub!</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              We have successfully registered <span className="font-bold text-slate-800 dark:text-slate-200">{email}</span>. You will receive our next weekly briefing direct to your inbox.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 text-left space-y-2 max-w-xs mx-auto text-xs">
            <span className="font-bold text-slate-400 uppercase text-[9px] tracking-wider block">Your Content Stream:</span>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(topics).map(([k, active]) => active && (
                <span key={k} className="px-2.5 py-1 bg-blue-100/60 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-extrabold text-[10px] uppercase rounded-full">
                  {k}
                </span>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-slate-400 leading-normal">
            No spam. Unsubscribe at any time with a single click. FDIC rate alerts included.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md space-y-6">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-wider rounded-full">
              Weekly Wealth Intelligence Briefing
            </span>
            <h1 className="text-2xl font-display font-black text-slate-950 dark:text-white tracking-tight">
              Smarter Financial Decisions
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              Join 10,000+ subscribers receiving data-driven portfolio strategies, retirement modeling, tax hacks, and market analysis.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">First Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Marcus"
                className="w-full text-xs font-semibold p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Email Address (Required)</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="marcus@example.com"
                className="w-full text-xs font-semibold p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Topic Select Checkboxes (Phase 3) */}
            <div className="space-y-2.5 pt-1">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Select Your Briefing Topics</span>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(topics) as Array<keyof typeof topics>).map((topic) => {
                  const isActive = topics[topic];
                  return (
                    <button
                      type="button"
                      key={topic}
                      onClick={() => handleToggleTopic(topic)}
                      className={`px-3 py-2 border rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between gap-2 cursor-pointer ${
                        isActive
                          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="uppercase tracking-wide">{topic}</span>
                      {isActive ? (
                        <Lucide.CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Lucide.Square className="w-4 h-4 text-slate-300 dark:text-slate-700" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Subscribe & Download SWR Playbook</span>
              <Lucide.ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[10px] text-slate-400 text-center leading-normal">
            We value your privacy. Your address is never sold, leased, or distributed to third-party underwriters. Safe-unsubscribes are supported in every briefing footer.
          </p>
        </div>
      )}
    </div>
  );
}
