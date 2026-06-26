# MoneyMetricsHub 📈

Welcome to **MoneyMetricsHub** — a high-performance, single-page application (SPA) financial tools suite built with **React**, **TypeScript**, and **Tailwind CSS v4**. 

MoneyMetricsHub delivers powerful, industry-standard, free financial calculators with precise mathematical projections, interactive visualization, detailed formulas, and educational content to empower users to make smart financial decisions.

---

## 🎨 Design Concept: "Modern Slate & Clean Contrast"

MoneyMetricsHub is built from the ground up to focus on visual clarity, clean typography, and a streamlined layout:
- **Responsive Fluid Grid**: Adapts gracefully to all viewports, ensuring touch targets are at least `44px` on mobile and content maintains elegant proportions on desktop.
- **Accessible Color Systems**: Full integration of custom Slate light and dark themes using modern CSS variables with native Tailwind CSS v4 variables.
- **Micro-Animations**: Uses high-fidelity, purpose-built animations powered by **Vite** and **Motion** (`motion/react`) for layout transitions and interactive states.
- **SVG-Driven Visualizations**: Features dynamically scaled pie/donut split segments and horizontal/vertical bar charts with zero heavy external charting dependencies, maximizing page-load speeds.

---

## 🚀 Quick Start

Ensure you have **Node.js 18+** installed on your system.

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
Starts the application on `http://localhost:3000` with hot-reloading disabled (to avoid state disruption during incremental edits):
```bash
npm run dev
```

### 3. Build for Production
Compiles the React application into optimized static assets in the `dist/` directory:
```bash
npm run build
```

### 4. Code Quality & Formatting
Run TypeScript type-checking to verify that the app builds without compilation warnings or errors:
```bash
npm run lint
```

---

## 📁 Project Structure

Here is an overview of the core workspace layout:

```text
├── Docs/
│   ├── readme.md               # Main project overview (This file)
│   └── architecture.md         # Full software architectural blueprint
├── src/
│   ├── main.tsx                # Client-side React 19 entry point
│   ├── App.tsx                 # Manual hashless routing & state coordinator
│   ├── index.css               # Global Tailwind CSS directives & theme config
│   ├── types.ts                # Strong type definitions for guides & calculators
│   ├── components/             # React View & Presentation Layers
│   │   ├── Layout.tsx          # Master sidebar, header, dark-mode toggle, footer
│   │   ├── HomeView.tsx        # Dynamic dashboard featuring categories & guides
│   │   ├── CategoryView.tsx    # Category-specific calculator lists
│   │   ├── CalculatorView.tsx  # Dynamic calculator form, SVG chart render, FAQ accordion
│   │   ├── SearchView.tsx      # Real-time fuzzy-search tool across tools & resources
│   │   ├── GuideView.tsx       # Educational articles with formula breakdowns
│   │   ├── SEO.tsx             # Structured metadata & social graph definitions
│   │   └── LegalViews.tsx      # Terms, Privacy, About, & Contact pages
│   └── data/                   # Data Store & Calculator Engines
│       ├── calculators/        # Domain-specific mathematical solvers
│       │   ├── business_new.ts    # Breakeven, Margin, and Valuation formulas
│       │   ├── debt_new.ts        # Debt Snowball & Avalanche prioritizers
│       │   ├── investing_new.ts   # Compound Interest & CAGR engines
│       │   ├── loans_new.ts       # Detailed Mortgage & Loan amortization tables
│       │   ├── retirement_new.ts  # FIRE, pension, and standard retirement planners
│       │   └── taxes_new.ts       # Dynamic income tax brackets & payroll calculators
│       ├── calculators.ts      # Consolidated index of calculator definitions
│       ├── categories.ts       # Category definitions & descriptions
│       └── guides.ts           # Markdown guide articles and references
├── package.json                # Project dependencies and scripts
└── vite.config.ts              # Vite compiler configuration
```

---

## ⚙️ Adding a New Calculator

MoneyMetricsHub is completely modular and data-driven. To add a new calculator, you do **not** need to touch the frontend layout. Simply follow these steps:

1. **Define the Input and Math Logic**: Create or edit a category file under `src/data/calculators/` (e.g. `loans_new.ts`).
2. **Adhere to the `CalculatorDefinition` type**:
   ```typescript
   export interface CalculatorDefinition {
     id: string;
     slug: string;
     name: string;
     title: string;
     metaDescription: string;
     shortDescription: string;
     category: string;
     inputs: CalculatorInput[];
     calculate: (inputs: Record<string, any>) => CalculationResult;
     formula: FormulaDetails;
     faqs: FAQItem[];
     references: CalculatorReference[];
     relatedCalculators: string[];
     relatedGuides: string[];
   }
   ```
3. **Export and Register**: Import and append your new calculator definition to the `calculators` array in `src/data/calculators.ts`.
4. **Verification**: Save your files and run `npm run lint`. The search index, categories dashboard, and routing handlers will automatically pick up, index, and render your new calculator dynamically!

---

## ⚖️ License and Disclaimer

This software is for educational and illustrative purposes. Calculations provided by MoneyMetricsHub do not constitute certified professional financial or tax planning advice. 

All standard financial calculations are executed client-side using industry-recognized formulas and are not stored or transmitted to external servers.
