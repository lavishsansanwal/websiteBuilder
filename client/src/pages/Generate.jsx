import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    ArrowLeft,
    Sun,
    Moon,
    Sparkles,
    Globe,
    LayoutDashboard,
    Rocket,
    Wand2,
    CheckCircle2,
    Zap,
    Layers
} from "lucide-react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { serverUrl } from "../App";

const PHASES = [
    "Analyzing your vision & business model…",
    "Selecting layout, typography & design system…",
    "Writing responsive HTML5 & modern CSS…",
    "Implementing Chart.js, cart & interactive JavaScript…",
    "Curating high-resolution Unsplash imagery…",
    "Final quality & responsive polish…",
];

const TYPE_OPTIONS = [
    {
        id: "auto",
        label: "Auto Detect",
        icon: Wand2,
        desc: "AI selects optimal layout from your prompt",
        color: "from-amber-500/20 to-orange-500/20",
        border: "border-amber-500/30",
        activeText: "text-amber-400"
    },
    {
        id: "website",
        label: "Full Website",
        icon: Globe,
        desc: "Multi-section site with store/services & navigation",
        color: "from-indigo-500/20 to-purple-500/20",
        border: "border-indigo-500/30",
        activeText: "text-indigo-400"
    },
    {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        desc: "Analytics, KPI cards, Chart.js graphs & data tables",
        color: "from-cyan-500/20 to-blue-500/20",
        border: "border-cyan-500/30",
        activeText: "text-cyan-400"
    },
    {
        id: "landing",
        label: "Landing Page",
        icon: Rocket,
        desc: "High-converting SaaS/product page with pricing & FAQ",
        color: "from-emerald-500/20 to-teal-500/20",
        border: "border-emerald-500/30",
        activeText: "text-emerald-400"
    },
];

const INSPIRATION_PROMPTS = {
    website: [
        "Create a modern premium E-Commerce store for high-end audio gadgets (Headphones, Smartwatches, Speakers) with category filter tabs, high-res images, star ratings, and a working shopping cart drawer with checkout modal.",
        "Create a luxury boutique coffee roastery and bakery website with an artisan menu, story section, customer reviews, online ordering cart, and contact booking modal.",
        "Create an elite modern digital design and engineering agency portfolio with interactive project showcases, pricing packages, team bios, and consultation form.",
        "Create a high-end wellness resort and spa website with room booking, treatment packages, customer testimonials, and interactive photo gallery."
    ],
    dashboard: [
        "Create a SaaS revenue and customer subscription analytics dashboard with monthly revenue line chart, customer acquisition doughnut chart, 4 KPI metric cards, and a searchable transactions data table with status badges.",
        "Create an e-commerce store admin dashboard with daily sales trends, top performing products table, stock inventory status, recent orders list, and sidebar navigation.",
        "Create a crypto and fintech investment portfolio tracker dashboard with real-time asset allocation pie chart, market trends graph, and recent buy/sell transaction history.",
        "Create a customer support helpdesk dashboard with ticket volume bar charts, agent performance metrics, resolution time counters, and priority queue data table."
    ],
    landing: [
        "Create a high-converting AI Copilot productivity SaaS landing page with glowing gradient hero, interactive product mockup, 3-step demo, monthly/yearly pricing switcher (20% off), interactive FAQ accordion, and email trial capture.",
        "Create a next-generation mobile banking & fintech app landing page with interactive feature bento grid, security compliance badges, customer reviews slider, and app store download CTAs.",
        "Create a modern developer platform & cloud infrastructure landing page with interactive code preview, latency comparison chart, enterprise pricing tiers, and developer documentation CTA.",
        "Create an eco-friendly smart home energy management landing page with energy savings calculator, hardware showcase, customer testimonials, and pre-order waitlist."
    ],
    auto: [
        "Create an e-commerce website for modern streetwear and sneakers with working cart and search filter.",
        "Build a SaaS executive metrics and analytics dashboard with interactive charts and KPI cards.",
        "Create a high-converting landing page for an AI video generation tool with pricing and interactive FAQ.",
        "Build a restaurant website for an Italian bistro with food menu, customer reviews, and reservation modal."
    ]
};

