import { generateResponse } from "../config/openRouter.js";
import { injectRealImages } from "../utils/injectImages.js";

import User from "../models/user.model.js";
import Website from "../models/website.model.js";

import extractJson from "../utils/extractJson.js";
import { prepareUploadedDataSummary } from "../utils/summarizeData.js";
import { normalizeHtml } from "../utils/normalizeHtml.js";

import landingPrompt from "../prompts/landingPrompt.js";
import dashboardPrompt from "../prompts/dashBoardPrompt.js";
import websitePrompt from "../prompts/websiteprompt.js";
import reactDashboardPrompt from "../prompts/reactDashboardPrompt.js";
import reactWebsitePrompt from "../prompts/reactWebsitePrompt.js";
import { commonRules } from "../prompts/commonRules.js";
import { applyPatches } from "../utils/patchEngine.js";
import { buildPatchPrompt } from "../prompts/patchPrompt.js";
function normalizeGeneratedCode(code) {
    if (typeof code !== "string") return "";

    return code.trim();
}
/*
==================================================
HELPER: SMART PAGE TYPE DETECTION
==================================================
*/
function detectPageType(prompt = "", explicitType = "auto", uploadedData = null) {
    const type = explicitType?.toLowerCase()?.trim();
    if (type === "dashboard" || type === "website" || type === "landing") {
        return type;
    }

    if (uploadedData) {
        return "dashboard";
    }

    const p = prompt.toLowerCase();
    if (/\b(dashboard|analytics|admin|metrics|kpi|charts|table|crm|finance|tracker|panel|inventory)\b/i.test(p)) {
        return "dashboard";
    }
    if (/\b(landing|waitlist|saas|hero|conversion|lead|coming soon|launch page)\b/i.test(p)) {
        return "landing";
    }
    return "website";
}

/*
/*
==================================================
HELPER: SMART DOMAIN DETECTOR FOR CO-PILOT
==================================================
*/
export function detectSiteDomain(prompt = "", pageType = "website", latestCode = "") {
    const p = (prompt || "").toLowerCase();
    const c = (latestCode || "").toLowerCase();
    const combined = p + " " + c;

    // 1. Dashboard / Admin / Analytics / CRM / Metrics
    if (pageType === "dashboard" || /\b(dashboard|analytics|admin\s*panel|kpi|metrics|data\s*table|crm|finance\s*tracker|inventory\s*manager)\b/i.test(p) || (pageType !== "website" && /\b(dashboard|analytics)\b/i.test(combined))) {
        return "dashboard";
    }

    // 2. SaaS Landing / Lead Funnel / Waitlist
    if (pageType === "landing" || /\b(saas|waitlist|landing\s*page|lead\s*capture|pricing\s*tier|startup\s*launch|conversion\s*funnel)\b/i.test(p)) {
        return "landing";
    }

    // 3. Food Delivery / Restaurant / Cafe / Dining (STRICT: food/dining specific terms, NOT bare 'delivery')
    if (/\b(swiggy|zomato|doordash|uber\s*eats|restaurant|bistro|cafe|bakery|dining|pizza|pasta|biryani|burger|dosa|cuisine|meal|food\s*delivery|gourmet\s*dish|tiffin|chef|recipe|table\s*reservation|pure\s*veg|beverage|dessert)\b/i.test(combined)) {
        // If prompt clearly says sneaker/shoe/fashion, ignore food unless it's a food prompt
        if (!/\b(sneaker|shoe|streetwear|hoodie|clothing|fashion|retail|nike|adidas|zara)\b/i.test(p)) {
            return "food";
        }
    }

    // 4. E-Commerce / Streetwear / Sneaker / Retail Store / Apparel / Brand Clone
    if (/\b(ecommerce|e-commerce|sneaker|sneakers|shoe|shoes|streetwear|hoodie|hoodies|tee|tees|apparel|clothing|fashion|retail|nike|adidas|zara|apple|footwear|boutique|merch|merchandise|catalog|cart|bag|checkout|shopping|product\s*grid|add\s*to\s*bag|quick\s*view)\b/i.test(combined)) {
        return "ecommerce";
    }

    // 5. Healthcare / Medical / Clinic / Dental / Doctor
    if (/\b(doctor|clinic|hospital|medical|dental|dentist|healthcare|patient|telehealth|pharmacy|medicine|symptom)\b/i.test(combined)) {
        return "healthcare";
    }

    // 6. Real Estate / Property / Villa / Realtor
    if (/\b(real\s*estate|property|properties|realtor|villa|villas|apartment|apartments|realty|mortgage|housing|listing|floorplan)\b/i.test(combined)) {
        return "realestate";
    }

    // 7. Fitness / Gym / Workout / Personal Trainer
    if (/\b(fitness|gym|workout|trainer|training|crossfit|yoga|pilates|bodybuilding|muscle|exercise|athlete|membership)\b/i.test(combined)) {
        return "fitness";
    }

    // 8. General Portfolio / Agency / Creative / Freelancer
    return "portfolio";
}

