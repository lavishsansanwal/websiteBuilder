/**
 * Remove thinking blocks and markdown wrappers.
 */
function cleanRawResponse(text) {
    if (!text || typeof text !== "string") return "";

    let clean = text.trim();

    // Remove <think>...</think>
    clean = clean.replace(/<think>[\s\S]*?<\/think>/gi, "");

    // Remove <thought>...</thought>
    clean = clean.replace(/<thought>[\s\S]*?<\/thought>/gi, "");

    // Remove markdown fences
    clean = clean
        .replace(/^```(?:json|javascript|js|jsx|react|html)?\s*/i, "")
        .replace(/\s*```$/i, "");

    return clean.trim();
}


/**
 * Safely unescape generated code.
 *
 * Handles:
 * \n
 * \\n
 * \r
 * \\r
 * \t
 * \\t
 */
function normalizeCode(code) {
    if (!code || typeof code !== "string") return "";

    let clean = code;

    /*
     * Sometimes the AI response contains multiple levels
     * of escaping.
     *
     * Example:
     *
     * \\\\n  -> \\n -> newline
     *
     * Run a few times safely.
     */
    for (let i = 0; i < 3; i++) {
        const previous = clean;

        // Double escaped first
        clean = clean
            .replace(/\\\\n/g, "\\n")
            .replace(/\\\\r/g, "\\r")
            .replace(/\\\\t/g, "\\t")
            .replace(/\\\\\"/g, '\\"');

        // Normal escaped sequences
        clean = clean
            .replace(/\\n/g, "\n")
            .replace(/\\r/g, "\r")
            .replace(/\\t/g, "\t")
            .replace(/\\"/g, '"')
            .replace(/\\'/g, "'")
            .replace(/\\\//g, "/");

        if (clean === previous) {
            break;
        }
    }

    return clean.trim();
}


/**
 * Check whether the extracted code looks like valid
 * React/JSX or HTML.
 */
function isValidCode(code) {
    if (!code || typeof code !== "string") {
        return false;
    }

    const clean = code.trim();

    if (clean.length < 20) {
        return false;
    }

    const isReact =
        /import\s+React/i.test(clean) ||
        /import\s*{[^}]*}\s*from\s*["']react["']/i.test(clean) ||
        /export\s+default/i.test(clean) ||
        /function\s+App\s*\(/i.test(clean) ||
        /const\s+App\s*=/i.test(clean);

    if (isReact) {
        return true;
    }

    const isHtml =
        /<!DOCTYPE\s+html/i.test(clean) ||
        /<html[\s>]/i.test(clean) ||
        /<body[\s>]/i.test(clean) ||
        /<main[\s>]/i.test(clean) ||
        /<div[\s>]/i.test(clean) ||
        /<section[\s>]/i.test(clean);

    return isHtml;
}


/**
 * Extract the first complete JSON object from a string.
 *
 * This does NOT simply use lastIndexOf("}"),
 * because JSX and JavaScript contain many braces.
 */
function extractBalancedJson(text) {
    if (!text || typeof text !== "string") {
        return null;
    }

    const start = text.indexOf("{");

    if (start === -1) {
        return null;
    }

    let depth = 0;
    let inString = false;
    let quote = "";
    let escaped = false;

    for (let i = start; i < text.length; i++) {
        const char = text[i];

        if (inString) {
            if (escaped) {
                escaped = false;
                continue;
            }

            if (char === "\\") {
                escaped = true;
                continue;
            }

            if (char === quote) {
                inString = false;
                quote = "";
            }

            continue;
        }

        if (char === '"' || char === "'") {
            inString = true;
            quote = char;
            continue;
        }

        if (char === "{") {
            depth++;
        }

        if (char === "}") {
            depth--;

            if (depth === 0) {
                return text.slice(start, i + 1);
            }
        }
    }

    return null;
}


/**
 * Try parsing a JSON string and return the normalized result.
 */
function parseJsonArtifact(text) {
    try {
        const parsed = JSON.parse(text);

        if (!parsed || typeof parsed !== "object") {
            return null;
        }

        if (typeof parsed.code !== "string") {
            return null;
        }

        const code = normalizeCode(parsed.code);

        if (!isValidCode(code)) {
            return null;
        }

        return {
            code,
            message:
                typeof parsed.message === "string"
                    ? parsed.message.trim()
                    : "Website generated successfully.",
            imageQueries: Array.isArray(parsed.imageQueries)
                ? parsed.imageQueries
                : []
        };
    } catch (error) {
        return null;
    }
}


/**
 * Extract a React component directly if JSON parsing fails.
 */
function extractReactCode(text) {
    if (!text || typeof text !== "string") {
        return null;
    }

    let code = text.trim();

    // Remove possible JSON prefix
    const codeMatch = code.match(
        /(?:import\s+React|import\s*{[\s\S]*?}\s*from\s*["']react["'])[\s\S]*/i
    );

    if (codeMatch) {
        code = codeMatch[0];
    }

    // Remove trailing markdown fence
    code = code.replace(/\n?```\s*$/g, "");

    code = normalizeCode(code);

    if (!isValidCode(code)) {
        return null;
    }

    return {
        code,
        message: "Website generated successfully.",
        imageQueries: []
    };
}


/**
 * Extract HTML directly if text contains complete HTML document.
 */
function extractHtmlCode(text) {
    if (!text || typeof text !== "string") {
        return null;
    }

    const htmlMatch =
        text.match(/<!DOCTYPE\s+html[\s\S]*?<\/html>/i) ||
        text.match(/<html[\s\S]*?<\/html>/i);

    if (!htmlMatch || !htmlMatch[0]) {
        return null;
    }

    const code = normalizeCode(htmlMatch[0]);

    if (!isValidCode(code)) {
        return null;
    }

    const msgMatch = text.match(/"message"\s*:\s*"([^"]+)"/i);

    return {
        code,
        message: msgMatch ? msgMatch[1] : "Website generated successfully.",
        imageQueries: []
    };
}


/**
 * MAIN EXTRACTOR
 */
export default function extractJson(text) {
    if (!text || typeof text !== "string") {
        return null;
    }

    const cleanRaw = cleanRawResponse(text);

    if (!cleanRaw) {
        return null;
    }

    /*
     * STRATEGY 1: Direct HTML Document Extraction
     * If response contains <!DOCTYPE html> ... </html> or <html> ... </html>,
     * extract it directly for 100% clean markup without any JSON trailing artifacts.
     */
    let result = extractHtmlCode(cleanRaw);

    if (result) {
        return result;
    }

    /*
     * STRATEGY 2: Standard JSON.parse
     */
    result = parseJsonArtifact(cleanRaw);

    if (result) {
        return result;
    }

    /*
     * STRATEGY 3: Find a balanced JSON object inside extra text
     */
    const balancedJson = extractBalancedJson(cleanRaw);

    if (balancedJson) {
        result = parseJsonArtifact(balancedJson);

        if (result) {
            return result;
        }
    }

    /*
     * STRATEGY 4: Decoded JSON string
     */
    try {
        const decoded = JSON.parse(cleanRaw);

        if (typeof decoded === "string") {
            const htmlFromDecoded = extractHtmlCode(decoded);
            if (htmlFromDecoded) return htmlFromDecoded;

            result = parseJsonArtifact(decoded);
            if (result) return result;

            const decodedBalancedJson = extractBalancedJson(decoded);
            if (decodedBalancedJson) {
                result = parseJsonArtifact(decodedBalancedJson);
                if (result) return result;
            }
        }
    } catch (error) {
        // Continue to fallback strategies
    }

    /*
     * STRATEGY 5: Extract React code directly as last resort
     */
    result = extractReactCode(cleanRaw);

    if (result) {
        return result;
    }

    console.error("extractJson failed to extract valid code.");

    return null;
}