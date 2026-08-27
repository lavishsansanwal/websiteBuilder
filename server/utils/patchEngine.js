/**
 * Robust Incremental Patch Engine for Website Builder
 * 
 * Takes original source code and an array of { search, replace } patches.
 * Supports:
 * 1. Exact verbatim string matching
 * 2. Multi-line whitespace-tolerant & indentation-tolerant fuzzy matching
 * 3. Line-ending normalization (\r\n vs \n)
 * 4. Safety checks preventing truncation or unclosed script blocks
 */

/**
 * Normalizes string for fuzzy comparison (collapses multiple whitespace, normalizes line endings)
 */
function normalizeForComparison(str) {
    if (!str) return "";
    return str
        .replace(/\r\n/g, "\n")
        .replace(/[ \t]+/g, " ")
        .trim();
}

/**
 * Applies an array of search-and-replace patches to the given code
 * @param {string} originalCode - The full HTML or React source code
 * @param {Array<{ search: string, replace: string }>} patches - Array of patch objects
 * @returns {{ success: boolean, updatedCode: string, appliedCount: number, error?: string }}
 */
export function applyPatches(originalCode, patches) {
    if (!originalCode || typeof originalCode !== "string") {
        return { success: false, updatedCode: originalCode, appliedCount: 0, error: "Original code is empty or invalid" };
    }

    if (!Array.isArray(patches) || patches.length === 0) {
        return { success: false, updatedCode: originalCode, appliedCount: 0, error: "No patches provided" };
    }

    // Normalize original code line endings
    let currentCode = originalCode.replace(/\r\n/g, "\n");
    let appliedCount = 0;

    for (let i = 0; i < patches.length; i++) {
        const patch = patches[i];
        if (!patch || typeof patch.search !== "string" || typeof patch.replace !== "string") {
            continue;
        }

        let searchStr = patch.search.replace(/\r\n/g, "\n");
        let replaceStr = patch.replace.replace(/\r\n/g, "\n");

        if (!searchStr.trim()) {
            continue;
        }

        // --- ATTEMPT 1: Exact Verbatim Match ---
        if (currentCode.includes(searchStr)) {
            // Replace first occurrence
            currentCode = currentCode.replace(searchStr, replaceStr);
            appliedCount++;
            continue;
        }

        // --- ATTEMPT 2: Trimmed Search Match ---
        const trimmedSearch = searchStr.trim();
        if (currentCode.includes(trimmedSearch)) {
            currentCode = currentCode.replace(trimmedSearch, replaceStr);
            appliedCount++;
            continue;
        }

        // --- ATTEMPT 3: Line-by-Line Indentation & Whitespace-Tolerant Match ---
        const searchLines = searchStr.split("\n").map(l => l.trim()).filter(l => l.length > 0);
        if (searchLines.length > 0) {
            const codeLines = currentCode.split("\n");
            let matchStartIndex = -1;
            let matchEndIndex = -1;

            for (let c = 0; c <= codeLines.length - searchLines.length; c++) {
                let allMatched = true;
                let sIdx = 0;

                for (let k = 0; k < searchLines.length; k++) {
                    const codeLineTrimmed = codeLines[c + k].trim();
                    const searchLineTrimmed = searchLines[k];

                    if (codeLineTrimmed !== searchLineTrimmed) {
                        allMatched = false;
                        break;
                    }
                }

                if (allMatched) {
                    matchStartIndex = c;
                    matchEndIndex = c + searchLines.length;
                    break;
                }
            }

            if (matchStartIndex !== -1) {
                // Determine original indentation of the first line
                const originalIndent = codeLines[matchStartIndex].match(/^[ \t]*/)[0] || "";
                
                // Format replace lines with proper indentation
                const replaceLines = replaceStr.split("\n").map((line, idx) => {
                    if (idx === 0) return originalIndent + line.trimStart();
                    return line;
                });

                codeLines.splice(matchStartIndex, matchEndIndex - matchStartIndex, ...replaceLines);
                currentCode = codeLines.join("\n");
                appliedCount++;
                continue;
            }
        }

        // --- ATTEMPT 4: Normalized Block Substring Match ---
        const normalizedCurrent = normalizeForComparison(currentCode);
        const normalizedSearch = normalizeForComparison(searchStr);

        if (normalizedCurrent.includes(normalizedSearch)) {
            // Locate approximate index in currentCode
            const firstSearchWord = searchLines[0] || "";
            const lastSearchWord = searchLines[searchLines.length - 1] || "";
            
            const startPos = currentCode.indexOf(firstSearchWord);
            if (startPos !== -1) {
                const endPos = currentCode.indexOf(lastSearchWord, startPos);
                if (endPos !== -1) {
                    const actualEnd = endPos + lastSearchWord.length;
                    currentCode = currentCode.slice(0, startPos) + replaceStr + currentCode.slice(actualEnd);
                    appliedCount++;
                    continue;
                }
            }
        }
    }

    if (appliedCount === 0) {
        return {
            success: false,
            updatedCode: originalCode,
            appliedCount: 0,
            error: "None of the search chunks could be located in the current code"
        };
    }

    // Defensive validation: Ensure code didn't lose major structure (e.g. unclosed script)
    const scriptOpenCount = (currentCode.match(/<script\b/gi) || []).length;
    const scriptCloseCount = (currentCode.match(/<\/script>/gi) || []).length;

    if (scriptOpenCount !== scriptCloseCount) {
        return {
            success: false,
            updatedCode: originalCode,
            appliedCount: 0,
            error: "Patch produced unclosed script tag"
        };
    }

    return {
        success: true,
        updatedCode: currentCode,
        appliedCount
    };
}