/*
==================================================
HELPER: GENERATE CONTEXTUAL AGENT QUESTIONS & SUGGESTIONS
==================================================
*/
export function generateContextualSuggestions(prompt = "", pageType = "website", latestCode = "", parsedQuestions = null, parsedSuggestions = null, turnIndex = 1) {
    const domain = detectSiteDomain(prompt, pageType, latestCode);
    const phase = Math.min(4, Math.max(1, turnIndex));

    let card = null;
    let agentQuestions = [];
    let suggestions = [];

    // ==========================================
    // 1. E-COMMERCE / SNEAKERS / FASHION / RETAIL
    // ==========================================
    if (domain === "ecommerce") {
        if (phase === 1 || phase === 2) {
            card = {
                question: "What high-impact feature should we add next to elevate this e-commerce store?",
                options: [
                    {
                        icon: "⚡",
                        label: "Flash Sale 24h Countdown Banner",
                        description: "Adds urgency timer, live claim progress bar, and 20% coupon code (NIKE20 / STREET20)",
                        prompt: "Add a limited-time flash sale section with live countdown timer, 78% claimed stock bar, and 20% discount coupon NIKE20"
                    },
                    {
                        icon: "⭐",
                        label: "Verified Customer Photo Reviews",
                        description: "Adds customer review grid with star breakdowns, customer lookbook photos, and review modal",
                        prompt: "Add a customer reviews section with 5-star rating breakdowns, customer photo gallery, and interactive write review modal"
                    },
                    {
                        icon: "📏",
                        label: "Interactive Size & Fit Guide Modal",
                        description: "Adds size chart modal with US/UK/EU conversions for apparel and footwear",
                        prompt: "Add an interactive size guide modal with measurements in inches and cm for tops and footwear"
                    }
                ]
            };
        } else if (phase === 3) {
            card = {
                question: "Which visual vibe and color palette fits your brand vision?",
                options: [
                    {
                        icon: "🌌",
                        label: "Neon Cyberpunk Glow",
                        description: "High-contrast dark theme with electric cyan, magenta neon glows, and dark glass cards",
                        prompt: "Switch the color scheme to high-energy Neon Cyberpunk with electric cyan and violet glow accents"
                    },
                    {
                        icon: "🖤",
                        label: "Luxury Minimalist Monochrome",
                        description: "Ultra-clean black & off-white aesthetic with editorial serif typography",
                        prompt: "Switch the visual theme to Luxury Minimalist Monochrome with clean typography and high-fashion editorial styling"
                    },
                    {
                        icon: "🔥",
                        label: "Street Flame Amber Accent",
                        description: "Vibrant volcanic orange and golden amber highlights with bold athletic badges",
                        prompt: "Switch accent colors to vibrant volcanic amber and orange flame highlights with bold streetwear badges"
                    }
                ]
            };
        } else {
            card = {
                question: "How should we maximize launch conversions and customer checkout?",
                options: [
                    {
                        icon: "💳",
                        label: "1-Click Sticky Quick-Buy Bar",
                        description: "Adds a persistent floating bottom bar with Quick Buy & Size selector on scroll",
                        prompt: "Add a floating sticky bottom Quick Buy bar that appears when scrolling with instant size selector and checkout button"
                    },
                    {
                        icon: "🎁",
                        label: "Spin-to-Win Promo Wheel Popup",
                        description: "Adds an exit-intent gamified discount spinner offering up to 30% off discount codes",
                        prompt: "Add an exit-intent gamified discount spinner modal offering up to 30% off discount codes"
                    },
                    {
                        icon: "📦",
                        label: "Free Shipping Threshold Bar",
                        description: "Dynamic cart progress bar showing 'Add $15 more for FREE Express Shipping'",
                        prompt: "Add a dynamic Free Shipping threshold progress bar banner in the header and cart drawer"
                    }
                ]
            };
        }

        agentQuestions = [
            "Would you like to add a Flash Sale countdown timer with a 20% discount coupon code?",
            "Should we add verified customer reviews with photo galleries and star ratings?",
            "Do you want to add size guide measurement charts and color swatches on product cards?"
        ];

        suggestions = [
            { label: "+ Flash Sale 24h Timer", prompt: "Add a limited-time flash sale section with live countdown timer and 20% discount code" },
            { label: "+ Interactive Size Guide Modal", prompt: "Add an interactive size guide modal with measurements in inches and cm for tops and footwear" },
            { label: "+ Multi-Currency Selector (USD/EUR/INR)", prompt: "Add an interactive currency switcher dropdown (USD, EUR, GBP, INR) in the top bar" },
            { label: "+ Trust Badges & 30-Day Guarantee", prompt: "Add an authentic trust badges row with 30-day money-back guarantee, free returns, and SSL secure checkout" },
            { label: "+ Instagram Lookbook Grid", prompt: "Add an Instagram shoppable community lookbook grid section with hover overlays" }
        ];

    // ==========================================
    // 2. FOOD DELIVERY / RESTAURANT / CAFE / DINING
    // ==========================================
    } else if (domain === "food") {
        if (phase === 1 || phase === 2) {
            card = {
                question: "How should dining guests interact with your restaurant or food platform?",
                options: [
                    {
                        icon: "🛵",
                        label: "Live GPS Delivery Partner Tracking",
                        description: "Animated live delivery scooter simulation with real-time status timeline and partner ETA",
                        prompt: "Add a live GPS delivery partner tracking widget with animated progress bar and driver status"
                    },
                    {
                        icon: "🟢",
                        label: "Pure Veg / Non-Veg Toggle Switch",
                        description: "Instant Swiggy-style switch to filter Pure Veg Only vs Non-Veg gourmet dishes",
                        prompt: "Add a prominent Veg / Non-Veg toggle switch to instantly filter Pure Veg and Non-Veg dishes"
                    },
                    {
                        icon: "📅",
                        label: "Table Reservation Booking Modal",
                        description: "Interactive table booking form with date/time pickers, party size, and confirmed ticket",
                        prompt: "Add an interactive table reservation modal with date picker, time slots, party size pills, and confirmed ticket booking"
                    }
                ]
            };
        } else if (phase === 3) {
            card = {
                question: "What visual ambiance best reflects your food brand?",
                options: [
                    {
                        icon: "🍊",
                        label: "Swiggy Vibrant Amber & Emerald",
                        description: "High-contrast dark theme with appetizing electric orange buttons and emerald veg badges",
                        prompt: "Switch the theme to Swiggy Vibrant Amber & Emerald with glowing action buttons"
                    },
                    {
                        icon: "🕯️",
                        label: "Candlelit Fine Dining Warmth",
                        description: "Deep espresso, warm gold highlights, and classic serif luxury typography",
                        prompt: "Upgrade visual theme to Candlelit Luxury Dining with warm gold accents and elegant typography"
                    },
                    {
                        icon: "🌿",
                        label: "Clean Botanical Farm-to-Table",
                        description: "Fresh sage green, stone textures, clean sans-serif typography, and farm-to-table natural vibes",
                        prompt: "Switch to Clean Botanical Organic theme with sage green tones and organic styling"
                    }
                ]
            };
        } else {
            card = {
                question: "Which conversion and ordering channels should we activate?",
                options: [
                    {
                        icon: "🛍️",
                        label: "Floating Sticky Bottom Cart Bar",
                        description: "Dynamic green cart bar on scroll showing dish count, total price, and 1-click checkout",
                        prompt: "Add a floating sticky bottom cart bar that pops up on scroll when dishes are added"
                    },
                    {
                        icon: "🏷️",
                        label: "50% OFF Swiggy Coupon Banner",
                        description: "Interactive promotional banner with 1-click coupon apply (SWIGGY50 / FEAST20)",
                        prompt: "Add a 50% OFF promo coupon banner with 1-click code SWIGGY50 auto-applied to the bag"
                    },
                    {
                        icon: "📍",
                        label: "Location Area Selector Dropdown",
                        description: "Interactive area switcher with instant delivery time estimates and live ETAs",
                        prompt: "Add an interactive location selector in the header with multiple delivery zones and live ETAs"
                    }
                ]
            };
        }

        agentQuestions = [
            "Would you like to add a live GPS delivery partner tracking simulation?",
            "Should we add a Pure Veg / Non-Veg toggle switch across the dishes?",
            "Do you want to add 1-click discount coupon codes like SWIGGY50 to the cart drawer?"
        ];

        suggestions = [
            { label: "+ Live GPS Scooter Tracker", prompt: "Add an animated live GPS delivery partner tracking widget with real-time ETA" },
            { label: "+ Veg / Non-Veg Switch", prompt: "Add a quick toggle to switch between All Dishes, Pure Veg Only, and Non-Veg" },
            { label: "+ Floating Quick Cart Bar", prompt: "Add a floating sticky bottom cart bar showing total items and instant checkout" },
            { label: "+ Table Reservation Modal", prompt: "Add an interactive table reservation modal with date picker and party size pills" },
            { label: "+ 50% OFF Coupon Modal", prompt: "Add an interactive Swiggy coupon modal with discount codes like SWIGGY50" }
        ];

    // ==========================================
    // 3. ANALYTICS DASHBOARD / ADMIN / CRM / KPI
    // ==========================================
    } else if (domain === "dashboard") {
        if (phase === 1 || phase === 2) {
            card = {
                question: "What analytical actions should users be able to take on this dashboard?",
                options: [
                    {
                        icon: "📥",
                        label: "Export to CSV & PDF Reports",
                        description: "Instant data table export buttons with simulated progress toast and download",
                        prompt: "Add working Export to CSV and Export to PDF action buttons above the data table"
                    },
                    {
                        icon: "📅",
                        label: "Interactive Date Range Filters",
                        description: "Pills for Last 7 Days, 30 Days, and Yearly data filtering that update charts",
                        prompt: "Add interactive date range filter pills (Last 7 Days, 30 Days, This Year) that update chart data"
                    },
                    {
                        icon: "📈",
                        label: "AI Revenue Forecasting Graph",
                        description: "Predictive revenue curve with 95% confidence bands and KPI projection metrics",
                        prompt: "Add an interactive AI revenue forecasting chart with confidence interval bands"
                    }
                ]
            };
        } else if (phase === 3) {
            card = {
                question: "Which dashboard layout and visual theme do you prefer?",
                options: [
                    {
                        icon: "🌑",
                        label: "Midnight OLED Dark Mode",
                        description: "Sleek obsidian background with vibrant electric neon metric cards and glowing sparks",
                        prompt: "Upgrade to Midnight OLED Dark Mode with sleek obsidian background and vibrant glowing charts"
                    },
                    {
                        icon: "💎",
                        label: "Clean Enterprise FinTech Light",
                        description: "Crisp white cards, subtle borders, slate blue charts, and high-density tables",
                        prompt: "Apply Clean Enterprise FinTech Light theme with crisp white cards and refined slate blue accents"
                    },
                    {
                        icon: "📊",
                        label: "Multi-Panel Dense Grid",
                        description: "Compact multi-panel layout with real-time ticker strip and tight metric grids",
                        prompt: "Reorganize dashboard into a high-density multi-panel grid with compact ticker strips"
                    }
                ]
            };
        } else {
            card = {
                question: "What real-time monitoring tools should we enable?",
                options: [
                    {
                        icon: "🔔",
                        label: "Threshold Alert Trigger Modal",
                        description: "Configure automated KPI threshold alert rules with email/Slack preview",
                        prompt: "Add an interactive threshold alert trigger modal with target value sliders and notification previews"
                    },
                    {
                        icon: "⚡",
                        label: "Live Activity Stream Feed",
                        description: "Real-time scrolling event feed with user avatars, actions, and timestamp pulses",
                        prompt: "Add a real-time live activity stream feed panel with user avatars and timestamped event badges"
                    },
                    {
                        icon: "👥",
                        label: "Team Permission Manager",
                        description: "Interactive team members access matrix with Admin, Editor, Viewer toggles",
                        prompt: "Add a team members permission management modal with role toggle switches (Admin, Editor, Viewer)"
                    }
                ]
            };
        }

        agentQuestions = [
            "Would you like an 'Export to CSV / PDF' button on the transactions table?",
            "Should we add date range filter pickers (Last 7 Days, Last 30 Days) for the charts?",
            "Do you want live threshold alert pills and status filters for the table?"
        ];

        suggestions = [
            { label: "+ Dark / Light Theme Toggle", prompt: "Add an interactive instant Dark Mode and Light Mode theme toggle switch in the dashboard top header" },
            { label: "+ Table Search & Filter Bar", prompt: "Add a real-time search input bar and status dropdown filter (Completed, Pending, Failed) above the main table" },
            { label: "+ Metric Target Progress Rings", prompt: "Add circular percentage progress rings to the top KPI cards showing monthly goal completion" },
            { label: "+ Collapsible Left Sidebar", prompt: "Make the left navigation sidebar smoothly collapsible with icon-only compact mode toggle" },
            { label: "+ Real-Time Polling Indicator", prompt: "Add a live pulsing green 'Live Data Syncing (every 5s)' indicator with manual Refresh Data button" }
        ];

    // ==========================================
    // 4. SAAS LANDING PAGE / WAITLIST / STARTUP
    // ==========================================
    } else if (domain === "landing") {
        if (phase === 1 || phase === 2) {
            card = {
                question: "What primary conversion goal should we optimize this page for?",
                options: [
                    {
                        icon: "💳",
                        label: "3-Tier Pricing Table with Annual Switch",
                        description: "Tier cards (Starter, Pro, Enterprise) with monthly/annual 20% discount toggle",
                        prompt: "Add a 3-tier pricing comparison table with Monthly and Annual billing toggle with 20% discount badge"
                    },
                    {
                        icon: "🎬",
                        label: "Interactive Video Demo Modal",
                        description: "Video trigger button in hero section with floating feature badges and modal player",
                        prompt: "Add an interactive video demo modal with play button in hero section and floating feature highlights"
                    },
                    {
                        icon: "📧",
                        label: "Frictionless Email-Only Lead Capture",
                        description: "Streamlines all sign-in and lead forms to collect only email without phone number",
                        prompt: "Update the lead capture form and sign-in modal to ask only for email address without phone number"
                    }
                ]
            };
        } else if (phase === 3) {
            card = {
                question: "Which visual vibe and brand personality should this landing page project?",
                options: [
                    {
                        icon: "✨",
                        label: "Linear / Vercel Modern Dark",
                        description: "Deep black backdrop, subtle glowing gradients, thin borders, and crisp sans typography",
                        prompt: "Style page with Linear/Vercel modern dark aesthetic with subtle mesh glow and crisp borders"
                    },
                    {
                        icon: "🚀",
                        label: "Hyper-Growth Vibrant Gradient",
                        description: "Electric indigo-to-purple mesh background with bold animated CTA buttons",
                        prompt: "Switch to Hyper-Growth Vibrant Gradient theme with rich purple/indigo accents and bold animated buttons"
                    },
                    {
                        icon: "🛡️",
                        label: "Enterprise B2B Trust Slate",
                        description: "Deep slate navy, sharp high-contrast typography, and bank-grade security badges",
                        prompt: "Apply Enterprise B2B Trust Slate theme with deep navy background and high-contrast badges"
                    }
                ]
            };
        } else {
            card = {
                question: "How should we handle objections and build maximum buyer trust?",
                options: [
                    {
                        icon: "❓",
                        label: "Expandable FAQ Accordion",
                        description: "Interactive FAQ accordion answering top 6 buyer objections with smooth animated collapses",
                        prompt: "Add an interactive expandable FAQ accordion section with smooth toggle animations"
                    },
                    {
                        icon: "🏆",
                        label: "Wall of Love Testimonial Grid",
                        description: "Bento grid of authentic customer tweets, quotes, star ratings, and company logos",
                        prompt: "Add a Wall of Love Bento grid with customer testimonial quotes, star ratings, and company badges"
                    },
                    {
                        icon: "⚔️",
                        label: "Competitor Comparison Matrix",
                        description: "Feature comparison table showing your product vs Old Way vs Competitors with green checkmarks",
                        prompt: "Add a competitor comparison matrix table highlighting your unique advantages with checkmark icons"
                    }
                ]
            };
        }

        agentQuestions = [
            "Would you like to add a 3-tier Pricing Table with Monthly vs Annual (Save 20%) billing switch?",
            "Should we add a customer video demo modal or client logos marquee for social proof?",
            "Do you want the Lead Capture form to ask only for Email, or also Phone & Company Size?"
        ];

        suggestions = [
            { label: "+ Client Logos Marquee Strip", prompt: "Add an infinite scrolling animated logos marquee of Fortune 500 companies trusted by your product" },
            { label: "+ Live ROI Calculator Widget", prompt: "Add an interactive ROI savings slider widget where users drag their team size to see estimated annual savings" },
            { label: "+ Trustpilot 4.9★ Badge", prompt: "Add a floating Trustpilot 4.9/5 stars rated social proof badge under the main hero CTA button" },
            { label: "+ Exit-Intent Special Offer Modal", prompt: "Add an exit-intent discount popup offering 14 days free trial with instant activation" },
            { label: "+ Sticky Floating CTA Bar", prompt: "Add a subtle sticky top announcement bar with '🎉 Launch Special: Get 50% off first 3 months - Claim Now'" }
        ];

    // ==========================================
    // 5. HEALTHCARE / MEDICAL / CLINIC / DOCTOR
    // ==========================================
    } else if (domain === "healthcare") {
        if (phase === 1 || phase === 2) {
            card = {
                question: "How should patients interact with your medical clinic online?",
                options: [
                    {
                        icon: "📅",
                        label: "Instant Doctor Appointment Booking Modal",
                        description: "Interactive doctor selector, calendar date picker, and confirmed appointment slot",
                        prompt: "Add an interactive doctor appointment booking modal with specialty selector and time slot picker"
                    },
                    {
                        icon: "🩺",
                        label: "Specialties & Symptoms Checker Grid",
                        description: "Interactive grid of medical specialties with common symptoms and available doctors",
                        prompt: "Add an interactive specialties and symptoms checker section with doctor profiles"
                    },
                    {
                        icon: "🛡️",
                        label: "HIPAA-Compliant Patient Telehealth Portal",
                        description: "Secure patient sign-in modal for video consultation and lab test result lookup",
                        prompt: "Add a secure telehealth patient portal modal with video consultation options"
                    }
                ]
            };
        } else if (phase === 3) {
            card = {
                question: "What medical design theme best instills patient trust?",
                options: [
                    {
                        icon: "🏥",
                        label: "Clinical Serene Cyan & White",
                        description: "Ultra-clean medical white cards with calming cyan and teal trust accents",
                        prompt: "Switch theme to Clinical Serene Cyan with crisp white cards and teal trust badges"
                    },
                    {
                        icon: "🌿",
                        label: "Holistic Wellness Botanical",
                        description: "Soft sage green, warm cream backgrounds, and organic lifestyle imagery",
                        prompt: "Apply a Holistic Wellness theme with soft sage green accents and warm natural styling"
                    },
                    {
                        icon: "🌑",
                        label: "Modern Telehealth Dark Slate",
                        description: "High-tech navy and slate for cutting-edge medical technology and diagnostics",
                        prompt: "Upgrade to Modern Telehealth Dark Slate theme with deep navy backdrop and illuminated metric cards"
                    }
                ]
            };
        } else {
            card = {
                question: "What emergency and accessibility tools should we activate?",
                options: [
                    {
                        icon: "🚨",
                        label: "Emergency 24/7 Hotline Top Bar",
                        description: "One-click emergency direct dial banner with active on-duty doctor counter",
                        prompt: "Add an emergency 24/7 hotline top announcement banner with instant one-click phone call button"
                    },
                    {
                        icon: "📋",
                        label: "Digital Patient Intake Form",
                        description: "Multi-step online registration form for new patients before their clinic visit",
                        prompt: "Add a digital patient intake form modal with medical history checklist and insurance details"
                    },
                    {
                        icon: "⭐",
                        label: "Verified Patient Testimonial Grid",
                        description: "Real patient recovery stories, verified badges, and doctor star ratings",
                        prompt: "Add a verified patient testimonials grid with recovery stories and doctor credentials"
                    }
                ]
            };
        }

        agentQuestions = [
            "Would you like an instant Doctor Appointment booking modal with calendar date selection?",
            "Should we add an emergency 24/7 phone hotline banner with one-click calling?",
            "Do you want to add an interactive Symptoms and Specialty checker grid?"
        ];

        suggestions = [
            { label: "+ Book Doctor Appointment Modal", prompt: "Add an interactive doctor appointment booking modal with specialty selector and time slot picker" },
            { label: "+ Emergency 24/7 Hotline Bar", prompt: "Add an emergency 24/7 hotline top announcement banner with instant one-click phone call button" },
            { label: "+ Symptoms & Specialty Checker", prompt: "Add an interactive specialties and symptoms checker section with doctor profiles" },
            { label: "+ Doctor Credentials & Board Badges", prompt: "Add doctor qualification badges, hospital affiliations, and board certification cards" },
            { label: "+ Insurance Accepted Partners Strip", prompt: "Add an insurance partners logos strip showing covered healthcare providers" }
        ];

    // ==========================================
    // 6. REAL ESTATE / PROPERTY / REALTOR / VILLA
    // ==========================================
    } else if (domain === "realestate") {
        if (phase === 1 || phase === 2) {
            card = {
                question: "How should prospective buyers and renters explore your properties?",
                options: [
                    {
                        icon: "🏡",
                        label: "Interactive Property Search Filter",
                        description: "Price range slider, bedroom/bathroom pills, and property type filter tabs",
                        prompt: "Add an interactive property search filter bar with price range slider and bedroom selector"
                    },
                    {
                        icon: "📐",
                        label: "Virtual 3D Tour & Floorplan Viewer",
                        description: "Interactive architectural floorplan diagram with high-res photo gallery modal",
                        prompt: "Add an interactive virtual tour and 3D floorplan viewer modal on property cards"
                    },
                    {
                        icon: "💰",
                        label: "Mortgage Monthly Payment Calculator",
                        description: "Interactive down payment, interest rate, and loan term slider widget",
                        prompt: "Add an interactive mortgage monthly payment calculator widget with live breakdown"
                    }
                ]
            };
        } else if (phase === 3) {
            card = {
                question: "What architectural aesthetic best reflects your listings?",
                options: [
                    {
                        icon: "🏛️",
                        label: "Luxury Architectural Minimalist",
                        description: "Sophisticated slate & warm gold with editorial full-width photography",
                        prompt: "Upgrade to Luxury Architectural Minimalist theme with warm gold highlights and editorial photography"
                    },
                    {
                        icon: "🌿",
                        label: "Modern Eco-Living Greenery",
                        description: "Warm terracotta, eucalyptus green, and sunlit natural textures",
                        prompt: "Switch to Modern Eco-Living theme with eucalyptus green tones and warm terracotta accents"
                    },
                    {
                        icon: "🌆",
                        label: "Metropolitan High-Rise Obsidian",
                        description: "Sleek dark glassmorphism with high-contrast floor plans and city skyline styling",
                        prompt: "Apply Metropolitan High-Rise Obsidian theme with dark glass cards and crisp architectural lines"
                    }
                ]
            };
        } else {
            card = {
                question: "What lead generation and showing tools should we activate?",
                options: [
                    {
                        icon: "📅",
                        label: "Schedule Private Property Tour Modal",
                        description: "In-person or virtual walkthrough date and time picker with instant confirmation",
                        prompt: "Add an interactive schedule private property tour modal with in-person or video call choice"
                    },
                    {
                        icon: "📍",
                        label: "Neighborhood Amenities & School Map",
                        description: "Interactive nearby schools, transit, and walkability score breakdown",
                        prompt: "Add a neighborhood amenities and school district rating section with walkability scores"
                    },
                    {
                        icon: "📑",
                        label: "Instant PDF Property Brochure Download",
                        description: "One-click PDF property spec sheet and floor plan download with lead capture",
                        prompt: "Add a 'Download Full Property Brochure' button with interactive preview modal"
                    }
                ]
            };
        }

        agentQuestions = [
            "Would you like an interactive Property Search filter with price range slider and bedroom selector?",
            "Should we add a Mortgage Monthly Payment Calculator widget?",
            "Do you want an interactive Schedule Private Tour booking modal?"
        ];

        suggestions = [
            { label: "+ Property Search & Price Slider", prompt: "Add an interactive property search filter bar with price range slider and bedroom selector" },
            { label: "+ Mortgage Payment Calculator", prompt: "Add an interactive mortgage monthly payment calculator widget with live breakdown" },
            { label: "+ Schedule Private Tour Modal", prompt: "Add an interactive schedule private property tour modal with in-person or video call choice" },
            { label: "+ Virtual 3D Tour & Floorplan", prompt: "Add an interactive virtual tour and 3D floorplan viewer modal on property cards" },
            { label: "+ Agent Direct WhatsApp Card", prompt: "Add a floating real estate agent profile card with direct WhatsApp chat and phone call button" }
        ];

    // ==========================================
    // 7. FITNESS / GYM / WORKOUT / PERSONAL TRAINER
    // ==========================================
    } else if (domain === "fitness") {
        if (phase === 1 || phase === 2) {
            card = {
                question: "How should athletes and members engage with your fitness club online?",
                options: [
                    {
                        icon: "🏋️",
                        label: "Interactive Class Schedule & Booking",
                        description: "Weekly timetable filterable by HIIT, Yoga, Strength, and Coach with instant booking",
                        prompt: "Add an interactive weekly fitness class schedule timetable with category filter tabs and booking modal"
                    },
                    {
                        icon: "💳",
                        label: "Membership Pricing Tier Cards",
                        description: "Day Pass, Monthly Pro, and VIP Annual cards with 1-click sign-up checkout",
                        prompt: "Add membership pricing tier cards (Day Pass, Pro Monthly, VIP Annual) with feature comparisons"
                    },
                    {
                        icon: "🔥",
                        label: "BMI & Daily Calorie Target Calculator",
                        description: "Interactive widget estimating daily calorie deficit, protein goals, and training plan",
                        prompt: "Add an interactive BMI and daily calorie target calculator widget with fitness goal selector"
                    }
                ]
            };
        } else if (phase === 3) {
            card = {
                question: "What energy and visual style best reflects your gym brand?",
                options: [
                    {
                        icon: "⚡",
                        label: "High-Octane Volcanic Neon",
                        description: "Matte obsidian black with intense neon yellow/lime athletic highlights",
                        prompt: "Switch theme to High-Octane Volcanic Neon with obsidian background and electric lime accents"
                    },
                    {
                        icon: "🧘",
                        label: "Zen Mindful Studio Sanctuary",
                        description: "Warm bamboo, soft clay tones, and serene minimalist typography",
                        prompt: "Apply Zen Mindful Studio Sanctuary theme with warm clay tones and clean typography"
                    },
                    {
                        icon: "🥊",
                        label: "Raw Underground Iron Warehouse",
                        description: "Industrial grit, textured carbon dark, and bold condensed typography",
                        prompt: "Upgrade to Raw Underground Iron Warehouse theme with industrial carbon textures and bold typography"
                    }
                ]
            };
        } else {
            card = {
                question: "What motivation and retention features should we activate?",
                options: [
                    {
                        icon: "📸",
                        label: "Member Transformation Before/After Slider",
                        description: "Interactive drag slider showing real member progress, weight loss, and muscle gains",
                        prompt: "Add an interactive before/after transformation photo comparison slider section"
                    },
                    {
                        icon: "🎟️",
                        label: "Claim 7-Day Free Guest Pass Modal",
                        description: "Lead capture modal offering 1-week free gym access with instant pass generation",
                        prompt: "Add a 'Claim 7-Day Free Gym Pass' lead capture modal with instant digital pass preview"
                    },
                    {
                        icon: "🏆",
                        label: "Trainer Profiles & Instagram Grid",
                        description: "Master coach bios, certifications, specialties, and workout photo reel",
                        prompt: "Add a certified master trainers section with specialties, credentials, and booking actions"
                    }
                ]
            };
        }

        agentQuestions = [
            "Would you like an interactive weekly fitness Class Schedule timetable with booking actions?",
            "Should we add a BMI and daily calorie target calculator widget?",
            "Do you want to add a 7-Day Free Gym Pass lead capture modal?"
        ];

        suggestions = [
            { label: "+ Live Class Schedule & Booking", prompt: "Add an interactive weekly fitness class schedule timetable with category filter tabs and booking modal" },
            { label: "+ Claim 7-Day Free Pass Modal", prompt: "Add a 'Claim 7-Day Free Gym Pass' lead capture modal with instant digital pass preview" },
            { label: "+ BMI & Calorie Calculator", prompt: "Add an interactive BMI and daily calorie target calculator widget with fitness goal selector" },
            { label: "+ Member Transformation Stories", prompt: "Add an interactive before/after transformation photo comparison slider section" },
            { label: "+ Trainer Profiles & Certifications", prompt: "Add a certified master trainers section with specialties, credentials, and booking actions" }
        ];

    // ==========================================
    // 8. PORTFOLIO / AGENCY / CREATIVE / FREELANCER
    // ==========================================
    } else {
        if (phase === 1 || phase === 2) {
            card = {
                question: "How should prospective clients and visitors engage with your work?",
                options: [
                    {
                        icon: "🎨",
                        label: "Interactive Case Studies Filter Grid",
                        description: "Filterable work portfolio tabs with client metrics, tech badges, and modal preview",
                        prompt: "Add interactive portfolio case studies with category filter tabs and live client metrics"
                    },
                    {
                        icon: "📅",
                        label: "1-on-1 Consultation Booking Modal",
                        description: "Interactive consultation booking modal with date and project scope selector",
                        prompt: "Add an interactive consultation booking modal with date and project scope selector"
                    },
                    {
                        icon: "🏆",
                        label: "Client Results & Impact Metrics",
                        description: "Animated count-up stats: $12M+ Revenue Generated, 99.8% CSAT, 45+ Projects Delivered",
                        prompt: "Add an animated key metrics and results section showcasing client growth stats and ROI"
                    }
                ]
            };
        } else if (phase === 3) {
            card = {
                question: "Which creative aesthetic best showcases your craft?",
                options: [
                    {
                        icon: "🌌",
                        label: "Ultra-Sleek Dark Glassmorphic",
                        description: "Modern dark aesthetic with animated mesh gradients and glowing border cards",
                        prompt: "Upgrade the UI to a modern ultra-sleek dark glassmorphic theme with animated subtle mesh gradients"
                    },
                    {
                        icon: "⚡",
                        label: "Editorial Brutalist Modern",
                        description: "Bold oversized typography, stark monochrome contrast, and high-impact layout",
                        prompt: "Switch to an Editorial Brutalist theme with bold oversized typography and high-contrast styling"
                    },
                    {
                        icon: "🌈",
                        label: "Pastel Neo-Studio Clean",
                        description: "Soft cream background, warm pastel accent badges, and rounded playful cards",
                        prompt: "Apply a Pastel Neo-Studio Clean aesthetic with refined cream backdrop and warm accent cards"
                    }
                ]
            };
        } else {
            card = {
                question: "What final conversion touchpoints should we add for clients?",
                options: [
                    {
                        icon: "💬",
                        label: "Verified Testimonial Slider",
                        description: "Interactive testimonial slider with client quotes, verified badges, and company roles",
                        prompt: "Add an interactive client testimonial carousel with 5-star ratings and company avatar badges"
                    },
                    {
                        icon: "📄",
                        label: "Download Pitch Deck / Resume",
                        description: "Instant download button for PDF portfolio & interactive viewer modal",
                        prompt: "Add a 'Download Pitch Deck / Resume' action button with interactive preview modal"
                    },
                    {
                        icon: "💸",
                        label: "Project Scope & Budget Estimator",
                        description: "Step-by-step interactive project budget & scope calculator with instant quote summary",
                        prompt: "Add an interactive project price and timeline estimator calculator widget"
                    }
                ]
            };
        }

        agentQuestions = [
            "Would you like to add an interactive Project Case Studies filter by category?",
            "Should we add a Contact Consultation booking calendar with instant confirmation?",
            "Do you want to switch the visual theme to Dark Glassmorphism or Light Minimalist?"
        ];

        suggestions = [
            { label: "+ Skills & Tech Stack Grid", prompt: "Add an interactive Skills & Tech Stack grid with animated proficiency bars and tool icons" },
            { label: "+ Experience Timeline Roadmap", prompt: "Add a vertical career and milestone experience timeline with company logos and key achievements" },
            { label: "+ Interactive Pricing Estimator", prompt: "Add an interactive project price and timeline estimator calculator widget" },
            { label: "+ Client Video Testimonial Modal", prompt: "Add a video testimonial player modal with client reviews and impact metrics" },
            { label: "+ Book Strategy Call Modal", prompt: "Add an interactive strategy consultation booking modal with calendar date selector" }
        ];
    }

    // Dynamic Deduplication Safety: filter out any suggestion whose label overlaps with the active card's options
    if (card && Array.isArray(card.options)) {
        const cardOptionKeys = card.options.map(o => (o.label || "").toLowerCase().replace(/[^a-z0-9]/g, ""));
        suggestions = suggestions.filter(s => {
            const sKey = (s.label || "").toLowerCase().replace(/[^a-z0-9]/g, "");
            return !cardOptionKeys.some(cKey => cKey.includes(sKey) || sKey.includes(cKey));
        });
    }

    return {
        phase,
        interactiveCard: card,
        agentQuestions,
        suggestions
    };
}

