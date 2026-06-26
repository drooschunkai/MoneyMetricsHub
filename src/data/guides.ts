import { GuideDefinition } from '../types';
import { guidesNew } from './guides_new';

export const guides: GuideDefinition[] = [
  {
    slug: 'what-is-compound-interest',
    title: 'What Is Compound Interest: The Eighth Wonder of the World',
    metaDescription: 'Understand the power of compound interest, how compounding frequencies impact your yields, and how to harness it for your portfolio.',
    readTime: '6 min read',
    category: 'investing',
    summary: 'Albert Einstein reportedly called compound interest the "eighth wonder of the world." Learn why it is the most vital math concept in wealth accumulation.',
    content: `
## What is Compound Interest?

Compound interest is the interest you earn on interest. This simple concept is the engine behind long-term wealth building. Unlike simple interest, which is calculated only on your initial principal, compound interest adds your earned interest back into the principal balance, meaning you earn interest on a larger balance next period.

## The Mathematical Engine

The formula for compound interest is:

$$A = P(1 + \\frac{r}{n})^{nt}$$

Where:
* **A** = Future value of the investment
* **P** = Principal amount (initial investment)
* **r** = Annual interest rate (decimal)
* **n** = Number of compounding periods per year
* **t** = Total time in years

### Why Compounding Frequency Matters

The compounding frequency ($n$) determines how often interest is calculated. The more frequent the compounding, the higher your ultimate yield:

1. **Annually ($n=1$):** Interest is calculated once a year.
2. **Monthly ($n=12$):** Interest is calculated 12 times a year, meaning you earn interest on your January interest in February.
3. **Daily ($n=365$):** The fastest standard rate of compounding, maximizing your yield.

## The Rule of 72

A quick way to estimate the power of compounding is the **Rule of 72**. Divide 72 by your expected annual rate of return to find how many years it will take to double your money.

For example:
* At a **6% return**, your money doubles in **12 years** ($72 / 6 = 12$).
* At an **8% return**, your money doubles in **9 years** ($72 / 8 = 9$).
* At a **12% return**, your money doubles in just **6 years** ($72 / 12 = 6$).

## How to Make Compounding Work for You

* **Start Early:** The absolute most important variable is time. A dollar saved in your 20s is worth far more than a dollar saved in your 40s.
* **Keep Costs Low:** Fees eat directly into your returns, compounding *against* you.
* **Reinvest Dividends:** Let your dividends buy more shares, adding more fuel to your compounding engine.
    `,
    faqs: [
      {
        question: 'What is the difference between simple and compound interest?',
        answer: 'Simple interest is calculated solely on the original principal. Compound interest is calculated on the principal plus any accumulated interest from previous periods.'
      },
      {
        question: 'How does compounding frequency affect my savings?',
        answer: 'The more frequently interest compounds (e.g., daily vs. annually), the faster your wealth accumulates because you earn interest on earned interest sooner.'
      }
    ]
  },
  {
    slug: 'what-is-fire',
    title: 'What Is FIRE? The Beginner Guide to Financial Independence',
    metaDescription: 'Learn about the FIRE movement (Financial Independence, Retire Early), the math behind it, and how to plan your own escape from the 9-to-5.',
    readTime: '8 min read',
    category: 'retirement',
    summary: 'The Financial Independence, Retire Early (FIRE) movement is reshaping how we view work, savings, and retirement. Here is how the math works.',
    content: `
## Introduction to the FIRE Movement

FIRE stands for **Financial Independence, Retire Early**. Originating from Vicki Robin and Joe Dominguez’s seminal book *Your Money or Your Life*, the movement focuses on extreme savings rates (often 50% to 70% of income) to achieve early retirement in one's 30s, 40s, or 50s.

## The Core Math of FIRE

Achieving FIRE is purely a math problem, independent of age. It revolves around two primary figures:

1. **Your Savings Rate:** The percentage of your net income you save. If you save 10% of your income, you must work 9 years to fund 1 year of living. If you save 50%, 1 year of work funds 1 year of living.
2. **Your FIRE Number:** The amount of invested capital needed to sustain your lifestyle forever. This is calculated using the **Rule of 25**, which is the inverse of the **4% Rule**.

### The Rule of 25

To calculate your FIRE target, multiply your annual living expenses by 25:

$$\\text{FIRE Number} = \\text{Annual Expenses} \\times 25$$

For example:
* If your annual expenses are **$40,000**, you need **$1,000,000** ($40,000 × 25).
* If your annual expenses are **$60,000**, you need **$1,500,000** ($60,000 × 25).

Once you hit this goal, you can theoretically withdraw 4% of your portfolio annually (adjusted for inflation) without ever running out of money, based on the historical success rates of the Trinity Study.

## Types of FIRE

As the movement has matured, different lifestyles have emerged:

* **Lean FIRE:** Aiming for a minimalist lifestyle with annual expenses under $40,000 (portfolio < $1M).
* **Fat FIRE:** Aiming for a highly comfortable, high-spending early retirement with expenses over $100,000 (portfolio > $2.5M).
* **Barista FIRE:** Working part-time in a low-stress job (e.g., at Starbucks for health insurance) while your investments fund the rest of your lifestyle.
* **Coast FIRE:** Saving early and letting compound interest grow your portfolio until you reach retirement age, requiring you only to work to cover current living expenses in the meantime.
    `,
    faqs: [
      {
        question: 'Does FIRE mean I can never work again?',
        answer: 'No. FIRE is about freedom. Many retirees choose to pursue creative projects, start low-risk businesses, or work part-time on their own terms without financial pressure.'
      },
      {
        question: 'Is the 4% rule safe in a down market?',
        answer: 'The 4% rule is based on historical market cycles. However, practitioners recommend flexibility: reducing spending during market downturns can prevent capital depletion.'
      }
    ]
  },
  {
    slug: 'mortgage-amortization-explained',
    title: 'Mortgage Amortization: How Your Payments Work',
    metaDescription: 'Demystify mortgage amortization schedules. Learn how home payments shift from interest-heavy to principal-heavy over time.',
    readTime: '5 min read',
    category: 'loans',
    summary: 'When you make a mortgage payment, where does that cash actually go? Understand the mechanics of interest front-loading and amortization.',
    content: `
## What is Mortgage Amortization?

Amortization is the process of spreading a loan into a series of equal periodic payments. Although each payment is identical, the ratio of what goes towards **interest** versus **principal** changes over time.

## How the Math Works

In the early years of a 30-year fixed mortgage, the vast majority of your monthly payment is devoured by interest. This is because your outstanding loan balance is at its highest, and interest is computed monthly based on that high balance.

As you slowly pay down the principal, the monthly interest charge decreases, allowing a larger portion of your next payment to reduce the principal.

### The Standard Amortization Formula

$$\\text{Monthly Payment } (M) = P \\times \\frac{r(1+r)^n}{(1+r)^n - 1}$$

Where:
* **P** = Principal loan amount
* **r** = Monthly interest rate (annual rate divided by 12)
* **n** = Total number of payments (months)

## The Amortization Curve

If you plot interest vs. principal payments over 30 years, you will see two crossing curves:
* **Year 1-15:** Interest dominates. On a $300,000 loan at 6%, you pay more interest than principal for the first 14 years.
* **Year 15:** The tipping point where more than 50% of your payment finally goes toward principal.
* **Year 30:** Virtually 100% of your payment is going straight to principal.

## How to Save Thousands on Interest

You can bypass the slow front-loaded interest of amortization schedules with these methods:

1. **Bi-weekly Payments:** Paying half your monthly mortgage amount every two weeks results in 13 full payments per year (one extra month), slashing 4 to 5 years off a 30-year term.
2. **Extra Principal Payments:** Even an extra $50 or $100 per month paid directly to the principal reduces the compound base interest drastically over the loan life.
    `,
    faqs: [
      {
        question: 'What is an amortization schedule?',
        answer: 'A table detailing each periodic payment, showing the exact amount going to interest, principal, and the remaining loan balance.'
      },
      {
        question: 'Does paying extra shorten the amortization cycle?',
        answer: 'Yes! Paying extra directly reduces the principal balance, avoiding future compounded interest and shortening the overall life of the loan.'
      }
    ]
  },
  {
    slug: 'inflation-explained',
    title: 'Inflation Explained: Protecting Your Wealth From Cash Erosion',
    metaDescription: 'Discover how inflation erodes the purchasing power of your money and how to construct inflation-beating asset allocations.',
    readTime: '5 min read',
    category: 'savings',
    summary: 'Inflation is the silent destroyer of cash. Learn how to calculate its historical impact and maintain your purchasing power.',
    content: `
## What is Inflation?

Inflation is the general increase in prices and fall in the purchasing value of money over time. It means that a dollar today will buy fewer goods or services tomorrow. If inflation is 3%, what costs $100 today will cost $103 next year.

## The Consumer Price Index (CPI)

Governments measure inflation using indexes like the **Consumer Price Index (CPI)**, which tracks the average price change over time of a basket of goods and services (food, housing, transportation, healthcare, energy).

## How Inflation Erodes Cash

If you hold cash in a standard savings account earning 0.5% interest while inflation is at 3%, you are losing **2.5% of your wealth every single year** in real terms.

For example, over 25 years:
* **$100,000** in cash at 3% average inflation drops to about **$47,760** in actual purchasing power.
* This highlights why storing long-term wealth in cash is highly risky.

## How to Protect Your Portfolio From Inflation

To beat inflation, you must allocate savings to assets that historically grow faster than price indexes:

* **Equities (Stocks):** Historically, global stock indexes return 7-10% annually, easily outperforming standard inflation.
* **Real Estate:** Property values and rent levels tend to scale alongside inflation.
* **TIPS (Treasury Inflation-Protected Securities):** Government bonds that adjust their principal up or down based on CPI adjustments.
    `,
    faqs: [
      {
        question: 'What causes inflation?',
        answer: 'Inflation can be driven by demand-pull (increased demand for goods) or cost-push (increased cost of raw materials and wages), as well as expansions in the money supply.'
      },
      {
        question: 'Can savings accounts beat inflation?',
        answer: 'Rarely. High-Yield Savings Accounts (HYSAs) help mitigate erosion but usually struggle to outperform inflation during periods of high economic growth.'
      }
    ]
  },
  {
    slug: 'how-much-to-save-for-retirement',
    title: 'How Much Should You Save For Retirement?',
    metaDescription: 'Determine your realistic retirement nest egg targets using age-based milestones, percentage benchmarks, and mathematical models.',
    readTime: '7 min read',
    category: 'retirement',
    summary: 'Planning retirement can feel overwhelming. Let us break down the standard milestones, savings percentages, and rules of thumb.',
    content: `
## Introduction

One of the most frequent financial questions is: *How much do I actually need to save to retire comfortably?* While the answer depends on your desired lifestyle, standard milestones can give you a concrete target.

## The 15% Savings Rule of Thumb

Many financial advisors recommend saving at least **15% of your gross pre-tax income** for retirement, starting in your 20s. This savings should be funneled into diversified retirement accounts like 401(k)s or IRAs.

## Fidelity’s Age-Based Retirement Benchmarks

Fidelity offers a straightforward, age-based milestone framework based on your salary:

* **Age 30:** Have **1x** your annual salary saved.
* **Age 40:** Have **3x** your annual salary saved.
* **Age 50:** Have **6x** your annual salary saved.
* **Age 60:** Have **8x** your annual salary saved.
* **Age 67:** Have **10x** your annual salary saved.

*Example:* If you earn $80,000 at age 40, your target retirement account balance is $240,000.

## The "Multiplier" Method

To determine your precise retirement nest egg target, you can use the **Rule of 25**:

$$\\text{Nest Egg} = \\text{Annual Retirement Spending} \\times 25$$

If you expect to spend **$80,000** annually in retirement, and expect **$20,000** from Social Security or pensions, you must cover **$60,000** from your savings.
* Your target nest egg is **$1,500,000** ($60,000 × 25).
    `,
    faqs: [
      {
        question: 'What is the 10% rule in retirement savings?',
        answer: 'A simplified rule suggesting that saving 10% of your earnings starting at age 25 will successfully replace about 60-70% of your pre-retirement income.'
      },
      {
        question: 'Is my employer match included in my savings rate?',
        answer: 'Yes. If you save 10% and your employer matches 5%, your total retirement savings rate is 15%, which is excellent.'
      }
    ]
  },

  ...guidesNew
];
