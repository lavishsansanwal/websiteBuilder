import {
    ArrowLeft,
    Check,
    Rocket,
    Share2,
    Globe,
    Sparkles,
    Plus,
    LayoutDashboard
} from "lucide-react";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";

function Dashboard() {

    const { userData } = useSelector((state) => state.user);

    const navigate = useNavigate();

    // ==========================================
    // THEME
    // ==========================================

    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") !== "light"
    );

    // ==========================================
    // STATES
    // ==========================================

    const [websites, setWebsites] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [copiedId, setCopiedId] = useState(null);

    // ==========================================
    // WATCH THEME CHANGES
    // ==========================================

    useEffect(() => {

        const handleThemeChange = () => {
            setDarkMode(
                localStorage.getItem("theme") !== "light"
            );
        };

        window.addEventListener(
            "storage",
            handleThemeChange
        );

        const interval = setInterval(
            handleThemeChange,
            300
        );

        return () => {

            window.removeEventListener(
                "storage",
                handleThemeChange
            );

            clearInterval(interval);

        };

    }, []);

    // ==========================================
    // DEPLOY WEBSITE
    // ==========================================

    const handleDeploy = async (id) => {

        try {

            const result = await axios.get(
                `${serverUrl}/api/website/deploy/${id}`,
                {
                    withCredentials: true
                }
            );

            window.open(
                result.data.url,
                "_blank"
            );

            setWebsites((prev) =>
                prev.map((w) =>
                    w._id === id
                        ? {
                              ...w,
                              deployed: true,
                              deployUrl: result.data.url
                          }
                        : w
                )
            );

        } catch (error) {

            console.log(error);

        }

    };

    // ==========================================
    // GET ALL WEBSITES
    // ==========================================

    useEffect(() => {

        const handleGetAllWebsites = async () => {

            setLoading(true);
            setError("");

            try {

                const result = await axios.get(
                    `${serverUrl}/api/website/get-all`,
                    {
                        withCredentials: true
                    }
                );

                setWebsites(result.data || []);

                setLoading(false);

            } catch (error) {

                console.log(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load websites"
                );

                setLoading(false);

            }

        };

        handleGetAllWebsites();

    }, []);

    // ==========================================
    // COPY DEPLOY LINK
    // ==========================================

    const handleCopy = async (site) => {

        try {

            await navigator.clipboard.writeText(
                site.deployUrl
            );

            setCopiedId(site._id);

            setTimeout(() => {
                setCopiedId(null);
            }, 2000);

        } catch (error) {

            console.log(error);

        }

    };

    // ==========================================
    // STATISTICS
    // ==========================================

    const totalWebsites =
        websites?.length || 0;

    const deployedWebsites =
        websites?.filter(
            (website) => website.deployed
        ).length || 0;

    const draftWebsites =
        totalWebsites - deployedWebsites;

    // ==========================================
    // RETURN
    // ==========================================

    return (

        <div
            className={`min-h-screen transition-colors duration-300 ${
                darkMode
                    ? "bg-[#050505] text-white"
                    : "bg-gray-100 text-gray-900"
            }`}
        >

            {/* ==========================================
                NAVBAR
            ========================================== */}

            <div
                className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300 ${
                    darkMode
                        ? "bg-black/60 border-white/10"
                        : "bg-white/80 border-gray-200"
                }`}
            >

                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                    <div className="flex items-center gap-4">

                        <button
                            className={`p-2 rounded-lg transition ${
                                darkMode
                                    ? "hover:bg-white/10"
                                    : "hover:bg-gray-200"
                            }`}
                            onClick={() => navigate("/")}
                        >
                            <ArrowLeft size={17} />
                        </button>

                        <div className="flex items-center gap-2">

                            <LayoutDashboard
                                size={18}
                                className="text-indigo-500"
                            />

                            <h1 className="text-lg font-semibold">
                                Dashboard
                            </h1>

                        </div>

                    </div>

                    <button
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 hover:scale-105 transition"
                        onClick={() =>
                            navigate("/generate")
                        }
                    >

                        <Plus size={16} />

                        New Website

                    </button>

                </div>

            </div>

            {/* ==========================================
                MAIN CONTENT
            ========================================== */}

            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* ==========================================
                    WELCOME
                ========================================== */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 12
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    className="mb-10"
                >

                    <p
                        className={`text-sm mb-2 ${
                            darkMode
                                ? "text-zinc-400"
                                : "text-gray-500"
                        }`}
                    >
                        Welcome Back
                    </p>

                    <h1 className="text-3xl md:text-4xl font-bold">
                        {userData?.name || "Creator"}
                    </h1>

                    <p
                        className={`text-sm mt-2 ${
                            darkMode
                                ? "text-zinc-500"
                                : "text-gray-500"
                        }`}
                    >
                        Create, manage and deploy your AI-powered
                        websites.
                    </p>

                </motion.div>

                {/* ==========================================
                    STATS
                ========================================== */}

                {!loading && !error && (

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-12">

                        {/* TOTAL WEBSITES */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 15
                            }}
                            animate={{
                                opacity: 1,
                                y: 0
                            }}
                            transition={{
                                delay: 0.1
                            }}
                            className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 ${
                                darkMode
                                    ? "border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 hover:border-indigo-500/40"
                                    : "border-indigo-200 bg-white hover:border-indigo-300 shadow-sm"
                            }`}
                        >

                            <div className="flex items-center justify-between">

                                <div>

                                    <p
                                        className={`text-sm ${
                                            darkMode
                                                ? "text-zinc-400"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        Total Websites
                                    </p>

                                    <h2 className="text-3xl font-bold mt-2">
                                        {totalWebsites}
                                    </h2>

                                </div>

                                <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center">

                                    <Sparkles
                                        size={21}
                                        className="text-indigo-500"
                                    />

                                </div>

                            </div>

                            <p className="text-xs text-indigo-500 mt-4">
                                AI generated websites
                            </p>

                        </motion.div>

                        {/* PUBLISHED */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 15
                            }}
                            animate={{
                                opacity: 1,
                                y: 0
                            }}
                            transition={{
                                delay: 0.15
                            }}
                            className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 ${
                                darkMode
                                    ? "border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-green-500/5 hover:border-emerald-500/40"
                                    : "border-emerald-200 bg-white hover:border-emerald-300 shadow-sm"
                            }`}
                        >

                            <div className="flex items-center justify-between">

                                <div>

                                    <p
                                        className={`text-sm ${
                                            darkMode
                                                ? "text-zinc-400"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        Published
                                    </p>

                                    <h2 className="text-3xl font-bold mt-2">
                                        {deployedWebsites}
                                    </h2>

                                </div>

                                <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">

                                    <Globe
                                        size={21}
                                        className="text-emerald-500"
                                    />

                                </div>

                            </div>

                            <p className="text-xs text-emerald-500 mt-4">
                                Live websites
                            </p>

                        </motion.div>

                        {/* DRAFTS */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 15
                            }}
                            animate={{
                                opacity: 1,
                                y: 0
                            }}
                            transition={{
                                delay: 0.2
                            }}
                            className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 ${
                                darkMode
                                    ? "border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/5 hover:border-purple-500/40"
                                    : "border-purple-200 bg-white hover:border-purple-300 shadow-sm"
                            }`}
                        >

                            <div className="flex items-center justify-between">

                                <div>

                                    <p
                                        className={`text-sm ${
                                            darkMode
                                                ? "text-zinc-400"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        Drafts
                                    </p>

                                    <h2 className="text-3xl font-bold mt-2">
                                        {draftWebsites}
                                    </h2>

                                </div>

                                <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center">

                                    <Rocket
                                        size={21}
                                        className="text-purple-500"
                                    />

                                </div>

                            </div>

                            <p className="text-xs text-purple-500 mt-4">
                                Ready to deploy
                            </p>

                        </motion.div>

                    </div>

                )}

                {/* ==========================================
                    LOADING
                ========================================== */}

                {loading && (

                    <div className="mt-24 text-center">

                        <div
                            className={`inline-flex items-center gap-3 px-5 py-3 rounded-xl border ${
                                darkMode
                                    ? "bg-white/5 border-white/10"
                                    : "bg-white border-gray-200 shadow-sm"
                            }`}
                        >

                            <div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-indigo-500 animate-spin"></div>

                            <span
                                className={`text-sm ${
                                    darkMode
                                        ? "text-zinc-400"
                                        : "text-gray-500"
                                }`}
                            >
                                Loading your websites...
                            </span>

                        </div>

                    </div>

                )}

                {/* ==========================================
                    ERROR
                ========================================== */}

                {error && !loading && (

                    <div className="mt-24 text-center">

                        <div className="inline-block px-6 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                            {error}
                        </div>

                    </div>

                )}

                {/* ==========================================
                    EMPTY STATE
                ========================================== */}

                {!loading &&
                    !error &&
                    websites?.length === 0 && (

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 20
                            }}
                            animate={{
                                opacity: 1,
                                y: 0
                            }}
                            className={`mt-10 rounded-3xl border p-12 text-center ${
                                darkMode
                                    ? "border-white/10 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent"
                                    : "border-gray-200 bg-white shadow-sm"
                            }`}
                        >

                            <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center mb-5">

                                <Sparkles
                                    size={28}
                                    className="text-indigo-500"
                                />

                            </div>

                            <h2 className="text-2xl font-bold mb-2">
                                Your next website starts here
                            </h2>

                            <p
                                className={`text-sm max-w-md mx-auto mb-7 ${
                                    darkMode
                                        ? "text-zinc-400"
                                        : "text-gray-500"
                                }`}
                            >
                                Describe your idea and let AI transform
                                it into a beautiful responsive website
                                in seconds.
                            </p>

                            <button
                                onClick={() =>
                                    navigate("/generate")
                                }
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 hover:scale-105 transition"
                            >

                                <Plus size={17} />

                                Create Your First Website

                            </button>

                        </motion.div>

                    )}

                {/* ==========================================
                    YOUR WEBSITES
                ========================================== */}

                {!loading &&
                    !error &&
                    websites?.length > 0 && (

                        <div>

                            {/* SECTION HEADER */}

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">

                                <div>

                                    <div className="flex items-center gap-3">

                                        <h2 className="text-2xl md:text-3xl font-bold">
                                            Your Websites
                                        </h2>

                                        <span
                                            className={`px-2.5 py-1 rounded-full border text-xs ${
                                                darkMode
                                                    ? "bg-white/10 border-white/10 text-zinc-300"
                                                    : "bg-gray-100 border-gray-200 text-gray-600"
                                            }`}
                                        >
                                            {totalWebsites}
                                        </span>

                                    </div>

                                    <p
                                        className={`text-sm mt-2 ${
                                            darkMode
                                                ? "text-zinc-500"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        Manage and launch everything
                                        you've created with AI.
                                    </p>

                                </div>

                            </div>

                            {/* WEBSITE GRID */}

                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">

                                {websites.map((w, i) => {

                                    const copied =
                                        copiedId === w._id;

                                    return (

                                        <motion.div
                                            key={w._id}
                                            initial={{
                                                opacity: 0,
                                                y: 20
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0
                                            }}
                                            transition={{
                                                delay: i * 0.05
                                            }}
                                            whileHover={{
                                                y: -6
                                            }}
                                            className={`group rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col ${
                                                darkMode
                                                    ? "bg-white/[0.04] border-white/10 hover:bg-white/[0.07] hover:border-indigo-500/30"
                                                    : "bg-white border-gray-200 hover:border-indigo-300 shadow-sm hover:shadow-md"
                                            }`}
                                        >

                                            {/* WEBSITE PREVIEW */}

                                            <div
                                                className="relative h-44 bg-black cursor-pointer overflow-hidden"
                                                onClick={() =>
                                                    navigate(
                                                        `/editor/${w._id}`
                                                    )
                                                }
                                            >

                                                <iframe
                                                    srcDoc={
                                                        w.latestCode
                                                    }
                                                    title={w.title}
                                                    className="absolute inset-0 w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white"
                                                />

                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition"></div>

                                                {/* STATUS */}

                                                <div className="absolute top-3 left-3">

                                                    {w.deployed ? (

                                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 backdrop-blur-md text-xs text-emerald-400">

                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>

                                                            Published

                                                        </div>

                                                    ) : (

                                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/20 backdrop-blur-md text-xs text-amber-400">

                                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>

                                                            Draft

                                                        </div>

                                                    )}

                                                </div>

                                                {/* OPEN EDITOR */}

                                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition">

                                                    <div className="px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-xs text-white">
                                                        Open Editor
                                                    </div>

                                                </div>

                                            </div>

                                            {/* WEBSITE DETAILS */}

                                            <div className="p-5 flex flex-col gap-4 flex-1">

                                                <div>

                                                    <h3
                                                        className={`text-base font-semibold line-clamp-2 transition ${
                                                            darkMode
                                                                ? "group-hover:text-indigo-300"
                                                                : "group-hover:text-indigo-600"
                                                        }`}
                                                    >
                                                        {w.title}
                                                    </h3>

                                                    <p
                                                        className={`text-xs mt-2 ${
                                                            darkMode
                                                                ? "text-zinc-500"
                                                                : "text-gray-500"
                                                        }`}
                                                    >
                                                        Last updated{" "}
                                                        {new Date(
                                                            w.updatedAt
                                                        ).toLocaleDateString(
                                                            undefined,
                                                            {
                                                                day: "numeric",
                                                                month: "short",
                                                                year: "numeric"
                                                            }
                                                        )}
                                                    </p>

                                                </div>

                                                {/* DEPLOY */}

                                                {!w.deployed ? (

                                                    <button
                                                        className="mt-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 hover:scale-[1.02] transition shadow-lg shadow-indigo-500/10 text-white"
                                                        onClick={() =>
                                                            handleDeploy(
                                                                w._id
                                                            )
                                                        }
                                                    >

                                                        <Rocket
                                                            size={17}
                                                        />

                                                        Deploy Website

                                                    </button>

                                                ) : (

                                                    <motion.button
                                                        whileTap={{
                                                            scale: 0.95
                                                        }}
                                                        onClick={() =>
                                                            handleCopy(w)
                                                        }
                                                        className={
                                                            copied
                                                                ? "mt-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all bg-emerald-500/20 text-emerald-500 border border-emerald-500/30"
                                                                : `mt-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                                                                      darkMode
                                                                          ? "bg-white/5 hover:bg-white/10 border-white/10"
                                                                          : "bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-700"
                                                                  }`
                                                        }
                                                    >

                                                        {copied ? (
                                                            <>
                                                                <Check
                                                                    size={
                                                                        15
                                                                    }
                                                                />

                                                                Link Copied
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Share2
                                                                    size={
                                                                        15
                                                                    }
                                                                />

                                                                Share Link
                                                            </>
                                                        )}

                                                    </motion.button>

                                                )}

                                            </div>

                                        </motion.div>

                                    );

                                })}

                            </div>

                        </div>

                    )}

            </div>

        </div>
    );
}

export default Dashboard;