import { CalculatorDefinition } from '../../types';

export const retirementNewCalculators: CalculatorDefinition[] = [
  {
    id: 'coast-fire',
    slug: 'coast-fire',
    name: 'Coast FIRE Calculator',
    title: 'Coast FIRE Calculator | MoneyMetricsHub',
    metaDescription: 'Find your Coast FIRE number to see if your current savings are enough to compound to your retirement target without another contribution.',
    shortDescription: 'Calculate your Coast FIRE target savings threshold to see when you can stop active contributions.',
    category: 'retirement',
    inputs: [
      { id: 'age', label: 'Current Age', type: 'number', defaultValue: 30, min: 18, suffix: 'yrs' },
      { id: 'retireAge', label: 'Target Retirement Age', type: 'number', defaultValue: 60, min: 30, suffix: 'yrs' },
      { id: 'expenses', label: 'Target Annual Retirement Expenses ($)', type: 'number', defaultValue: 60000, min: 1000, prefix: '$' },
      { id: 'netWorth', label: 'Current Retirement Savings ($)', type: 'number', defaultValue: 50000, min: 0, prefix: '$' },
      { id: 'rate', label: 'Annual Compound Growth Rate (%)', type: 'number', defaultValue: 7, min: 1, suffix: '%' }
    ],
    calculate: (inputs) => {
      const age = Number(inputs.age);
      const retireAge = Number(inputs.retireAge);
      const exp = Number(inputs.expenses);
      const nw = Number(inputs.netWorth);
      const r = Number(inputs.rate) / 100;

      const fireNumber = exp * 25; // 4% rule
      const yearsToGrow = Math.max(0, retireAge - age);
      
      // Coast FIRE number = FIRE Number / (1 + r)^t
      const coastFireNumber = fireNumber / Math.pow(1 + r, yearsToGrow);
      const isCoasted = nw >= coastFireNumber;

      const chartData = [
        { name: 'Current Savings', value: nw },
        { name: 'Coast FIRE Target', value: coastFireNumber }
      ];

      return {
        summary: [
          { label: 'Coast FIRE Target', value: `$${Math.round(coastFireNumber).toLocaleString()}`, rawValue: coastFireNumber, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'Traditional FIRE Target', value: `$${Math.round(fireNumber).toLocaleString()}`, rawValue: fireNumber },
          { label: 'Status', value: isCoasted ? 'Coasted!' : 'Not yet Coasted', badgeColor: isCoasted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800' }
        ],
        chartData,
        interpretation: isCoasted
          ? `Congratulations! Your savings of $${nw.toLocaleString()} exceed your Coast FIRE target of $${Math.round(coastFireNumber).toLocaleString()}. You can "coast" without saving another dollar, and your nest egg will compound to $${Math.round(fireNumber).toLocaleString()} by age ${retireAge}.`
          : `You need $${Math.round(coastFireNumber - nw).toLocaleString()} more to reach Coast FIRE. Once you hit $${Math.round(coastFireNumber).toLocaleString()} in retirement assets, your balance will compound to your retirement target on its own.`
      };
    },
    formula: {
      equation: 'Coast FIRE = FIRE Target / (1 + r)^t',
      variables: [
        { name: 'FIRE Target', description: '25 times expected annual retirement expenses' },
        { name: 'r', description: 'Real expected compound growth rate' },
        { name: 't', description: 'Years remaining until target retirement' }
      ],
      explanation: 'Discount-compounds the final target back to present value to find what starting sum will compound to that target on its own.',
      example: {
        scenario: 'Age 30 wishing to retire at 60 on $60,000/yr (7% returns).',
        steps: [
          'FIRE Target = $60,000 * 25 = $1,500,000',
          'Years (t) = 30',
          'Coast FIRE = $1,500,000 / (1.07)^30 ≈ $197,052'
        ],
        result: 'You need $197,052 saved today.'
      },
      limitations: ['Does not account for inflation variations or market drawdowns right before retirement.']
    },
    faqs: [
      { question: 'What is Coast FIRE?', answer: 'The point where you have saved enough retirement assets that you do not need to make any more active contributions to compound to your target retirement nest egg.' }
    ],
    references: [],
    relatedCalculators: ['fire-calculator'],
    relatedGuides: []
  },
  {
    id: 'barista-fire',
    slug: 'barista-fire',
    name: 'Barista FIRE Calculator',
    title: 'Barista FIRE Calculator | MoneyMetricsHub',
    metaDescription: 'Calculate the retirement portfolio needed to retire early and work part-time (Barista FIRE).',
    shortDescription: 'Calculate the nest egg needed to transition to a stress-free part-time job.',
    category: 'retirement',
    inputs: [
      { id: 'expenses', label: 'Annual Living Expenses ($)', type: 'number', defaultValue: 50000, min: 1000, prefix: '$' },
      { id: 'partTimeIncome', label: 'Annual Part-Time Earnings ($)', type: 'number', defaultValue: 20000, min: 0, prefix: '$' },
      { id: 'swr', label: 'Safe Withdrawal Rate (%)', type: 'number', defaultValue: 4, min: 1.0, max: 8.0, step: 0.1, suffix: '%' }
    ],
    calculate: (inputs) => {
      const exp = Number(inputs.expenses);
      const inc = Number(inputs.partTimeIncome);
      const swr = Number(inputs.swr) / 100;

      const gap = Math.max(0, exp - inc);
      const baristaFireTarget = gap / swr;
      const traditionalFireTarget = exp / swr;

      const chartData = [
        { name: 'Barista FIRE Nest Egg', value: baristaFireTarget },
        { name: 'Traditional FIRE Nest Egg', value: traditionalFireTarget }
      ];

      return {
        summary: [
          { label: 'Barista FIRE Target', value: `$${Math.round(baristaFireTarget).toLocaleString()}`, rawValue: baristaFireTarget, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'Traditional FIRE Target', value: `$${Math.round(traditionalFireTarget).toLocaleString()}`, rawValue: traditionalFireTarget },
          { label: 'Annual Cash Gap To Fund', value: `$${gap.toLocaleString()}`, rawValue: gap, badgeColor: 'bg-blue-100 text-blue-800' }
        ],
        chartData,
        interpretation: `By earning $${inc.toLocaleString()} annually in part-time work, your retirement asset gap falls to $${gap.toLocaleString()}. You only need $${Math.round(baristaFireTarget).toLocaleString()} in retirement assets to fund this lifestyle, saving you $${Math.round(traditionalFireTarget - baristaFireTarget).toLocaleString()} in traditional saving.`
      };
    },
    formula: {
      equation: 'Barista Target = (Expenses - Part-Time Income) / SWR',
      variables: [
        { name: 'Expenses', description: 'Total annual living expenses' },
        { name: 'Part-Time Income', description: 'Expected part-time wages' },
        { name: 'SWR', description: 'Safe withdrawal rate' }
      ],
      explanation: 'Subtracts passive earnings from overall expenses to compute the smaller nest egg required to fund the remaining deficit.',
      example: {
        scenario: 'Expenses = $50,000, part-time earnings = $20,000, SWR = 4%.',
        steps: ['Gap = $50,000 - $20,000 = $30,000', 'Target = $30,000 / 0.04 = $750,000'],
        result: '$750,000 portfolio size required.'
      },
      limitations: ['Part-time work must be reliable and sustain benefits or health insurance coverage.']
    },
    faqs: [
      { question: 'What is Barista FIRE?', answer: 'Retiring early from your primary career but continuing to work a low-stress part-time job to cover a portion of living expenses.' }
    ],
    references: [],
    relatedCalculators: ['fire-calculator'],
    relatedGuides: []
  },
  {
    id: 'lean-fire',
    slug: 'lean-fire',
    name: 'Lean FIRE Calculator',
    title: 'Lean FIRE Calculator | MoneyMetricsHub',
    metaDescription: 'Determine your Lean FIRE target portfolio requirements to achieve minimalist financial independence.',
    shortDescription: 'Calculate the nest egg needed for a minimalist, low-cost early retirement strategy.',
    category: 'retirement',
    inputs: [
      { id: 'expenses', label: 'Lean Annual Living Expenses ($)', type: 'number', defaultValue: 30000, min: 1000, prefix: '$' },
      { id: 'swr', label: 'Safe Withdrawal Rate (%)', type: 'number', defaultValue: 4, min: 1.0, max: 8.0, step: 0.1, suffix: '%' }
    ],
    calculate: (inputs) => {
      const exp = Number(inputs.expenses);
      const swr = Number(inputs.swr) / 100;
      const target = exp / swr;

      const chartData = [
        { name: 'Annual Lean Outlay', value: exp },
        { name: 'Required Assets', value: target }
      ];

      return {
        summary: [
          { label: 'Lean FIRE Target', value: `$${Math.round(target).toLocaleString()}`, rawValue: target, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'Annual Safe Income', value: `$${exp.toLocaleString()}`, rawValue: exp },
          { label: 'Monthly Safe Income', value: `$${Math.round(exp / 12).toLocaleString()}`, rawValue: exp / 12 }
        ],
        chartData,
        interpretation: `To fund a minimalist early retirement on $${exp.toLocaleString()} in annual Lean outlays, you need a highly efficient nest egg of $${Math.round(target).toLocaleString()} assuming a ${inputs.swr}% Safe Withdrawal Rate.`
      };
    },
    formula: {
      equation: 'Lean Target = Lean Annual Expenses / SWR %',
      variables: [],
      explanation: 'Utilizes the classic withdrawal equation mapped directly to a leaner, lower expense schedule.',
      example: {
        scenario: 'Minimalist living on $30,000 annually with 4% SWR.',
        steps: ['Target = $30,000 / 0.04 = $750,000'],
        result: 'Target Lean portfolio is $750,000.'
      },
      limitations: ['Minimalist budgets offer very small safety margins for unexpected medical or household repairs.']
    },
    faqs: [
      { question: 'What is Lean FIRE?', answer: 'An early retirement strategy focused on extreme frugality and minimalist living, requiring a smaller nest egg (typically under $1M).' }
    ],
    references: [],
    relatedCalculators: ['fire-calculator'],
    relatedGuides: []
  },
  {
    id: 'fat-fire',
    slug: 'fat-fire',
    name: 'Fat FIRE Calculator',
    title: 'Fat FIRE Calculator | MoneyMetricsHub',
    metaDescription: 'Project the multi-million dollar nest egg needed to achieve an abundant, premium early retirement.',
    shortDescription: 'Calculate the nest egg required to support a luxury, high-expense early retirement.',
    category: 'retirement',
    inputs: [
      { id: 'expenses', label: 'Abundant Annual Expenses ($)', type: 'number', defaultValue: 150000, min: 1000, prefix: '$' },
      { id: 'swr', label: 'Safe Withdrawal Rate (%)', type: 'number', defaultValue: 3.5, min: 1.0, max: 8.0, step: 0.1, suffix: '%' }
    ],
    calculate: (inputs) => {
      const exp = Number(inputs.expenses);
      const swr = Number(inputs.swr) / 100;
      const target = exp / swr;

      const chartData = [
        { name: 'Abundant Expenses', value: exp },
        { name: 'Required Assets', value: target }
      ];

      return {
        summary: [
          { label: 'Fat FIRE Target Portfolio', value: `$${Math.round(target).toLocaleString()}`, rawValue: target, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'Annual Cash Outflow', value: `$${exp.toLocaleString()}`, rawValue: exp },
          { label: 'Monthly Cash Outflow', value: `$${Math.round(exp / 12).toLocaleString()}`, rawValue: exp / 12 }
        ],
        chartData,
        interpretation: `To retire early and support an abundant, premium lifestyle of $${exp.toLocaleString()} annually, you need a substantial portfolio of $${Math.round(target).toLocaleString()} assuming a conservative ${inputs.swr}% Safe Withdrawal Rate.`
      };
    },
    formula: {
      equation: 'Fat Target = Luxury Annual Expenses / SWR %',
      variables: [],
      explanation: 'Applies traditional retirement formulas to premium lifestyle outlays, often using conservative SWR multipliers (3% - 3.5%) for safety.',
      example: {
        scenario: 'Abundant living on $150,000 annually with 3.5% SWR.',
        steps: ['Target = $150,000 / 0.035 ≈ $4,285,714'],
        result: 'Target Fat portfolio is $4,285,714.'
      },
      limitations: ['Requires immense savings dedication and high incomes during active earning phases.']
    },
    faqs: [
      { question: 'What is Fat FIRE?', answer: 'Retiring early while maintaining a high standard of living (typically over $100k-$150k in annual spending).' }
    ],
    references: [],
    relatedCalculators: ['fire-calculator'],
    relatedGuides: []
  },
  {
    id: 'retirement-withdrawal',
    slug: 'retirement-withdrawal',
    name: 'Retirement Withdrawal Calculator',
    title: 'Retirement Withdrawal & Portfolio Longevity Calculator | MoneyMetricsHub',
    metaDescription: 'Estimate how many years your retirement portfolio will last based on your annual spending, growth, and inflation.',
    shortDescription: 'Calculate how long your retirement nest egg will last given custom annual withdrawals.',
    category: 'retirement',
    inputs: [
      { id: 'nestEgg', label: 'Retirement Nest Egg ($)', type: 'number', defaultValue: 1000000, min: 1000, prefix: '$' },
      { id: 'spending', label: 'Initial Annual Withdrawal ($)', type: 'number', defaultValue: 50000, min: 100, prefix: '$' },
      { id: 'growth', label: 'Expected Investment Return (%)', type: 'number', defaultValue: 6.0, min: 0.1, suffix: '%' },
      { id: 'inflation', label: 'Annual Inflation Rate (%)', type: 'number', defaultValue: 2.5, min: 0.0, suffix: '%' }
    ],
    calculate: (inputs) => {
      const egg = Number(inputs.nestEgg);
      const spending = Number(inputs.spending);
      const growth = Number(inputs.growth) / 100;
      const inf = Number(inputs.inflation) / 100;

      let balance = egg;
      let annualCost = spending;
      let yearsCount = 0;
      const chartData = [];

      while (balance > 0 && yearsCount < 100) {
        // Compound investment growth
        balance = balance * (1 + growth);
        // Withdraw annual spending
        balance -= annualCost;
        // Adjust annual spending up for inflation
        annualCost = annualCost * (1 + inf);
        yearsCount++;

        if (yearsCount % 5 === 0 || balance <= 0) {
          chartData.push({
            label: `Yr ${yearsCount}`,
            'Nest Egg Balance': Math.max(0, Math.round(balance))
          });
        }
      }

      return {
        summary: [
          { label: 'Portfolio Longevity', value: yearsCount >= 100 ? '100+ years' : `${yearsCount} years`, rawValue: yearsCount, badgeColor: yearsCount > 25 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800' },
          { label: 'Starting Nest Egg', value: `$${egg.toLocaleString()}`, rawValue: egg },
          { label: 'Inflation-Adjusted Life', value: `${yearsCount} yrs`, rawValue: yearsCount }
        ],
        chartData,
        chartKeys: [{ key: 'Nest Egg Balance', color: '#3b82f6', label: 'Ending Year Balance' }],
        interpretation: yearsCount >= 100
          ? `Your nest egg is virtually infinite. Your investment growth of ${inputs.growth}% outpaces your starting withdrawal of $${spending.toLocaleString()} and inflation.`
          : `At these rates, your nest egg will last exactly ${yearsCount} years before hitting zero. Balance adjustments or reduced spending might be needed.`
      };
    },
    formula: {
      equation: 'Loop: B_t = [B_{t-1} * (1 + r)] - (W * (1 + i)^t)',
      variables: [
        { name: 'B_t', description: 'Balance in year t' },
        { name: 'W', description: 'Initial annual withdrawal' },
        { name: 'i', description: 'Annual inflation percentage' }
      ],
      explanation: 'Compiles yearly interest returns and deducts inflation-linked withdrawals to track cash flow exhaustion.',
      example: {
        scenario: 'Egg = $1M, Spend = $50k, Growth = 6%, Inflation = 2.5%.',
        steps: ['Year 1 compounding: balance becomes $1.06M', 'Withdraw $50k: balance becomes $1.01M', 'Inflation adjusts next year withdrawal to $51,250.'],
        result: 'Longevity is computed recursively.'
      },
      limitations: ['Assumes static returns. Real markets experience sequences of returns risk.']
    },
    faqs: [
      { question: 'What is sequence of returns risk?', answer: 'The danger of experiencing down market cycles in the early years of retirement, which can drain your principal much faster than standard averages predict.' }
    ],
    references: [],
    relatedCalculators: ['four-percent-rule'],
    relatedGuides: []
  },
  {
    id: 'safe-withdrawal-rate',
    slug: 'safe-withdrawal-rate',
    name: 'Safe Withdrawal Rate Calculator',
    title: 'Safe Withdrawal Rate (SWR) Calculator | MoneyMetricsHub',
    metaDescription: 'Find your customized Safe Withdrawal Rate (SWR) to ensure your portfolio sustains you through retirement.',
    shortDescription: 'Calculate safe annual and monthly withdrawal limits based on your custom SWR.',
    category: 'retirement',
    inputs: [
      { id: 'egg', label: 'Retirement Nest Egg ($)', type: 'number', defaultValue: 1000000, min: 1000, prefix: '$' },
      { id: 'rate', label: 'Custom SWR (%)', type: 'number', defaultValue: 3.5, min: 1, max: 8, step: 0.1, suffix: '%' }
    ],
    calculate: (inputs) => {
      const egg = Number(inputs.egg);
      const r = Number(inputs.rate) / 100;

      const annualSafe = egg * r;
      const monthlySafe = annualSafe / 12;

      const chartData = [
        { name: 'Annual Payout', value: annualSafe },
        { name: 'Nest Egg Intact', value: egg - annualSafe }
      ];

      return {
        summary: [
          { label: 'Annual Safe Payout', value: `$${Math.round(annualSafe).toLocaleString()}`, rawValue: annualSafe, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'Monthly Safe Payout', value: `$${Math.round(monthlySafe).toLocaleString()}`, rawValue: monthlySafe, badgeColor: 'bg-blue-100 text-blue-800' },
          { label: 'SWR Percentage', value: `${inputs.rate}%`, rawValue: r }
        ],
        chartData,
        interpretation: `Based on a safe withdrawal rate of ${inputs.rate}%, a $${egg.toLocaleString()} portfolio can support an initial cash outflow of $${Math.round(annualSafe).toLocaleString()} per year ($${Math.round(monthlySafe).toLocaleString()}/month) adjusted for inflation.`
      };
    },
    formula: {
      equation: 'Withdrawal = Portfolio Size * SWR %',
      variables: [],
      explanation: 'Multiplies total assets by SWR to output safe annual spending limits.',
      example: {
        scenario: 'Portfolio = $1.5M, SWR = 3.5%.',
        steps: ['Annual withdrawal = $1,500,000 * 0.035 = $52,500'],
        result: '$52,500 safe payout.'
      },
      limitations: ['Relies on historic capital performance and assumes constant asset splits.']
    },
    faqs: [
      { question: 'Is 4% still safe?', answer: 'The 4% rule, from the Trinity Study, is historically safe for 30-year horizons. For longer retirements (early retirement), 3.0% to 3.5% is safer.' }
    ],
    references: [],
    relatedCalculators: ['four-percent-rule'],
    relatedGuides: []
  },
  {
    id: 'social-security-estimator',
    slug: 'social-security-estimator',
    name: 'Social Security Estimator',
    title: 'Social Security Payout Estimator | MoneyMetricsHub',
    metaDescription: 'Estimate your monthly Social Security retirement benefits based on current wages and claiming age.',
    shortDescription: 'Estimate your monthly retirement benefits from Social Security based on earnings.',
    category: 'retirement',
    inputs: [
      { id: 'earnings', label: 'Current Annual Income ($)', type: 'number', defaultValue: 80000, min: 1000, prefix: '$' },
      { id: 'claimAge', label: 'Claiming Age', type: 'number', defaultValue: 67, min: 62, max: 70, suffix: 'yrs' }
    ],
    calculate: (inputs) => {
      const wage = Number(inputs.earnings);
      const age = Number(inputs.claimAge);

      // Simple SSA progressive formula model (using PIA formula benchmarks)
      // Cap average indexed monthly earnings (AIME) at standard limit
      const monthlyEarnings = Math.min(13000, wage / 12);
      
      // PIA bend points (rough estimates)
      // 90% of first $1,174
      // 32% of earnings between $1,174 and $7,078
      // 15% of earnings over $7,078
      let pia = 0;
      if (monthlyEarnings <= 1174) {
        pia = monthlyEarnings * 0.90;
      } else if (monthlyEarnings <= 7078) {
        pia = (1174 * 0.90) + ((monthlyEarnings - 1174) * 0.32);
      } else {
        pia = (1174 * 0.90) + ((7078 - 1174) * 0.32) + ((monthlyEarnings - 7078) * 0.15);
      }

      // Adjust benefit based on claiming age (Full Retirement Age is assumed 67)
      let adjustmentFactor = 1.0;
      if (age < 67) {
        // Reductions for early retirement: approx 6.67% per year early for first 3 years, then 5% per year
        const yearsEarly = 67 - age;
        adjustmentFactor = 1.0 - (yearsEarly * 0.065);
      } else if (age > 67) {
        // Delayed retirement credits: 8% per year late
        const yearsLate = age - 67;
        adjustmentFactor = 1.0 + (yearsLate * 0.08);
      }

      const estimatedBenefit = pia * adjustmentFactor;

      const chartData = [
        { name: 'Estimated Monthly Payout', value: estimatedBenefit },
        { name: 'Current Monthly Wages', value: monthlyEarnings }
      ];

      return {
        summary: [
          { label: 'Estimated Monthly Benefit', value: `$${Math.round(estimatedBenefit).toLocaleString()}`, rawValue: estimatedBenefit, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { label: 'PIA Base Benefit (at age 67)', value: `$${Math.round(pia).toLocaleString()}`, rawValue: pia },
          { label: 'Adjustment Factor', value: `${(adjustmentFactor * 100).toFixed(0)}%`, rawValue: adjustmentFactor }
        ],
        chartData,
        interpretation: `If you claim at age ${age}, your estimated monthly Social Security check is $${Math.round(estimatedBenefit).toLocaleString()}. Claiming earlier than 67 reduces benefits, while delaying until 70 boosts your payouts by 8% annually.`
      };
    },
    formula: {
      equation: 'Benefit = PIA * Claiming Age Adjustment',
      variables: [],
      explanation: 'Estimates average indexed monthly wages and applies federal bend points to estimate Primary Insurance Amount (PIA), scaled by retirement claiming age.',
      example: {
        scenario: 'Wages of $80,000, claiming at full retirement age (67).',
        steps: ['Calculates monthly average wage base.', 'Applies 90%, 32%, 15% bend point steps.'],
        result: 'Monthly payout estimated.'
      },
      limitations: ['An estimate only. Actual SSA benefits are computed from your highest 35 earning years, inflation-adjusted.']
    },
    faqs: [
      { question: 'What is the best age to claim Social Security?', answer: 'Delaying to age 70 maximizes your guaranteed monthly check, but claiming at 62 provides cash flows sooner.' }
    ],
    references: [],
    relatedCalculators: ['retirement-calculator'],
    relatedGuides: []
  }
];
