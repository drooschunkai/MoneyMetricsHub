import { CalculatorDefinition } from '../../types';

export const debtNewCalculators: CalculatorDefinition[] = [
  {
    id: 'debt-payoff',
    slug: 'debt-payoff',
    name: 'Debt Payoff Calculator',
    title: 'Debt Payoff & Amortization Calculator | MoneyMetricsHub',
    metaDescription: 'Find your fastest path to becoming debt-free. Calculate payoff timelines and total interest costs.',
    shortDescription: 'Calculate how long it will take to pay off a loan or credit card with custom monthly payments.',
    category: 'debt',
    inputs: [
      { id: 'balance', label: 'Total Debt Balance ($)', type: 'number', defaultValue: 15000, min: 100, prefix: '$' },
      { id: 'rate', label: 'Interest Rate (APR %)', type: 'number', defaultValue: 18.0, min: 0.1, max: 40, suffix: '%' },
      { id: 'payment', label: 'Monthly Payment ($)', type: 'number', defaultValue: 500, min: 10, prefix: '$' }
    ],
    calculate: (inputs) => {
      const b = Number(inputs.balance);
      const r = Number(inputs.rate) / 100 / 12;
      const pmt = Number(inputs.payment);

      let balance = b;
      let totalInterest = 0;
      let months = 0;
      const chartData = [];

      // Minimum payment check to prevent infinite loop
      if (pmt <= b * r) {
        return {
          summary: [
            { label: 'Payoff Timeline', value: 'Infinite', badgeColor: 'bg-red-100 text-red-800' },
            { label: 'Action Needed', value: 'Increase monthly payment' }
          ],
          interpretation: `Your monthly payment of $${pmt} is less than or equal to the monthly compounding interest of $${Math.round(b * r)}. You will never pay off this debt at this rate. Increase your payment to make progress.`
        };
      }

      while (balance > 0 && months < 360) {
        const intShare = balance * r;
        const prinShare = pmt - intShare;
        
        totalInterest += intShare;
        balance = Math.max(0, balance - prinShare);
        months++;

        if (months % 6 === 0 || balance === 0) {
          chartData.push({
            label: `Mo ${months}`,
            'Remaining Balance': Math.round(balance)
          });
        }
      }

      return {
        summary: [
          { label: 'Time to Pay Off', value: `${months} months`, rawValue: months, badgeColor: 'bg-blue-100 text-blue-800' },
          { label: 'Total Interest Paid', value: `$${Math.round(totalInterest).toLocaleString()}`, rawValue: totalInterest, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'Total Payments', value: `$${Math.round(b + totalInterest).toLocaleString()}`, rawValue: b + totalInterest }
        ],
        chartData,
        chartKeys: [{ key: 'Remaining Balance', color: '#ef4444', label: 'Debt Balance' }],
        interpretation: `At $${pmt}/month, you will be completely debt-free in ${months} months (${(months/12).toFixed(1)} years), having paid $${Math.round(totalInterest).toLocaleString()} in interest fees.`
      };
    },
    formula: {
      equation: 'n = -log(1 - (B*r)/PMT) / log(1 + r)',
      variables: [
        { name: 'B', description: 'Starting debt balance' },
        { name: 'r', description: 'Monthly interest rate' },
        { name: 'PMT', description: 'Monthly payment amount' }
      ],
      explanation: 'Uses logarithmic debt formulas to compute the precise number of compounding months required to clear the balance.',
      example: {
        scenario: 'Paying off $15,000 at 18% with $500/mo.',
        steps: ['r = 0.18 / 12 = 0.015', 'Monthly interest = $225', 'Deducts principal recursive progress.'],
        result: 'Clears in 42 months.'
      },
      limitations: ['Assumes no new charges or credit lines are added to the balance.']
    },
    faqs: [
      { question: 'How can I lower my debt payoff timeline?', answer: 'The single most effective action is paying more than the minimum payments, as every extra dollar reduces the principal balance directly.' }
    ],
    references: [],
    relatedCalculators: ['credit-card-interest'],
    relatedGuides: []
  },
  {
    id: 'debt-snowball',
    slug: 'debt-snowball',
    name: 'Debt Snowball Calculator',
    title: 'Debt Snowball Method Calculator | MoneyMetricsHub',
    metaDescription: 'Calculate your debt-free timeline using the popular Debt Snowball strategy. Focus on smallest balances first.',
    shortDescription: 'Plan your debt payoff using the Debt Snowball strategy by paying small balances first.',
    category: 'debt',
    inputs: [
      { id: 'debt1Name', label: 'Debt 1 Title', type: 'slider', defaultValue: 1 }, // placeholder to match structure, let's use numbers
      { id: 'debt1Bal', label: 'Debt 1 (Smallest Balance) ($)', type: 'number', defaultValue: 2000, min: 10, prefix: '$' },
      { id: 'debt1Rate', label: 'Debt 1 APR (%)', type: 'number', defaultValue: 15, min: 0.1, suffix: '%' },
      { id: 'debt2Bal', label: 'Debt 2 (Larger Balance) ($)', type: 'number', defaultValue: 8000, min: 10, prefix: '$' },
      { id: 'debt2Rate', label: 'Debt 2 APR (%)', type: 'number', defaultValue: 22, min: 0.1, suffix: '%' },
      { id: 'extra', label: 'Extra Monthly Payment ($)', type: 'number', defaultValue: 300, min: 0, prefix: '$' }
    ],
    calculate: (inputs) => {
      const d1Bal = Number(inputs.debt1Bal);
      const d1Rate = Number(inputs.debt1Rate) / 100 / 12;
      const d2Bal = Number(inputs.debt2Bal);
      const d2Rate = Number(inputs.debt2Rate) / 100 / 12;
      const extra = Number(inputs.extra);

      // Snowball method: Pay standard minimums, focus extra cash on smallest balance first (Debt 1)
      let b1 = d1Bal;
      let b2 = d2Bal;
      let totalInterest = 0;
      let months = 0;
      const chartData = [];

      const min1 = 50;
      const min2 = 150;

      while ((b1 > 0 || b2 > 0) && months < 360) {
        months++;
        const int1 = b1 * d1Rate;
        const int2 = b2 * d2Rate;
        totalInterest += (int1 + int2);

        // Apply interest
        b1 += int1;
        b2 += int2;

        if (b1 > 0) {
          // Pay minimum plus extra on debt 1
          const pmt1 = Math.min(b1, min1 + extra);
          b1 -= pmt1;
          
          // pay minimum on debt 2
          const pmt2 = Math.min(b2, min2);
          b2 -= pmt2;
        } else {
          // Debt 1 is cleared, roll entire cash over to Debt 2
          const pmt2 = Math.min(b2, min2 + min1 + extra);
          b2 -= pmt2;
        }

        if (months % 3 === 0 || (b1 === 0 && b2 === 0)) {
          chartData.push({
            label: `Mo ${months}`,
            'Debt 1': Math.round(b1),
            'Debt 2': Math.round(b2)
          });
        }
      }

      return {
        summary: [
          { label: 'Time to Debt-Free', value: `${months} months`, rawValue: months, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'Total Interest Paid', value: `$${Math.round(totalInterest).toLocaleString()}`, rawValue: totalInterest, badgeColor: 'bg-blue-100 text-blue-800' }
        ],
        chartData,
        chartKeys: [
          { key: 'Debt 1', color: '#ef4444', label: 'Smallest Debt (D1)' },
          { key: 'Debt 2', color: '#3b82f6', label: 'Larger Debt (D2)' }
        ],
        interpretation: `Using the Debt Snowball strategy, you eliminate your smallest debt first to gain psychological momentum. Both cards are completely cleared in ${months} months.`
      };
    },
    formula: {
      equation: 'Snowball Payoff Sequence',
      variables: [],
      explanation: 'Simulates paying off debts sorted by balance size, rolling over paid minimum sums onto subsequent larger debt obligations.',
      example: {
        scenario: 'Paying $2,000 card and $8,000 card with $300 extra/month.',
        steps: ['Focuses extra cash on clearing the $2,000 balance.', 'Rolls payment over to clear the $8,000 balance.'],
        result: 'Both paid in full.'
      },
      limitations: ['Can result in higher total interest if larger debts hold higher APR rates.']
    },
    faqs: [
      { question: 'Why choose Debt Snowball?', answer: 'It is highly popular because clearing small accounts quickly creates a powerful emotional feeling of winning, keeping you focused on the goal.' }
    ],
    references: [],
    relatedCalculators: ['debt-avalanche'],
    relatedGuides: ['debt-snowball-vs-debt-avalanche']
  },
  {
    id: 'debt-avalanche',
    slug: 'debt-avalanche',
    name: 'Debt Avalanche Calculator',
    title: 'Debt Avalanche Method Calculator | MoneyMetricsHub',
    metaDescription: 'Plan your debt payoff using the mathematical Debt Avalanche strategy to save the absolute maximum in interest fees.',
    shortDescription: 'Plan your debt payoff using the Debt Avalanche strategy by targeting high-interest debt first.',
    category: 'debt',
    inputs: [
      { id: 'debt1Bal', label: 'Debt 1 (Lower APR Debt) ($)', type: 'number', defaultValue: 3000, min: 10, prefix: '$' },
      { id: 'debt1Rate', label: 'Debt 1 APR (%)', type: 'number', defaultValue: 12, min: 0.1, suffix: '%' },
      { id: 'debt2Bal', label: 'Debt 2 (Higher APR Debt) ($)', type: 'number', defaultValue: 7000, min: 10, prefix: '$' },
      { id: 'debt2Rate', label: 'Debt 2 APR (%)', type: 'number', defaultValue: 24, min: 0.1, suffix: '%' },
      { id: 'extra', label: 'Extra Monthly Payment ($)', type: 'number', defaultValue: 300, min: 0, prefix: '$' }
    ],
    calculate: (inputs) => {
      const d1Bal = Number(inputs.debt1Bal);
      const d1Rate = Number(inputs.debt1Rate) / 100 / 12;
      const d2Bal = Number(inputs.debt2Bal);
      const d2Rate = Number(inputs.debt2Rate) / 100 / 12;
      const extra = Number(inputs.extra);

      // Avalanche: Focus extra cash on HIGHEST INTEREST rate debt (Debt 2) first
      let b1 = d1Bal;
      let b2 = d2Bal;
      let totalInterest = 0;
      let months = 0;
      const chartData = [];

      const min1 = 60;
      const min2 = 140;

      while ((b1 > 0 || b2 > 0) && months < 360) {
        months++;
        const int1 = b1 * d1Rate;
        const int2 = b2 * d2Rate;
        totalInterest += (int1 + int2);

        b1 += int1;
        b2 += int2;

        if (b2 > 0) {
          // Pay minimum plus extra on high-interest card (Debt 2)
          const pmt2 = Math.min(b2, min2 + extra);
          b2 -= pmt2;

          // Pay minimum on Debt 1
          const pmt1 = Math.min(b1, min1);
          b1 -= pmt1;
        } else {
          // Debt 2 cleared, roll over entire payment to Debt 1
          const pmt1 = Math.min(b1, min1 + min2 + extra);
          b1 -= pmt1;
        }

        if (months % 3 === 0 || (b1 === 0 && b2 === 0)) {
          chartData.push({
            label: `Mo ${months}`,
            'Debt 1 (Low APR)': Math.round(b1),
            'Debt 2 (High APR)': Math.round(b2)
          });
        }
      }

      return {
        summary: [
          { label: 'Time to Debt-Free', value: `${months} months`, rawValue: months, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'Total Interest Paid', value: `$${Math.round(totalInterest).toLocaleString()}`, rawValue: totalInterest, badgeColor: 'bg-blue-100 text-blue-800' }
        ],
        chartData,
        chartKeys: [
          { key: 'Debt 1 (Low APR)', color: '#3b82f6', label: 'D1 (Low APR)' },
          { key: 'Debt 2 (High APR)', color: '#ef4444', label: 'D2 (High APR)' }
        ],
        interpretation: `The Debt Avalanche method minimizes overall interest charges by systematically clearing high-interest debt first. Your entire portfolio is paid off in ${months} months.`
      };
    },
    formula: {
      equation: 'Avalanche Payoff Sequence',
      variables: [],
      explanation: 'Simulates paying off accounts sorted descending by interest rate, mathematically minimizing total interest charges.',
      example: {
        scenario: 'Paying 24% card and 12% card with $300 extra/month.',
        steps: ['Applies extra cash to highest APR account first.', 'Rolls payment to secondary account.'],
        result: 'Achieves mathematically fastest payoff.'
      },
      limitations: ['Requires dedication as the initial larger balance can take months to fully clear.']
    },
    faqs: [
      { question: 'Why choose Debt Avalanche?', answer: 'It is mathematically the most cost-effective payoff method, ensuring you pay the absolute least in interest charges.' }
    ],
    references: [],
    relatedCalculators: ['debt-snowball'],
    relatedGuides: ['debt-snowball-vs-debt-avalanche']
  },
  {
    id: 'credit-utilization',
    slug: 'credit-utilization',
    name: 'Credit Utilization Calculator',
    title: 'Credit Utilization Ratio Calculator | MoneyMetricsHub',
    metaDescription: 'Calculate your individual and revolving credit utilization ratios to help optimize your credit score.',
    shortDescription: 'Calculate revolving credit card utilization ratios to monitor credit wellness.',
    category: 'debt',
    inputs: [
      { id: 'balance1', label: 'Card 1 Balance ($)', type: 'number', defaultValue: 1500, min: 0, prefix: '$' },
      { id: 'limit1', label: 'Card 1 Limit ($)', type: 'number', defaultValue: 5000, min: 100, prefix: '$' },
      { id: 'balance2', label: 'Card 2 Balance ($)', type: 'number', defaultValue: 4500, min: 0, prefix: '$' },
      { id: 'limit2', label: 'Card 2 Limit ($)', type: 'number', defaultValue: 10000, min: 100, prefix: '$' }
    ],
    calculate: (inputs) => {
      const b1 = Number(inputs.balance1);
      const l1 = Number(inputs.limit1);
      const b2 = Number(inputs.balance2);
      const l2 = Number(inputs.limit2);

      const totalBal = b1 + b2;
      const totalLimit = l1 + l2;
      const totalUtil = (totalBal / totalLimit) * 100;

      const util1 = (b1 / l1) * 100;
      const util2 = (b2 / l2) * 100;

      const chartData = [
        { name: 'Used Credit', value: totalBal },
        { name: 'Available Credit', value: totalLimit - totalBal }
      ];

      return {
        summary: [
          { label: 'Overall Utilization', value: `${totalUtil.toFixed(1)}%`, rawValue: totalUtil, badgeColor: totalUtil <= 30 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800' },
          { label: 'Total Card Debt', value: `$${totalBal.toLocaleString()}`, rawValue: totalBal },
          { label: 'Total Limit Available', value: `$${totalLimit.toLocaleString()}`, rawValue: totalLimit }
        ],
        chartData,
        interpretation: `Your total credit utilization is ${totalUtil.toFixed(1)}% (Card 1: ${util1.toFixed(0)}%, Card 2: ${util2.toFixed(0)}%). Credit reporting bureaus recommend keeping utilization under 30% to maintain a strong credit score.`
      };
    },
    formula: {
      equation: 'Utilization = (Total Balances / Total Limits) * 100',
      variables: [],
      explanation: 'Calculates the ratio of total revolving debt compared to total authorized lines of credit.',
      example: {
        scenario: 'Card balance of $3,000 on a $10,000 credit limit.',
        steps: ['Utilization = ($3,000 / $10,000) * 100'],
        result: '30.00% utilization ratio.'
      },
      limitations: ['Does not track installment loan balances (e.g., student or home loans) which do not count towards utilization.']
    },
    faqs: [
      { question: 'Why is credit utilization important?', answer: 'It represents 30% of your total FICO® score. Lower utilization correlates heavily with higher creditworthiness.' }
    ],
    references: [],
    relatedCalculators: ['credit-card-interest'],
    relatedGuides: []
  },
  {
    id: 'credit-card-interest',
    slug: 'credit-card-interest',
    name: 'Credit Card Interest Calculator',
    title: 'Credit Card Interest & Minimum Payment Calculator | MoneyMetricsHub',
    metaDescription: 'Calculate the monthly interest charged on your credit cards and see the high cost of only paying minimums.',
    shortDescription: 'Calculate the monthly interest penalty generated by carrying credit card balances.',
    category: 'debt',
    inputs: [
      { id: 'balance', label: 'Credit Card Balance ($)', type: 'number', defaultValue: 5000, min: 100, prefix: '$' },
      { id: 'apr', label: 'Annual APR (%)', type: 'number', defaultValue: 21.99, min: 0.1, max: 40, step: 0.01, suffix: '%' }
    ],
    calculate: (inputs) => {
      const b = Number(inputs.balance);
      const apr = Number(inputs.apr) / 100;

      const monthlyInterest = (b * apr) / 12;
      const dailyInterest = (b * apr) / 365;

      const chartData = [
        { name: 'Interest Cost (Monthly)', value: monthlyInterest },
        { name: 'Balance Principal', value: b }
      ];

      return {
        summary: [
          { label: 'Monthly Interest Cost', value: `$${monthlyInterest.toFixed(2)}`, rawValue: monthlyInterest, badgeColor: 'bg-red-100 text-red-800' },
          { label: 'Daily Interest Payout', value: `$${dailyInterest.toFixed(2)}`, rawValue: dailyInterest },
          { label: 'Current Principal', value: `$${b.toLocaleString()}`, rawValue: b }
        ],
        chartData,
        interpretation: `At ${inputs.apr}% APR, carrying a $${b.toLocaleString()} balance costs you approximately $${monthlyInterest.toFixed(2)} in interest fees every month ($${dailyInterest.toFixed(2)} per day).`
      };
    },
    formula: {
      equation: 'Monthly Interest = (Balance * APR %) / 12',
      variables: [],
      explanation: 'Applies the daily periodic interest calculation model representing revolving bank fees.',
      example: {
        scenario: 'Carrying $5,000 balance at 22% APR.',
        steps: ['Monthly interest = ($5,000 * 0.22) / 12'],
        result: '$91.67 monthly interest cost.'
      },
      limitations: ['Does not simulate compound card fees if minimum payments are missed entirely.']
    },
    faqs: [
      { question: 'How can I avoid credit card interest?', answer: 'Always pay the "Statement Balance" in full by the due date every month to trigger your interest grace period.' }
    ],
    references: [],
    relatedCalculators: ['debt-payoff'],
    relatedGuides: []
  },
  {
    id: 'balance-transfer',
    slug: 'balance-transfer',
    name: 'Balance Transfer Calculator',
    title: 'Credit Card Balance Transfer Savings Calculator | MoneyMetricsHub',
    metaDescription: 'Calculate the total interest savings from consolidating credit card debt using a 0% APR balance transfer deal.',
    shortDescription: 'Calculate the total savings from moving credit card balances onto a 0% APR card.',
    category: 'debt',
    inputs: [
      { id: 'balance', label: 'Current Card Balance ($)', type: 'number', defaultValue: 10000, min: 100, prefix: '$' },
      { id: 'currentApr', label: 'Current Interest (APR %)', type: 'number', defaultValue: 22, min: 0.1, suffix: '%' },
      { id: 'promoTerm', label: '0% APR Promo Duration (Months)', type: 'number', defaultValue: 15, min: 3, max: 24, suffix: 'mo' },
      { id: 'transferFee', label: 'Balance Transfer Fee (%)', type: 'number', defaultValue: 3, min: 0, max: 10, suffix: '%' }
    ],
    calculate: (inputs) => {
      const b = Number(inputs.balance);
      const currentApr = Number(inputs.currentApr) / 100 / 12;
      const term = Number(inputs.promoTerm);
      const feePct = Number(inputs.transferFee) / 100;

      const upfrontFee = b * feePct;

      // Estimate interest cost on original card assuming same payoff payments of b/term monthly
      const monthlyPmt = b / term;
      let tempBalance = b;
      let estimatedInterestPaid = 0;
      for (let m = 1; m <= term; m++) {
        const intShare = tempBalance * currentApr;
        estimatedInterestPaid += intShare;
        tempBalance = Math.max(0, tempBalance - (monthlyPmt - intShare)); // approx
      }

      const netSavings = estimatedInterestPaid - upfrontFee;

      const chartData = [
        { name: 'Upfront Transfer Fee', value: upfrontFee },
        { name: 'Original Interest Cost', value: estimatedInterestPaid }
      ];

      return {
        summary: [
          { label: 'Net Interest Saved', value: `$${Math.round(netSavings).toLocaleString()}`, rawValue: netSavings, badgeColor: netSavings > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800' },
          { label: 'Upfront Transfer Fee', value: `$${upfrontFee.toFixed(2)}`, rawValue: upfrontFee, badgeColor: 'bg-amber-100 text-amber-800' },
          { label: 'Estimated Interest Saved', value: `$${Math.round(estimatedInterestPaid).toLocaleString()}`, rawValue: estimatedInterestPaid }
        ],
        chartData,
        interpretation: netSavings > 0
          ? `By moving your $${b.toLocaleString()} debt, you save $${Math.round(estimatedInterestPaid).toLocaleString()} in revolving interest charges. Deducting the upfront transfer fee of $${upfrontFee.toFixed(2)} leaves a net savings of $${Math.round(netSavings).toLocaleString()}.`
          : `A balance transfer is not cost-effective. The upfront fee of $${upfrontFee.toFixed(2)} exceeds estimated original interest cost.`
      };
    },
    formula: {
      equation: 'Net Savings = Original Estimated Interest - Upfront Fee',
      variables: [],
      explanation: 'Deducts the mandatory card balance transfer fee from calculated original compounding interest to output net savings.',
      example: {
        scenario: 'Consolidating $10k at 22% with 3% fee card.',
        steps: ['Fee = $300', 'Original interest = $1,400.'],
        result: 'Net savings of $1,100.'
      },
      limitations: ['Assumes the transfer balance is fully paid off within the promotional 0% window.']
    },
    faqs: [
      { question: 'What happens when the 0% promo expires?', answer: 'All remaining balances are subjected to standard high card APRs, often exceeding 20%.' }
    ],
    references: [],
    relatedCalculators: ['debt-payoff'],
    relatedGuides: []
  }
];
