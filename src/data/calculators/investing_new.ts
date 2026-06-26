import { CalculatorDefinition } from '../../types';

export const investingNewCalculators: CalculatorDefinition[] = [
  {
    id: 'dividend-calculator',
    slug: 'dividend-calculator',
    name: 'Dividend Calculator',
    title: 'Dividend Growth Calculator | MoneyMetricsHub',
    metaDescription: 'Project your long-term dividend income, portfolio growth, and future annual payouts with our free dividend growth calculator.',
    shortDescription: 'Project your future dividend income, cumulative share count, and total portfolio growth over time.',
    category: 'investing',
    inputs: [
      { id: 'principal', label: 'Initial Investment ($)', type: 'number', defaultValue: 10000, min: 0, prefix: '$' },
      { id: 'contribution', label: 'Monthly Contribution ($)', type: 'number', defaultValue: 500, min: 0, prefix: '$' },
      { id: 'yield', label: 'Dividend Yield (%)', type: 'number', defaultValue: 4, min: 0, max: 20, step: 0.1, suffix: '%' },
      { id: 'divGrowth', label: 'Dividend Growth Rate (%)', type: 'number', defaultValue: 5, min: 0, max: 25, step: 0.1, suffix: '%' },
      { id: 'years', label: 'Time Horizon (Years)', type: 'number', defaultValue: 20, min: 1, max: 50, suffix: 'yrs' }
    ],
    calculate: (inputs) => {
      const p = Number(inputs.principal);
      const monthlyPmt = Number(inputs.contribution);
      const y = Number(inputs.yield) / 100;
      const g = Number(inputs.divGrowth) / 100;
      const t = Number(inputs.years);

      let portfolio = p;
      let annualDividend = p * y;
      let totalContributions = p;
      const chartData = [];
      const breakdown = [];

      for (let yr = 1; yr <= t; yr++) {
        // Reinvest annual dividend + add monthly contributions
        const dividendsEarned = portfolio * y;
        portfolio += dividendsEarned + (monthlyPmt * 12);
        totalContributions += (monthlyPmt * 12);
        
        // Update dividend based on growth rate
        annualDividend = portfolio * y * Math.pow(1 + g, yr);

        chartData.push({
          label: `Yr ${yr}`,
          'Portfolio Value': Math.round(portfolio),
          'Annual Dividend': Math.round(annualDividend),
          'Contributions': Math.round(totalContributions)
        });

        breakdown.push({
          year: yr,
          contributions: Math.round(totalContributions),
          dividends: Math.round(dividendsEarned),
          balance: Math.round(portfolio)
        });
      }

      return {
        summary: [
          { label: 'Future Portfolio Value', value: `$${Math.round(portfolio).toLocaleString()}`, rawValue: portfolio, badgeColor: 'bg-blue-100 text-blue-800' },
          { label: 'Annual Dividend Income', value: `$${Math.round(annualDividend).toLocaleString()}`, rawValue: annualDividend, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'Total Invested Principal', value: `$${Math.round(totalContributions).toLocaleString()}`, rawValue: totalContributions }
        ],
        breakdown,
        chartData,
        chartKeys: [
          { key: 'Portfolio Value', color: '#3b82f6', label: 'Portfolio Value' },
          { key: 'Annual Dividend', color: '#10b981', label: 'Annual Dividend' }
        ],
        interpretation: `In ${t} years, your dividend-focused portfolio will grow to an estimated $${Math.round(portfolio).toLocaleString()}, generating $${Math.round(annualDividend).toLocaleString()} in passive annual dividend cash flow.`
      };
    },
    formula: {
      equation: 'P_t = P_{t-1} * (1 + Yield) + PMT * 12',
      variables: [
        { name: 'P_t', description: 'Portfolio value at year t' },
        { name: 'Yield', description: 'Starting dividend yield' },
        { name: 'PMT', description: 'Monthly contribution' }
      ],
      explanation: 'Compounds the portfolio balance each year by adding the annual dividend payout and the total contributions, then recalculates the new dividend income base.',
      example: {
        scenario: 'You start with $10,000, add $500/month, and have a 4% starting dividend yield.',
        steps: [
          'Initial Value = $10,000',
          'Dividends Year 1 = $400',
          'Contributions Year 1 = $6,000',
          'Ending Balance Year 1 = $16,400'
        ],
        result: 'Ending balance compounds exponentially over time.'
      },
      limitations: ['Does not account for tax liabilities on un-sheltered dividends.', 'Assumes consistent corporate dividend payouts and yields.']
    },
    faqs: [
      { question: 'What is dividend growth investing?', answer: 'It is a strategy focused on buying stocks that regularly increase their dividend payouts, creating compounding yield on cost over time.' },
      { question: 'Should I reinvest dividends?', answer: 'Yes, reinvesting dividends (DRIP) dramatically speeds up compound interest growth by using cash payouts to purchase additional compounding shares.' }
    ],
    references: [
      { name: 'SEC on Dividends and DRIPs', url: 'https://www.sec.gov/news/press-release/dividends', description: 'Official guide on dividend reinvestment plans.' }
    ],
    relatedCalculators: ['dividend-yield', 'dividend-reinvestment'],
    relatedGuides: ['what-is-compound-interest']
  },
  {
    id: 'dividend-yield',
    slug: 'dividend-yield',
    name: 'Dividend Yield Calculator',
    title: 'Dividend Yield Calculator | MoneyMetricsHub',
    metaDescription: 'Calculate any stock or fund dividend yield percentage easily based on share price and dividend payouts.',
    shortDescription: 'Calculate stock dividend yields instantly based on current stock prices and payouts.',
    category: 'investing',
    inputs: [
      { id: 'stockPrice', label: 'Stock Price ($)', type: 'number', defaultValue: 100, min: 0.01, prefix: '$' },
      { id: 'dividend', label: 'Annual Dividend Per Share ($)', type: 'number', defaultValue: 4, min: 0, prefix: '$' }
    ],
    calculate: (inputs) => {
      const price = Number(inputs.stockPrice);
      const div = Number(inputs.dividend);
      const yieldPct = (div / price) * 100;

      const chartData = [
        { name: 'Dividend Yield', value: yieldPct },
        { name: 'Remaining Share Price', value: 100 - (yieldPct > 100 ? 100 : yieldPct) }
      ];

      return {
        summary: [
          { label: 'Dividend Yield', value: `${yieldPct.toFixed(2)}%`, rawValue: yieldPct, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'Share Price', value: `$${price.toFixed(2)}`, rawValue: price },
          { label: 'Annual Payout', value: `$${div.toFixed(2)}`, rawValue: div }
        ],
        chartData,
        interpretation: `A stock trading at $${price.toFixed(2)} paying an annual dividend of $${div.toFixed(2)} per share has an active dividend yield of ${yieldPct.toFixed(2)}%.`
      };
    },
    formula: {
      equation: 'Yield = (Annual Dividend Per Share / Stock Price) * 100',
      variables: [
        { name: 'Yield', description: 'Dividend yield percentage' },
        { name: 'Dividend', description: 'Sum of dividends paid per share annually' },
        { name: 'Stock Price', description: 'Current trading price of the stock' }
      ],
      explanation: 'Divides the annual cash dividend payout per share by the current market trading price of the stock to find the yield percentage.',
      example: {
        scenario: 'A stock is trading at $50 and pays quarterly dividends of $0.50 ($2.00 annually).',
        steps: [
          'Annual dividend = $2.00',
          'Stock price = $50.00',
          'Divide $2.00 / $50.00 = 0.04'
        ],
        result: 'Dividend yield is 4.00%.'
      },
      limitations: ['Yield fluctuates constantly as the stock price changes throughout trading hours.', 'High yield can indicate financial distress (value trap).']
    },
    faqs: [
      { question: 'What is a good dividend yield?', answer: 'Typically, a yield between 2% and 5% is considered healthy and sustainable. Yields over 8% should be vetted closely.' }
    ],
    references: [
      { name: 'Investopedia on Dividend Yield', url: 'https://www.investopedia.com/terms/d/dividendyield.asp', description: 'Analysis of dividend yield mechanics.' }
    ],
    relatedCalculators: ['dividend-calculator', 'dividend-reinvestment'],
    relatedGuides: ['what-is-compound-interest']
  },
  {
    id: 'dividend-reinvestment',
    slug: 'dividend-reinvestment',
    name: 'Dividend Reinvestment Calculator (DRIP)',
    title: 'Dividend Reinvestment Calculator (DRIP) | MoneyMetricsHub',
    metaDescription: 'Compare DRIP vs. Cash Out dividend strategies to see the compounding power of reinvesting stock dividends.',
    shortDescription: 'Compare the financial outcomes of reinvesting dividends (DRIP) versus cashing them out.',
    category: 'investing',
    inputs: [
      { id: 'principal', label: 'Initial Balance ($)', type: 'number', defaultValue: 10000, min: 0, prefix: '$' },
      { id: 'yield', label: 'Dividend Yield (%)', type: 'number', defaultValue: 5, min: 0, suffix: '%' },
      { id: 'appreciation', label: 'Annual Share Appreciation (%)', type: 'number', defaultValue: 6, min: 0, suffix: '%' },
      { id: 'years', label: 'Years to Compound', type: 'number', defaultValue: 15, min: 1, max: 40, suffix: 'yrs' }
    ],
    calculate: (inputs) => {
      const p = Number(inputs.principal);
      const y = Number(inputs.yield) / 100;
      const app = Number(inputs.appreciation) / 100;
      const t = Number(inputs.years);

      let dripBalance = p;
      let cashOutBalance = p;
      let accumulatedCashPayout = 0;
      const chartData = [];

      for (let yr = 1; yr <= t; yr++) {
        // DRIP Compounding: combines appreciation + yield reinvested
        dripBalance = dripBalance * (1 + app + y);

        // Cash Out: stock appreciates, but dividends are kept as separate cash
        const cashPayout = cashOutBalance * y;
        cashOutBalance = cashOutBalance * (1 + app);
        accumulatedCashPayout += cashPayout;

        chartData.push({
          label: `Yr ${yr}`,
          'With DRIP': Math.round(dripBalance),
          'Cash Out Total': Math.round(cashOutBalance + accumulatedCashPayout)
        });
      }

      const totalCashOutResult = cashOutBalance + accumulatedCashPayout;

      return {
        summary: [
          { label: 'Balance with DRIP', value: `$${Math.round(dripBalance).toLocaleString()}`, rawValue: dripBalance, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'Cash Out Strategy Value', value: `$${Math.round(totalCashOutResult).toLocaleString()}`, rawValue: totalCashOutResult, badgeColor: 'bg-blue-100 text-blue-800' },
          { label: 'Dividends Taken as Cash', value: `$${Math.round(accumulatedCashPayout).toLocaleString()}`, rawValue: accumulatedCashPayout }
        ],
        chartData,
        chartKeys: [
          { key: 'With DRIP', color: '#10b981', label: 'Reinvested (DRIP)' },
          { key: 'Cash Out Total', color: '#3b82f6', label: 'Dividends in Cash' }
        ],
        interpretation: `By reinvesting dividends (DRIP), your portfolio achieves $${Math.round(dripBalance).toLocaleString()}, representing a $${Math.round(dripBalance - totalCashOutResult).toLocaleString()} advantage over taking dividends as cash.`
      };
    },
    formula: {
      equation: 'DRIP = P * (1 + App + Yield)^t',
      variables: [
        { name: 'App', description: 'Stock appreciation rate' },
        { name: 'Yield', description: 'Dividend yield rate' }
      ],
      explanation: 'Compounds the principal at the combined rate of stock appreciation and dividend yield.',
      example: {
        scenario: 'Investing $10,000 at 6% appreciation and 5% dividend yield for 10 years.',
        steps: [
          'Combined rate = 11% (0.11)',
          'DRIP = $10,000 * (1.11)^10 ≈ $28,394'
        ],
        result: 'Final balance with DRIP is $28,394.'
      },
      limitations: ['Assumes constant annual performance and stable yields.']
    },
    faqs: [
      { question: 'What does DRIP stand for?', answer: 'Dividend Reinvestment Plan. It automatically reinvests stock dividend payouts back into partial or whole shares of the same company.' }
    ],
    references: [],
    relatedCalculators: ['dividend-calculator', 'dividend-yield'],
    relatedGuides: ['what-is-compound-interest']
  },
  {
    id: 'dollar-cost-averaging',
    slug: 'dollar-cost-averaging',
    name: 'Dollar Cost Averaging Calculator',
    title: 'Dollar Cost Averaging (DCA) Calculator | MoneyMetricsHub',
    metaDescription: 'Visualize the power of systematic investing. Compare DCA stock purchases with lump-sum investing over long periods.',
    shortDescription: 'Model systematic monthly purchases to see how DCA builds consistent long-term wealth.',
    category: 'investing',
    inputs: [
      { id: 'monthly', label: 'Monthly Contribution ($)', type: 'number', defaultValue: 300, min: 10, prefix: '$' },
      { id: 'rate', label: 'Expected Annual Return (%)', type: 'number', defaultValue: 8, min: 0, suffix: '%' },
      { id: 'years', label: 'Years to Invest', type: 'number', defaultValue: 15, min: 1, max: 50, suffix: 'yrs' }
    ],
    calculate: (inputs) => {
      const PMT = Number(inputs.monthly);
      const r = Number(inputs.rate) / 100;
      const t = Number(inputs.years);

      let balance = 0;
      let totalContributions = 0;
      const chartData = [];

      for (let yr = 1; yr <= t; yr++) {
        for (let m = 1; m <= 12; m++) {
          balance = balance * (1 + r / 12) + PMT;
          totalContributions += PMT;
        }

        chartData.push({
          label: `Yr ${yr}`,
          'Portfolio Balance': Math.round(balance),
          'Contributions': Math.round(totalContributions)
        });
      }

      return {
        summary: [
          { label: 'Final Portfolio Value', value: `$${Math.round(balance).toLocaleString()}`, rawValue: balance, badgeColor: 'bg-blue-100 text-blue-800' },
          { label: 'Total Principal Invested', value: `$${Math.round(totalContributions).toLocaleString()}`, rawValue: totalContributions },
          { label: 'Market Gain', value: `$${Math.round(balance - totalContributions).toLocaleString()}`, rawValue: balance - totalContributions, badgeColor: 'bg-emerald-100 text-emerald-800' }
        ],
        chartData,
        chartKeys: [
          { key: 'Portfolio Balance', color: '#3b82f6', label: 'Balance' },
          { key: 'Contributions', color: '#64748b', label: 'Contributions' }
        ],
        interpretation: `By investing $${PMT}/month systematically, you buy into market cycles. Your total invested capital of $${totalContributions.toLocaleString()} grew to $${Math.round(balance).toLocaleString()} over ${t} years.`
      };
    },
    formula: {
      equation: 'FV = PMT * [((1 + r/12)^(12t) - 1) / (r/12)]',
      variables: [
        { name: 'FV', description: 'Future portfolio value' },
        { name: 'PMT', description: 'Systematic monthly contribution' }
      ],
      explanation: 'Computes the standard ordinary annuity formula representing steady periodic contributions.',
      example: {
        scenario: 'Investing $300/month at 8% for 5 years.',
        steps: [
          'r = 0.08 / 12 = 0.006667',
          'Periods = 60',
          'Calculate annuity growth: $300 * [(1.006667^60 - 1) / 0.006667] ≈ $22,143'
        ],
        result: 'Ending balance is $22,143.'
      },
      limitations: ['Does not simulate actual day-to-day stock price volatility.']
    },
    faqs: [
      { question: 'What is DCA?', answer: 'Dollar-Cost Averaging is the practice of investing a fixed dollar amount on a regular basis, regardless of stock prices, to reduce volatility impact.' }
    ],
    references: [],
    relatedCalculators: ['compound-interest', 'investment-return'],
    relatedGuides: ['what-is-compound-interest']
  },
  {
    id: 'portfolio-return',
    slug: 'portfolio-return',
    name: 'Portfolio Return Calculator',
    title: 'Portfolio Return Calculator | MoneyMetricsHub',
    metaDescription: 'Calculate the total and annualized ROI (Return on Investment) of your financial portfolio easily.',
    shortDescription: 'Calculate total gain, simple ROI, and annualized returns (CAGR) for your investment portfolio.',
    category: 'investing',
    inputs: [
      { id: 'starting', label: 'Starting Balance ($)', type: 'number', defaultValue: 10000, min: 0, prefix: '$' },
      { id: 'ending', label: 'Ending Balance ($)', type: 'number', defaultValue: 25000, min: 0, prefix: '$' },
      { id: 'contributions', label: 'Net Contributions ($)', type: 'number', defaultValue: 5000, min: 0, prefix: '$' },
      { id: 'years', label: 'Time Period (Years)', type: 'number', defaultValue: 5, min: 1, max: 50, suffix: 'yrs' }
    ],
    calculate: (inputs) => {
      const start = Number(inputs.starting);
      const end = Number(inputs.ending);
      const contrib = Number(inputs.contributions);
      const t = Number(inputs.years);

      const netGain = end - start - contrib;
      const simpleRoi = (netGain / (start + contrib)) * 100;
      
      // Annualized CAGR: (Ending / (Starting + Contributions))^(1/t) - 1
      const cagr = (Math.pow(end / (start + (contrib > 0 ? contrib : 1)), 1 / t) - 1) * 100;

      const chartData = [
        { name: 'Starting Portfolio', value: start },
        { name: 'Net Contributions', value: contrib },
        { name: 'Net Gain', value: netGain > 0 ? netGain : 0 }
      ];

      return {
        summary: [
          { label: 'Net Market Gain', value: `$${netGain.toLocaleString()}`, rawValue: netGain, badgeColor: netGain >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800' },
          { label: 'Simple ROI', value: `${simpleRoi.toFixed(2)}%`, rawValue: simpleRoi },
          { label: 'Annualized Return (CAGR)', value: `${cagr.toFixed(2)}%`, rawValue: cagr, badgeColor: 'bg-blue-100 text-blue-800' }
        ],
        chartData,
        interpretation: `Your portfolio grew from $${start.toLocaleString()} to $${end.toLocaleString()} with $${contrib.toLocaleString()} in net deposits. This represents a total return of ${simpleRoi.toFixed(2)}% (annualized to ${cagr.toFixed(2)}% CAGR).`
      };
    },
    formula: {
      equation: 'CAGR = (Ending / (Starting + Deposits))^(1/t) - 1',
      variables: [
        { name: 'CAGR', description: 'Compound Annual Growth Rate' },
        { name: 'Ending', description: 'Ending portfolio value' },
        { name: 'Starting', description: 'Starting portfolio value' }
      ],
      explanation: 'Calculates the annual geometric rate of return that would grow the investment base to its final value over the specified years.',
      example: {
        scenario: 'Grew $10,000 starting + $5,000 deposits to $25,000 over 5 years.',
        steps: [
          'Ratio = $25,000 / $15,000 = 1.6667',
          'Annualized power = 1.6667^(1/5) = 1.1076'
        ],
        result: 'CAGR is 10.76%.'
      },
      limitations: ['Assumes deposits were made at the start of the timeframe.']
    },
    faqs: [
      { question: 'What is the difference between Simple ROI and CAGR?', answer: 'Simple ROI measures total growth over the entire timeframe, while CAGR breaks it down to a consistent annual compound rate.' }
    ],
    references: [],
    relatedCalculators: ['cagr-calculator', 'investment-return'],
    relatedGuides: ['what-is-cagr']
  },
  {
    id: 'asset-allocation',
    slug: 'asset-allocation',
    name: 'Asset Allocation Calculator',
    title: 'Asset Allocation Calculator | MoneyMetricsHub',
    metaDescription: 'Find your target stocks, bonds, and cash mix based on age and custom investment risk parameters.',
    shortDescription: 'Calculate standard target splits between equities, fixed-income, and cash based on your age.',
    category: 'investing',
    inputs: [
      { id: 'age', label: 'Your Current Age', type: 'number', defaultValue: 30, min: 18, max: 100, suffix: 'yrs' },
      {
        id: 'rule',
        label: 'Allocation Principle rule',
        type: 'select',
        defaultValue: '110',
        options: [
          { label: 'Rule of 100 (Conservative)', value: '100' },
          { label: 'Rule of 110 (Moderate)', value: '110' },
          { label: 'Rule of 120 (Aggressive)', value: '120' }
        ]
      }
    ],
    calculate: (inputs) => {
      const age = Number(inputs.age);
      const base = Number(inputs.rule);

      const stockPct = Math.max(0, Math.min(100, base - age));
      const bondPct = Math.max(0, 100 - stockPct);

      const chartData = [
        { name: 'Equities (Stocks)', value: stockPct },
        { name: 'Fixed Income (Bonds)', value: bondPct }
      ];

      return {
        summary: [
          { label: 'Equities (Stocks)', value: `${stockPct}%`, rawValue: stockPct, badgeColor: 'bg-blue-100 text-blue-800' },
          { label: 'Fixed Income (Bonds)', value: `${bondPct}%`, rawValue: bondPct, badgeColor: 'bg-emerald-100 text-emerald-800' }
        ],
        chartData,
        interpretation: `Based on the Rule of ${base} at age ${age}, your suggested portfolio breakdown is ${stockPct}% Stocks for capital appreciation and ${bondPct}% Bonds for capital preservation.`
      };
    },
    formula: {
      equation: 'Stocks % = Base - Age',
      variables: [
        { name: 'Base', description: 'Risk parameter (100, 110, or 120)' },
        { name: 'Age', description: 'Current age of the investor' }
      ],
      explanation: 'A classic bogleheads asset allocation rule of thumb which dynamically shifts towards conservative fixed-income as you age.',
      example: {
        scenario: 'A 30-year-old using the Rule of 110.',
        steps: [
          'Stocks = 110 - 30 = 80%',
          'Bonds = 100% - 80% = 20%'
        ],
        result: '80% Stocks / 20% Bonds allocation.'
      },
      limitations: ['Does not capture real-world personal risk factors or active pension schemes.']
    },
    faqs: [
      { question: 'Why does allocation change with age?', answer: 'As you approach retirement, you have less time to recover from stock market downturns, necessitating a shift towards stable bonds.' }
    ],
    references: [],
    relatedCalculators: ['risk-tolerance'],
    relatedGuides: []
  },
  {
    id: 'rule-of-72',
    slug: 'rule-of-72',
    name: 'Rule of 72 Calculator',
    title: 'Rule of 72 Calculator | MoneyMetricsHub',
    metaDescription: 'Calculate how long it takes to double your money at a given interest rate using the mathematical Rule of 72.',
    shortDescription: 'Find out exactly how many years it will take to double your savings at a given interest rate.',
    category: 'investing',
    inputs: [
      { id: 'rate', label: 'Expected Annual Rate (%)', type: 'number', defaultValue: 8, min: 0.1, max: 100, step: 0.1, suffix: '%' }
    ],
    calculate: (inputs) => {
      const r = Number(inputs.rate);
      const yearsToDouble = 72 / r;

      const chartData = [];
      for (let yr = 0; yr <= Math.ceil(yearsToDouble) * 2; yr++) {
        // show compounding growth of $100
        const val = 100 * Math.pow(1 + r/100, yr);
        chartData.push({
          label: `Yr ${yr}`,
          'Investment Value': Math.round(val)
        });
      }

      return {
        summary: [
          { label: 'Years to Double', value: `${yearsToDouble.toFixed(1)} years`, rawValue: yearsToDouble, badgeColor: 'bg-blue-100 text-blue-800' },
          { label: 'Annual Growth Rate', value: `${r}%`, rawValue: r }
        ],
        chartData,
        chartKeys: [{ key: 'Investment Value', color: '#3b82f6', label: 'Balance growth ($100 base)' }],
        interpretation: `At a sustained annual return rate of ${r}%, your money will double in approximately ${yearsToDouble.toFixed(1)} years.`
      };
    },
    formula: {
      equation: 't = 72 / r',
      variables: [
        { name: 't', description: 'Years required to double the investment value' },
        { name: 'r', description: 'Annual interest rate percentage' }
      ],
      explanation: 'Divides the constant 72 by the annual growth rate to approximate the doubling period of a compounding balance.',
      example: {
        scenario: 'Investing at a 6% interest rate.',
        steps: [
          't = 72 / 6 = 12'
        ],
        result: 'It takes 12 years to double your capital.'
      },
      limitations: ['An approximation; the exact mathematical doubling is log(2)/log(1+r). Accurate for standard interest ranges (4%-15%).']
    },
    faqs: [
      { question: 'Is the Rule of 72 accurate?', answer: 'Yes, it is highly accurate for common interest rates. For extremely high rates, 73 or 74 can be more precise.' }
    ],
    references: [],
    relatedCalculators: ['compound-interest'],
    relatedGuides: ['rule-of-72-explained']
  },
  {
    id: 'risk-tolerance',
    slug: 'risk-tolerance',
    name: 'Risk Tolerance Calculator',
    title: 'Risk Tolerance Quiz & Calculator | MoneyMetricsHub',
    metaDescription: 'Assess your investing risk tolerance and find a matching target stock/bond portfolio split with our verified quiz.',
    shortDescription: 'Take our risk evaluation questionnaire to find a suitable allocation profile.',
    category: 'investing',
    inputs: [
      {
        id: 'q1',
        label: 'When the stock market drops 20%, what is your reaction?',
        type: 'select',
        defaultValue: 'sell',
        options: [
          { label: 'Panic and sell all positions', value: 'sell' },
          { label: 'Do nothing, wait for recovery', value: 'wait' },
          { label: 'Buy more shares at a discount', value: 'buy' }
        ]
      },
      {
        id: 'q2',
        label: 'What is your investment time horizon?',
        type: 'select',
        defaultValue: 'short',
        options: [
          { label: 'Under 3 Years', value: 'short' },
          { label: '3 to 10 Years', value: 'mid' },
          { label: '10+ Years', value: 'long' }
        ]
      }
    ],
    calculate: (inputs) => {
      const q1 = inputs.q1;
      const q2 = inputs.q2;

      let score = 'Moderate';
      let equities = 60;
      let fixedIncome = 40;

      if (q1 === 'buy' && q2 === 'long') {
        score = 'Aggressive';
        equities = 90;
        fixedIncome = 10;
      } else if (q1 === 'sell' || q2 === 'short') {
        score = 'Conservative';
        equities = 30;
        fixedIncome = 70;
      }

      const chartData = [
        { name: 'Stocks (Growth)', value: equities },
        { name: 'Bonds (Preservation)', value: fixedIncome }
      ];

      return {
        summary: [
          { label: 'Risk Profile Score', value: score, badgeColor: score === 'Aggressive' ? 'bg-red-100 text-red-800' : score === 'Moderate' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800' },
          { label: 'Stocks Equity %', value: `${equities}%`, rawValue: equities },
          { label: 'Bonds Fixed %', value: `${fixedIncome}%`, rawValue: fixedIncome }
        ],
        chartData,
        interpretation: `Your answers classify you as a ${score} investor. We suggest a target asset allocation of ${equities}% equities and ${fixedIncome}% fixed-income securities.`
      };
    },
    formula: {
      equation: 'Equities % = Profile Weighting',
      variables: [],
      explanation: 'Maps subjective questions around time horizon and downside volatility appetite into defined allocation thresholds.',
      example: {
        scenario: 'Long term horizons with high market comfort.',
        steps: ['q1 = buy', 'q2 = long'],
        result: 'Aggressive Allocation (90% Stocks).'
      },
      limitations: ['A general guide only. Individual risk appetites vary and require personal financial consultation.']
    },
    faqs: [
      { question: 'How is risk tolerance calculated?', answer: 'It combines your emotional reaction to downside risk with the actual logical time horizon of your investments.' }
    ],
    references: [],
    relatedCalculators: ['asset-allocation'],
    relatedGuides: []
  },
  {
    id: 'investment-fee-impact',
    slug: 'investment-fee-impact',
    name: 'Investment Fee Impact Calculator',
    title: 'Investment Fee Impact Calculator | MoneyMetricsHub',
    metaDescription: 'Calculate how mutual fund fees and investment advisor expenses eat into your long-term portfolio growth.',
    shortDescription: 'See how investment fees and adviser management fees reduce your compound wealth over time.',
    category: 'investing',
    inputs: [
      { id: 'principal', label: 'Starting Investment ($)', type: 'number', defaultValue: 50000, min: 0, prefix: '$' },
      { id: 'monthly', label: 'Monthly Contribution ($)', type: 'number', defaultValue: 500, min: 0, prefix: '$' },
      { id: 'rate', label: 'Annual Return (%)', type: 'number', defaultValue: 8, min: 1, max: 20, suffix: '%' },
      { id: 'fee', label: 'Annual Fee / Expense Ratio (%)', type: 'number', defaultValue: 1.5, min: 0, max: 10, step: 0.1, suffix: '%' },
      { id: 'years', label: 'Years to Compounding', type: 'number', defaultValue: 25, min: 1, max: 50, suffix: 'yrs' }
    ],
    calculate: (inputs) => {
      const p = Number(inputs.principal);
      const m = Number(inputs.monthly);
      const r = Number(inputs.rate) / 100;
      const f = Number(inputs.fee) / 100;
      const t = Number(inputs.years);

      let lowFeeBalance = p;
      let highFeeBalance = p;
      const chartData = [];

      for (let yr = 1; yr <= t; yr++) {
        // No fees or low fees
        for (let mo = 1; mo <= 12; mo++) {
          lowFeeBalance = lowFeeBalance * (1 + r / 12) + m;
          highFeeBalance = highFeeBalance * (1 + (r - f) / 12) + m;
        }

        chartData.push({
          label: `Yr ${yr}`,
          'Value with No Fees': Math.round(lowFeeBalance),
          'Value with Fees': Math.round(highFeeBalance)
        });
      }

      const totalFeesLost = lowFeeBalance - highFeeBalance;

      return {
        summary: [
          { label: 'Value with No Fees', value: `$${Math.round(lowFeeBalance).toLocaleString()}`, rawValue: lowFeeBalance, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'Value with Fees', value: `$${Math.round(highFeeBalance).toLocaleString()}`, rawValue: highFeeBalance, badgeColor: 'bg-blue-100 text-blue-800' },
          { label: 'Eaten by Fees', value: `$${Math.round(totalFeesLost).toLocaleString()}`, rawValue: totalFeesLost, badgeColor: 'bg-red-100 text-red-850' }
        ],
        chartData,
        chartKeys: [
          { key: 'Value with No Fees', color: '#10b981', label: 'Fee-Free' },
          { key: 'Value with Fees', color: '#ef4444', label: 'With Fees' }
        ],
        interpretation: `Over ${t} years, a ${inputs.fee}% annual fee reduces your ending portfolio balance by $${Math.round(totalFeesLost).toLocaleString()}. That money was lost directly to administrative fees instead of compounding.`
      };
    },
    formula: {
      equation: 'Future Value = PMT * [((1 + (r-f)/12)^(12t) - 1) / ((r-f)/12)]',
      variables: [
        { name: 'r', description: 'Expected market return rate' },
        { name: 'f', description: 'Annual advisory fee / expense ratio' }
      ],
      explanation: 'Subtracts the annual fee percentage directly from the compound growth rate to calculate real-world compounding drag.',
      example: {
        scenario: 'Investing $50,000 + $500/month at 8% return with 1.5% fees over 20 years.',
        steps: [
          'Calculates growth at 8% compounding return.',
          'Calculates secondary growth at 6.5% return (8% - 1.5% fee).'
        ],
        result: 'The difference reveals the total dollars lost to fee friction.'
      },
      limitations: ['Does not account for separate transactional commission broker charges.']
    },
    faqs: [
      { question: 'Why are small fees so destructive?', answer: 'Because that fee money is taken out of your account every year, stripping you of the ability to earn compound interest on those lost dollars.' }
    ],
    references: [],
    relatedCalculators: ['expense-ratio'],
    relatedGuides: []
  },
  {
    id: 'expense-ratio',
    slug: 'expense-ratio',
    name: 'Expense Ratio Calculator',
    title: 'Mutual Fund Expense Ratio Calculator | MoneyMetricsHub',
    metaDescription: 'Calculate the total fees paid to a mutual fund or ETF based on its annual expense ratio.',
    shortDescription: 'Calculate the total annual dollar cost of holding an ETF or Mutual Fund.',
    category: 'investing',
    inputs: [
      { id: 'balance', label: 'Average Investment Balance ($)', type: 'number', defaultValue: 25000, min: 0, prefix: '$' },
      { id: 'expenseRatio', label: 'Expense Ratio (%)', type: 'number', defaultValue: 0.75, min: 0, max: 5, step: 0.01, suffix: '%' }
    ],
    calculate: (inputs) => {
      const b = Number(inputs.balance);
      const er = Number(inputs.expenseRatio) / 100;
      const annualFee = b * er;

      const chartData = [
        { name: 'Fund Expenses', value: annualFee },
        { name: 'Working Assets', value: b - annualFee }
      ];

      return {
        summary: [
          { label: 'Annual Cost ($)', value: `$${annualFee.toFixed(2)}`, rawValue: annualFee, badgeColor: 'bg-red-100 text-red-800' },
          { label: 'Monthly Cost ($)', value: `$${(annualFee / 12).toFixed(2)}`, rawValue: annualFee / 12 },
          { label: 'Working Balance', value: `$${(b - annualFee).toLocaleString()}`, rawValue: b - annualFee }
        ],
        chartData,
        interpretation: `An expense ratio of ${inputs.expenseRatio}% on a $${b.toLocaleString()} balance costs you exactly $${annualFee.toFixed(2)} every year in fund administrative fees.`
      };
    },
    formula: {
      equation: 'Annual Fee = Portfolio Value * Expense Ratio %',
      variables: [
        { name: 'Expense Ratio', description: 'Percentage fee charged by fund managers' }
      ],
      explanation: 'Multiplies the asset value by the fund expense ratio to find the yearly fee drag.',
      example: {
        scenario: 'ETF balance of $10,000 with a 0.25% expense ratio.',
        steps: [
          'Fee = $10,000 * 0.0025'
        ],
        result: 'Annual cost is $25.'
      },
      limitations: ['Expense ratios do not include trading commission spreads inside the fund.']
    },
    faqs: [
      { question: 'What is a good expense ratio?', answer: 'Generally, passive index ETFs should have expense ratios under 0.15%. Active mutual funds often exceed 0.75%.' }
    ],
    references: [],
    relatedCalculators: ['investment-fee-impact'],
    relatedGuides: []
  }
];
