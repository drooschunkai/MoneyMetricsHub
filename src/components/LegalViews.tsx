import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import SEO from './SEO';

interface LegalProps {
  onNavigate: (route: string) => void;
}

// 1. ABOUT VIEW
export function AboutView({ onNavigate }: LegalProps) {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-slate-600 dark:text-slate-300 transition-colors duration-200">
      <SEO
        title="About Us | MoneyMetricsHub"
        description="Learn about the mathematical methodology, academic principles, and financial guidelines driving MoneyMetricsHub."
        schemaType="basic"
        slug="about"
      />
      
      <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">About MoneyMetricsHub</h1>
        <p className="text-slate-500 dark:text-slate-400 text-base">Mathematical accuracy combined with beautiful design.</p>
      </div>

      <div className="space-y-6 text-sm sm:text-base leading-relaxed">
        <p>
          Welcome to <strong>MoneyMetricsHub</strong>. We are a premium financial technology platform designed to deliver clear, fast, and completely free calculations. We build our models to serve investors, home buyers, retirement planners, and savers.
        </p>

        <h3 className="font-display text-xl font-bold text-slate-950 dark:text-white pt-4">Our Mission</h3>
        <p>
          Our mission is summed up in our tagline: <strong>Smarter Financial Decisions Through Better Numbers</strong>. Many financial calculators on the web are either cluttered with aggressive ads or obfuscate their calculations behind confusing interfaces. We believe in complete variable transparency, academic formula explanations, and interactive visualizations.
        </p>

        <h3 className="font-display text-xl font-bold text-slate-950 dark:text-white pt-4">Core Principles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <Lucide.ShieldCheck className="w-4.5 h-4.5" />
              Formula Transparency
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Every calculator details the precise mathematical formula, variables, and limitations. No hidden equations.</p>
          </div>
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <Lucide.Award className="w-4.5 h-4.5" />
              Verified References
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Our math models cite official academic, governmental, and regulatory authorities like the IRS, SEC, and Federal Reserve.</p>
          </div>
        </div>

        <h3 className="font-display text-xl font-bold text-slate-950 dark:text-white pt-4">Editorial Integrity</h3>
        <p>
          MoneyMetricsHub maintains a strict distinction between editorial calculators and marketing partnerships. All tools are built entirely with verified formulas. We do not alter calculations to favor specific financial products or referrals.
        </p>
      </div>
    </div>
  );
}

// 2. CONTACT VIEW
export function ContactView() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-slate-600 dark:text-slate-300 transition-colors duration-200">
      <SEO
        title="Contact Us | MoneyMetricsHub"
        description="Have questions about our financial calculators? Reach out to the MoneyMetricsHub editorial or engineering team."
        schemaType="basic"
        slug="contact"
      />

      <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Contact Us</h1>
        <p className="text-slate-500 dark:text-slate-400 text-base">We'd love to hear your feedback, calculator ideas, or partnership opportunities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact details */}
        <div className="md:col-span-5 space-y-6 text-slate-600 dark:text-slate-300">
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-display font-bold text-slate-900 dark:text-white text-base">Inquiries</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2.5">
                <Lucide.Mail className="w-4.5 h-4.5 text-blue-500 dark:text-blue-400" />
                <span className="text-slate-600 dark:text-slate-300">support@moneymetrichubs.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Lucide.MapPin className="w-4.5 h-4.5 text-blue-500 dark:text-blue-400" />
                <span className="text-slate-600 dark:text-slate-300">San Francisco, CA</span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-blue-50/30 dark:bg-blue-950/20 rounded-2xl border border-blue-50/50 dark:border-blue-900/40 text-xs sm:text-sm">
            <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-1 flex items-center gap-1.5">
              <Lucide.BookOpen className="w-4 h-4" />
              Calculator Requests
            </h4>
            <p className="text-slate-600 dark:text-slate-350 leading-relaxed">
              Are you a professional or FIRE practitioner looking for a specific customized formula? Reach out and we will program it.
            </p>
          </div>
        </div>

        {/* Contact form */}
        <div className="md:col-span-7 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <Lucide.Check className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Message Received!</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out to MoneyMetricsHub. A member of our financial engineering team will reply shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-500 px-4 py-2.5 rounded-xl text-sm text-slate-800 dark:text-slate-100 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-500 px-4 py-2.5 rounded-xl text-sm text-slate-800 dark:text-slate-100 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Message</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can our calculators help you?"
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-500 px-4 py-2.5 rounded-xl text-sm text-slate-800 dark:text-slate-100 outline-none transition-colors"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-sm transition-all text-sm cursor-pointer"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// 3. PRIVACY POLICY
export function PrivacyView() {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed transition-colors duration-200">
      <SEO
        title="Privacy Policy | MoneyMetricsHub"
        description="Learn how we protect your personal financial privacy. We perform calculations entirely in-browser and do not store inputted balances."
        schemaType="basic"
        slug="privacy"
      />

      <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Privacy Policy</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Last updated: June 2026</p>
      </div>

      <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white pt-2">1. Browser-Only Calculations</h3>
      <p>
        At MoneyMetricsHub, your personal financial data privacy is paramount. Unlike standard apps that upload portfolio metrics or loan details to secondary databases, all calculator engines on our platform execute entirely in your web browser. No personal income, loan, or investment figures are ever saved on our servers.
      </p>

      <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white pt-2">2. Cookies, Advertising, and AdSense Disclosure</h3>
      <p>
        We utilize standard essential session cookies to analyze traffic patterns, speed up load times, and save user preferences (like your local currency or favorite calculators).
      </p>
      <p className="mt-2">
        We also partner with third-party vendors, including <strong>Google AdSense</strong>, to serve programmatic financial advertisements when you visit our website. These advertising partners use cookies to serve ads based on a user's prior visits to our website or other websites on the Internet:
      </p>
      <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
        <li>
          <strong>Google DART Cookie:</strong> Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visits to MoneyMetricsHub and/or other sites on the Internet.
        </li>
        <li>
          <strong>Personalized Ads Opt-Out:</strong> Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800">Google Ad Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting the <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800">AboutAds Choices Page</a> or <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800">NAI Consumer Opt-Out Page</a>.
        </li>
        <li>
          <strong>Browser Cookie Settings:</strong> You can choose to disable or selectively turn off our cookies or third-party cookies in your browser settings. However, this can affect how you are able to interact with our site as well as other websites.
        </li>
      </ul>

      <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white pt-4">3. GDPR and CCPA Data Rights Compliance</h3>
      <p>
        MoneyMetricsHub is fully committed to consumer data rights under regional laws such as the General Data Protection Regulation (GDPR) for European citizens and the California Consumer Privacy Act (CCPA) for California residents:
      </p>
      <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
        <li>
          <strong>Zero Backend Storage:</strong> Since all calculator engines run entirely client-side (in-browser), we do not collect, process, compile, or store your private financial values, mortgage balances, or salaries.
        </li>
        <li>
          <strong>Right to Erasure:</strong> Your history log and calculator favorites are stored strictly inside your local browser via <code>localStorage</code>. You can completely erase this data at any time by clearing your browser cache or clicking "Clear History" in the My Hub dashboard.
        </li>
        <li>
          <strong>No Selling of Personal Data:</strong> We do not sell or rent user information to any third parties. Any non-essential tracking is subject to third-party ad network cookie opt-outs listed above.
        </li>
      </ul>

      <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white pt-4">4. Third-Party Links</h3>
      <p>
        Our calculators provide outward reference hyperlinks to official regulatory bodies (such as IRS.gov, SEC.gov, FDIC.gov) or educational resources (such as Investopedia). We do not bear responsibility for the privacy practices of external platforms.
      </p>
    </div>
  );
}

