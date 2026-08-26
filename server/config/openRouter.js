import { generateGeminiResponse } from "./gemini.js";
import { generateCerebrasResponse } from "./cerebras.js";
import { generateHuggingFaceResponse } from "./huggingFace.js";

const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions";

// OpenRouter active models
const OPENROUTER_MODELS = [
    "nvidia/nemotron-3-nano-30b-a3b:free",
    "nvidia/nemotron-3.5-lightning:free",
    "google/gemma-4-31b-it:free",
    "google/gemma-4-26b-a4b-it:free",
    "openai/gpt-oss-20b:free",
    "liquid/lfm-2.5-2.6b:free"
];

async function callOpenRouter(prompt) {
    if (!process.env.OPENROUTER_API_KEY) {
        throw new Error("OPENROUTER_API_KEY is not configured in .env");
    }

    for (const model of OPENROUTER_MODELS) {
        try {
            console.log(`[OpenRouter] Attempting with model: ${model}`);

            const res = await fetch(openRouterUrl, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:5173",
                    "X-Title": "AI Website Builder"
                },
                body: JSON.stringify({
                    model,
                    messages: [
                        {
                            role: "system",
                            content: `You are an elite Lead Frontend Architect and UI/UX Designer.
Generate a COMPLETE, visually stunning, fully functional, responsive standalone HTML document with modern Tailwind CSS and interactive JavaScript.
Return ONLY valid raw JSON containing { "code": "<!DOCTYPE html>...", "message": "...", "imageQueries": [...] }.
CRITICAL: Do NOT output any thinking process, internal monologue, planning, or reasoning. Start directly with the JSON object.
Never output placeholder comments. Every section, navbar, button, modal, and interactive element must be fully implemented and working.`
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 24000
                })
            });

            if (res.ok) {
                const data = await res.json();
                const content = data.choices?.[0]?.message?.content;
                if (content && content.length > 50) {
                    console.log(`[OpenRouter] Successfully generated with ${model} (length: ${content.length})`);
                    return content;
                }
            } else {
                const errText = await res.text();
                console.warn(`[OpenRouter] ${model} HTTP ${res.status}:`, errText.slice(0, 150));
            }
        } catch (err) {
            console.warn(`[OpenRouter] ${model} failed:`, err.message);
        }
    }
    throw new Error("All OpenRouter models failed to respond");
}

export const generateResponse = async (prompt) => {
    // 1. Read desired primary provider from .env (e.g. AI_PROVIDER=huggingface, gemini, openrouter, cerebras)
    const primaryProvider = (process.env.AI_PROVIDER || "openrouter").toLowerCase().trim();

    const providerMap = {
        huggingface: {
            name: "Hugging Face",
            isConfigured: () => !!process.env.HF_TOKEN,
            fn: () => generateHuggingFaceResponse(prompt)
        },
        openrouter: {
            name: "OpenRouter",
            isConfigured: () => !!process.env.OPENROUTER_API_KEY,
            fn: () => callOpenRouter(prompt)
        },
        gemini: {
            name: "Google Gemini",
            isConfigured: () => !!process.env.GEMINI_API_KEY,
            fn: () => generateGeminiResponse(prompt)
        },
        cerebras: {
            name: "Cerebras",
            isConfigured: () => !!process.env.CEREBRAS_API_KEY,
            fn: () => generateCerebrasResponse(prompt)
        }
    };

    // Prioritize the user's primary provider first, followed by configured fallbacks
    const prioritizedOrder = [
        primaryProvider,
        ...Object.keys(providerMap).filter(p => p !== primaryProvider)
    ];

    let lastError = null;

    for (const key of prioritizedOrder) {
        const provider = providerMap[key];
        if (!provider) continue;

        if (!provider.isConfigured()) {
            console.log(`[AI Engine] Skipping ${provider.name} (API key not found in .env)`);
            continue;
        }

        try {
            console.log(`[AI Engine] Calling Provider: >>> ${provider.name.toUpperCase()} <<<`);
            const result = await provider.fn();
            if (result && result.length > 50) {
                console.log(`[AI Engine] >>> Successfully generated via ${provider.name} <<< (length: ${result.length})`);
                return result;
            }
        } catch (err) {
            console.warn(`[AI Engine] ${provider.name} failed:`, err.message);
            lastError = err;
        }
    }

    throw lastError || new Error("All configured AI providers failed to generate a response");
};