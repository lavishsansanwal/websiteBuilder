const UNSPLASH_URL =
    "https://api.unsplash.com/search/photos";

export const searchUnsplashImages = async (
    query,
    count = 5
) => {

    try {

        if (!process.env.UNSPLASH_ACCESS_KEY) {

            console.error(
                "UNSPLASH_ACCESS_KEY is missing in .env"
            );

            return [];
        }

        const url = new URL(UNSPLASH_URL);

        url.searchParams.set(
            "query",
            query
        );

        url.searchParams.set(
            "per_page",
            Math.min(count * 3, 30)
        );

        url.searchParams.set(
            "orientation",
            "landscape"
        );

        url.searchParams.set(
            "content_filter",
            "high"
        );

        const response = await fetch(
            url.toString(),
            {
                headers: {
                    Authorization:
                        `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
                }
            }
        );

        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Unsplash API Error:",
                response.status,
                errorText
            );

            return [];
        }

        const data =
            await response.json();

        return data.results || [];

    } catch (error) {

        console.error(
            "Unsplash Search Error:",
            error
        );

        return [];
    }
};