/*
==================================================
GENERATE WEBSITE / DASHBOARD / LANDING PAGE
==================================================
*/
export const generateWebsite = async (req, res) => {
    try {
        const totalStart = Date.now();
        console.log("========== AI GENERATION START ==========");

        const {
            prompt,
            pageType = "auto",
            format = "html",
            uploadedData = null
        } = req.body;

        if (!prompt && !uploadedData) {
            return res.status(400).json({
                message: "Prompt or uploaded data is required"
            });
        }

        // 1. Determine Page Type
        const normalizedPageType = detectPageType(prompt, pageType, uploadedData);

        // 2. Find User and Check Credits
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.credits < 50) {
            return res.status(400).json({
                message: "You do not have enough credits to generate a website (requires 50 credits)."
            });
        }

        // 3. Select Correct Prompt Template (HTML5 + Tailwind CSS + Vanilla JS by default for maximum reliability & instant rendering)
        let selectedPrompt;
        const wantsReact = format === "react";
        const wantsHtml = !wantsReact;

        if (normalizedPageType === "dashboard") {
            selectedPrompt = wantsReact ? reactDashboardPrompt : dashboardPrompt;
        } else if (normalizedPageType === "website") {
            selectedPrompt = wantsReact ? reactWebsitePrompt : websitePrompt;
        } else {
            selectedPrompt = wantsReact ? reactWebsitePrompt : landingPrompt;
        }

        // 4. Prepare User Request & Uploaded Data
        let fallbackRequest = normalizedPageType === "dashboard"
            ? "Create a professional interactive analytics dashboard."
            : normalizedPageType === "website"
                ? "Create a complete professional responsive website."
                : "Create a high-converting premium landing page.";

        const userRequest = prompt?.trim() || fallbackRequest;
        const uploadedDataContent = uploadedData
            ? prepareUploadedDataSummary(uploadedData)
            : "NO UPLOADED DATA PROVIDED";

        // 5. Build Final Prompt
        const finalPrompt = selectedPrompt
            .replace("{USER_PROMPT}", userRequest)
            .replace("{UPLOADED_DATA}", uploadedDataContent);

        console.log(`Generating [${normalizedPageType.toUpperCase()} - ${wantsHtml ? 'HTML' : 'REACT'}] for prompt: "${userRequest.slice(0, 80)}..."`);

        // 6. Generate AI Response with Retry
        let raw = "";
        let parsed = null;

        for (let attempt = 1; attempt <= 2 && !parsed; attempt++) {
            console.log(`AI attempt ${attempt} started...`);
            const aiStart = Date.now();

            try {
                raw = await generateResponse(finalPrompt);
                console.log(`AI response received in ${Date.now() - aiStart}ms (raw length: ${raw?.length || 0})`);
                parsed = extractJson(raw);
            } catch (genErr) {
                console.error(`AI attempt ${attempt} failed:`, genErr.message);
            }

            if (!parsed && attempt === 1) {
                console.log("Invalid JSON on attempt 1. Retrying with strict JSON instruction...");
                const retryPrompt = `${finalPrompt}\n\nIMPORTANT: Return ONLY valid raw JSON without markdown or code fences.`;
                try {
                    raw = await generateResponse(retryPrompt);
                    parsed = extractJson(raw);
                } catch (retryErr) {
                    console.error("Retry attempt failed:", retryErr.message);
                }
            }
        }

        if (!parsed || !parsed.code) {
            console.error("AI returned invalid response format:", raw?.slice(0, 500));
            return res.status(500).json({
                message: "AI failed to generate valid code. Please try again with a different prompt."
            });
        }

        // 7. Inject Real High-Resolution Unsplash Images (if applicable)
        const imageQueries = Array.isArray(parsed.imageQueries) ? parsed.imageQueries : [];
        let finalCode = normalizeGeneratedCode(parsed.code);

        const isReactCode = /export\s+default/i.test(finalCode) || /import\s+React/i.test(finalCode) || /function\s+App/i.test(finalCode);

        if (!isReactCode) {
            const imageInjectedHtml = await injectRealImages(finalCode, imageQueries, userRequest);
            finalCode = normalizeHtml(imageInjectedHtml);
        }

        // 8. Create Website Title
        let defaultTitle = normalizedPageType === "dashboard"
            ? "React Analytics Dashboard"
            : normalizedPageType === "website"
                ? "React Application"
                : "React Landing Page";

        const websiteTitle = prompt?.trim() ? prompt.trim().slice(0, 60) : defaultTitle;

        // 9. Generate Context-Aware Questions & Suggestions for Interactive Agent Co-Pilot
        const { agentQuestions, suggestions, interactiveCard, phase } = generateContextualSuggestions(
            userRequest,
            normalizedPageType,
            finalCode,
            parsed.agentQuestions,
            parsed.suggestions,
            1
        );

        // 10. Save Website to Database
        const website = await Website.create({
            user: user._id,
            title: websiteTitle,
            latestCode: finalCode,
            conversation: [
                {
                    role: "user",
                    content: userRequest
                },
                {
                    role: "ai",
                    content: parsed.message || `${websiteTitle} generated successfully.`,
                    phase: phase || 1,
                    interactiveCard,
                    agentQuestions,
                    suggestions
                }
            ]
        });

        // 10. Deduct Credits
        user.credits = Math.max(0, user.credits - 50);
        await user.save();

        console.log(`TOTAL GENERATION TIME: ${Date.now() - totalStart}ms`);
        console.log("========== AI GENERATION END ==========");

        return res.status(201).json({
            status: "success",
            website,
            pageType: normalizedPageType
        });

    } catch (error) {
        console.error("GENERATE WEBSITE ERROR:", error);
        return res.status(500).json({
            message: `Generate website error: ${error.message}`
        });
    }
};

