import React, { useEffect, useState } from "react";
import { ArrowLeft, Upload as UploadIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";

function Upload() {

    const navigate = useNavigate();

    // ==========================================
    // STATES
    // ==========================================

    const [uploadedFile, setUploadedFile] = useState(null);
    const [prompt, setPrompt] = useState("");
    const [pageType, setPageType] = useState("dashboard");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Progress states
    const [progress, setProgress] = useState(0);
    const [phaseIndex, setPhaseIndex] = useState(0);


    // ==========================================
    // PROGRESS PHASES
    // ==========================================

    const PHASES = [
        "Analyzing your idea…",
        "Designing layout & structure…",
        "Writing HTML & CSS…",
        "Adding animations & interactions…",
        "Final quality checks…",
    ];


    // ==========================================
    // SELECT CSV / JSON FILE
    // ==========================================

    const handleFileChange = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setError("");

        const fileName = file.name.toLowerCase();

        if (
            !fileName.endsWith(".csv") &&
            !fileName.endsWith(".json")
        ) {

            setError(
                "Please upload only CSV or JSON files."
            );

            setUploadedFile(null);

            return;
        }

        setUploadedFile(file);

        // Clear pasted JSON when a file is selected
        setPrompt("");

        console.log(
            "Selected file:",
            file
        );
    };


    // ==========================================
    // READ UPLOADED FILE
    // ==========================================

    const readFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                try {
                    const text = event.target.result;

                    // JSON FILE
                    if (file.name.toLowerCase().endsWith(".json")) {
                        const jsonData = JSON.parse(text);
                        resolve(jsonData);
                    } 
                    // CSV FILE
                    else {
                        const lines = text
                            .trim()
                            .split(/\r?\n/)
                            .filter(l => l.trim().length > 0);

                        if (lines.length < 2) {
                            reject(new Error("CSV file does not contain enough data."));
                            return;
                        }

                        // Robust CSV line parser handling quotes
                        const parseCSVLine = (line) => {
                            const result = [];
                            let cur = '';
                            let inQuotes = false;
                            for (let i = 0; i < line.length; i++) {
                                const char = line[i];
                                if (char === '"' || char === "'") {
                                    inQuotes = !inQuotes;
                                } else if (char === ',' && !inQuotes) {
                                    result.push(cur.trim().replace(/^["']|["']$/g, '').trim());
                                    cur = '';
                                } else {
                                    cur += char;
                                }
                            }
                            result.push(cur.trim().replace(/^["']|["']$/g, '').trim());
                            return result;
                        };

                        // First row = headers
                        const headers = parseCSVLine(lines[0]);

                        // Remaining rows = data
                        const rows = lines.slice(1).map(line => {
                            const values = parseCSVLine(line);
                            const row = {};
                            headers.forEach((header, index) => {
                                if (header) {
                                    row[header] = values[index] !== undefined ? values[index] : "";
                                }
                            });
                            return row;
                        });

                        resolve(rows);
                    }
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => {
                reject(new Error("Unable to read the file."));
            };

            reader.readAsText(file);
        });
    };


    // ==========================================
    // GENERATE WEBSITE
    // ==========================================

    const handleGenerateWebsite = async () => {

        // ------------------------------------------
        // Check whether file OR pasted JSON exists
        // ------------------------------------------

        if (
            !uploadedFile &&
            !prompt.trim()
        ) {

            setError(
                "Please upload a CSV/JSON file or paste JSON data."
            );

            return;
        }


        try {

            // Start progress
            setLoading(true);
            setProgress(0);
            setPhaseIndex(0);
            setError("");


            let uploadedData = null;


            // ==========================================
            // OPTION 1: FILE UPLOAD
            // ==========================================

            if (uploadedFile) {

                uploadedData =
                    await readFile(
                        uploadedFile
                    );

            }


            // ==========================================
            // OPTION 2: PASTED JSON
            // ==========================================

            else {

                try {

                    uploadedData =
                        JSON.parse(
                            prompt
                        );

                } catch (error) {

                    setError(
                        "Invalid JSON. Please check your JSON format."
                    );

                    setLoading(false);

                    return;
                }

            }


            console.log(
                "Parsed uploaded data:",
                uploadedData
            );


            // ==========================================
            // SEND DATA TO BACKEND
            // ==========================================

            const result =
                await axios.post(
                    `${serverUrl}/api/website/generate`,
                    {
                        prompt:
                            prompt.trim() || `Create a professional ${pageType} with the uploaded data.`,
                        pageType: pageType,
                        uploadedData
                    },
                    {
                        withCredentials:
                            true,
                        timeout:
                            600000
                    }
                );


            console.log(
                "Website generated:",
                result.data
            );


            // ==========================================
            // GENERATION COMPLETE
            // ==========================================

            setProgress(100);
            setPhaseIndex(PHASES.length - 1);


            // Give the user a short moment
            // to see 100%
            setTimeout(() => {

                setLoading(false);

                navigate(
                    `/editor/${result.data.website._id}`
                );

            }, 500);


        } catch (error) {

            console.error(
                "Upload generation error:",
                error
            );


            setLoading(false);
            setProgress(0);


            setError(

                error.response?.data?.message ||

                error.message ||

                "Something went wrong while generating the website."

            );

        }

    };


    // ==========================================
    // PROGRESS ANIMATION
    // ==========================================

    useEffect(() => {

        if (!loading) {
            return;
        }


        let value = 0;


        const interval =
            setInterval(() => {


                const increment =

                    value < 20

                        ? Math.random() * 1.5

                        : value < 60

                            ? Math.random() * 1.2

                            : Math.random() * 0.6;


                value += increment;


                // Do not reach 100%
                // until backend actually finishes
                if (value >= 93) {

                    value = 93;

                }


                const phase =
                    Math.min(

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
    // UI
    // ==========================================

    return (

        <div className="min-h-screen bg-linear-to-br from-[#050505] via-[#0b0b0b] to-[#050505] text-white">


            {/* ==================================
                HEADER
            ================================== */}

            <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10">

                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">


                    <button

                        className="p-2 rounded-lg hover:bg-white/10 transition"

                        onClick={() =>
                            navigate("/generate")
                        }

                    >

                        <ArrowLeft size={18} />

                    </button>


                    <h1 className="ml-4 text-lg font-semibold">

                        Genweb

                        <span className="text-zinc-400">
                            .ai
                        </span>

                    </h1>

                </div>

            </div>


            {/* ==================================
                MAIN
            ================================== */}

            <div className="max-w-3xl mx-auto px-6 py-20">

                <div className="text-center">


                    {/* ==================================
                        TITLE
                    ================================== */}

                    <h1 className="text-4xl font-bold mb-4">

                        Upload Your Data

                    </h1>


                    <p className="text-zinc-400 mb-6">
                        Upload a CSV or JSON file or paste
                        JSON data to generate a custom digital experience with AI.
                    </p>



                    {/* ==================================
                        UPLOAD BOX
                    ================================== */}

                    <label

                        htmlFor="dataFile"

                        className="block cursor-pointer rounded-3xl border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 transition p-16"

                    >

                        <UploadIcon

                            size={48}

                            className="mx-auto mb-5 text-zinc-400"

                        />


                        <h2 className="text-xl font-semibold mb-2">

                            Upload CSV or JSON

                        </h2>


                        <p className="text-sm text-zinc-500">

                            Click here to select your file

                        </p>


                        <p className="text-xs text-zinc-600 mt-3">

                            Supported files: .csv, .json

                        </p>

                    </label>


                    <input

                        id="dataFile"

                        type="file"

                        accept=".csv,.json"

                        className="hidden"

                        onChange={handleFileChange}

                    />


                    {/* ==================================
                        OR
                    ================================== */}

                    <div className="flex items-center gap-4 my-8">

                        <div className="h-px flex-1 bg-white/10" />

                        <span className="text-zinc-500 text-sm">

                            OR

                        </span>

                        <div className="h-px flex-1 bg-white/10" />

                    </div>


                    {/* ==================================
                        PASTE JSON
                    ================================== */}

                    <div className="text-left">

                        <h2 className="text-xl font-semibold mb-3">

                            Paste JSON data

                        </h2>


                        <textarea

                            value={prompt}

                            onChange={(e) =>
                                setPrompt(
                                    e.target.value
                                )
                            }

                            placeholder={`Paste your JSON data here...

Example:

[
  {
    "name": "Wireless Headphones",
    "price": 2999,
    "category": "Electronics"
  },
  {
    "name": "Smart Watch",
    "price": 4999,
    "category": "Wearables"
  }
]`}

                            className="w-full h-64 p-5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 resize-none outline-none focus:border-white/30"

                        />

                    </div>


                    {/* ==================================
                        ERROR
                    ================================== */}

                    {error && (

                        <p className="mt-5 text-sm text-red-400">

                            {error}

                        </p>

                    )}


                    {/* ==================================
                        SELECTED FILE
                    ================================== */}

                    {uploadedFile && (

                        <div className="mt-6 p-5 rounded-xl bg-white/5 border border-white/10">

                            <p className="text-sm text-zinc-400">

                                Selected file

                            </p>


                            <p className="mt-1 font-semibold">

                                {uploadedFile.name}

                            </p>

                        </div>

                    )}


                    {/* ==================================
                        GENERATE BUTTON
                    ================================== */}

                    {(uploadedFile || prompt.trim()) && (

                        <>

                            <button

                                onClick={
                                    handleGenerateWebsite
                                }

                                disabled={loading}

                                className={`mt-8 px-10 py-4 rounded-xl font-semibold text-lg transition ${loading
                                        ? "bg-white/20 text-zinc-400 cursor-not-allowed"
                                        : "bg-white text-black hover:scale-105"
                                    }`}

                            >

                                {loading

                                    ? "Generating Website..."

                                    : "Generate Website"

                                }

                            </button>


                            {/* ==================================
                                PROGRESS BAR
                            ================================== */}

                            {loading && (

                                <div className="w-full max-w-md mx-auto mt-6">


                                    {/* PROGRESS TEXT */}

                                    <div className="flex justify-between text-sm text-white mb-2">

                                        <span>

                                            {PHASES[phaseIndex]}

                                        </span>


                                        <span>

                                            {progress}%

                                        </span>

                                    </div>


                                    {/* PROGRESS TRACK */}

                                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">


                                        {/* PROGRESS */}

                                        <div

                                            className="h-full bg-white rounded-full transition-all duration-500"

                                            style={{
                                                width: `${progress}%`
                                            }}

                                        />

                                    </div>

                                </div>

                            )}

                        </>

                    )}

                </div>

            </div>

        </div>

    );

}

export default Upload;