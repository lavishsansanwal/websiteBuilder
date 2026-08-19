const huggingFaceUrl =
    "https://router.huggingface.co/v1/chat/completions";
    const model ="Qwen/Qwen3-Coder-30B-A3B-Instruct";

export const generateHuggingFaceResponse = async (prompt) => {
    try {
        console.log("========== HUGGING FACE START ==========");

        console.log("HF token exists:",
            !!process.env.HF_TOKEN
        );

        console.log("HF model:", model);

        const response = await fetch(
            huggingFaceUrl,
            {
                method: "POST",

                headers: {
                    Authorization:
                        `Bearer ${process.env.HF_TOKEN}`,

                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify({

                    model: model,

                    messages: [

                        {
                            role: "system",

                            content:
                                "Return ONLY valid raw JSON. Do not use markdown code fences."
                        },

                        {
                            role: "user",

                            content: prompt
                        }

                    ],

                    temperature: 0.2,

                    max_tokens: 16000,

                    reasoning_effort: "none"

                })
            }
        );


        // Get response as text first
        const responseText =
            await response.text();


        console.log(
            "Hugging Face HTTP status:",
            response.status
        );


        console.log(
            "Hugging Face raw response:",
            responseText
        );


        // Check HTTP error
        if (!response.ok) {

            throw new Error(
                `Hugging Face error ${response.status}: ${responseText}`
            );

        }


        // Parse JSON
        let data;

        try {

            data =
                JSON.parse(responseText);

        } catch (error) {

            throw new Error(
                "Hugging Face returned invalid JSON: " +
                responseText
            );

        }


        // Extract content
        const content =
            data.choices?.[0]?.message?.content;


        if (!content) {

            console.error(
                "Invalid Hugging Face response:",
                JSON.stringify(
                    data,
                    null,
                    2
                )
            );

            throw new Error(
                "Hugging Face returned no message content"
            );

        }


        console.log(
            "Hugging Face generation successful"
        );

        console.log(
            "========== HUGGING FACE END =========="
        );


        return content;


    } catch (error) {

        console.error(
            "HUGGING FACE ERROR:",
            error
        );

        throw error;

    }
};