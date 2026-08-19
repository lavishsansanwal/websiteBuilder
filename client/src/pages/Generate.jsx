import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
    ArrowLeft,
    ChevronDown,
    Upload,
    FileJson,
    Sun,
    Moon,
    X
} from "lucide-react";
import axios from "axios";
import {
    useNavigate,
    useSearchParams
} from "react-router-dom";
import { serverUrl } from "../App";


const PHASES = [
    "Analyzing your idea…",
    "Designing layout & structure…",
    "Writing HTML & CSS…",
    "Adding animations & interactions…",
    "Final quality checks…"
];


function Generate() {

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const pageType =
        searchParams.get("type") || "website";


    // ==========================================
    // STATES
    // ==========================================

    const [prompt, setPrompt] = useState("");

    const [loading, setLoading] = useState(false);

    const [progress, setProgress] = useState(0);

    const [phaseIndex, setPhaseIndex] = useState(0);

    const [error, setError] = useState("");

    const [showDashboardMenu, setShowDashboardMenu] =
        useState(false);

    const [showPasteJson, setShowPasteJson] =
        useState(false);

    const [jsonData, setJsonData] = useState("");

    const [darkMode, setDarkMode] = useState(true);


    // ==========================================
    // LOAD SAVED THEME
    // ==========================================

    useEffect(() => {

        const savedTheme =
            localStorage.getItem("theme");

        if (savedTheme === "light") {
            setDarkMode(false);
        } else {
            setDarkMode(true);
        }

    }, []);


    // ==========================================
    // APPLY THEME
    // ==========================================

    useEffect(() => {

        localStorage.setItem(
            "theme",
            darkMode ? "dark" : "light"
        );

        document.documentElement.style.setProperty(
            "--bg-color",
            darkMode
                ? "#040404"
                : "#f8fafc"
        );

        document.documentElement.style.setProperty(
            "--text-color",
            darkMode
                ? "#ffffff"
                : "#111827"
        );

        document.documentElement.style.setProperty(
            "--nav-bg",
            darkMode
                ? "rgba(0,0,0,0.55)"
                : "rgba(255,255,255,0.80)"
        );

        document.documentElement.style.setProperty(
            "--border-color",
            darkMode
                ? "rgba(255,255,255,0.10)"
                : "rgba(0,0,0,0.10)"
        );

        document.documentElement.style.setProperty(
            "--card-bg",
            darkMode
                ? "rgba(255,255,255,0.05)"
                : "rgba(255,255,255,0.90)"
        );

        document.documentElement.style.setProperty(
            "--muted-color",
            darkMode
                ? "#a1a1aa"
                : "#6b7280"
        );

    }, [darkMode]);


    // ==========================================
    // GENERATE WEBSITE
    // ==========================================

    const handleGenerateWebsite = async () => {

        if (!prompt.trim()) {
            setError(
                pageType === "landing"
                    ? "Please describe your landing page."
                    : pageType === "dashboard"
                        ? "Please describe your dashboard."
                        : "Please describe your website."
            );

            return;
        }


        setLoading(true);

        setProgress(0);

        setPhaseIndex(0);

        setError("");


        try {

            const finalPrompt =
                jsonData.trim()
                    ? `${prompt}

USER PROVIDED JSON DATA:

${jsonData}

IMPORTANT:
Use the provided JSON data as the actual source of truth.
Do not invent replacement records.
Display all provided records appropriately.`
                    : prompt;


            const result = await axios.post(
                `${serverUrl}/api/website/generate`,
                {
                    prompt: finalPrompt,
                    pageType
                },
                {
                    withCredentials: true,
                    timeout: 600000
                }
            );


            console.log(
                "Website generated:",
                result.data
            );


            setProgress(100);

            setPhaseIndex(
                PHASES.length - 1
            );


            setTimeout(() => {

                setLoading(false);

                navigate(
                    `/editor/${result.data.website._id}`
                );

            }, 500);


        } catch (error) {

            console.log(
                "Generate website error:",
                error
            );

            setLoading(false);

            setProgress(0);

            setError(
                error.response?.data?.message ||
                "Something went wrong while generating the website."
            );

        }

    };


    // ==========================================
    // PROGRESS BAR
    // ==========================================

    useEffect(() => {

        if (!loading) {

            setPhaseIndex(0);

            setProgress(0);

            return;

        }


        let value = 0;


        const interval = setInterval(() => {

            const increment =
                value < 20
                    ? Math.random() * 1.5
                    : value < 60
                        ? Math.random() * 1.2
                        : Math.random() * 0.6;


            value += increment;


            // Never go above 93%
            // until backend actually finishes

            if (value >= 93) {
                value = 93;
            }


            const phase = Math.min(
                Math.floor(
                    (value / 100) *
                    PHASES.length
                ),
                PHASES.length - 1
            );


            setProgress(
                Math.floor(value)
            );

            setPhaseIndex(
                phase
            );


        }, 1200);


        return () =>
            clearInterval(interval);


    }, [loading]);


    // ==========================================
    // PAGE TITLE
    // ==========================================

    const getPageTitle = () => {

        if (pageType === "landing") {
            return "Landing Pages";
        }

        if (pageType === "dashboard") {
            return "Dashboards";
        }

        return "Websites";
    };


    // ==========================================
    // DESCRIPTION TITLE
    // ==========================================

    const getDescriptionTitle = () => {

        if (pageType === "landing") {
            return "Describe your landing page";
        }

        if (pageType === "dashboard") {
            return "Describe your dashboard";
        }

        return "Describe your website";
    };


    // ==========================================
    // PLACEHOLDER
    // ==========================================

    const getPlaceholder = () => {

        if (pageType === "landing") {

            return "Describe your landing page in detail...";

        }

        if (pageType === "dashboard") {

            return "Describe your dashboard, metrics, charts, users, statistics, tables, etc...";

        }

        return "Describe your website in detail...";

    };


    // ==========================================
    // PASTE JSON
    // ==========================================

    const handlePasteJson = () => {

        setShowPasteJson(true);

        setShowDashboardMenu(false);

    };


    // ==========================================
    // USE JSON DATA
    // ==========================================

    const handleUseJson = () => {

        if (!jsonData.trim()) {
            return;
        }


        try {

            JSON.parse(jsonData);

            setShowPasteJson(false);

            setError("");

        } catch (error) {

            setError(
                "Invalid JSON. Please check your JSON format."
            );

        }

    };


    // ==========================================
    // UPLOAD FILE
    // ==========================================

    const handleUploadClick = () => {

        setShowDashboardMenu(false);

        navigate("/upload");

    };


    return (

        <div
            className={`min-h-screen transition-colors duration-300 ${
                darkMode
                    ? "bg-[#040404] text-white"
                    : "bg-slate-50 text-slate-900"
            }`}
        >


            {/* ==========================================
                NAVBAR
            ========================================== */}

            <div
                className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300 ${
                    darkMode
                        ? "bg-black/50 border-white/10"
                        : "bg-white/80 border-slate-200"
                }`}
            >

                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">


                    {/* LEFT */}

                    <div className="flex items-center gap-4">

                        <button
                            className={`p-2 rounded-lg transition ${
                                darkMode
                                    ? "hover:bg-white/10"
                                    : "hover:bg-black/5"
                            }`}
                            onClick={() =>
                                navigate("/")
                            }
                        >

                            <ArrowLeft size={17} />

                        </button>


                        <h1 className="text-lg font-semibold">

                            GenWeb
                            <span
                                className={
                                    darkMode
                                        ? "text-zinc-400"
                                        : "text-slate-500"
                                }
                            >
                                .ai
                            </span>

                        </h1>

                    </div>


                    {/* RIGHT */}

                    <button
                        onClick={() =>
                            setDarkMode(
                                !darkMode
                            )
                        }
                        className={`p-2.5 rounded-xl border transition ${
                            darkMode
                                ? "border-white/10 bg-white/5 hover:bg-white/10"
                                : "border-slate-200 bg-white hover:bg-slate-100"
                        }`}
                        title={
                            darkMode
                                ? "Switch to light mode"
                                : "Switch to dark mode"
                        }
                    >

                        {darkMode ? (
                            <Sun
                                size={18}
                                className="text-yellow-400"
                            />
                        ) : (
                            <Moon
                                size={18}
                                className="text-slate-700"
                            />
                        )}

                    </button>

                </div>

            </div>


            {/* ==========================================
                MAIN
            ========================================== */}

            <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">


                {/* ==========================================
                    NAVIGATION BUTTONS
                ========================================== */}

                <div className="flex flex-wrap justify-center gap-3 mb-12">


                    {/* LANDING PAGE */}

                    <button
                        onClick={() =>
                            navigate(
                                "/generate?type=landing"
                            )
                        }
                        className={`px-5 py-3 rounded-xl font-semibold text-sm border transition ${
                            pageType === "landing"
                                ? darkMode
                                    ? "bg-white text-black border-white"
                                    : "bg-slate-900 text-white border-slate-900"
                                : darkMode
                                    ? "bg-white/10 text-white border-white/10 hover:bg-white/20"
                                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                    >

                        Landing Page

                    </button>


                    {/* DASHBOARD */}

                    <div className="relative">

                        <button
                            onClick={() =>
                                setShowDashboardMenu(
                                    !showDashboardMenu
                                )
                            }
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border transition ${
                                pageType === "dashboard"
                                    ? darkMode
                                        ? "bg-white text-black border-white"
                                        : "bg-slate-900 text-white border-slate-900"
                                    : darkMode
                                        ? "bg-white/10 text-white border-white/10 hover:bg-white/20"
                                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                        >

                            Dashboard

                            <ChevronDown
                                size={16}
                            />

                        </button>


                        {/* DASHBOARD MENU */}

                        {showDashboardMenu && (

                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: -5,
                                    scale: 0.98
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1
                                }}
                                className={`absolute top-full left-0 mt-2 w-64 rounded-2xl border shadow-2xl overflow-hidden z-50 ${
                                    darkMode
                                        ? "bg-[#111111] border-white/10"
                                        : "bg-white border-slate-200"
                                }`}
                            >


                                {/* DESCRIBE DASHBOARD */}

                                <button
                                    onClick={() => {

                                        setShowDashboardMenu(
                                            false
                                        );

                                        navigate(
                                            "/generate?type=dashboard"
                                        );

                                    }}
                                    className={`w-full text-left px-5 py-4 text-sm transition ${
                                        darkMode
                                            ? "text-white hover:bg-white/10"
                                            : "text-slate-800 hover:bg-slate-100"
                                    }`}
                                >

                                    <div className="font-semibold">
                                        Describe Dashboard
                                    </div>

                                    <div
                                        className={`text-xs mt-1 ${
                                            darkMode
                                                ? "text-zinc-500"
                                                : "text-slate-500"
                                        }`}
                                    >
                                        Generate an AI dashboard
                                    </div>

                                </button>


                                {/* UPLOAD */}

                                <button
                                    onClick={
                                        handleUploadClick
                                    }
                                    className={`w-full text-left px-5 py-4 text-sm border-t transition ${
                                        darkMode
                                            ? "text-white border-white/10 hover:bg-white/10"
                                            : "text-slate-800 border-slate-100 hover:bg-slate-100"
                                    }`}
                                >

                                    <div className="flex items-center gap-3">

                                        <Upload
                                            size={17}
                                        />

                                        <div>

                                            <div className="font-semibold">
                                                Upload Data / Files
                                            </div>

                                            <div
                                                className={`text-xs mt-1 ${
                                                    darkMode
                                                        ? "text-zinc-500"
                                                        : "text-slate-500"
                                                }`}
                                            >
                                                CSV, JSON and data files
                                            </div>

                                        </div>

                                    </div>

                                </button>


                                {/* PASTE JSON */}

                                <button
                                    onClick={
                                        handlePasteJson
                                    }
                                    className={`w-full text-left px-5 py-4 text-sm border-t transition ${
                                        darkMode
                                            ? "text-white border-white/10 hover:bg-white/10"
                                            : "text-slate-800 border-slate-100 hover:bg-slate-100"
                                    }`}
                                >

                                    <div className="flex items-center gap-3">

                                        <FileJson
                                            size={17}
                                        />

                                        <div>

                                            <div className="font-semibold">
                                                Paste JSON Data
                                            </div>

                                            <div
                                                className={`text-xs mt-1 ${
                                                    darkMode
                                                        ? "text-zinc-500"
                                                        : "text-slate-500"
                                                }`}
                                            >
                                                Add JSON directly
                                            </div>

                                        </div>

                                    </div>

                                </button>

                            </motion.div>

                        )}

                    </div>


                    {/* WEBSITE */}

                    <button
                        onClick={() =>
                            navigate(
                                "/generate?type=website"
                            )
                        }
                        className={`px-5 py-3 rounded-xl font-semibold text-sm border transition ${
                            pageType === "website"
                                ? darkMode
                                    ? "bg-white text-black border-white"
                                    : "bg-slate-900 text-white border-slate-900"
                                : darkMode
                                    ? "bg-white/10 text-white border-white/10 hover:bg-white/20"
                                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                    >

                        Website

                    </button>

                </div>


                {/* ==========================================
                    HERO
                ========================================== */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 30
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    className="text-center mb-14"
                >

                    <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">

                        Build{" "}

                        {getPageTitle()}

                        <span
                            className={`block bg-clip-text text-transparent ${
                                darkMode
                                    ? "bg-gradient-to-r from-white to-zinc-400"
                                    : "bg-gradient-to-r from-slate-900 to-slate-500"
                            }`}
                        >

                            with Real AI Power

                        </span>

                    </h1>


                    <p
                        className={`max-w-2xl mx-auto ${
                            darkMode
                                ? "text-zinc-400"
                                : "text-slate-500"
                        }`}
                    >

                        Describe what you want to build and
                        let GenWeb.ai create a modern,
                        responsive website for you.

                    </p>

                </motion.div>


                {/* ==========================================
                    PROMPT AREA
                ========================================== */}

                <div className="mb-10">


                    <h2 className="text-xl font-semibold mb-3">

                        {getDescriptionTitle()}

                    </h2>


                    <div className="relative">


                        <textarea
                            value={prompt}
                            onChange={(e) =>
                                setPrompt(
                                    e.target.value
                                )
                            }
                            placeholder={
                                getPlaceholder()
                            }
                            disabled={loading}
                            className={`w-full h-56 p-6 rounded-3xl border outline-none resize-none text-sm leading-relaxed transition ${
                                darkMode
                                    ? "bg-black/60 border-white/10 text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-white/20"
                                    : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-300"
                            }`}
                        />


                        {/* JSON INDICATOR */}

                        {jsonData && (

                            <div className={`absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${
                                darkMode
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                            }`}>

                                <FileJson
                                    size={14}
                                />

                                JSON data attached

                                <button
                                    onClick={() =>
                                        setJsonData("")
                                    }
                                    className="hover:opacity-70"
                                >

                                    <X
                                        size={13}
                                    />

                                </button>

                            </div>

                        )}

                    </div>


                    {/* ERROR */}

                    {error && (

                        <p className="mt-4 text-sm text-red-400">
                            {error}
                        </p>

                    )}

                </div>


                {/* ==========================================
                    GENERATE BUTTON
                ========================================== */}

                <div className="flex justify-center">

                    <motion.button
                        whileHover={
                            !loading
                                ? {
                                    scale: 1.05
                                }
                                : {}
                        }
                        whileTap={
                            !loading
                                ? {
                                    scale: 0.96
                                }
                                : {}
                        }
                        onClick={
                            handleGenerateWebsite
                        }
                        disabled={
                            !prompt.trim() ||
                            loading
                        }
                        className={`px-12 md:px-14 py-4 rounded-2xl font-semibold text-lg transition ${
                            prompt.trim() &&
                            !loading
                                ? darkMode
                                    ? "bg-white text-black hover:bg-zinc-200"
                                    : "bg-slate-900 text-white hover:bg-slate-800"
                                : darkMode
                                    ? "bg-white/20 text-zinc-500 cursor-not-allowed"
                                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        }`}
                    >

                        {loading
                            ? "Generating..."
                            : pageType === "landing"
                                ? "Generate Landing Page"
                                : pageType === "dashboard"
                                    ? "Generate Dashboard"
                                    : "Generate Website"}

                    </motion.button>

                </div>


                {/* ==========================================
                    PROGRESS BAR
                ========================================== */}

                {loading && (

                    <motion.div
                        initial={{
                            opacity: 0
                        }}
                        animate={{
                            opacity: 1
                        }}
                        className="max-w-xl mx-auto mt-12"
                    >


                        <div className="flex justify-between mb-2 text-xs">

                            <span
                                className={
                                    darkMode
                                        ? "text-zinc-400"
                                        : "text-slate-500"
                                }
                            >

                                {PHASES[phaseIndex]}

                            </span>

                            <span
                                className={
                                    darkMode
                                        ? "text-zinc-400"
                                        : "text-slate-500"
                                }
                            >

                                {progress}%

                            </span>

                        </div>


                        <div
                            className={`h-2 w-full rounded-full overflow-hidden ${
                                darkMode
                                    ? "bg-white/10"
                                    : "bg-slate-200"
                            }`}
                        >

                            <motion.div
                                className={
                                    darkMode
                                        ? "h-full bg-gradient-to-r from-white to-zinc-300"
                                        : "h-full bg-gradient-to-r from-slate-700 to-slate-400"
                                }
                                animate={{
                                    width: `${progress}%`
                                }}
                                transition={{
                                    ease: "easeOut",
                                    duration: 0.8
                                }}
                            />

                        </div>


                        <div
                            className={`text-center text-xs mt-4 ${
                                darkMode
                                    ? "text-zinc-400"
                                    : "text-slate-500"
                            }`}
                        >

                            Estimated time remaining:{" "}

                            <span
                                className={
                                    darkMode
                                        ? "text-white font-medium"
                                        : "text-slate-900 font-medium"
                                }
                            >

                                ~8–12 minutes

                            </span>

                        </div>

                    </motion.div>

                )}

            </div>


            {/* ==========================================
                PASTE JSON MODAL
            ========================================== */}

            {showPasteJson && (

                <div className="fixed inset-0 z-[100] flex items-center justify-center px-5 bg-black/60 backdrop-blur-sm">


                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.95,
                            y: 20
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0
                        }}
                        className={`w-full max-w-2xl rounded-3xl border shadow-2xl p-6 ${
                            darkMode
                                ? "bg-[#111111] border-white/10"
                                : "bg-white border-slate-200"
                        }`}
                    >


                        <div className="flex items-center justify-between mb-5">

                            <div>

                                <div className="flex items-center gap-2">

                                    <FileJson
                                        size={20}
                                        className="text-indigo-400"
                                    />

                                    <h2 className="text-xl font-semibold">

                                        Paste JSON Data

                                    </h2>

                                </div>

                                <p
                                    className={`text-sm mt-1 ${
                                        darkMode
                                            ? "text-zinc-500"
                                            : "text-slate-500"
                                    }`}
                                >

                                    Add your JSON data to use it
                                    while generating the website.

                                </p>

                            </div>


                            <button
                                onClick={() =>
                                    setShowPasteJson(
                                        false
                                    )
                                }
                                className={`p-2 rounded-lg ${
                                    darkMode
                                        ? "hover:bg-white/10"
                                        : "hover:bg-slate-100"
                                }`}
                            >

                                <X size={18} />

                            </button>

                        </div>


                        <textarea
                            value={jsonData}
                            onChange={(e) =>
                                setJsonData(
                                    e.target.value
                                )
                            }
                            placeholder={`[
  {
    "name": "Product One",
    "price": 99,
    "category": "Technology"
  },
  {
    "name": "Product Two",
    "price": 149,
    "category": "Technology"
  }
]`}
                            className={`w-full h-72 p-5 rounded-2xl border outline-none resize-none font-mono text-sm ${
                                darkMode
                                    ? "bg-black/50 border-white/10 text-white placeholder:text-zinc-700"
                                    : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400"
                            }`}
                        />


                        <div className="flex justify-end gap-3 mt-5">

                            <button
                                onClick={() =>
                                    setShowPasteJson(
                                        false
                                    )
                                }
                                className={`px-5 py-2.5 rounded-xl text-sm font-medium ${
                                    darkMode
                                        ? "bg-white/10 hover:bg-white/20"
                                        : "bg-slate-100 hover:bg-slate-200"
                                }`}
                            >

                                Cancel

                            </button>


                            <button
                                onClick={
                                    handleUseJson
                                }
                                disabled={
                                    !jsonData.trim()
                                }
                                className={`px-5 py-2.5 rounded-xl text-sm font-semibold ${
                                    jsonData.trim()
                                        ? darkMode
                                            ? "bg-white text-black"
                                            : "bg-slate-900 text-white"
                                        : "bg-slate-300 text-slate-500 cursor-not-allowed"
                                }`}
                            >

                                Use JSON Data

                            </button>

                        </div>

                    </motion.div>

                </div>

            )}

        </div>

    );

}


export default Generate;