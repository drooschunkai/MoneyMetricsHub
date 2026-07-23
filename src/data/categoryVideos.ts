export interface CategoryVideo {
  categoryId: string;
  videoId: string;
  title: string;
  description: string;
}

// Single source of truth for category video embeds.
// Edit this file to swap in your own YouTube video IDs when your channel is ready!
export const categoryVideos: Record<string, CategoryVideo> = {
  investing: {
    categoryId: 'investing',
    videoId: 'pA6FSy6BRQQ', // CrashCourse: Financial Markets & Investing Basics
    title: 'Financial Markets & Investing Fundamentals',
    description: 'A quick visual explainer on how stock markets, bonds, and asset allocation build wealth over time.'
  },
  loans: {
    categoryId: 'loans',
    videoId: '3ez10ADR_gM', // CrashCourse Econ / Mortgages & Loans Overview
    title: 'How Mortgages & Amortization Schedules Work',
    description: 'Learn the core concepts of home loans, principal vs interest payments, and borrowing math.'
  },
  retirement: {
    categoryId: 'retirement',
    videoId: 'L_LUpnjgPso', // TED-Ed: Compound Interest & Long Term Wealth
    title: 'Retirement Growth & Compound Interest Math',
    description: 'An overview of retirement savings curves, compounding timelines, and safe withdrawal rates.'
  },
  savings: {
    categoryId: 'savings',
    videoId: '3ez10ADR_gM', // CrashCourse Economics
    title: 'Building Emergency Reserves & High-Yield Savings',
    description: 'Why liquid savings protect purchasing power and cushion against financial uncertainty.'
  },
  income: {
    categoryId: 'income',
    videoId: '3ez10ADR_gM', // CrashCourse Economics
    title: 'Gross Pay vs Net Pay: Salary & Hourly Earnings',
    description: 'Understanding payroll deductions, marginal tax brackets, and actual take-home income.'
  },
  debt: {
    categoryId: 'debt',
    videoId: 'pA6FSy6BRQQ', // CrashCourse Financial Literacy
    title: 'Debt Payoff Strategies: Avalanche vs Snowball',
    description: 'A comparison of mathematical and behavioral techniques for eliminating high-interest debt.'
  },
  taxes: {
    categoryId: 'taxes',
    videoId: '13JOGWzY8kE', // CrashCourse Econ #31: Taxes
    title: 'Progressive Tax Brackets & Marginal Rates Explained',
    description: 'How marginal tax tiers apply to income and methods for effective tax rate optimization.'
  },
  business: {
    categoryId: 'business',
    videoId: 'K3bfK3dIn24', // CrashCourse Entrepreneurship
    title: 'Profit Margins, Revenue & Unit Economic Math',
    description: 'A quick breakdown of gross vs net margins, fixed vs variable costs, and break-even calculations.'
  }
};
