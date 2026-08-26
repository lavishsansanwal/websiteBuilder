import React, { useEffect, useMemo, useRef, useState } from "react";
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
    Rocket,
    Settings,
    Sparkles,
    Sun,
    TrendingUp,
    WandSparkles,
    Zap,
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
    const [openDashboard, setOpenDashboard] = useState(false);
    const [websites, setWebsites] = useState([]);

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("genweb-theme") || "dark";
    });

    const profileRef = useRef(null);
    const dashboardRef = useRef(null);

    const isDark = theme === "dark";

    useEffect(() => {
        localStorage.setItem("genweb-theme", theme);
        document.documentElement.classList.toggle("dark", isDark);
    }, [theme, isDark]);

    const toggleTheme = () => {
        setTheme((previousTheme) => {
            return previousTheme === "dark" ? "light" : "dark";
        });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setOpenProfile(false);
            }

            if (
                dashboardRef.current &&
                !dashboardRef.current.contains(event.target)
            ) {
                setOpenDashboard(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!userData) {
            setWebsites([]);
            return;
        }

        const getWebsites = async () => {
            try {
                const result = await axios.get(
                    `${serverUrl}/api/website/get-all`,
                    {
                        withCredentials: true,
                    }
                );

                const websiteData = Array.isArray(result.data?.websites)
                    ? result.data.websites
                    : [];

                setWebsites(websiteData);
            } catch (error) {
                console.log("Get websites error:", error);
                setWebsites([]);
            }
        };

        getWebsites();
    }, [userData]);

    const handleLogOut = async () => {
        try {
            // 1. Immediately clear localStorage session
            localStorage.removeItem("genweb_user");
            localStorage.removeItem("user");
            localStorage.removeItem("userData");
            localStorage.removeItem("token");

            // 2. Reset Redux user state
            dispatch(setUserData(null));

            // 3. Clear local component states
            setOpenProfile(false);
            setOpenDashboard(false);
            setWebsites([]);

            // 4. Clean Firebase and server sessions in background
            try {
                await signOut(auth);
            } catch (e) {}

            try {
                await axios.get(`${serverUrl}/api/auth/logout`, {
                    withCredentials: true,
                });
            } catch (e) {}

            // 5. Redirect cleanly to homepage
            navigate("/");
        } catch (error) {
            console.log("Logout error:", error);
            localStorage.removeItem("genweb_user");
            localStorage.removeItem("user");
            dispatch(setUserData(null));
            navigate("/");
        }
    };

    const safeWebsites = Array.isArray(websites) ? websites : [];

    const totalWebsites = safeWebsites.length;

    const publishedWebsites = safeWebsites.filter((website) => {
        return website?.deployed;
    }).length;

    const draftWebsites = totalWebsites - publishedWebsites;

    const publishPercentage =
        totalWebsites > 0
            ? Math.round((publishedWebsites / totalWebsites) * 100)
            : 0;

    const draftPercentage =
        totalWebsites > 0
            ? Math.round((draftWebsites / totalWebsites) * 100)
            : 0;

    const graphData = useMemo(() => {
        const now = new Date();
        const months = [];

        for (let i = 7; i >= 0; i -= 1) {
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

        safeWebsites.forEach((website) => {
            if (!website?.updatedAt) {
                return;
            }

            const updatedDate = new Date(website.updatedAt);

            if (Number.isNaN(updatedDate.getTime())) {
                return;
            }

            const monthName = updatedDate.toLocaleString("default", {
                month: "short",
            });

            const year = updatedDate.getFullYear();

            const matchingMonth = months.find((item) => {
                return item.month === monthName && item.year === year;
            });

            if (matchingMonth) {
                matchingMonth.count += 1;
            }
        });

        let runningTotal = 0;

        return months.map((item) => {
            runningTotal += item.count;

            return {
                ...item,
                value: runningTotal,
            };
        });
    }, [websites]);

    const graphPoints = useMemo(() => {
        if (graphData.length === 0) {
            return "";
        }

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
                    (index * (width - padding * 2)) /
                        Math.max(graphData.length - 1, 1);

                const y =
                    height -
                    padding -
                    (item.value / maxValue) * (height - padding * 2);

                return `${x},${y}`;
            })
            .join(" ");
    }, [graphData]);

    const publishedDash =
        totalWebsites > 0
            ? (publishedWebsites / totalWebsites) * 360
            : 0;

    const draftDash =
        totalWebsites > 0
            ? (draftWebsites / totalWebsites) * 360
            : 0;

    const pageBg = isDark
        ? "bg-[#050507] text-white"
        : "bg-slate-50 text-slate-900";

    const cardBg = isDark
        ? "bg-white/[0.035] border-white/10"
        : "bg-white border-slate-200";

    const mutedText = isDark ? "text-zinc-400" : "text-slate-500";

    const headingText = isDark ? "text-white" : "text-slate-900";

    return (
        <div
            className={`min-h-screen overflow-hidden transition-colors duration-300 ${pageBg}`}
        >
            {/* BACKGROUND */}
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

            {/* NAVBAR */}
            <motion.nav
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`relative z-50 max-w-7xl mx-4 md:mx-auto mt-4 rounded-2xl border backdrop-blur-xl ${
                    isDark
                        ? "bg-slate-950/95 border-slate-800 text-white"
                        : "bg-white border-slate-200 text-slate-900 shadow-lg"
                }`}
            >
                <div className="px-5 md:px-7 py-3.5 flex items-center justify-between">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-3 group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                            <Sparkles size={20} className="text-white" />
                        </div>

                        <span
                            className={`text-xl font-bold tracking-tight ${headingText}`}
                        >
                            GenWeb.ai
                        </span>
                    </button>

                    <div className="hidden md:flex items-center gap-2 ml-8">
                        {userData && (
                            <button
                                onClick={() => navigate("/dashboard")}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium ${
                                    isDark
                                        ? "text-slate-300 hover:text-white hover:bg-white/10"
                                        : "text-slate-700 hover:text-violet-600 hover:bg-violet-50"
                                }`}
                            >
                                <LayoutDashboard size={18} />
                                Dashboard
                            </button>
                        )}

                        <button
                            onClick={() => navigate("/pricing")}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium ${
                                isDark
                                    ? "text-slate-300 hover:text-white hover:bg-white/10"
                                    : "text-slate-700 hover:text-violet-600 hover:bg-violet-50"
                            }`}
                        >
                            <Coins size={18} />
                            Pricing
                        </button>
                    </div>

                    <div className="ml-auto flex items-center gap-2.5">
                        <button
                            onClick={toggleTheme}
                            className={`w-11 h-11 rounded-xl border flex items-center justify-center ${
                                isDark
                                    ? "bg-white/5 border-white/10"
                                    : "bg-slate-50 border-slate-200"
                            }`}
                        >
                            {isDark ? (
                                <Sun size={18} />
                            ) : (
                                <Moon size={18} />
                            )}
                        </button>

                        {userData && (
                            <button
                                onClick={() => navigate("/pricing")}
                                className={`hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl border ${
                                    isDark
                                        ? "bg-white/5 border-white/10"
                                        : "bg-slate-50 border-slate-200"
                                }`}
                            >
                                <Coins
                                    size={17}
                                    className="text-yellow-500"
                                />
                                <span>Credits</span>
                                <span className="font-bold">
                                    {userData?.credits ?? 0}
                                </span>
                                <Plus size={15} />
                            </button>
                        )}

                        {!userData ? (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setOpenLogin(true)}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                                        isDark
                                            ? "text-slate-300 hover:text-white hover:bg-white/10"
                                            : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                                    }`}
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => setOpenLogin(true)}
                                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] transition"
                                >
                                    Get Started
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => navigate("/dashboard")}
                                    className={`hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                                        isDark
                                            ? "bg-violet-600/20 border border-violet-500/30 text-violet-300 hover:bg-violet-600/30"
                                            : "bg-violet-50 border border-violet-200 text-violet-700 hover:bg-violet-100"
                                    }`}
                                >
                                    <LayoutDashboard size={16} />
                                    <span>Dashboard</span>
                                </button>

                                <button
                                    onClick={handleLogOut}
                                    className={`hidden sm:flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                                        isDark
                                            ? "border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40"
                                            : "border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                                    }`}
                                >
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </button>

                                <div
                                    ref={profileRef}
                                    className="relative"
                                >
                                    <button
                                        onClick={() =>
                                            setOpenProfile(!openProfile)
                                        }
                                        className={`flex items-center gap-2 ml-1 p-1.5 rounded-xl ${
                                            isDark
                                                ? "hover:bg-white/10"
                                                : "hover:bg-slate-100"
                                        }`}
                                    >
                                        <img
                                            src={
                                                userData?.avatar ||
                                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                    userData?.name || "User"
                                                )}&background=7c3aed&color=fff`
                                            }
                                            alt="Profile"
                                            referrerPolicy="no-referrer"
                                            className="w-10 h-10 rounded-xl object-cover"
                                        />

                                        <ChevronDown
                                            size={15}
                                            className={
                                                openProfile
                                                    ? "rotate-180"
                                                    : ""
                                            }
                                        />
                                    </button>

                                <AnimatePresence>
                                    {openProfile && (
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                y: -8,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                y: -8,
                                            }}
                                            className={`absolute right-0 mt-3 w-64 rounded-2xl border shadow-2xl overflow-hidden z-50 ${
                                                isDark
                                                    ? "bg-[#111116] border-white/10"
                                                    : "bg-white border-slate-200"
                                            }`}
                                        >
                                            <div
                                                className={`p-4 border-b ${
                                                    isDark
                                                        ? "border-white/10"
                                                        : "border-slate-100"
                                                }`}
                                            >
                                                <p className="font-semibold truncate">
                                                    {userData?.name}
                                                </p>

                                                <p
                                                    className={`text-xs mt-1 truncate ${mutedText}`}
                                                >
                                                    {userData?.email}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    setOpenProfile(false);
                                                    navigate("/dashboard");
                                                }}
                                                className="w-full px-4 py-3 flex items-center gap-3 text-sm hover:bg-white/5"
                                            >
                                                <LayoutDashboard size={17} />
                                                Dashboard
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setOpenProfile(false);
                                                    navigate("/pricing");
                                                }}
                                                className="w-full px-4 py-3 flex items-center gap-3 text-sm hover:bg-white/5"
                                            >
                                                <Coins size={17} />
                                                Credits & Billing
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setOpenProfile(false);
                                                    navigate("/settings");
                                                }}
                                                className="w-full px-4 py-3 flex items-center gap-3 text-sm hover:bg-white/5"
                                            >
                                                <Settings size={17} />
                                                Settings
                                            </button>

                                            <div className="border-t border-white/10" />

                                            <button
                                                onClick={handleLogOut}
                                                className="w-full px-4 py-3 flex items-center gap-3 text-sm text-red-400 hover:bg-red-500/10"
                                            >
                                                <LogOut size={17} />
                                                Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.nav>

            {/* MAIN */}
            <main className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 pt-20 pb-20">
                <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
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
                            Describe your idea and let GenWeb.ai transform it
                            into a modern, responsive and production-ready
                            website.
                        </p>

                        <div className="flex flex-wrap gap-4 mt-9">
                            <button
                                onClick={() =>
                                    userData
                                        ? navigate("/generate")
                                        : setOpenLogin(true)
                                }
                                className="group flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 text-white font-semibold shadow-xl hover:scale-[1.03] transition-all"
                            >
                                <WandSparkles size={19} />
                                Generate Website
                                <span>→</span>
                            </button>

                            <div
                                ref={dashboardRef}
                                className="relative"
                            >
                                <button
                                    onClick={() => {
                                        if (!userData) {
                                            setOpenLogin(true);
                                            return;
                                        }

                                        setOpenDashboard(!openDashboard);
                                    }}
                                    className={`flex items-center gap-3 px-6 py-4 rounded-xl border font-semibold ${
                                        isDark
                                            ? "bg-white/5 border-white/10 hover:bg-white/10"
                                            : "bg-white border-slate-200 hover:bg-slate-100"
                                    }`}
                                >
                                    <LayoutDashboard size={18} />
                                    Dashboard
                                    <ChevronDown
                                        size={16}
                                        className={
                                            openDashboard
                                                ? "rotate-180"
                                                : ""
                                        }
                                    />
                                </button>

                                <AnimatePresence>
                                    {openDashboard && (
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                y: 10,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                y: 10,
                                            }}
                                            className={`absolute left-0 top-full mt-3 w-72 rounded-2xl border shadow-2xl overflow-hidden z-50 ${
                                                isDark
                                                    ? "bg-[#111111] border-white/10"
                                                    : "bg-white border-slate-200"
                                            }`}
                                        >
                                            <button
                                                onClick={() => {
                                                    setOpenDashboard(false);
                                                    navigate("/dashboard");
                                                }}
                                                className="w-full text-left px-5 py-5 border-b border-white/10 hover:bg-white/5"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                                        <LayoutDashboard
                                                            size={19}
                                                            className="text-purple-400"
                                                        />
                                                    </div>

                                                    <div>
                                                        <p className="font-semibold">
                                                            Describe Dashboard
                                                        </p>
                                                        <p
                                                            className={`text-sm mt-1 ${mutedText}`}
                                                        >
                                                            Generate an AI
                                                            dashboard
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setOpenDashboard(false);
                                                    navigate("/upload");
                                                }}
                                                className="w-full text-left px-5 py-5 border-b border-white/10 hover:bg-white/5"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                                        <Plus
                                                            size={20}
                                                            className="text-emerald-400"
                                                        />
                                                    </div>

                                                    <div>
                                                        <p className="font-semibold">
                                                            Upload Data / Files
                                                        </p>
                                                        <p
                                                            className={`text-sm mt-1 ${mutedText}`}
                                                        >
                                                            CSV, JSON and data
                                                            files
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setOpenDashboard(false);
                                                    navigate(
                                                        "/upload?mode=paste"
                                                    );
                                                }}
                                                className="w-full text-left px-5 py-5 hover:bg-white/5"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                                        <Globe
                                                            size={19}
                                                            className="text-blue-400"
                                                        />
                                                    </div>

                                                    <div>
                                                        <p className="font-semibold">
                                                            Paste JSON Data
                                                        </p>
                                                        <p
                                                            className={`text-sm mt-1 ${mutedText}`}
                                                        >
                                                            Add JSON directly
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

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

                    {/* GRAPH CARD */}
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
                                <p className={`text-sm ${mutedText}`}>
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
                                {[40, 80, 120, 160].map((y) => (
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
                                ))}

                                {graphPoints && (
                                    <polyline
                                        points={graphPoints}
                                        fill="none"
                                        stroke="#22c55e"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                )}
                            </svg>

                            <div className="flex justify-between mt-1">
                                {graphData.map((item) => (
                                    <span
                                        key={`${item.month}-${item.year}`}
                                        className={`text-xs ${mutedText}`}
                                    >
                                        {item.month}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mt-5 flex items-end justify-between">
                            <div>
                                <p
                                    className={`text-3xl font-bold ${headingText}`}
                                >
                                    {totalWebsites}
                                </p>

                                <p className={`text-sm ${mutedText}`}>
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

                {/* QUICK ACTIONS */}
                <section className="grid lg:grid-cols-3 gap-5 mt-10">
                    <div className={`rounded-3xl border p-6 ${cardBg}`}>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className={`text-sm ${mutedText}`}>
                                    Get Started
                                </p>

                                <h3 className="text-xl font-bold">
                                    Quick Actions
                                </h3>
                            </div>

                            <WandSparkles
                                size={20}
                                className="text-purple-400"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => navigate("/generate?type=website")}
                                className="text-left p-4 rounded-2xl border border-white/10 hover:bg-purple-500/10 transition group"
                            >
                                <Globe
                                    size={18}
                                    className="text-purple-400 mb-3 group-hover:scale-110 transition-transform"
                                />
                                <h4 className="text-sm font-semibold">
                                    Full Website
                                </h4>
                                <p
                                    className={`text-xs mt-1 ${mutedText}`}
                                >
                                    Multi-section site
                                </p>
                            </button>

                            <button
                                onClick={() =>
                                    navigate("/generate?type=dashboard")
                                }
                                className="text-left p-4 rounded-2xl border border-white/10 hover:bg-cyan-500/10 transition group"
                            >
                                <LayoutDashboard
                                    size={18}
                                    className="text-cyan-400 mb-3 group-hover:scale-110 transition-transform"
                                />
                                <h4 className="text-sm font-semibold">
                                    Dashboard
                                </h4>
                                <p
                                    className={`text-xs mt-1 ${mutedText}`}
                                >
                                    Analytics & charts
                                </p>
                            </button>

                            <button
                                onClick={() =>
                                    navigate("/generate?type=landing")
                                }
                                className="text-left p-4 rounded-2xl border border-white/10 hover:bg-emerald-500/10 transition group"
                            >
                                <Rocket
                                    size={18}
                                    className="text-emerald-400 mb-3 group-hover:scale-110 transition-transform"
                                />
                                <h4 className="text-sm font-semibold">
                                    Landing Page
                                </h4>
                                <p
                                    className={`text-xs mt-1 ${mutedText}`}
                                >
                                    High-converting SaaS
                                </p>
                            </button>

                            <button
                                onClick={() => navigate("/upload")}
                                className="text-left p-4 rounded-2xl border border-white/10 hover:bg-amber-500/10 transition group"
                            >
                                <BarChart3
                                    size={18}
                                    className="text-amber-400 mb-3 group-hover:scale-110 transition-transform"
                                />
                                <h4 className="text-sm font-semibold">
                                    Upload Data
                                </h4>
                                <p
                                    className={`text-xs mt-1 ${mutedText}`}
                                >
                                    CSV / JSON to App
                                </p>
                            </button>
                        </div>
                    </div>

                    {/* WEBSITE GROWTH */}
                    <div className={`rounded-3xl border p-6 ${cardBg}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm ${mutedText}`}>
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
                            <p className={`text-sm mt-1 ${mutedText}`}>
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
                                        className="h-full rounded-full bg-emerald-400"
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
                                        className="h-full rounded-full bg-amber-400"
                                        style={{
                                            width: `${draftPercentage}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PROJECT STATUS */}
                    <div className={`rounded-3xl border p-6 ${cardBg}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm ${mutedText}`}>
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
                            <div
                                className="relative w-32 h-32 rounded-full shrink-0"
                                style={{
                                    background:
                                        totalWebsites > 0
                                            ? `conic-gradient(#ec4899 0deg ${publishedDash}deg, #6366f1 ${publishedDash}deg 360deg)`
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
                                            Drafts
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
                    </div>
                </section>

                {/* YOUR WEBSITES */}
                {userData && safeWebsites.length > 0 && (
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
                                    Manage your latest AI-generated websites.
                                </p>
                            </div>

                            <button
                                onClick={() => navigate("/dashboard")}
                                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-sm"
                            >
                                View All
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {safeWebsites
                                .slice(0, 3)
                                .map((website, index) => (
                                    <motion.div
                                        key={website._id || index}
                                        initial={{
                                            opacity: 0,
                                            y: 20,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        whileHover={{ y: -5 }}
                                        onClick={() => {
                                            if (website._id) {
                                                navigate(
                                                    `/editor/${website._id}`
                                                );
                                            }
                                        }}
                                        className={`group rounded-2xl border overflow-hidden cursor-pointer ${
                                            isDark
                                                ? "bg-white/[0.035] border-white/10"
                                                : "bg-white border-slate-200"
                                        }`}
                                    >
                                        <div className="relative h-44 bg-black overflow-hidden">
                                            <iframe
                                                srcDoc={
                                                    website.latestCode || ""
                                                }
                                                title={
                                                    website.title || "Website"
                                                }
                                                sandbox="allow-scripts allow-same-origin"
                                                className="absolute top-0 left-0 w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white"
                                            />

                                            {website.deployed && (
                                                <div className="absolute top-3 left-3">
                                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-xs text-emerald-300">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                        Published
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-5">
                                            <h3 className="font-semibold truncate">
                                                {website.title ||
                                                    "Untitled Website"}
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

                {/* EMPTY STATE */}
                {userData && safeWebsites.length === 0 && (
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
                            Describe your idea and GenWeb.ai will turn it into a
                            responsive website.
                        </p>

                        <button
                            onClick={() => navigate("/generate")}
                            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition"
                        >
                            <WandSparkles size={17} />
                            Generate Website
                        </button>
                    </section>
                )}
            </main>

            {/* FOOTER */}
            <footer
                className={`relative z-10 border-t py-8 text-center text-sm ${mutedText} ${
                    isDark ? "border-white/10" : "border-slate-200"
                }`}
            >
                © {new Date().getFullYear()} GenWeb.ai. All rights reserved.
            </footer>

            {/* LOGIN MODAL */}
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