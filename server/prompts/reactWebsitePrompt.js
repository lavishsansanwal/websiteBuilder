import commonRules from "./commonRules.js";

const reactWebsitePrompt = `
${commonRules}

==================================================
PAGE TYPE: PRODUCTION-GRADE REACT (JSX + TAILWIND) APPLICATION / WEBSITE
==================================================

You are generating a breathtaking, state-of-the-art **React (JSX) Web Application / Website** using Tailwind CSS and Lucide icons.
The design MUST look like a world-class production website from Stripe, Linear, or Vercel with rich interactivity, stateful tabs, pricing toggles, modals, FAQs, and a 100% functional footer with ONLY working links.

USER PROMPT:
{USER_PROMPT}

==================================================
REACT STATE & INTERACTIVITY REQUIREMENTS (MANDATORY)
==================================================
1. Write a single, complete, production-ready React component named \`App\`.
2. Use standard React hooks (\`useState\`, \`useEffect\`, \`useMemo\`, \`useRef\`).
3. Include functional interactive states:
   - \`const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', message: '' })\` -> Controlled state for full name, email, phone, and context.
   - \`const [isSubmitting, setIsSubmitting] = useState(false)\` -> Submission loading state.
   - \`const [isAnnual, setIsAnnual] = useState(false)\` -> Dynamic pricing switcher (Monthly vs Annual with -20% calculation in real time).
   - \`const [activeTab, setActiveTab] = useState(0)\` -> Interactive product demo / feature tabs that change displayed preview content.
   - \`const [openFaq, setOpenFaq] = useState(null)\` -> Smooth accordion FAQ expansion / collapse.
   - \`const [modalOpen, setModalOpen] = useState(false)\` -> Lead capture / contact / booking modal with validation.
   - \`const [privacyModalOpen, setPrivacyModalOpen] = useState(false)\` -> Real Privacy Policy & Terms modal.
   - \`const [mobileMenu, setMobileMenu] = useState(false)\` -> Mobile drawer navigation.
   - \`const [toast, setToast] = useState('')\` -> Toast notification feedback engine.
   - \`const [email, setEmail] = useState('')\` -> Newsletter subscription state with instant toast.
   - \`const [cart, setCart] = useState([])\` -> If building an e-commerce store / restaurant menu: Cart / Bag MUST start 100% EMPTY (\`[]\`). NEVER pre-populate with 3 items. Render a clean empty bag state with "Start Shopping" button when empty.
4. In \`useEffect\`, initialize Lucide icons: \`if (window.lucide) window.lucide.createIcons();\`.
5. Use real high-resolution Unsplash photo URLs for avatars, showcase mockups, and team images.

==================================================
STRICT FOOTER & FUNCTIONAL LINKING RULES (CRITICAL)
==================================================
- **ONLY REAL, WORKING LINKS IN FOOTER**:
  - In the footer, NEVER include fake dead links like \`/careers\`, \`/press\`, \`/blog\`, \`/integrations\`, \`/docs\`, \`/api\`, \`/partners\`, \`/investors\`, \`/legal\`, \`/status\`, \`/changelog\`, \`href="#"\`, or \`href="javascript:void(0)"\`.
  - Every footer link MUST either:
    1. **Smooth scroll to an existing on-page section ID**: e.g., \`<a href="#hero">\`, \`<a href="#features">\`, \`<a href="#demo">\`, \`<a href="#pricing">\`, \`<a href="#testimonials">\`, \`<a href="#faq">\`, \`<a href="#contact">\`.
    2. **Trigger a functional modal**: e.g., \`<button onClick={() => setPrivacyModalOpen(true)}>\` for Privacy Policy & Terms, or \`<button onClick={() => setModalOpen(true)}>\` for Contact / Inquiries.
    3. **Perform a direct action**: e.g., \`<button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>\` for Back to Top, or \`<a href="mailto:hello@example.com">\`.
    4. **Subscribe to newsletter**: \`<form onSubmit={handleSubscribe}>\` with toast.

==================================================
EXACT REACT COMPONENT BLUEPRINT
==================================================

\`\`\`jsx
import React, { useState, useEffect } from 'react';

export default function App() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState('');
  const [email, setEmail] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    showToast('Thank you! You are on the priority list. 🚀');
    setEmail('');
  };

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      showToast('Please fill in your name, email, and phone number.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setModalOpen(false);
      showToast("Thank you, " + formData.name + "! We received your inquiry and will contact you at " + formData.phone + " shortly. 🚀");
      setFormData({ name: '', email: '', phone: '', company: '', message: '' });
    }, 600);
  };

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [activeTab, openFaq, modalOpen, privacyModalOpen, mobileMenu]);

  const tabsData = [
    { title: "Smart Automation", desc: "Automate recurring workflows with AI-driven triggers.", stat: "99.9% Uptime", icon: "zap" },
    { title: "Real-Time Insights", desc: "Monitor telemetry, conversion rates, and KPIs live.", stat: "10x Faster", icon: "activity" },
    { title: "Enterprise Security", desc: "End-to-end encryption with SOC-2 Type II certification.", stat: "256-Bit SSL", icon: "shield-check" }
  ];

  const faqs = [
    { q: "How quickly can my team get started?", a: "You can onboard in under 5 minutes with our guided wizard and pre-built integrations." },
    { q: "Can I change or cancel my plan at any time?", a: "Yes, you can upgrade, downgrade, or cancel your subscription directly from your settings dashboard anytime." },
    { q: "Is there a free trial available?", a: "Absolutely! We offer a 14-day full-access free trial with no credit card required." },
    { q: "What security measures do you have in place?", a: "All data is encrypted in transit and at rest with role-based access control and daily automated backups." }
  ];

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-amber-500 text-black text-xs font-extrabold shadow-2xl transition-all duration-300 flex items-center gap-2">
          <i data-lucide="sparkles" className="w-4 h-4"></i>
          <span>{toast}</span>
        </div>
      )}

      {/* Contact & Lead Capture Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b0f19] border border-slate-800 p-8 rounded-3xl max-w-md w-full shadow-2xl relative space-y-5">
            <button onClick={() => setModalOpen(false)} className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
              <i data-lucide="x" className="w-4 h-4"></i>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <i data-lucide="sparkles" className="w-5 h-5"></i>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Speak with an Expert</h3>
                <p className="text-xs text-slate-400">Response guaranteed in under 15 minutes.</p>
              </div>
            </div>
            <form onSubmit={handleLeadSubmit} className="space-y-3.5">
              <div className="relative flex items-center">
                <i data-lucide="user" className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none"></i>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div className="relative flex items-center">
                <i data-lucide="mail" className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none"></i>
                <input
                  type="email"
                  required
                  placeholder="Work Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div className="relative flex items-center">
                <i data-lucide="phone" className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none"></i>
                <input
                  type="tel"
                  required
                  placeholder="Phone / Mobile Number (+1 555 000-0000)"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 hover:opacity-95 transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? <span>Submitting...</span> : <span>Submit Inquiry ➔</span>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Privacy Policy & Terms Modal */}
      {privacyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b0f19] border border-slate-800 p-8 rounded-3xl max-w-lg w-full shadow-2xl relative space-y-4 max-h-[85vh] overflow-y-auto">
            <button onClick={() => setPrivacyModalOpen(false)} className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
              <i data-lucide="x" className="w-4 h-4"></i>
            </button>
            <h3 className="text-xl font-bold text-white">Privacy Policy & Terms of Service</h3>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>We respect your privacy and are committed to protecting personal data. All information submitted through our platform is encrypted with AES-256 standard.</p>
              <p>We never sell your personal information or telemetry data to third parties. Data is solely used to provide, maintain, and optimize platform services.</p>
              <p>By using our website, you agree to our standard terms of responsible use, uptime service level commitments, and fair usage guidelines.</p>
            </div>
            <button onClick={() => setPrivacyModalOpen(false)} className="w-full py-2.5 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition">
              I Understand & Agree
            </button>
          </div>
        </div>
      )}

      {/* STICKY NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#070b12]/85 backdrop-blur-xl border-b border-slate-800/80 px-6 lg:px-12 h-16 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <i data-lucide="sparkles" className="w-5 h-5 text-white"></i>
          </div>
          <span className="text-base font-bold text-white tracking-tight">ApexStudio</span>
        </a>

        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-400">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#demo" className="hover:text-white transition">Interactive Demo</a>
          <a href="#pricing" className="hover:text-white transition">Pricing</a>
          <a href="#testimonials" className="hover:text-white transition">Testimonials</a>
          <a href="#faq" className="hover:text-white transition">FAQ</a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button onClick={() => setModalOpen(true)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition">Sign In</button>
          <button onClick={() => setModalOpen(true)} className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 hover:opacity-95 transition">
            Get Started
          </button>
        </div>

        <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 text-slate-400 hover:text-white">
          <i data-lucide="menu" className="w-5 h-5"></i>
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileMenu && (
        <div className="md:hidden fixed inset-x-0 top-16 z-30 bg-[#0b0f19] border-b border-slate-800 p-6 space-y-4">
          <div className="flex flex-col gap-3 text-sm text-slate-300">
            <a href="#features" onClick={() => setMobileMenu(false)} className="hover:text-white py-1">Features</a>
            <a href="#demo" onClick={() => setMobileMenu(false)} className="hover:text-white py-1">Interactive Demo</a>
            <a href="#pricing" onClick={() => setMobileMenu(false)} className="hover:text-white py-1">Pricing</a>
            <a href="#testimonials" onClick={() => setMobileMenu(false)} className="hover:text-white py-1">Testimonials</a>
            <a href="#faq" onClick={() => setMobileMenu(false)} className="hover:text-white py-1">FAQ</a>
          </div>
          <button onClick={() => { setMobileMenu(false); setModalOpen(true); }} className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold shadow-lg">
            Get Started
          </button>
        </div>
      )}

      {/* HERO SECTION (#hero) */}
      <section id="hero" className="px-6 lg:px-12 pt-20 pb-16 max-w-6xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
          <span>Next Generation Architecture • Live Interactive Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          The Intelligent Platform for <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Modern Teams</span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Scale your business, automate complex workflows, and gain deep actionable insights with our high-performance cloud platform.
        </p>

        <div className="flex items-center justify-center gap-4 pt-2">
          <button onClick={() => setModalOpen(true)} className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-xs shadow-xl shadow-indigo-500/25 hover:opacity-95 transition">
            Start 14-Day Free Trial
          </button>
          <a href="#demo" className="px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-semibold text-xs transition flex items-center gap-2">
            <i data-lucide="play-circle" className="w-4 h-4 text-indigo-400"></i> Explore Interactive Demo
          </a>
        </div>
      </section>

      {/* FEATURES BENTO GRID (#features) */}
      <section id="features" className="px-6 lg:px-12 py-20 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Engineered for Unmatched Performance</h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">Discover modular building blocks designed to handle extreme scale and real-time operations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-[#0b0f19] border border-slate-800/80 space-y-4 hover:border-indigo-500/30 transition shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <i data-lucide="cpu" className="w-6 h-6"></i>
            </div>
            <h3 className="text-lg font-bold text-white">AI-Powered Engine</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Neural processing cores automatically detect patterns and orchestrate autonomous executions.</p>
          </div>

          <div className="p-8 rounded-3xl bg-[#0b0f19] border border-slate-800/80 space-y-4 hover:border-indigo-500/30 transition shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <i data-lucide="layers" className="w-6 h-6"></i>
            </div>
            <h3 className="text-lg font-bold text-white">Modular Architecture</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Integrate effortlessly into existing stacks with microservice pipelines and instant webhooks.</p>
          </div>

          <div className="p-8 rounded-3xl bg-[#0b0f19] border border-slate-800/80 space-y-4 hover:border-indigo-500/30 transition shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <i data-lucide="shield" className="w-6 h-6"></i>
            </div>
            <h3 className="text-lg font-bold text-white">Bank-Grade Compliance</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Continuous automated audits, granular RBAC permissions, and strict zero-trust protocol enforcement.</p>
          </div>
        </div>
      </section>

      {/* INTERACTIVE DEMO TABS (#demo) */}
      <section id="demo" className="px-6 lg:px-12 py-20 bg-[#090d16] border-y border-slate-800/60">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Interactive Platform Demo</h2>
            <p className="text-slate-400 text-xs sm:text-sm">Click through the tabs below to preview the core engine in action.</p>
          </div>

          <div className="flex justify-center gap-2 flex-wrap">
            {tabsData.map((tab, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={\`px-5 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 \${
                  activeTab === idx
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }\`}
              >
                <i data-lucide={tab.icon} className="w-4 h-4"></i>
                {tab.title}
              </button>
            ))}
          </div>

          <div className="p-8 rounded-3xl bg-[#0b0f19] border border-slate-800 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[11px] font-bold uppercase tracking-wider">
                Feature Highlight
              </span>
              <h3 className="text-2xl font-bold text-white">{tabsData[activeTab].title}</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{tabsData[activeTab].desc}</p>
              <div className="pt-2">
                <span className="text-xs text-slate-500 font-mono">Performance Metric: </span>
                <span className="text-xs text-emerald-400 font-bold font-mono">{tabsData[activeTab].stat}</span>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-3 font-mono text-xs text-slate-300">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                <span className="text-[10px] ml-auto">status: active</span>
              </div>
              <p className="text-indigo-400">&gt; telemetry.syncSession()</p>
              <p className="text-slate-400">&gt; status: 200 OK (latency: 14ms)</p>
              <p className="text-emerald-400">&gt; throughput: 48,200 req/sec</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION (#pricing) */}
      <section id="pricing" className="px-6 lg:px-12 py-20 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Transparent, Flexible Pricing</h2>
          <p className="text-slate-400 text-xs sm:text-sm">Choose the tier that aligns with your team scale.</p>

          <div className="inline-flex items-center gap-3 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setIsAnnual(false)}
              className={\`px-4 py-2 rounded-xl text-xs font-semibold transition \${!isAnnual ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}\`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={\`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 \${isAnnual ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}\`}
            >
              <span>Annual</span>
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-[#0b0f19] border border-slate-800 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Starter</h3>
              <p className="text-xs text-slate-400">For early-stage startups and builders.</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">{isAnnual ? '$15' : '$19'}</span>
                <span className="text-xs text-slate-500">/ month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-slate-800">
                <li className="flex items-center gap-2"><i data-lucide="check" className="w-4 h-4 text-indigo-400"></i> Up to 5 Team Members</li>
                <li className="flex items-center gap-2"><i data-lucide="check" className="w-4 h-4 text-indigo-400"></i> 100K API Requests / mo</li>
                <li className="flex items-center gap-2"><i data-lucide="check" className="w-4 h-4 text-indigo-400"></i> Community Support</li>
              </ul>
            </div>
            <button onClick={() => setModalOpen(true)} className="w-full py-3 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition">
              Get Started
            </button>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-b from-indigo-950/40 to-[#0b0f19] border border-indigo-500/40 space-y-6 flex flex-col justify-between relative shadow-2xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-500 text-white text-[10px] font-extrabold tracking-wider uppercase">
              Most Popular
            </div>
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Professional</h3>
              <p className="text-xs text-slate-400">For high-growth scaleups and companies.</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">{isAnnual ? '$39' : '$49'}</span>
                <span className="text-xs text-slate-500">/ month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-slate-800">
                <li className="flex items-center gap-2"><i data-lucide="check" className="w-4 h-4 text-indigo-400"></i> Unlimited Team Members</li>
                <li className="flex items-center gap-2"><i data-lucide="check" className="w-4 h-4 text-indigo-400"></i> 2M API Requests / mo</li>
                <li className="flex items-center gap-2"><i data-lucide="check" className="w-4 h-4 text-indigo-400"></i> Priority 24/7 Support</li>
                <li className="flex items-center gap-2"><i data-lucide="check" className="w-4 h-4 text-indigo-400"></i> Custom Webhooks & Analytics</li>
              </ul>
            </div>
            <button onClick={() => setModalOpen(true)} className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 hover:opacity-95 transition">
              Start Free Trial
            </button>
          </div>

          <div className="p-8 rounded-3xl bg-[#0b0f19] border border-slate-800 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Enterprise</h3>
              <p className="text-xs text-slate-400">For global organizations requiring dedicated SLAs.</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">{isAnnual ? '$99' : '$129'}</span>
                <span className="text-xs text-slate-500">/ month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-slate-800">
                <li className="flex items-center gap-2"><i data-lucide="check" className="w-4 h-4 text-indigo-400"></i> Dedicated Infrastructure</li>
                <li className="flex items-center gap-2"><i data-lucide="check" className="w-4 h-4 text-indigo-400"></i> 99.99% SLA Guarantee</li>
                <li className="flex items-center gap-2"><i data-lucide="check" className="w-4 h-4 text-indigo-400"></i> Custom Security Compliance</li>
              </ul>
            </div>
            <button onClick={() => setModalOpen(true)} className="w-full py-3 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION (#testimonials) */}
      <section id="testimonials" className="px-6 lg:px-12 py-20 bg-[#090d16] border-y border-slate-800/60">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Trusted by Leading Engineering Teams</h2>
            <p className="text-slate-400 text-xs sm:text-sm">See how companies accelerate velocity and reliability.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#0b0f19] border border-slate-800 space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => <i key={i} data-lucide="star" className="w-4 h-4 fill-amber-400"></i>)}
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">"The platform cut our operational latency by over 70% in the first week alone. The developer experience is world-class."</p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-800/80">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Sarah Chen" className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30" />
                <div>
                  <h4 className="text-xs font-bold text-white">Sarah Chen</h4>
                  <p className="text-[11px] text-slate-500">VP of Engineering, Veloce</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#0b0f19] border border-slate-800 space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => <i key={i} data-lucide="star" className="w-4 h-4 fill-amber-400"></i>)}
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">"Migrating our pipelines was completely frictionless. The telemetry and automated alerts prevent outages before they happen."</p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-800/80">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="David Marcus" className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30" />
                <div>
                  <h4 className="text-xs font-bold text-white">David Marcus</h4>
                  <p className="text-[11px] text-slate-500">CTO, CloudGrid</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#0b0f19] border border-slate-800 space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => <i key={i} data-lucide="star" className="w-4 h-4 fill-amber-400"></i>)}
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">"Best investment our infrastructure team made this year. High reliability, zero downtime, and exceptional customer support."</p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-800/80">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80" alt="Elena Rostova" className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30" />
                <div>
                  <h4 className="text-xs font-bold text-white">Elena Rostova</h4>
                  <p className="text-[11px] text-slate-500">Principal Architect, SynthAI</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION (#faq) */}
      <section id="faq" className="px-6 lg:px-12 py-20 max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Frequently Asked Questions</h2>
          <p className="text-slate-400 text-xs sm:text-sm">Find quick answers to common questions about our platform.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-2xl bg-[#0b0f19] border border-slate-800 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left text-xs sm:text-sm font-bold text-white flex items-center justify-between hover:text-indigo-400 transition"
              >
                <span>{faq.q}</span>
                <i data-lucide="chevron-down" className={\`w-4 h-4 text-slate-400 transition-transform duration-300 \${openFaq === idx ? 'rotate-180 text-indigo-400' : ''}\`}></i>
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* LEAD CAPTURE & CONTACT SECTION (#contact) */}
      <section id="contact" className="px-6 lg:px-12 py-20 max-w-5xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#0e1424] to-[#080d1a] border border-slate-800 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[11px] font-bold uppercase tracking-wider">
              Get In Touch
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Speak With Our Product Specialists</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Have questions about security, volume pricing, or custom deployment models? Our team responds in under 15 minutes.
            </p>
            <div className="space-y-3 pt-3 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <i data-lucide="check-circle" className="w-4 h-4 text-emerald-400"></i>
                <span>Direct 1-on-1 technical consultation</span>
              </div>
              <div className="flex items-center gap-2.5">
                <i data-lucide="check-circle" className="w-4 h-4 text-emerald-400"></i>
                <span>Custom architecture and migration estimate</span>
              </div>
              <div className="flex items-center gap-2.5">
                <i data-lucide="check-circle" className="w-4 h-4 text-emerald-400"></i>
                <span>Dedicated account manager & SLA</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-[#060911]/90 border border-slate-800/80 space-y-4">
            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Full Name</label>
                <div className="relative flex items-center">
                  <i data-lucide="user" className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none"></i>
                  <input
                    type="text"
                    required
                    name="name"
                    placeholder="e.g. Alex Morgan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Work Email</label>
                  <div className="relative flex items-center">
                    <i data-lucide="mail" className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none"></i>
                    <input
                      type="email"
                      required
                      name="email"
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Phone / Mobile Number</label>
                  <div className="relative flex items-center">
                    <i data-lucide="phone" className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none"></i>
                    <input
                      type="tel"
                      required
                      name="phone"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Project Details or Inquiries (Optional)</label>
                <textarea
                  rows="3"
                  name="message"
                  placeholder="Tell us about your team size, tech stack, or requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 hover:opacity-95 transition flex items-center justify-center gap-2"
              >
                <i data-lucide="send" className="w-4 h-4"></i>
                <span>{isSubmitting ? "Processing..." : "Submit Inquiry ➔"}</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="px-6 lg:px-12 py-16 max-w-6xl mx-auto">
        <div className="p-10 rounded-3xl bg-gradient-to-r from-indigo-900/50 via-purple-900/30 to-slate-900 border border-indigo-500/30 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Ready to Elevate Your Team's Workflow?</h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto">Start your 14-day free trial today. No setup fees, cancel anytime.</p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => setModalOpen(true)} className="px-8 py-3.5 rounded-xl bg-white text-slate-950 font-bold text-xs shadow-xl hover:bg-slate-100 transition">
              Get Started Now
            </button>
            <a href="#contact" className="px-6 py-3.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 text-xs font-semibold hover:text-white transition">
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      {/* 100% FUNCTIONAL FOOTER WITH ONLY WORKING LINKS */}
      <footer className="border-t border-slate-800/80 bg-[#05080e] px-6 lg:px-12 pt-16 pb-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/60">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <a href="#hero" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <i data-lucide="sparkles" className="w-4 h-4 text-white"></i>
              </div>
              <span className="text-base font-bold text-white tracking-tight">ApexStudio</span>
            </a>
            <p className="text-xs text-slate-400 leading-relaxed">Enterprise infrastructure and workflow orchestration engineered for speed, security, and scale.</p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <button onClick={() => showToast('Opening GitHub repository...')} className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:text-white transition">
                <i data-lucide="github" className="w-4 h-4"></i>
              </button>
              <button onClick={() => showToast('Opening Twitter / X...')} className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:text-white transition">
                <i data-lucide="twitter" className="w-4 h-4"></i>
              </button>
              <button onClick={() => showToast('Opening Discord community...')} className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:text-white transition">
                <i data-lucide="message-square" className="w-4 h-4"></i>
              </button>
            </div>
          </div>

          {/* Col 2: Quick Navigation (ONLY working on-page anchors) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#hero" className="hover:text-white transition flex items-center gap-1.5"><i data-lucide="arrow-right" className="w-3 h-3 text-indigo-400"></i> Overview</a></li>
              <li><a href="#features" className="hover:text-white transition flex items-center gap-1.5"><i data-lucide="arrow-right" className="w-3 h-3 text-indigo-400"></i> Features & Tech</a></li>
              <li><a href="#demo" className="hover:text-white transition flex items-center gap-1.5"><i data-lucide="arrow-right" className="w-3 h-3 text-indigo-400"></i> Platform Demo</a></li>
              <li><a href="#pricing" className="hover:text-white transition flex items-center gap-1.5"><i data-lucide="arrow-right" className="w-3 h-3 text-indigo-400"></i> Pricing Tiers</a></li>
              <li><a href="#testimonials" className="hover:text-white transition flex items-center gap-1.5"><i data-lucide="arrow-right" className="w-3 h-3 text-indigo-400"></i> Testimonials</a></li>
              <li><a href="#faq" className="hover:text-white transition flex items-center gap-1.5"><i data-lucide="arrow-right" className="w-3 h-3 text-indigo-400"></i> FAQ</a></li>
            </ul>
          </div>

          {/* Col 3: Contact & Support (working modals and links) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Contact & Support</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <i data-lucide="mail" className="w-3.5 h-3.5 text-indigo-400"></i>
                <a href="mailto:support@apexstudio.io" className="hover:text-white transition">support@apexstudio.io</a>
              </p>
              <p className="flex items-center gap-2">
                <i data-lucide="phone" className="w-3.5 h-3.5 text-indigo-400"></i>
                <a href="tel:+18005550199" className="hover:text-white transition">+1 (800) 555-0199</a>
              </p>
              <div className="pt-2">
                <button onClick={() => setModalOpen(true)} className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-indigo-400 hover:text-white transition">
                  Book Live Consultation
                </button>
              </div>
            </div>
          </div>

          {/* Col 4: Newsletter & Back to Top */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Stay Updated</h4>
            <p className="text-xs text-slate-400">Subscribe for release changelogs and platform updates.</p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter work email"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
              />
              <button type="submit" className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="max-w-6xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ApexStudio Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => setPrivacyModalOpen(true)} className="hover:text-slate-300 transition">Privacy Policy</button>
            <button onClick={() => setPrivacyModalOpen(true)} className="hover:text-slate-300 transition">Terms of Service</button>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition flex items-center gap-1">
              <span>Back to Top</span>
              <i data-lucide="arrow-up" className="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
\`\`\`

Return ONLY the single raw JSON object without markdown code fences:
{
  "code": "import React, { useState, useEffect } from 'react';\\n\\nexport default function App() { ... }",
  "message": "Overview of the React website generated for your request",
  "imageQueries": []
}
`;

export default reactWebsitePrompt;
