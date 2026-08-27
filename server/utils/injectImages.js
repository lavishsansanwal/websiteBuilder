import { getWebsiteImages } from "../config/imageSearch.js";

// Comprehensive verified high-resolution photos categorized by exact domain (ALL TESTED [200 OK])
export const DOMAIN_IMAGE_COLLECTIONS = {
    ecommerce_audio_tech: {
        hero: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80",
        headphones_flagship: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
        headphones_overear: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
        earbuds_pro: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
        earphones_sport: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&auto=format&fit=crop&q=80",
        smartwatch_wrist: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
        smartwatch_black: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
        speakers_studio: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80",
        speaker_portable: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80",
        laptop: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80",
        smartphone: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80"
    },
    streetwear_fashion: {
        hero: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1400&auto=format&fit=crop&q=80",
        urban_hero: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&auto=format&fit=crop&q=80",
        nike_sneaker: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
        chunky_sneaker: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
        hightop_sneaker: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80",
        retro_sneaker: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80",
        sport_shoe: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80",
        hoodie: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
        tshirt: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
        jeans: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80",
        clothing_rack: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80",
        sunglasses: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80",
        perfume: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&auto=format&fit=crop&q=80"
    },
    restaurant_italian: {
        hero: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&auto=format&fit=crop&q=80",
        pizza: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80",
        pizza2: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
        burrata: "https://images.unsplash.com/photo-1580638149300-65f0b9e8fbff?w=800&auto=format&fit=crop&q=80",
        pasta: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80",
        pasta2: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=800&auto=format&fit=crop&q=80",
        steak: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
        bruschetta: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=800&auto=format&fit=crop&q=80",
        wine: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80",
        chef: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&auto=format&fit=crop&q=80",
        dessert: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop&q=80",
        ambiance: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80",
        tasting: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80"
    },
    ecommerce_tech: {
        hero: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80",
        headphones: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
        smartwatch: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
        laptop: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80",
        smartphone: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
        camera: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80"
    },
    saas_agency: {
        hero: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&auto=format&fit=crop&q=80",
        office: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80",
        team: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
        dashboard: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80"
    },
    fitness_gym: {
        hero: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80",
        workout: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
        yoga: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=80"
    },
    avatars: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80"
    ]
};

// Known tech image patterns
const TECH_IMAGE_PATTERNS = [
    /1505740420928-5e560c06d30e/i, // headphones
    /1511707171634-5f897ff02aa9/i, // phone
    /1496181133206-80ce9b88a853/i, // laptop
    /1523275335684-37898b6baf30/i, // watch
    /1546868871-7041f2a55e12/i  // smartwatch
];

/**
 * Replace broken, placeholder, or domain-mismatched image URLs in generated HTML with appropriate Unsplash photos.
 */
