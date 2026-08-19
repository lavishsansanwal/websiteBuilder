import { generateResponse } from "../config/openRouter.js";
import { generateHuggingFaceResponse } from "../config/huggingFace.js";
import { generateGeminiResponse } from "../config/gemini.js";
import { generateCerebrasResponse } from "../config/cerebras.js";
import { generateOllamaResponse } from "../config/ollama.js";

import User from "../models/user.model.js";
import Website from "../models/website.model.js";
import extractJson from "../utils/extractJson.js";



/*
==================================================
MASTER PROMPT
==================================================
*/

const masterPrompt = `
You are a Principal Frontend Architect and Senior UI/UX Engineer.

Generate a complete, production-quality, modern and visually attractive website based on the user's request.

==================================================
1. CORE REQUIREMENTS
==================================================

- Use ONLY HTML, CSS and vanilla JavaScript.
- Return one complete standalone HTML document.
- CSS must be inside <style>.
- JavaScript must be inside <script>.
- No React, Vue, Angular, Tailwind, Bootstrap or other frameworks.
- Make the UI modern, premium, professional and visually consistent.
- Use appropriate typography, spacing, cards, buttons, shadows, gradients and subtle animations.
- Choose a suitable light/dark theme unless the user specifies one.
- Do not create unnecessary empty space or placeholder content.

==================================================
2. RESPONSIVE DESIGN
==================================================

The website MUST work correctly on:

- Desktop
- Laptop
- Tablet
- Mobile

Ensure:

- Responsive layouts and images.
- Readable text.
- Accessible buttons.
- No horizontal scrolling.
- Working mobile navigation/menu.
- Proper CSS media queries.

==================================================
3. NAVIGATION
==================================================

ALL navigation must work.

Every navigation item must have its own meaningful destination.

For a single-page website, use unique section IDs and smooth scrolling.

Example:

Home → #home
Restaurants → #restaurants
Menu → #menu
About → #about
Contact → #contact

Rules:

- Never use href="#".
- Never use fake/dead links.
- Never make unrelated links point to the same section.
- Home, About, Contact, Menu, Products, Services, Pricing, etc. must show their correct content.
- Users must be able to move freely between ALL sections.
- The logo/brand should return to Home.
- Mobile navigation must contain all important links and close after selection.
- Do not create isolated views that trap the user.
- If separate views are genuinely required, implement working JavaScript navigation and provide access to all other views.

==================================================
4. CONTENT
==================================================

Understand the user's request and generate content appropriate to it.

Examples:

Food delivery:
- Restaurants
- Food categories
- Menu items
- Prices
- Search/filter
- Delivery information

Ecommerce:
- Products
- Categories
- Prices
- Search/filter
- Cart
- Checkout

Portfolio:
- Projects
- Skills
- Experience
- Contact

SaaS:
- Hero
- Features
- Pricing
- Testimonials
- CTA

Use realistic content relevant to the requested business.

==================================================
5. IMAGES
==================================================

Use images relevant to the actual content.

For repeated items, use different appropriate images.

Never use the same image for unrelated products/items.

Use responsive images with meaningful alt text and object-fit.

If real image URLs are provided by the backend, use those exact URLs and match each image to its corresponding item.

Do NOT invent provided image URLs.

==================================================
6. DYNAMIC CONTENT
==================================================

Use JavaScript arrays/objects for repeated content such as:

- Products
- Food
- Restaurants
- Services
- Reviews
- Users
- Statistics
- Portfolio projects
- Blog posts

Render repeated elements dynamically where practical.

==================================================
7. FUNCTIONALITY
==================================================

Every important interactive element MUST work.

Implement functionality requested by the user, including when applicable:

- Navigation
- Mobile menu
- Search
- Filtering
- Sorting
- Tabs
- FAQ accordion
- Modals
- Forms and validation
- Newsletter
- Login/signup UI
- Booking
- Wishlist
- Add to Cart
- Remove from Cart
- Quantity controls
- Cart count
- Subtotal
- Tax/shipping/delivery
- Final total
- Checkout UI

Never create buttons that only look functional.

==================================================
8. CART / SHOPPING
==================================================

For ecommerce, food delivery or shopping websites, create a functional cart.

Support:

- Add/remove items
- Increase/decrease quantity
- Cart count
- Automatic calculations
- Empty-cart state
- Cart sidebar/modal
- Checkout UI

Use localStorage when appropriate.

==================================================
9. SEARCH / FILTER
==================================================

For products, food, restaurants or searchable content:

- Add working search.
- Add relevant category filters.
- Add sorting when useful.
- Update results dynamically without page reload.

==================================================
10. FORMS
==================================================

Forms must contain appropriate fields, labels, validation and success/error feedback.

Contact forms should normally include:

- Name
- Email
- Message

Checkout/booking forms should contain relevant information.

==================================================
11. ACCESSIBILITY & UX
==================================================

- Use semantic HTML.
- Maintain proper heading hierarchy.
- Add image alt text.
- Use readable contrast.
- Make controls easy to use.
- Ensure keyboard/mobile usability.
- Use clear hover/focus states.
- Use subtle animations and transitions without excessive effects.

==================================================
12. CURRENT YEAR
==================================================

Use the current year dynamically:

document.getElementById("year").textContent = new Date().getFullYear();

Do not hard-code an outdated copyright year.

==================================================
13. PAGE TYPE
==================================================

PAGE TYPE will be supplied separately.

If LANDING PAGE:

- Focus on one conversion goal.
- Strong hero.
- Clear CTA.
- Benefits/features.
- Social proof when appropriate.
- Relevant supporting sections.
- Conversion-focused layout.

If FULL WEBSITE:

- Create a complete website experience.
- Include appropriate navigation and meaningful sections.
- Include relevant About, Contact, Services, Menu, Products, Pricing, etc.
- Ensure every navigation destination works.

==================================================
14. UPLOADED DATA
==================================================

If uploaded data is provided:

- Use it as the actual website content.
- Do not replace it with unrelated dummy data.
- Do not invent information already present in the data.
- Use its fields intelligently.
- Create suitable cards, tables, dashboards, charts or other UI.
- Preserve the actual values.

==================================================
15. IMAGE QUERIES
==================================================

If images are required, return unique and specific search queries in
"imageQueries".

Example:

"margherita pizza"
"crispy chicken burger"
"alfredo pasta"
"chicken biryani"

Rules:

- Each different item should have its own query.
- Use specific queries.
- Do not invent image URLs.
- Do not reuse the same query for unrelated items.
- The backend may provide real image URLs.

==================================================
16. QUALITY CHECK
==================================================

Before returning the result, verify:

- Complete HTML exists.
- CSS exists.
- JavaScript exists.
- Navigation works.
- Every navigation item reaches the correct destination.
- Users can move between all sections.
- Logo returns Home.
- Mobile menu works.
- Requested features work.
- Search/filter works when requested.
- Cart works when requested.
- Forms work when requested.
- Images match their content.
- Website is responsive.
- No fake/empty buttons.
- No broken links.
- Current year is dynamic.
- Website matches the user's request.

==================================================
17. USER REQUEST
==================================================

USER REQUEST:

{USER_PROMPT}

==================================================
18. OUTPUT
==================================================

Return ONLY valid raw JSON.

Return exactly:

{
    "message": "Short description of the generated website",
    "imageQueries": [
        "specific image query 1",
        "specific image query 2"
    ],
    "code": "<COMPLETE HTML DOCUMENT>"
}

Rules:

- No Markdown.
- No code fences.
- No explanations outside JSON.
- No extra text.
- "code" must contain the COMPLETE HTML document.
- HTML must start with <!DOCTYPE html>.
- Include <html>, <head>, <body>, <style> and <script>.
- Do not return partial HTML.
- Do not omit CSS or JavaScript.
- Return ONLY the JSON object.
`;

