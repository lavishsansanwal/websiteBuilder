import {
    searchUnsplashImages
} from "./unsplash.js";


export const getWebsiteImages = async (
    imageQueries = []
) => {

    const results = [];

    const usedPhotoIds =
        new Set();


    for (
        const query of imageQueries
    ) {

        try {

            console.log(
                "Searching Unsplash for:",
                query
            );


            const photos =
                await searchUnsplashImages(
                    query,
                    5
                );


            /*
            Find an image that has
            not already been used.
            */

            const photo =
                photos.find(
                    photo =>
                        !usedPhotoIds.has(
                            photo.id
                        )
                );


            if (!photo) {

                console.log(
                    "No unique image found for:",
                    query
                );

                continue;
            }


            usedPhotoIds.add(
                photo.id
            );


            results.push({

                query,

                image:
                    photo.urls?.regular ||
                    photo.urls?.small ||
                    photo.urls?.full,

                photographer:
                    photo.user?.name ||
                    "Unsplash Photographer",

                photographerUrl:
                    photo.user?.links?.html ||
                    "https://unsplash.com",

                unsplashUrl:
                    photo.links?.html ||
                    "https://unsplash.com",

                photoId:
                    photo.id

            });


        } catch (error) {

            console.error(
                `Image search failed for "${query}":`,
                error
            );

        }

    }


    console.log(
        "Total unique Unsplash images:",
        results.length
    );


    return results;
};