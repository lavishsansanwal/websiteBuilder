import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
    BarChart3,
    Check,
    ChevronDown,
    Coins,
    Globe,
    LayoutDashboard,
    LogOut,
    Moon,
    Plus,
    Settings,
    Sparkles,
    Sun,
    TrendingUp,
    WandSparkles,
} from "lucide-react";

import LoginModal from "../components/LoginModal";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import axios from "axios";
import { setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Home() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userData } = useSelector((state) => state.user);

    const [openLogin, setOpenLogin] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);
    const [websites, setWebsites] = useState([]);
    const [theme, setTheme] = useState(
        localStorage.getItem("genweb-theme") || "dark"
    );

    const isDark = theme === "dark";

    /* =========================================================
       THEME
    ========================================================= */

    useEffect(() => {
        localStorage.setItem("genweb-theme", theme);
        document.documentElement.classList.toggle("dark", isDark);
    }, [theme, isDark]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    /* =========================================================
       GET WEBSITES
    ========================================================= */

    useEffect(() => {
        if (!userData) {
            setWebsites([]);
            return;
        }

        const handleGetAllWebsites = async () => {
            try {
                const result = await axios.get(
                    `${serverUrl}/api/website/get-all`,
                    {
                        withCredentials: true,
                    }
                );

                setWebsites(result.data || []);
            } catch (error) {
                console.log("Get websites error:", error);
            }
        };

        handleGetAllWebsites();
    }, [userData]);

    /* =========================================================
       LOGOUT
    ========================================================= */

    const handleLogOut = async () => {
        try {
            await signOut(auth);

            await axios.get(`${serverUrl}/api/auth/logout`, {
                withCredentials: true,
            });

            dispatch(setUserData(null));
            setOpenProfile(false);
            setWebsites([]);
        } catch (error) {
            console.log("Logout error:", error);
        }
    };

    /* =========================================================
       LIVE STATISTICS
    ========================================================= */

    const totalWebsites = websites.length;

    const publishedWebsites = websites.filter(
        (website) => website.deployed
    ).length;

    const draftWebsites = totalWebsites - publishedWebsites;

    const publishPercentage =
        totalWebsites > 0
            ? Math.round((publishedWebsites / totalWebsites) * 100)
            : 0;

    const draftPercentage =
        totalWebsites > 0
            ? Math.round((draftWebsites / totalWebsites) * 100)
            : 0;

    /* =========================================================
       LIVE MONTHLY GRAPH DATA
       
       Uses actual website updatedAt values.
    ========================================================= */

    const graphData = useMemo(() => {
        const now = new Date();

        const months = [];

        for (let i = 7; i >= 0; i--) {
            const date = new Date(
                now.getFullYear(),
                now.getMonth() - i,
                1
            );

            months.push({
                month: date.toLocaleString("default", {
                    month: "short",
                }),
                year: date.getFullYear(),
                count: 0,
            });
        }

        websites.forEach((website) => {
            if (!website.updatedAt) return;

            const updated = new Date(website.updatedAt);

            const matchingMonth = months.find(
                (item) =>
                    item.month ===
                        updated.toLocaleString("default", {
                            month: "short",
                        }) &&
                    item.year === updated.getFullYear()
            );

            if (matchingMonth) {
                matchingMonth.count += 1;
            }
        });

        /*
         * Convert cumulative website creation/update activity
         * into a useful project activity graph.
         */
        let runningTotal = 0;

        return months.map((item) => {
            runningTotal += item.count;

            return {
                ...item,
                value: runningTotal,
            };
        });
    }, [websites]);

    /* =========================================================
       LINE GRAPH
    ========================================================= */

    const graphPoints = useMemo(() => {
        if (!graphData.length) return "";

        const width = 560;
        const height = 190;
        const padding = 20;

        const maxValue = Math.max(
            ...graphData.map((item) => item.value),
            1
        );

        return graphData
            .map((item, index) => {
                const x =
                    padding +
                    (index *
                        (width - padding * 2)) /
                        Math.max(graphData.length - 1, 1);

                const y =
                    height -
                    padding -
                    (item.value / maxValue) *
                        (height - padding * 2);

                return `${x},${y}`;
            })
            .join(" ");
    }, [graphData]);

    /* =========================================================
       DONUT GRAPH
    ========================================================= */

    const publishedDash =
        totalWebsites > 0 ? (publishedWebsites / totalWebsites) * 360 : 0;

    const draftDash =
        totalWebsites > 0 ? (draftWebsites / totalWebsites) * 360 : 0;

    /* =========================================================
       COLORS
    ========================================================= */

    const pageBg = isDark
        ? "bg-[#050507] text-white"
        : "bg-slate-50 text-slate-900";

    const navBg = isDark
        ? "bg-black/60 border-white/10"
        : "bg-white/80 border-slate-200";

    const cardBg = isDark
        ? "bg-white/[0.035] border-white/10"
        : "bg-white border-slate-200";

    const mutedText = isDark
        ? "text-zinc-400"
        : "text-slate-500";

    const headingText = isDark
        ? "text-white"
        : "text-slate-900";

    return (
        <div
            className={`min-h-screen overflow-hidden transition-colors duration-300 ${pageBg}`}
        >
            {/* =====================================================
                BACKGROUND GLOW
            ===================================================== */}

            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div
                    className={`absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px] ${
                        isDark
                            ? "bg-purple-700/20"
                            : "bg-purple-300/30"
                    }`}
                />

                <div
                    className={`absolute top-80 right-0 w-[450px] h-[450px] rounded-full blur-[140px] ${
                        isDark
                            ? "bg-blue-700/10"
                            : "bg-blue-200/30"
                    }`}
                />
            </div>

            {/* =====================================================
                NAVBAR
            ===================================================== */}

            <motion.nav
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`relative z-50 max-w-7xl mx-auto mt-4 mx-4 md:mx-auto rounded-2xl border backdrop-blur-xl transition-colors duration-300 ${navBg}`}
            >
                <div className="px-5 md:px-7 py-4 flex items-center justify-between">
                    {/* LOGO */}

                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <Sparkles
                                size={18}
                                className="text-white"
                            />
                        </div>

                        <span
                            className={`text-lg font-bold ${headingText}`}
                        >
                            GenWeb.ai
                        </span>
                    </div>

                    {/* NAV LINKS */}

                    <div className="hidden md:flex items-center gap-8 text-sm">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className={`${mutedText} hover:text-purple-400 transition`}
                        >
                            Dashboard
                        </button>

                        <button
                            onClick={() => navigate("/pricing")}
                            className={`${mutedText} hover:text-purple-400 transition`}
                        >
                            Pricing
                        </button>
                    </div>

                    {/* RIGHT */}

                    <div className="flex items-center gap-3">
                        {/* THEME */}

                        <button
                            onClick={toggleTheme}
                            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition ${
                                isDark
                                    ? "bg-white/5 border-white/10 hover:bg-white/10"
                                    : "bg-slate-100 border-slate-200 hover:bg-slate-200"
                            }`}
                            title="Toggle theme"
                        >
                            {isDark ? (
                                <Sun size={17} />
                            ) : (
                                <Moon size={17} />
                            )}
                        </button>

                        {/* CREDITS */}

                        {userData && (
                            <button
                                onClick={() => navigate("/pricing")}
                                className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border ${
                                    isDark
                                        ? "bg-white/5 border-white/10"
                                        : "bg-slate-100 border-slate-200"
                                }`}
                            >
                                <Coins
                                    size={15}
                                    className="text-yellow-400"
                                />

                                <span className={mutedText}>
                                    Credits
                                </span>

                                <span className="font-semibold">
                                    {userData.credits}
                                </span>

                                <Plus size={14} />
                            </button>
                        )}

                        {/* PROFILE */}

                        {!userData ? (
                            <button
                                onClick={() => setOpenLogin(true)}
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold hover:scale-105 transition"
                            >
                                Get Started
                            </button>
                        ) : (
                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setOpenProfile(
                                            !openProfile
                                        )
                                    }
                                    className="flex items-center gap-2"
                                >
                                    <img
                                        src={
                                            userData?.avatar ||
                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                userData.name || "User"
                                            )}&background=7c3aed&color=fff`
                                        }
                                        alt=""
                                        referrerPolicy="no-referrer"
                                        className="w-10 h-10 rounded-xl object-cover border border-white/20"
                                    />

                                    <ChevronDown
                                        size={14}
                                        className={mutedText}
                                    />
                                </button>

                                <AnimatePresence>
                                    {openProfile && (
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                y: -8,
                                                scale: 0.97,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                scale: 1,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                y: -8,
                                                scale: 0.97,
                                            }}
                                            className={`absolute right-0 mt-3 w-64 rounded-2xl border shadow-2xl overflow-hidden ${
                                                isDark
                                                    ? "bg-[#111116] border-white/10"
                                                    : "bg-white border-slate-200"
                                            }`}
                                        >
                                            <div className="p-4 border-b border-white/10">
                                                <p className="font-semibold truncate">
                                                    {userData.name}
                                                </p>

                                                <p
                                                    className={`text-xs mt-1 truncate ${mutedText}`}
                                                >
                                                    {userData.email}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        "/dashboard"
                                                    )
                                                }
                                                className="w-full px-4 py-3 flex items-center gap-3 text-sm hover:bg-purple-500/10 transition"
                                            >
                                                <LayoutDashboard
                                                    size={16}
                                                />
                                                Dashboard
                                            </button>

                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        "/pricing"
                                                    )
                                                }
                                                className="w-full px-4 py-3 flex items-center gap-3 text-sm hover:bg-purple-500/10 transition"
                                            >
                                                <Coins
                                                    size={16}
                                                    className="text-yellow-400"
                                                />
                                                Credits:{" "}
                                                {userData.credits}
                                            </button>

                                            <button
                                                onClick={toggleTheme}
                                                className="w-full px-4 py-3 flex items-center gap-3 text-sm hover:bg-purple-500/10 transition"
                                            >
                                                {isDark ? (
                                                    <Sun size={16} />
                                                ) : (
                                                    <Moon size={16} />
                                                )}
                                                Toggle Theme
                                            </button>

                                            <button
                                                onClick={handleLogOut}
                                                className="w-full px-4 py-3 flex items-center gap-3 text-sm text-red-400 hover:bg-red-500/10 transition border-t border-white/10"
                                            >
                                                <LogOut
                                                    size={16}
                                                />
                                                Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </motion.nav>

            {/* =====================================================
                HERO
            ===================================================== */}

            <main className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 pt-20 pb-20">
                <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
                    {/* LEFT */}

                    <motion.section
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm ${
                                isDark
                                    ? "bg-purple-500/10 border-purple-500/20 text-purple-300"
                                    : "bg-purple-50 border-purple-200 text-purple-600"
                            }`}
                        >
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

                            AI Website Generation Platform
                        </div>

                        <h1
                            className={`mt-7 text-5xl md:text-7xl font-black tracking-tight leading-[0.95] ${headingText}`}
                        >
                            Build websites with
                            <br />

                            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                                Real AI Power
                            </span>
                        </h1>

                        <p
                            className={`mt-7 text-lg md:text-xl max-w-2xl leading-relaxed ${mutedText}`}
                        >
                            Describe your idea and let GenWeb.ai
                            transform it into a modern, responsive
                            and production-ready website.
                        </p>

                        {/* BUTTONS */}

                        <div className="flex flex-wrap gap-4 mt-9">
                            <button
                                onClick={() =>
                                    userData
                                        ? navigate("/generate")
                                        : setOpenLogin(true)
                                }
                                className="group flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 text-white font-semibold shadow-xl shadow-purple-500/20 hover:scale-[1.03] transition"
                            >
                                <WandSparkles size={19} />

                                Generate Website

                                <span className="group-hover:translate-x-1 transition">
                                    →
                                </span>
                            </button>

                            <button
                                onClick={() =>
                                    userData
                                        ? navigate("/dashboard")
                                        : setOpenLogin(true)
                                }
                                className={`flex items-center gap-3 px-6 py-4 rounded-xl border font-semibold transition hover:-translate-y-0.5 ${
                                    isDark
                                        ? "bg-white/5 border-white/10 hover:bg-white/10"
                                        : "bg-white border-slate-200 hover:bg-slate-100"
                                }`}
                            >
                                <LayoutDashboard size={18} />

                                Dashboard
                            </button>
                        </div>

                        {/* FEATURES */}

                        <div className="flex flex-wrap gap-6 mt-8">
                            {[
                                "AI Generated Code",
                                "Responsive",
                                "Production Ready",
                            ].map((item) => (
                                <div
                                    key={item}
                                    className={`flex items-center gap-2 text-sm ${mutedText}`}
                                >
                                    <Check
                                        size={16}
                                        className="text-emerald-400"
                                    />

                                    {item}
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* =================================================
                        ACTIVITY GRAPH
                    ================================================= */}

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className={`rounded-3xl border p-6 shadow-2xl ${
                            isDark
                                ? "bg-[#0d0d14]/90 border-white/10"
                                : "bg-white border-slate-200"
                        }`}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p
                                    className={`text-sm ${mutedText}`}
                                >
                                    Website activity
                                </p>

                                <h2
                                    className={`text-2xl font-bold mt-1 ${headingText}`}
                                >
                                    AI Projects
                                </h2>
                            </div>

                            <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
                                <BarChart3
                                    size={19}
                                    className="text-purple-400"
                                />
                            </div>
                        </div>

                        <div className="mt-8">
                            <svg
                                viewBox="0 0 600 220"
                                className="w-full h-auto"
                            >
                                {/* GRID */}

                                {[40, 80, 120, 160].map(
                                    (y) => (
                                        <line
                                            key={y}
                                            x1="20"
                                            x2="580"
                                            y1={y}
                                            y2={y}
                                            stroke={
                                                isDark
                                                    ? "rgba(255,255,255,0.08)"
                                                    : "rgba(15,23,42,0.08)"
                                            }
                                            strokeDasharray="5 7"
                                        />
                                    )
                                )}

                                {/* AREA */}

                                {graphPoints && (
                                    <>
                                        <polyline
                                            points={`20,200 ${graphPoints} 580,200`}
                                            fill={
                                                isDark
                                                    ? "rgba(34,197,94,0.08)"
                                                    : "rgba(34,197,94,0.10)"
                                            }
                                            stroke="none"
                                        />

                                        {/* GREEN LINE */}

                                        <polyline
                                            points={graphPoints}
                                            fill="none"
                                            stroke="#22c55e"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />

                                        {/* POINTS */}

                                        {graphData.map(
                                            (
                                                item,
                                                index
                                            ) => {
                                                const width = 560;
                                                const height = 190;
                                                const padding = 20;

                                                const maxValue =
                                                    Math.max(
                                                        ...graphData.map(
                                                            (
                                                                d
                                                            ) =>
                                                                d.value
                                                        ),
                                                        1
                                                    );

                                                const x =
                                                    padding +
                                                    (index *
                                                        (width -
                                                            padding *
                                                                2)) /
                                                        Math.max(
                                                            graphData.length -
                                                                1,
                                                            1
                                                        );

                                                const y =
                                                    height -
                                                    padding -
                                                    (item.value /
                                                        maxValue) *
                                                        (height -
                                                            padding *
                                                                2);

                                                return (
                                                    <circle
                                                        key={
                                                            index
                                                        }
                                                        cx={
                                                            x
                                                        }
                                                        cy={
                                                            y
                                                        }
                                                        r="5"
                                                        fill="#22c55e"
                                                        stroke={
                                                            isDark
                                                                ? "#0d0d14"
                                                                : "#ffffff"
                                                        }
                                                        strokeWidth="3"
                                                    />
                                                );
                                            }
                                        )}
                                    </>
                                )}
                            </svg>

                            <div className="flex justify-between mt-1">
                                {graphData.map(
                                    (item) => (
                                        <span
                                            key={`${item.month}-${item.year}`}
                                            className={`text-xs ${mutedText}`}
                                        >
                                            {item.month}
                                        </span>
                                    )
                                )}
                            </div>
                        </div>

                        <div className="mt-5 flex items-end justify-between">
                            <div>
                                <p
                                    className={`text-3xl font-bold ${headingText}`}
                                >
                                    {totalWebsites}
                                </p>

                                <p
                                    className={`text-sm ${mutedText}`}
                                >
                                    Total Websites
                                </p>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-emerald-400">
                                <TrendingUp size={16} />

                                Live project data
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* =====================================================
                    ANALYTICS CARDS
                ===================================================== */}

                <section className="grid lg:grid-cols-3 gap-5 mt-10">
                    {/* TOP PROJECTS */}

                    <div
                        className={`rounded-3xl border p-6 ${cardBg}`}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p
                                    className={`text-sm ${mutedText}`}
                                >
                                    Projects
                                </p>

                                <h3 className="text-xl font-bold">
                                    Your Websites
                                </h3>
                            </div>

                            <Globe
                                size={20}
                                className="text-purple-400"
                            />
                        </div>

                        <div className="space-y-4">
                            {websites.length === 0 ? (
                                <p
                                    className={`text-sm ${mutedText}`}
                                >
                                    No websites created yet.
                                </p>
                            ) : (
                                websites
                                    .slice(0, 4)
                                    .map(
                                        (
                                            website
                                        ) => (
                                            <div
                                                key={
                                                    website._id
                                                }
                                                className={`flex items-center justify-between p-3 rounded-xl ${
                                                    isDark
                                                        ? "bg-white/5"
                                                        : "bg-slate-50"
                                                }`}
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center shrink-0">
                                                        <Sparkles
                                                            size={
                                                                16
                                                            }
                                                            className="text-purple-400"
                                                        />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium truncate">
                                                            {
                                                                website.title
                                                            }
                                                        </p>

                                                        <p
                                                            className={`text-xs ${mutedText}`}
                                                        >
                                                            {website.deployed
                                                                ? "Published"
                                                                : "Draft"}
                                                        </p>
                                                    </div>
                                                </div>

                                                <span
                                                    className={`w-2 h-2 rounded-full shrink-0 ${
                                                        website.deployed
                                                            ? "bg-emerald-400"
                                                            : "bg-amber-400"
                                                    }`}
                                                />
                                            </div>
                                        )
                                    )
                            )}
                        </div>
                    </div>

                    {/* =================================================
                        TOTAL VISITORS / ACTIVITY
                    ================================================= */}

                    <div
                        className={`rounded-3xl border p-6 ${cardBg}`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p
                                    className={`text-sm ${mutedText}`}
                                >
                                    Project activity
                                </p>

                                <h3 className="text-xl font-bold">
                                    Website Growth
                                </h3>
                            </div>

                            <TrendingUp
                                size={20}
                                className="text-emerald-400"
                            />
                        </div>

                        <div className="mt-8">
                            <p className="text-4xl font-bold">
                                {totalWebsites}
                            </p>

                            <p
                                className={`text-sm mt-1 ${mutedText}`}
                            >
                                Websites in your account
                            </p>
                        </div>

                        <div className="mt-7 space-y-4">
                            <div>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className={mutedText}>
                                        Published
                                    </span>

                                    <span className="text-emerald-400">
                                        {publishedWebsites}
                                    </span>
                                </div>

                                <div
                                    className={`h-2 rounded-full ${
                                        isDark
                                            ? "bg-white/10"
                                            : "bg-slate-200"
                                    }`}
                                >
                                    <div
                                        className="h-full rounded-full bg-emerald-400 transition-all"
                                        style={{
                                            width: `${publishPercentage}%`,
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className={mutedText}>
                                        Drafts
                                    </span>

                                    <span className="text-amber-400">
                                        {draftWebsites}
                                    </span>
                                </div>

                                <div
                                    className={`h-2 rounded-full ${
                                        isDark
                                            ? "bg-white/10"
                                            : "bg-slate-200"
                                    }`}
                                >
                                    <div
                                        className="h-full rounded-full bg-amber-400 transition-all"
                                        style={{
                                            width: `${draftPercentage}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* =================================================
                        CONVERSION RATE DONUT
                    ================================================= */}

                    <div
                        className={`rounded-3xl border p-6 ${cardBg}`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p
                                    className={`text-sm ${mutedText}`}
                                >
                                    Conversion Rate
                                </p>

                                <h3 className="text-xl font-bold">
                                    Project Status
                                </h3>
                            </div>

                            <Settings
                                size={19}
                                className="text-purple-400"
                            />
                        </div>

                        <div className="flex items-center gap-6 mt-7">
                            {/* DONUT */}

                            <div
                                className="relative w-32 h-32 rounded-full shrink-0"
                                style={{
                                    background:
                                        totalWebsites > 0
                                            ? `conic-gradient(
                                                #ec4899 0deg ${publishedDash}deg,
                                                #6366f1 ${publishedDash}deg ${
                                                  publishedDash +
                                                  draftDash
                                              }deg
                                            )`
                                            : isDark
                                            ? "#27272a"
                                            : "#e2e8f0",
                                }}
                            >
                                <div
                                    className={`absolute inset-4 rounded-full flex flex-col items-center justify-center ${
                                        isDark
                                            ? "bg-[#0d0d14]"
                                            : "bg-white"
                                    }`}
                                >
                                    <span className="text-xl font-bold">
                                        {publishPercentage}%
                                    </span>

                                    <span
                                        className={`text-[10px] ${mutedText}`}
                                    >
                                        Published
                                    </span>
                                </div>
                            </div>

                            {/* LEGEND */}

                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />

                                        <span className="text-sm">
                                            Published
                                        </span>
                                    </div>

                                    <p
                                        className={`text-xs ml-4 mt-1 ${mutedText}`}
                                    >
                                        {publishedWebsites} websites
                                    </p>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />

                                        <span className="text-sm">
                                            Draft
                                        </span>
                                    </div>

                                    <p
                                        className={`text-xs ml-4 mt-1 ${mutedText}`}
                                    >
                                        {draftWebsites} websites
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div
                            className={`mt-6 pt-4 border-t ${
                                isDark
                                    ? "border-white/10"
                                    : "border-slate-200"
                            }`}
                        >
                            <p
                                className={`text-xs ${mutedText}`}
                            >
                                Your project statistics are based
                                on your actual generated websites.
                            </p>
                        </div>
                    </div>
                </section>

                {/* =====================================================
                    YOUR WEBSITES
                ===================================================== */}

                {userData && websites.length > 0 && (
                    <section className="mt-12">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2
                                    className={`text-2xl md:text-3xl font-bold ${headingText}`}
                                >
                                    Your Websites
                                </h2>

                                <p
                                    className={`text-sm mt-1 ${mutedText}`}
                                >
                                    Manage your latest AI-generated
                                    websites.
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    navigate("/dashboard")
                                }
                                className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border text-sm ${
                                    isDark
                                        ? "border-white/10 bg-white/5 hover:bg-white/10"
                                        : "border-slate-200 bg-white hover:bg-slate-100"
                                }`}
                            >
                                View All
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {websites
                                .slice(0, 3)
                                .map((website, index) => (
                                    <motion.div
                                        key={website._id}
                                        initial={{
                                            opacity: 0,
                                            y: 20,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        transition={{
                                            delay:
                                                index *
                                                0.08,
                                        }}
                                        whileHover={{
                                            y: -5,
                                        }}
                                        onClick={() =>
                                            navigate(
                                                `/editor/${website._id}`
                                            )
                                        }
                                        className={`group rounded-2xl border overflow-hidden cursor-pointer transition-all ${
                                            isDark
                                                ? "bg-white/[0.035] border-white/10 hover:border-purple-500/30"
                                                : "bg-white border-slate-200 hover:border-purple-300 shadow-sm"
                                        }`}
                                    >
                                        {/* PREVIEW */}

                                        <div className="relative h-44 bg-black overflow-hidden">
                                            <iframe
                                                srcDoc={
                                                    website.latestCode
                                                }
                                                title={
                                                    website.title
                                                }
                                                className="absolute top-0 left-0 w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white"
                                            />

                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition" />

                                            {/* STATUS */}

                                            <div className="absolute top-3 left-3">
                                                {website.deployed ? (
                                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/20 backdrop-blur-md text-xs text-emerald-300">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

                                                        Published
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/20 backdrop-blur-md text-xs text-amber-300">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />

                                                        Draft
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* DETAILS */}

                                        <div className="p-5">
                                            <h3 className="font-semibold line-clamp-1">
                                                {
                                                    website.title
                                                }
                                            </h3>

                                            <p
                                                className={`text-xs mt-2 ${mutedText}`}
                                            >
                                                Updated{" "}
                                                {website.updatedAt
                                                    ? new Date(
                                                          website.updatedAt
                                                      ).toLocaleDateString()
                                                    : "Recently"}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                        </div>
                    </section>
                )}

                {/* =====================================================
                    EMPTY STATE
                ===================================================== */}

                {userData && websites.length === 0 && (
                    <section
                        className={`mt-12 rounded-3xl border p-10 text-center ${
                            isDark
                                ? "bg-white/[0.03] border-white/10"
                                : "bg-white border-slate-200"
                        }`}
                    >
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-500/10 flex items-center justify-center">
                            <Sparkles
                                size={28}
                                className="text-purple-400"
                            />
                        </div>

                        <h2 className="text-2xl font-bold mt-5">
                            Start building your first website
                        </h2>

                        <p
                            className={`max-w-lg mx-auto mt-2 text-sm ${mutedText}`}
                        >
                            Describe your idea and GenWeb.ai will
                            turn it into a responsive website.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/generate")
                            }
                            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition"
                        >
                            <WandSparkles size={17} />

                            Generate Website
                        </button>
                    </section>
                )}
            </main>

            {/* =====================================================
                FOOTER
            ===================================================== */}

            <footer
                className={`relative z-10 border-t py-8 text-center text-sm ${mutedText} ${
                    isDark
                        ? "border-white/10"
                        : "border-slate-200"
                }`}
            >
                © {new Date().getFullYear()} GenWeb.ai. All rights
                reserved.
            </footer>

            {/* =====================================================
                LOGIN MODAL
            ===================================================== */}

            {openLogin && (
                <LoginModal
                    open={openLogin}
                    onClose={() => setOpenLogin(false)}
                />
            )}
        </div>
    );
}

export default Home;