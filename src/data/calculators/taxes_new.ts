import { CalculatorDefinition } from '../../types';

export const taxesNewCalculators: CalculatorDefinition[] = [
  {
    id: 'income-tax-calculator',
    slug: 'income-tax-calculator',
    name: 'Income Tax Calculator',
    title: 'Income Tax Bracket Calculator | MoneyMetricsHub',
    metaDescription: 'Estimate your progressive federal income tax liabilities and brackets using current standard tax codes.',
    shortDescription: 'Estimate your annual federal income tax liabilities, progressive brackets, and deductions.',
    category: 'taxes',
    inputs: [
      { id: 'income', label: 'Gross Annual Income ($)', type: 'number', defaultValue: 75000, min: 1000, prefix: '$' },
      {
        id: 'status',
        label: 'Filing Status',
        type: 'select',
        defaultValue: 'single',
        options: [
          { label: 'Single filer', value: 'single' },
          { label: 'Married filing jointly', value: 'joint' }
        ]
      }
    ],
    calculate: (inputs) => {
      const gross = Number(inputs.income);
      const status = inputs.status;

      // 2024 tax code benchmark
      const stdDeduction = status === 'single' ? 14600 : 29200;
      const taxableIncome = Math.max(0, gross - stdDeduction);

      // Simple federal progressive brackets
      const singleBrackets = [
        { limit: 11600, rate: 0.10 },
        { limit: 47150, rate: 0.12 },
        { limit: 100525, rate: 0.22 },
        { limit: 191950, rate: 0.24 },
        { limit: 243725, rate: 0.32 },
        { limit: 609350, rate: 0.35 },
        { limit: Infinity, rate: 0.37 }
      ];

      const jointBrackets = [
        { limit: 23200, rate: 0.10 },
        { limit: 94300, rate: 0.12 },
        { limit: 201050, rate: 0.22 },
        { limit: 383900, rate: 0.24 },
        { limit: 487450, rate: 0.32 },
        { limit: 731200, rate: 0.35 },
        { limit: Infinity, rate: 0.37 }
      ];

      const activeBrackets = status === 'single' ? singleBrackets : jointBrackets;
      let taxOwed = 0;
      let remainingTaxable = taxableIncome;
      let previousLimit = 0;

      for (const b of activeBrackets) {
        const bracketRange = b.limit - previousLimit;
        if (remainingTaxable > bracketRange) {
          taxOwed += bracketRange * b.rate;
          remainingTaxable -= bracketRange;
          previousLimit = b.limit;
        } else {
          taxOwed += remainingTaxable * b.rate;
          break;
        }
      }

      const effectiveRate = gross > 0 ? (taxOwed / gross) * 100 : 0;
      const marginalRate = activeBrackets.find(b => taxableIncome <= b.limit)?.rate || 0.37;

      const chartData = [
        { name: 'Estimated Federal Tax', value: taxOwed },
        { name: 'Deduction Amount', value: stdDeduction },
        { name: 'Take-Home Cash', value: gross - taxOwed }
      ];

      return {
        summary: [
          { label: 'Estimated Tax Owed', value: `$${Math.round(taxOwed).toLocaleString()}`, rawValue: taxOwed, badgeColor: 'bg-red-100 text-red-800' },
          { label: 'Effective Tax Rate', value: `${effectiveRate.toFixed(1)}%`, rawValue: effectiveRate, badgeColor: 'bg-blue-100 text-blue-800' },
          { label: 'Take-Home Salary', value: `$${Math.round(gross - taxOwed).toLocaleString()}`, rawValue: gross - taxOwed, badgeColor: 'bg-emerald-100 text-emerald-800' }
        ],
        chartData,
        interpretation: `For a ${status} filer earning $${gross.toLocaleString()} gross, the standard deduction reduces your taxable base to $${taxableIncome.toLocaleString()}. Your total estimated federal tax is $${Math.round(taxOwed).toLocaleString()}, resulting in an effective tax rate of ${effectiveRate.toFixed(1)}% and a marginal bracket of ${(marginalRate * 100).toFixed(0)}%.`
      };
    },
    formula: {
      equation: 'Taxable Income = Gross Income - Standard Deduction',
      variables: [],
      explanation: 'Applies progressive federal income tiers on top of taxable income values to compute estimated tax obligations.',
      example: {
        scenario: 'Single filer earning $75,000.',
        steps: ['Taxable = $75,000 - $14,600 = $60,400', '10% on first $11,600 = $1,160', '12% on next $35,550 = $4,266', '22% on remaining $13,250 = $2,915'],
        result: 'Total Federal Tax = $8,341.'
      },
      limitations: ['Does not capture local municipal or state taxes, nor custom tax credits (like child credits).']
    },
    faqs: [
      { question: 'What is a marginal tax rate?', answer: 'The percentage of tax applied to your next single dollar of income. It is always higher than your average or effective rate.' }
    ],
    references: [],
    relatedCalculators: ['effective-tax-rate'],
    relatedGuides: []
  },
  {
    id: 'capital-gains-tax',
    slug: 'capital-gains-tax',
    name: 'Capital Gains Tax Calculator',
    title: 'Capital Gains Tax Calculator | MoneyMetricsHub',
    metaDescription: 'Calculate long-term or short-term capital gains tax liabilities on your stock, crypto, or property sales.',
    shortDescription: 'Calculate estimated capital gains liabilities on investment appreciation.',
    category: 'taxes',
    inputs: [
      { id: 'sellPrice', label: 'Asset Sale Price ($)', type: 'number', defaultValue: 50000, min: 0, prefix: '$' },
      { id: 'buyPrice', label: 'Original Cost Basis ($)', type: 'number', defaultValue: 30000, min: 0, prefix: '$' },
      { id: 'holding', label: 'Holding Period', type: 'select', defaultValue: 'long', options: [
        { label: 'Long Term (Over 1 Year)', value: 'long' },
        { label: 'Short Term (Under 1 Year)', value: 'short' }
      ]},
      { id: 'income', label: 'Other Annual Gross Income ($)', type: 'number', defaultValue: 85000, min: 0, prefix: '$' }
    ],
    calculate: (inputs) => {
      const sell = Number(inputs.sellPrice);
      const buy = Number(inputs.buyPrice);
      const isLong = inputs.holding === 'long';
      const otherIncome = Number(inputs.income);

      const profit = Math.max(0, sell - buy);
      let taxOwed = 0;
      let rate = 0;

      if (isLong) {
        // 2024 Federal long-term gains tax brackets
        // 0% up to $47,025 taxable income
        // 15% up to $518,900
        // 20% over $518,900
        const combined = otherIncome + profit;
        if (combined <= 47025) {
          rate = 0;
        } else if (combined <= 518900) {
          rate = 0.15;
        } else {
          rate = 0.20;
        }
        taxOwed = profit * rate;
      } else {
        // Short term is taxed at ordinary income rates (estimated average of 22%)
        rate = 0.22;
        taxOwed = profit * rate;
      }

      const chartData = [
        { name: 'Original Cost Basis', value: buy },
        { name: 'Capital Gains Tax', value: taxOwed },
        { name: 'Net Post-Tax Profit', value: profit - taxOwed }
      ];

      return {
        summary: [
          { label: 'Net Profit Owed', value: `$${profit.toLocaleString()}`, rawValue: profit },
          { label: 'Estimated Tax', value: `$${Math.round(taxOwed).toLocaleString()}`, rawValue: taxOwed, badgeColor: 'bg-red-100 text-red-800' },
          { label: 'Net Profit (After-Tax)', value: `$${Math.round(profit - taxOwed).toLocaleString()}`, rawValue: profit - taxOwed, badgeColor: 'bg-emerald-100 text-emerald-800' }
        ],
        chartData,
        interpretation: `Your sale generated a net investment gain of $${profit.toLocaleString()}. Under federal ${isLong ? 'Long-Term' : 'Short-Term'} rules, you face an estimated ${rate * 100}% capital gains bracket, resulting in a tax of $${Math.round(taxOwed).toLocaleString()}.`
      };
    },
    formula: {
      equation: 'Tax = (Sale Price - Cost Basis) * Gains Bracket %',
      variables: [],
      explanation: 'Multiplies total investment profits by federal capital gains rates, matching your holding period and income limits.',
      example: {
        scenario: 'Selling stock profit of $20,000 held for 2 years.',
        steps: ['Cost basis was $30,000, sold for $50,000.', 'Profit is $20,000.', 'Long-term rate of 15% applies.'],
        result: 'Tax is $3,000.'
      },
      limitations: ['Does not capture state capital gains tax levies (such as California ordinary bracket surcharges).']
    },
    faqs: [
      { question: 'Why is short-term tax higher than long-term?', answer: 'Short-term capital gains are taxed at ordinary progressive income tax rates, while long-term gains receive favorable lower rates to encourage long-term investing.' }
    ],
    references: [],
    relatedCalculators: ['income-tax-calculator'],
    relatedGuides: []
  },
  {
    id: 'sales-tax-calculator',
    slug: 'sales-tax-calculator',
    name: 'Sales Tax Calculator',
    title: 'Sales Tax & Total Cost Calculator | MoneyMetricsHub',
    metaDescription: 'Calculate the total purchase cost of any retail item after factoring in local state and city sales tax rates.',
    shortDescription: 'Calculate sales tax liabilities and overall total purchase costs.',
    category: 'taxes',
    inputs: [
      { id: 'price', label: 'Item Base Price ($)', type: 'number', defaultValue: 150, min: 0.01, prefix: '$' },
      { id: 'rate', label: 'Sales Tax Rate (%)', type: 'number', defaultValue: 8.25, min: 0, max: 25, step: 0.01, suffix: '%' }
    ],
    calculate: (inputs) => {
      const price = Number(inputs.price);
      const r = Number(inputs.rate) / 100;

      const taxAmount = price * r;
      const total = price + taxAmount;

      const chartData = [
        { name: 'Base Price', value: price },
        { name: 'Sales Tax', value: taxAmount }
      ];

      return {
        summary: [
          { label: 'Total Price', value: `$${total.toFixed(2)}`, rawValue: total, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'Sales Tax Amount', value: `$${taxAmount.toFixed(2)}`, rawValue: taxAmount, badgeColor: 'bg-red-100 text-red-800' },
          { label: 'Base Cost', value: `$${price.toFixed(2)}`, rawValue: price }
        ],
        chartData,
        interpretation: `An item priced at $${price.toFixed(2)} under an active ${inputs.rate}% sales tax rate generates a sales tax charge of $${taxAmount.toFixed(2)}, resulting in a total payment of $${total.toFixed(2)}.`
      };
    },
    formula: {
      equation: 'Total Cost = Price * (1 + Tax Rate %)',
      variables: [],
      explanation: 'Multiplies item costs by the tax rate to locate the final surcharge.',
      example: {
        scenario: 'Item priced at $100 with an 8.25% sales tax.',
        steps: ['Tax = $100 * 0.0825 = $8.25', 'Total = $108.25'],
        result: '$108.25 final cost.'
      },
      limitations: ['Tax rates differ heavily by county and specific city boundaries.']
    },
    faqs: [
      { question: 'Is sales tax progressive?', answer: 'No, sales tax is a flat or regressive tax as it applies equally to all shoppers, regardless of individual incomes.' }
    ],
    references: [],
    relatedCalculators: ['vat-calculator'],
    relatedGuides: []
  },
  {
    id: 'vat-calculator',
    slug: 'vat-calculator',
    name: 'VAT Calculator',
    title: 'VAT (Value Added Tax) Calculator | MoneyMetricsHub',
    metaDescription: 'Calculate Value Added Tax (VAT) amounts easily. Supports both inclusive and exclusive VAT computations.',
    shortDescription: 'Calculate VAT amounts and base prices for inclusive and exclusive taxes.',
    category: 'taxes',
    inputs: [
      { id: 'amount', label: 'Amount ($)', type: 'number', defaultValue: 120, min: 0.1, prefix: '$' },
      { id: 'rate', label: 'VAT Rate (%)', type: 'number', defaultValue: 20, min: 0, suffix: '%' },
      { id: 'type', label: 'Tax Structure', type: 'select', defaultValue: 'inclusive', options: [
        { label: 'VAT Inclusive (Price already has tax)', value: 'inclusive' },
        { label: 'VAT Exclusive (Add tax to price)', value: 'exclusive' }
      ]}
    ],
    calculate: (inputs) => {
      const amt = Number(inputs.amount);
      const r = Number(inputs.rate) / 100;
      const isInclusive = inputs.type === 'inclusive';

      let vatAmount = 0;
      let netPrice = 0;
      let total = 0;

      if (isInclusive) {
        // net price = amount / (1 + r)
        netPrice = amt / (1 + r);
        vatAmount = amt - netPrice;
        total = amt;
      } else {
        netPrice = amt;
        vatAmount = amt * r;
        total = amt + vatAmount;
      }

      const chartData = [
        { name: 'Net Price', value: netPrice },
        { name: 'VAT Surcharge', value: vatAmount }
      ];

      return {
        summary: [
          { label: 'Total Price', value: `$${total.toFixed(2)}`, rawValue: total, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'VAT Surcharge', value: `$${vatAmount.toFixed(2)}`, rawValue: vatAmount, badgeColor: 'bg-red-100 text-red-800' },
          { label: 'Net Base Price', value: `$${netPrice.toFixed(2)}`, rawValue: netPrice }
        ],
        chartData,
        interpretation: isInclusive
          ? `Out of a VAT-inclusive price of $${amt.toFixed(2)}, the base product cost is $${netPrice.toFixed(2)} and the VAT portion is $${vatAmount.toFixed(2)}.`
          : `For a VAT-exclusive price of $${amt.toFixed(2)}, adding ${inputs.rate}% VAT adds $${vatAmount.toFixed(2)}, making the total price $${total.toFixed(2)}.`
      };
    },
    formula: {
      equation: 'VAT Inclusive: Net = Gross / (1 + r)',
      variables: [],
      explanation: 'Extracts the underlying cost basis from gross amounts to determine tax collections.',
      example: {
        scenario: 'Inclusive $120 item at 20% VAT rate.',
        steps: ['Net = $120 / 1.2 = $100', 'VAT = $120 - $100 = $20'],
        result: 'VAT component is $20.'
      },
      limitations: []
    },
    faqs: [
      { question: 'What is VAT?', answer: 'Value Added Tax is a consumption tax placed on a product whenever value is added at each stage of the supply chain.' }
    ],
    references: [],
    relatedCalculators: ['sales-tax-calculator'],
    relatedGuides: []
  },
  {
    id: 'self-employment-tax',
    slug: 'self-employment-tax',
    name: 'Self Employment Tax Calculator',
    title: 'Self-Employment Tax (FICA) Calculator | MoneyMetricsHub',
    metaDescription: 'Calculate your self-employment tax obligations (15.3% Social Security and Medicare) based on 1099 freelancer net profits.',
    shortDescription: 'Calculate Federal Self-Employment FICA taxes owed on 1099 freelance income.',
    category: 'taxes',
    inputs: [
      { id: 'profit', label: 'Net Freelance Profits ($)', type: 'number', defaultValue: 60000, min: 0, prefix: '$' }
    ],
    calculate: (inputs) => {
      const profit = Number(inputs.profit);

      // SE FICA tax applies to 92.35% of net freelance earnings
      const taxableBase = profit * 0.9235;

      // 15.3% total (12.4% SS, 2.9% Medicare)
      // SS cap for 2024 is $168,600
      const ssCap = 168600;
      const ssTax = Math.min(taxableBase, ssCap) * 0.124;
      const medicareTax = taxableBase * 0.029;

      const totalTax = ssTax + medicareTax;

      const chartData = [
        { name: 'Social Security', value: ssTax },
        { name: 'Medicare Part', value: medicareTax },
        { name: 'Net Profit Keep', value: profit - totalTax }
      ];

      return {
        summary: [
          { label: 'Total SE FICA Tax', value: `$${Math.round(totalTax).toLocaleString()}`, rawValue: totalTax, badgeColor: 'bg-red-100 text-red-800' },
          { label: 'Social Security Port', value: `$${Math.round(ssTax).toLocaleString()}`, rawValue: ssTax },
          { label: 'Medicare Port', value: `$${Math.round(medicareTax).toLocaleString()}`, rawValue: medicareTax }
        ],
        chartData,
        interpretation: `For $${profit.toLocaleString()} in net 1099 business profits, your SE tax taxable base is $${Math.round(taxableBase).toLocaleString()}. You owe $${Math.round(ssTax).toLocaleString()} for SS and $${Math.round(medicareTax).toLocaleString()} for Medicare, totaling $${Math.round(totalTax).toLocaleString()}.`
      };
    },
    formula: {
      equation: 'Self Employment Tax = Net Profits * 0.9235 * 15.3%',
      variables: [],
      explanation: 'Emulates federal guidelines where sole proprietors pay both the employer and employee portions of FICA taxes, discount-adjusted by 7.65%.',
      example: {
        scenario: 'Freelancer earning $50,000 net profit.',
        steps: ['Taxable base = $50,000 * 0.9235 = $46,175', 'SE Tax = $46,175 * 0.153 = $7,064.78'],
        result: 'SE FICA tax owed is $7,064.78.'
      },
      limitations: ['Does not include separate ordinary federal/state progressive income taxes.']
    },
    faqs: [
      { question: 'Can I deduct self-employment tax?', answer: 'Yes, the IRS allows you to deduct 50% of your total self-employment tax amount from your gross income when calculating your progressive income tax.' }
    ],
    references: [],
    relatedCalculators: ['income-tax-calculator'],
    relatedGuides: []
  },
  {
    id: 'effective-tax-rate',
    slug: 'effective-tax-rate',
    name: 'Effective Tax Rate Calculator',
    title: 'Effective vs Marginal Tax Rate Calculator | MoneyMetricsHub',
    metaDescription: 'Calculate your effective (average) tax rate by comparing your total income with total tax payments.',
    shortDescription: 'Calculate your real average effective tax rate relative to total gross wages.',
    category: 'taxes',
    inputs: [
      { id: 'income', label: 'Total Annual Gross Income ($)', type: 'number', defaultValue: 90000, min: 1, prefix: '$' },
      { id: 'taxPaid', label: 'Total Taxes Paid ($)', type: 'number', defaultValue: 13500, min: 0, prefix: '$' }
    ],
    calculate: (inputs) => {
      const inc = Number(inputs.income);
      const paid = Number(inputs.taxPaid);

      const rate = (paid / inc) * 100;

      const chartData = [
        { name: 'Taxes Kept', value: inc - paid },
        { name: 'Taxes Paid', value: paid }
      ];

      return {
        summary: [
          { label: 'Effective Tax Rate', value: `${rate.toFixed(2)}%`, rawValue: rate, badgeColor: 'bg-blue-100 text-blue-800' },
          { label: 'Annual Income', value: `$${inc.toLocaleString()}`, rawValue: inc },
          { label: 'Taxes Paid', value: `$${paid.toLocaleString()}`, rawValue: paid }
        ],
        chartData,
        interpretation: `By paying $${paid.toLocaleString()} in taxes out of a $${inc.toLocaleString()} gross income, your effective tax rate (average tax paid per gross dollar) is exactly ${rate.toFixed(2)}%.`
      };
    },
    formula: {
      equation: 'Effective Tax Rate = (Total Tax Paid / Gross Income) * 100',
      variables: [],
      explanation: 'Calculates the real average rate of taxation on total incoming gross assets.',
      example: {
        scenario: 'Paying $15,000 taxes on $100,000 gross.',
        steps: ['Rate = ($15,000 / $100,000) * 100'],
        result: 'Effective tax rate is 15.00%.'
      },
      limitations: []
    },
    faqs: [
      { question: 'Why is my effective tax rate lower than my bracket?', answer: 'Because standard deductions and exemptions reduce your taxable base, and progressive brackets tax your initial dollars at lower rates.' }
    ],
    references: [],
    relatedCalculators: ['income-tax-calculator'],
    relatedGuides: []
  }
];
