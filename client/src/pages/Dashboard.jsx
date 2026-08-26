import {
    ArrowLeft,
    Check,
    Rocket,
    Share2,
    Globe,
    Sparkles,
    Plus,
    LayoutDashboard,
    ExternalLink,
    Clock
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

    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [copiedId, setCopiedId] = useState(null);
    const [deployingId, setDeployingId] = useState(null);

    // ==========================================
    // WATCH THEME
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
    // GET ALL WEBSITES
    // ==========================================

    useEffect(() => {
        const handleGetAllWebsites = async () => {
            try {
                setLoading(true);
                setError("");

                const result = await axios.get(
                    `${serverUrl}/api/website/get-all`,
                    {
                        withCredentials: true
                    }
                );

                console.log(
                    "GET ALL WEBSITES RESPONSE:",
                    result.data
                );

                const websiteList =
                    Array.isArray(result.data?.websites)
                        ? result.data.websites
                        : [];

                setWebsites(websiteList);

            } catch (error) {
                console.error(
                    "GET ALL WEBSITES ERROR:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load websites"
                );

                setWebsites([]);

            } finally {
                setLoading(false);
            }
        };

        handleGetAllWebsites();

    }, []);

    // ==========================================
    // DEPLOY WEBSITE
    // ==========================================

    const handleDeploy = async (id) => {
        try {
            setDeployingId(id);

            const result = await axios.get(
                `${serverUrl}/api/website/deploy/${id}`,
                {
                    withCredentials: true
                }
            );

            console.log(
                "DEPLOY RESPONSE:",
                result.data
            );

            /*
            Your backend currently returns:

            {
                message,
                slug,
                website
            }

            So we safely get the updated website.
            */

            const updatedWebsite =
                result.data?.website;

            const slug =
                result.data?.slug ||
                updatedWebsite?.slug;

            /*
            Change this route if your public
            website route has a different name.
            */

            const deployUrl = slug
                ? `${window.location.origin}/website/${slug}`
                : null;

            setWebsites((previous) =>
                previous.map((website) =>
                    website._id === id
                        ? {
                            ...website,
                            ...(updatedWebsite || {}),
                            deployed: true,
                            deployUrl
                        }
                        : website
                )
            );

            if (deployUrl) {
                window.open(
                    deployUrl,
                    "_blank"
                );
            }

        } catch (error) {
            console.error(
                "DEPLOY ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to deploy website"
            );

        } finally {
            setDeployingId(null);
        }
    };

    // ==========================================
    // COPY DEPLOY LINK
    // ==========================================

    const handleCopy = async (site) => {
        try {
            if (!site?.deployUrl) {
                return;
            }

            await navigator.clipboard.writeText(
                site.deployUrl
            );

            setCopiedId(site._id);

            setTimeout(() => {
                setCopiedId(null);
            }, 2000);

        } catch (error) {
            console.error(
                "COPY ERROR:",
                error
            );
        }
    };

    // ==========================================
    // SAFE ARRAY
    // ==========================================

    const safeWebsites = Array.isArray(websites)
        ? websites
        : [];

    // ==========================================
    // STATISTICS
    // ==========================================

    const totalWebsites =
        safeWebsites.length;

    const deployedWebsites =
        safeWebsites.filter(
            (website) => website?.deployed
        ).length;

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

            {/* NAVBAR */}

            <div
                className={`sticky top-0 z-40 backdrop-blur-xl border-b ${
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

                    <div className="flex items-center gap-2">
                        <button
                            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-xs font-semibold hover:bg-white/10 transition"
                            onClick={() => navigate("/generate?type=dashboard")}
                        >
                            <LayoutDashboard size={14} className="text-cyan-400" />
                            Dashboard
                        </button>

                        <button
                            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-xs font-semibold hover:bg-white/10 transition"
                            onClick={() => navigate("/generate?type=landing")}
                        >
                            <Rocket size={14} className="text-emerald-400" />
                            Landing Page
                        </button>

                        <button
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold hover:opacity-90 hover:scale-105 transition shadow-lg shadow-indigo-500/20"
                            onClick={() => navigate("/generate")}
                        >
                            <Plus size={16} />
                            Create Project
                        </button>
                    </div>

                </div>

            </div>

            {/* MAIN */}

            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* WELCOME */}

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
                        Create, manage and deploy your AI-powered websites.
                    </p>

                </motion.div>

                {/* STATS */}

                {!loading && !error && (

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-12">

                        <StatCard
                            title="Total Websites"
                            value={totalWebsites}
                            text="AI generated websites"
                            icon={
                                <Sparkles
                                    size={21}
                                    className="text-indigo-500"
                                />
                            }
                            darkMode={darkMode}
                            type="indigo"
                        />

                        <StatCard
                            title="Published"
                            value={deployedWebsites}
                            text="Live websites"
                            icon={
                                <Globe
                                    size={21}
                                    className="text-emerald-500"
                                />
                            }
                            darkMode={darkMode}
                            type="emerald"
                        />

                        <StatCard
                            title="Drafts"
                            value={draftWebsites}
                            text="Ready to deploy"
                            icon={
                                <Rocket
                                    size={21}
                                    className="text-purple-500"
                                />
                            }
                            darkMode={darkMode}
                            type="purple"
                        />

                    </div>
                )}

                {/* LOADING */}

                {loading && (

                    <div className="mt-24 text-center">

                        <div
                            className={`inline-flex items-center gap-3 px-5 py-3 rounded-xl border ${
                                darkMode
                                    ? "bg-white/5 border-white/10"
                                    : "bg-white border-gray-200"
                            }`}
                        >

                            <div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-indigo-500 animate-spin" />

                            <span
                                className={
                                    darkMode
                                        ? "text-zinc-400 text-sm"
                                        : "text-gray-500 text-sm"
                                }
                            >
                                Loading your websites...
                            </span>

                        </div>

                    </div>
                )}

                {/* ERROR */}

                {error && !loading && (

                    <div className="mt-24 text-center">

                        <div className="inline-block px-6 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                            {error}
                        </div>

                    </div>
                )}

                {/* EMPTY STATE */}

                {!loading &&
                    !error &&
                    safeWebsites.length === 0 && (

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 20
                        }}
                        animate={{
                            opacity: 1,
                            y: 0
                        }}
                        className={`rounded-3xl border p-12 text-center ${
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
                            Describe your idea and let AI transform it into a
                            beautiful responsive website in seconds.
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

                {/* YOUR WEBSITES */}

                {!loading &&
                    !error &&
                    safeWebsites.length > 0 && (

                    <div>

                        <div className="flex items-center justify-between mb-7">

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
                                    Manage and launch everything you've created with AI.
                                </p>

                            </div>

                        </div>

                        {/* GRID */}

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">

                            {safeWebsites.map((w, i) => {

                                const copied =
                                    copiedId === w._id;

                                const isDeploying =
                                    deployingId === w._id;

                                return (

                                    <motion.div
                                        key={w._id}
                                        initial={{
                                            opacity: 0,
                                            y: 25
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0
                                        }}
                                        transition={{
                                            delay: i * 0.08
                                        }}
                                        whileHover={{
                                            y: -8
                                        }}
                                        className={`group relative rounded-3xl overflow-hidden flex flex-col border transition-all duration-500 ${
                                            darkMode
                                                ? "bg-[#0c0c0f] border-white/10 hover:border-indigo-500/40"
                                                : "bg-white border-gray-200 hover:border-indigo-300 shadow-sm hover:shadow-xl"
                                        }`}
                                    >

                                        {/* PREVIEW */}

                                        <div
                                            className="relative h-52 overflow-hidden cursor-pointer bg-white"
                                            onClick={() =>
                                                navigate(
                                                    `/editor/${w._id}`
                                                )
                                            }
                                        >

                                            {/* BROWSER BAR */}

                                            <div
                                                className={`absolute top-0 left-0 right-0 h-9 z-20 flex items-center px-3 gap-2 border-b ${
                                                    darkMode
                                                        ? "bg-black/70 border-white/10"
                                                        : "bg-white/90 border-gray-200"
                                                }`}
                                            >

                                                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />

                                                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />

                                                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />

                                                <div className="ml-2 flex-1 h-5 rounded-md bg-gray-100 px-3 flex items-center text-[9px] text-gray-400">
                                                    preview.yourwebsite.ai
                                                </div>

                                            </div>

                                            {/* WEBSITE */}

                                            <iframe
                                                srcDoc={
                                                    w.latestCode || ""
                                                }
                                                title={
                                                    w.title ||
                                                    "Website Preview"
                                                }
                                                sandbox="allow-scripts allow-forms"
                                                className="absolute top-9 left-0 w-[140%] h-[140%] scale-[0.715] origin-top-left pointer-events-none bg-white border-0"
                                            />

                                            {/* STATUS */}

                                            {w.deployed && (

                                                <div className="absolute top-12 left-3 z-30">

                                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/25 backdrop-blur-xl">

                                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

                                                        <span className="text-[11px] font-semibold text-emerald-500">
                                                            Published
                                                        </span>

                                                    </div>

                                                </div>
                                            )}

                                            {/* OPEN EDITOR */}

                                            <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition pointer-events-none">

                                                <div className="px-4 py-2.5 rounded-xl bg-black/75 border border-white/15 text-white text-xs font-semibold flex items-center gap-2">

                                                    <ExternalLink size={14} />

                                                    Open Editor

                                                </div>

                                            </div>

                                        </div>

                                        {/* DETAILS */}

                                        <div className="p-5 flex flex-col flex-1">

                                            <div className="flex items-start gap-3">

                                                <div
                                                    className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border ${
                                                        darkMode
                                                            ? "bg-indigo-500/10 border-indigo-500/20"
                                                            : "bg-indigo-50 border-indigo-100"
                                                    }`}
                                                >

                                                    <Sparkles
                                                        size={17}
                                                        className="text-indigo-500"
                                                    />

                                                </div>

                                                <div className="min-w-0">

                                                    <h3 className="text-base font-semibold line-clamp-2">

                                                        {w.title ||
                                                            "Untitled Website"}

                                                    </h3>

                                                    <div
                                                        className={`flex items-center gap-1.5 text-[11px] mt-2 ${
                                                            darkMode
                                                                ? "text-zinc-500"
                                                                : "text-gray-400"
                                                        }`}
                                                    >

                                                        <Clock size={12} />

                                                        Updated{" "}

                                                        {w.updatedAt
                                                            ? new Date(
                                                                w.updatedAt
                                                            ).toLocaleDateString(
                                                                undefined,
                                                                {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                    year: "numeric"
                                                                }
                                                            )
                                                            : "Recently"}

                                                    </div>

                                                </div>

                                            </div>

                                            <div
                                                className={`h-px my-4 ${
                                                    darkMode
                                                        ? "bg-white/10"
                                                        : "bg-gray-100"
                                                }`}
                                            />

                                            {/* ACTION */}

                                            {!w.deployed ? (

                                                <button
                                                    disabled={isDeploying}
                                                    onClick={() =>
                                                        handleDeploy(
                                                            w._id
                                                        )
                                                    }
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:opacity-90 disabled:opacity-60 text-white transition"
                                                >

                                                    <Rocket size={16} />

                                                    {isDeploying
                                                        ? "Deploying..."
                                                        : "Deploy Website"}

                                                </button>

                                            ) : (

                                                <div className="flex gap-2">

                                                    <motion.button
                                                        whileTap={{
                                                            scale: 0.96
                                                        }}
                                                        onClick={() =>
                                                            handleCopy(w)
                                                        }
                                                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-semibold border transition ${
                                                            copied
                                                                ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/25"
                                                                : darkMode
                                                                    ? "bg-white/5 hover:bg-white/10 border-white/10"
                                                                    : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                                                        }`}
                                                    >

                                                        {copied ? (
                                                            <>
                                                                <Check size={15} />
                                                                Copied
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Share2 size={15} />
                                                                Share Link
                                                            </>
                                                        )}

                                                    </motion.button>

                                                    <button
                                                        onClick={() => {
                                                            if (w.deployUrl) {
                                                                window.open(
                                                                    w.deployUrl,
                                                                    "_blank"
                                                                );
                                                            }
                                                        }}
                                                        className={`w-12 flex items-center justify-center rounded-xl border ${
                                                            darkMode
                                                                ? "bg-white/5 border-white/10 hover:bg-white/10"
                                                                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                                                        }`}
                                                    >

                                                        <Globe size={16} />

                                                    </button>

                                                </div>
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


/*
==========================================
STAT CARD COMPONENT
==========================================
*/

function StatCard({
    title,
    value,
    text,
    icon,
    darkMode,
    type
}) {
    const colors = {
        indigo: {
            dark:
                "border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-purple-500/5",
            light:
                "border-indigo-200 bg-white shadow-sm",
            text:
                "text-indigo-500"
        },

        emerald: {
            dark:
                "border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-green-500/5",
            light:
                "border-emerald-200 bg-white shadow-sm",
            text:
                "text-emerald-500"
        },

        purple: {
            dark:
                "border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/5",
            light:
                "border-purple-200 bg-white shadow-sm",
            text:
                "text-purple-500"
        }
    };

    const color = colors[type];

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 15
            }}
            animate={{
                opacity: 1,
                y: 0
            }}
            className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 ${
                darkMode
                    ? color.dark
                    : color.light
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
                        {title}
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {value}
                    </h2>

                </div>

                <div className="w-12 h-12 rounded-xl bg-black/5 border border-black/5 flex items-center justify-center">

                    {icon}

                </div>

            </div>

            <p
                className={`text-xs mt-4 ${
                    color.text
                }`}
            >
                {text}
            </p>

        </motion.div>
    );
}

export default Dashboard;