// 4. TERMS OF SERVICE
export function TermsView() {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed transition-colors duration-200">
      <SEO
        title="Terms of Service | MoneyMetricsHub"
        description="Standard terms of service and conditions for using the MoneyMetricsHub website and calculators."
        schemaType="basic"
        slug="terms"
      />

      <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Terms of Service</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Last updated: June 2026</p>
      </div>

      <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white pt-2">1. Terms Acceptance</h3>
      <p>
        By accessing MoneyMetricsHub, you agree to comply with and be bound by these terms. If you do not accept these policies, you must immediately cease usage of the calculators and site resources.
      </p>

      <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white pt-2">2. Educational Purposes Only</h3>
      <p>
        All calculators, formulas, worked examples, and guides on this platform are designed purely for informational and educational purposes. Calculations do not constitute certified financial, legal, tax, or investment advising.
      </p>

      <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white pt-2">3. Accuracy of Calculations</h3>
      <p>
        While we strive for absolute mathematical precision across our 20 calculators, we offer no warranties regarding the accuracy of output models under changing macroeconomic conditions or interest rate changes.
      </p>
    </div>
  );
}

// 5. DISCLAIMER
export function DisclaimerView() {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed transition-colors duration-200">
      <SEO
        title="Financial Disclaimer | MoneyMetricsHub"
        description="The financial calculation disclaimer. All tools are informational. Consult a certified financial planner for personal decision-making."
        schemaType="basic"
        slug="disclaimer"
      />

      <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Financial Disclaimer</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Last updated: June 2026</p>
      </div>

      <div className="p-5 bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 border border-amber-100 dark:border-amber-900/40 rounded-2xl flex gap-3.5 items-start text-xs sm:text-sm">
        <Lucide.AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-2">
          <span className="font-bold uppercase block tracking-wider text-[11px] text-amber-800 dark:text-amber-400">Critical Notice</span>
          <p className="leading-relaxed">
            The calculations provided by MoneyMetricsHub do not constitute financial advice. All formulas, values, interest compounding models, and guides are compiled for general education and estimation purposes only.
          </p>
        </div>
      </div>

      <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white pt-2">Consult a Certified Professional</h3>
      <p>
        We strongly urge you to consult a certified financial planner (CFP), licensed CPA, legal advisor, or mortgage underwriter before making major life purchases (e.g. contracting a home loan) or investing large sums of cash. Individual risk profiles, tax considerations, and local jurisdiction rules can greatly alter real-world financial calculations.
      </p>
    </div>
  );
}
