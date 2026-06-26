import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import SEO from './SEO';

export default function DashboardView() {
  const [activeTab, setActiveTab] = useState<'overview' | 'queries' | 'coverage'>('overview');

  // Simulated premium Google Search Console parameters
  const metrics = {
    totalClicks: '28.4K',
    totalImpressions: '412.9K',
    averageCtr: '6.8%',
    averagePosition: '12.4'
  };

  const topQueries = [
    { query: '30 year fixed mortgage interest calculation', clicks: 1240, impressions: 14200, ctr: '8.7%', position: '3.2' },
    { query: '$200,000 mortgage payment amortized', clicks: 950, impressions: 12500, ctr: '7.6%', position: '2.5' },
    { query: 'investing 500 per month compound interest', clicks: 880, impressions: 11200, ctr: '7.8%', position: '4.1' },
    { query: 'fat fire targets 3000000 SWR', clicks: 760, impressions: 9800, ctr: '7.7%', position: '5.2' },
    { query: 'how much is take home pay for 100000 salary', clicks: 610, impressions: 8900, ctr: '6.8%', position: '6.0' }
  ];

  const indexedUrls = [
    { url: '/mortgage/200000-loan', status: 'Valid (Indexed)', clicks: 1420, impressions: 21000 },
    { url: '/compound-interest/500-per-month', status: 'Valid (Indexed)', clicks: 1200, impressions: 18500 },
    { url: '/retirement/age-35', status: 'Valid (Indexed)', clicks: 840, impressions: 11200 },
    { url: '/salary/100000-income', status: 'Valid (Indexed)', clicks: 790, impressions: 10400 }
  ];

  // Daily clicks history array to render a beautiful responsive chart
  const historyData = [
    { day: 'Mon', clicks: 420, impressions: 6100 },
    { day: 'Tue', clicks: 580, impressions: 8200 },
    { day: 'Wed', clicks: 640, impressions: 9400 },
    { day: 'Thu', clicks: 710, impressions: 10500 },
    { day: 'Fri', clicks: 820, impressions: 12100 },
    { day: 'Sat', clicks: 520, impressions: 7800 },
    { day: 'Sun', clicks: 480, impressions: 6900 }
  ];

  const maxClicks = Math.max(...historyData.map((d) => d.clicks));

  return (
    <div className="animate-fade-in max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8" id="search-console-dashboard">
      <SEO
        title="Search Console Intelligence | MoneyMetricsHub"
        description="Monitor index coverage, organic traffic clicks, impressions, click-through rates, and average SERP positions."
        slug="dashboard"
      />

      {/* Title */}
      <div className="border-b border-slate-150 dark:border-slate-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-950 dark:text-white flex items-center gap-2.5">
          <Lucide.Trophy className="w-8 h-8 text-blue-600" />
          <span>SEO & Search Console Performance Dashboard</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
          Real-time analytics monitor for index coverage, organic traffic clicks, impressions, click-through rates, and average SERP positions.
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Clicks */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Clicks</span>
            <Lucide.MousePointerClick className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl sm:text-2xl font-mono font-bold text-slate-900 dark:text-white">{metrics.totalClicks}</p>
          <span className="text-[9px] text-emerald-600 font-extrabold flex items-center gap-0.5">
            <Lucide.ArrowUpRight className="w-3.5 h-3.5" /> +14.2% MoM
          </span>
        </div>

        {/* Card 2: Impressions */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Impressions</span>
            <Lucide.Eye className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-xl sm:text-2xl font-mono font-bold text-slate-900 dark:text-white">{metrics.totalImpressions}</p>
          <span className="text-[9px] text-emerald-600 font-extrabold flex items-center gap-0.5">
            <Lucide.ArrowUpRight className="w-3.5 h-3.5" /> +22.4% MoM
          </span>
        </div>

        {/* Card 3: Average CTR */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Average CTR</span>
            <Lucide.Percent className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl sm:text-2xl font-mono font-bold text-slate-900 dark:text-white">{metrics.averageCtr}</p>
          <span className="text-[9px] text-emerald-600 font-extrabold flex items-center gap-0.5">
            <Lucide.ArrowUpRight className="w-3.5 h-3.5" /> +0.4% MoM
          </span>
        </div>

        {/* Card 4: Average Position */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Avg. SERP Position</span>
            <Lucide.Activity className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl sm:text-2xl font-mono font-bold text-slate-900 dark:text-white">{metrics.averagePosition}</p>
          <span className="text-[9px] text-emerald-600 font-extrabold flex items-center gap-0.5">
            <Lucide.TrendingUp className="w-3.5 h-3.5" /> +1.8 positions MoM
          </span>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Lucide.BarChart3 className="w-4 h-4" />
          <span>Clicks Overview</span>
        </button>
        <button
          onClick={() => setActiveTab('queries')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'queries'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Lucide.KeyRound className="w-4 h-4" />
          <span>Top Query Performance</span>
        </button>
        <button
          onClick={() => setActiveTab('coverage')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'coverage'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Lucide.CloudLightning className="w-4 h-4" />
          <span>Page Indexing Coverage</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-xs">
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Organic Clicks Trend</h3>
                <span className="text-[10px] text-slate-400">Daily search engine click paths over the last week.</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">7-Day Rolling Interval</span>
            </div>

            {/* Micro Dynamic SVG Columns Line Chart */}
            <div className="h-44 flex items-end gap-3 pt-4 border-b border-slate-100 dark:border-slate-850">
              {historyData.map((d, idx) => {
                const clickHeightPct = (d.clicks / maxClicks) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full relative group">
                    <div className="w-full bg-blue-600/10 hover:bg-blue-600/25 rounded-t-lg transition-colors flex flex-col justify-end overflow-hidden h-full max-h-[100%]">
                      <div
                        style={{ height: `${clickHeightPct}%` }}
                        className="w-full bg-blue-600 dark:bg-blue-500 rounded-t-sm opacity-90 group-hover:opacity-100 transition-all duration-300"
                      />
                    </div>
                    
                    {/* Tooltip on Hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 bg-slate-950 text-white font-mono text-[9px] p-2 rounded shadow-lg border border-slate-800 pointer-events-none transition-opacity duration-150 z-20 whitespace-nowrap text-center">
                      <div className="font-bold text-slate-350">{d.day} Performance</div>
                      <div className="flex justify-between gap-3 mt-1 text-blue-400 font-bold">
                        <span>Clicks:</span>
                        <span>{d.clicks}</span>
                      </div>
                      <div className="flex justify-between gap-3 text-slate-400">
                        <span>Impressions:</span>
                        <span>{d.impressions}</span>
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-400 mt-2 font-bold">{d.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'queries' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-850 pb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">High-Impact Search Queries</h3>
              <span className="text-[10px] text-slate-400 font-bold">Top organic phrases driving traffic.</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-500 dark:text-slate-400">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-2.5">Query</th>
                    <th className="py-2.5 text-right">Clicks</th>
                    <th className="py-2.5 text-right">Impressions</th>
                    <th className="py-2.5 text-right">CTR</th>
                    <th className="py-2.5 text-right">Position</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-medium">
                  {topQueries.map((q, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                      <td className="py-3 font-semibold text-slate-850 dark:text-slate-200">{q.query}</td>
                      <td className="py-3 text-right font-mono text-slate-900 dark:text-white">{q.clicks}</td>
                      <td className="py-3 text-right font-mono">{q.impressions.toLocaleString()}</td>
                      <td className="py-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">{q.ctr}</td>
                      <td className="py-3 text-right font-mono text-blue-600 dark:text-blue-400">{q.position}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'coverage' && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-850 pb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Crawled and Indexed Core Pages</h3>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <Lucide.CheckCircle className="w-3.5 h-3.5" /> All systems normal (No Errors)
              </span>
            </div>

            <div className="space-y-3">
              {indexedUrls.map((indexed, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <Lucide.Link className="w-4 h-4 text-slate-450" />
                    <span className="text-slate-800 dark:text-slate-200 font-mono text-[11px]">{indexed.url}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 text-[10px] font-extrabold uppercase">
                      {indexed.status}
                    </span>
                    <span className="font-mono text-slate-450 text-[10px]">
                      Clicks: <span className="font-bold text-slate-700 dark:text-slate-300">{indexed.clicks}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
