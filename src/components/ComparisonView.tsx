import React, { useState, useEffect } from 'react';
import * as Lucide from 'lucide-react';
import { formatPrefMoney, getPreferences, currencySymbols } from '../lib/preferences';
import SEO from './SEO';

export default function ComparisonView() {
  const [prefs, setPrefs] = useState(() => getPreferences());

  useEffect(() => {
    const handleUpdate = () => {
      setPrefs(getPreferences());
    };
    window.addEventListener('preferences_updated', handleUpdate);
    return () => {
      window.removeEventListener('preferences_updated', handleUpdate);
    };
  }, []);

  const [compType, setCompType] = useState<'mortgage' | 'investing' | 'retirement'>('mortgage');

  // 1. Mortgage Compare state
  const [mortA, setMortA] = useState({ principal: 300000, rate: 6.5, term: 30 });
  const [mortB, setMortB] = useState({ principal: 300000, rate: 5.0, term: 15 });

  // 2. Investing Compare state
  const [invA, setInvA] = useState({ initial: 10000, monthly: 500, rate: 8.0, years: 30 });
  const [invB, setInvB] = useState({ initial: 10000, monthly: 800, rate: 8.0, years: 25 });

  // 3. Retirement Compare state
  const [retA, setRetA] = useState({ age: 30, retireAge: 65, savings: 50000, monthly: 400, rate: 8.0 });
  const [retB, setRetB] = useState({ age: 40, retireAge: 65, savings: 50000, monthly: 1000, rate: 8.0 });

  // Calculation helpers
  const calculateMortgage = (p: number, r: number, y: number) => {
    const monthlyRate = r / 100 / 12;
    const payments = y * 12;
    if (monthlyRate === 0) {
      return { monthly: p / payments, total: p, totalInterest: 0 };
    }
    const monthly = (p * monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1);
    const total = monthly * payments;
    const totalInterest = total - p;
    return { monthly, total, totalInterest };
  };

  const calculateInvesting = (init: number, monthly: number, r: number, y: number) => {
    let total = init;
    const ratePerPeriod = r / 100 / 12;
    const months = y * 12;
    let totalContributed = init;

    for (let i = 0; i < months; i++) {
      total = total * (1 + ratePerPeriod) + monthly;
      totalContributed += monthly;
    }
    const interest = total - totalContributed;
    return { total, totalContributed, interest };
  };

  const calculateRetirement = (age: number, rAge: number, savings: number, monthly: number, r: number) => {
    const years = rAge - age;
    if (years <= 0) return { total: savings, totalContributed: savings, interest: 0 };
    return calculateInvesting(savings, monthly, r, years);
  };

  // Render Delta Board
  const renderComparisonResults = () => {
    if (compType === 'mortgage') {
      const resA = calculateMortgage(mortA.principal, mortA.rate, mortA.term);
      const resB = calculateMortgage(mortB.principal, mortB.rate, mortB.term);

      const monthlyDiff = resA.monthly - resB.monthly;
      const interestDiff = resA.totalInterest - resB.totalInterest;

      return (
        <div className="space-y-6">
          {/* Comparison Delta Board */}
          <div className="p-5 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900 flex flex-wrap gap-6 items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Summary Delta Comparison</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {interestDiff > 0 ? (
                  <>
                    Scenario B saves you <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{formatPrefMoney(interestDiff)}</span> in lifetime interest payments!
                  </>
                ) : interestDiff < 0 ? (
                  <>
                    Scenario A saves you <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{formatPrefMoney(Math.abs(interestDiff))}</span> in lifetime interest payments!
                  </>
                ) : (
                  'Both scenarios incur identical lifetime interest.'
                )}
              </h4>
            </div>
            
            <div className="flex gap-4 items-center">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Monthly Delta</span>
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                  {formatPrefMoney(Math.abs(monthlyDiff))}/mo {monthlyDiff > 0 ? 'higher in A' : 'higher in B'}
                </span>
              </div>
            </div>
          </div>

          {/* Double Column comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Scenario A */}
            <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">A</div>
                <h5 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Scenario A Payments</h5>
              </div>

              <div className="space-y-3 font-medium">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-450">Estimated Monthly P&I</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{formatPrefMoney(resA.monthly)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-450">Total Lifetime Payments</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{formatPrefMoney(resA.total)}</span>
                </div>
                <div className="flex justify-between text-xs text-blue-600 dark:text-blue-400">
                  <span>Total Non-Recoverable Interest</span>
                  <span className="font-mono font-bold">{formatPrefMoney(resA.totalInterest)}</span>
                </div>
              </div>
            </div>

            {/* Scenario B */}
            <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">B</div>
                <h5 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Scenario B Payments</h5>
              </div>

              <div className="space-y-3 font-medium">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-450">Estimated Monthly P&I</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{formatPrefMoney(resB.monthly)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-450">Total Lifetime Payments</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{formatPrefMoney(resB.total)}</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400">
                  <span>Total Non-Recoverable Interest</span>
                  <span className="font-mono font-bold">{formatPrefMoney(resB.totalInterest)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (compType === 'investing') {
      const resA = calculateInvesting(invA.initial, invA.monthly, invA.rate, invA.years);
      const resB = calculateInvesting(invB.initial, invB.monthly, invB.rate, invB.years);

      const deltaTotal = resA.total - resB.total;

      return (
        <div className="space-y-6">
          <div className="p-5 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900 flex flex-wrap gap-6 items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Summary Delta Comparison</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {deltaTotal > 0 ? (
                  <>
                    Scenario A accumulates <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{formatPrefMoney(deltaTotal)}</span> more wealth at terminal maturity!
                  </>
                ) : deltaTotal < 0 ? (
                  <>
                    Scenario B accumulates <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{formatPrefMoney(Math.abs(deltaTotal))}</span> more wealth at terminal maturity!
                  </>
                ) : (
                  'Both scenarios generate identical terminal portfolios.'
                )}
              </h4>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Scenario A */}
            <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">A</div>
                <h5 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Scenario A Wealth</h5>
              </div>

              <div className="space-y-3 font-medium">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-450">Total Contributed Principal</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{formatPrefMoney(resA.totalContributed)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-450">Compounded Interest Gained</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{formatPrefMoney(resA.interest)}</span>
                </div>
                <div className="flex justify-between text-xs text-blue-600 dark:text-blue-400">
                  <span>Final Portfolio Value</span>
                  <span className="font-mono font-bold">{formatPrefMoney(resA.total)}</span>
                </div>
              </div>
            </div>

            {/* Scenario B */}
            <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">B</div>
                <h5 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Scenario B Wealth</h5>
              </div>

              <div className="space-y-3 font-medium">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-450">Total Contributed Principal</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{formatPrefMoney(resB.totalContributed)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-450">Compounded Interest Gained</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{formatPrefMoney(resB.interest)}</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400">
                  <span>Final Portfolio Value</span>
                  <span className="font-mono font-bold">{formatPrefMoney(resB.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default: Retirement comparison
    const resA = calculateRetirement(retA.age, retA.retireAge, retA.savings, retA.monthly, retA.rate);
    const resB = calculateRetirement(retB.age, retB.retireAge, retB.savings, retB.monthly, retB.rate);

    const deltaTotal = resA.total - resB.total;

    return (
      <div className="space-y-6">
        <div className="p-5 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900 flex flex-wrap gap-6 items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Summary Delta Comparison</span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
              {deltaTotal > 0 ? (
                <>
                  Scenario A retirement portfolio is <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{formatPrefMoney(deltaTotal)}</span> higher than Scenario B!
                </>
              ) : deltaTotal < 0 ? (
                <>
                  Scenario B retirement portfolio is <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{formatPrefMoney(Math.abs(deltaTotal))}</span> higher than Scenario A!
                </>
              ) : (
                'Both portfolios are identical at retirement.'
              )}
            </h4>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Scenario A */}
          <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-2.5">
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">A</div>
              <h5 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Scenario A Portfolio</h5>
            </div>

            <div className="space-y-3 font-medium">
              <div className="flex justify-between text-xs">
                <span className="text-slate-450">Accumulation Duration</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{retA.retireAge - retA.age} Years</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-450">Total Capital Contributed</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{formatPrefMoney(resA.totalContributed)}</span>
              </div>
              <div className="flex justify-between text-xs text-blue-600 dark:text-blue-400">
                <span>Final Nest Egg Value</span>
                <span className="font-mono font-bold">{formatPrefMoney(resA.total)}</span>
              </div>
            </div>
          </div>

          {/* Scenario B */}
          <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">B</div>
              <h5 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Scenario B Portfolio</h5>
            </div>

            <div className="space-y-3 font-medium">
              <div className="flex justify-between text-xs">
                <span className="text-slate-450">Accumulation Duration</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{retB.retireAge - retB.age} Years</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-450">Total Capital Contributed</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{formatPrefMoney(resB.totalContributed)}</span>
              </div>
              <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400">
                <span>Final Nest Egg Value</span>
                <span className="font-mono font-bold">{formatPrefMoney(resB.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8" id="scenarios-comparison-suite">
      <SEO
        title="Side-by-Side Financial Comparison | MoneyMetricsHub"
        description="Compare mortgages, investments, and early retirement plans side-by-side. Calculate interest and cash flow differentials in real-time."
        slug="compare"
      />

      {/* Hero Title */}
      <div className="border-b border-slate-150 dark:border-slate-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-950 dark:text-white flex items-center gap-2.5">
          <Lucide.Combine className="w-8 h-8 text-blue-600 animate-pulse" />
          <span>Side-by-Side Comparison Suite</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
          Evaluate alternative scenarios side-by-side to understand interest deltas, monthly obligations, or compounding velocities in real-time.
        </p>
      </div>

      {/* Mode Select Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 max-w-md gap-1">
        <button
          onClick={() => setCompType('mortgage')}
          className={`flex-1 py-2 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer ${
            compType === 'mortgage'
              ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-500 dark:text-slate-450 hover:text-slate-800'
          }`}
        >
          Mortgages
        </button>
        <button
          onClick={() => setCompType('investing')}
          className={`flex-1 py-2 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer ${
            compType === 'investing'
              ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-500 dark:text-slate-450 hover:text-slate-800'
          }`}
        >
          Investments
        </button>
        <button
          onClick={() => setCompType('retirement')}
          className={`flex-1 py-2 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer ${
            compType === 'retirement'
              ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-500 dark:text-slate-450 hover:text-slate-800'
          }`}
        >
          Retirement
        </button>
      </div>

      {/* Main Double Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs rounded-3xl">
        
        {/* Scenario A Inputs Panel */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-450 uppercase tracking-widest border-b border-slate-100 dark:border-slate-850 pb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>Scenario A Parameters</span>
          </div>

          {compType === 'mortgage' && (
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-500 dark:text-slate-400">Home Price ({currencySymbols[prefs.currency] || '$'})</label>
                <input
                  type="number"
                  value={mortA.principal}
                  onChange={(e) => setMortA({ ...mortA, principal: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-semibold font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-500 dark:text-slate-400">Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={mortA.rate}
                  onChange={(e) => setMortA({ ...mortA, rate: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-semibold font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-500 dark:text-slate-400">Amortization Term (Years)</label>
                <input
                  type="number"
                  value={mortA.term}
                  onChange={(e) => setMortA({ ...mortA, term: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-semibold font-mono"
                />
              </div>
            </div>
          )}

          {compType === 'investing' && (
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-500 dark:text-slate-400">Starting Balance ({currencySymbols[prefs.currency] || '$'})</label>
                <input
                  type="number"
                  value={invA.initial}
                  onChange={(e) => setInvA({ ...invA, initial: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-semibold font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-500 dark:text-slate-400">Monthly Deposit ({currencySymbols[prefs.currency] || '$'})</label>
                <input
                  type="number"
                  value={invA.monthly}
                  onChange={(e) => setInvA({ ...invA, monthly: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-semibold font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-500 dark:text-slate-400">Annual Return (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={invA.rate}
                  onChange={(e) => setInvA({ ...invA, rate: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-semibold font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-500 dark:text-slate-400">Investment Horizon (Years)</label>
                <input
                  type="number"
                  value={invA.years}
                  onChange={(e) => setInvA({ ...invA, years: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-semibold font-mono"
                />
              </div>
            </div>
          )}

          {compType === 'retirement' && (
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-500 dark:text-slate-400">Current Age (Years)</label>
                <input
                  type="number"
                  value={retA.age}
                  onChange={(e) => setRetA({ ...retA, age: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-semibold font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-500 dark:text-slate-400">Retirement Age (Years)</label>
                <input
                  type="number"
                  value={retA.retireAge}
                  onChange={(e) => setRetA({ ...retA, retireAge: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-semibold font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-500 dark:text-slate-400">Current Savings ({currencySymbols[prefs.currency] || '$'})</label>
                <input
                  type="number"
                  value={retA.savings}
                  onChange={(e) => setRetA({ ...retA, savings: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-semibold font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-500 dark:text-slate-400">Monthly Contribution ({currencySymbols[prefs.currency] || '$'})</label>
                <input
                  type="number"
                  value={retA.monthly}
                  onChange={(e) => setRetA({ ...retA, monthly: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-semibold font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* Scenario B Inputs Panel */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-450 uppercase tracking-widest border-b border-slate-100 dark:border-slate-850 pb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Scenario B Parameters</span>
          </div>

          {compType === 'mortgage' && (
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-500 dark:text-slate-400">Home Price ({currencySymbols[prefs.currency] || '$'})</label>
                <input
                  type="number"
                  value={mortB.principal}
                  onChange={(e) => setMortB({ ...mortB, principal: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-semibold font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-500 dark:text-slate-400">Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={mortB.rate}
                  onChange={(e) => setMortB({ ...mortB, rate: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-semibold font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-500 dark:text-slate-400">Amortization Term (Years)</label>
                <input
                  type="number"
                  value={mortB.term}
                  onChange={(e) => setMortB({ ...mortB, term: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-semibold font-mono"
                />
              </div>
            </div>
          )}

          {compType === 'investing' && (
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-500 dark:text-slate-400">Starting Balance ({currencySymbols[prefs.currency] || '$'})</label>
                <input
                  type="number"
                  value={invB.initial}
                  onChange={(e) => setInvB({ ...invB, initial: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-semibold font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-500 dark:text-slate-400">Monthly Deposit ({currencySymbols[prefs.currency] || '$'})</label>
                <input
                  type="number"
                  value={invB.monthly}
                  onChange={(e) => setInvB({ ...invB, monthly: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-semibold font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-500 dark:text-slate-400">Annual Return (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={invB.rate}
                  onChange={(e) => setInvB({ ...invB, rate: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-semibold font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-500 dark:text-slate-400">Investment Horizon (Years)</label>
                <input
                  type="number"
                  value={invB.years}
                  onChange={(e) => setInvB({ ...invB, years: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-semibold font-mono"
                />
              </div>
            </div>
          )}

          {compType === 'retirement' && (
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-500 dark:text-slate-400">Current Age (Years)</label>
                <input
                  type="number"
                  value={retB.age}
                  onChange={(e) => setRetB({ ...retB, age: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-semibold font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-500 dark:text-slate-400">Retirement Age (Years)</label>
                <input
                  type="number"
                  value={retB.retireAge}
                  onChange={(e) => setRetB({ ...retB, retireAge: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-semibold font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-500 dark:text-slate-400">Current Savings ({currencySymbols[prefs.currency] || '$'})</label>
                <input
                  type="number"
                  value={retB.savings}
                  onChange={(e) => setRetB({ ...retB, savings: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-semibold font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-500 dark:text-slate-400">Monthly Contribution ({currencySymbols[prefs.currency] || '$'})</label>
                <input
                  type="number"
                  value={retB.monthly}
                  onChange={(e) => setRetB({ ...retB, monthly: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-semibold font-mono"
                />
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Comparisons outputs rendering panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm rounded-3xl p-6">
        {renderComparisonResults()}
      </div>
    </div>
  );
}
