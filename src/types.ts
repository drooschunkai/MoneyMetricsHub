export interface FAQItem {
  question: string;
  answer: string;
}

export interface FormulaDetails {
  equation: string;
  variables: { name: string; description: string }[];
  explanation: string;
  example: {
    scenario: string;
    steps: string[];
    result: string;
  };
  limitations: string[];
}

export interface CalculatorInput {
  id: string;
  label: string;
  type: 'number' | 'select' | 'checkbox' | 'slider';
  defaultValue: any;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  options?: { label: string; value: any }[];
  helpText?: string;
}

export interface CalculatorReference {
  name: string;
  url?: string;
  description: string;
}

export interface CalculationResult {
  summary: { label: string; value: string; rawValue?: number; badgeColor?: string; valueColor?: string }[];
  breakdown?: { [key: string]: any }[];
  chartData?: { [key: string]: any }[];
  chartKeys?: { key: string; color: string; label: string }[];
  interpretation: string;
}

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
  relatedCalculators: string[]; // Slugs
  relatedGuides: string[]; // Slugs
}

export interface CategoryDefinition {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  seoText: string;
  featuredCalculators: string[]; // Slugs
}

export interface GuideDefinition {
  slug: string;
  title: string;
  metaDescription: string;
  readTime: string;
  category: string;
  summary: string;
  content: string; // Markdown or rich structure
  faqs?: FAQItem[];
}