function Generate() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // ==========================================
    // STATES
    // ==========================================
    const [selectedType, setSelectedType] = useState(() => {
        const urlType = searchParams.get("type")?.toLowerCase();
        if (["website", "dashboard", "landing", "auto"].includes(urlType)) {
            return urlType;
        }
        return "auto";
    });

    const [prompt, setPrompt] = useState(() => {
        return searchParams.get("prompt") || "";
    });

    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [error, setError] = useState("");
    const [darkMode, setDarkMode] = useState(true);

    // ==========================================
    // LOAD & APPLY THEME
    // ==========================================
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        setDarkMode(savedTheme !== "light");
    }, []);

    useEffect(() => {
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    // Update state if URL search parameters change
    useEffect(() => {
        const urlType = searchParams.get("type")?.toLowerCase();
        if (urlType && ["website", "dashboard", "landing", "auto"].includes(urlType)) {
            setSelectedType(urlType);
        }
        const urlPrompt = searchParams.get("prompt");
        if (urlPrompt) {
            setPrompt(urlPrompt);
        }
    }, [searchParams]);

    // ==========================================
    // PROGRESS BAR SIMULATION
    // ==========================================
    useEffect(() => {
        if (!loading) return;

        let value = 0;
        const interval = setInterval(() => {
            const increment = value < 30 ? Math.random() * 2.5 + 1.5 : value < 75 ? Math.random() * 1.5 + 0.8 : Math.random() * 0.4 + 0.1;
            value += increment;
            if (value >= 94) value = 94;

            const phase = Math.min(Math.floor((value / 100) * PHASES.length), PHASES.length - 1);
            setProgress(Math.floor(value));
            setPhaseIndex(phase);
        }, 800);

        return () => clearInterval(interval);
    }, [loading]);

    // ==========================================
    // GENERATE HANDLER
    // ==========================================
    const handleGenerateWebsite = async () => {
        if (!prompt.trim()) {
            setError("Please describe what you want to build.");
            return;
        }

        setLoading(true);
        setProgress(5);
        setPhaseIndex(0);
        setError("");

        try {
            const result = await axios.post(
                `${serverUrl}/api/website/generate`,
                {
                    prompt: prompt.trim(),
                    pageType: selectedType,
                },
                {
                    withCredentials: true,
                    timeout: 600000,
                }
            );

            console.log("Generation Success:", result.data);
            setProgress(100);
            setPhaseIndex(PHASES.length - 1);

            setTimeout(() => {
                setLoading(false);
                if (result.data?.website?._id) {
                    navigate(`/editor/${result.data.website._id}`);
                } else {
                    setError("Generation completed, but website ID was not received.");
                }
            }, 600);
        } catch (err) {
            console.error("Generate error:", err);
            setLoading(false);
            setProgress(0);
            setError(
                err.response?.data?.message ||
                err.message ||
                "Something went wrong while generating. Please try again."
            );
        }
    };

    const currentInspirations = INSPIRATION_PROMPTS[selectedType] || INSPIRATION_PROMPTS.auto;

    return (
        <div
            className={`min-h-screen transition-colors duration-300 ${
                darkMode ? "bg-[#05070d] text-white" : "bg-slate-50 text-slate-900"
            }`}
        >
            {/* NAVBAR */}
            <header
                className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300 ${
                    darkMode ? "bg-[#05070d]/80 border-white/10" : "bg-white/80 border-slate-200"
                }`}
            >
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            className={`p-2 rounded-xl transition ${
                                darkMode ? "hover:bg-white/10 text-zinc-300" : "hover:bg-slate-200 text-slate-700"
                            }`}
                            onClick={() => navigate("/dashboard")}
                            title="Back to Dashboard"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                                <Sparkles size={16} className="text-white" />
                            </div>
                            <span className="font-bold text-lg tracking-tight">
                                GenWeb<span className="text-indigo-400">.ai</span>
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`p-2.5 rounded-xl border transition ${
                                darkMode
                                    ? "border-white/10 bg-white/5 hover:bg-white/10 text-yellow-400"
                                    : "border-slate-200 bg-white hover:bg-slate-100 text-slate-700 shadow-sm"
                            }`}
                            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                        >
                            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="max-w-5xl mx-auto px-6 py-10 md:py-14">
                {/* HEADER TITLE */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4"
                    >
                        <Zap size={13} />
                        <span>Next-Gen AI Website & App Engine</span>
                    </motion.div>

                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
                        What would you like to build?
                    </h1>
                    <p className={`max-w-2xl mx-auto text-sm md:text-base ${darkMode ? "text-zinc-400" : "text-slate-600"}`}>
                        Describe your concept in natural language. Our AI will architect a responsive, feature-rich website, dashboard, or landing page with real images and interactive functionality.
                    </p>
                </div>

                {/* TYPE SELECTOR TABS */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-zinc-400" : "text-slate-500"}`}>
                            1. Select Layout Type
                        </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {TYPE_OPTIONS.map((item) => {
                            const Icon = item.icon;
                            const isSelected = selectedType === item.id;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setSelectedType(item.id)}
                                    className={`relative p-4 rounded-2xl border text-left transition-all duration-200 ${
                                        isSelected
                                            ? `${item.border} ${darkMode ? "bg-white/[0.08]" : "bg-indigo-50/70"} shadow-md scale-[1.02]`
                                            : `${darkMode ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]" : "border-slate-200 bg-white hover:bg-slate-50"}`
                                    }`}
                                >
                                    {isSelected && (
                                        <div className="absolute top-3 right-3 text-indigo-400">
                                            <CheckCircle2 size={16} />
                                        </div>
                                    )}
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${item.color}`}>
                                        <Icon size={18} className={isSelected ? item.activeText : "text-zinc-300"} />
                                    </div>
                                    <h3 className="font-semibold text-sm mb-1">{item.label}</h3>
                                    <p className={`text-xs leading-relaxed ${darkMode ? "text-zinc-400" : "text-slate-500"}`}>
                                        {item.desc}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* PROMPT TEXTAREA */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-zinc-400" : "text-slate-500"}`}>
                            2. Describe your requirements
                        </span>
                        <span className={`text-xs ${darkMode ? "text-zinc-500" : "text-slate-400"}`}>
                            Include theme, features, pages & target audience
                        </span>
                    </div>

                    <div className="relative">
                        <textarea
                            value={prompt}
                            onChange={(e) => {
                                setPrompt(e.target.value);
                                setError("");
                            }}
                            placeholder={
                                selectedType === "dashboard"
                                    ? "e.g. Create an executive SaaS analytics dashboard with revenue charts, customer KPI cards, transactions table with search filter, and dark glass theme..."
                                    : selectedType === "landing"
                                    ? "e.g. Create a high-converting landing page for an AI productivity tool with interactive demo, monthly/yearly pricing toggle, customer testimonials, and FAQ..."
                                    : "e.g. Create a modern e-commerce website for luxury headphones and smartwatches with category filter, add-to-cart drawer, checkout modal, and contact form..."
                            }
                            disabled={loading}
                            rows={6}
                            className={`w-full p-5 rounded-2xl border outline-none text-sm md:text-base leading-relaxed transition-all resize-none ${
                                darkMode
                                    ? "bg-white/[0.04] border-white/10 text-white placeholder:text-zinc-600 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10"
                                    : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 shadow-sm"
                            }`}
                        />
                    </div>

                    {error && (
                        <div className="mt-3 p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
                            {error}
                        </div>
                    )}
                </div>

                {/* INSPIRATION PROMPTS */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={14} className="text-indigo-400" />
                        <span className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-zinc-400" : "text-slate-500"}`}>
                            Example Prompts (Click to Use)
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {currentInspirations.map((sample, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                    setPrompt(sample);
                                    setError("");
                                }}
                                className={`text-left p-3 rounded-xl border text-xs leading-relaxed transition ${
                                    darkMode
                                        ? "border-white/5 bg-white/[0.02] hover:bg-white/[0.06] text-zinc-300 hover:text-white hover:border-white/20"
                                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-300 shadow-sm"
                                }`}
                            >
                                <span className="text-indigo-400 font-semibold mr-1.5">✦</span>
                                {sample}
                            </button>
                        ))}
                    </div>
                </div>

                {/* GENERATE BUTTON */}
                <div className="flex flex-col items-center">
                    <motion.button
                        whileHover={!loading ? { scale: 1.02 } : {}}
                        whileTap={!loading ? { scale: 0.98 } : {}}
                        onClick={handleGenerateWebsite}
                        disabled={!prompt.trim() || loading}
                        className={`w-full md:w-auto min-w-[280px] px-8 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition shadow-xl ${
                            prompt.trim() && !loading
                                ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-indigo-500/25 cursor-pointer"
                                : darkMode
                                ? "bg-white/10 text-zinc-500 cursor-not-allowed border border-white/5"
                                : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        }`}
                    >
                        <Sparkles size={18} />
                        {loading ? "Architecting your website…" : "Generate with AI (50 Credits)"}
                    </motion.button>
                </div>

                {/* PROGRESS MODAL / OVERLAY */}
                <AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`mt-10 p-6 rounded-3xl border ${
                                darkMode ? "bg-white/[0.04] border-white/10" : "bg-white border-slate-200 shadow-xl"
                            }`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                    <span className="font-semibold text-sm">
                                        {PHASES[phaseIndex]}
                                    </span>
                                </div>
                                <span className="text-sm font-bold text-indigo-400">
                                    {progress}%
                                </span>
                            </div>

                            <div className={`h-2.5 w-full rounded-full overflow-hidden ${darkMode ? "bg-white/10" : "bg-slate-200"}`}>
                                <motion.div
                                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                                    animate={{ width: `${progress}%` }}
                                    transition={{ ease: "easeOut", duration: 0.6 }}
                                />
                            </div>

                            <p className={`text-xs text-center mt-4 ${darkMode ? "text-zinc-500" : "text-slate-400"}`}>
                                Synthesizing layout, CSS styling, high-res Unsplash imagery, and interactive scripts. Please keep this tab open.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

export default Generate;