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

        // 9. Save Website to Database
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
                    content: parsed.message || `${websiteTitle} generated successfully.`
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

        const website = await Website.findOne({
            _id: id,
            user: req.user._id
        });

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

        // Case 2: AI Revision via Prompt
        if (prompt && typeof prompt === "string" && prompt.trim().length > 0) {
            const userPromptText = prompt.trim();
            const isReact = /export\s+default/i.test(website.latestCode) || /import\s+React/i.test(website.latestCode) || /function\s+App/i.test(website.latestCode);

            const updateAiPrompt = `
You are an expert Principal Frontend Architect and UI/UX Designer updating an existing ${isReact ? 'React (JSX) application' : 'website'}.

CURRENT ${isReact ? 'REACT (JSX)' : 'HTML'} CODE:
${website.latestCode}

USER'S REQUESTED CHANGES:
${userPromptText}

INSTRUCTIONS:
1. Carefully and thoroughly apply the user's requested changes directly to the ${isReact ? 'React JSX component' : 'HTML code'}.
2. If the user asks for icons, add appropriate Lucide icons using <i data-lucide="icon-name" class="w-4 h-4"></i> or Lucide React components and ensure lucide.createIcons() is called.
3. If the user asks for styling, theme, component, section, or content changes, implement them completely and seamlessly without placeholders.
4. Return the COMPLETE, updated, fully working standalone ${isReact ? 'React (JSX) component (export default function App() { ... })' : 'HTML document'} preserving all state, hooks, Tailwind CSS classes, and interactivity.
5. In the "message" field of your JSON response, write a specific, conversational 1-2 sentence description explaining EXACTLY what modifications, components, styling, or icons were added/changed based on the user's request. NEVER return generic phrases like "Website generated successfully" or "Updated".
6. NEVER include or retain an AI chat sidebar, conversation bubbles, "Describe changes..." prompt bar, or editor UI inside the code. Output ONLY the pure standalone end-user application or dashboard.
7. CRITICAL: Ensure all links in the navbar, body, and footer are 100% FUNCTIONAL. In the footer, ONLY include real working links (on-page smooth scroll anchors to existing sections, working modal buttons for Privacy/Terms/Contact, working newsletter submission with toast, and Back to Top). NEVER output dead/dummy links like /careers, /blog, /press, etc.

RETURN FORMAT:
Return ONLY one valid JSON object without markdown or code fences.

The "code" field must contain the COMPLETE updated source code.

IMPORTANT:
- Do not stringify the source code twice.
- Do not return literal backslash-n characters like \\n.
- Do not double-escape quotes or line breaks.
- The code must be valid after the JSON response is parsed with JSON.parse().

JSON structure:

{
  "code": "COMPLETE UPDATED SOURCE CODE",
  "message": "Specific conversational summary of what was changed or added",
  "imageQueries": []
}
`;

            let raw = await generateResponse(updateAiPrompt);
            let parsed = extractJson(raw);

            if (!parsed || !parsed.code) {
                // Fallback attempt
                raw = await generateResponse(`${updateAiPrompt}\n\nIMPORTANT: Return ONLY valid JSON.`);
                parsed = extractJson(raw);
            }

            if (!parsed || !parsed.code) {
                return res.status(500).json({
                    message: "AI failed to apply the requested updates. Please try rephrasing your request."
                });
            }

            // If React code, store pure code; if HTML, normalize
            const updatedCode = normalizeGeneratedCode(parsed.code);

            const isUpdatedReact =
                /export\s+default/i.test(updatedCode) ||
                /import\s+React/i.test(updatedCode) ||
                /function\s+App/i.test(updatedCode);
            if (isUpdatedReact) {
                website.latestCode = updatedCode;
            } else {
                const updatedHtml = await injectRealImages(
                    updatedCode,
                    parsed.imageQueries || [],
                    userPromptText
                );

                website.latestCode = normalizeHtml(updatedHtml);
            }
            // Ensure a clear, specific change description for the chat
            let changeMessage = parsed.message?.trim();
            if (!changeMessage || /website generated successfully/i.test(changeMessage)) {
                changeMessage = `Applied your requested changes: "${userPromptText}".`;
            }

            website.conversation.push(
                { role: "user", content: userPromptText },
                { role: "ai", content: changeMessage }
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
        const website = await Website.findOne({
            _id: id,
            user: req.user._id
        });

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
        const websites = await Website.find({
            user: req.user._id
        }).sort({ createdAt: -1 });

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
        const website = await Website.findOne({
            _id: id,
            user: req.user._id
        });

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