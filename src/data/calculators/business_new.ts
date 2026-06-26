import { CalculatorDefinition } from '../../types';

export const businessNewCalculators: CalculatorDefinition[] = [
  {
    id: 'profit-margin',
    slug: 'profit-margin',
    name: 'Profit Margin Calculator',
    title: 'Profit Margin Calculator | MoneyMetricsHub',
    metaDescription: 'Calculate your business net profit margin percentage based on revenue and total expenses.',
    shortDescription: 'Calculate net profit margins based on gross revenue, cost of sales, and general expenses.',
    category: 'business',
    inputs: [
      { id: 'revenue', label: 'Gross Revenue ($)', type: 'number', defaultValue: 100000, min: 1, prefix: '$' },
      { id: 'cogs', label: 'Cost of Goods Sold (COGS) ($)', type: 'number', defaultValue: 40000, min: 0, prefix: '$' },
      { id: 'opex', label: 'Operating Expenses ($)', type: 'number', defaultValue: 25000, min: 0, prefix: '$' }
    ],
    calculate: (inputs) => {
      const rev = Number(inputs.revenue);
      const cogs = Number(inputs.cogs);
      const opex = Number(inputs.opex);

      const grossProfit = rev - cogs;
      const netProfit = grossProfit - opex;

      const grossMarginPct = (grossProfit / rev) * 100;
      const netMarginPct = (netProfit / rev) * 100;

      const chartData = [
        { name: 'Cost of Sales (COGS)', value: cogs },
        { name: 'Operating Costs (OPEX)', value: opex },
        { name: 'Net Profit Keep', value: netProfit > 0 ? netProfit : 0 }
      ];

      return {
        summary: [
          { label: 'Net Profit Margin', value: `${netMarginPct.toFixed(2)}%`, rawValue: netMarginPct, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'Net Profit ($)', value: `$${netProfit.toLocaleString()}`, rawValue: netProfit },
          { label: 'Gross Margin', value: `${grossMarginPct.toFixed(2)}%`, rawValue: grossMarginPct, badgeColor: 'bg-blue-100 text-blue-800' }
        ],
        chartData,
        interpretation: `Out of $${rev.toLocaleString()} in sales revenue, your cost of sales ($${cogs.toLocaleString()}) and operating expenses ($${opex.toLocaleString()}) leave a net profit of $${netProfit.toLocaleString()}. This represents a net profit margin of ${netMarginPct.toFixed(2)}%.`
      };
    },
    formula: {
      equation: 'Net Margin % = ((Revenue - COGS - OPEX) / Revenue) * 100',
      variables: [],
      explanation: 'Subtracts cost of sales and overhead from total revenue, then divides by revenue to map the net profitability percentage.',
      example: {
        scenario: 'Revenue = $100k, COGS = $40k, OPEX = $25k.',
        steps: ['Net Profit = $100,000 - $40,000 - $25,000 = $35,000', 'Margin = ($35,000 / $100,000) * 100'],
        result: 'Net profit margin is 35.00%.'
      },
      limitations: ['Does not capture income tax provisions or non-cash depreciation entries.']
    },
    faqs: [
      { question: 'What is a good profit margin?', answer: 'Healthy net margins vary by industry, but generally 10% is average, 20% is high, and 5% is low.' }
    ],
    references: [],
    relatedCalculators: ['gross-margin', 'markup-calculator'],
    relatedGuides: []
  },
  {
    id: 'gross-margin',
    slug: 'gross-margin',
    name: 'Gross Margin Calculator',
    title: 'Gross Profit Margin Calculator | MoneyMetricsHub',
    metaDescription: 'Calculate your gross profit margin percentage based on revenues and cost of goods sold (COGS).',
    shortDescription: 'Calculate the fundamental profit margin of your physical products before general operating overhead.',
    category: 'business',
    inputs: [
      { id: 'revenue', label: 'Gross Sales Revenue ($)', type: 'number', defaultValue: 50000, min: 1, prefix: '$' },
      { id: 'cogs', label: 'Cost of Goods Sold (COGS) ($)', type: 'number', defaultValue: 20000, min: 0, prefix: '$' }
    ],
    calculate: (inputs) => {
      const rev = Number(inputs.revenue);
      const cogs = Number(inputs.cogs);

      const grossProfit = rev - cogs;
      const marginPct = (grossProfit / rev) * 100;

      const chartData = [
        { name: 'Cost of Goods (COGS)', value: cogs },
        { name: 'Gross Profit', value: grossProfit }
      ];

      return {
        summary: [
          { label: 'Gross Margin', value: `${marginPct.toFixed(2)}%`, rawValue: marginPct, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'Gross Profit ($)', value: `$${grossProfit.toLocaleString()}`, rawValue: grossProfit },
          { label: 'Cost Share of Sales', value: `${((cogs / rev) * 100).toFixed(0)}%`, rawValue: (cogs / rev) * 100 }
        ],
        chartData,
        interpretation: `Your business generated $${grossProfit.toLocaleString()} in gross profit from $${rev.toLocaleString()} in gross sales, reflecting a product gross margin of ${marginPct.toFixed(2)}%.`
      };
    },
    formula: {
      equation: 'Gross Margin % = ((Revenue - COGS) / Revenue) * 100',
      variables: [],
      explanation: 'Divides gross profit (revenue minus raw product production outlays) by total revenue to determine product pricing health.',
      example: {
        scenario: 'Sales of $50,000 with COGS of $20,000.',
        steps: ['Gross profit = $50,000 - $20,000 = $30,000', 'Margin = ($30,000 / $50,000) * 100'],
        result: 'Gross margin is 60.00%.'
      },
      limitations: ['Does not capture administrative, rental, or marketing expenses.']
    },
    faqs: [
      { question: 'How is gross margin different from markup?', answer: 'Gross margin compares profit to the selling price, while markup compares profit to the wholesale purchase cost.' }
    ],
    references: [],
    relatedCalculators: ['profit-margin', 'markup-calculator'],
    relatedGuides: []
  },
  {
    id: 'roi-calculator',
    slug: 'roi-calculator',
    name: 'ROI Calculator',
    title: 'ROI (Return on Investment) Calculator | MoneyMetricsHub',
    metaDescription: 'Calculate the total return on investment (ROI) and annualized performance percentage of any capital outlay.',
    shortDescription: 'Calculate net ROI percentages and growth factors for business investments.',
    category: 'business',
    inputs: [
      { id: 'cost', label: 'Initial Amount Invested ($)', type: 'number', defaultValue: 20000, min: 1, prefix: '$' },
      { id: 'gained', label: 'Total Amount Returned ($)', type: 'number', defaultValue: 32000, min: 0, prefix: '$' }
    ],
    calculate: (inputs) => {
      const cost = Number(inputs.cost);
      const gained = Number(inputs.gained);

      const netReturn = gained - cost;
      const roi = (netReturn / cost) * 100;

      const chartData = [
        { name: 'Capital Invested', value: cost },
        { name: 'Net Capital Return', value: netReturn > 0 ? netReturn : 0 }
      ];

      return {
        summary: [
          { label: 'Return on Investment (ROI)', value: `${roi.toFixed(2)}%`, rawValue: roi, badgeColor: roi >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800' },
          { label: 'Net Profit', value: `$${netReturn.toLocaleString()}`, rawValue: netReturn },
          { label: 'Investment Gain Factor', value: `${(gained / cost).toFixed(2)}x`, rawValue: gained / cost }
        ],
        chartData,
        interpretation: `An investment of $${cost.toLocaleString()} returning $${gained.toLocaleString()} yields a net profit of $${netReturn.toLocaleString()}, translating to a Return on Investment (ROI) of ${roi.toFixed(2)}%.`
      };
    },
    formula: {
      equation: 'ROI % = ((Amount Returned - Amount Invested) / Amount Invested) * 100',
      variables: [],
      explanation: 'Calculates the percentage return relative to the starting risk capital base.',
      example: {
        scenario: 'Investing $20,000, returning $32,000.',
        steps: ['Gain = $32,000 - $20,000 = $12,000', 'ROI = ($12,000 / $20,000) * 100'],
        result: '60.00% ROI.'
      },
      limitations: ['Does not capture holding timeframe or inflation adjustments.']
    },
    faqs: [
      { question: 'What is a good ROI?', answer: 'For general business marketing investments, a 5:1 ratio (400% ROI) is considered strong.' }
    ],
    references: [],
    relatedCalculators: ['portfolio-return'],
    relatedGuides: []
  },
  {
    id: 'break-even',
    slug: 'break-even',
    name: 'Break Even Calculator',
    title: 'Break-Even Analysis Calculator | MoneyMetricsHub',
    metaDescription: 'Calculate your business break-even sales volume based on fixed costs, pricing, and variable product costs.',
    shortDescription: 'Calculate the unit sales volume required to cover your fixed business overhead.',
    category: 'business',
    inputs: [
      { id: 'fixed', label: 'Total Annual Fixed Costs ($)', type: 'number', defaultValue: 30000, min: 1, prefix: '$' },
      { id: 'price', label: 'Selling Price Per Unit ($)', type: 'number', defaultValue: 50, min: 0.01, prefix: '$' },
      { id: 'variable', label: 'Variable Cost Per Unit ($)', type: 'number', defaultValue: 20, min: 0, prefix: '$' }
    ],
    calculate: (inputs) => {
      const fixed = Number(inputs.fixed);
      const price = Number(inputs.price);
      const variable = Number(inputs.variable);

      const contributionMargin = price - variable;
      
      if (contributionMargin <= 0) {
        return {
          summary: [
            { label: 'Break-Even Units', value: 'Infinite', badgeColor: 'bg-red-100 text-red-800' },
            { label: 'Action Owed', value: 'Increase unit price' }
          ],
          interpretation: `Your selling price ($${price}) is less than or equal to unit variable costs ($${variable}). You lose money on every unit sold. You must raise prices or lower variables to break-even.`
        };
      }

      const units = fixed / contributionMargin;
      const breakEvenSalesValue = units * price;

      const chartData = [
        { name: 'Contribution Margin', value: contributionMargin },
        { name: 'Variable Unit Cost', value: variable }
      ];

      return {
        summary: [
          { label: 'Required Break-Even Units', value: `${Math.ceil(units).toLocaleString()} units`, rawValue: units, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'Break-Even Sales Revenue', value: `$${Math.round(breakEvenSalesValue).toLocaleString()}`, rawValue: breakEvenSalesValue, badgeColor: 'bg-blue-100 text-blue-800' },
          { label: 'Unit Contribution Margin', value: `$${contributionMargin.toFixed(2)}`, rawValue: contributionMargin }
        ],
        chartData,
        interpretation: `With $${fixed.toLocaleString()} in annual fixed overhead, selling products for $${price.toFixed(2)} (with $${variable.toFixed(2)} in variable costs) requires selling exactly ${Math.ceil(units).toLocaleString()} units to break even (generating $${Math.round(breakEvenSalesValue).toLocaleString()} in sales).`
      };
    },
    formula: {
      equation: 'Break-Even Units = Fixed Costs / (Unit Price - Variable Cost)',
      variables: [],
      explanation: 'Divides the annual fixed overhead by the unit contribution margin (price minus direct variables) to compute the zero-profit volume.',
      example: {
        scenario: 'Overhead = $30,000, price = $50, variable = $20.',
        steps: ['Contribution margin = $50 - $20 = $30', 'Units = $30,000 / $30 = 1,000'],
        result: 'Need 1,000 sales to break even.'
      },
      limitations: ['Assumes selling price and variable cost remain linear across all volumes.']
    },
    faqs: [
      { question: 'What are fixed vs variable costs?', answer: 'Fixed costs (like rent or software) remain constant regardless of sales. Variable costs (like packaging or card fees) scale directly with every unit sold.' }
    ],
    references: [],
    relatedCalculators: ['profit-margin'],
    relatedGuides: []
  },
  {
    id: 'markup-calculator',
    slug: 'markup-calculator',
    name: 'Markup Calculator',
    title: 'Product Markup & Selling Price Calculator | MoneyMetricsHub',
    metaDescription: 'Calculate the selling price and profit margin of an item based on production cost and desired markup.',
    shortDescription: 'Calculate product sales prices and net margins based on markup percentages.',
    category: 'business',
    inputs: [
      { id: 'cost', label: 'Wholesale Item Cost ($)', type: 'number', defaultValue: 40, min: 0.01, prefix: '$' },
      { id: 'markup', label: 'Desired Markup (%)', type: 'number', defaultValue: 50, min: 0, suffix: '%' }
    ],
    calculate: (inputs) => {
      const cost = Number(inputs.cost);
      const mu = Number(inputs.markup) / 100;

      const price = cost * (1 + mu);
      const grossProfit = price - cost;
      const margin = (grossProfit / price) * 100;

      const chartData = [
        { name: 'Product Cost', value: cost },
        { name: 'Markup profit', value: grossProfit }
      ];

      return {
        summary: [
          { label: 'Target Selling Price', value: `$${price.toFixed(2)}`, rawValue: price, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'Gross Profit Per Sale', value: `$${grossProfit.toFixed(2)}`, rawValue: grossProfit },
          { label: 'Resulting Gross Margin', value: `${margin.toFixed(2)}%`, rawValue: margin, badgeColor: 'bg-blue-100 text-blue-800' }
        ],
        chartData,
        interpretation: `Applying a ${inputs.markup}% markup on an item costing $${cost.toFixed(2)} results in a recommended retail selling price of $${price.toFixed(2)}, delivering a gross profit of $${grossProfit.toFixed(2)} (${margin.toFixed(2)}% gross margin).`
      };
    },
    formula: {
      equation: 'Selling Price = Cost * (1 + Markup %)',
      variables: [],
      explanation: 'Multiplies item costs by markup thresholds to locate final product prices.',
      example: {
        scenario: 'Item costing $40 marked up 50%.',
        steps: ['Price = $40 * (1 + 0.50) = $60', 'Gross Profit = $20', 'Margin = ($20 / $60) * 100 = 33.33%'],
        result: 'Selling price is $60.'
      },
      limitations: []
    },
    faqs: [
      { question: 'Why are markup and margin different?', answer: 'Markup is based on cost (how much you add to what you paid), while margin is based on selling price (what percentage of the cash you keep).' }
    ],
    references: [],
    relatedCalculators: ['gross-margin', 'profit-margin'],
    relatedGuides: []
  },
  {
    id: 'business-loan',
    slug: 'business-loan',
    name: 'Business Loan Calculator',
    title: 'Business Loan EMI & Interest Calculator | MoneyMetricsHub',
    metaDescription: 'Calculate the monthly payments and amortization schedules of your commercial business financing lines.',
    shortDescription: 'Calculate monthly payments and total interest costs for business loans.',
    category: 'business',
    inputs: [
      { id: 'amount', label: 'Commercial Loan Amount ($)', type: 'number', defaultValue: 75000, min: 1000, prefix: '$' },
      { id: 'rate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: 7.9, min: 0.1, suffix: '%' },
      { id: 'months', label: 'Loan Term (Months)', type: 'number', defaultValue: 36, min: 3, max: 120, suffix: 'mo' }
    ],
    calculate: (inputs) => {
      const p = Number(inputs.amount);
      const r = Number(inputs.rate) / 100 / 12;
      const n = Number(inputs.months);

      const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalRepayment = emi * n;
      const totalInterest = totalRepayment - p;

      const chartData = [
        { name: 'Principal Borrowed', value: p },
        { name: 'Commercial Interest', value: totalInterest }
      ];

      return {
        summary: [
          { label: 'Monthly Payment (EMI)', value: `$${Math.round(emi).toLocaleString()}`, rawValue: emi, badgeColor: 'bg-blue-100 text-blue-800' },
          { label: 'Total Interest cost', value: `$${Math.round(totalInterest).toLocaleString()}`, rawValue: totalInterest, badgeColor: 'bg-red-100 text-red-800' },
          { label: 'Total Repayment Cost', value: `$${Math.round(totalRepayment).toLocaleString()}`, rawValue: totalRepayment }
        ],
        chartData,
        interpretation: `A commercial loan of $${p.toLocaleString()} at ${inputs.rate}% interest over ${n} months results in a monthly payment of $${Math.round(emi).toLocaleString()}. You repay a total of $${Math.round(totalRepayment).toLocaleString()}, with $${Math.round(totalInterest).toLocaleString()} going purely to interest charges.`
      };
    },
    formula: {
      equation: 'EMI = P * [r(1+r)^n] / [(1+r)^n - 1]',
      variables: [],
      explanation: 'Applies standard amortization equations representing fixed-rate commercial loans.',
      example: {
        scenario: 'Borrowing $75,000 for 3 years at 7.9%.',
        steps: ['r = 0.079 / 12 = 0.006583', 'n = 36', 'Computes EMI.'],
        result: 'EMI is $2,347.'
      },
      limitations: ['Does not capture administrative origination fees or variable interest rate provisions.']
    },
    faqs: [
      { question: 'What is a typical business loan term?', answer: 'Equipment and term loans usually run between 3 and 10 years, whereas working capital lines can be under a year.' }
    ],
    references: [],
    relatedCalculators: ['loan-calculator'],
    relatedGuides: []
  }
];
