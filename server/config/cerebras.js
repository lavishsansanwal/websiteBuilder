import "dotenv/config";
import OpenAI from "openai";

const getCerebrasClient = () => {
    return new OpenAI({
        apiKey: process.env.CEREBRAS_API_KEY || "dummy",
        baseURL: "https://api.cerebras.ai/v1"
    });
};

export const generateCerebrasResponse = async (prompt) => {

    try {

        console.log("Using Cerebras");

        if (!process.env.CEREBRAS_API_KEY) {
            throw new Error(
                "CEREBRAS_API_KEY is missing from .env"
            );
        }

        const client = getCerebrasClient();
        const response = await client.chat.completions.create({

            model: "gpt-oss-120b",

            messages: [
                {
                    role: "system",
                    content: `You are an elite Principal UI/UX Architect and Lead Frontend Engineer.
Your task is to generate a COMPLETE, visually breathtaking, production-ready, fully responsive standalone HTML document with modern Tailwind CSS, Lucide icons, and interactive JavaScript.
Always return ONLY a valid raw JSON object without markdown fences:
{
  "code": "<!DOCTYPE html>...",
  "message": "Summary of generated product",
  "imageQueries": []
}
Never use placeholder comments, never cut corners, and make sure all forms, modals, drawers, tabs, and interactive elements are fully styled and working.`
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.2,
            max_tokens: 24000

        });

        const text =
            response.choices?.[0]?.message?.content;

        if (!text) {
            throw new Error(
                "Cerebras returned an empty response"
            );
        }

        return text;

    } catch (error) {

        console.error(
            "Cerebras API Error:",
            error.message
        );

        throw error;
    }
};