const generateAIResponse = async (prompt) => {

    const provider =
        process.env.AI_PROVIDER?.toLowerCase() || "openrouter";

    console.log("========================================");
    console.log("AI PROVIDER:", provider);
    console.log("========================================");

    // OLLAMA
    if (provider === "ollama") {

        console.log(
            "Using Ollama / Qwen2.5-Coder 3B"
        );

        return await generateOllamaResponse(prompt);
    }

    // CEREBRAS
    if (provider === "cerebras") {

        console.log("Using Cerebras");

        return await generateCerebrasResponse(prompt);
    }

    // GEMINI
    if (provider === "gemini") {

        console.log("Using Google Gemini");

        return await generateGeminiResponse(prompt);
    }

    // HUGGING FACE
    if (provider === "huggingface") {

        console.log(
            "Using Hugging Face / Qwen3-Coder"
        );

        return await generateHuggingFaceResponse(prompt);
    }

    // OPENROUTER
    console.log(
        "Using OpenRouter / openrouter/free"
    );

    return await generateResponse(prompt);
};
/*
==================================================
GENERATE WEBSITE
==================================================
*/

export const generateWebsite = async (req, res) => {

    try {

        const totalStart = Date.now();

        console.log(
            "========== WEBSITE GENERATION START =========="
        );

        console.log("req.user:", req.user);

        const {
            prompt,
            pageType = "website",
            uploadedData = null
        } = req.body;


        /*
        ------------------------------------------
        1. Check prompt / uploaded data
        ------------------------------------------
        */

        if (!prompt && !uploadedData) {

            return res.status(400).json({
                message: "prompt or uploaded data is required"
            });

        }


        /*
        ------------------------------------------
        2. Find user
        ------------------------------------------
        */

        const userStart = Date.now();

        const user = await User.findById(
            req.user._id
        );

        console.log(
            "1. Find user:",
            Date.now() - userStart,
            "ms"
        );


        if (!user) {

            return res.status(400).json({
                message: "user not found"
            });

        }


        /*
        ------------------------------------------
        3. Check credits
        ------------------------------------------
        */

        if (user.credits < 50) {

            return res.status(400).json({
                message:
                    "you have not enough credits to generate a website"
            });

        }


        /*
        ------------------------------------------
        4. Uploaded data instruction
        ------------------------------------------
        */

        const promptStart = Date.now();

        const uploadedDataInstruction = uploadedData
            ? `

USER UPLOADED DATA:

${JSON.stringify(uploadedData, null, 2)}

IMPORTANT RULES FOR UPLOADED DATA:

- Use the uploaded data as the actual content of the website.
- Do not invent products, users, services, prices, or other data when the uploaded data already provides them.
- Create appropriate UI components based on the structure of the uploaded data.
- Display the uploaded data in a visually attractive and responsive way.
- If the data contains products, create product cards or an appropriate ecommerce layout.
- If the data contains users, create an appropriate user/customer interface.
- If the data contains statistics, create dashboards, cards, tables, or charts where appropriate.
- Use the field names from the uploaded data intelligently.
`
            : "";


        /*
        ------------------------------------------
        5. Create final prompt
        ------------------------------------------
        */

        const finalPrompt =
            masterPrompt.replace(
                "{USER_PROMPT}",
                prompt ||
                "Create a modern website based on the uploaded data."
            ) +
            `

==================================================
SELECTED PAGE TYPE
==================================================

${pageType === "landing"
    ? "LANDING PAGE"
    : "FULL WEBSITE"}

IMPORTANT:
Generate the website according to the selected PAGE TYPE.

${uploadedDataInstruction}
`;


        console.log(
            "UPLOADED DATA:",
            uploadedData
        );

        console.log(
            "AI PAGE TYPE:",
            pageType
        );

        console.log(
            "AI PROMPT PAGE TYPE:",
            pageType === "landing"
                ? "LANDING PAGE"
                : "FULL WEBSITE"
        );

        console.log(
            "2. Create final prompt:",
            Date.now() - promptStart,
            "ms"
        );


    /*
------------------------------------------
4. AI GENERATION + UNSPLASH IMAGES
------------------------------------------
*/

let raw = "";
let parsed = null;


/*
------------------------------------------
FIRST AI CALL
Generate image queries + initial website
------------------------------------------
*/

for (let i = 0; i < 2 && !parsed; i++) {

    console.log(
        `AI attempt ${i + 1} started`
    );

    const aiStart = Date.now();

    raw = await generateAIResponse(
        finalPrompt
    );

    console.log(
        `3.${i + 1}. AI response:`,
        Date.now() - aiStart,
        "ms"
    );

    const jsonStart = Date.now();

    parsed = await extractJson(raw);

    console.log(
        `4.${i + 1}. JSON extraction:`,
        Date.now() - jsonStart,
        "ms"
    );


    /*
    --------------------------------------
    Retry invalid JSON
    --------------------------------------
    */

    if (!parsed) {

        console.log(
            `AI attempt ${i + 1} returned invalid JSON. Retrying...`
        );

        const retryAiStart = Date.now();

        raw = await generateAIResponse(
            finalPrompt +
            "\n\nRETURN ONLY RAW JSON."
        );

        console.log(
            "Retry AI response:",
            Date.now() - retryAiStart,
            "ms"
        );

        const retryJsonStart = Date.now();

        parsed = await extractJson(raw);

        console.log(
            "Retry JSON extraction:",
            Date.now() - retryJsonStart,
            "ms"
        );
    }
}


/*
------------------------------------------
CHECK FIRST AI RESPONSE
------------------------------------------
*/

if (!parsed) {

    return res.status(500).json({

        message:
            "AI failed to generate website structure"

    });

}


/*
------------------------------------------
GET IMAGE QUERIES
------------------------------------------
*/

const imageQueries =
    Array.isArray(parsed.imageQueries)
        ? parsed.imageQueries
        : [];


console.log(
    "IMAGE QUERIES FROM AI:",
    imageQueries
);


/*
------------------------------------------
SEARCH UNSPLASH
------------------------------------------
*/

let websiteImages = [];

if (imageQueries.length > 0) {

    console.log(
        "Searching Unsplash..."
    );

    const imageStart =
        Date.now();

    websiteImages =
        await getWebsiteImages(
            imageQueries
        );

    console.log(
        "Unsplash search time:",
        Date.now() - imageStart,
        "ms"
    );

    console.log(
        "UNSPLASH IMAGES:",
        websiteImages
    );
}


/*
------------------------------------------
CREATE IMAGE INSTRUCTIONS
------------------------------------------
*/

const imageInstructions =
    websiteImages.length > 0
        ? `

REAL UNSPLASH IMAGES:

${JSON.stringify(
    websiteImages,
    null,
    2
)}

IMPORTANT IMAGE RULES:

- Use the provided Unsplash image URLs.
- Do NOT invent image URLs.
- Do NOT replace the provided URLs with other URLs.
- Each item must use the image corresponding to its query.
- Do NOT use the same image for different items.
- Match each image to the correct product/food/item.
- Use the "image" value as the actual image URL.
- Keep the provided image URLs unchanged.

`
        : `

NO UNSPLASH IMAGES WERE FOUND.

If no image is provided, use a safe relevant placeholder
rather than inventing an Unsplash URL.

`;


/*
------------------------------------------
SECOND AI CALL
Generate FINAL HTML
------------------------------------------
*/

const finalHtmlPrompt = `

${masterPrompt.replace(
    "{USER_PROMPT}",
    prompt ||
    "Create a modern website based on the uploaded data."
)}

PAGE TYPE:
${pageType === "landing"
    ? "LANDING PAGE"
    : "FULL WEBSITE"}

IMPORTANT:
Generate the final website according to the selected PAGE TYPE.

${uploadedDataInstruction}

${imageInstructions}

The final response MUST contain:

{
    "message": "Short description of the generated website",
    "code": "<COMPLETE HTML DOCUMENT>"
}

IMPORTANT:

- Return the COMPLETE HTML.
- Use the provided Unsplash images.
- Do not return imageQueries in the final response.
- Do not return markdown.
- Do not return code fences.
- Return ONLY valid JSON.
`;


console.log(
    "Generating final HTML with real images..."
);


let finalRaw = "";
let finalParsed = null;


for (
    let i = 0;
    i < 2 && !finalParsed;
    i++
) {

    console.log(
        `FINAL AI attempt ${i + 1} started`
    );

    const finalAiStart =
        Date.now();

    finalRaw =
        await generateAIResponse(
            finalHtmlPrompt
        );

    console.log(
        `FINAL AI response time:`,
        Date.now() -
        finalAiStart,
        "ms"
    );


    finalParsed =
        await extractJson(
            finalRaw
        );


    /*
    --------------------------------------
    Retry final HTML
    --------------------------------------
    */

    if (!finalParsed) {

        console.log(
            "Final AI returned invalid JSON. Retrying..."
        );

        finalRaw =
            await generateAIResponse(
                finalHtmlPrompt +
                "\n\nRETURN ONLY RAW JSON."
            );

        finalParsed =
            await extractJson(
                finalRaw
            );
    }
}


/*
------------------------------------------
USE FINAL AI RESPONSE
------------------------------------------
*/

if (finalParsed) {

    parsed = finalParsed;

    raw = finalRaw;

}


console.log(
    "FINAL WEBSITE GENERATED SUCCESSFULLY"
);


        /*
        ------------------------------------------
        7. Validate / fallback
        ------------------------------------------
        */

        if (!parsed || !parsed.code) {

            console.log(
                "AI response invalid. Using fallback."
            );

            parsed = {

                message: "fallback",

                code:
                    raw.includes("<html")
                        ? raw
                        : `<html>
                            <body>
                                ${raw}
                            </body>
                           </html>`

            };

        }


        /*
        ------------------------------------------
        8. Create website title
        ------------------------------------------
        */

        const websiteTitle =
            prompt
                ? prompt.slice(0, 60)
                : uploadedData
                    ? "Website from Uploaded Data"
                    : "Untitled Website";


        /*
        ------------------------------------------
        9. Save website
        ------------------------------------------
        */

        const websiteDbStart =
            Date.now();

        const website =
            await Website.create({

                user: user._id,

                title: websiteTitle,

                latestCode: parsed.code,

                conversation: [

                    {
                        role: "user",
                        content:
                            prompt ||
                            "Website generated from uploaded data."
                    },

                    {
                        role: "ai",
                        content:
                            parsed.message || ""
                    }

                ]

            });


        console.log(
            "5. Website MongoDB save:",
            Date.now() -
            websiteDbStart,
            "ms"
        );


        /*
        ------------------------------------------
        10. Update credits
        ------------------------------------------
        */

        const creditDbStart =
            Date.now();

        user.credits =
            user.credits - 50;

        await user.save();

        console.log(
            "6. Credit MongoDB update:",
            Date.now() -
            creditDbStart,
            "ms"
        );


        /*
        ------------------------------------------
        11. Total time
        ------------------------------------------
        */

        console.log(
            "TOTAL WEBSITE CREATION TIME:",
            Date.now() -
            totalStart,
            "ms"
        );

        console.log(
            "========== WEBSITE GENERATION END =========="
        );


        /*
        ------------------------------------------
        12. Response
        ------------------------------------------
        */

        return res.status(201).json({

            status: "success",

            website

        });


    } catch (error) {

        console.error(
            "GENERATE WEBSITE ERROR:",
            error
        );

        return res.status(500).json({

            message:
                `generate website error ${error.message}`

        });

    }

};


