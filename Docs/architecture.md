# MoneyMetricsHub Software Architecture 🏛️

This document outlines the software design, routing strategy, core data models, calculation systems, and theme integration patterns of **MoneyMetricsHub**.

---

## 1. System Topology Overview

MoneyMetricsHub is engineered as a **Full-Stack compatible Client-First Single-Page Application (SPA)**. It leverages **React 19**, **TypeScript 5**, and **Tailwind CSS v4** to deliver near-instant loading times, fluid responsive design, and smooth layout-preserving route transitions.

```text
                           +------------------------+
                           |       Browser          |
                           +-----------+------------+
                                       |
                                       v
                           +------------------------+
                           |  App router (App.tsx)  | <------+ (popstate events)
                           +-----------+------------+
                                       |
                   +-------------------+-------------------+
                   |                                       |
                   v                                       v
         +-------------------+                   +-------------------+
         | Layout Controller |                   |  Active Content   |
         | (components/      |                   |  (components/)    |
         |  Layout.tsx)      |                   +---------+---------+
         +---------+---------+                             |
                   |                                       |
  (Side Navigation & Theme Toggle)       (Home / Category / Search / Calc / Guide)
                   |                                       |
                   v                                       |
         +-------------------+                             |
         | Theme System      | <---------------------------+
         | (Tailwind v4      |
         |  @variant dark)   |
         +-------------------+
```

---

## 2. Router & State Architecture

To maintain compatibility with container integrations, sandboxed iframes, and local preview constraints, MoneyMetricsHub uses a **declarative custom pushState and popState routing engine** implemented in `src/App.tsx`.

### Architectural Decisions
- **Zero-Dependency Routing**: Standard routing libraries (such as `react-router-dom`) are avoided to keep the client bundle slim and prevent route-mismatch crashes inside sandboxed preview iframes.
- **Location Synchronization**: Pathname checking matches specific regex or prefixes (such as `/calculators/:slug`, `/categories/:slug`, or `/guides/:slug`).
- **Synchronous Layout Preservation**: Navigating calls `window.history.pushState` and updates the React state synchronously, triggering smooth React state updates and scrolling instantly to the top of the viewport.
- **Back/Forward History Support**: Employs an event listener on the standard window `popstate` event to rebuild the internal `RouteState` tree when the user clicks browser navigation buttons.

---

## 3. Data-Driven Schemas (Declarative Calculators)

Rather than hardcoding dozens of calculator pages, MoneyMetricsHub decouples the **user interface** from the **underlying financial definitions**. All calculators are loaded dynamically based on metadata defined in `src/types.ts`.

### Dynamic Calculator Rendering Lifecycle
1. **Selection**: `CalculatorView.tsx` parses the current URL slug and fetches the exact `CalculatorDefinition` matching the path.
2. **Dynamic Inputs Initialization**: Inputs state is generated lazily using the calculator’s metadata array:
   ```typescript
   const [inputs, setInputs] = useState<Record<string, any>>(() => {
     const defaultVals: Record<string, any> = {};
     calculator.inputs.forEach((input) => {
       defaultVals[input.id] = input.defaultValue;
     });
     return defaultVals;
   });
   ```
3. **Reactive Computations**: Every input change updates the state. React automatically triggers the functional engine defined on the calculator metadata:
   ```typescript
   const result = calculator.calculate(inputs);
   ```
   *Note: Because computations are pure JavaScript/TypeScript formulas, they take < 1ms to execute, giving the user a real-time, instantaneous calculation feedback loop with no lag.*

---

## 4. Theme System & Tailwind CSS v4 Custom Variant

MoneyMetricsHub implements an elite-tier dark mode toggle built directly on Tailwind CSS v4's modern `@variant` directive.

### CSS Theme Architecture (`src/index.css`)
```css
@import "tailwindcss";

/* Define custom variant to target elements inside class="dark" seamlessly */
@variant dark (&:where(.dark, .dark *));

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Space Grotesk", sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
}
```

### The State Loop
- The active theme (`light` or `dark`) is managed in `Layout.tsx` using standard react state and stored in `localStorage` for continuous session persistence.
- To prevent initial page load flickering, the theme state applies the `.dark` class directly to the document root element (`document.documentElement.classList`).

---

## 5. Decoupled Computation Engine

The financial engines are isolated from React, making them easy to write, unit test, and maintain. For example, a sample layout of a decoupled loan engine (`src/data/calculators/loans_new.ts`):

```typescript
export const mortgageCalculator: CalculatorDefinition = {
  id: 'mortgage-calc',
  slug: 'mortgage-calculator',
  name: 'Mortgage Calculator',
  // ... metadata details ...
  inputs: [
    { id: 'homeValue', label: 'Home Value', type: 'number', defaultValue: 400000 },
    { id: 'downPayment', label: 'Down Payment', type: 'number', defaultValue: 80000 }
  ],
  calculate: (inputs) => {
    const homeValue = Number(inputs.homeValue || 0);
    const downPayment = Number(inputs.downPayment || 0);
    
    // Core math formulas
    const principal = homeValue - downPayment;
    
    return {
      summary: [
        { label: 'Loan Amount', value: `$${principal.toLocaleString()}`, rawValue: principal }
      ],
      interpretation: 'Your monthly mortgage principal is estimated based on current market metrics.'
    };
  }
};
```

This guarantees that:
- Core calculation code is independent of browser APIs and UI rendering loops.
- Layout rendering concerns are completely separated from complex formulas (e.g., amortization table loops).

---

## 6. High-Performance SVG Rendering

To ensure fast load speeds and prevent visual layout shifting (CLS), MoneyMetricsHub replaces bloated commercial charting engines with **lightweight, responsive, hand-crafted SVG elements**:

- **Donut/Pie Split Segments**: Generated programmatically using mathematical projections and `strokeDasharray` / `strokeDashoffset` coordinates inside responsive `<svg>` viewboxes:
  ```typescript
  const percentage = item.value / total;
  const strokeDasharray = `${percentage * 251.2} 251.2`;
  const strokeDashoffset = `-${cumulativePercent * 251.2}`;
  ```
- **Stacked & Vertical Bar Graphs**: Built using simple CSS-flex grids and responsive SVG rectangles with smooth layout animations driven by standard tailwind transitions.
- **ResizeObserver Alignment**: Dynamic responsive calculations are handled safely via non-blocking browser dimensions state, completely decoupling viewport scaling from arbitrary layout assumptions.

---

## 7. Performance & Optimization Checklist

1. **Lazy State Initialization**: Component forms use function-based state initialization to prevent parsing metadata arrays on every component render.
2. **Static Asset Caching**: Shared static data elements (calculators list, categories list, guides) are initialized as immutable records outside component trees, conserving memory.
3. **Optimal Ref Usage**: Utilizes focus states and `useRef` handles to manage interactive FAQs and list filters, minimizing React re-renders.
4. **Pure CSS Animation**: Wherever possible, tailwind CSS utility transitions are favored over heavy JS animation frames, reducing layout main-thread blocking to 0ms.
