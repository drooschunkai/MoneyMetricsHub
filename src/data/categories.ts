import { CategoryDefinition } from '../types';

export const categories: CategoryDefinition[] = [
  {
    id: 'investing',
    name: 'Investing',
    slug: 'investing',
    icon: 'TrendingUp',
    description: 'Grow your wealth with calculators for compound interest, investment returns, SIPs, CAGR, and future value equations.',
    seoText: 'Compare investments, analyze compound interest growth, map out systematic investment plans (SIP), and calculate compound annual growth rates (CAGR). Our professional investing calculators utilize precise, time-tested algorithms to help you grow your portfolio with complete confidence.',
    featuredCalculators: ['compound-interest', 'investment-return', 'sip-calculator']
  },
  {
    id: 'loans',
    name: 'Loans & Mortgages',
    slug: 'loans',
    icon: 'Home',
    description: 'Analyze home loans, auto financing, personal loans, EMI plans, and amortization schedules.',
    seoText: 'Determine your monthly mortgage payments, estimate total loan interest, compare monthly EMIs, and model auto or personal loan terms. Built for home buyers and debt managers to understand the true cost of borrowing before signing a contract.',
    featuredCalculators: ['mortgage-calculator', 'loan-calculator', 'emi-calculator']
  },
  {
    id: 'retirement',
    name: 'Retirement',
    slug: 'retirement',
    icon: 'Compass',
    description: 'Plan for financial independence, estimate retirement age, model the 4% rule, and track FIRE progress.',
    seoText: 'Map out your retirement timeline using historical growth data, calculate your FIRE (Financial Independence, Retire Early) number, evaluate the 4% rule safety margin, and forecast your retirement nest egg dynamic growth.',
    featuredCalculators: ['retirement-calculator', 'fire-calculator', 'four-percent-rule']
  },
  {
    id: 'savings',
    name: 'Savings',
    slug: 'savings',
    icon: 'PiggyBank',
    description: 'Calculate emergency funds, model inflation effects, and build automated savings paths.',
    seoText: 'Plan for major life purchases, map out an emergency fund buffer, and understand how inflation impacts your purchasing power over time. Ideal for individuals looking to set, track, and hit savings milestones.',
    featuredCalculators: ['savings-goal', 'emergency-fund', 'inflation-calculator']
  },
  {
    id: 'income',
    name: 'Income & Salary',
    slug: 'income',
    icon: 'DollarSign',
    description: 'Convert hourly wages, evaluate net worth, and track real hourly salary metrics.',
    seoText: 'Convert hourly rates to annual salaries, model paycheck net worth metrics, and trace your progress towards financial freedom. Clear and accurate financial math for everyday workers, freelancers, and high earners.',
    featuredCalculators: ['salary-calculator', 'hourly-wage', 'net-worth']
  },
  {
    id: 'debt',
    name: 'Debt Management',
    slug: 'debt',
    icon: 'ShieldAlert',
    description: 'Model snowball and avalanche strategies, and plan your fastest path to becoming debt-free.',
    seoText: 'Analyze debt payoff strategies, map out credit card consolidation plans, and accelerate your path to financial freedom. Easily visualize how extra principal payments slash your overall timeline.',
    featuredCalculators: []
  },
  {
    id: 'taxes',
    name: 'Taxes',
    slug: 'taxes',
    icon: 'Receipt',
    description: 'Estimate your tax bracket, model income tax scenarios, and optimize capital gains impacts.',
    seoText: 'Model income tax scenarios, calculate capital gains impacts, and plan tax deductions. Stay ahead of tax season with transparent math and visual breakdowns.',
    featuredCalculators: []
  },
  {
    id: 'business',
    name: 'Business Finance',
    slug: 'business',
    icon: 'Briefcase',
    description: 'Analyze profit margins, compute break-even metrics, and evaluate customer acquisition metrics.',
    seoText: 'Formulate business valuations, break-even schedules, gross margin profiles, and customer lifetime value metrics. Built for founders, operators, and finance teams mapping startup growth.',
    featuredCalculators: []
  }
];