/*
==================================================
GET WEBSITE BY ID
==================================================
*/

export const getWebsiteById = async (
    req,
    res
) => {

    try {

        const website =
            await Website.findOne({

                _id: req.params.id,

                user: req.user._id

            });


        if (!website) {

            return res.status(400).json({

                message:
                    "website not found"

            });

        }


        return res.status(200).json(
            website
        );


    } catch (error) {

        return res.status(500).json({

            message:
                `get website by id error ${error.message}`

        });

    }

};


/*
==================================================
UPDATE / CHANGE WEBSITE
==================================================
*/

export const changes = async (
    req,
    res
) => {

    try {

        const { prompt } = req.body;


        /*
        ------------------------------------------
        1. Check prompt
        ------------------------------------------
        */

        if (!prompt) {

            return res.status(400).json({

                message:
                    "prompt is required"

            });

        }


        /*
        ------------------------------------------
        2. Find website
        ------------------------------------------
        */

        const website =
            await Website.findOne({

                _id: req.params.id,

                user: req.user._id

            });


        if (!website) {

            return res.status(400).json({

                message:
                    "website not found"

            });

        }


        /*
        ------------------------------------------
        3. Find user
        ------------------------------------------
        */

        const user =
            await User.findById(
                req.user._id
            );


        if (!user) {

            return res.status(400).json({

                message:
                    "user not found"

            });

        }


        /*
        ------------------------------------------
        4. Check credits
        ------------------------------------------
        */

        if (user.credits < 25) {

            return res.status(400).json({

                message:
                    "you have not enough credits to update the website"

            });

        }


        /*
        ------------------------------------------
        5. Create update prompt
        ------------------------------------------
        */

        const updatePrompt = `
UPDATE THIS HTML WEBSITE.

CURRENT WEBSITE CODE:

${website.latestCode}

USER REQUEST:

${prompt}

IMPORTANT RULES:

- Preserve existing functionality.
- Preserve existing navigation.
- Preserve existing pages and sections.
- Preserve existing design unless the user requests a design change.
- Only make changes required by the user.
- Keep the website fully responsive.
- Use only HTML, CSS and JavaScript.
- Make sure all existing buttons continue to work.
- Make sure all existing navigation links continue to work.
- Do not remove working features.
- Return the COMPLETE UPDATED HTML.
- Do not return partial code.

RETURN RAW JSON ONLY:

{
    "message": "Short confirmation",
    "code": "<COMPLETE UPDATED HTML>"
}
`;


        /*
        ------------------------------------------
        6. Generate AI response
        ------------------------------------------
        */

        let raw = "";
        let parsed = null;


        for (
            let i = 0;
            i < 2 && !parsed;
            i++
        ) {

            console.log(
                `UPDATE AI attempt ${i + 1} started`
            );


            const aiStart =
                Date.now();


            raw =
                await generateAIResponse(
                    updatePrompt
                );


            console.log(
                "UPDATE AI response time:",
                Date.now() -
                aiStart,
                "ms"
            );


            /*
            --------------------------------------
            Extract JSON
            --------------------------------------
            */

            parsed =
                await extractJson(
                    raw
                );


            /*
            --------------------------------------
            Retry
            --------------------------------------
            */

            if (!parsed) {

                console.log(
                    "Invalid JSON. Retrying..."
                );


                raw =
                    await generateAIResponse(
                        updatePrompt +
                        "\n\nRETURN ONLY RAW VALID JSON."
                    );


                parsed =
                    await extractJson(
                        raw
                    );

            }

        }


        /*
        ------------------------------------------
        7. Validate AI response
        ------------------------------------------
        */

        if (
            !parsed ||
            !parsed.code
        ) {

            console.log(
                "AI returned invalid response:",
                raw
            );

            return res.status(400).json({

                message:
                    "AI returned invalid response"

            });

        }


        /*
        ------------------------------------------
        8. Save conversation
        ------------------------------------------
        */

        website.conversation.push(

            {
                role: "user",
                content: prompt
            },

            {
                role: "ai",
                content:
                    parsed.message || ""
            }

        );


        /*
        ------------------------------------------
        9. Update website code
        ------------------------------------------
        */

        website.latestCode =
            parsed.code;

        await website.save();


        /*
        ------------------------------------------
        10. Deduct credits
        ------------------------------------------
        */

        user.credits =
            user.credits - 25;

        await user.save();


        /*
        ------------------------------------------
        11. Response
        ------------------------------------------
        */

        return res.status(200).json({

            message:
                parsed.message || "",

            code:
                parsed.code,

            remainingCredits:
                user.credits

        });


    } catch (error) {

        console.error(
            "UPDATE WEBSITE ERROR:",
            error
        );

        return res.status(500).json({

            message:
                `update website error ${error.message}`

        });

    }

};


