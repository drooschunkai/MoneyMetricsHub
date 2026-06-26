import { CalculatorDefinition } from '../../types';

export const loansNewCalculators: CalculatorDefinition[] = [
  {
    id: 'mortgage-refinance',
    slug: 'mortgage-refinance',
    name: 'Mortgage Refinance Calculator',
    title: 'Mortgage Refinance Calculator | MoneyMetricsHub',
    metaDescription: 'Calculate your monthly mortgage refinance savings and find your exact break-even point in months.',
    shortDescription: 'Calculate your refinancing monthly savings and find your cost recovery break-even month.',
    category: 'loans',
    inputs: [
      { id: 'balance', label: 'Remaining Loan Balance ($)', type: 'number', defaultValue: 300000, min: 1000, prefix: '$' },
      { id: 'oldRate', label: 'Current Interest Rate (%)', type: 'number', defaultValue: 6.5, min: 0.1, max: 20, suffix: '%' },
      { id: 'newRate', label: 'New Interest Rate (%)', type: 'number', defaultValue: 5.0, min: 0.1, max: 20, suffix: '%' },
      { id: 'term', label: 'New Loan Term (Years)', type: 'number', defaultValue: 30, min: 5, max: 40, suffix: 'yrs' },
      { id: 'refiCost', label: 'Closing Costs / Fees ($)', type: 'number', defaultValue: 5000, min: 0, prefix: '$' }
    ],
    calculate: (inputs) => {
      const p = Number(inputs.balance);
      const rOld = Number(inputs.oldRate) / 100 / 12;
      const rNew = Number(inputs.newRate) / 100 / 12;
      const n = Number(inputs.term) * 12;
      const refiCost = Number(inputs.refiCost);

      // Estimate current payment (approx as 30yr remaining standard)
      const currentPmt = (p * rOld * Math.pow(1 + rOld, 360)) / (Math.pow(1 + rOld, 360) - 1);
      const newPmt = (p * rNew * Math.pow(1 + rNew, n)) / (Math.pow(1 + rNew, n) - 1);

      const monthlySavings = currentPmt - newPmt;
      const breakEvenMonths = monthlySavings > 0 ? refiCost / monthlySavings : 0;

      const chartData = [];
      let cumSavings = -refiCost;
      for (let m = 1; m <= Math.max(12, Math.round(breakEvenMonths * 2)); m += 6) {
        cumSavings += monthlySavings * 6;
        chartData.push({
          label: `Mo ${m}`,
          'Cumulative Savings': Math.round(cumSavings)
        });
      }

      return {
        summary: [
          { label: 'New Monthly Payment', value: `$${Math.round(newPmt).toLocaleString()}`, rawValue: newPmt, badgeColor: 'bg-blue-100 text-blue-800' },
          { label: 'Monthly Savings', value: `$${Math.round(monthlySavings).toLocaleString()}`, rawValue: monthlySavings, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'Break-Even Period', value: monthlySavings > 0 ? `${breakEvenMonths.toFixed(1)} months` : 'Never', rawValue: breakEvenMonths }
        ],
        chartData,
        chartKeys: [{ key: 'Cumulative Savings', color: '#10b981', label: 'Refi Savings Growth' }],
        interpretation: monthlySavings > 0 
          ? `By refinancing, your monthly mortgage payment drops by $${Math.round(monthlySavings).toLocaleString()}. You recoup your $${refiCost.toLocaleString()} refinancing closing costs in ${breakEvenMonths.toFixed(1)} months.`
          : `Refinancing at these rates does not lower your monthly payments. Consider a lower rate.`
      };
    },
    formula: {
      equation: 'Savings = Current Monthly Payment - New Monthly Payment',
      variables: [],
      explanation: 'Compares the standard monthly payments and divides refinancing costs by the savings to compute break-even timing.',
      example: {
        scenario: 'Savings of $200/month on a $5,000 refi cost.',
        steps: ['Savings = $200', 'Cost = $5,000', 'Divide $5,000 / $200 = 25'],
        result: '25 months break-even.'
      },
      limitations: ['Does not account for equity built before refinancing.']
    },
    faqs: [
      { question: 'When is refinancing worth it?', answer: 'It is typically worth it if you can lower your rate by 0.75% or more and plan to stay in the home longer than the break-even period.' }
    ],
    references: [],
    relatedCalculators: ['mortgage-calculator'],
    relatedGuides: []
  },
  {
    id: 'down-payment',
    slug: 'down-payment',
    name: 'Down Payment Calculator',
    title: 'Home Down Payment Calculator | MoneyMetricsHub',
    metaDescription: 'Calculate the size of your home down payment and create a savings goal plan to buy your dream house.',
    shortDescription: 'Calculate down payment cash requirements and create a target savings timeline.',
    category: 'loans',
    inputs: [
      { id: 'price', label: 'Target Home Purchase Price ($)', type: 'number', defaultValue: 400000, min: 1000, prefix: '$' },
      { id: 'pct', label: 'Down Payment Percentage (%)', type: 'number', defaultValue: 20, min: 1, max: 100, suffix: '%' },
      { id: 'savings', label: 'Current Savings For House ($)', type: 'number', defaultValue: 10000, min: 0, prefix: '$' },
      { id: 'monthly', label: 'How Much You Can Save Monthly ($)', type: 'number', defaultValue: 1500, min: 10, prefix: '$' }
    ],
    calculate: (inputs) => {
      const price = Number(inputs.price);
      const pct = Number(inputs.pct) / 100;
      const current = Number(inputs.savings);
      const monthly = Number(inputs.monthly);

      const reqDown = price * pct;
      const remainingToSave = Math.max(0, reqDown - current);
      const monthsNeeded = remainingToSave / (monthly > 0 ? monthly : 1);

      const chartData = [
        { name: 'Already Saved', value: current },
        { name: 'Still Needed', value: remainingToSave }
      ];

      return {
        summary: [
          { label: 'Required Down Payment', value: `$${reqDown.toLocaleString()}`, rawValue: reqDown, badgeColor: 'bg-blue-100 text-blue-800' },
          { label: 'Remaining to Save', value: `$${remainingToSave.toLocaleString()}`, rawValue: remainingToSave },
          { label: 'Timeline Needed', value: `${monthsNeeded.toFixed(1)} months`, rawValue: monthsNeeded, badgeColor: 'bg-emerald-100 text-emerald-800' }
        ],
        chartData,
        interpretation: `To put ${inputs.pct}% down on a $${price.toLocaleString()} home, you need $${reqDown.toLocaleString()} in cash. You need to save $${remainingToSave.toLocaleString()} more, taking ${monthsNeeded.toFixed(1)} months at $${monthly}/month.`
      };
    },
    formula: {
      equation: 'Down Payment = Price * Pct %',
      variables: [],
      explanation: 'Calculates the direct down payment check size and plans savings paths.',
      example: {
        scenario: '20% down on $300,000.',
        steps: ['Down Payment = $300,000 * 0.20'],
        result: 'Down payment of $60,000 is required.'
      },
      limitations: ['Does not include mortgage closing costs (approx 2-5% of loan amount).']
    },
    faqs: [
      { question: 'Do I have to put 20% down?', answer: 'No, some loans (like FHA or conventional) permit down payments as low as 3% to 5%, but require paying private mortgage insurance (PMI).' }
    ],
    references: [],
    relatedCalculators: ['mortgage-calculator'],
    relatedGuides: []
  },
  {
    id: 'affordability-calculator',
    slug: 'affordability-calculator',
    name: 'Home Affordability Calculator',
    title: 'How Much House Can I Afford? Calculator | MoneyMetricsHub',
    metaDescription: 'Determine your home purchasing power using verified lender debt-to-income (DTI) qualification guidelines.',
    shortDescription: 'Calculate your home buying budget using the standard financial 28/36 rule.',
    category: 'loans',
    inputs: [
      { id: 'income', label: 'Annual Household Income ($)', type: 'number', defaultValue: 100000, min: 1000, prefix: '$' },
      { id: 'debts', label: 'Monthly Debt Payments ($)', type: 'number', defaultValue: 400, min: 0, prefix: '$' },
      { id: 'downPayment', label: 'Down Payment Cash Available ($)', type: 'number', defaultValue: 40000, min: 0, prefix: '$' },
      { id: 'rate', label: 'Expected Mortgage Rate (%)', type: 'number', defaultValue: 6.5, min: 0.1, suffix: '%' }
    ],
    calculate: (inputs) => {
      const income = Number(inputs.income);
      const debts = Number(inputs.debts);
      const down = Number(inputs.downPayment);
      const r = Number(inputs.rate) / 100 / 12;

      // 28/36 Rule: Front-end (mortgage payment <= 28% of gross monthly income)
      // Back-end (mortgage + other debts <= 36% of gross monthly income)
      const monthlyIncome = income / 12;
      const frontEndMax = monthlyIncome * 0.28;
      const backEndMax = (monthlyIncome * 0.36) - debts;
      
      const maxMonthlyPmt = Math.min(frontEndMax, backEndMax);

      // Solve for maximum affordable loan based on max monthly payment
      // Pmt = Loan * r * (1+r)^n / ((1+r)^n - 1)
      const n = 360; // 30 year
      const factor = (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const maxLoan = maxMonthlyPmt / factor;
      const maxPrice = maxLoan + down;

      const chartData = [
        { name: 'Max Loan Amount', value: maxLoan },
        { name: 'Down Payment', value: down }
      ];

      return {
        summary: [
          { label: 'Affordable House Price', value: `$${Math.round(maxPrice).toLocaleString()}`, rawValue: maxPrice, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'Maximum Monthly Pmt', value: `$${Math.round(maxMonthlyPmt).toLocaleString()}`, rawValue: maxMonthlyPmt, badgeColor: 'bg-blue-100 text-blue-800' },
          { label: 'Maximum Loan Amount', value: `$${Math.round(maxLoan).toLocaleString()}`, rawValue: maxLoan }
        ],
        chartData,
        interpretation: `With $${income.toLocaleString()} in annual income and $${debts}/month in debt, your affordable home price limit is $${Math.round(maxPrice).toLocaleString()}, keeping your monthly mortgage payment under $${Math.round(maxMonthlyPmt).toLocaleString()}.`
      };
    },
    formula: {
      equation: 'Max Monthly Mortgage = min(Income * 0.28, (Income * 0.36) - Debts)',
      variables: [],
      explanation: 'Uses standard conservative banking underwriting ratios to calculate maximum housing payments.',
      example: {
        scenario: 'Income of $10,000/month, debt of $500/month.',
        steps: [
          'Front end: $10,000 * 0.28 = $2,800',
          'Back end: ($10,000 * 0.36) - $500 = $3,100',
          'Max payment is $2,800'
        ],
        result: 'Maximum monthly payment of $2,800 is allowed.'
      },
      limitations: ['Does not account for local property tax rates and home insurance variations.']
    },
    faqs: [
      { question: 'What is the 28/36 rule?', answer: 'Lenders recommend that your housing costs not exceed 28% of your gross income, and total debt payments not exceed 36%.' }
    ],
    references: [],
    relatedCalculators: ['mortgage-calculator'],
    relatedGuides: []
  },
  {
    id: 'rent-vs-buy',
    slug: 'rent-vs-buy',
    name: 'Rent vs Buy Calculator',
    title: 'Rent vs Buy Calculator | MoneyMetricsHub',
    metaDescription: 'Compare the net financial costs of renting a home versus buying a property over a specified timeline.',
    shortDescription: 'Compare long-term costs of renting a home versus purchasing a home side-by-side.',
    category: 'loans',
    inputs: [
      { id: 'rent', label: 'Monthly Rent ($)', type: 'number', defaultValue: 2000, min: 100, prefix: '$' },
      { id: 'price', label: 'Home Purchase Price ($)', type: 'number', defaultValue: 350000, min: 1000, prefix: '$' },
      { id: 'years', label: 'Time Horizon (Years)', type: 'number', defaultValue: 10, min: 1, max: 30, suffix: 'yrs' }
    ],
    calculate: (inputs) => {
      const rent = Number(inputs.rent);
      const price = Number(inputs.price);
      const t = Number(inputs.years);

      // Simple 10-year cumulative calculation
      // Rent side
      let totalRentPaid = 0;
      let currentRent = rent;
      for (let yr = 1; yr <= t; yr++) {
        totalRentPaid += currentRent * 12;
        currentRent *= 1.03; // 3% rent inflation
      }

      // Buy side (mortgage + taxes/insurance/maintenance approx 6% of price annually)
      const down = price * 0.1;
      const loan = price - down;
      const r = 0.065 / 12; // 6.5% interest
      const monthlyMortgage = (loan * r * Math.pow(1 + r, 360)) / (Math.pow(1 + r, 360) - 1);
      
      const totalMortgagePaid = monthlyMortgage * 12 * t;
      const propertyTaxesAndMaintenance = price * 0.03 * t; // 3% annually

      const totalBuyCost = down + totalMortgagePaid + propertyTaxesAndMaintenance;
      const endingHomeValue = price * Math.pow(1.04, t); // 4% annual home appreciation
      const netBuyCost = totalBuyCost - (endingHomeValue - loan); // subtract equity built

      const chartData = [
        { name: 'Cumulative Rent Cost', Renting: Math.round(totalRentPaid), Buying: 0 },
        { name: 'Net Buying Cost', Renting: 0, Buying: Math.round(netBuyCost) }
      ];

      return {
        summary: [
          { label: 'Total Rent Paid', value: `$${Math.round(totalRentPaid).toLocaleString()}`, rawValue: totalRentPaid, badgeColor: 'bg-blue-100 text-blue-800' },
          { label: 'Net Buy Cost (Minus Equity)', value: `$${Math.round(netBuyCost).toLocaleString()}`, rawValue: netBuyCost, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'Estimated Future Home Value', value: `$${Math.round(endingHomeValue).toLocaleString()}`, rawValue: endingHomeValue }
        ],
        chartData,
        interpretation: netBuyCost < totalRentPaid
          ? `Buying is financially optimal over ${t} years. Your net home purchase cost (factoring in $${Math.round(endingHomeValue - loan).toLocaleString()} equity growth) is $${Math.round(netBuyCost).toLocaleString()}, saving you $${Math.round(totalRentPaid - netBuyCost).toLocaleString()} compared to renting.`
          : `Renting is financially optimal. Renting costs $${Math.round(totalRentPaid).toLocaleString()} while buying would net a cost of $${Math.round(netBuyCost).toLocaleString()} due to transaction, maintenance, and interest friction.`
      };
    },
    formula: {
      equation: 'Net Buy Cost = Buy Costs - Future Equity Gain',
      variables: [],
      explanation: 'Sums all buying outlays and offsets them by home appreciation and principal payoff to yield the true cost of purchase.',
      example: {
        scenario: 'Renting for $2,000/mo vs Buying $350k home.',
        steps: ['Calculate cumulative rent with rent inflation.', 'Calculate mortgage, taxes, and home value growth.'],
        result: 'Yields comparison balances.'
      },
      limitations: ['Does not account for opportunity costs of down payment capital returns in stock markets.']
    },
    faqs: [
      { question: 'What is the "5% rule" in rent vs buy?', answer: 'Buying typically has unrecoverable costs of around 5% of home value annually (property taxes, maintenance, interest). If rent is cheaper than that, renting is preferred.' }
    ],
    references: [],
    relatedCalculators: ['mortgage-calculator'],
    relatedGuides: []
  },
  {
    id: 'mortgage-amortization',
    slug: 'mortgage-amortization',
    name: 'Mortgage Amortization Calculator',
    title: 'Mortgage Amortization Schedule Calculator | MoneyMetricsHub',
    metaDescription: 'Generate a full monthly amortization schedule for your mortgage to see how much goes to principal vs. interest.',
    shortDescription: 'Generate a complete monthly or yearly mortgage interest amortization schedule.',
    category: 'loans',
    inputs: [
      { id: 'price', label: 'Home Price ($)', type: 'number', defaultValue: 300000, min: 1000, prefix: '$' },
      { id: 'down', label: 'Down Payment ($)', type: 'number', defaultValue: 60000, min: 0, prefix: '$' },
      { id: 'rate', label: 'Interest Rate (%)', type: 'number', defaultValue: 6.5, min: 0.1, suffix: '%' },
      { id: 'term', label: 'Amortization Term (Years)', type: 'number', defaultValue: 30, min: 5, max: 40, suffix: 'yrs' }
    ],
    calculate: (inputs) => {
      const p = Number(inputs.price) - Number(inputs.down);
      const r = Number(inputs.rate) / 100 / 12;
      const termYears = Number(inputs.term);
      const n = termYears * 12;

      const monthlyPmt = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      
      let balance = p;
      let cumulativeInterest = 0;
      let cumulativePrincipal = 0;
      const breakdown = [];
      const chartData = [];

      for (let yr = 1; yr <= termYears; yr++) {
        let yrInterest = 0;
        let yrPrincipal = 0;

        for (let m = 1; m <= 12; m++) {
          const interestShare = balance * r;
          const principalShare = monthlyPmt - interestShare;

          yrInterest += interestShare;
          yrPrincipal += principalShare;
          balance = Math.max(0, balance - principalShare);
        }

        cumulativeInterest += yrInterest;
        cumulativePrincipal += yrPrincipal;

        chartData.push({
          label: `Yr ${yr}`,
          'Remaining Balance': Math.round(balance),
          'Cumulative Interest': Math.round(cumulativeInterest)
        });

        breakdown.push({
          year: yr,
          interest: Math.round(yrInterest),
          principal: Math.round(yrPrincipal),
          balance: Math.round(balance)
        });
      }

      return {
        summary: [
          { label: 'Monthly Base Payment', value: `$${Math.round(monthlyPmt).toLocaleString()}`, rawValue: monthlyPmt, badgeColor: 'bg-blue-100 text-blue-800' },
          { label: 'Total Principal', value: `$${Math.round(p).toLocaleString()}`, rawValue: p },
          { label: 'Total Interest Cost', value: `$${Math.round(cumulativeInterest).toLocaleString()}`, rawValue: cumulativeInterest, badgeColor: 'bg-emerald-100 text-emerald-800' }
        ],
        breakdown,
        chartData,
        chartKeys: [
          { key: 'Remaining Balance', color: '#3b82f6', label: 'Loan Balance' },
          { key: 'Cumulative Interest', color: '#10b981', label: 'Interest Paid' }
        ],
        interpretation: `For a loan of $${p.toLocaleString()}, you will pay $${Math.round(monthlyPmt).toLocaleString()}/month. Over the course of ${termYears} years, you will repay a total of $${Math.round(p + cumulativeInterest).toLocaleString()}, consisting of $${Math.round(cumulativeInterest).toLocaleString()} in pure interest.`
      };
    },
    formula: {
      equation: 'M = P * [r(1+r)^n] / [(1+r)^n - 1]',
      variables: [
        { name: 'M', description: 'Monthly mortgage payment' },
        { name: 'P', description: 'Starting loan balance' }
      ],
      explanation: 'Calculates the amortization rate needed to bring the balance to exactly zero over the mortgage term.',
      example: {
        scenario: 'A 30-year, $240,000 mortgage at 6.5%.',
        steps: ['r = 0.065 / 12 = 0.005417', 'n = 360', 'Compute mortgage factor.'],
        result: 'Monthly payment is $1,517.'
      },
      limitations: ['Does not include escrows (taxes, PMI, home hazard insurance).']
    },
    faqs: [
      { question: 'What is amortization?', answer: 'The systematic scheduling of regular loan payments to steadily pay off both interest and principal over a fixed timeframe.' }
    ],
    references: [],
    relatedCalculators: ['mortgage-calculator'],
    relatedGuides: []
  },
  {
    id: 'extra-payment-mortgage',
    slug: 'extra-payment-mortgage',
    name: 'Extra Payment Mortgage Calculator',
    title: 'Extra Principal Mortgage Payment Calculator | MoneyMetricsHub',
    metaDescription: 'See how adding extra cash monthly or annually to your principal reduces your mortgage term and saves thousands in interest.',
    shortDescription: 'Calculate how much time and interest you save by making extra monthly principal payments.',
    category: 'loans',
    inputs: [
      { id: 'price', label: 'Home Price ($)', type: 'number', defaultValue: 300000, min: 1000, prefix: '$' },
      { id: 'down', label: 'Down Payment ($)', type: 'number', defaultValue: 60000, min: 0, prefix: '$' },
      { id: 'rate', label: 'Interest Rate (%)', type: 'number', defaultValue: 6.5, min: 0.1, suffix: '%' },
      { id: 'term', label: 'Amortization Term (Years)', type: 'number', defaultValue: 30, min: 5, max: 40, suffix: 'yrs' },
      { id: 'extra', label: 'Extra Monthly Principal ($)', type: 'number', defaultValue: 200, min: 0, prefix: '$' }
    ],
    calculate: (inputs) => {
      const p = Number(inputs.price) - Number(inputs.down);
      const r = Number(inputs.rate) / 100 / 12;
      const termYears = Number(inputs.term);
      const n = termYears * 12;
      const extra = Number(inputs.extra);

      const standardMonthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

      // standard run
      let balanceStd = p;
      let totalInterestStd = 0;
      for (let m = 1; m <= n; m++) {
        const intShare = balanceStd * r;
        const prinShare = standardMonthly - intShare;
        totalInterestStd += intShare;
        balanceStd = Math.max(0, balanceStd - prinShare);
      }

      // extra run
      let balanceExtra = p;
      let totalInterestExtra = 0;
      let monthsCount = 0;
      const chartData = [];

      for (let m = 1; m <= n; m++) {
        if (balanceExtra <= 0) break;
        const intShare = balanceExtra * r;
        const prinShare = (standardMonthly - intShare) + extra;
        
        totalInterestExtra += intShare;
        balanceExtra = Math.max(0, balanceExtra - prinShare);
        monthsCount++;

        if (m % 12 === 0) {
          chartData.push({
            label: `Yr ${m/12}`,
            'Standard Balance': Math.round(balanceStd), // placeholder approximation
            'With Extra Payment': Math.round(balanceExtra)
          });
        }
      }

      const yearsSaved = termYears - (monthsCount / 12);
      const interestSaved = totalInterestStd - totalInterestExtra;

      return {
        summary: [
          { label: 'Interest Saved', value: `$${Math.round(interestSaved).toLocaleString()}`, rawValue: interestSaved, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'Time Saved', value: `${yearsSaved.toFixed(1)} years`, rawValue: yearsSaved, badgeColor: 'bg-blue-100 text-blue-800' },
          { label: 'New Loan Term', value: `${(monthsCount/12).toFixed(1)} years`, rawValue: monthsCount/12 }
        ],
        chartData,
        interpretation: `By making an extra $${extra}/month payment, you will pay off your mortgage ${yearsSaved.toFixed(1)} years early, pocketing $${Math.round(interestSaved).toLocaleString()} in saved interest fees.`
      };
    },
    formula: {
      equation: 'Amortization Loop with extra Principal',
      variables: [],
      explanation: 'Runs two parallel amortization loops, applying the extra monthly payment directly to principal deduction to bypass interest generation.',
      example: {
        scenario: 'Adding $200/mo extra on a $240,000 mortgage.',
        steps: ['Calculates standard interest.', 'Calculates interest with $200 added principal deduction.'],
        result: 'Saves years and thousands.'
      },
      limitations: ['Some banks require explicit notification to apply extra payments to principal.']
    },
    faqs: [
      { question: 'Should I make extra principal payments?', answer: 'Yes, because extra payments lower your loan balance directly, instantly saving you on all subsequent compounding interest.' }
    ],
    references: [],
    relatedCalculators: ['mortgage-calculator'],
    relatedGuides: []
  },
  {
    id: 'biweekly-mortgage',
    slug: 'biweekly-mortgage',
    name: 'Biweekly Mortgage Calculator',
    title: 'Biweekly Mortgage Payment Calculator | MoneyMetricsHub',
    metaDescription: 'Calculate how making biweekly mortgage payments instead of monthly payments shortens your mortgage term.',
    shortDescription: 'Calculate standard savings achieved by making biweekly payments.',
    category: 'loans',
    inputs: [
      { id: 'amount', label: 'Loan Balance ($)', type: 'number', defaultValue: 250000, min: 1000, prefix: '$' },
      { id: 'rate', label: 'Interest Rate (%)', type: 'number', defaultValue: 6.5, min: 0.1, suffix: '%' },
      { id: 'term', label: 'Loan Term (Years)', type: 'number', defaultValue: 30, min: 5, max: 40, suffix: 'yrs' }
    ],
    calculate: (inputs) => {
      const p = Number(inputs.amount);
      const r = Number(inputs.rate) / 100 / 12;
      const t = Number(inputs.term);
      const n = t * 12;

      const monthlyPmt = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      
      // Biweekly plan: pay half of the monthly payment every 2 weeks (26 times/year)
      // Equivalent to making 13 full payments per year (1 extra payment)
      const biweeklyPmt = monthlyPmt / 2;

      // Simulate biweekly run
      let balance = p;
      let biweeklyCumulativeInterest = 0;
      let biweeklyPeriodsCount = 0;
      const biweeklyRate = Number(inputs.rate) / 100 / 26;

      while (balance > 0 && biweeklyPeriodsCount < 1000) {
        const intShare = balance * biweeklyRate;
        const prinShare = biweeklyPmt - intShare;
        biweeklyCumulativeInterest += intShare;
        balance = Math.max(0, balance - prinShare);
        biweeklyPeriodsCount++;
      }

      // Standard run
      let stdBalance = p;
      let stdCumulativeInterest = 0;
      for (let m = 1; m <= n; m++) {
        const intShare = stdBalance * r;
        const prinShare = monthlyPmt - intShare;
        stdCumulativeInterest += intShare;
        stdBalance = Math.max(0, stdBalance - prinShare);
      }

      const yearsBiweekly = biweeklyPeriodsCount / 26;
      const yearsSaved = t - yearsBiweekly;
      const interestSaved = stdCumulativeInterest - biweeklyCumulativeInterest;

      const chartData = [
        { name: 'Standard Interest', value: stdCumulativeInterest },
        { name: 'Biweekly Interest', value: biweeklyCumulativeInterest }
      ];

      return {
        summary: [
          { label: 'Biweekly Half-Payment', value: `$${Math.round(biweeklyPmt).toLocaleString()}`, rawValue: biweeklyPmt, badgeColor: 'bg-blue-100 text-blue-800' },
          { label: 'Interest Savings', value: `$${Math.round(interestSaved).toLocaleString()}`, rawValue: interestSaved, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'Time Saved', value: `${yearsSaved.toFixed(1)} years`, rawValue: yearsSaved }
        ],
        chartData,
        interpretation: `By switching to biweekly payments of $${Math.round(biweeklyPmt).toLocaleString()}, you pay off your loan ${yearsSaved.toFixed(1)} years earlier and save $${Math.round(interestSaved).toLocaleString()} in total interest.`
      };
    },
    formula: {
      equation: 'Biweekly loop with 26 periods/yr',
      variables: [],
      explanation: 'Simulates 26 half-payments annually to accelerate loan amortization.',
      example: {
        scenario: 'Standard 30 year mortgage at 6.5%.',
        steps: ['Calculates 26 periods compounding.'],
        result: 'Cuts years off loan life.'
      },
      limitations: ['Some mortgage servicers charge transactional administration setup fees.']
    },
    faqs: [
      { question: 'Why does biweekly save money?', answer: 'Paying biweekly means making 26 half-payments (or 13 full payments), resulting in one extra full payment applied directly to principal each year.' }
    ],
    references: [],
    relatedCalculators: ['mortgage-calculator'],
    relatedGuides: []
  },
  {
    id: 'heloc-calculator',
    slug: 'heloc-calculator',
    name: 'HELOC Calculator',
    title: 'HELOC Home Equity Line of Credit Calculator | MoneyMetricsHub',
    metaDescription: 'Calculate your available HELOC limit and estimate monthly payments for home equity lines of credit.',
    shortDescription: 'Calculate available Home Equity Line of Credit limits and estimate payments.',
    category: 'loans',
    inputs: [
      { id: 'value', label: 'Estimated Home Value ($)', type: 'number', defaultValue: 450000, min: 1000, prefix: '$' },
      { id: 'balance', label: 'Current Mortgage Balance ($)', type: 'number', defaultValue: 250000, min: 0, prefix: '$' },
      { id: 'ltv', label: 'Maximum LTV Allowed (%)', type: 'number', defaultValue: 80, min: 50, max: 95, suffix: '%' },
      { id: 'rate', label: 'HELOC Interest Rate (%)', type: 'number', defaultValue: 8.5, min: 0.1, suffix: '%' }
    ],
    calculate: (inputs) => {
      const val = Number(inputs.value);
      const bal = Number(inputs.balance);
      const ltvLimit = Number(inputs.ltv) / 100;
      const rate = Number(inputs.rate) / 100;

      const totalLtvCap = val * ltvLimit;
      const availableEquity = Math.max(0, totalLtvCap - bal);
      
      // Interest-only monthly payment on a standard $10,000 draw
      const testDraw = Math.min(10000, availableEquity);
      const monthlyInterestOnly = (testDraw * rate) / 12;

      const chartData = [
        { name: 'Mortgage Balance', value: bal },
        { name: 'Available HELOC Equity', value: availableEquity },
        { name: 'Untapped Value', value: val - totalLtvCap }
      ];

      return {
        summary: [
          { label: 'Available HELOC Limit', value: `$${Math.round(availableEquity).toLocaleString()}`, rawValue: availableEquity, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'Monthly Interest-Only Pmt (per $10k draw)', value: `$${monthlyInterestOnly.toFixed(2)}`, rawValue: monthlyInterestOnly, badgeColor: 'bg-blue-100 text-blue-800' },
          { label: 'Combined LTV Capital Limit', value: `$${Math.round(totalLtvCap).toLocaleString()}`, rawValue: totalLtvCap }
        ],
        chartData,
        interpretation: `Based on an ${inputs.ltv}% LTV cap, your home equity lending limit is $${Math.round(totalLtvCap).toLocaleString()}. Subtracting your $${bal.toLocaleString()} mortgage leaves an available HELOC line of $${Math.round(availableEquity).toLocaleString()}.`
      };
    },
    formula: {
      equation: 'HELOC Limit = (Home Value * LTV Cap) - Mortgage Balance',
      variables: [],
      explanation: 'Determines the lending cap based on equity and subtracts current mortgage lien balances.',
      example: {
        scenario: 'Value = $400k, Mortgage = $200k, LTV = 80%.',
        steps: ['Cap = $400,000 * 0.8 = $320,000', 'HELOC = $320,000 - $200,000 = $120,000'],
        result: '$120,000 available HELOC.'
      },
      limitations: ['Home appraisal checks can change values significantly.']
    },
    faqs: [
      { question: 'How do HELOC payments work?', answer: 'HELOCs typically feature a 10-year interest-only draw period followed by a 20-year principal+interest repayment period.' }
    ],
    references: [],
    relatedCalculators: ['mortgage-calculator'],
    relatedGuides: []
  }
];
