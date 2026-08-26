import "dotenv/config";

const huggingFaceUrl = "https://router.huggingface.co/v1/chat/completions";

// Candidate models on Hugging Face Inference API
const HF_MODELS = [
    "Qwen/Qwen2.5-Coder-32B-Instruct",
    "meta-llama/Llama-3.3-70B-Instruct",
    "mistralai/Mistral-Small-24B-Instruct-2501",
    "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B"
];

export const generateHuggingFaceResponse = async (prompt) => {
    if (!process.env.HF_TOKEN) {
        throw new Error("HF_TOKEN is missing in server .env");
    }

    let lastError = null;

    for (const model of HF_MODELS) {
        try {
            console.log(`[Hugging Face] Trying model: ${model}`);

            const response = await fetch(huggingFaceUrl, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.HF_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        {
                            role: "system",
                            content: "You are an elite Frontend Architect. Return ONLY valid raw JSON without markdown code fences containing { \"code\": \"<!DOCTYPE html>...\", \"message\": \"...\", \"imageQueries\": [] }."
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: 0.2,
                    max_tokens: 16000
                })
            });

            const responseText = await response.text();

            if (!response.ok) {
                console.warn(`[Hugging Face] ${model} HTTP ${response.status}:`, responseText.slice(0, 150));
                continue;
            }

            const data = JSON.parse(responseText);
            const content = data.choices?.[0]?.message?.content;

            if (content && content.length > 50) {
                console.log(`[Hugging Face] Success with ${model}`);
                return content;
            }
        } catch (err) {
            console.warn(`[Hugging Face] ${model} error:`, err.message);
            lastError = err;
        }
    }

    throw lastError || new Error("All Hugging Face models failed to respond");
};