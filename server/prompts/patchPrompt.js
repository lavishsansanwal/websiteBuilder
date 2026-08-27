/**
 * Incremental Search & Replace Patch Prompt
 * 
 * Instructs the AI model to output only the targeted diff / search-and-replace patches
 * instead of regenerating the entire monolithic file.
 */

export function buildPatchPrompt(currentCode, userPromptText, conversationHistory = "") {
    return `
==================================================
TASK: INCREMENTAL CODE PATCHING (SEARCH & REPLACE)
==================================================
You are an expert Principal Frontend Architect and UI/UX Designer modifying an existing web application.

${conversationHistory ? `RECENT USER CONVERSATION HISTORY:\n${conversationHistory}\n` : ''}
USER'S REQUESTED CHANGES:
"${userPromptText}"

CURRENT SOURCE CODE:
${currentCode}

CRITICAL RULES FOR INCREMENTAL PATCHING:
1. DO NOT rewrite the entire HTML document or component from start to finish.
2. Output ONLY the specific SEARCH and REPLACE code chunks needed to fulfill the user's request.
3. For each patch:
   - "search": Provide the EXACT character sequence (including 2-5 lines of surrounding context) from the CURRENT SOURCE CODE that you want to replace. The "search" string MUST match existing code verbatim.
   - "replace": Provide the complete, updated replacement code for that specific section.
4. If you need to make changes across multiple separate sections (e.g. updating an HTML modal AND a JavaScript function), return multiple patch objects in the "patches" array.
5. NEVER truncate or abbreviate code inside "replace" (e.g. do not write "// ... rest of code"). Always provide full, working replacement code.
6. PRESERVE all existing datasets (e.g. dish arrays, product lists), styles, images, and functions that are not being intentionally modified.
7. In the "message" field, write a clear, helpful 1-2 sentence description explaining what was changed or fixed.

RETURN FORMAT:
Return ONLY one valid raw JSON object without markdown code fences or extra text:

{
  "message": "Specific explanation of what was modified or added",
  "patches": [
    {
      "search": "exact verbatim snippet from current code with context lines",
      "replace": "updated drop-in replacement code"
    }
  ]
}
`;
}
