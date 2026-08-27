import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { serverUrl } from "../App";

import {
    Code2,
    Copy,
    Check,
    Download,
    MessageSquare,
    Monitor,
    Rocket,
    Send,
    X
} from "lucide-react";

import {
    AnimatePresence,
    motion
} from "motion/react";

import Editor from "@monaco-editor/react";

const unescapeRawCode = (str) => {
    if (!str || typeof str !== "string") return "";
    let clean = str.trim();

    // 1. Remove outer JSON wrappers like { "code": " ... " } or { code: ' ... ' }
    clean = clean.replace(/^```(?:html|json|javascript|js|jsx|react)?\s*/i, "").replace(/\s*```$/i, "").trim();
    clean = clean.replace(/^\{\s*["']?code["']?\s*:\s*["'`]/i, "").trim();
    clean = clean.replace(/["'`]\s*,\s*["']?message["']?\s*:\s*[\s\S]*?\}\s*$/i, "").trim();
    clean = clean.replace(/["'`]\s*,\s*["']?imageQueries["']?\s*:\s*[\s\S]*?\}\s*$/i, "").trim();
    clean = clean.replace(/["'`]\s*\}\s*$/i, "").trim();

    // 2. Unescape common escape sequences
    if (clean.includes("\\n")) {
        clean = clean.replace(/\\n/g, "\n");
    }
    if (clean.includes("\\r")) {
        clean = clean.replace(/\\r/g, "\r");
    }
    if (clean.includes("\\t")) {
        clean = clean.replace(/\\t/g, "\t");
    }
    if (clean.includes('\\"')) {
        clean = clean.replace(/\\"/g, '"');
    }

    // 3. If there is leftover text before <!DOCTYPE html or <html, trim it cleanly
    const docTypeIdx = clean.search(/<!DOCTYPE\s+html/i);
    if (docTypeIdx > 0) {
        clean = clean.slice(docTypeIdx);
    } else {
        const htmlTagIdx = clean.search(/<html[\s>]/i);
        if (htmlTagIdx > 0 && !clean.includes("<!DOCTYPE")) {
            clean = clean.slice(htmlTagIdx);
        }
    }

    // 4. If there is trailing JSON after </html>, trim it cleanly
    const endHtmlIdx = clean.search(/<\/html>/i);
    if (endHtmlIdx !== -1) {
        clean = clean.slice(0, endHtmlIdx + 7);
    }

    return clean.trim();
};

const getPreviewCode = (rawCode) => {
    if (typeof rawCode !== "string" || !rawCode) {
        return rawCode || "";
    }

    const unescaped = unescapeRawCode(rawCode);
    const trimmed = unescaped.trim();
    const isCompleteHtml = /<!DOCTYPE\s+html/i.test(trimmed) || /<html\b[^>]*>/i.test(trimmed);
    const hasReactHooks = /use(State|Effect|Memo|Ref|Callback|Context|Reducer)\s*\(/i.test(trimmed);
    const hasReactComponent = /export\s+default\s+function|function\s+App\s*\(|const\s+App\s*=|export\s+default\s+class|export\s+default/i.test(trimmed);
    const hasReactImports = /import\s+React/i.test(trimmed) || /from\s+['"]react['"]/i.test(trimmed) || /import\s+\{/i.test(trimmed);

    const isStandaloneReact = !isCompleteHtml && (hasReactHooks || hasReactComponent || hasReactImports);

    if (isStandaloneReact) {
        // Safe Code Cleaner: Preserves entire component declaration and let Babel 'env' handle imports
        const cleanReactCode = (code) => {
            if (!code || typeof code !== "string") return "";

            return code
                // Normalize quotes, smart apostrophes, comments, and backticks
                .replace(/([\p{L}\p{N}])[\u2018\u2019\u201A\u201B]([\p{L}\p{N}])/gu, "$1\\'$2")
                .replace(/([\p{L}\p{N}])(?<!\\)'([\p{L}\p{N}])/gu, "$1\\'$2")
                .replace(/<!--([\s\S]*?)-->/g, "{/*$1*/}")
                .replace(/<!--([\s\S]*?)\*\//g, "{/*$1*/}")
                .replace(/\{\/\*([\s\S]*?)-->/g, "{/*$1*/}")
                .replace(/\{\/\*([\s\S]*?)\*\/(?!\})/g, "{/*$1*/}")
                .replace(/\$\{\s*--+\s*/g, "${")
                .replace(/```(?:jsx|javascript|js|react|html)?/gi, "")
                .replace(/```/g, "")
                .replace(/<!DOCTYPE[^>]*>/gi, "")
                .replace(/<\/?(?:html|head|body)[^>]*>/gi, "")
                // Auto-heal bare unescaped ampersands inside JSX text
                .replace(/(>[^<>{}\n]*?)\s+&\s+([^<>{}\n]*?<)/g, '$1 &amp; $2')
                .trim();
        };

        // Extract imported Lucide icons from raw code
        const extractedIcons = new Set();
        const importLucideRegex = /import\s+\{([\s\S]*?)\}\s+from\s+['"](?:lucide-react|lucide)['"];?/gi;
        let match;
        while ((match = importLucideRegex.exec(trimmed)) !== null) {
            const names = match[1].split(",").map((s) => s.trim().split(/\s+as\s+/)[0].trim()).filter(Boolean);
            names.forEach((n) => extractedIcons.add(n));
        }

        const cleanedReact = cleanReactCode(trimmed);

        return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React Live Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: { sans: ['"Plus Jakarta Sans"', 'sans-serif'] }
        }
      }
    }
  </script>
  <style>
    /* Custom sleek scrollbars */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.6); }
    ::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.3); border-radius: 4px; }
  </style>
</head>
<body class="bg-[#070b12] text-slate-100 font-sans min-h-screen">
  <div id="root"></div>

  <script>
    // Smooth scroll and link interceptor for React preview
    document.addEventListener("click", function(e) {
      var link = e.target.closest("a");
      if (link) {
        var href = (link.getAttribute("href") || "").trim();
        if (href.startsWith("#")) {
          e.preventDefault();
          var id = decodeURIComponent(href.slice(1)).trim();
          if (!id || id === "hero" || id === "top") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
          }
          var target = document.getElementById(id) || document.getElementById(id.toLowerCase()) || document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        } else if (href && !href.startsWith("http://") && !href.startsWith("https://") && !href.startsWith("mailto:") && !href.startsWith("tel:") && !href.startsWith("javascript:")) {
          e.preventDefault();
          var cleanId = href.startsWith("/") ? href.slice(1) : href;
          var fallbackTarget = document.getElementById(cleanId) || document.getElementById(cleanId.toLowerCase());
          if (fallbackTarget) {
            fallbackTarget.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      }
    }, true);

    // Controlled Programmatic Babel & React Mount
    (function() {
      function compileAndMount() {
        if (typeof Babel === 'undefined' || typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
          setTimeout(compileAndMount, 30);
          return;
        }

        var sourceCode = ${JSON.stringify(cleanedReact)};
        var iconList = ${JSON.stringify(Array.from(extractedIcons))};

        try {
          // 1. Universal Lucide Icon Component Factory
          function getLucideIcon(name) {
            return function LucideIconWrapper(props) {
              var size = props.size || props.width || 20;
              var className = props.className || "";
              var strokeWidth = props.strokeWidth || 2;
              var color = props.color || "currentColor";
              var style = props.style || {};

              var kebab = name.replace(/([a-z])([A-Z0-9])/g, '$1-$2').toLowerCase();
              var pascal = name.charAt(0).toUpperCase() + name.slice(1);
              var iconDef = (window.lucide && window.lucide.icons) ?
                (window.lucide.icons[pascal] || window.lucide.icons[name] || window.lucide.icons[kebab]) : null;

              if (iconDef && typeof iconDef.toSvg === 'function') {
                var svgStr = iconDef.toSvg({
                  width: size,
                  height: size,
                  class: className,
                  'stroke-width': strokeWidth,
                  stroke: color
                });
                return React.createElement('span', {
                  className: 'inline-flex items-center justify-center shrink-0 ' + className,
                  style: Object.assign({ display: 'inline-flex', verticalAlign: 'middle' }, style),
                  dangerouslySetInnerHTML: { __html: svgStr },
                  onClick: props.onClick
                });
              }

              return React.createElement('i', {
                'data-lucide': kebab,
                className: className,
                style: Object.assign({ width: size + 'px', height: size + 'px', display: 'inline-block' }, style),
                onClick: props.onClick
              });
            };
          }

          // 2. Pre-declare all standard Lucide icons
          var commonIcons = [
            'Sparkles', 'ArrowRight', 'ArrowLeft', 'Check', 'CheckCircle', 'CheckCircle2',
            'X', 'XCircle', 'Star', 'Heart', 'Shield', 'ShieldCheck', 'Lock', 'Unlock',
            'User', 'Users', 'Mail', 'Phone', 'MapPin', 'Calendar', 'Clock', 'CreditCard',
            'ShoppingCart', 'ShoppingBag', 'Search', 'Menu', 'ChevronDown', 'ChevronUp',
            'ChevronRight', 'ChevronLeft', 'Eye', 'EyeOff', 'Download', 'Upload', 'Copy',
            'ExternalLink', 'Share2', 'Trash', 'Trash2', 'Edit', 'Edit2', 'Plus', 'Minus',
            'Zap', 'Wand2', 'WandSparkles', 'Rocket', 'Globe', 'Layers', 'LayoutDashboard',
            'BarChart', 'BarChart2', 'BarChart3', 'TrendingUp', 'TrendingDown', 'DollarSign',
            'Award', 'Sun', 'Moon', 'RefreshCw', 'Filter', 'Tag', 'Package', 'Coffee',
            'Activity', 'Send', 'MessageSquare', 'Bell', 'Settings', 'Info', 'AlertCircle',
            'Play', 'Code', 'Compass', 'CompassIcon'
          ];

          var allIconsSet = {};
          commonIcons.concat(iconList).forEach(function(i) { allIconsSet[i] = true; });

          var iconBindings = Object.keys(allIconsSet).map(function(n) {
            return 'var ' + n + ' = getLucideIcon("' + n + '");';
          }).join('\\n');

          // 3. Motion and Framer Motion Pass-through
          var motion = new Proxy({}, {
            get: function(_, tag) {
              return React.forwardRef(function(props, ref) {
                var filtered = {};
                for (var k in props) {
                  if (!['initial', 'animate', 'exit', 'transition', 'whileHover', 'whileTap', 'whileInView', 'viewport', 'variants'].includes(k)) {
                    filtered[k] = props[k];
                  }
                }
                return React.createElement(tag, Object.assign({}, filtered, { ref: ref }));
              });
            }
          });
          var AnimatePresence = function(props) { return props.children; };

          // 4. Chart Components
          function createChartComponent(type) {
            return function ChartWrapper(props) {
              var canvasRef = React.useRef(null);
              var chartInstance = React.useRef(null);
              React.useEffect(function() {
                if (canvasRef.current && window.Chart) {
                  if (chartInstance.current) chartInstance.current.destroy();
                  chartInstance.current = new window.Chart(canvasRef.current, {
                    type: type,
                    data: props.data || { labels: [], datasets: [] },
                    options: Object.assign({ responsive: true, maintainAspectRatio: false }, props.options || {})
                  });
                }
                return function() {
                  if (chartInstance.current) chartInstance.current.destroy();
                };
              }, [props.data, props.options]);
              return React.createElement('div', { style: { position: 'relative', width: '100%', height: props.height || '100%', minHeight: '220px' }, className: props.className },
                React.createElement('canvas', { ref: canvasRef })
              );
            };
          }
          var Line = createChartComponent('line');
          var Bar = createChartComponent('bar');
          var Doughnut = createChartComponent('doughnut');
          var Pie = createChartComponent('pie');

          // 5. Toast helper
          function showToast(msg) {
            var existing = document.getElementById('previewGlobalToast');
            if (existing) existing.remove();
            var toast = document.createElement('div');
            toast.id = 'previewGlobalToast';
            toast.className = 'fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-amber-500 text-black text-xs font-extrabold shadow-2xl transition-all duration-300 flex items-center gap-2';
            toast.innerHTML = '<span>' + (msg || 'Action completed!') + '</span>';
            document.body.appendChild(toast);
            setTimeout(function() { toast.remove(); }, 3000);
          }

          // 6. Dynamic Lucide Icon Proxy for un-imported icons
          var LucideIcons = new Proxy({}, {
            get: function(_, name) {
              if (name === '__esModule') return true;
              if (name === 'default') return LucideIcons;
              if (name === 'createIcons') return function() {};
              return getLucideIcon(name);
            }
          });

          // 7. Virtual require() system
          var module = { exports: {} };
          var exports = module.exports;
          function require(mod) {
            if (!mod) return { __esModule: true, default: {} };
            if (mod === 'react') return Object.assign(React, { __esModule: true, default: React });
            if (mod === 'react-dom' || mod === 'react-dom/client') return Object.assign(ReactDOM, { __esModule: true, default: ReactDOM });
            if (mod === 'lucide-react' || mod === 'lucide' || (typeof mod === 'string' && mod.startsWith('react-icons'))) return LucideIcons;
            if (mod === 'framer-motion' || mod === 'motion/react' || mod === 'motion') return { __esModule: true, default: { motion: motion, AnimatePresence: AnimatePresence }, motion: motion, AnimatePresence: AnimatePresence };
            if (mod === 'react-chartjs-2') return { __esModule: true, default: { Line: Line, Bar: Bar, Doughnut: Doughnut, Pie: Pie }, Line: Line, Bar: Bar, Doughnut: Doughnut, Pie: Pie };
            if (mod === 'chart.js' || mod === 'chart.js/auto') return Object.assign(window.Chart || {}, { __esModule: true, default: window.Chart });
            if (mod === 'clsx' || mod === 'classnames') {
              var clsxFn = function() { return Array.prototype.slice.call(arguments).filter(Boolean).join(' '); };
              return Object.assign(clsxFn, { __esModule: true, default: clsxFn, clsx: clsxFn });
            }
            if (mod === 'tailwind-merge') {
              var twFn = function() { return Array.prototype.slice.call(arguments).filter(Boolean).join(' '); };
              return Object.assign(twFn, { __esModule: true, default: twFn, twMerge: twFn });
            }
            return { __esModule: true, default: {} };
          }

          // 8. Compile JSX & Module Syntax with Babel Standalone ('env' + 'react' presets)
          var compiled;
          try {
            compiled = Babel.transform(sourceCode, {
              presets: ['react', 'env']
            }).code;
          } catch (transErr) {
            compiled = Babel.transform(sourceCode, {
              presets: ['react']
            }).code;
          }

          // 9. Execute in sandbox scope
          var { useState, useEffect, useMemo, useRef, useCallback, useContext, useReducer } = React;
          var runner = new Function(
            'React', 'ReactDOM', 'useState', 'useEffect', 'useMemo', 'useRef', 'useCallback', 'useContext', 'useReducer',
            'motion', 'AnimatePresence', 'Line', 'Bar', 'Doughnut', 'Pie', 'showToast', 'LucideIcons', 'getLucideIcon', 'require', 'module', 'exports',
            iconBindings + '\\n' + compiled + '\\nreturn (typeof App !== "undefined" ? App : (typeof Dashboard !== "undefined" ? Dashboard : (typeof Website !== "undefined" ? Website : (typeof LandingPage !== "undefined" ? LandingPage : (typeof LeadGeneration !== "undefined" ? LeadGeneration : (module.exports.default || module.exports || exports.default || exports))))));'
          );

          var ComponentToMount = runner(
            React, ReactDOM, useState, useEffect, useMemo, useRef, useCallback, useContext, useReducer,
            motion, AnimatePresence, Line, Bar, Doughnut, Pie, showToast, LucideIcons, getLucideIcon, require, module, exports
          );

          if (ComponentToMount) {
            var rootEl = document.getElementById('root');
            if (rootEl) {
              var root = ReactDOM.createRoot(rootEl);
              root.render(React.createElement(ComponentToMount));
            }
          }
        } catch (err) {
          console.error('React Live Preview Compilation Error:', err);
          var root = document.getElementById('root');
          if (root) {
            root.innerHTML = '<div style="padding: 36px 24px; color: #f87171; font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 40px auto; background: #0f172a; border: 1px solid #334155; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); text-align: center;">' +
              '<div style="font-size: 20px; font-weight: 800; margin-bottom: 10px; color: #fca5a5; display: flex; align-items: center; justify-content: center; gap: 8px;"><span>⚠️</span> Component Syntax Notice</div>' +
              '<div style="font-size: 13px; color: #cbd5e1; line-height: 1.6; margin-bottom: 16px; word-break: break-word; background: #020617; padding: 14px; border-radius: 12px; font-family: monospace; border: 1px solid #1e293b; text-align: left;">' + (err.message || String(err)) + '</div>' +
              '<div style="font-size: 12px; color: #94a3b8;">Tip: Edit code in the Code Editor tab or prompt the AI to auto-fix the syntax.</div>' +
              '</div>';
          }
        }
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', compileAndMount);
      } else {
        compileAndMount();
      }
    })();
  </script>
</body>
</html>`;
    }

    // Safely remove only the legacy inline defensive helper script without touching CDNs or document structure
    let sanitizedHtml = unescaped
        .replace(/<script>(?:(?!<\/script>)[\s\S])*?__DEFENSIVE_HELPERS__[\s\S]*?<\/script>/gi, "")
        .replace(/<script>(?:(?!<\/script>)[\s\S])*?Auto-initialize Lucide Icons[\s\S]*?<\/script>/gi, "")
        .replace(/<div[^>]*class="[^"]*h-14[^"]*"[^>]*>[\s\S]*?Live Preview[\s\S]*?Deploy[\s\S]*?<\/div>/gi, "")
        .replace(/<header[^>]*class="[^"]*h-14[^"]*"[^>]*>[\s\S]*?Live Preview[\s\S]*?Deploy[\s\S]*?<\/header>/gi, "");

    const navigationGuard = `
<script>
(function () {
    // Auto-initialize Lucide Icons on load & updates
    function initLucideIcons() {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLucideIcons);
    } else {
        initLucideIcons();
    }
    window.addEventListener('load', initLucideIcons);
    setTimeout(initLucideIcons, 100);
    setTimeout(initLucideIcons, 500);
    setTimeout(initLucideIcons, 1200);

    // Defensive global helpers
    window.openModal = window.openModal || function(id) {
        var el = document.getElementById(id);
        if (el) { el.style.display = 'flex'; }
        initLucideIcons();
    };
    window.closeModal = window.closeModal || function(id) {
        var el = document.getElementById(id);
        if (el) { el.style.display = 'none'; }
    };
    window.toggleDrawer = window.toggleDrawer || function(id) {
        var el = document.getElementById(id);
        if (el) { el.classList.toggle('translate-x-full'); }
        initLucideIcons();
    };
    window.showToast = function(msg) {
        var existing = document.getElementById('globalToast');
        if (existing) existing.remove();
        var toast = document.createElement('div');
        toast.id = 'globalToast';
        toast.className = 'fixed bottom-6 right-6 z-[99999] px-5 py-3.5 rounded-2xl bg-emerald-500 text-black text-xs font-extrabold shadow-2xl transition-all duration-300 flex items-center gap-2 border border-emerald-300 pointer-events-none animate-bounce';
        toast.innerHTML = '<span class="text-sm">⚡</span><span>' + (msg || 'Action completed successfully!') + '</span>';
        document.body.appendChild(toast);
        setTimeout(function() { toast.remove(); }, 3500);
    };

    // Universal Interactive Lead & Pre-Order Submission Engine
    window.originalModalHtmlMap = window.originalModalHtmlMap || {};
    window.originalFormHtmlMap = window.originalFormHtmlMap || {};

    window.submitLeadForm = function(e) {
        if (e && e.preventDefault) e.preventDefault();
        var form = (e && e.target && e.target.tagName === 'FORM') ? e.target : (e && e.target && e.target.closest ? e.target.closest('form') : (document.querySelector('#leadModal form') || document.querySelector('#heroFormContainer form') || document.querySelector('form')));
        if (!form) return;

        var nameInput = form.querySelector('input[name="name"], input[placeholder*="Name"], input[placeholder*="Morgan"], input[placeholder*="John"], input[type="text"]');
        var emailInput = form.querySelector('input[name="email"], input[placeholder*="email"], input[placeholder*="@"], input[type="email"]');
        var phoneInput = form.querySelector('input[name="phone"], input[placeholder*="Phone"], input[placeholder*="0000"], input[type="tel"]');

        var hasNameField = !!nameInput;
        var hasPhoneField = !!phoneInput;

        var name = (nameInput && nameInput.value && nameInput.value.trim()) ? nameInput.value.trim() : (hasNameField ? 'Lavish Chaudhary' : 'Member');
        var email = (emailInput && emailInput.value && emailInput.value.trim()) ? emailInput.value.trim() : 'alex@enterprise.com';
        var phone = (phoneInput && phoneInput.value && phoneInput.value.trim()) ? phoneInput.value.trim() : '';

        var submitBtn = form.querySelector('button[type="submit"], button:not([type="button"])') || form.querySelector('button');
        var modalContainer = form.closest('#leadModal, [id*="modal"], [id*="Modal"], .fixed.inset-0');
        var modalCard = modalContainer ? (modalContainer.querySelector('#leadModalCard, .glass-panel, .glass-card, [class*="rounded-"]') || modalContainer.firstElementChild) : null;
        var heroContainer = form.closest('#heroFormContainer, .glass-card, section, div');

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="inline-block animate-spin mr-2">⚡</span> Processing Request...';
        }

        setTimeout(function() {
            var refId = Math.floor(10000 + Math.random() * 90000);

            try {
                localStorage.setItem('aether_preorder_lead', JSON.stringify({
                    name: name,
                    email: email,
                    phone: phone,
                    refId: 'REF-' + refId,
                    status: 'Active Request Confirmed',
                    timestamp: new Date().toLocaleString()
                }));
            } catch (err) {}

            var phoneRowHtml = (hasPhoneField && phone) ? '<div class="flex items-center justify-between border-t border-slate-800/80 pt-2"><span class="text-slate-400">Mobile Updates:</span><span class="text-white font-mono font-bold">' + phone + '</span></div>' : '';
            var nameHeading = hasNameField ? 'Request Confirmed for ' + name + '!' : 'Request Confirmed!';

            if (modalCard) {
                modalCard.innerHTML = '<div class="text-center space-y-4 py-2 animate-fadeIn text-left sm:text-center">' +
                    '<button onclick="closeModal(\\'leadModal\\'); if(this.closest(\\'.fixed\\')) this.closest(\\'.fixed\\').style.display=\\'none\\';" class="absolute top-5 right-5 text-slate-400 hover:text-white transition p-1 rounded-full hover:bg-slate-800">' +
                        '<i data-lucide="x" class="w-5 h-5"></i>' +
                    '</button>' +
                    '<div class="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-3xl shadow-lg shadow-emerald-500/20">✓</div>' +
                    '<div class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">' +
                        '<span>CONFIRMATION ID:</span> <strong>#REF-' + refId + '</strong>' +
                    '</div>' +
                    '<h3 class="text-2xl font-extrabold text-white">' + nameHeading + '</h3>' +
                    '<p class="text-slate-300 text-xs leading-relaxed max-w-md mx-auto">' +
                        'We received your details successfully. Complete access and verification link sent to <strong class="text-emerald-300">' + email + '</strong>.' +
                    '</p>' +
                    '<div class="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-left space-y-2.5 text-xs">' +
                        '<div class="flex items-center justify-between"><span class="text-slate-400">Email Address:</span><span class="text-emerald-400 font-bold">' + email + '</span></div>' +
                        '<div class="flex items-center justify-between"><span class="text-slate-400">Status:</span><span class="text-emerald-300 font-bold">Priority Processing Active</span></div>' +
                        phoneRowHtml +
                    '</div>' +
                    '<button onclick="closeModal(\\'leadModal\\'); if(this.closest(\\'.fixed\\')) this.closest(\\'.fixed\\').style.display=\\'none\\';" class="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-extrabold text-xs hover:opacity-95 transition flex items-center justify-center gap-2 shadow-lg cursor-pointer">' +
                        '<span>Done • Return to Site</span>' +
                    '</button>' +
                '</div>';
                initLucideIcons();
            } else if (heroContainer) {
                heroContainer.innerHTML = '<div class="text-center space-y-4 py-2 animate-fadeIn">' +
                    '<div class="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-2xl shadow-lg shadow-emerald-500/20">✓</div>' +
                    '<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono">' +
                        '<span>CONFIRMATION ID:</span> <strong>#REF-' + refId + '</strong>' +
                    '</div>' +
                    '<h3 class="text-2xl font-extrabold text-white">' + nameHeading + '</h3>' +
                    '<p class="text-slate-300 text-xs leading-relaxed max-w-md mx-auto">' +
                        'We received your submission. Complete access materials and layout have been prepared for <strong class="text-emerald-300">' + email + '</strong>.' +
                    '</p>' +
                    '<div class="p-4 rounded-xl bg-slate-900 border border-slate-800 text-left space-y-2 text-xs">' +
                        '<div class="flex justify-between"><span class="text-slate-400">Email:</span><span class="text-white font-bold">' + email + '</span></div>' +
                        '<div class="flex justify-between"><span class="text-slate-400">Status:</span><span class="text-emerald-400 font-bold">Fast-Track Active</span></div>' +
                        phoneRowHtml +
                    '</div>' +
                '</div>';
                initLucideIcons();
            }

            window.showToast('🎉 Request submitted successfully! Confirmation sent to ' + email);
        }, 600);
    };

    // Auto-delegate any form submit in iframe to submitLeadForm
    document.addEventListener("submit", function(e) {
        e.preventDefault();
        window.submitLeadForm(e);
    }, true);
    window.handleMenuSearch = window.handleMenuSearch || function(q) {
        var query = (q || '').toLowerCase().trim();
        var items = document.querySelectorAll('[data-name], .menu-item, .glass-card, [data-category]');
        items.forEach(function(item) {
            if (item.closest('header') || item.closest('footer') || item.closest('nav')) return;
            var text = item.textContent.toLowerCase();
            item.style.display = (!query || text.includes(query)) ? '' : 'none';
        });
    };
    window.filterMenu = window.filterMenu || function(cat) {
        var category = (cat || 'all').toLowerCase().trim();
        var items = document.querySelectorAll('[data-category]');
        items.forEach(function(item) {
            var itemCat = (item.getAttribute('data-category') || '').toLowerCase();
            item.style.display = (category === 'all' || itemCat.includes(category)) ? '' : 'none';
        });
    };
    // Table & Dataset Filters
    window.filterTable = window.filterTable || function(q) {
        var query = (q || '').toLowerCase().trim();
        var rows = document.querySelectorAll('#tableBody tr, tbody tr, .table-row, [data-row]');
        rows.forEach(function(row) {
            var text = row.textContent.toLowerCase();
            row.style.display = (!query || text.includes(query)) ? '' : 'none';
        });
    };
    window.filterStatus = window.filterStatus || function(status) {
        var s = (status || '').toLowerCase().trim();
        var rows = document.querySelectorAll('#tableBody tr, tbody tr, .table-row, [data-row]');
        rows.forEach(function(row) {
            if (!s || s === 'all' || s === 'all types' || s === 'all status' || s === 'all categories') {
                row.style.display = '';
            } else {
                var text = row.textContent.toLowerCase();
                row.style.display = text.includes(s) ? '' : 'none';
            }
        });
    };
    window.filterType = window.filterType || window.filterStatus;
    window.filterCategory = window.filterCategory || window.filterStatus;
    window.filterData = window.filterData || window.filterStatus;

    // Table Sorting Engine
    window.sortTable = window.sortTable || function(param) {
        var table = document.querySelector('table');
        if (!table) return;
        var tbody = table.querySelector('tbody') || table;
        var rows = Array.from(tbody.querySelectorAll('tr'));
        if (rows.length < 2) return;

        var isNumericParam = !isNaN(Number(param)) && param !== '' && typeof param !== 'boolean';
        var colIndex = isNumericParam ? Number(param) : 0;
        var sortDirection = 'asc';
        var sortStr = String(param || '').toLowerCase();

        if (sortStr.includes('desc') || sortStr.includes('high') || sortStr.includes('z-a')) {
            sortDirection = 'desc';
        }

        if (!isNumericParam) {
            var headers = Array.from(table.querySelectorAll('th'));
            for (var h = 0; h < headers.length; h++) {
                var thText = headers[h].textContent.toLowerCase().trim();
                if (sortStr.includes(thText) || (thText.includes('download') && sortStr.includes('download')) || (thText.includes('comp') && sortStr.includes('comp')) || (thText.includes('rank') && sortStr.includes('rank')) || (thText.includes('volume') && sortStr.includes('volume')) || (thText.includes('search') && sortStr.includes('search'))) {
                    colIndex = h;
                    break;
                }
            }
        }

        rows.sort(function(a, b) {
            var cellA = (a.children[colIndex] ? a.children[colIndex].textContent : '').trim();
            var cellB = (b.children[colIndex] ? b.children[colIndex].textContent : '').trim();

            var numA = parseFloat(cellA.split('').filter(function(c) { return (c >= '0' && c <= '9') || c === '.' || c === '-'; }).join(''));
            var numB = parseFloat(cellB.split('').filter(function(c) { return (c >= '0' && c <= '9') || c === '.' || c === '-'; }).join(''));

            if (!isNaN(numA) && !isNaN(numB)) {
                return sortDirection === 'desc' ? numB - numA : numA - numB;
            }
            return sortDirection === 'desc' ? cellB.localeCompare(cellA) : cellA.localeCompare(cellB);
        });

        rows.forEach(function(row) { tbody.appendChild(row); });
        if (window.showToast) window.showToast('Sorted table by ' + (param || 'column'));
    };
    window.handleSort = window.handleSort || window.sortTable;

    // Export to CSV Engine
    window.exportToCSV = window.exportToCSV || function() {
        var table = document.querySelector('table');
        if (!table) {
            if (window.showToast) window.showToast('No table records found to export.');
            return;
        }
        var csv = [];
        var rows = table.querySelectorAll('tr');
        rows.forEach(function(row) {
            if (row.style.display === 'none') return;
            var cols = row.querySelectorAll('th, td');
            var rowData = [];
            cols.forEach(function(col) {
                var text = (col.innerText || col.textContent || '').split(String.fromCharCode(10)).join(' ').replace(/"/g, '""').trim();
                rowData.push('"' + text + '"');
            });
            if (rowData.length > 0) csv.push(rowData.join(','));
        });

        var csvString = csv.join(String.fromCharCode(10));
        var blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'keyword_dataset_export_' + Date.now() + '.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        if (window.showToast) window.showToast('Dataset exported as CSV! 📥');
    };
    window.exportData = window.exportData || window.exportToCSV;
    window.downloadCSV = window.downloadCSV || window.exportToCSV;
    window.exportReport = window.exportReport || window.exportToCSV;
    window.exportDataset = window.exportDataset || window.exportToCSV;

    // SaaS & UI Interactive Engine
    window.switchDemoStep = function(step) {
        var stepNum = parseInt(step, 10) || 0;
        var panels = document.querySelectorAll('.demo-panel, [id^="demo-step-"], [id^="step-panel-"]');
        panels.forEach(function(panel, idx) {
            var id = panel.id || '';
            var isTarget = id === 'demo-step-' + stepNum || id === 'step-panel-' + stepNum || idx === stepNum;
            if (isTarget) {
                panel.classList.remove('hidden');
                panel.style.display = 'grid';
            } else {
                panel.classList.add('hidden');
                panel.style.display = 'none';
            }
        });

        var buttons = document.querySelectorAll('.demo-tab-btn, [id^="tab-btn-"], [onclick*="switchDemoStep"]');
        buttons.forEach(function(btn, idx) {
            var isTarget = btn.id === 'tab-btn-' + stepNum || (btn.getAttribute('onclick') || '').includes('(' + stepNum + ')') || idx === stepNum;
            if (isTarget) {
                btn.classList.add('active-tab', 'bg-brand-600', 'bg-indigo-600', 'text-white', 'shadow-lg');
                btn.classList.remove('text-slate-400', 'hover:text-white', 'bg-transparent');
                var badge = btn.querySelector('span:first-child');
                if (badge) {
                    badge.classList.remove('bg-slate-800');
                    badge.classList.add('bg-white/20');
                }
            } else {
                btn.classList.remove('active-tab', 'bg-brand-600', 'bg-indigo-600', 'text-white', 'shadow-lg');
                btn.classList.add('text-slate-400', 'hover:text-white');
                var badge = btn.querySelector('span:first-child');
                if (badge) {
                    badge.classList.add('bg-slate-800');
                    badge.classList.remove('bg-white/20');
                }
            }
        });

        if (window.lucide) {
            try { lucide.createIcons(); } catch(e) {}
        }
    };
    window.switchStep = window.switchDemoStep;
    window.setDemoStep = window.switchDemoStep;
    window.selectDemoStep = window.switchDemoStep;

    window.selectVolumePill = function(btn) {
        if (!btn) return;
        var parent = btn.parentElement || document;
        var pills = parent.querySelectorAll('.vol-pill, [onclick*="selectVolumePill"]');
        pills.forEach(function(p) {
            p.classList.remove('active-pill', 'bg-brand-600/30', 'border-brand-500', 'text-white', 'bg-indigo-600/30', 'border-indigo-500');
            p.classList.add('border-slate-800', 'bg-slate-900/80', 'text-slate-400');
        });
        btn.classList.add('active-pill', 'bg-brand-600/30', 'border-brand-500', 'text-white');
        btn.classList.remove('border-slate-800', 'bg-slate-900/80', 'text-slate-400');
    };

    window.isBillingAnnual = window.isBillingAnnual || false;
    window.toggleBilling = function() {
        window.isBillingAnnual = !window.isBillingAnnual;
        var dot = document.getElementById('toggleDot');
        if (dot) {
            if (window.isBillingAnnual) {
                dot.classList.add('translate-x-6');
                dot.classList.remove('translate-x-0');
            } else {
                dot.classList.remove('translate-x-6');
                dot.classList.add('translate-x-0');
            }
        }
        var monthlyText = document.getElementById('toggleMonthlyText');
        var annualText = document.getElementById('toggleAnnualText');
        if (monthlyText && annualText) {
            if (window.isBillingAnnual) {
                monthlyText.classList.remove('text-white', 'font-bold');
                monthlyText.classList.add('text-slate-400', 'font-semibold');
                annualText.classList.add('text-white', 'font-bold');
                annualText.classList.remove('text-slate-400', 'font-semibold');
            } else {
                monthlyText.classList.add('text-white', 'font-bold');
                monthlyText.classList.remove('text-slate-400', 'font-semibold');
                annualText.classList.remove('text-white', 'font-bold');
                annualText.classList.add('text-slate-400', 'font-semibold');
            }
        }
        if (window.togglePricing) {
            window.togglePricing(window.isBillingAnnual);
        }
    };

    window.scrollToContact = function() {
        var el = document.getElementById('contact') || document.getElementById('demo') || document.querySelector('form');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            var input = el.querySelector('input');
            if (input) setTimeout(function() { input.focus(); }, 400);
        } else if (window.openLeadModal) {
            window.openLeadModal('Lead Inbound Request');
        }
    };

    window.openLeadModal = function(title) { 
        var modal = document.getElementById('leadModal') || document.getElementById('contactModal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.remove('hidden');
            if (title) {
                var headerEl = modal.querySelector('h3, .modal-title');
                if (headerEl) headerEl.textContent = title;
            }
            if (window.lucide) try { lucide.createIcons(); } catch(e) {}
            return;
        }

        var dynamicModal = document.getElementById('dynamicLeadModal');
        if (!dynamicModal) {
            dynamicModal = document.createElement('div');
            dynamicModal.id = 'dynamicLeadModal';
            dynamicModal.className = 'fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn';
            
            var modalTitle = (typeof title === 'string' && title) ? title : 'Request Access & Free Leads';

            dynamicModal.innerHTML = '<div class="glass-card relative w-full max-w-md rounded-3xl p-6 sm:p-8 border border-slate-700 bg-slate-950/95 shadow-2xl text-left">' +
                '<button onclick="window.closeLeadModal()" class="absolute top-5 right-5 text-slate-400 hover:text-white transition p-1.5 rounded-full hover:bg-slate-800">' +
                    '<i data-lucide="x" class="w-5 h-5"></i>' +
                '</button>' +
                '<div class="flex items-center gap-2 text-brand-400 text-xs font-bold tracking-widest uppercase mb-2">' +
                    '<i data-lucide="zap" class="w-4 h-4"></i> Priority Access' +
                '</div>' +
                '<h3 class="text-2xl font-extrabold text-white mb-1.5">' + modalTitle + '</h3>' +
                '<p class="text-slate-400 text-xs mb-6">Complete your request below to get started instantly.</p>' +
                '<form onsubmit="event.preventDefault(); window.submitLeadForm(event)" class="space-y-4">' +
                    '<div class="space-y-1.5">' +
                        '<label class="block text-xs font-bold text-slate-300">Full Name</label>' +
                        '<div class="relative flex items-center">' +
                            '<i data-lucide="user" class="w-4 h-4 text-brand-400 absolute left-3.5 pointer-events-none"></i>' +
                            '<input type="text" name="name" required placeholder="Alex Morgan" class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500 transition">' +
                        '</div>' +
                    '</div>' +
                    '<div class="space-y-1.5">' +
                        '<label class="block text-xs font-bold text-slate-300">Work Email</label>' +
                        '<div class="relative flex items-center">' +
                            '<i data-lucide="mail" class="w-4 h-4 text-brand-400 absolute left-3.5 pointer-events-none"></i>' +
                            '<input type="email" name="email" required placeholder="alex@company.com" class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500 transition">' +
                        '</div>' +
                    '</div>' +
                    '<div class="pt-2">' +
                        '<button type="submit" class="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-brand-500/30 hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer">' +
                            '<span>Claim Access & Free Leads ➔</span>' +
                        '</button>' +
                    '</div>' +
                '</form>' +
            '</div>';

            document.body.appendChild(dynamicModal);
        } else {
            dynamicModal.style.display = 'flex';
        }

        if (window.lucide) {
            try { lucide.createIcons(); } catch(e) {}
        }
    };

    window.closeLeadModal = function() { 
        var modal = document.getElementById('leadModal') || document.getElementById('contactModal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.add('hidden');
        }
        var dynamicModal = document.getElementById('dynamicLeadModal');
        if (dynamicModal) {
            dynamicModal.style.display = 'none';
        }
    };

    window.openModal = function(id) {
        var modal = id ? document.getElementById(id) : null;
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.remove('hidden');
            if (window.lucide) try { lucide.createIcons(); } catch(e) {}
            return;
        }
        var lower = (id || '').toLowerCase();
        if (lower.includes('sign') || lower.includes('login') || lower.includes('auth')) {
            window.openSignInModal();
        } else {
            window.openLeadModal();
        }
    };

    window.closeModal = function(id) {
        var modal = id ? document.getElementById(id) : null;
        if (modal) {
            modal.style.display = 'none';
            modal.classList.add('hidden');
        }
        window.closeSignInModal();
        window.closeLeadModal();
    };

    // Auto-repair any form missing a submit button on load
    setTimeout(function() {
        var allForms = document.querySelectorAll('form');
        allForms.forEach(function(f) {
            if (!f.querySelector('button[type="submit"], input[type="submit"]')) {
                var submitDiv = document.createElement('div');
                submitDiv.className = 'pt-4';
                submitDiv.innerHTML = '<button type="submit" class="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-xl shadow-brand-500/30 hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer">' +
                    '<span>Submit Request & Claim Free Leads ➔</span>' +
                '</button>';
                f.appendChild(submitDiv);
            }
        });
    }, 100);

    // Universal Sign In / Auth Modal Engine
    window.openSignInModal = function(titleOrEmail) {
        var existingModal = document.getElementById('signInModal') || document.getElementById('loginModal') || document.getElementById('authModal');
        if (existingModal) {
            existingModal.style.display = 'flex';
            existingModal.classList.remove('hidden');
            return;
        }

        var dynamicModal = document.getElementById('dynamicSignInModal');
        if (!dynamicModal) {
            dynamicModal = document.createElement('div');
            dynamicModal.id = 'dynamicSignInModal';
            dynamicModal.className = 'fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn';
            
            var prefilledEmail = (typeof titleOrEmail === 'string' && titleOrEmail.includes('@')) ? titleOrEmail.trim() : 'alex@enterprise.com';
            var modalTitle = (typeof titleOrEmail === 'string' && !titleOrEmail.includes('@')) ? titleOrEmail : 'Sign In to Your Account';

            dynamicModal.innerHTML = '<div class="glass-card relative w-full max-w-md rounded-3xl p-6 sm:p-8 border border-slate-700 bg-slate-950/95 shadow-2xl text-left">' +
                '<button onclick="window.closeSignInModal()" class="absolute top-5 right-5 text-slate-400 hover:text-white transition p-1.5 rounded-full hover:bg-slate-800">' +
                    '<i data-lucide="x" class="w-5 h-5"></i>' +
                '</button>' +
                '<div class="flex items-center gap-2 text-brand-400 text-xs font-bold tracking-widest uppercase mb-2">' +
                    '<i data-lucide="lock" class="w-4 h-4"></i> Secure Authentication' +
                '</div>' +
                '<h3 class="text-2xl font-extrabold text-white mb-1.5">' + modalTitle + '</h3>' +
                '<p class="text-slate-400 text-xs mb-6">Enter your registered email and password to access the portal.</p>' +
                '<form onsubmit="event.preventDefault(); window.submitSignInForm(event)" class="space-y-4">' +
                    '<div class="space-y-1.5">' +
                        '<label class="block text-xs font-bold text-slate-300">Email Address</label>' +
                        '<div class="relative flex items-center">' +
                            '<i data-lucide="mail" class="w-4 h-4 text-brand-400 absolute left-3.5 pointer-events-none"></i>' +
                            '<input type="email" name="email" required value="' + prefilledEmail + '" placeholder="name@company.com" class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition">' +
                        '</div>' +
                    '</div>' +
                    '<div class="space-y-1.5">' +
                        '<div class="flex justify-between items-center">' +
                            '<label class="block text-xs font-bold text-slate-300">Password</label>' +
                            '<a href="javascript:void(0)" onclick="window.showToast(\\'Password reset link sent to email! 🔑\\')" class="text-[11px] text-brand-400 hover:underline">Forgot password?</a>' +
                        '</div>' +
                        '<div class="relative flex items-center">' +
                            '<i data-lucide="key" class="w-4 h-4 text-brand-400 absolute left-3.5 pointer-events-none"></i>' +
                            '<input type="password" name="password" required value="••••••••••••" placeholder="Enter your password" class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition">' +
                        '</div>' +
                    '</div>' +
                    '<div class="pt-2">' +
                        '<button type="submit" class="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-brand-500/30 hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer">' +
                            '<span>Sign In to Portal ➔</span>' +
                        '</button>' +
                    '</div>' +
                '</form>' +
            '</div>';

            document.body.appendChild(dynamicModal);
        } else {
            dynamicModal.style.display = 'flex';
        }

        if (window.lucide) {
            try { lucide.createIcons(); } catch(e) {}
        }
    };

    window.closeSignInModal = function() {
        var existingModal = document.getElementById('signInModal') || document.getElementById('loginModal') || document.getElementById('authModal');
        if (existingModal) {
            existingModal.style.display = 'none';
            existingModal.classList.add('hidden');
        }
        var dynamicModal = document.getElementById('dynamicSignInModal');
        if (dynamicModal) {
            dynamicModal.style.display = 'none';
        }
    };

    window.submitSignInForm = function(e) {
        if (e && e.preventDefault) e.preventDefault();
        var form = (e && e.target) ? e.target : document.querySelector('#dynamicSignInModal form');
        var email = (form && form.querySelector('input[type="email"]')) ? form.querySelector('input[type="email"]').value : 'alex@enterprise.com';
        var btn = form ? form.querySelector('button[type="submit"]') : null;
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<span class="inline-block animate-spin mr-2">⚡</span> Authenticating...';
        }
        setTimeout(function() {
            window.closeSignInModal();
            window.showToast('✨ Signed in successfully as ' + email + '!');
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<span>Sign In to Portal ➔</span>';
            }
        }, 600);
    };

    window.openLoginModal = window.openSignInModal;
    window.openAuthModal = window.openSignInModal;
    window.openSignUpModal = window.openSignInModal;
    window.openSignupModal = window.openSignInModal;
    window.closeLoginModal = window.closeSignInModal;
    window.closeAuthModal = window.closeSignInModal;
    window.toggleFaq = window.toggleFaq || function(btn) {
        if (!btn) return;
        var content = btn.nextElementSibling || (btn.parentElement && btn.parentElement.querySelector('.faq-answer, .faq-content, p'));
        if (content) content.classList.toggle('hidden');
    };
    window.togglePricing = window.togglePricing || function(isAnnual) {
        var prices = document.querySelectorAll('.price-val, [data-monthly]');
        prices.forEach(function(el) {
            var m = el.getAttribute('data-monthly');
            var a = el.getAttribute('data-annual');
            if (m && a) el.textContent = isAnnual ? a : m;
        });
    };

    window.submitReservation = window.submitReservation || function(e) {
        if (e && e.preventDefault) e.preventDefault();
        window.showToast('Table reservation confirmed! Reference #RES-' + Math.floor(1000 + Math.random() * 9000));
        window.closeModal('reservationModal');
    };
    window.submitReview = window.submitReview || function(e) {
        if (e && e.preventDefault) e.preventDefault();
        window.showToast('Thank you! Your review has been submitted.');
        window.closeModal('reviewModal');
    };
    window.addToCart = window.addToCart || function(id) {
        window.showToast('Item added to order! 🛒');
    };

    // Auto-delegate select dropdown changes
    document.addEventListener("change", function(e) {
        var sel = e.target.closest("select");
        if (sel) {
            var val = sel.value;
            var valLower = val.toLowerCase();
            if (valLower.includes('high') || valLower.includes('low') || valLower.includes('sort') || valLower.includes('asc') || valLower.includes('desc')) {
                window.sortTable(val);
            } else {
                window.filterStatus(val);
            }
        }
    }, true);

    // Auto-delegate search inputs to filterTable
    document.addEventListener("input", function(e) {
        var inp = e.target.closest("input");
        if (inp && (inp.type === 'text' || inp.type === 'search' || !inp.type)) {
            var ph = (inp.placeholder || '').toLowerCase();
            if (ph.includes('search') || ph.includes('filter') || ph.includes('keyword') || ph.includes('term') || ph.includes('quick')) {
                window.filterTable(inp.value);
            }
        }
    }, true);

    // Auto-delegate export buttons
    document.addEventListener("click", function(e) {
        var btn = e.target.closest("button, a");
        if (btn) {
            var txt = (btn.textContent || '').toLowerCase();
            if (txt.includes('export') || txt.includes('download csv') || txt.includes('export csv') || txt.includes('export report') || txt.includes('export dataset')) {
                window.exportToCSV();
                return;
            }
            var isSubmit = btn.type === 'submit' || (btn.getAttribute('onclick') || '').includes('submitLeadForm');
            if (isSubmit || txt.includes('pre-order') || txt.includes('secure my') || txt.includes('get my custom') || txt.includes('reserve access') || txt.includes('claim hardware')) {
                e.preventDefault();
                e.stopPropagation();
                window.submitLeadForm(e);
            }
        }
    }, true);

    // 1. Intercept ALL link clicks inside iframe in CAPTURE phase to prevent iframe from navigating to parent / routes
    function handleGlobalClick(event) {
        var link = event.target.closest("a");
        if (link) {
            var href = (link.getAttribute("href") || "").trim();

            // ALWAYS prevent default browser navigation
            event.preventDefault();
            event.stopPropagation();

            if (!href || href === "#" || href === "/" || href.startsWith("javascript:")) {
                return;
            }

            // Smooth scroll for hash links (#menu, #story, #specialties, #reviews, #location)
            if (href.startsWith("#")) {
                var targetId = decodeURIComponent(href.slice(1)).trim();
                var target = document.getElementById(targetId) || 
                             document.getElementById(targetId.toLowerCase()) || 
                             document.querySelector('[name="' + targetId + '"]') ||
                             document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                }
                return;
            }

            // Open external links in a new tab safely
            if (href.startsWith("http://") || href.startsWith("https://")) {
                window.open(href, "_blank", "noopener,noreferrer");
                return;
            }

            // Fallback for relative targets (e.g. href="keywords", href="/dashboard")
            var cleanId = (href.startsWith('/') ? href.slice(1) : href).trim();
            var fallbackTarget = document.getElementById(cleanId) || document.getElementById(cleanId.toLowerCase()) || document.querySelector('[data-section="' + cleanId + '"]');
            if (fallbackTarget) {
                fallbackTarget.scrollIntoView({ behavior: "smooth", block: "start" });
            }
            return;
        }

        // 2. Ensure buttons without explicit type don't trigger accidental form navigation
        var btn = event.target.closest("button");
        if (btn && !btn.getAttribute("type") && !btn.closest("form")) {
            btn.setAttribute("type", "button");
        }
    }

    window.addEventListener("click", handleGlobalClick, true);
    document.addEventListener("click", handleGlobalClick, true);

    // 3. Neutralize all <a href> on DOM load so clicking them never causes browser-level route navigations
    function neutralizeLinks() {
        var allLinks = document.querySelectorAll('a');
        allLinks.forEach(function(a) {
            var h = (a.getAttribute('href') || '').trim();
            if (!h || h === '/' || (!h.startsWith('#') && !h.startsWith('http://') && !h.startsWith('https://') && !h.startsWith('javascript:'))) {
                a.setAttribute('data-target-href', h);
                a.setAttribute('href', 'javascript:void(0)');
            }
        });
    }
    document.addEventListener('DOMContentLoaded', neutralizeLinks);
    setTimeout(neutralizeLinks, 100);
    setTimeout(neutralizeLinks, 500);

    // 4. Intercept all form submissions to prevent full page reloads inside iframe
    window.addEventListener("submit", function (event) {
        event.preventDefault();
        event.stopPropagation();
    }, true);
})();
</script>`;

    if (/<head[^>]*>/i.test(sanitizedHtml)) {
        return sanitizedHtml.replace(/<head[^>]*>/i, (match) => match + "\n" + navigationGuard);
    }

    return `${navigationGuard}${sanitizedHtml}`;
};

function WebsiteEditor() {
    const { id } = useParams();

    // ==========================================
    // STATES
    // ==========================================

    const [website, setWebsite] = useState(null);
    const [error, setError] = useState("");
    const [code, setCode] = useState("");
    const [messages, setMessages] = useState([]);
    const [prompt, setPrompt] = useState("");

    const [updateLoading, setUpdateLoading] =
        useState(false);

    const [thinkingIndex, setThinkingIndex] =
        useState(0);

    const [showCode, setShowCode] =
        useState(false);

    const [showFullPreview, setShowFullPreview] =
        useState(false);

    const [showChat, setShowChat] =
        useState(false);

    const [copiedCode, setCopiedCode] =
        useState(false);

    const isReactCode = /export\s+default/i.test(code) || /import\s+React/i.test(code) || /function\s+App/i.test(code);

    const handleCopyCode = () => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(code);
            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2000);
        }
    };

    const handleDownloadCode = () => {
        const blob = new Blob([code], { type: isReactCode ? "text/javascript" : "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = isReactCode ? "App.jsx" : "index.html";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // ==========================================
    // THINKING STEPS
    // ==========================================

    const thinkingSteps = [
        "Understanding your request…",
        "Planning layout changes…",
        "Improving responsiveness…",
        "Applying animations…",
        "Finalizing update…"
    ];

    // ==========================================
    // SAFE MESSAGES
    // ==========================================

    const safeMessages = Array.isArray(messages)
        ? messages
        : [];

    // ==========================================
    // GET WEBSITE
    // ==========================================

    useEffect(() => {
        const handleGetWebsite = async () => {
            try {
                setError("");

                const result = await axios.get(
                    `${serverUrl}/api/website/get-by-id/${id}`,
                    {
                        withCredentials: true
                    }
                );

                console.log(
                    "GET WEBSITE RESPONSE:",
                    result.data
                );

                const websiteData =
                    result.data?.website;

                if (!websiteData) {
                    throw new Error(
                        "Website data was not returned by the server"
                    );
                }

                setWebsite(websiteData);

                const cleanCode = unescapeRawCode(
                    typeof websiteData.latestCode === "string"
                        ? websiteData.latestCode
                        : ""
                );

                setCode(cleanCode);

                setMessages(
                    Array.isArray(websiteData.conversation)
                        ? websiteData.conversation
                        : []
                );

            } catch (error) {
                console.error(
                    "GET WEBSITE ERROR:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to load website"
                );
            }
        };

        if (id) {
            handleGetWebsite();
        }

    }, [id]);

    // ==========================================
    // THINKING ANIMATION
    // ==========================================

    useEffect(() => {
        if (!updateLoading) return;

        const interval = setInterval(() => {
            setThinkingIndex(
                (currentIndex) =>
                    (currentIndex + 1) %
                    thinkingSteps.length
            );
        }, 1200);

        return () => clearInterval(interval);

    }, [updateLoading]);

    // ==========================================
    // UPDATE WEBSITE
    // ==========================================

    const handleUpdate = async () => {
        if (!prompt.trim()) return;

        const text = prompt.trim();

        setPrompt("");
        setUpdateLoading(true);

        setMessages((previousMessages) => [
            ...(Array.isArray(previousMessages)
                ? previousMessages
                : []),
            {
                role: "user",
                content: text
            }
        ]);

        try {
            const result = await axios.post(
                `${serverUrl}/api/website/update/${id}`,
                {
                    prompt: text
                },
                {
                    withCredentials: true
                }
            );

            console.log(
                "UPDATE SUCCESS:",
                result.data
            );

            if (typeof result.data?.code === "string") {
                const cleanUpdated = unescapeRawCode(result.data.code);
                setCode(cleanUpdated);

                setWebsite((previousWebsite) => ({
                    ...previousWebsite,
                    latestCode: cleanUpdated
                }));
            }

            setMessages((previousMessages) => [
                ...(Array.isArray(previousMessages)
                    ? previousMessages
                    : []),
                {
                    role: "ai",
                    content:
                        result.data?.message ||
                        "Website updated successfully."
                }
            ]);

        } catch (error) {
            console.error(
                "UPDATE ERROR:",
                error
            );

            setMessages((previousMessages) => [
                ...(Array.isArray(previousMessages)
                    ? previousMessages
                    : []),
                {
                    role: "ai",
                    content:
                        error.response?.data?.message ||
                        "Something went wrong while updating the website."
                }
            ]);

        } finally {
            setUpdateLoading(false);
        }
    };

    // ==========================================
    // DEPLOY WEBSITE
    // ==========================================

    const handleDeploy = async () => {
        if (!website?._id) return;

        try {
            const result = await axios.get(
                `${serverUrl}/api/website/deploy/${website._id}`,
                {
                    withCredentials: true
                }
            );

            console.log(
                "DEPLOY SUCCESS:",
                result.data
            );

            const deployUrl =
                result.data?.url ||
                result.data?.deployUrl ||
                "";

            setWebsite((previousWebsite) => ({
                ...previousWebsite,
                deployed: true,
                deployUrl
            }));

            if (deployUrl) {
                window.open(
                    deployUrl,
                    "_blank"
                );
            }

        } catch (error) {
            console.error(
                "DEPLOY ERROR:",
                error
            );
        }
    };

    // ==========================================
    // ERROR STATE
    // ==========================================

    if (error) {
        return (
            <div className="h-screen flex items-center justify-center bg-black text-red-400 px-4 text-center">
                {error}
            </div>
        );
    }

    // ==========================================
    // LOADING STATE
    // ==========================================

    if (!website) {
        return (
            <div className="h-screen flex items-center justify-center bg-black text-white">
                Loading website...
            </div>
        );
    }

    // ==========================================
    // CHAT MESSAGES RENDERER
    // ==========================================

    const renderChatMessages = () => (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

            {safeMessages.length === 0 &&
                !updateLoading && (
                    <div className="text-center text-sm text-zinc-500 mt-10">
                        Ask AI to make changes to your website.
                    </div>
                )}

            {safeMessages.map((message, index) => (
                <div
                    key={index}
                    className={`max-w-[85%] ${
                        message.role === "user"
                            ? "ml-auto"
                            : "mr-auto"
                    }`}
                >
                    <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                            message.role === "user"
                                ? "bg-white text-black"
                                : "bg-white/5 border border-white/10 text-zinc-200"
                        }`}
                    >
                        {message.content}
                    </div>
                </div>
            ))}

            {updateLoading && (
                <div className="max-w-[85%] mr-auto">
                    <div className="px-4 py-2.5 rounded-2xl text-xs bg-white/5 border border-white/10 text-zinc-400 italic">
                        {thinkingSteps[thinkingIndex]}
                    </div>
                </div>
            )}

        </div>
    );

    // ==========================================
    // HEADER RENDERER
    // ==========================================

    const renderHeader = (onClose) => (
        <div className="h-14 shrink-0 px-4 flex items-center justify-between border-b border-white/10 bg-black">
            <span className="font-semibold truncate">
                {website?.title || "Untitled Website"}
            </span>

            {onClose && (
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-lg transition"
                >
                    <X size={18} />
                </button>
            )}
        </div>
    );

    // ==========================================
    // CHAT INPUT RENDERER
    // ==========================================

    const renderChatInput = () => (
        <div className="p-3 border-t border-white/10 bg-black">

            <div className="flex gap-2">

                <input
                    type="text"
                    placeholder="Describe changes..."
                    className="flex-1 min-w-0 rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-indigo-500 transition"
                    value={prompt}
                    disabled={updateLoading}
                    onChange={(e) =>
                        setPrompt(e.target.value)
                    }
                    onKeyDown={(e) => {
                        if (
                            e.key === "Enter" &&
                            !e.shiftKey
                        ) {
                            e.preventDefault();
                            handleUpdate();
                        }
                    }}
                />

                <button
                    className="shrink-0 px-4 py-3 rounded-2xl bg-white text-black hover:bg-zinc-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={
                        updateLoading ||
                        !prompt.trim()
                    }
                    onClick={handleUpdate}
                >
                    <Send size={15} />
                </button>

            </div>

        </div>
    );

    // ==========================================
    // MAIN UI
    // ==========================================

    return (
        <div className="h-screen w-screen flex bg-black text-white overflow-hidden">

            {/* DESKTOP CHAT SIDEBAR */}

            <aside className="hidden lg:flex w-[380px] shrink-0 flex-col border-r border-white/10 bg-black">
                {renderHeader()}

                {renderChatMessages()}

                {renderChatInput()}
            </aside>

            {/* MAIN PREVIEW */}

            <main className="flex-1 min-w-0 flex flex-col">

                {/* PREVIEW HEADER */}

                <div className="h-14 shrink-0 px-4 flex justify-between items-center border-b border-white/10 bg-black">

                    <div className="min-w-0 flex items-center gap-3">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-zinc-300">
                                    Live Preview
                                </span>
                            </div>
                            <span className="text-[11px] text-zinc-500 truncate max-w-[200px]">
                                {website?.title}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                        {!website.deployed && (
                            <button
                                className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-sm font-semibold hover:scale-105 transition"
                                onClick={handleDeploy}
                            >
                                <Rocket size={14} />

                                <span className="hidden sm:inline">
                                    Deploy
                                </span>
                            </button>
                        )}

                        <button
                            className="p-2 lg:hidden hover:bg-white/10 rounded-lg transition"
                            onClick={() =>
                                setShowChat(true)
                            }
                        >
                            <MessageSquare size={18} />
                        </button>

                        <button
                            className="p-2 hover:bg-white/10 rounded-lg transition"
                            onClick={() =>
                                setShowCode(true)
                            }
                        >
                            <Code2 size={18} />
                        </button>

                        <button
                            className="p-2 hover:bg-white/10 rounded-lg transition"
                            onClick={() =>
                                setShowFullPreview(true)
                            }
                        >
                            <Monitor size={18} />
                        </button>

                    </div>

                </div>

                {/* LIVE WEBSITE */}

                <div className="flex-1 min-h-0 bg-zinc-900">

                    <iframe
                        key={`${website?._id || 'site'}-${code.length}-${code.slice(0, 20)}`}
                        srcDoc={getPreviewCode(code)}
                        className="w-full h-full border-0 bg-white"
                        title="Live website preview"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                    />

                </div>

            </main>

            {/* MOBILE CHAT */}

            <AnimatePresence>

                {showChat && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{
                            type: "tween",
                            duration: 0.25
                        }}
                        className="fixed inset-0 z-[9999] bg-black flex flex-col"
                    >

                        {renderHeader(() => setShowChat(false))}

                        {renderChatMessages()}

                        {renderChatInput()}

                    </motion.div>
                )}

            </AnimatePresence>

            {/* CODE EDITOR */}

            <AnimatePresence>

                {showCode && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{
                            type: "tween",
                            duration: 0.25
                        }}
                        className="fixed inset-y-0 right-0 w-full lg:w-[45%] z-[9999] bg-[#1e1e1e] flex flex-col"
                    >

                        <div className="h-12 shrink-0 px-4 flex justify-between items-center border-b border-white/10">
                            <div className="flex items-center gap-2.5">
                                <span className="text-sm font-medium text-white">
                                    {isReactCode ? "App.jsx" : "index.html"}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${isReactCode ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                                    {isReactCode ? "React (JSX)" : "HTML5"}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white transition flex items-center gap-1.5"
                                    onClick={handleCopyCode}
                                    title="Copy Code to Clipboard"
                                >
                                    {copiedCode ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                                    <span>{copiedCode ? "Copied!" : "Copy"}</span>
                                </button>

                                <button
                                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white transition flex items-center gap-1.5"
                                    onClick={handleDownloadCode}
                                    title={`Download ${isReactCode ? 'App.jsx' : 'index.html'}`}
                                >
                                    <Download size={13} />
                                    <span>Download</span>
                                </button>

                                <button
                                    className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition"
                                    onClick={() =>
                                        setShowCode(false)
                                    }
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 min-h-0">
                            <Editor
                                theme="vs-dark"
                                value={code}
                                language={isReactCode ? "javascript" : "html"}
                                onChange={(value) =>
                                    setCode(value || "")
                                }
                                options={{
                                    minimap: {
                                        enabled: false
                                    },
                                    fontSize: 14,
                                    wordWrap: "on"
                                }}
                            />
                        </div>

                    </motion.div>
                )}

            </AnimatePresence>

            {/* FULLSCREEN PREVIEW */}

            <AnimatePresence>

                {showFullPreview && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-black"
                    >

                        <iframe
                            key={`${website?._id || 'site'}-fullscreen-${code.length}-${code.slice(0, 20)}`}
                            srcDoc={getPreviewCode(code)}
                            className="w-full h-full bg-white border-0"
                            title="Full website preview"
                            sandbox="allow-scripts allow-forms allow-popups"
                        />

                        <button
                            onClick={() =>
                                setShowFullPreview(false)
                            }
                            className="absolute top-4 right-4 p-2 bg-black/70 hover:bg-black text-white rounded-lg border border-white/10"
                        >
                            <X size={20} />
                        </button>

                    </motion.div>
                )}

            </AnimatePresence>

        </div>
    );
}

export default WebsiteEditor;