export async function injectRealImages(htmlCode, imageQueries = [], userPrompt = "") {
    if (typeof htmlCode !== "string" || !htmlCode) return htmlCode;

    // Isolate <script> blocks so image/CSS URL regexes NEVER modify JavaScript code
    const scriptBlocks = [];
    let processedCode = htmlCode.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, (match) => {
        const placeholder = `___SCRIPT_PROTECTED_BLOCK_${scriptBlocks.length}___`;
        scriptBlocks.push(match);
        return placeholder;
    });

    let fetchedImages = [];

    // 1. Fetch real images for imageQueries if provided
    if (Array.isArray(imageQueries) && imageQueries.length > 0) {
        try {
            fetchedImages = await getWebsiteImages(imageQueries);
        } catch (e) {
            console.error("Failed to fetch images from Unsplash API:", e.message);
        }
    }

    const queryMap = new Map();
    for (const item of fetchedImages) {
        if (item.query && item.image) {
            queryMap.set(item.query.toLowerCase().trim(), item.image);
        }
    }

    // 2. Accurate domain detection - prioritize prompt intent with word boundaries
    const promptText = (userPrompt || "").toLowerCase();
    const contentText = (htmlCode || "").toLowerCase();

    const isAudioTech = /\b(audio|headphone|headphones|earbud|earbuds|earphone|earphones|speaker|speakers|soundbar|smartwatch|watch|gadget|gadgets|tech|electronics|hardware|gear|acoustics|bluetooth|anc)\b/i.test(promptText) ||
        (/\b(audio|headphones|earbuds|speakers|smartwatch)\b/i.test(contentText) && !/\b(pizza|pasta|restaurant|menu items)\b/i.test(promptText));

    const isFashion = !isAudioTech && (/\b(streetwear|fashion|kicks|sneaker|sneakers|shoe|shoes|apparel|clothing|hoodie|hoodies|jacket|jeans|cloth|cloths|wear|dress|tshirt|tee|denim|boutique)\b/i.test(promptText));

    const isRestaurant = !isAudioTech && !isFashion && (
        /\b(restaurant|bistro|italian|pizzeria|pizza|pasta|cafe|coffee shop|diner|bakery|chef|dish|wine bar|dining|burrata|prosciutto|tasting menu|osteria|trattoria|food delivery)\b/i.test(promptText) ||
        /\b(pizza|pasta|ristorante|trattoria|antipasti)\b/i.test(contentText)
    );

    const isFitness = !isAudioTech && !isFashion && !isRestaurant && /\b(gym|fitness|workout|trainer|crossfit|yoga|sports|bodybuilding)\b/i.test(promptText);

    // Pick appropriate domain pool
    let domainPool;
    if (isAudioTech) {
        domainPool = Object.values(DOMAIN_IMAGE_COLLECTIONS.ecommerce_audio_tech);
    } else if (isRestaurant) {
        domainPool = Object.values(DOMAIN_IMAGE_COLLECTIONS.restaurant_italian);
    } else if (isFashion) {
        domainPool = Object.values(DOMAIN_IMAGE_COLLECTIONS.streetwear_fashion);
    } else if (isFitness) {
        domainPool = Object.values(DOMAIN_IMAGE_COLLECTIONS.fitness_gym);
    } else if (/\b(saas|agency|consult|startup|software|crm)\b/i.test(promptText)) {
        domainPool = Object.values(DOMAIN_IMAGE_COLLECTIONS.saas_agency);
    } else {
        domainPool = Object.values(DOMAIN_IMAGE_COLLECTIONS.ecommerce_audio_tech);
    }

    // 3. Only replace tech images with food if strictly in a verified restaurant context
    if (isRestaurant) {
        const foodRotation = Object.values(DOMAIN_IMAGE_COLLECTIONS.restaurant_italian);
        let foodIdx = 0;
        for (const techPat of TECH_IMAGE_PATTERNS) {
            const rawPatternId = techPat.source.replace(/\\/g, '');
            const globalTechRegex = new RegExp(`https://images\\.unsplash\\.com/photo-${rawPatternId}[^"'\\s\`]*`, "gi");
            processedCode = processedCode.replace(globalTechRegex, () => {
                const nextImg = foodRotation[foodIdx % foodRotation.length];
                foodIdx++;
                return nextImg;
            });
        }
    } else if (isFashion) {
        const fashionRotation = Object.values(DOMAIN_IMAGE_COLLECTIONS.streetwear_fashion);
        let fashionIdx = 0;
        for (const techPat of TECH_IMAGE_PATTERNS) {
            const rawPatternId = techPat.source.replace(/\\/g, '');
            const globalTechRegex = new RegExp(`https://images\\.unsplash\\.com/photo-${rawPatternId}[^"'\\s\`]*`, "gi");
            processedCode = processedCode.replace(globalTechRegex, () => {
                const nextImg = fashionRotation[fashionIdx % fashionRotation.length];
                fashionIdx++;
                return nextImg;
            });
        }
    }

    let poolIdx = 0;
    let avatarIdx = 0;
    let sneakerIdx = 0;
    let watchIdx = 0;
    let speakerIdx = 0;
    let headphoneIdx = 0;

    const SNEAKER_ROTATION = [
        DOMAIN_IMAGE_COLLECTIONS.streetwear_fashion.nike_sneaker,
        DOMAIN_IMAGE_COLLECTIONS.streetwear_fashion.chunky_sneaker,
        DOMAIN_IMAGE_COLLECTIONS.streetwear_fashion.hightop_sneaker,
        DOMAIN_IMAGE_COLLECTIONS.streetwear_fashion.retro_sneaker,
        DOMAIN_IMAGE_COLLECTIONS.streetwear_fashion.sport_shoe
    ];

    const WATCH_ROTATION = [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80", // Minimalist black watch
        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80", // Active fitness smartwatch on wrist
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80", // Modern digital smartwatch
        "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80"  // Sport digital tracker
    ];

    const SPEAKER_ROTATION = [
        "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80", // Studio bookshelf speakers
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80", // JBL portable speaker
        "https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&auto=format&fit=crop&q=80"  // Home acoustic smart speaker
    ];

    const HEADPHONE_ROTATION = [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80", // Flagship black ANC headphones
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80", // Over-ear studio headphones
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80", // Wireless earbuds pro
        "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&auto=format&fit=crop&q=80"  // Sport isolation earphones
    ];

    // 4. Process all <img> tags
    processedCode = processedCode.replace(/<img\s+([^>]*?)src=["']([^"']*)["']([^>]*?)>/gi, (fullMatch, beforeSrc, srcValue, afterSrc) => {
        // CRITICAL: NEVER overwrite dynamic JavaScript template literals (e.g. src="${item.image}", src="${dish.image}")
        if (srcValue.includes("${") || /\$\{[^}]+\}/.test(srcValue)) {
            return fullMatch;
        }

        const altMatch = (beforeSrc + " " + afterSrc).match(/alt=["']([^"']*)["']/i);
        const altText = altMatch ? altMatch[1].toLowerCase().trim() : "";
        const isAvatar = /avatar|user|client|customer|author|testimonial|profile|person|chef|diner/i.test(altText) || /avatar|user|profile/i.test(beforeSrc + afterSrc);

        const isMismatchedTechInFoodOrFashion = (isRestaurant || isFashion) && TECH_IMAGE_PATTERNS.some(pat => pat.test(srcValue));
        const isBroken404 = /1621996346565-e3d5d6281691/i.test(srcValue);
        const isValidHttpsImage = /^https:\/\/(images\.unsplash\.com|cdn\.|assets\.|via\.placeholder\.com|images\.pexels\.com)/i.test(srcValue.trim());

        // Check if image is a food image mistakenly placed in audio tech store
        const isFoodInAudioTech = isAudioTech && /1565299624946|1513104890138|1580638149300|1551183053|1546549032|1544025162|1572695157|1510812431|1577219491|1571877227|1555396273|1504674900/i.test(srcValue);

        if (isValidHttpsImage && !srcValue.includes("placeholder") && !srcValue.includes("example.com") && !isMismatchedTechInFoodOrFashion && !isBroken404 && !isFoodInAudioTech) {
            return fullMatch; // Keep valid domain-matched image
        }

        // Try to match from queryMap
        let matchedUrl = null;
        for (const [q, imgUrl] of queryMap.entries()) {
            if (altText.includes(q) || q.includes(altText)) {
                matchedUrl = imgUrl;
                break;
            }
        }

        // Smart match for Audio & Gadgets with dedicated rotations for zero duplicates
        if (!matchedUrl && isAudioTech) {
            if (/smartwatch|watch|chrono|pulse|fitness watch|wrist/i.test(altText)) {
                matchedUrl = WATCH_ROTATION[watchIdx % WATCH_ROTATION.length];
                watchIdx++;
            } else if (/earbud|airbud|air buds|tws|buds|pro 2/i.test(altText)) {
                matchedUrl = DOMAIN_IMAGE_COLLECTIONS.ecommerce_audio_tech.earbuds_pro;
            } else if (/sport|earphone|isolation|in-ear|hook/i.test(altText)) {
                matchedUrl = DOMAIN_IMAGE_COLLECTIONS.ecommerce_audio_tech.earphones_sport;
            } else if (/speaker|soundbar|bookshelf|subwoofer|tube|cannon|acoustic/i.test(altText)) {
                matchedUrl = SPEAKER_ROTATION[speakerIdx % SPEAKER_ROTATION.length];
                speakerIdx++;
            } else if (/headphone|over-ear|studio|anc|planar/i.test(altText)) {
                matchedUrl = HEADPHONE_ROTATION[headphoneIdx % HEADPHONE_ROTATION.length];
                headphoneIdx++;
            }
        }

        // Specific smart match for Streetwear / Fashion terms
        if (!matchedUrl && isFashion) {
            if (/chunky/i.test(altText)) {
                matchedUrl = DOMAIN_IMAGE_COLLECTIONS.streetwear_fashion.chunky_sneaker;
            } else if (/high-top|hightop|canvas/i.test(altText)) {
                matchedUrl = DOMAIN_IMAGE_COLLECTIONS.streetwear_fashion.hightop_sneaker;
            } else if (/retro|classic/i.test(altText)) {
                matchedUrl = DOMAIN_IMAGE_COLLECTIONS.streetwear_fashion.retro_sneaker;
            } else if (/sneaker|kicks|shoe|runners|trainers/i.test(altText)) {
                matchedUrl = SNEAKER_ROTATION[sneakerIdx % SNEAKER_ROTATION.length];
                sneakerIdx++;
            } else if (/jeans|denim|pants|trousers/i.test(altText)) {
                matchedUrl = DOMAIN_IMAGE_COLLECTIONS.streetwear_fashion.jeans;
            } else if (/hoodie|jacket|sweatshirt|outerwear/i.test(altText)) {
                matchedUrl = DOMAIN_IMAGE_COLLECTIONS.streetwear_fashion.hoodie;
            } else if (/t-shirt|tshirt|tee|shirt/i.test(altText)) {
                matchedUrl = DOMAIN_IMAGE_COLLECTIONS.streetwear_fashion.tshirt;
            } else if (/apparel|clothing|collection|rack/i.test(altText)) {
                matchedUrl = DOMAIN_IMAGE_COLLECTIONS.streetwear_fashion.clothing_rack;
            } else if (/sunglasses|shades/i.test(altText)) {
                matchedUrl = DOMAIN_IMAGE_COLLECTIONS.streetwear_fashion.sunglasses;
            }
        }

        // Specific smart match for Restaurant / Food terms
        if (!matchedUrl && isRestaurant) {
            if (/pasta|fettuccine|spaghetti|lasagna|ravioli|carbonara/i.test(altText)) {
                matchedUrl = DOMAIN_IMAGE_COLLECTIONS.restaurant_italian.pasta;
            } else if (/pizza|margherita|crust|slice/i.test(altText)) {
                matchedUrl = DOMAIN_IMAGE_COLLECTIONS.restaurant_italian.pizza;
            } else if (/burrata|mozzarella|cheese/i.test(altText)) {
                matchedUrl = DOMAIN_IMAGE_COLLECTIONS.restaurant_italian.burrata;
            } else if (/bruschetta|appetizer|starter|antipasto/i.test(altText)) {
                matchedUrl = DOMAIN_IMAGE_COLLECTIONS.restaurant_italian.bruschetta;
            } else if (/wine|drink|cocktail|beverage/i.test(altText)) {
                matchedUrl = DOMAIN_IMAGE_COLLECTIONS.restaurant_italian.wine;
            } else if (/tiramisu|dessert|cake|gelato|sweet/i.test(altText)) {
                matchedUrl = DOMAIN_IMAGE_COLLECTIONS.restaurant_italian.dessert;
            } else if (/steak|meat|filet|beef|fiorentina/i.test(altText)) {
                matchedUrl = DOMAIN_IMAGE_COLLECTIONS.restaurant_italian.steak;
            } else if (/chef|cook|kitchen/i.test(altText)) {
                matchedUrl = DOMAIN_IMAGE_COLLECTIONS.restaurant_italian.chef;
            } else if (/ambiance|interior|restaurant|room|table|bistro/i.test(altText)) {
                matchedUrl = DOMAIN_IMAGE_COLLECTIONS.restaurant_italian.ambiance;
            }
        }

        // Fallback to avatar or domain pool
        if (!matchedUrl) {
            if (isAvatar) {
                matchedUrl = DOMAIN_IMAGE_COLLECTIONS.avatars[avatarIdx % DOMAIN_IMAGE_COLLECTIONS.avatars.length];
                avatarIdx++;
            } else {
                matchedUrl = domainPool[poolIdx % domainPool.length];
                poolIdx++;
            }
        }

        const fallbackUrl = isFashion
            ? DOMAIN_IMAGE_COLLECTIONS.streetwear_fashion.nike_sneaker
            : isRestaurant
            ? DOMAIN_IMAGE_COLLECTIONS.restaurant_italian.pizza
            : DOMAIN_IMAGE_COLLECTIONS.ecommerce_audio_tech.headphones_flagship;

        return `<img ${beforeSrc}src="${matchedUrl}" onerror="this.onerror=null;this.src='${fallbackUrl}'"${afterSrc}>`;
    });

    // 5. Replace background-image placeholders or mismatched tech images
    processedCode = processedCode.replace(/url\(\s*["']?([^"')]+)["']?\s*\)/gi, (fullMatch, bgUrl) => {
        const isMismatched = (isRestaurant || isFashion) && TECH_IMAGE_PATTERNS.some(pat => pat.test(bgUrl));
        const isFoodInAudioTech = isAudioTech && /1565299624946|1513104890138|1517248135467/i.test(bgUrl);
        if (/^https:\/\/(images\.unsplash\.com|cdn\.)/i.test(bgUrl.trim()) && !isMismatched && !isFoodInAudioTech) {
            return fullMatch;
        }

        const heroImg = isFashion
            ? DOMAIN_IMAGE_COLLECTIONS.streetwear_fashion.hero
            : isRestaurant
            ? DOMAIN_IMAGE_COLLECTIONS.restaurant_italian.hero
            : isAudioTech
            ? DOMAIN_IMAGE_COLLECTIONS.ecommerce_audio_tech.hero
            : domainPool[0];

        return `url('${heroImg}')`;
    });

    // 6. Restore all protected <script> blocks
    scriptBlocks.forEach((scriptContent, idx) => {
        processedCode = processedCode.replace(`___SCRIPT_PROTECTED_BLOCK_${idx}___`, () => scriptContent);
    });

    return processedCode;
}
