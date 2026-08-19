import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.CEREBRAS_API_KEY,
    baseURL: "https://api.cerebras.ai/v1"
});

export const generateCerebrasResponse = async (prompt) => {

    try {

        console.log("Using Cerebras");

        if (!process.env.CEREBRAS_API_KEY) {
            throw new Error(
                "CEREBRAS_API_KEY is missing from .env"
            );
        }

        const response = await client.chat.completions.create({

            model: "gpt-oss-120b",

            messages: [
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