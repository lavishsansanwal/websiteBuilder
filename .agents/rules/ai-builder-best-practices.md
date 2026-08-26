# AI Code Builder & Frontend Safety Guidelines

## AI Prompt Engineering for Web Generation
- **Never Request Conciseness for UI Code**: Do not instruct code-generating LLMs to "be concise", "avoid CSS repetition", or "keep it minimal". Instead, explicitly request production-grade CSS styling, Google Fonts, responsive grid/flexbox layouts, and working JavaScript interactivity.
- **Standalone Document Requirements**: Generated HTML must include `<!DOCTYPE html>`, `<head>` with fonts and icon CDNs (Google Fonts, Lucide icons, Chart.js), `<style>` with CSS custom properties, and `<script>` with functional event listeners.

## Image Handling Guardrails
- **No Broken Image Placeholders**: When LLMs generate markup with image placeholders, always run an automated post-processing filter (`injectRealImages`) to replace broken `<img>` `src` attributes with verified, high-resolution Unsplash URLs based on topic keywords and `alt` text.

## Parser & Provider Resilience
- **Robust Multi-Format Parsing**: Ensure JSON parsers handle raw `<!DOCTYPE html>`, markdown code fences (```json, ```html), and repair unescaped quotes/newlines.
- **Provider Fallback**: Maintain multi-provider fallback chains (OpenRouter -> Gemini -> Cerebras -> HuggingFace).

## Frontend Import Safety
- **Named Import Verification**: Before modifying or reorganizing import lists in React files, verify across the entire file that no referenced identifiers are dropped.