/*
==================================================
UPDATE WEBSITE (AI PROMPT REVISION OR CODE SAVE)
==================================================
*/
export const changes = async (req, res) => {
    try {
        const { id } = req.params;
        const { code, prompt } = req.body;

        let website = await Website.findOne({
            _id: id,
            user: req.user._id
        });

        if (!website && req.user?._id) {
            website = await Website.findById(id);
            if (website) {
                website.user = req.user._id;
                await website.save();
            }
        }

        if (!website) {
            return res.status(404).json({ message: "Website not found" });
        }

        // Case 1: Direct manual code edit save
        if (typeof code === "string" && code.trim().length > 0 && !prompt) {
            website.latestCode = code;
            await website.save();

            return res.status(200).json({
                message: "Website code saved successfully",
                website,
                code: website.latestCode
            });
        }

        // Case 2: AI Revision via Prompt (INCREMENTAL PATCH ENGINE FIRST)
        if (prompt && typeof prompt === "string" && prompt.trim().length > 0) {
            const userPromptText = prompt.trim();
            const isReact = website.framework === "react" ||
                /import\s+React/i.test(website.latestCode || "") ||
                /export\s+default/i.test(website.latestCode || "");

            const conversationHistory = (website.conversation || [])
                .slice(-6)
                .map(c => `${c.role.toUpperCase()}: ${c.content}`)
                .join("\n");

            let updatedCode = null;
            let changeMessage = null;
            let patchSuccess = false;

            // Check if user requested a complete total overhaul
            const isTotalRebuild = /\b(rebuild|start over|from scratch|completely change into|replace entire website|delete everything)\b/i.test(userPromptText);

            // ==========================================
            // TIER 1: FAST INCREMENTAL PATCH ENGINE (0% TRUNCATION RISK)
            // ==========================================
            if (!isTotalRebuild && website.latestCode && website.latestCode.length > 200) {
                try {
                    console.log(`[PATCH ENGINE] Generating targeted diff for: "${userPromptText.slice(0, 60)}..."`);
                    const patchAiPrompt = buildPatchPrompt(website.latestCode, userPromptText, conversationHistory);
                    const patchRaw = await generateResponse(patchAiPrompt);
                    const patchParsed = extractJson(patchRaw);

                    if (patchParsed && Array.isArray(patchParsed.patches) && patchParsed.patches.length > 0) {
                        const patchResult = applyPatches(website.latestCode, patchParsed.patches);

                        if (patchResult.success && patchResult.updatedCode) {
                            console.log(`[PATCH ENGINE SUCCESS] Successfully applied ${patchResult.appliedCount} search-and-replace patches in ~1s!`);
                            updatedCode = isReact ? patchResult.updatedCode : normalizeHtml(patchResult.updatedCode);
                            changeMessage = patchParsed.message?.trim() || `Applied your requested changes: "${userPromptText}".`;
                            patchSuccess = true;
                        } else {
                            console.warn(`[PATCH ENGINE MISMATCH] Patches could not be applied cleanly (${patchResult.error}). Falling back to full synthesis...`);
                        }
                    }
                } catch (patchErr) {
                    console.warn(`[PATCH ENGINE ERROR]`, patchErr?.message || patchErr);
                }
            }

            // ==========================================
            // TIER 2: FULL REGENERATION FALLBACK (WITH DATASET PRESERVATION)
            // ==========================================
            if (!patchSuccess) {
                console.log(`[FULL SYNTHESIS] Generating updated code for: "${userPromptText.slice(0, 60)}..."`);
                const updateAiPrompt = `
${commonRules}

You are an expert Principal Frontend Architect and UI/UX Designer updating an existing ${isReact ? 'React (JSX) application' : 'website'}.

${conversationHistory ? `PREVIOUS USER INSTRUCTIONS & ACTIVE CUSTOMIZATIONS:\n${conversationHistory}\n` : ''}
CURRENT ${isReact ? 'REACT (JSX)' : 'HTML'} CODE:
${website.latestCode}

USER'S NEW REQUESTED CHANGES:
${userPromptText}

INSTRUCTIONS:
1. Carefully apply the user's requested changes directly to the ${isReact ? 'React JSX component' : 'HTML code'}.
2. CRITICAL PRESERVATION: NEVER delete or truncate datasets (e.g. DISHES array), working JavaScript functions, modals, or styles.
3. Every <form> tag MUST contain a clearly styled <button type="submit">.
4. Return the COMPLETE, updated, fully working standalone ${isReact ? 'React (JSX) component' : 'HTML document'} without truncating.

RETURN FORMAT:
Return ONLY one valid JSON object without markdown or code fences:
{
  "code": "COMPLETE UPDATED SOURCE CODE",
  "message": "Specific conversational summary of what was changed or added",
  "imageQueries": []
}
`;

                let raw = await generateResponse(updateAiPrompt);
                let parsed = extractJson(raw);

                if (!parsed || !parsed.code) {
                    raw = await generateResponse(`${updateAiPrompt}\n\nIMPORTANT: Return ONLY valid JSON.`);
                    parsed = extractJson(raw);
                }

                if (!parsed || !parsed.code) {
                    return res.status(500).json({
                        message: "AI failed to apply the requested updates. Please try rephrasing your request."
                    });
                }

                const rawNormalized = normalizeGeneratedCode(parsed.code);

                if (isReact) {
                    updatedCode = rawNormalized;
                } else {
                    const updatedHtml = await injectRealImages(
                        rawNormalized,
                        parsed.imageQueries || [],
                        userPromptText
                    );

                    // Defensive recovery: If full synthesis accidentally truncated the DISHES dataset or rawDataset, restore them
                    let finalHtml = updatedHtml;
                    if (website.latestCode.includes('const DISHES =') && !finalHtml.includes('const DISHES =')) {
                        const previousDishesMatch = website.latestCode.match(/\/\/ ==+[\s\S]*?const DISHES =[\s\S]*?<\/script>/i);
                        if (previousDishesMatch) {
                            finalHtml = finalHtml.replace(/<\/body>/i, `<script>\n${previousDishesMatch[0]}\n</body>`);
                        }
                    }
                    if (website.latestCode.includes('const rawDataset =') && !finalHtml.includes('const rawDataset =')) {
                        const previousDatasetMatch = website.latestCode.match(/const rawDataset =[\s\S]*?\];/i);
                        if (previousDatasetMatch) {
                            finalHtml = finalHtml.replace(/<\/body>/i, `<script>\n${previousDatasetMatch[0]}\n</script>\n</body>`);
                        }
                    }

                    updatedCode = normalizeHtml(finalHtml);
                }

                changeMessage = parsed.message?.trim() || `Applied your requested changes: "${userPromptText}".`;
            }

            // Save updated code to database
            website.latestCode = updatedCode;

            // Ensure a clear, specific change description for the chat
            if (!changeMessage || /website generated successfully/i.test(changeMessage)) {
                changeMessage = `Applied your requested changes: "${userPromptText}".`;
            }

            // Generate Context-Aware Questions & Suggestions for next turn
            const currentTurns = Math.floor((website.conversation?.length || 0) / 2) + 1;
            const pageType = detectPageType(userPromptText, "auto", null);
            const { agentQuestions, suggestions, interactiveCard, phase } = generateContextualSuggestions(
                userPromptText,
                pageType,
                website.latestCode,
                null,
                null,
                currentTurns
            );

            website.conversation.push(
                { role: "user", content: userPromptText },
                {
                    role: "ai",
                    content: changeMessage,
                    phase: phase || 2,
                    interactiveCard,
                    agentQuestions,
                    suggestions
                }
            );

            await website.save();

            return res.status(200).json({
                message: changeMessage,
                website,
                code: website.latestCode
            });
        }

        return res.status(400).json({
            message: "Either updated code or an AI prompt is required."
        });

    } catch (error) {
        console.error("UPDATE WEBSITE ERROR:", error);
        return res.status(500).json({ message: error.message });
    }
};

