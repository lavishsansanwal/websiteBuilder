import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const generateGeminiResponse = async (prompt) => {

    try {

        console.log("Using Google Gemini");

        // Check whether the API key exists
        if (!process.env.GEMINI_API_KEY) {

            throw new Error(
                "GEMINI_API_KEY is missing from server .env"
            );
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        const response = await ai.models.generateContent({

            model: "gemini-3.6-flash",

            contents: prompt,

            config: {
                temperature: 0.2,
                maxOutputTokens: 24000
            }

        });

        const text = response.text;

        if (!text) {

            throw new Error(
                "Gemini returned an empty response"
            );

        }

        return text;

    } catch (error) {

        console.error(
            "Gemini API Error:",
            error.message
        );

        throw error;
    }
};

export {
    generateGeminiResponse
};