/*
==================================================
GET ALL WEBSITES
==================================================
*/

export const getAll = async (
    req,
    res
) => {

    try {

        const websites =
            await Website.find({

                user: req.user._id

            })
            .sort({
                createdAt: -1
            });


        return res.status(200).json(
            websites
        );


    } catch (error) {

        return res.status(500).json({

            message:
                `get all websites error ${error.message}`

        });

    }

};


/*
==================================================
DEPLOY WEBSITE
==================================================
*/

export const deploy = async (
    req,
    res
) => {

    try {

        const website =
            await Website.findOne({

                _id: req.params.id,

                user: req.user._id

            });


        if (!website) {

            return res.status(400).json({

                message:
                    "website not found"

            });

        }


        /*
        ------------------------------------------
        Create slug
        ------------------------------------------
        */

        if (!website.slug) {

            website.slug =
                website.title
                    .toLowerCase()
                    .replace(
                        /[^a-z0-9]/g,
                        ""
                    )
                    .slice(0, 60) +
                website._id
                    .toString()
                    .slice(-5);

        }


        website.deployed = true;

        website.deployUrl =
            `${process.env.FRONTEND_URL}/site/${website.slug}`;


        await website.save();


        return res.status(200).json({

            url:
                website.deployUrl

        });


    } catch (error) {

        return res.status(500).json({

            message:
                `deploy website error ${error.message}`

        });

    }

};


/*
==================================================
GET WEBSITE BY SLUG
==================================================
*/

export const getBySlug = async (
    req,
    res
) => {

    try {

        const website =
            await Website.findOne({

                slug: req.params.slug

            });


        if (!website) {

            return res.status(400).json({

                message:
                    "website not found"

            });

        }


        return res.status(200).json(
            website
        );


    } catch (error) {

        return res.status(500).json({

            message:
                `get by slug website error ${error.message}`

        });

    }

};