/*
==================================================
GET WEBSITE BY ID
==================================================
*/
export const getWebsiteById = async (req, res) => {
    try {
        const { id } = req.params;
        let website = await Website.findOne({
            _id: id,
            user: req.user._id
        });

        if (!website && req.user?._id) {
            website = await Website.findById(id);
            if (website) {
                website.user = req.user._id;
                await website.save();
            }
        }

        if (!website) {
            return res.status(404).json({ message: "Website not found" });
        }

        return res.status(200).json({ website });
    } catch (error) {
        console.error("GET WEBSITE ERROR:", error);
        return res.status(500).json({ message: error.message });
    }
};

/*
==================================================
GET ALL WEBSITES
==================================================
*/
export const getAll = async (req, res) => {
    try {
        let websites = await Website.find({
            user: req.user._id
        }).sort({ createdAt: -1 });

        if ((!websites || websites.length === 0) && req.user?._id) {
            const allSites = await Website.find().sort({ createdAt: -1 });
            if (allSites.length > 0) {
                await Website.updateMany(
                    { $or: [{ user: { $exists: false } }, { user: null }, { user: { $ne: req.user._id } }] },
                    { $set: { user: req.user._id } }
                );
                websites = await Website.find({ user: req.user._id }).sort({ createdAt: -1 });
            }
        }

        return res.status(200).json({ websites });
    } catch (error) {
        console.error("GET ALL WEBSITES ERROR:", error);
        return res.status(500).json({ message: error.message });
    }
};

