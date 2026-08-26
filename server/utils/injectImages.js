import { getWebsiteImages } from "../config/imageSearch.js";

// Comprehensive verified high-resolution photos categorized by exact domain (ALL TESTED [200 OK])
export const DOMAIN_IMAGE_COLLECTIONS = {
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

    let processedCode = htmlCode;
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

    // 2. Holistic domain detection from both userPrompt AND the full HTML context
    const combinedContext = ((userPrompt || "") + " " + (htmlCode || "")).toLowerCase();
    const isRestaurant = /restaurant|bistro|italian|food|pasta|pizza|cafe|coffee|diner|kitchen|bakery|menu|chef|dish|wine|bar|dining|burrata|prosciutto|tasting|osteria|trattoria|antipasti/i.test(combinedContext);
    const isFashion = /streetwear|fashion|kicks|sneaker|shoes|apparel|clothing|hoodie|jacket|jeans|cloth|wear|dress|tshirt|tee|denim/i.test(combinedContext);
    const isFitness = /gym|fitness|workout|trainer|crossfit|yoga|sports/i.test(combinedContext);

    // Pick appropriate domain pool
    let domainPool;
    if (isRestaurant) {
        domainPool = Object.values(DOMAIN_IMAGE_COLLECTIONS.restaurant_italian);
    } else if (isFashion) {
        domainPool = Object.values(DOMAIN_IMAGE_COLLECTIONS.streetwear_fashion);
    } else if (isFitness) {
        domainPool = Object.values(DOMAIN_IMAGE_COLLECTIONS.fitness_gym);
    } else if (/saas|agency|consult|startup|software|crm/i.test(combinedContext)) {
        domainPool = Object.values(DOMAIN_IMAGE_COLLECTIONS.saas_agency);
    } else {
        domainPool = Object.values(DOMAIN_IMAGE_COLLECTIONS.ecommerce_tech);
    }

    // 3. If Restaurant or Fashion, sweep and replace any tech gadget image URLs across the ENTIRE document (including inside JS arrays)
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

    const SNEAKER_ROTATION = [
        DOMAIN_IMAGE_COLLECTIONS.streetwear_fashion.nike_sneaker,
        DOMAIN_IMAGE_COLLECTIONS.streetwear_fashion.chunky_sneaker,
        DOMAIN_IMAGE_COLLECTIONS.streetwear_fashion.hightop_sneaker,
        DOMAIN_IMAGE_COLLECTIONS.streetwear_fashion.retro_sneaker,
        DOMAIN_IMAGE_COLLECTIONS.streetwear_fashion.sport_shoe
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

        if (isValidHttpsImage && !srcValue.includes("placeholder") && !srcValue.includes("example.com") && !isMismatchedTechInFoodOrFashion && !isBroken404) {
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
            : DOMAIN_IMAGE_COLLECTIONS.ecommerce_tech.headphones;

        return `<img ${beforeSrc}src="${matchedUrl}" onerror="this.onerror=null;this.src='${fallbackUrl}'"${afterSrc}>`;
    });

    // 5. Replace background-image placeholders or mismatched tech images
    processedCode = processedCode.replace(/url\(\s*["']?([^"')]+)["']?\s*\)/gi, (fullMatch, bgUrl) => {
        const isMismatched = (isRestaurant || isFashion) && TECH_IMAGE_PATTERNS.some(pat => pat.test(bgUrl));
        if (/^https:\/\/(images\.unsplash\.com|cdn\.)/i.test(bgUrl.trim()) && !isMismatched) {
            return fullMatch;
        }

        const heroImg = isFashion
            ? DOMAIN_IMAGE_COLLECTIONS.streetwear_fashion.hero
            : isRestaurant
            ? DOMAIN_IMAGE_COLLECTIONS.restaurant_italian.hero
            : domainPool[0];

        return `url('${heroImg}')`;
    });

    return processedCode;
}
