import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const generateGeminiResponse = async (prompt) => {
    try {
        console.log("Using Google Gemini API");

        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is missing from server .env");
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        // Official active Google Gemini models in order of priority & high rate limits
        const modelNames = [
            "gemini-3.6-flash",
            "gemini-3.5-flash-lite",
            "gemini-3.1-pro-preview",
            "gemini-3.0-flash"
        ];
        let lastError = null;

        for (const modelName of modelNames) {
            // Attempt with retry if 503 temporary demand spike occurs
            for (let attempt = 1; attempt <= 2; attempt++) {
                try {
                    const response = await ai.models.generateContent({
                        model: modelName,
                        contents: prompt,
                        config: {
                            temperature: 0.3,
                            maxOutputTokens: 24000
                        }
                    });

                    const text = response.text;
                    if (text) {
                        return text;
                    }
                } catch (err) {
                    lastError = err;
                    const is503 = err.message && (err.message.includes("503") || err.message.includes("high demand"));
                    console.warn(`Gemini model ${modelName} (attempt ${attempt}) failed:`, err.message);

                    // If temporary 503 spike, wait 1.2s and retry once before next model
                    if (is503 && attempt === 1) {
                        await new Promise(r => setTimeout(r, 1200));
                        continue;
                    }
                    break;
                }
            }
        }

        throw lastError || new Error("Gemini returned empty response");
    } catch (error) {
        console.error("Gemini API Error:", error.message);
        throw error;
    }
};

export { generateGeminiResponse };