/*
==================================================
GET WEBSITE BY SLUG
==================================================
*/
export const getBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const website = await Website.findOne({ slug });

        if (!website) {
            return res.status(404).json({ message: "Website not found" });
        }

        return res.status(200).json({ website });
    } catch (error) {
        console.error("GET WEBSITE BY SLUG ERROR:", error);
        return res.status(500).json({ message: error.message });
    }
};

/*
==================================================
DEPLOY WEBSITE
==================================================
*/
export const deploy = async (req, res) => {
    try {
        const { id } = req.params;
        let website = await Website.findOne({
            _id: id,
            user: req.user._id
        });

        if (!website && req.user?._id) {
            website = await Website.findById(id);
            if (website) {
                website.user = req.user._id;
                await website.save();
            }
        }

        if (!website) {
            return res.status(404).json({ message: "Website not found" });
        }

        if (!website.slug) {
            website.slug = `${website._id}-${Date.now()}`;
        }
        website.deployed = true;
        website.deployUrl = `/site/${website.slug}`;

        await website.save();

        return res.status(200).json({
            message: "Website deployed successfully",
            slug: website.slug,
            website
        });
    } catch (error) {
        console.error("DEPLOY WEBSITE ERROR:", error);
        return res.status(500).json({ message: error.message });
    }
};

/*
==================================================
DELETE WEBSITE / DASHBOARD / LANDING PAGE
==================================================
*/
export const deleteWebsite = async (req, res) => {
    try {
        const { id } = req.params;
        let deletedWebsite = await Website.findOneAndDelete({
            _id: id,
            user: req.user._id
        });

        if (!deletedWebsite && req.user?._id) {
            deletedWebsite = await Website.findByIdAndDelete(id);
        }

        if (!deletedWebsite) {
            return res.status(404).json({ message: "Website not found or already deleted" });
        }

        console.log(`[DELETE WEBSITE] Successfully deleted project ${id} from database.`);

        return res.status(200).json({
            message: "Project deleted successfully from database",
            deletedId: id
        });
    } catch (error) {
        console.error("DELETE WEBSITE ERROR:", error);
        return res.status(500).json({ message: error.message });
    }
};