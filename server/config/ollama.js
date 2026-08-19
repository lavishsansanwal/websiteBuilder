import axios from "axios";

export const generateOllamaResponse = async (prompt) => {
    try {
        const response = await axios.post(
            "http://localhost:11434/api/generate",
            {
                model: "qwen2.5-coder:3b-instruct",
                prompt: prompt,
                stream: false,
                options: {
                    temperature: 0.2,
                    num_ctx: 8192
                }
            },
            {
                timeout: 600000
            }
        );

        if (!response.data?.response) {
            throw new Error("Ollama returned an empty response");
        }

        return response.data.response;

    } catch (error) {
        console.error(
            "OLLAMA ERROR:",
            error.response?.data || error.message
        );

        throw new Error(
            `Ollama error: ${
                error.response?.data?.error ||
                error.message
            }`
        );
    }
};