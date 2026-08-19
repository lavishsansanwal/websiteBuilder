const openRouterUrl =
    "https://openrouter.ai/api/v1/chat/completions";

const model = "nvidia/nemotron-3-ultra-550b-a55b:free"

export const generateResponse = async (prompt) => {
    try {
        const res = await fetch(openRouterUrl, {
            method: "POST",

            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                model,

                messages: [
                    {
                        role: "system",
                        content:
                            "Return ONLY valid raw JSON. Do not use markdown code fences.",
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ],

                temperature: 0.2,

                // Increased from 8000
                max_tokens: 24000,

                // Prevent unnecessary reasoning tokens
                reasoning: {
                    effort: "none",
                },
            }),
        });

        // Handle HTTP errors
        if (!res.ok) {
            const err = await res.text();

            console.error("OpenRouter HTTP error:", err);

            throw new Error(
                `OpenRouter error ${res.status}: ${err}`
            );
        }

        const data = await res.json();

        // Log complete response for debugging
        console.log(
            "OpenRouter response:",
            JSON.stringify(data, null, 2)
        );

        const choice = data.choices?.[0];

        // Check whether OpenRouter stopped because max_tokens was reached
        if (choice?.finish_reason === "length") {
            console.error(
                "OpenRouter response was cut off because max_tokens was reached."
            );

            throw new Error(
                "AI response was too long and was cut off. Increase max_tokens or reduce the prompt/output size."
            );
        }

        // Check for missing content
        const content = choice?.message?.content;

        if (!content) {
            console.error(
                "Invalid OpenRouter response:",
                JSON.stringify(data, null, 2)
            );

            throw new Error(
                data.error?.message ||
                "Invalid response from OpenRouter"
            );
        }

        return content;

    } catch (error) {
        console.error(
            "generateResponse failed:",
            error
        );

        throw error;
    }
};