import { CalculatorDefinition } from '../types';
import { investingNewCalculators } from './calculators/investing_new';
import { loansNewCalculators } from './calculators/loans_new';
import { retirementNewCalculators } from './calculators/retirement_new';
import { debtNewCalculators } from './calculators/debt_new';
import { taxesNewCalculators } from './calculators/taxes_new';
import { businessNewCalculators } from './calculators/business_new';

export const calculators: CalculatorDefinition[] = [
  // 1. Compound Interest Calculator
  {
    id: 'compound-interest',
    slug: 'compound-interest',
    name: 'Compound Interest Calculator',
    title: 'Compound Interest Calculator | MoneyMetricsHub',
    metaDescription: 'Calculate investment growth using compound interest with our free calculator. Supports custom monthly contributions and compound frequencies.',
    shortDescription: 'Calculate the exponential growth of your investments with custom contributions and interest compounding options.',
    category: 'investing',
    inputs: [
      { id: 'principal', label: 'Initial Principal', type: 'number', defaultValue: 10000, min: 0, max: 10000000, step: 100, prefix: '$' },
      { id: 'monthlyContribution', label: 'Monthly Contribution', type: 'number', defaultValue: 500, min: 0, max: 100000, step: 50, prefix: '$' },
      { id: 'rate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: 8, min: 0, max: 100, step: 0.1, suffix: '%' },
      { id: 'years', label: 'Time Horizon (Years)', type: 'number', defaultValue: 20, min: 1, max: 100, step: 1, suffix: 'yrs' },
      {
        id: 'frequency',
        label: 'Compounding Frequency',
        type: 'select',
        defaultValue: 12,
        options: [
          { label: 'Annually', value: 1 },
          { label: 'Semi-Annually', value: 2 },
          { label: 'Quarterly', value: 4 },
          { label: 'Monthly', value: 12 },
          { label: 'Daily', value: 365 }
        ]
      }
    ],
    calculate: (inputs) => {
      const P = Number(inputs.principal);
      const PMT = Number(inputs.monthlyContribution);
      const r = Number(inputs.rate) / 100;
      const t = Number(inputs.years);
      const n = Number(inputs.frequency);

      const breakdown = [];
      let totalAccumulated = P;
      let totalContributions = P;
      let totalInterest = 0;

      // Simple yearly estimation for plotting
      const chartData = [];
      
      for (let yr = 1; yr <= t; yr++) {
        const initialOfYear = totalAccumulated;
        
        // Compound initial principal and contributions over the year
        // For accurate monthly contributions compounded n times per year
        if (n === 12) {
          for (let m = 1; m <= 12; m++) {
            totalAccumulated = totalAccumulated * (1 + r / 12) + PMT;
            totalContributions += PMT;
          }
        } else {
          // General compound approximation
          const compoundPrincipal = initialOfYear * Math.pow(1 + r / n, n);
          const annuityContribution = PMT * 12 * ((Math.pow(1 + r / n, n) - 1) / (r / n)) / n; // approx
          totalAccumulated = compoundPrincipal + annuityContribution;
          totalContributions += PMT * 12;
        }

        totalInterest = totalAccumulated - totalContributions;
        
        chartData.push({
          label: `Yr ${yr}`,
          'Total Balance': Math.round(totalAccumulated),
          'Total Contributions': Math.round(totalContributions),
          'Total Interest': Math.round(totalInterest)
        });

        breakdown.push({
          year: yr,
          contributions: Math.round(totalContributions),
          interest: Math.round(totalInterest),
          balance: Math.round(totalAccumulated)
        });
      }

      return {
        summary: [
          { label: 'Ending Balance', value: `$${Math.round(totalAccumulated).toLocaleString()}`, rawValue: totalAccumulated, badgeColor: 'bg-blue-100 text-blue-800' },
          { label: 'Total Principal', value: `$${Math.round(totalContributions).toLocaleString()}`, rawValue: totalContributions },
          { label: 'Total Interest Earned', value: `$${Math.round(totalInterest).toLocaleString()}`, rawValue: totalInterest, badgeColor: 'bg-emerald-100 text-emerald-800' }
        ],
        breakdown,
        chartData,
        chartKeys: [
          { key: 'Total Contributions', color: '#3b82f6', label: 'Contributions' },
          { key: 'Total Interest', color: '#10b981', label: 'Interest' }
        ],
        interpretation: `In ${t} years, your investment will grow to $${Math.round(totalAccumulated).toLocaleString()}. Your principal contribution of $${Math.round(totalContributions).toLocaleString()} has generated an extra $${Math.round(totalInterest).toLocaleString()} purely in compound interest returns.`
      };
    },
    formula: {
      equation: 'A = P(1 + r/n)^(nt) + PMT * [((1 + r/n)^(nt) - 1) / (r/n)]',
      variables: [
        { name: 'A', description: 'Ending balance' },
        { name: 'P', description: 'Initial principal balance' },
        { name: 'PMT', description: 'Periodic payment' },
        { name: 'r', description: 'Annual interest rate (decimal)' },
        { name: 'n', description: 'Number of compounding periods per year' },
        { name: 't', description: 'Time horizon in years' }
      ],
      explanation: 'This formula calculates both the compound interest on your initial principal amount and the future value of a series of regular monthly savings contributions (an ordinary annuity) compounded at the same rate.',
      example: {
        scenario: 'You invest $10,000 at an 8% annual interest rate, compounded monthly, contributing $500 every month for 10 years.',
        steps: [
          'Initial Principal (P) = $10,000',
          'Monthly Contribution (PMT) = $500',
          'Rate (r) = 0.08, Compounding frequency (n) = 12',
          'Calculate compound principal growth over 10 years: $10,000 * (1 + 0.08/12)^120 ≈ $22,196',
          'Calculate contribution accumulation: $500 * [((1 + 0.08/12)^120 - 1) / (0.08/12)] ≈ $91,473',
          'Add both values: $22,196 + $91,473 ≈ $113,669'
        ],
        result: 'Ending investment balance is $113,669, consisting of $70,000 contributions and $43,669 earned interest.'
      },
      limitations: ['Assumes constant annual interest rate over the entire time horizon.', 'Does not account for tax drag (capital gains, income tax) or inflation adjustments.', 'Assumes contributions are always made on-time at the start/end of each month.']
    },
    faqs: [
      { question: 'What is the frequency of compounding?', answer: 'The compounding frequency refers to how often interest is calculated and added back to the principal. More frequent compounding (e.g., daily instead of annually) results in slightly higher total interest accrued.' },
      { question: 'How is compound interest different from simple interest?', answer: 'Simple interest pays returns only on the original principal. Compound interest accrues on both the initial principal and previously earned interest, accelerating wealth growth exponentially.' }
    ],
    references: [
      { name: 'Investopedia - Compound Interest Definitive Guide', url: 'https://www.investopedia.com/terms/c/compoundinterest.asp', description: 'In-depth explanation of compound interest physics, formulas, and historical market examples.' },
      { name: 'SEC Investor Education Compound Calculator', url: 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator', description: 'The official federal consumer interest projection utility.' }
    ],
    relatedCalculators: ['investment-return', 'future-value', 'fire-calculator'],
    relatedGuides: ['what-is-compound-interest', 'what-is-fire']
  },

  // 2. Investment Return Calculator
  {
    id: 'investment-return',
    slug: 'investment-return',
    name: 'Investment Return Calculator',
    title: 'Investment Return Calculator | MoneyMetricsHub',
    metaDescription: 'Calculate the future value of your investments adjusted for inflation. Compare real vs. nominal returns side-by-side.',
    shortDescription: 'See your real portfolio power by evaluating nominal investment returns alongside the cost of inflation.',
    category: 'investing',
    inputs: [
      { id: 'principal', label: 'Starting Investment', type: 'number', defaultValue: 25000, min: 0, max: 10000000, prefix: '$' },
      { id: 'monthly', label: 'Monthly Contribution', type: 'number', defaultValue: 1000, min: 0, max: 100000, prefix: '$' },
      { id: 'rate', label: 'Expected Return Rate (%)', type: 'number', defaultValue: 9, min: -50, max: 100, suffix: '%' },
      { id: 'years', label: 'Years to Grow', type: 'number', defaultValue: 15, min: 1, max: 100, suffix: 'yrs' },
      { id: 'inflation', label: 'Expected Inflation Rate (%)', type: 'number', defaultValue: 2.5, min: 0, max: 30, suffix: '%' }
    ],
    calculate: (inputs) => {
      const P = Number(inputs.principal);
      const PMT = Number(inputs.monthly);
      const r = Number(inputs.rate) / 100;
      const t = Number(inputs.years);
      const inf = Number(inputs.inflation) / 100;

      let nominal = P;
      let real = P;
      let totalContributions = P;
      const chartData = [];

      for (let yr = 1; yr <= t; yr++) {
        // Nominal returns
        for (let m = 1; m <= 12; m++) {
          nominal = nominal * (1 + r / 12) + PMT;
          totalContributions += PMT;
        }

        // Real inflation-adjusted rate (Fisher Equation approximation or real rate calculation)
        // Real rate = (1 + nominal) / (1 + inflation) - 1
        const realRate = (1 + r) / (1 + inf) - 1;
        real = P * Math.pow(1 + realRate, yr);
        // compound real contribution
        for (let yrIndex = 0; yrIndex < yr; yrIndex++) {
          // add yearly contribution values adjusted back to real terms
          const yearsRemaining = yr - yrIndex - 1;
          const nominalValOfContribs = PMT * 12 * Math.pow(1 + r, yearsRemaining);
          // adjust nominal contribution value down for total inflation over yr years
        }
        // Simplified standard real calculation: adjust ending nominal back to present dollars
        const realAdjusted = nominal / Math.pow(1 + inf, yr);

        chartData.push({
          label: `Yr ${yr}`,
          'Nominal Value': Math.round(nominal),
          'Inflation Adjusted (Real)': Math.round(realAdjusted),
          'Invested Principal': Math.round(totalContributions)
        });
      }

      const endNominal = nominal;
      const endReal = nominal / Math.pow(1 + inf, t);

      return {
        summary: [
          { label: 'Nominal Future Value', value: `$${Math.round(endNominal).toLocaleString()}`, rawValue: endNominal, badgeColor: 'bg-blue-100 text-blue-800' },
          { label: 'Real Value (Inflation-Adjusted)', value: `$${Math.round(endReal).toLocaleString()}`, rawValue: endReal, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'Total Amount Invested', value: `$${Math.round(totalContributions).toLocaleString()}`, rawValue: totalContributions }
        ],
        chartData,
        chartKeys: [
          { key: 'Nominal Value', color: '#3b82f6', label: 'Nominal Future Value' },
          { key: 'Inflation Adjusted (Real)', color: '#10b981', label: 'Real Value (Adjusted)' }
        ],
        interpretation: `Your investment grows to $${Math.round(endNominal).toLocaleString()} in nominal dollars. However, when adjusted for a ${inputs.inflation}% yearly inflation rate, its real purchasing power in today's dollars is $${Math.round(endReal).toLocaleString()}.`
      };
    },
    formula: {
      equation: 'Real Value = Nominal Value / (1 + i)^t',
      variables: [
        { name: 'Nominal Value', description: 'Ending value before inflation' },
        { name: 'i', description: 'Average annual inflation rate (decimal)' },
        { name: 't', description: 'Time horizon in years' }
      ],
      explanation: 'First, the nominal future value is calculated with compound returns. Then, the nominal ending figure is discounted back using the cumulative compound inflation rate to isolate real purchasing power.',
      example: {
        scenario: 'You grow $100,000 over 10 years at a nominal return rate of 10%, experiencing a 3% average inflation rate.',
        steps: [
          'Calculate Nominal Future Value: $100,000 * (1.10)^10 = $259,374',
          'Calculate Inflation Factor over 10 years: (1.03)^10 = 1.3439',
          'Discount Nominal ending cash: $259,374 / 1.3439 = $193,000'
        ],
        result: 'Your nominal $259,374 has a purchasing power of $193,000 in today\'s dollars.'
      },
      limitations: ['Inflation fluctuates annually; a constant rate is a simplified assumption.', 'No capital gains taxes are accounted for in these totals.']
    },
    faqs: [
      { question: 'What is the difference between Real and Nominal rates?', answer: 'The nominal rate is the actual rate of return your money earns before inflation, fees, or taxes. The real rate is adjusted for the loss of purchasing power caused by inflation.' }
    ],
    references: [
      { name: 'Investopedia - Real Rate of Return', url: 'https://www.investopedia.com/terms/r/realrateofreturn.asp', description: 'The financial mathematics behind adjusting portfolio gains for inflation.' }
    ],
    relatedCalculators: ['compound-interest', 'cagr-calculator', 'inflation-calculator'],
    relatedGuides: ['what-is-compound-interest', 'inflation-explained']
  },

  // 3. SIP Calculator
  {
    id: 'sip-calculator',
    slug: 'sip-calculator',
    name: 'SIP Calculator',
    title: 'SIP Calculator | Systematic Investment Plan Growth',
    metaDescription: 'Estimate your future wealth using our Systematic Investment Plan (SIP) calculator. Great for Mutual Funds, Index Funds, and Stock plans.',
    shortDescription: 'Calculate the wealth gain and future value of systematic index fund or mutual fund investment plans.',
    category: 'investing',
    inputs: [
      { id: 'monthly', label: 'Monthly SIP Installment', type: 'number', defaultValue: 300, min: 10, max: 100000, prefix: '$' },
      { id: 'rate', label: 'Expected Annual Return (%)', type: 'number', defaultValue: 12, min: 1, max: 50, suffix: '%' },
      { id: 'years', label: 'Investment Period (Years)', type: 'number', defaultValue: 15, min: 1, max: 60, suffix: 'yrs' }
    ],
    calculate: (inputs) => {
      const PMT = Number(inputs.monthly);
      const i = (Number(inputs.rate) / 100) / 12; // monthly rate
      const n = Number(inputs.years) * 12; // total months

      // SIP Formula: M = P * [ ( (1 + i)^n - 1 ) / i ] * (1 + i)
      const futureValue = PMT * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      const totalInvested = PMT * n;
      const wealthGained = futureValue - totalInvested;

      const chartData = [];
      for (let yr = 1; yr <= Number(inputs.years); yr++) {
        const months = yr * 12;
        const fvYear = PMT * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
        const invested = PMT * months;
        chartData.push({
          label: `Yr ${yr}`,
          'Invested Amount': Math.round(invested),
          'Wealth Gained': Math.round(fvYear - invested)
        });
      }

      return {
        summary: [
          { label: 'Total Future Value', value: `$${Math.round(futureValue).toLocaleString()}`, rawValue: futureValue, badgeColor: 'bg-blue-100 text-blue-800' },
          { label: 'Total Invested Amount', value: `$${Math.round(totalInvested).toLocaleString()}`, rawValue: totalInvested },
          { label: 'Estimated Wealth Gained', value: `$${Math.round(wealthGained).toLocaleString()}`, rawValue: wealthGained, badgeColor: 'bg-emerald-100 text-emerald-800' }
        ],
        chartData,
        chartKeys: [
          { key: 'Invested Amount', color: '#64748b', label: 'Invested Capital' },
          { key: 'Wealth Gained', color: '#10b981', label: 'Capital Gains' }
        ],
        interpretation: `By investing $${PMT.toLocaleString()} monthly, you will contribute a total of $${totalInvested.toLocaleString()} over ${inputs.years} years. Thanks to compounding, your total wealth will grow to $${Math.round(futureValue).toLocaleString()}, earning you $${Math.round(wealthGained).toLocaleString()} in capital gains.`
      };
    },
    formula: {
      equation: 'FV = PMT * [((1 + i)^n - 1) / i] * (1 + i)',
      variables: [
        { name: 'FV', description: 'Future value / wealth accumulated' },
        { name: 'PMT', description: 'Monthly SIP payment amount' },
        { name: 'i', description: 'Monthly interest rate (annual return rate / 12)' },
        { name: 'n', description: 'Total number of payments (months)' }
      ],
      explanation: 'An ordinary annuity pays at the end of the period, but a Systematic Investment Plan usually triggers contributions at the beginning of each monthly cycle. The extra (1 + i) factor accounts for this extra month of compounding on each deposit.',
      example: {
        scenario: 'You save $1,000 monthly for 5 years at an annual interest rate of 12%.',
        steps: [
          'PMT = $1,000, i = 0.12 / 12 = 0.01, n = 5 * 12 = 60',
          'Evaluate formula: $1,000 * [((1.01)^60 - 1) / 0.01] * (1.01)',
          'Accumulation factor: [ (1.8167 - 1) / 0.01 ] * 1.01 = 81.67 * 1.01 ≈ 82.486',
          'Solve final wealth: $1,000 * 82.486 = $82,486'
        ],
        result: 'Your total portfolio is valued at $82,486, consisting of $60,000 deposits and $22,486 in interest gains.'
      },
      limitations: ['Assumes regular, uninterrupted monthly contributions.', 'Returns are rarely completely constant in real mutual funds or index funds.']
    },
    faqs: [
      { question: 'What is a Systematic Investment Plan (SIP)?', answer: 'A SIP is a disciplined financial planning approach where you invest a fixed amount in index funds or mutual funds regularly, smoothing out market volatility via dollar-cost averaging.' }
    ],
    references: [
      { name: 'Bogleheads Methodology on Dollar Cost Averaging', url: 'https://www.bogleheads.org/wiki/Dollar_cost_averaging', description: 'How regular indexing structures compound wealth reliably over long horizons.' }
    ],
    relatedCalculators: ['compound-interest', 'investment-return', 'future-value'],
    relatedGuides: ['what-is-compound-interest']
  },

  // 4. CAGR Calculator
  {
    id: 'cagr-calculator',
    slug: 'cagr-calculator',
    name: 'CAGR Calculator',
    title: 'CAGR Calculator | Compound Annual Growth Rate',
    metaDescription: 'Calculate the Compound Annual Growth Rate (CAGR) of any stock, portfolio, or business venture. Quick and precise formula calculator.',
    shortDescription: 'Calculate the accurate annualized compound return rate of assets over a specific timeframe.',
    category: 'investing',
    inputs: [
      { id: 'initialValue', label: 'Initial Asset Value', type: 'number', defaultValue: 10000, min: 1, max: 100000000, prefix: '$' },
      { id: 'finalValue', label: 'Final Ending Value', type: 'number', defaultValue: 32000, min: 1, max: 100000000, prefix: '$' },
      { id: 'years', label: 'Time Period (Years)', type: 'number', defaultValue: 8, min: 0.1, max: 100, step: 0.5, suffix: 'yrs' }
    ],
    calculate: (inputs) => {
      const BV = Number(inputs.initialValue);
      const EV = Number(inputs.finalValue);
      const t = Number(inputs.years);

      // CAGR = (EV / BV)^(1/t) - 1
      const cagr = (Math.pow(EV / BV, 1 / t) - 1) * 100;

      // Generate visual scale representation of CAGR vs linear rate
      const chartData = [];
      for (let yr = 0; yr <= Math.ceil(t); yr++) {
        const currentYr = Math.min(yr, t);
        const cagrVal = BV * Math.pow(1 + cagr / 100, currentYr);
        const linearVal = BV + ((EV - BV) / t) * currentYr;
        chartData.push({
          label: `Yr ${yr}`,
          'Compounded Path': Math.round(cagrVal),
          'Linear Trendline': Math.round(linearVal)
        });
      }

      return {
        summary: [
          { label: 'Compound Annual Growth Rate', value: `${cagr.toFixed(2)}%`, rawValue: cagr, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'Total Absolute Return', value: `${(((EV - BV) / BV) * 100).toFixed(1)}%`, rawValue: ((EV - BV) / BV) * 100 },
          { label: 'Total Dollar Gain', value: `$${(EV - BV).toLocaleString()}`, rawValue: EV - BV }
        ],
        chartData,
        chartKeys: [
          { key: 'Compounded Path', color: '#10b981', label: 'Compounded Returns' },
          { key: 'Linear Trendline', color: '#94a3b8', label: 'Linear Path' }
        ],
        interpretation: `Your asset grew from $${BV.toLocaleString()} to $${EV.toLocaleString()} over ${t} years. This represents an annual compound growth rate (CAGR) of ${cagr.toFixed(2)}%.`
      };
    },
    formula: {
      equation: 'CAGR = (EV / BV)^(1/t) - 1',
      variables: [
        { name: 'CAGR', description: 'Compound Annual Growth Rate' },
        { name: 'EV', description: 'Ending Value of the asset' },
        { name: 'BV', description: 'Beginning / Initial value of the asset' },
        { name: 't', description: 'Time horizon in years' }
      ],
      explanation: 'CAGR represents the smoothed annualized rate of return at which an asset would have grown if it grew at a steady rate over the period, compounding annual yields.',
      example: {
        scenario: 'An investment begins at $5,000 and matures to $15,000 over 5 years.',
        steps: [
          'EV = $15,000, BV = $5,000, t = 5',
          'Divide EV/BV: 15,000 / 5,000 = 3',
          'Raise to 1/t power: 3^(1/5) = 3^0.2 ≈ 1.2457',
          'Subtract 1 to convert to decimal: 1.2457 - 1 = 0.2457'
        ],
        result: 'The CAGR is 24.57%.'
      },
      limitations: ['CAGR is a geometric smoothing metric; real market investments experience volatile up-and-down growth instead of linear trajectories.']
    },
    faqs: [
      { question: 'What does CAGR show us?', answer: 'CAGR provides a standardized, annualized return that allows you to easily compare assets with different volatility, timelines, or initial investments on an equal playing field.' }
    ],
    references: [
      { name: 'Investopedia - CAGR Formula Definition', url: 'https://www.investopedia.com/terms/c/cagr.asp', description: 'How compound annual metrics normalize irregular financial growth curves.' }
    ],
    relatedCalculators: ['investment-return', 'future-value', 'compound-interest'],
    relatedGuides: ['what-is-compound-interest']
  },

  // 5. Future Value Calculator
  {
    id: 'future-value',
    slug: 'future-value',
    name: 'Future Value Calculator',
    title: 'Future Value Calculator | MoneyMetricsHub',
    metaDescription: 'Find the future value (FV) of any asset or series of cash flows using our free formula-based calculator.',
    shortDescription: 'Calculate the value of an asset at a future date based on interest rates and compounding parameters.',
    category: 'investing',
    inputs: [
      { id: 'presentValue', label: 'Present Value (PV)', type: 'number', defaultValue: 5000, min: 0, max: 10000000, prefix: '$' },
      { id: 'rate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: 6.5, min: 0, max: 100, suffix: '%' },
      { id: 'years', label: 'Number of Periods (Years)', type: 'number', defaultValue: 10, min: 1, max: 100, suffix: 'yrs' }
    ],
    calculate: (inputs) => {
      const PV = Number(inputs.presentValue);
      const r = Number(inputs.rate) / 100;
      const t = Number(inputs.years);

      const fv = PV * Math.pow(1 + r, t);
      const chartData = [];

      for (let yr = 0; yr <= t; yr++) {
        chartData.push({
          label: `Yr ${yr}`,
          'Asset Value': Math.round(PV * Math.pow(1 + r, yr))
        });
      }

      return {
        summary: [
          { label: 'Future Value (FV)', value: `$${Math.round(fv).toLocaleString()}`, rawValue: fv, badgeColor: 'bg-blue-100 text-blue-800' },
          { label: 'Total Increase', value: `$${Math.round(fv - PV).toLocaleString()}`, rawValue: fv - PV },
          { label: 'Growth Ratio', value: `${(fv / PV).toFixed(2)}x`, rawValue: fv / PV }
        ],
        chartData,
        chartKeys: [{ key: 'Asset Value', color: '#3b82f6', label: 'Value Progression' }],
        interpretation: `A starting balance of $${PV.toLocaleString()} growing at a compound interest rate of ${inputs.rate}% will yield a Future Value of $${Math.round(fv).toLocaleString()} after ${t} years.`
      };
    },
    formula: {
      equation: 'FV = PV * (1 + r)^t',
      variables: [
        { name: 'FV', description: 'Future Value of cash' },
        { name: 'PV', description: 'Present Value (starting investment)' },
        { name: 'r', description: 'Annual interest rate' },
        { name: 't', description: 'Number of periods (years)' }
      ],
      explanation: 'Future Value calculates the compound growth value of a fixed sum of money over time, compounding return yields on top of previous totals.',
      example: {
        scenario: 'Calculate the future value of $1,000 at 5% interest over 3 years.',
        steps: [
          'PV = $1,000, r = 0.05, t = 3',
          'Evaluate formula: $1,000 * (1 + 0.05)^3',
          '1.05^3 = 1.1576',
          'Solve final FV: $1,000 * 1.1576 = $1,157.63'
        ],
        result: 'The Future Value is $1,157.63.'
      },
      limitations: ['Does not account for cash additions or periodic withdrawals.', 'Assumes interest rates remain stable over the entire timeline.']
    },
    faqs: [
      { question: 'Why is future value important?', answer: 'Future Value helps investors understand opportunity costs, plan specific future savings goals, and evaluate inflation effects on cash reserves.' }
    ],
    references: [
      { name: 'Federal Reserve - Time Value of Money Concepts', url: 'https://www.federalreserve.gov', description: 'Federal guidelines explaining interest dynamics and capital valuations.' }
    ],
    relatedCalculators: ['compound-interest', 'investment-return', 'cagr-calculator'],
    relatedGuides: ['what-is-compound-interest']
  },

  // 6. Mortgage Calculator
  {
    id: 'mortgage-calculator',
    slug: 'mortgage-calculator',
    name: 'Mortgage Calculator',
    title: 'Mortgage Calculator | MoneyMetricsHub',
    metaDescription: 'Estimate your monthly home mortgage payment including principal, interest, taxes, and homeowners insurance.',
    shortDescription: 'Calculate complete monthly house payments and analyze amortization schedules.',
    category: 'loans',
    inputs: [
      { id: 'homePrice', label: 'Home Purchase Price', type: 'number', defaultValue: 400000, min: 1000, max: 50000000, prefix: '$' },
      { id: 'downPayment', label: 'Down Payment', type: 'number', defaultValue: 80000, min: 0, max: 50000000, prefix: '$' },
      { id: 'rate', label: 'Loan Interest Rate (%)', type: 'number', defaultValue: 6.5, min: 0.1, max: 30, suffix: '%' },
      { id: 'term', label: 'Loan Term (Years)', type: 'number', defaultValue: 30, min: 5, max: 40, suffix: 'yrs' },
      { id: 'propertyTax', label: 'Annual Property Tax ($)', type: 'number', defaultValue: 4800, min: 0, max: 100000, prefix: '$' },
      { id: 'insurance', label: 'Annual Home Insurance ($)', type: 'number', defaultValue: 1200, min: 0, max: 50000, prefix: '$' }
    ],
    calculate: (inputs) => {
      const price = Number(inputs.homePrice);
      const down = Number(inputs.downPayment);
      const p = Math.max(0, price - down); // loan principal
      const r = (Number(inputs.rate) / 100) / 12; // monthly rate
      const n = Number(inputs.term) * 12; // months

      // M = P [ r(1+r)^n ] / [ (1+r)^n - 1 ]
      let monthlyPI = 0;
      if (r === 0) {
        monthlyPI = p / n;
      } else {
        monthlyPI = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      }

      const monthlyTax = Number(inputs.propertyTax) / 12;
      const monthlyIns = Number(inputs.insurance) / 12;
      const totalMonthly = monthlyPI + monthlyTax + monthlyIns;

      // Amortization details
      const chartData = [];
      let balance = p;
      let totalInterestPaid = 0;
      let totalPrincipalPaid = 0;

      for (let yr = 1; yr <= Number(inputs.term); yr++) {
        let yrInterest = 0;
        let yrPrincipal = 0;

        for (let m = 1; m <= 12; m++) {
          const interestPayment = balance * r;
          const principalPayment = monthlyPI - interestPayment;

          balance = Math.max(0, balance - principalPayment);
          yrInterest += interestPayment;
          yrPrincipal += principalPayment;
        }

        totalInterestPaid += yrInterest;
        totalPrincipalPaid += yrPrincipal;

        chartData.push({
          label: `Yr ${yr}`,
          'Remaining Balance': Math.round(balance),
          'Cumulative Interest': Math.round(totalInterestPaid),
          'Cumulative Principal': Math.round(totalPrincipalPaid)
        });
      }

      return {
        summary: [
          { label: 'Total Monthly Payment', value: `$${Math.round(totalMonthly).toLocaleString()}`, rawValue: totalMonthly, badgeColor: 'bg-blue-100 text-blue-800' },
          { label: 'Principal & Interest', value: `$${Math.round(monthlyPI).toLocaleString()}`, rawValue: monthlyPI },
          { label: 'Total Interest Paid', value: `$${Math.round(totalInterestPaid).toLocaleString()}`, rawValue: totalInterestPaid, badgeColor: 'bg-emerald-100 text-emerald-800' }
        ],
        chartData,
        chartKeys: [
          { key: 'Remaining Balance', color: '#ef4444', label: 'Loan Balance' },
          { key: 'Cumulative Interest', color: '#fbbf24', label: 'Interest Paid' }
        ],
        interpretation: `Your home purchase of $${price.toLocaleString()} with $${down.toLocaleString()} down leaves a mortgage loan balance of $${p.toLocaleString()}. Your total monthly payment will be $${Math.round(totalMonthly).toLocaleString()}, including principal, interest, taxes, and insurance.`
      };
    },
    formula: {
      equation: 'M = P * [ r(1+r)^n ] / [ (1+r)^n - 1 ]',
      variables: [
        { name: 'M', description: 'Monthly Principal and Interest payment' },
        { name: 'P', description: 'Loan principal amount (Purchase price - Down payment)' },
        { name: 'r', description: 'Monthly interest rate (Annual rate / 12)' },
        { name: 'n', description: 'Total number of payments (Months)' }
      ],
      explanation: 'This formula calculates the exact monthly payment needed to pay off a mortgage within a fixed term, where each payment covers the current monthly interest, and the remainder reduces the principal balance.',
      example: {
        scenario: 'A $300,000 mortgage loan on a 30-year fixed schedule at 6% annual interest.',
        steps: [
          'Principal (P) = $300,000, Monthly rate (r) = 0.06 / 12 = 0.005',
          'Total periods (n) = 30 * 12 = 360 months',
          'Plug in values: $300,000 * [0.005 * (1.005)^360] / [(1.005)^360 - 1]',
          '(1.005)^360 ≈ 6.02257',
          'Solve numerator: 0.005 * 6.02257 ≈ 0.03011',
          'Solve denominator: 6.02257 - 1 = 5.02257',
          'Solve final monthly PI: $300,000 * (0.03011 / 5.02257) ≈ $1,798.65'
        ],
        result: 'Monthly Principal & Interest payment is $1,798.65.'
      },
      limitations: ['Does not include fluctuating HOA fees, private mortgage insurance (PMI), or maintenance costs.', 'Assumes property taxes and insurance premiums stay constant.']
    },
    faqs: [
      { question: 'What is PMI?', answer: 'Private Mortgage Insurance (PMI) is an extra monthly fee required if your down payment is less than 20% of the home purchase price. It protects the lender from defaults.' },
      { question: 'Can I shorten my mortgage timeline?', answer: 'Yes. By paying extra towards the loan principal each month, you bypass front-loaded interest and reduce the term of your loan.' }
    ],
    references: [
      { name: 'Consumer Financial Protection Bureau (CFPB) Mortgage Guide', url: 'https://www.consumerfinance.gov/consumer-tools/mortgages/', description: 'Federal tools and guidelines for consumer home loans.' }
    ],
    relatedCalculators: ['loan-calculator', 'emi-calculator', 'auto-loan'],
    relatedGuides: ['mortgage-amortization-explained']
  },

  // 7. Loan Calculator
  {
    id: 'loan-calculator',
    slug: 'loan-calculator',
    name: 'Loan Calculator',
    title: 'Loan Calculator | MoneyMetricsHub',
    metaDescription: 'Determine monthly payments, total interest, and amortization schedule for any fixed-rate loan.',
    shortDescription: 'Calculate general loan parameters, monthly payment terms, and absolute interest cost profiles.',
    category: 'loans',
    inputs: [
      { id: 'amount', label: 'Loan Amount', type: 'number', defaultValue: 20000, min: 500, max: 10000000, prefix: '$' },
      { id: 'rate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: 7.5, min: 0.1, max: 50, suffix: '%' },
      { id: 'months', label: 'Loan Term (Months)', type: 'number', defaultValue: 60, min: 3, max: 360, suffix: 'mo' }
    ],
    calculate: (inputs) => {
      const p = Number(inputs.amount);
      const r = (Number(inputs.rate) / 100) / 12;
      const n = Number(inputs.months);

      let emi = 0;
      if (r === 0) {
        emi = p / n;
      } else {
        emi = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      }

      const totalPayable = emi * n;
      const totalInterest = totalPayable - p;

      const chartData = [];
      let balance = p;
      let interestAccum = 0;
      for (let i = 1; i <= n; i += Math.max(1, Math.round(n / 10))) {
        const index = Math.round(i);
        const factor = Math.pow(1 + r, index);
        const outstanding = p * (Math.pow(1 + r, n) - factor) / (Math.pow(1 + r, n) - 1);
        chartData.push({
          label: `Mo ${index}`,
          'Outstanding Balance': Math.round(Math.max(0, outstanding)),
          'Cumulative Payments': Math.round(emi * index)
        });
      }

      return {
        summary: [
          { label: 'Monthly Payment', value: `$${Math.round(emi).toLocaleString()}`, rawValue: emi, badgeColor: 'bg-blue-100 text-blue-800' },
          { label: 'Total Payable Amount', value: `$${Math.round(totalPayable).toLocaleString()}`, rawValue: totalPayable },
          { label: 'Total Interest Paid', value: `$${Math.round(totalInterest).toLocaleString()}`, rawValue: totalInterest, badgeColor: 'bg-emerald-100 text-emerald-800' }
        ],
        chartData,
        chartKeys: [
          { key: 'Outstanding Balance', color: '#ef4444', label: 'Outstanding Balance' },
          { key: 'Cumulative Payments', color: '#3b82f6', label: 'Paid Total' }
        ],
        interpretation: `For a loan of $${p.toLocaleString()} over ${n} months at ${inputs.rate}% annual interest, your monthly payment will be $${Math.round(emi).toLocaleString()}. You will pay a total of $${Math.round(totalInterest).toLocaleString()} in interest.`
      };
    },
    formula: {
      equation: 'EMI = P * [r(1+r)^n]/[(1+r)^n - 1]',
      variables: [
        { name: 'EMI', description: 'Equated Monthly Installment' },
        { name: 'P', description: 'Loan Principal Amount' },
        { name: 'r', description: 'Monthly Interest Rate (Annual Rate / 12)' },
        { name: 'n', description: 'Loan tenure in months' }
      ],
      explanation: 'Calculates the fixed monthly pay-down amount needed to zero out loan liabilities exactly on schedule, paying current period interest first and reducing principal balance with the leftover amount.',
      example: {
        scenario: 'A personal loan of $10,000 for 3 years (36 months) at 12% interest.',
        steps: [
          'P = $10,000, r = 0.12 / 12 = 0.01, n = 36',
          'EMI = $10,000 * [0.01 * (1.01)^36] / [(1.01)^36 - 1]',
          'EMI = $10,000 * [0.014307] / [0.430768] ≈ $332.14'
        ],
        result: 'Monthly payment will be $332.14.'
      },
      limitations: ['Does not include loan application fees, origination charges, or prepay processing costs.']
    },
    faqs: [
      { question: 'What is the difference between simple and amortizing loans?', answer: 'Simple loans calculate fixed interest charges up front. Amortizing loans compute interest monthly based on the outstanding balance, meaning early payments contain more interest charges.' }
    ],
    references: [
      { name: 'Federal Reserve Consumer Guides on Loans', url: 'https://www.federalreserve.gov', description: 'Federal guidelines explaining interest metrics.' }
    ],
    relatedCalculators: ['mortgage-calculator', 'emi-calculator', 'personal-loan'],
    relatedGuides: ['mortgage-amortization-explained']
  },

  // 8. EMI Calculator
  {
    id: 'emi-calculator',
    slug: 'emi-calculator',
    name: 'EMI Calculator',
    title: 'EMI Calculator | Equated Monthly Installment',
    metaDescription: 'Calculate Equated Monthly Installments (EMI) easily for home, auto, or personal loans. View interactive repayment breakdown.',
    shortDescription: 'Calculate periodic Equated Monthly Installments (EMI) across home or auto loan tenures.',
    category: 'loans',
    inputs: [
      { id: 'loanAmount', label: 'Loan Amount', type: 'number', defaultValue: 50000, min: 1000, max: 10000000, prefix: '$' },
      { id: 'rate', label: 'Interest Rate (%)', type: 'number', defaultValue: 8.5, min: 1, max: 30, suffix: '%' },
      { id: 'tenure', label: 'Tenure (Years)', type: 'number', defaultValue: 5, min: 1, max: 30, suffix: 'yrs' }
    ],
    calculate: (inputs) => {
      const p = Number(inputs.loanAmount);
      const r = (Number(inputs.rate) / 100) / 12;
      const n = Number(inputs.tenure) * 12;

      let emi = 0;
      if (r === 0) {
        emi = p / n;
      } else {
        emi = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      }

      const totalPayable = emi * n;
      const totalInterest = totalPayable - p;

      const chartData = [
        { name: 'Principal Loan Amount', value: p },
        { name: 'Total Interest Charge', value: Math.round(totalInterest) }
      ];

      return {
        summary: [
          { label: 'Monthly EMI', value: `$${Math.round(emi).toLocaleString()}`, rawValue: emi, badgeColor: 'bg-blue-100 text-blue-800' },
          { label: 'Total Interest Payable', value: `$${Math.round(totalInterest).toLocaleString()}`, rawValue: totalInterest, badgeColor: 'bg-amber-100 text-amber-800' },
          { label: 'Total Principal + Interest', value: `$${Math.round(totalPayable).toLocaleString()}`, rawValue: totalPayable }
        ],
        chartData, // pie chart friendly
        chartKeys: [
          { key: 'value', color: '#3b82f6', label: 'Amount' }
        ],
        interpretation: `For a loan value of $${p.toLocaleString()} over ${inputs.tenure} years, your calculated Equated Monthly Installment (EMI) will be $${Math.round(emi).toLocaleString()}. This splits into $${p.toLocaleString()} principal and $${Math.round(totalInterest).toLocaleString()} interest charges.`
      };
    },
    formula: {
      equation: 'EMI = P * [r(1+r)^n]/[(1+r)^n - 1]',
      variables: [
        { name: 'EMI', description: 'Equated Monthly Installment' },
        { name: 'P', description: 'Loan Principal Amount' },
        { name: 'r', description: 'Monthly interest rate (decimal annual / 12)' },
        { name: 'n', description: 'Total payments (months)' }
      ],
      explanation: 'EMI utilizes amortization math to ensure all payments remain uniform, shifting the payment weight from interest to principal.',
      example: {
        scenario: 'You borrow $50,000 for 5 years at an 8.5% annual interest rate.',
        steps: [
          'P = $50,000, r = 0.085 / 12 = 0.007083, n = 5 * 12 = 60 months',
          'Calculate EMI: $50,000 * [0.007083 * (1.007083)^60] / [(1.007083)^60 - 1]',
          'Solve brackets: 0.007083 * 1.5273 / 0.5273 ≈ 0.020516',
          'Solve EMI: $50,000 * 0.020516 ≈ $1,025.83'
        ],
        result: 'Monthly EMI payment is $1,025.83.'
      },
      limitations: ['Does not account for prepayment penalty fee constraints, late payment penalties, or adjustable interest triggers.']
    },
    faqs: [
      { question: 'What is EMI?', answer: 'An Equated Monthly Installment (EMI) is a fixed payment amount made by a borrower to a lender at a specified date each calendar month.' }
    ],
    references: [
      { name: 'Investopedia - Equated Monthly Installment', url: 'https://www.investopedia.com/terms/e/equated_monthly_installment.asp', description: 'Standard definition of EMI.' }
    ],
    relatedCalculators: ['loan-calculator', 'mortgage-calculator', 'auto-loan'],
    relatedGuides: ['mortgage-amortization-explained']
  },

  // 9. Auto Loan Calculator
  {
    id: 'auto-loan',
    slug: 'auto-loan',
    name: 'Auto Loan Calculator',
    title: 'Auto Loan Calculator | Car Financing Options',
    metaDescription: 'Model your car loan terms easily. Calculate monthly payments, sales tax impacts, trade-in valuations, and total costs.',
    shortDescription: 'Calculate car loan parameters, trade-in value deductions, and vehicle sales tax burdens.',
    category: 'loans',
    inputs: [
      { id: 'price', label: 'Vehicle Purchase Price', type: 'number', defaultValue: 30000, min: 1000, max: 1000000, prefix: '$' },
      { id: 'downPayment', label: 'Down Payment', type: 'number', defaultValue: 5000, min: 0, max: 1000000, prefix: '$' },
      { id: 'tradeIn', label: 'Trade-In Allowance Value', type: 'number', defaultValue: 2000, min: 0, max: 1000000, prefix: '$' },
      { id: 'rate', label: 'Interest Rate (APR %)', type: 'number', defaultValue: 5.5, min: 0.1, max: 30, suffix: '%' },
      { id: 'term', label: 'Loan Term (Months)', type: 'number', defaultValue: 60, min: 12, max: 84, step: 12, suffix: 'mo' },
      { id: 'salesTax', label: 'Sales Tax Rate (%)', type: 'number', defaultValue: 7, min: 0, max: 25, suffix: '%' }
    ],
    calculate: (inputs) => {
      const price = Number(inputs.price);
      const down = Number(inputs.downPayment);
      const trade = Number(inputs.tradeIn);
      const apr = Number(inputs.rate);
      const months = Number(inputs.term);
      const taxRate = Number(inputs.salesTax) / 100;

      const salesTaxAmount = price * taxRate;
      const principalLoan = Math.max(0, price + salesTaxAmount - down - trade);
      const r = (apr / 100) / 12;

      let monthly = 0;
      if (r === 0) {
        monthly = principalLoan / months;
      } else {
        monthly = principalLoan * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
      }

      const totalCost = monthly * months + down + trade - trade; // cash out of pocket + trade in
      const totalInterest = (monthly * months) - principalLoan;

      const chartData = [
        { name: 'Car Loan Balance', value: principalLoan },
        { name: 'Down Payment', value: down },
        { name: 'Vehicle Tax', value: Math.round(salesTaxAmount) }
      ];

      return {
        summary: [
          { label: 'Monthly Car Payment', value: `$${Math.round(monthly).toLocaleString()}`, rawValue: monthly, badgeColor: 'bg-blue-100 text-blue-800' },
          { label: 'Amount Financed', value: `$${Math.round(principalLoan).toLocaleString()}`, rawValue: principalLoan },
          { label: 'Total Interest Charge', value: `$${Math.round(totalInterest).toLocaleString()}`, rawValue: totalInterest, badgeColor: 'bg-emerald-100 text-emerald-800' }
        ],
        chartData,
        chartKeys: [{ key: 'value', color: '#10b981', label: 'Vehicle Budget Split' }],
        interpretation: `For a vehicle priced at $${price.toLocaleString()} after accounting for a ${inputs.salesTax}% tax rate, down payment of $${down.toLocaleString()}, and trade-in of $${trade.toLocaleString()}, your financed balance is $${Math.round(principalLoan).toLocaleString()}. Over ${months} months at ${apr}% APR, your monthly payment is $${Math.round(monthly).toLocaleString()}.`
      };
    },
    formula: {
      equation: 'Loan Principal = Price + Tax - DownPayment - TradeIn',
      variables: [
        { name: 'Price', description: 'Original car sticker price' },
        { name: 'Tax', description: 'Sticker Price * Sales Tax Rate' },
        { name: 'DownPayment', description: 'Up-front cash contribution' },
        { name: 'TradeIn', description: 'Agreed trade-in value of old car' }
      ],
      explanation: 'Vehicle tax is added up front to the sticker price, and cash contributions or trade-ins are subtracted. This final principal is then amortized standardly.',
      example: {
        scenario: 'A $30,000 vehicle with a 7% sales tax, $5,000 down, and $2,000 trade-in.',
        steps: [
          'Vehicle purchase tax = $30,000 * 0.07 = $2,100',
          'Calculate loan principal: $30,000 + $2,100 - $5,000 - $2,000 = $25,100'
        ],
        result: 'The final loan amount to be financed is $25,100.'
      },
      limitations: ['Does not include dealer preparation fees, document processing fees, DMV registrations, or car insurance bills.']
    },
    faqs: [
      { question: 'Can I finance taxes and registration?', answer: 'Yes. Most lenders allow buyers to roll vehicle sales tax, title charges, and dealer fees directly into the auto loan, though this increases interest costs.' }
    ],
    references: [
      { name: 'Federal Trade Commission - Auto Loan Guide', url: 'https://consumer.ftc.gov', description: 'Consumer advice regarding vehicle loans.' }
    ],
    relatedCalculators: ['loan-calculator', 'emi-calculator', 'personal-loan'],
    relatedGuides: ['mortgage-amortization-explained']
  },

  // 10. Personal Loan Calculator
  {
    id: 'personal-loan',
    slug: 'personal-loan',
    name: 'Personal Loan Calculator',
    title: 'Personal Loan Calculator | MoneyMetricsHub',
    metaDescription: 'Find your monthly payments and total interest for unsecured personal loans. Account for common lender origination fees.',
    shortDescription: 'Calculate unsecured personal loan structures, factoring in upfront origination fee deductions.',
    category: 'loans',
    inputs: [
      { id: 'amount', label: 'Requested Loan Amount', type: 'number', defaultValue: 10000, min: 500, max: 250000, prefix: '$' },
      { id: 'rate', label: 'APR (%)', type: 'number', defaultValue: 11.5, min: 1, max: 36, suffix: '%' },
      { id: 'years', label: 'Loan Term (Years)', type: 'number', defaultValue: 3, min: 1, max: 10, suffix: 'yrs' },
      { id: 'origination', label: 'Origination Fee (%)', type: 'number', defaultValue: 3, min: 0, max: 10, suffix: '%' }
    ],
    calculate: (inputs) => {
      const amount = Number(inputs.amount);
      const apr = Number(inputs.rate);
      const years = Number(inputs.years);
      const feePercent = Number(inputs.origination);

      const originationFee = amount * (feePercent / 100);
      const netDisbursed = amount - originationFee;

      const r = (apr / 100) / 12;
      const n = years * 12;

      let monthly = 0;
      if (r === 0) {
        monthly = amount / n;
      } else {
        monthly = amount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      }

      const totalRepaid = monthly * n;
      const totalInterest = totalRepaid - amount;

      const chartData = [
        { name: 'Received Funds', value: Math.round(netDisbursed) },
        { name: 'Origination Fee', value: Math.round(originationFee) },
        { name: 'Total Interest Charge', value: Math.round(totalInterest) }
      ];

      return {
        summary: [
          { label: 'Monthly Payment', value: `$${Math.round(monthly).toLocaleString()}`, rawValue: monthly, badgeColor: 'bg-blue-100 text-blue-800' },
          { label: 'Net Disbursed Funds', value: `$${Math.round(netDisbursed).toLocaleString()}`, rawValue: netDisbursed, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'Total Fee + Interest Paid', value: `$${Math.round(totalInterest + originationFee).toLocaleString()}`, rawValue: totalInterest + originationFee }
        ],
        chartData,
        chartKeys: [{ key: 'value', color: '#3b82f6', label: 'Loan Cost Breakdown' }],
        interpretation: `By requesting a $${amount.toLocaleString()} personal loan with a ${feePercent}% origination fee, your lender will deduct $${Math.round(originationFee).toLocaleString()} up front, disbursing $${Math.round(netDisbursed).toLocaleString()} in cash. Over ${years} years at ${apr}% APR, you will pay $${Math.round(monthly).toLocaleString()} monthly.`
      };
    },
    formula: {
      equation: 'Net Disbursed = Loan Requested * (1 - OriginationFeePercent)',
      variables: [
        { name: 'Loan Requested', description: 'Total requested financing principal' },
        { name: 'OriginationFeePercent', description: 'Lender fee deducted up front (decimal)' }
      ],
      explanation: 'Standard interest is computed based on the full requested loan amount, but lenders usually deduct an upfront origination fee, meaning you pay interest on money you never actually receive.',
      example: {
        scenario: 'A personal loan of $10,000 with a 5% origination fee.',
        steps: [
          'Calculate fee: $10,000 * 0.05 = $500',
          'Calculate net payout: $10,000 - $500 = $9,500'
        ],
        result: 'You receive $9,500 cash, but pay monthly interest calculated on the full $10,000.'
      },
      limitations: ['Does not account for prepayment penalties, late fees, or autopay discounts offered by some credit unions.']
    },
    faqs: [
      { question: 'What is a personal loan origination fee?', answer: 'A charge by lenders to cover processing and administrative costs, ranging from 1% to 10% of the loan amount and typically deducted from the funds you receive.' }
    ],
    references: [
      { name: 'CFPB Personal Loan Guidelines', url: 'https://www.consumerfinance.gov', description: 'Guides for secured and unsecured consumer loans.' }
    ],
    relatedCalculators: ['loan-calculator', 'emi-calculator', 'auto-loan'],
    relatedGuides: ['mortgage-amortization-explained']
  },

  // 11. Retirement Calculator
  {
    id: 'retirement-calculator',
    slug: 'retirement-calculator',
    name: 'Retirement Calculator',
    title: 'Retirement Calculator | MoneyMetricsHub',
    metaDescription: 'See if your retirement savings are on track. Estimate your future nest egg size, required wealth targets, and safe annual withdrawals.',
    shortDescription: 'Plan your retirement timeline, nest egg growth, and safe annual withdrawal capabilities.',
    category: 'retirement',
    inputs: [
      { id: 'age', label: 'Current Age', type: 'number', defaultValue: 30, min: 18, max: 100, suffix: 'yrs' },
      { id: 'retirementAge', label: 'Desired Retirement Age', type: 'number', defaultValue: 65, min: 30, max: 100, suffix: 'yrs' },
      { id: 'netWorth', label: 'Current Nest Egg Savings', type: 'number', defaultValue: 50000, min: 0, max: 10000000, prefix: '$' },
      { id: 'monthly', label: 'Monthly Contributions', type: 'number', defaultValue: 800, min: 0, max: 100000, prefix: '$' },
      { id: 'returnRate', label: 'Annual Investment Return (%)', type: 'number', defaultValue: 8, min: 1, max: 20, suffix: '%' },
      { id: 'spending', label: 'Expected Monthly Spend ($ Today)', type: 'number', defaultValue: 5000, min: 500, max: 100000, prefix: '$' }
    ],
    calculate: (inputs) => {
      const age = Number(inputs.age);
      const retAge = Number(inputs.retirementAge);
      const P = Number(inputs.netWorth);
      const PMT = Number(inputs.monthly);
      const r = Number(inputs.returnRate) / 100;
      const monthlySpend = Number(inputs.spending);

      const yearsToGrow = Math.max(1, retAge - age);
      const n = 12;

      // Compounding future value
      let fv = P * Math.pow(1 + r / n, yearsToGrow * n);
      let annuity = PMT * ((Math.pow(1 + r / n, yearsToGrow * n) - 1) / (r / n));
      const endingBalance = fv + annuity;

      // Annualized spend target in retirement (multiplied by 25 for safe withdrawal target)
      const annualSpending = monthlySpend * 12;
      const targetNestEgg = annualSpending * 25; // standard 4% multiplier

      const chartData = [];
      let balance = P;
      for (let yr = 1; yr <= yearsToGrow; yr++) {
        balance = balance * (1 + r) + PMT * 12;
        chartData.push({
          label: `Age ${age + yr}`,
          'Retirement Savings': Math.round(balance),
          'Target Nest Egg': Math.round(targetNestEgg)
        });
      }

      const surplus = endingBalance - targetNestEgg;

      return {
        summary: [
          { label: 'Projected Nest Egg', value: `$${Math.round(endingBalance).toLocaleString()}`, rawValue: endingBalance, badgeColor: 'bg-blue-100 text-blue-800' },
          { label: 'Required Target', value: `$${Math.round(targetNestEgg).toLocaleString()}`, rawValue: targetNestEgg },
          { label: 'Surplus / (Deficit)', value: `$${Math.round(surplus).toLocaleString()}`, rawValue: surplus, badgeColor: surplus >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800' }
        ],
        chartData,
        chartKeys: [
          { key: 'Retirement Savings', color: '#10b981', label: 'My Nest Egg Progression' },
          { key: 'Target Nest Egg', color: '#ef4444', label: 'Required Target' }
        ],
        interpretation: surplus >= 0
          ? `Outstanding! At age ${retAge}, your nest egg is projected to reach $${Math.round(endingBalance).toLocaleString()}, which is $${Math.round(surplus).toLocaleString()} above your target. You are fully on track to support a $${monthlySpend.toLocaleString()}/month lifestyle.`
          : `You have a projected deficit of $${Math.round(Math.abs(surplus)).toLocaleString()} at age ${retAge}. To bridge this gap, consider increasing your monthly contributions by $${Math.round((Math.abs(surplus) * (r / 12)) / (Math.pow(1 + r / 12, yearsToGrow * 12) - 1)).toLocaleString()}/month.`
      };
    },
    formula: {
      equation: 'Target Nest Egg = Annual Retirement Spending * 25',
      variables: [
        { name: 'Annual Retirement Spending', description: 'Desired retirement cash outlays (adjusted back for inflation)' },
        { name: 'Target Nest Egg', description: 'Required accumulated funds based on the 4% Safe Withdrawal Rule' }
      ],
      explanation: 'Uses standard ordinary compound annuity metrics to compute what your savings will build to, then compares this total with a target retirement capital base calculated by scaling annual living expenditures by 25 (the reciprocal of the 4% rule).',
      example: {
        scenario: 'A 30-year-old with $50,000 saved, investing $1,000/month, wanting to spend $5,000/month starting at age 60 (30 years of growth) with 8% compound returns.',
        steps: [
          'Calculate compound principal over 30 years: $50,000 * (1.08)^30 = $503,132',
          'Calculate annuity growth: $1,000 * 12 * [((1.08)^30 - 1) / 0.08] ≈ $1,360,301',
          'Projected Nest Egg = $503,132 + $1,360,301 = $1,863,433',
          'Target Nest Egg for $5k monthly spending ($60,000/yr) = $60,000 * 25 = $1,500,000'
        ],
        result: 'The user has a projected surplus of $363,433 above their retirement target.'
      },
      limitations: ['Does not incorporate tax drag (tax-deductible vs. taxable brokerages) or Social Security benefits.', 'Investment returns are modeled as constant, but real markets experience fluctuating yearly cycles.']
    },
    faqs: [
      { question: 'What is the safe withdrawal rate?', answer: 'The percentage of your portfolio you can withdraw in your first year of retirement (and adjust for inflation each subsequent year) without running out of money over a 30-year horizon.' }
    ],
    references: [
      { name: 'The Trinity Study - Safe Withdrawal Rates', url: 'https://www.bogleheads.org/wiki/Trinity_study_update', description: 'The landmark academic research analyzing portfolio longevity across historical US market conditions.' }
    ],
    relatedCalculators: ['fire-calculator', 'four-percent-rule', 'retirement-savings'],
    relatedGuides: ['what-is-fire', 'how-much-to-save-for-retirement']
  },

  // 12. FIRE Calculator
  {
    id: 'fire-calculator',
    slug: 'fire-calculator',
    name: 'FIRE Calculator',
    title: 'FIRE Calculator | Financial Independence Retire Early',
    metaDescription: 'Find your FIRE (Financial Independence, Retire Early) target number and determine how many years you are from retirement.',
    shortDescription: 'Calculate your FIRE number and map out your estimated timeline to financial independence.',
    category: 'retirement',
    inputs: [
      { id: 'expenses', label: 'Annual Living Expenses ($)', type: 'number', defaultValue: 50000, min: 1000, max: 1000000, prefix: '$' },
      { id: 'netWorth', label: 'Current Net Worth', type: 'number', defaultValue: 100000, min: 0, max: 100000000, prefix: '$' },
      { id: 'savings', label: 'Annual Savings Contribution', type: 'number', defaultValue: 25000, min: 0, max: 1000000, prefix: '$' },
      { id: 'rate', label: 'Expected Investment Return (%)', type: 'number', defaultValue: 7, min: 1, max: 20, suffix: '%' },
      { id: 'withdrawal', label: 'Safe Withdrawal Rate (%)', type: 'number', defaultValue: 4, min: 2, max: 8, step: 0.1, suffix: '%' }
    ],
    calculate: (inputs) => {
      const expenses = Number(inputs.expenses);
      const nw = Number(inputs.netWorth);
      const savings = Number(inputs.savings);
      const returnRate = Number(inputs.rate) / 100;
      const swr = Number(inputs.withdrawal) / 100;

      // FIRE Number = Expenses / swr
      const fireNumber = expenses / swr;

      // Years to FIRE
      // Math: NW_t = NW_0 * (1+r)^t + PMT * [((1+r)^t - 1) / r] = FIRE_Number
      // Solve for t iteratively for high precision
      let yearsToFire = 0;
      let currentNW = nw;
      const maxYears = 100;
      const chartData = [];

      chartData.push({
        label: 'Yr 0',
        'Net Worth': Math.round(currentNW),
        'FIRE Target': Math.round(fireNumber)
      });

      if (currentNW >= fireNumber) {
        yearsToFire = 0;
      } else {
        while (currentNW < fireNumber && yearsToFire < maxYears) {
          yearsToFire++;
          currentNW = currentNW * (1 + returnRate) + savings;
          chartData.push({
            label: `Yr ${yearsToFire}`,
            'Net Worth': Math.round(currentNW),
            'FIRE Target': Math.round(fireNumber)
          });
        }
      }

      return {
        summary: [
          { label: 'Your FIRE Number', value: `$${Math.round(fireNumber).toLocaleString()}`, rawValue: fireNumber, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'Years to Achieve FIRE', value: `${yearsToFire >= maxYears ? '100+' : yearsToFire} Years`, rawValue: yearsToFire },
          { label: 'Current Progress', value: `${Math.min(100, (nw / fireNumber) * 100).toFixed(1)}%`, rawValue: (nw / fireNumber) * 100 }
        ],
        chartData: chartData.filter((_, i) => yearsToFire > 20 ? i % Math.ceil(yearsToFire / 15) === 0 || i === yearsToFire : true),
        chartKeys: [
          { key: 'Net Worth', color: '#10b981', label: 'Net Worth Progression' },
          { key: 'FIRE Target', color: '#ef4444', label: 'FIRE Target' }
        ],
        interpretation: nw >= fireNumber
          ? 'Amazing! Your current Net Worth exceeds your FIRE target. You are already financially independent.'
          : `At your current savings rate of $${savings.toLocaleString()}/yr and an expected annual return of ${inputs.rate}%, you will achieve financial independence in approximately ${yearsToFire} years, growing your net worth from $${nw.toLocaleString()} to $${Math.round(fireNumber).toLocaleString()}.`
      };
    },
    formula: {
      equation: 'FIRE Number = Annual Expenses / Safe Withdrawal Rate',
      variables: [
        { name: 'FIRE Number', description: 'Required retirement fund' },
        { name: 'Annual Expenses', description: 'Desired yearly retirement living costs' },
        { name: 'Safe Withdrawal Rate', description: 'Target payout percentage (commonly 4%)' }
      ],
      explanation: 'Divides your target retirement expenses by your safe withdrawal percentage to find the exact net worth required to sustain those outlays indefinitely.',
      example: {
        scenario: 'Your annual living cost is $40,000, and you plan for a 4% withdrawal rate.',
        steps: [
          'Expenses = $40,000, SWR = 0.04',
          'FIRE Target = $40,000 / 0.04 = $1,000,000'
        ],
        result: 'Your target portfolio size to achieve FIRE is $1,000,000.'
      },
      limitations: ['Assuming a constant investment return rate does not model real-world market volatility.', 'Does not account for changes in tax brackets or medical expenses in later life stages.']
    },
    faqs: [
      { question: 'What is SWR?', answer: 'Safe Withdrawal Rate (SWR) is the percentage of your total retirement nest egg you can withdraw in your first year of retirement (and adjust for inflation subsequent years) without running out of money.' }
    ],
    references: [
      { name: 'The Bogleheads Wiki on FIRE', url: 'https://www.bogleheads.org/wiki/Financial_Independence,_Retire_Early', description: 'Community resource detailing early retirement calculations.' }
    ],
    relatedCalculators: ['retirement-calculator', 'four-percent-rule', 'retirement-savings'],
    relatedGuides: ['what-is-fire', 'how-much-to-save-for-retirement']
  },

  // 13. 4 Percent Rule Calculator
  {
    id: 'four-percent-rule',
    slug: 'four-percent-rule',
    name: '4 Percent Rule Calculator',
    title: '4 Percent Rule Calculator | Portfolio Longevity',
    metaDescription: 'Test your retirement safety margin using the industry standard 4% Rule. Calculate first-year cash payouts and inflation-adjusted withdrawals.',
    shortDescription: 'Calculate first-year payouts and model the durability of your portfolio over time.',
    category: 'retirement',
    inputs: [
      { id: 'portfolio', label: 'Portfolio Size ($)', type: 'number', defaultValue: 1000000, min: 10000, max: 100000000, prefix: '$' },
      { id: 'withdrawal', label: 'Initial Withdrawal Rate (%)', type: 'number', defaultValue: 4, min: 1, max: 10, step: 0.1, suffix: '%' },
      { id: 'inflation', label: 'Average Inflation Rate (%)', type: 'number', defaultValue: 2.5, min: 0, max: 15, suffix: '%' },
      { id: 'years', label: 'Retirement Horizon (Years)', type: 'number', defaultValue: 30, min: 10, max: 60, suffix: 'yrs' }
    ],
    calculate: (inputs) => {
      const balance = Number(inputs.portfolio);
      const wr = Number(inputs.withdrawal) / 100;
      const inf = Number(inputs.inflation) / 100;
      const years = Number(inputs.years);

      const firstYearPayout = balance * wr;
      const chartData = [];
      
      let runningBalance = balance;
      let currentPayout = firstYearPayout;
      let isDepleted = false;
      let depletionYear = 0;

      // Simple market model assuming standard 7.5% nominal return rate
      const marketReturn = 0.075;

      for (let yr = 0; yr <= years; yr++) {
        chartData.push({
          label: `Yr ${yr}`,
          'Portfolio Value': Math.round(runningBalance),
          'Annual Withdrawal': Math.round(currentPayout)
        });

        if (runningBalance <= 0) {
          if (!isDepleted) {
            isDepleted = true;
            depletionYear = yr;
          }
          runningBalance = 0;
        } else {
          // deduct withdrawal at start of year
          runningBalance -= currentPayout;
          // grow remaining portfolio over year
          runningBalance = Math.max(0, runningBalance * (1 + marketReturn));
          // adjust next payout for inflation
          currentPayout *= (1 + inf);
        }
      }

      return {
        summary: [
          { label: 'First Year Payout', value: `$${Math.round(firstYearPayout).toLocaleString()}`, rawValue: firstYearPayout, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'Remaining Balance (Yr 30)', value: `$${Math.round(runningBalance).toLocaleString()}`, rawValue: runningBalance },
          { label: 'Portfolio Status', value: isDepleted ? `Depleted in Yr ${depletionYear}` : 'Fully Intact', valueColor: isDepleted ? 'text-rose-600' : 'text-emerald-600' }
        ],
        chartData,
        chartKeys: [
          { key: 'Portfolio Value', color: '#10b981', label: 'Projected Value' },
          { key: 'Annual Withdrawal', color: '#ef4444', label: 'Inflation-Adjusted Payout' }
        ],
        interpretation: isDepleted
          ? `Warning: Using a ${inputs.withdrawal}% withdrawal rate, your portfolio is projected to be depleted in Year ${depletionYear} under a 7.5% nominal return and ${inputs.inflation}% inflation rate.`
          : `At a ${inputs.withdrawal}% starting withdrawal rate, your initial annual payout is $${Math.round(firstYearPayout).toLocaleString()}. Under a standard 7.5% nominal market return, your portfolio is projected to end the 30-year horizon at $${Math.round(runningBalance).toLocaleString()} in cash.`
      };
    },
    formula: {
      equation: 'Withdrawal_t = PortfolioSize * InitialRate * (1 + Inflation)^t',
      variables: [
        { name: 'PortfolioSize', description: 'Total starting retirement portfolio balance' },
        { name: 'InitialRate', description: 'Starting safe withdrawal percentage (commonly 4%)' },
        { name: 'Inflation', description: 'Yearly rate of inflation (decimal)' },
        { name: 't', description: 'Current retirement year index' }
      ],
      explanation: 'Calculates the first-year payout by multiplying your initial portfolio size by your starting withdrawal percentage. In each subsequent year, the payout amount is increased by the rate of inflation, regardless of market performance, to preserve purchasing power.',
      example: {
        scenario: 'A $1,000,000 portfolio at a 4% starting withdrawal rate and 3% average inflation.',
        steps: [
          'Year 1 Payout: $1,000,000 * 0.04 = $40,000',
          'Year 2 Payout (with 3% inflation): $40,000 * 1.03 = $41,200',
          'Year 3 Payout: $41,200 * 1.03 = $42,436'
        ],
        result: 'You maintain equivalent purchasing power by adjusting payments upward each year.'
      },
      limitations: ['Does not account for "Sequence of Returns Risk" (early market drops during your first retirement years), which can drastically impact portfolio longevity.']
    },
    faqs: [
      { question: 'What is Sequence of Returns Risk?', answer: 'The risk that market downturns occur in the early years of retirement. Withdrawing funds from a declining portfolio accelerates depletion, meaning actual outcomes can be worse than average market projections.' }
    ],
    references: [
      { name: 'The Trinity Study Original Paper (1998)', url: 'https://www.bogleheads.org', description: 'Academic paper establishing safe withdrawal rate thresholds for retirement planning.' }
    ],
    relatedCalculators: ['retirement-calculator', 'fire-calculator', 'retirement-savings'],
    relatedGuides: ['what-is-fire', 'how-much-to-save-for-retirement']
  },

  // 14. Retirement Savings Calculator
  {
    id: 'retirement-savings',
    slug: 'retirement-savings',
    name: 'Retirement Savings Calculator',
    title: 'Retirement Savings Calculator | MoneyMetricsHub',
    metaDescription: 'Model your future retirement nest egg size using salary projections, savings rate percentages, and expected compound growth rates.',
    shortDescription: 'Calculate retirement savings based on annual salary, savings rate, and portfolio return assumptions.',
    category: 'retirement',
    inputs: [
      { id: 'age', label: 'Current Age', type: 'number', defaultValue: 25, min: 18, max: 100, suffix: 'yrs' },
      { id: 'income', label: 'Current Annual Salary', type: 'number', defaultValue: 75000, min: 1000, max: 2000000, prefix: '$' },
      { id: 'savingsRate', label: 'Savings Rate (%)', type: 'number', defaultValue: 15, min: 0, max: 90, suffix: '%' },
      { id: 'balance', label: 'Current Retirement Savings', type: 'number', defaultValue: 10000, min: 0, max: 5000000, prefix: '$' },
      { id: 'rate', label: 'Annual Growth Rate (%)', type: 'number', defaultValue: 8, min: 1, max: 20, suffix: '%' }
    ],
    calculate: (inputs) => {
      const age = Number(inputs.age);
      const income = Number(inputs.income);
      const sRate = Number(inputs.savingsRate) / 100;
      const initial = Number(inputs.balance);
      const r = Number(inputs.rate) / 100;

      const yearsToGrow = Math.max(1, 67 - age); // target retirement milestone age 67
      const yearlyContribution = income * sRate;

      let balance = initial;
      const chartData = [];

      for (let yr = 1; yr <= yearsToGrow; yr++) {
        balance = balance * (1 + r) + yearlyContribution;
        chartData.push({
          label: `Age ${age + yr}`,
          'Nest Egg': Math.round(balance)
        });
      }

      return {
        summary: [
          { label: 'Projected Nest Egg (Age 67)', value: `$${Math.round(balance).toLocaleString()}`, rawValue: balance, badgeColor: 'bg-blue-100 text-blue-800' },
          { label: 'Yearly Contribution', value: `$${Math.round(yearlyContribution).toLocaleString()}`, rawValue: yearlyContribution },
          { label: 'Total Contributions Paid', value: `$${Math.round(initial + (yearlyContribution * yearsToGrow)).toLocaleString()}`, rawValue: initial + (yearlyContribution * yearsToGrow) }
        ],
        chartData,
        chartKeys: [{ key: 'Nest Egg', color: '#10b981', label: 'Portfolio Progression' }],
        interpretation: `By saving ${inputs.savingsRate}% of your $${income.toLocaleString()} salary ($${Math.round(yearlyContribution).toLocaleString()}/year) with a starting nest egg of $${initial.toLocaleString()}, your portfolio will grow to $${Math.round(balance).toLocaleString()} by age 67 under an 8% compounding return rate.`
      };
    },
    formula: {
      equation: 'Yearly Contribution = Annual Salary * SavingsRatePercent',
      variables: [
        { name: 'Annual Salary', description: 'Your current gross yearly income' },
        { name: 'SavingsRatePercent', description: 'The percentage of your salary saved for retirement (decimal)' }
      ],
      explanation: 'Determines the yearly cash flows saved based on your savings rate, and compounds that series alongside your initial retirement balance up to the age-67 retirement milestone.',
      example: {
        scenario: 'A 25-year-old earning $50,000, saving 10% ($5,000/year) with a $5,000 initial balance, growing at 8% compound interest for 42 years (to age 67).',
        steps: [
          'Yearly contribution = $50,000 * 0.10 = $5,000',
          'Compound initial balance over 42 years: $5,000 * (1.08)^42 ≈ $126,675',
          'Annuity accumulation of $5,000/yr: $5,000 * [((1.08)^42 - 1) / 0.08] ≈ $1,520,892',
          'Add both values: $126,675 + $1,520,892 ≈ $1,647,567'
        ],
        result: 'Retirement balance at age 67 is $1,647,567.'
      },
      limitations: ['Does not account for salary increases, employer matches, or tax bracket changes.']
    },
    faqs: [
      { question: 'What is a good retirement savings rate?', answer: 'Many financial professionals recommend saving at least 15% of your gross income starting in your 20s to successfully fund a comfortable retirement.' }
    ],
    references: [
      { name: 'Fidelity Retirement Milestone Benchmarks', url: 'https://www.fidelity.com', description: 'Fidelity benchmarks detailing age-based salary saving guidelines.' }
    ],
    relatedCalculators: ['retirement-calculator', 'fire-calculator', 'four-percent-rule'],
    relatedGuides: ['how-much-to-save-for-retirement']
  },

  // 15. Savings Goal Calculator
  {
    id: 'savings-goal',
    slug: 'savings-goal',
    name: 'Savings Goal Calculator',
    title: 'Savings Goal Calculator | MoneyMetricsHub',
    metaDescription: 'Find out exactly how much you need to save each month to hit your financial goals. Customize by timeline and interest rate.',
    shortDescription: 'Calculate the monthly savings required to hit a specific financial target.',
    category: 'savings',
    inputs: [
      { id: 'target', label: 'Savings Goal Target', type: 'number', defaultValue: 10000, min: 100, max: 10000000, prefix: '$' },
      { id: 'months', label: 'Timeframe (Months)', type: 'number', defaultValue: 24, min: 1, max: 360, suffix: 'mo' },
      { id: 'rate', label: 'Annual Interest Rate (APY %)', type: 'number', defaultValue: 4.5, min: 0, max: 20, suffix: '%' },
      { id: 'initial', label: 'Current Savings Balance', type: 'number', defaultValue: 1000, min: 0, max: 10000000, prefix: '$' }
    ],
    calculate: (inputs) => {
      const target = Number(inputs.target);
      const months = Number(inputs.months);
      const r = (Number(inputs.rate) / 100) / 12; // monthly interest rate
      const initial = Number(inputs.initial);

      // FV_principal = initial * (1+r)^m
      const futureValueOfInitial = initial * Math.pow(1 + r, months);
      const residualTarget = Math.max(0, target - futureValueOfInitial);

      // PMT = residualTarget / [ ((1+r)^m - 1) / r ]
      let monthlyContribution = 0;
      if (residualTarget > 0) {
        if (r === 0) {
          monthlyContribution = residualTarget / months;
        } else {
          monthlyContribution = residualTarget / ((Math.pow(1 + r, months) - 1) / r);
        }
      }

      const chartData = [];
      let balance = initial;
      for (let m = 1; m <= months; m++) {
        balance = balance * (1 + r) + monthlyContribution;
        chartData.push({
          label: `Mo ${m}`,
          'Savings Progress': Math.round(balance),
          'Savings Target': target
        });
      }

      return {
        summary: [
          { label: 'Required Monthly Savings', value: `$${Math.round(monthlyContribution).toLocaleString()}`, rawValue: monthlyContribution, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'Total Capital Saved', value: `$${Math.round(initial + (monthlyContribution * months)).toLocaleString()}`, rawValue: initial + (monthlyContribution * months) },
          { label: 'Estimated Interest Gained', value: `$${Math.round(Math.max(0, target - (initial + (monthlyContribution * months)))).toLocaleString()}`, rawValue: Math.max(0, target - (initial + (monthlyContribution * months))) }
        ],
        chartData: chartData.filter((_, i) => months > 24 ? i % Math.ceil(months / 12) === 0 || i === months - 1 : true),
        chartKeys: [
          { key: 'Savings Progress', color: '#10b981', label: 'My Savings Path' },
          { key: 'Savings Target', color: '#94a3b8', label: 'Goal Target' }
        ],
        interpretation: `To hit your $${target.toLocaleString()} goal in ${months} months with a starting balance of $${initial.toLocaleString()} in a High-Yield Savings Account earning ${inputs.rate}% APY, you must save $${Math.round(monthlyContribution).toLocaleString()} every month.`
      };
    },
    formula: {
      equation: 'PMT = [Target - Initial * (1+r)^m] / [ ((1+r)^m - 1) / r ]',
      variables: [
        { name: 'Target', description: 'Desired future savings goal amount' },
        { name: 'Initial', description: 'Current starting savings balance' },
        { name: 'r', description: 'Monthly compound interest rate (annual / 12)' },
        { name: 'm', description: 'Time horizon in months' },
        { name: 'PMT', description: 'Required monthly contribution amount' }
      ],
      explanation: 'First, the future compound value of your starting balance is calculated and subtracted from your goal. This leaves a residual target, which is divided by the monthly compounding annuity accumulation factor to find the exact monthly deposit needed.',
      example: {
        scenario: 'A goal of $5,000 in 12 months with a $500 starting balance in a 4% APY account.',
        steps: [
          'Target = $5,000, months = 12, r = 0.04 / 12 = 0.003333, Initial = $500',
          'Calculate PV of initial: $500 * (1.003333)^12 ≈ $520.37',
          'Residual target: $5,000 - $520.37 = $4,479.63',
          'Annuity factor: [((1.003333)^12 - 1) / 0.003333] ≈ 12.22',
          'Solve monthly deposit: $4,479.63 / 12.22 = $366.58'
        ],
        result: 'You need to save $366.58 monthly to reach your goal.'
      },
      limitations: ['Does not incorporate fluctuating APY rates. Many high-yield savings accounts adjust yields over time based on federal rate shifts.']
    },
    faqs: [
      { question: 'What is APY?', answer: 'Annual Percentage Yield (APY) represents the real annualized interest rate earned on savings, reflecting compound interest mechanics.' }
    ],
    references: [
      { name: 'Federal Deposit Insurance Corporation (FDIC) Interest Rates', url: 'https://www.fdic.gov', description: 'Standard consumer banking rules.' }
    ],
    relatedCalculators: ['emergency-fund', 'inflation-calculator', 'compound-interest'],
    relatedGuides: ['inflation-explained']
  },

  // 16. Emergency Fund Calculator
  {
    id: 'emergency-fund',
    slug: 'emergency-fund',
    name: 'Emergency Fund Calculator',
    title: 'Emergency Fund Calculator | MoneyMetricsHub',
    metaDescription: 'Calculate the size of your emergency fund. Keep yourself safe against job loss, medical emergencies, and unexpected expenses.',
    shortDescription: 'Estimate your required emergency fund size to protect yourself against unexpected financial events.',
    category: 'savings',
    inputs: [
      { id: 'monthlyExpenses', label: 'Essential Monthly Expenses', type: 'number', defaultValue: 3500, min: 100, max: 100000, prefix: '$' },
      {
        id: 'months',
        label: 'Months of Coverage',
        type: 'slider',
        defaultValue: 6,
        min: 1,
        max: 12,
        step: 1,
        suffix: ' months'
      }
    ],
    calculate: (inputs) => {
      const expenses = Number(inputs.monthlyExpenses);
      const months = Number(inputs.months);

      const target = expenses * months;

      // Provide visual list of savings safety milestones
      const chartData = [
        { name: 'Essential Bills', value: Math.round(expenses * 0.7) },
        { name: 'Housing / Rent', value: Math.round(expenses * 0.2) },
        { name: 'Insurance & Healthcare', value: Math.round(expenses * 0.1) }
      ];

      return {
        summary: [
          { label: 'Recommended Fund Size', value: `$${target.toLocaleString()}`, rawValue: target, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'Months Covered', value: `${months} Months`, rawValue: months },
          { label: 'Monthly Safety Margin', value: `$${expenses.toLocaleString()}`, rawValue: expenses }
        ],
        chartData,
        chartKeys: [{ key: 'value', color: '#10b981', label: 'Monthly Spending Profile' }],
        interpretation: `To cover ${months} months of core expenses during a job loss or medical emergency, you should maintain a cash reserve of $${target.toLocaleString()} in a liquid, easily accessible High-Yield Savings Account.`
      };
    },
    formula: {
      equation: 'Emergency Fund Target = Essential Monthly Expenses * Months of Coverage',
      variables: [
        { name: 'Essential Monthly Expenses', description: 'The absolute bare minimum cash needed to cover food, housing, bills, and insurance each month' },
        { name: 'Months of Coverage', description: 'The number of months you want to remain solvent during a job loss or emergency (commonly 3 to 6 months)' }
      ],
      explanation: 'Multiplies your bare-minimum monthly living costs by your desired months of safety coverage to determine your total target liquid reserve.',
      example: {
        scenario: 'Your rent, food, and minimum debt payments total $3,000 per month, and you want a 6-month safety margin.',
        steps: [
          'Expenses = $3,000, Coverage = 6 months',
          'Target = $3,000 * 6 = $18,000'
        ],
        result: 'Your total emergency fund goal is $18,000.'
      },
      limitations: ['Does not incorporate large, unpredictable lump-sum emergencies like auto repairs or medical deductibles, which can exceed regular monthly averages.']
    },
    faqs: [
      { question: 'Where should I store my emergency fund?', answer: 'Store your emergency fund in a highly liquid account like a High-Yield Savings Account (HYSA) or Money Market Account. Avoid investing these funds in volatile assets like stocks.' }
    ],
    references: [
      { name: 'Bogleheads Emergency Fund Philosophy', url: 'https://www.bogleheads.org/wiki/Emergency_fund', description: 'Standard personal finance practices on emergency cash reserves.' }
    ],
    relatedCalculators: ['savings-goal', 'inflation-calculator', 'net-worth'],
    relatedGuides: ['inflation-explained']
  },

  // 17. Inflation Calculator
  {
    id: 'inflation-calculator',
    slug: 'inflation-calculator',
    name: 'Inflation Calculator',
    title: 'Inflation Calculator | Purchasing Power Loss',
    metaDescription: 'See how inflation erodes the value of cash over time. Calculate future costs and purchasing power loss.',
    shortDescription: 'Calculate the erosion of your purchasing power and project future costs under inflation.',
    category: 'savings',
    inputs: [
      { id: 'amount', label: 'Cash Amount Today', type: 'number', defaultValue: 10000, min: 1, max: 100000000, prefix: '$' },
      { id: 'years', label: 'Time Horizon (Years)', type: 'number', defaultValue: 15, min: 1, max: 80, suffix: 'yrs' },
      { id: 'inflationRate', label: 'Average Annual Inflation (%)', type: 'number', defaultValue: 3, min: 0.1, max: 50, suffix: '%' }
    ],
    calculate: (inputs) => {
      const amt = Number(inputs.amount);
      const t = Number(inputs.years);
      const inf = Number(inputs.inflationRate) / 100;

      // Future cost of same items = amt * (1+inf)^t
      const futureCost = amt * Math.pow(1 + inf, t);
      // Value in future = amt / (1+inf)^t
      const realValue = amt / Math.pow(1 + inf, t);
      const valueLoss = amt - realValue;

      const chartData = [];
      for (let yr = 0; yr <= t; yr++) {
        chartData.push({
          label: `Yr ${yr}`,
          'Real Purchasing Power': Math.round(amt / Math.pow(1 + inf, yr)),
          'Nominal Future Cost': Math.round(amt * Math.pow(1 + inf, yr))
        });
      }

      return {
        summary: [
          { label: 'Future Cost of Same Goods', value: `$${Math.round(futureCost).toLocaleString()}`, rawValue: futureCost, badgeColor: 'bg-rose-100 text-rose-800' },
          { label: 'Real Purchasing Power', value: `$${Math.round(realValue).toLocaleString()}`, rawValue: realValue, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'Total Value Erosion', value: `$${Math.round(valueLoss).toLocaleString()}`, rawValue: valueLoss }
        ],
        chartData: chartData.filter((_, i) => t > 20 ? i % Math.ceil(t / 15) === 0 || i === t : true),
        chartKeys: [
          { key: 'Real Purchasing Power', color: '#10b981', label: 'Real Value of $10k' },
          { key: 'Nominal Future Cost', color: '#ef4444', label: 'Price of Goods' }
        ],
        interpretation: `In ${t} years, a $${amt.toLocaleString()} basket of goods will cost $${Math.round(futureCost).toLocaleString()} due to a ${inputs.inflationRate}% annual inflation rate. Alternatively, $${amt.toLocaleString()} sitting in cash will only buy what $${Math.round(realValue).toLocaleString()} buys today.`
      };
    },
    formula: {
      equation: 'Real Value = Cash / (1 + r)^t',
      variables: [
        { name: 'Cash', description: 'Starting cash amount' },
        { name: 'r', description: 'Annual inflation rate (decimal)' },
        { name: 't', description: 'Time horizon in years' }
      ],
      explanation: 'Compunds price growth to project future costs, and discounts current cash balances to isolate how much purchasing power is lost to inflation.',
      example: {
        scenario: 'You hold $10,000 in cash for 10 years at a 3% average inflation rate.',
        steps: [
          'Cash = $10,000, r = 0.03, t = 10',
          'Evaluate formula: $10,000 / (1.03)^10',
          'Inflation factor: 1.03^10 ≈ 1.3439',
          'Discount cash: $10,000 / 1.3439 ≈ $7,440.94'
        ],
        result: 'Your cash will buy what $7,441 buys today, losing $2,559 in value.'
      },
      limitations: ['Inflation fluctuates annually; a constant rate is a simplified assumption.']
    },
    faqs: [
      { question: 'How is inflation calculated?', answer: 'Governments calculate inflation using indexes like the Consumer Price Index (CPI), which tracks the average price change of a basket of goods and services over time.' }
    ],
    references: [
      { name: 'Bureau of Labor Statistics (BLS) Consumer Price Index', url: 'https://www.bls.gov/cpi/', description: 'The official agency tracking inflation metrics.' }
    ],
    relatedCalculators: ['savings-goal', 'investment-return', 'retirement-calculator'],
    relatedGuides: ['inflation-explained']
  },

  // 18. Salary Calculator
  {
    id: 'salary-calculator',
    slug: 'salary-calculator',
    name: 'Salary Calculator',
    title: 'Salary Calculator | Paycheck Breakdowns',
    metaDescription: 'Convert your annual salary to hourly, weekly, bi-weekly, and monthly wages. Adjust for hours worked per week and tax assumptions.',
    shortDescription: 'Convert annual salary figures into equivalents across various pay frequencies.',
    category: 'income',
    inputs: [
      { id: 'salary', label: 'Annual Salary', type: 'number', defaultValue: 75000, min: 1000, max: 10000000, prefix: '$' },
      { id: 'hoursPerWeek', label: 'Hours Worked per Week', type: 'number', defaultValue: 40, min: 1, max: 100, suffix: 'hrs' },
      { id: 'paidWeeks', label: 'Paid Weeks per Year', type: 'number', defaultValue: 52, min: 1, max: 52, suffix: 'wks' }
    ],
    calculate: (inputs) => {
      const salary = Number(inputs.salary);
      const hours = Number(inputs.hoursPerWeek);
      const weeks = Number(inputs.paidWeeks);

      const totalHours = hours * weeks;
      const hourly = salary / totalHours;
      const weekly = salary / weeks;
      const biweekly = salary / (weeks / 2);
      const monthly = salary / 12;

      const chartData = [
        { name: 'Monthly Pay', value: Math.round(monthly) },
        { name: 'Bi-Weekly Pay', value: Math.round(biweekly) },
        { name: 'Weekly Pay', value: Math.round(weekly) }
      ];

      return {
        summary: [
          { label: 'Hourly Wage Equivalent', value: `$${hourly.toFixed(2)}`, rawValue: hourly, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'Monthly Equivalent', value: `$${Math.round(monthly).toLocaleString()}`, rawValue: monthly, badgeColor: 'bg-blue-100 text-blue-800' },
          { label: 'Bi-Weekly Equivalent', value: `$${Math.round(biweekly).toLocaleString()}`, rawValue: biweekly }
        ],
        chartData,
        chartKeys: [{ key: 'value', color: '#3b82f6', label: 'Equivalent Pay' }],
        interpretation: `An annual salary of $${salary.toLocaleString()} based on ${hours} hours/week over ${weeks} paid weeks equates to an hourly rate of $${hourly.toFixed(2)}/hour. Your monthly gross pay is $${Math.round(monthly).toLocaleString()}, and bi-weekly pay is $${Math.round(biweekly).toLocaleString()}.`
      };
    },
    formula: {
      equation: 'Hourly Rate = Annual Salary / (Hours per Week * Weeks per Year)',
      variables: [
        { name: 'Annual Salary', description: 'Your total pre-tax yearly income' },
        { name: 'Hours per Week', description: 'Average hours worked per week' },
        { name: 'Weeks per Year', description: 'Paid weeks in a year (standard is 52)' }
      ],
      explanation: 'Finds your total hours worked per year, then divides your salary by those hours to calculate your hourly rate.',
      example: {
        scenario: 'A salary of $52,000 based on a 40-hour work week and 52 paid weeks.',
        steps: [
          'Annual Hours = 40 * 52 = 2,080 hours',
          'Hourly Rate = $52,000 / 2,080 hours = $25.00'
        ],
        result: 'Your equivalent hourly rate is $25.00/hour.'
      },
      limitations: ['Does not account for income tax withholding, healthcare deductions, or pension contributions.']
    },
    faqs: [
      { question: 'How many work hours are in a year?', answer: 'For a full-time employee working 40 hours a week for 52 weeks, there are exactly 2,080 work hours in a year.' }
    ],
    references: [
      { name: 'Internal Revenue Service (IRS) Tax Withholding Tables', url: 'https://www.irs.gov', description: 'Tax tables detailing income brackets.' }
    ],
    relatedCalculators: ['hourly-wage', 'net-worth', 'savings-goal'],
    relatedGuides: ['inflation-explained']
  },

  // 19. Hourly Wage Calculator
  {
    id: 'hourly-wage',
    slug: 'hourly-wage',
    name: 'Hourly Wage Calculator',
    title: 'Hourly Wage Calculator | Annual Salary Converter',
    metaDescription: 'Convert your hourly wage into annual, monthly, and weekly salary figures. Perfect for hourly contractors and freelancers.',
    shortDescription: 'Convert hourly wages into equivalent annual, monthly, and weekly salaries.',
    category: 'income',
    inputs: [
      { id: 'hourlyRate', label: 'Hourly Wage Rate', type: 'number', defaultValue: 35, min: 1, max: 1000, prefix: '$' },
      { id: 'hoursPerWeek', label: 'Hours per Week', type: 'number', defaultValue: 40, min: 1, max: 100, suffix: 'hrs' },
      { id: 'weeks', label: 'Weeks Worked per Year', type: 'number', defaultValue: 52, min: 1, max: 52, suffix: 'wks' }
    ],
    calculate: (inputs) => {
      const rate = Number(inputs.hourlyRate);
      const hours = Number(inputs.hoursPerWeek);
      const weeks = Number(inputs.weeks);

      const weekly = rate * hours;
      const annual = weekly * weeks;
      const monthly = annual / 12;

      const chartData = [
        { name: 'Annual Equiv', value: Math.round(annual) },
        { name: 'Monthly Equiv', value: Math.round(monthly) },
        { name: 'Weekly Equiv', value: Math.round(weekly) }
      ];

      return {
        summary: [
          { label: 'Annual Salary Equivalent', value: `$${Math.round(annual).toLocaleString()}`, rawValue: annual, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'Monthly Gross Pay', value: `$${Math.round(monthly).toLocaleString()}`, rawValue: monthly, badgeColor: 'bg-blue-100 text-blue-800' },
          { label: 'Weekly Gross Pay', value: `$${Math.round(weekly).toLocaleString()}`, rawValue: weekly }
        ],
        chartData,
        chartKeys: [{ key: 'value', color: '#10b981', label: 'Wages' }],
        interpretation: `An hourly rate of $${rate.toFixed(2)}/hour based on ${hours} hours/week over ${weeks} paid weeks is equivalent to an annual gross salary of $${Math.round(annual).toLocaleString()}, translating to a monthly paycheck of $${Math.round(monthly).toLocaleString()}.`
      };
    },
    formula: {
      equation: 'Annual Salary = Hourly Rate * Hours per Week * Weeks per Year',
      variables: [
        { name: 'Hourly Rate', description: 'Your current hourly wage rate' },
        { name: 'Hours per Week', description: 'Average hours worked per week' },
        { name: 'Weeks per Year', description: 'Number of paid weeks worked per year' }
      ],
      explanation: 'Multiplies your hourly wage by your weekly hours to find weekly pay, and then scales that figure by your total weeks worked per year.',
      example: {
        scenario: 'An hourly rate of $30/hour based on 40 hours per week and 50 weeks worked.',
        steps: [
          'Weekly Pay = $30 * 40 = $1,200',
          'Annual Pay = $1,200 * 50 = $60,000'
        ],
        result: 'Your equivalent annual salary is $60,000.'
      },
      limitations: ['Does not include overtime multipliers, payroll taxes, or employee benefit adjustments.']
    },
    faqs: [
      { question: 'Does a standard work year include holidays?', answer: 'Many salaried positions include paid holidays in their 52-week calculation. For hourly workers, unpaid holidays must be accounted for by reducing the "Weeks Worked per Year" input.' }
    ],
    references: [
      { name: 'US Department of Labor (DOL) Wage Regulations', url: 'https://www.dol.gov', description: 'Federal guidelines on hourly wages and overtime structures.' }
    ],
    relatedCalculators: ['salary-calculator', 'net-worth', 'savings-goal'],
    relatedGuides: ['inflation-explained']
  },

  // 20. Net Worth Calculator
  {
    id: 'net-worth',
    slug: 'net-worth',
    name: 'Net Worth Calculator',
    title: 'Net Worth Calculator | Personal Balance Sheets',
    metaDescription: 'Calculate your personal net worth. Subract real-estate, investment, and cash assets against mortgages and loan liabilities.',
    shortDescription: 'Calculate your net worth by subtracting total debt liabilities from total assets.',
    category: 'income',
    inputs: [
      { id: 'cash', label: 'Cash & Bank Accounts', type: 'number', defaultValue: 15000, min: 0, max: 100000000, prefix: '$' },
      { id: 'investments', label: 'Retirement & Brokerage Assets', type: 'number', defaultValue: 120000, min: 0, max: 100000000, prefix: '$' },
      { id: 'realEstate', label: 'Primary Home & Real Estate', type: 'number', defaultValue: 350000, min: 0, max: 100000000, prefix: '$' },
      { id: 'vehicles', label: 'Car & Vehicle Valuations', type: 'number', defaultValue: 25000, min: 0, max: 10000000, prefix: '$' },
      { id: 'mortgage', label: 'Mortgage Debt Balance', type: 'number', defaultValue: 240000, min: 0, max: 100000000, prefix: '$' },
      { id: 'carLoans', label: 'Vehicle Loan Balances', type: 'number', defaultValue: 12000, min: 0, max: 10000000, prefix: '$' },
      { id: 'otherDebt', label: 'Credit Card & Student Loans', type: 'number', defaultValue: 18000, min: 0, max: 10000000, prefix: '$' }
    ],
    calculate: (inputs) => {
      const cash = Number(inputs.cash);
      const invest = Number(inputs.investments);
      const re = Number(inputs.realEstate);
      const veh = Number(inputs.vehicles);

      const mortgage = Number(inputs.mortgage);
      const carLoan = Number(inputs.carLoans);
      const otherDebt = Number(inputs.otherDebt);

      const totalAssets = cash + invest + re + veh;
      const totalLiabilities = mortgage + carLoan + otherDebt;
      const netWorth = totalAssets - totalLiabilities;

      const chartData = [
        { name: 'Total Assets', value: totalAssets },
        { name: 'Total Debt Liabilities', value: totalLiabilities }
      ];

      return {
        summary: [
          { label: 'My Net Worth', value: `$${netWorth.toLocaleString()}`, rawValue: netWorth, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'Total Assets Owned', value: `$${totalAssets.toLocaleString()}`, rawValue: totalAssets, badgeColor: 'bg-blue-100 text-blue-800' },
          { label: 'Total Debt Liabilities', value: `$${totalLiabilities.toLocaleString()}`, rawValue: totalLiabilities, badgeColor: 'bg-rose-100 text-rose-800' }
        ],
        chartData,
        chartKeys: [{ key: 'value', color: '#10b981', label: 'Balance Sheet' }],
        interpretation: `Your total assets of $${totalAssets.toLocaleString()} minus your total debt liabilities of $${totalLiabilities.toLocaleString()} yields a current personal Net Worth of $${netWorth.toLocaleString()}.`
      };
    },
    formula: {
      equation: 'Net Worth = Total Assets - Total Liabilities',
      variables: [
        { name: 'Total Assets', description: 'The aggregate market value of everything you own (cash, stocks, real estate, vehicles)' },
        { name: 'Total Liabilities', description: 'The aggregate sum of all debts you owe (mortgages, auto loans, student loans, credit cards)' }
      ],
      explanation: 'Subtracts your total liabilities from your total assets to calculate your net worth, reflecting the absolute liquidation value of your financial estate.',
      example: {
        scenario: 'You have $10,000 in cash, $50,000 in stocks, own a $200,000 home, and owe a $150,000 mortgage.',
        steps: [
          'Assets = $10,000 + $50,000 + $200,000 = $260,000',
          'Liabilities = $150,000',
          'Net Worth = $260,000 - $150,000 = $110,000'
        ],
        result: 'Your personal net worth is $110,000.'
      },
      limitations: ['Asset values (especially homes and vehicles) fluctuate over time. Standard metrics rely on current conservative valuations.']
    },
    faqs: [
      { question: 'Why does Net Worth matter?', answer: 'Net Worth is the most comprehensive single indicator of financial health. Tracking it over time shows whether you are accumulating assets or paying down liabilities.' }
    ],
    references: [
      { name: 'SEC Net Worth Definition Guide', url: 'https://www.sec.gov', description: 'Federal standards explaining accredited asset structures.' }
    ],
    relatedCalculators: ['savings-goal', 'emergency-fund', 'retirement-calculator'],
    relatedGuides: ['how-much-to-save-for-retirement']
  },

  ...investingNewCalculators,
  ...loansNewCalculators,
  ...retirementNewCalculators,
  ...debtNewCalculators,
  ...taxesNewCalculators,
  ...businessNewCalculators
];
