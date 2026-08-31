import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { serverUrl } from "../App";

import {
    ArrowDown,
    Bot,
    Code2,
    Copy,
    Check,
    CheckCircle2,
    ChevronRight,
    Compass,
    CornerDownLeft,
    Download,
    Flame,
    Layers,
    MessageSquare,
    Monitor,
    RefreshCw,
    Rocket,
    Send,
    Sparkles,
    Trash2,
    User,
    X,
    Zap
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
            try { window.lucide.createIcons(); } catch(e) {}
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

    // ========================================================
    // UNIVERSAL TOAST NOTIFICATION ENGINE
    // ========================================================
    window.showToast = function(msg) {
        var existing = document.getElementById('globalToast');
        if (existing) existing.remove();
        var toast = document.createElement('div');
        toast.id = 'globalToast';
        toast.className = 'fixed bottom-6 right-6 z-[999999] px-5 py-3.5 rounded-2xl bg-amber-500 text-black text-xs font-extrabold shadow-2xl transition-all duration-300 flex items-center gap-2 border border-amber-300 pointer-events-auto shadow-amber-500/30';
        toast.innerHTML = '<span class="text-sm">⚡</span><span>' + (msg || 'Action completed successfully!') + '</span>';
        document.body.appendChild(toast);
        initLucideIcons();
        setTimeout(function() {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(function() { toast.remove(); }, 300);
        }, 3200);
    };

    // ========================================================
    // UNIVERSAL SHOPPING BAG & WISHLIST ENGINE
    // ========================================================
    window.cart = window.cart || [];
    window.wishlist = window.wishlist || [];

    window.updateCartUI = function() {
        var totalCount = window.cart.reduce(function(sum, i) { return sum + (i.qty || 1); }, 0);
        var subtotal = window.cart.reduce(function(sum, i) { return sum + ((i.price || 0) * (i.qty || 1)); }, 0);
        
        var badges = document.querySelectorAll('.cart-count-badge, #cartCountBadge, [data-cart-count], .cart-badge');
        badges.forEach(function(b) {
            b.textContent = totalCount;
            b.style.display = totalCount > 0 ? 'inline-flex' : 'none';
        });

        var floatCart = document.getElementById('floatingBottomCart') || document.querySelector('.floating-cart');
        if (floatCart) {
            floatCart.style.display = totalCount > 0 ? 'flex' : 'none';
            var floatTxt = floatCart.querySelector('.float-cart-text, span');
            if (floatTxt && totalCount > 0) {
                floatTxt.textContent = totalCount + ' ITEMS | $' + subtotal.toFixed(2) + ' • VIEW CART ➔';
            }
        }
    };

    window.addToCart = function(id, name, price, img) {
        var pName = name || 'Selected Item';
        var pPrice = parseFloat(price) || 49.00;
        var existing = window.cart.find(function(i) { return i.id === id; });
        if (existing) {
            existing.qty += 1;
        } else {
            window.cart.push({ id: id || 'item-' + Date.now(), name: pName, price: pPrice, img: img || '', qty: 1 });
        }
        window.updateCartUI();
        window.showToast(pName + ' added to Bag! 🛒');
    };
    window.quickAdd = window.addToCart;

    window.updateCartQty = function(id, delta) {
        var item = window.cart.find(function(i) { return i.id === id; });
        if (item) {
            item.qty += delta;
            if (item.qty <= 0) {
                window.cart = window.cart.filter(function(i) { return i.id !== id; });
            }
        }
        window.updateCartUI();
    };
    window.updateQty = window.updateCartQty;

    window.removeCartItem = function(id) {
        window.cart = window.cart.filter(function(i) { return i.id !== id; });
        window.updateCartUI();
        window.showToast('Item removed from bag');
    };

    window.toggleWishlist = function(btn, id) {
        var card = btn ? btn.closest('.glass-card, [data-id], .card, div') : null;
        var title = card ? (card.querySelector('h3, h4, .title')?.textContent || 'Item') : 'Item';
        var isFilled = btn ? (btn.classList.contains('fill-rose-500') || btn.classList.contains('text-rose-500')) : false;
        if (btn) {
            if (isFilled) {
                btn.classList.remove('fill-rose-500', 'text-rose-500');
                window.showToast('Removed from Saved Wishlist');
            } else {
                btn.classList.add('fill-rose-500', 'text-rose-500');
                window.showToast('Added ' + title.trim() + ' to Wishlist! ❤️');
            }
        }
    };

    // ========================================================
    // UNIVERSAL CATEGORY & CUISINE FILTER ENGINE
    // ========================================================
    window.filterCategory = function(cat) {
        var category = (cat || 'all').toLowerCase().trim();
        document.querySelectorAll('.cat-pill, [data-category-btn], .category-btn, .cuisine-pill, [onclick*="filterCategory"], [onclick*="filterCuisine"]').forEach(function(btn) {
            var bCat = (btn.getAttribute('data-category') || btn.getAttribute('data-cuisine') || btn.textContent || '').toLowerCase().trim();
            var isMatch = category === 'all' ? (bCat === 'all' || bCat.includes('all') || bCat.includes('72')) : bCat.includes(category);
            if (isMatch) {
                btn.classList.add('bg-amber-500', 'text-black', 'shadow-lg');
                btn.classList.remove('bg-slate-900', 'bg-stone-900', 'text-slate-400', 'text-stone-400');
            } else {
                btn.classList.remove('bg-amber-500', 'text-black', 'shadow-lg');
                btn.classList.add('bg-slate-900', 'text-slate-400');
            }
        });

        var cards = document.querySelectorAll('[data-category], [data-cuisine], .product-card, .dish-card, .menu-item');
        cards.forEach(function(card) {
            var cardCat = (card.getAttribute('data-category') || card.getAttribute('data-cuisine') || card.textContent || '').toLowerCase();
            if (category === 'all' || cardCat.includes(category)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
        initLucideIcons();
    };
    window.filterCuisine = window.filterCategory;
    window.filterMenu = window.filterCategory;

    // Search Engine
    window.handleSearch = function(query) {
        var q = (query || '').toLowerCase().trim();
        var cards = document.querySelectorAll('[data-category], [data-cuisine], .product-card, .dish-card, .menu-item, [data-name]');
        cards.forEach(function(card) {
            if (card.closest('header') || card.closest('footer') || card.closest('nav')) return;
            var text = card.textContent.toLowerCase();
            card.style.display = (!q || text.includes(q)) ? '' : 'none';
        });
    };
    window.handleProductSearch = window.handleSearch;
    window.handleMenuSearch = window.handleSearch;

    // ========================================================
    // UNIVERSAL MODAL & DRAWER TOGGLES
    // ========================================================
    window.openModal = function(id) {
        var modal = id ? document.getElementById(id) : null;
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.remove('hidden');
            initLucideIcons();
            return;
        }

        var lower = (id || '').toLowerCase();
        if (lower.includes('reserve') || lower.includes('table') || lower.includes('book')) {
            window.openReservationModal();
        } else if (lower.includes('sign') || lower.includes('login') || lower.includes('auth')) {
            window.openSignInModal();
        } else if (lower.includes('review')) {
            window.openReviewModal();
        } else {
            window.openLeadModal(id ? 'Inquiry / Booking' : null);
        }
    };

    window.closeModal = function(id) {
        var modal = id ? document.getElementById(id) : null;
        if (modal) {
            modal.style.display = 'none';
            modal.classList.add('hidden');
        }
        var dynamicModals = document.querySelectorAll('#dynamicLeadModal, #dynamicSignInModal, #dynamicReservationModal, #dynamicReviewModal, #dynamicProductModal');
        dynamicModals.forEach(function(m) { m.style.display = 'none'; });
    };

    window.toggleDrawer = function(id) {
        var el = document.getElementById(id);
        if (el) {
            el.classList.toggle('translate-x-full');
            initLucideIcons();
            return;
        }
        var lower = (id || '').toLowerCase();
        if (lower.includes('cart') || lower.includes('bag')) {
            window.showToast('Shopping Bag contains ' + window.cart.length + ' items 🛒');
        } else if (lower.includes('wishlist')) {
            window.showToast('Wishlist contains ' + window.wishlist.length + ' items ❤️');
        }
    };

    // Table Reservation Modal
    window.openReservationModal = function() {
        var existing = document.getElementById('reservationModal');
        if (existing) {
            existing.style.display = 'flex';
            existing.classList.remove('hidden');
            initLucideIcons();
            return;
        }
        var dynamic = document.getElementById('dynamicReservationModal');
        if (!dynamic) {
            dynamic = document.createElement('div');
            dynamic.id = 'dynamicReservationModal';
            dynamic.className = 'fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4';
            dynamic.innerHTML = '<div class="glass-card relative w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-amber-500/30 bg-stone-950/95 shadow-2xl text-left">' +
                '<button onclick="window.closeModal(\\'dynamicReservationModal\\')" class="absolute top-5 right-5 text-stone-400 hover:text-white transition p-1.5 rounded-full hover:bg-stone-800">' +
                    '<i data-lucide="x" class="w-5 h-5"></i>' +
                '</button>' +
                '<div class="flex items-center gap-2 text-amber-400 text-xs font-bold tracking-widest uppercase mb-2">' +
                    '<i data-lucide="calendar" class="w-4 h-4"></i> Table Reservation' +
                '</div>' +
                '<h3 class="text-2xl font-extrabold text-white mb-1.5">Reserve Your Dining Experience</h3>' +
                '<p class="text-stone-400 text-xs mb-6">Select your date, guest count, and dining time slot.</p>' +
                '<form onsubmit="event.preventDefault(); window.submitReservation(event)" class="space-y-4">' +
                    '<div class="grid grid-cols-2 gap-3">' +
                        '<div>' +
                            '<label class="block text-xs font-bold text-stone-300 mb-1">Date</label>' +
                            '<input type="date" required value="' + new Date().toISOString().split('T')[0] + '" class="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white outline-none focus:border-amber-500 transition">' +
                        '</div>' +
                        '<div>' +
                            '<label class="block text-xs font-bold text-stone-300 mb-1">Guests</label>' +
                            '<select class="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white outline-none focus:border-amber-500 transition">' +
                                '<option>2 Guests (Romantic)</option>' +
                                '<option>4 Guests (Family)</option>' +
                                '<option>6+ Guests (Party)</option>' +
                            '</select>' +
                        '</div>' +
                    '</div>' +
                    '<div>' +
                        '<label class="block text-xs font-bold text-stone-300 mb-1">Guest Full Name</label>' +
                        '<input type="text" required placeholder="Alex Morgan" class="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white outline-none focus:border-amber-500 transition">' +
                    '</div>' +
                    '<div>' +
                        '<label class="block text-xs font-bold text-stone-300 mb-1">Phone Number</label>' +
                        '<input type="tel" required placeholder="+1 (555) 000-0000" class="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white outline-none focus:border-amber-500 transition">' +
                    '</div>' +
                    '<button type="submit" class="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition cursor-pointer">' +
                        '<span>Confirm Table Reservation ➔</span>' +
                    '</button>' +
                '</form>' +
            '</div>';
            document.body.appendChild(dynamic);
        } else {
            dynamic.style.display = 'flex';
        }
        initLucideIcons();
    };

    window.submitReservation = function(e) {
        if (e && e.preventDefault) e.preventDefault();
        var ref = '#RES-' + Math.floor(1000 + Math.random() * 9000);
        window.closeModal();
        window.showToast('Table Reserved! Confirmation Ticket ' + ref + ' sent! 🎉');
    };

    // Review Modal
    window.openReviewModal = function() {
        var existing = document.getElementById('reviewModal');
        if (existing) {
            existing.style.display = 'flex';
            existing.classList.remove('hidden');
            initLucideIcons();
            return;
        }
        var dynamic = document.getElementById('dynamicReviewModal');
        if (!dynamic) {
            dynamic = document.createElement('div');
            dynamic.id = 'dynamicReviewModal';
            dynamic.className = 'fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4';
            dynamic.innerHTML = '<div class="glass-card relative w-full max-w-md rounded-3xl p-6 sm:p-8 border border-amber-500/30 bg-stone-950/95 shadow-2xl text-left">' +
                '<button onclick="window.closeModal(\\'dynamicReviewModal\\')" class="absolute top-5 right-5 text-stone-400 hover:text-white transition p-1.5 rounded-full hover:bg-stone-800">' +
                    '<i data-lucide="x" class="w-5 h-5"></i>' +
                '</button>' +
                '<h3 class="text-2xl font-extrabold text-white mb-1.5">Share Your Review</h3>' +
                '<p class="text-stone-400 text-xs mb-4">Rate your experience and leave your feedback.</p>' +
                '<form onsubmit="event.preventDefault(); window.submitReview(event)" class="space-y-4">' +
                    '<div class="text-amber-400 text-xl font-bold flex gap-1 cursor-pointer">★★★★★</div>' +
                    '<input type="text" required placeholder="Your Name" class="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white outline-none focus:border-amber-500 transition">' +
                    '<textarea required rows="3" placeholder="Tell us about the dishes, service, or atmosphere..." class="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white outline-none focus:border-amber-500 transition"></textarea>' +
                    '<button type="submit" class="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider transition cursor-pointer">' +
                        '<span>Publish Verified Review ➔</span>' +
                    '</button>' +
                '</form>' +
            '</div>';
            document.body.appendChild(dynamic);
        } else {
            dynamic.style.display = 'flex';
        }
        initLucideIcons();
    };

    window.submitReview = function(e) {
        if (e && e.preventDefault) e.preventDefault();
        window.closeModal();
        window.showToast('Thank you! Your 5-star review has been published ⭐');
    };

    // Lead Capture Modal
    window.openLeadModal = function(title) {
        var existing = document.getElementById('leadModal') || document.getElementById('contactModal');
        if (existing) {
            existing.style.display = 'flex';
            existing.classList.remove('hidden');
            initLucideIcons();
            return;
        }
        var dynamic = document.getElementById('dynamicLeadModal');
        if (!dynamic) {
            dynamic = document.createElement('div');
            dynamic.id = 'dynamicLeadModal';
            dynamic.className = 'fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4';
            dynamic.innerHTML = '<div class="glass-card relative w-full max-w-md rounded-3xl p-6 sm:p-8 border border-indigo-500/30 bg-slate-950/95 shadow-2xl text-left">' +
                '<button onclick="window.closeModal(\\'dynamicLeadModal\\')" class="absolute top-5 right-5 text-slate-400 hover:text-white transition p-1.5 rounded-full hover:bg-slate-800">' +
                    '<i data-lucide="x" class="w-5 h-5"></i>' +
                '</button>' +
                '<h3 class="text-2xl font-extrabold text-white mb-1.5">' + (title || 'Request Priority Access') + '</h3>' +
                '<p class="text-slate-400 text-xs mb-6">Complete your request below to get started instantly.</p>' +
                '<form onsubmit="event.preventDefault(); window.submitLeadForm(event)" class="space-y-4">' +
                    '<input type="text" name="name" required placeholder="Full Name" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500 transition">' +
                    '<input type="email" name="email" required placeholder="Work Email" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500 transition">' +
                    '<input type="tel" name="phone" required placeholder="Mobile Phone Number" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500 transition">' +
                    '<button type="submit" class="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-indigo-600/30 cursor-pointer">' +
                        '<span>Submit Request ➔</span>' +
                    '</button>' +
                '</form>' +
            '</div>';
            document.body.appendChild(dynamic);
        } else {
            dynamic.style.display = 'flex';
        }
        initLucideIcons();
    };

    window.submitLeadForm = function(e) {
        if (e && e.preventDefault) e.preventDefault();
        var form = (e && e.target && e.target.tagName === 'FORM') ? e.target : (e && e.target && e.target.closest ? e.target.closest('form') : document.querySelector('form'));
        var nameInput = form ? form.querySelector('input[name="name"], input[type="text"]') : null;
        var name = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : 'there';
        window.closeModal();
        window.showToast('Thank you ' + name + '! Your inquiry has been received. 🚀');
        if (form && form.reset) form.reset();
    };

    // ========================================================
    // UNIVERSAL FAQ ACCORDION & PRICING TOGGLES
    // ========================================================
    window.toggleFaq = function(btn) {
        if (!btn) return;
        var content = btn.nextElementSibling || (btn.parentElement && btn.parentElement.querySelector('.faq-content, .faq-answer, p'));
        var icon = btn.querySelector('svg, i, .faq-icon');
        if (content) {
            var isHidden = content.classList.contains('hidden') || content.style.display === 'none';
            if (isHidden) {
                content.classList.remove('hidden');
                content.style.display = 'block';
                if (icon) icon.style.transform = 'rotate(180deg)';
            } else {
                content.classList.add('hidden');
                content.style.display = 'none';
                if (icon) icon.style.transform = 'rotate(0deg)';
            }
        }
    };

    window.togglePricing = function(isAnnual) {
        var prices = document.querySelectorAll('.price-val, [data-monthly], [data-annual]');
        prices.forEach(function(el) {
            var m = el.getAttribute('data-monthly');
            var a = el.getAttribute('data-annual');
            if (m && a) {
                el.textContent = isAnnual ? a : m;
            }
        });
    };

    // ========================================================
    // UNIVERSAL CLICK & INTERACTION DELEGATOR (CATCHES ALL BUTTONS)
    // ========================================================
    function handleUniversalClick(event) {
        var btn = event.target.closest('button, a, .clickable, [role="button"]');
        if (!btn) return;

        var txt = (btn.textContent || '').toLowerCase().trim();
        var onclickAttr = btn.getAttribute('onclick') || '';

        // 1. Navigation Anchor Links
        if (btn.tagName === 'A') {
            var href = (btn.getAttribute('href') || '').trim();
            if (href.startsWith('#')) {
                event.preventDefault();
                event.stopPropagation();
                var targetId = decodeURIComponent(href.slice(1)).trim();
                var target = document.getElementById(targetId) || document.getElementById(targetId.toLowerCase());
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                return;
            }
        }

        // 2. Add to Cart / Add to Bag / Quick Add
        if (txt.includes('add to bag') || txt.includes('add to cart') || txt.includes('add to order') || txt.includes('quick add') || txt === 'add') {
            var card = btn.closest('.glass-card, [data-id], .card, .product-card, .dish-card, div');
            var title = card ? (card.querySelector('h3, h4, .title, strong')?.textContent || 'Item') : 'Product';
            var priceEl = card ? card.querySelector('.price, [class*="text-amber"], [class*="text-emerald"], [class*="font-bold"]') : null;
            var price = priceEl ? parseFloat(priceEl.textContent.replace(/[^0-9.]/g, '')) || 49 : 49;
            window.addToCart('item-' + Date.now(), title.trim(), price);
            return;
        }

        // 3. Wishlist Heart Button
        if (btn.querySelector('svg, i[data-lucide="heart"]') || onclickAttr.includes('Wishlist') || txt.includes('wishlist')) {
            window.toggleWishlist(btn, 'p-' + Date.now());
            return;
        }

        // 4. Reserve / Book Table Button
        if (txt.includes('reserve a table') || txt.includes('book a table') || txt.includes('reserve table') || txt.includes('book table')) {
            window.openReservationModal();
            return;
        }

        // 5. Review Button
        if (txt.includes('write a review') || txt.includes('share feedback')) {
            window.openReviewModal();
            return;
        }

        // 6. View Cart / Bag Trigger
        if (txt.includes('view cart') || txt.includes('bag') || btn.querySelector('svg, i[data-lucide="shopping-bag"]') || btn.querySelector('svg, i[data-lucide="shopping-cart"]')) {
            window.toggleDrawer('cartDrawer');
            return;
        }

        // 7. FAQ Accordion Click
        if (btn.closest('#faq, [id*="faq"], .faq-item')) {
            window.toggleFaq(btn);
            return;
        }

        // 8. Back to Top Click
        if (txt.includes('back to top') || txt.includes('top') && btn.querySelector('i[data-lucide="arrow-up"]')) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
    }

    document.addEventListener('click', handleUniversalClick, false);

    // Form submission delegator
    window.addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var form = e.target;
        var isSub = form.querySelector('input[type="email"]') && form.querySelectorAll('input').length === 1;
        if (isSub) {
            window.showToast('Subscribed to VIP updates! 🚀');
            form.reset();
        } else {
            window.submitLeadForm(e);
        }
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
    const navigate = useNavigate();

    // ==========================================
    // STATES & REFS
    // ==========================================

    const [website, setWebsite] = useState(null);
    const [error, setError] = useState("");
    const [code, setCode] = useState("");
    const [messages, setMessages] = useState([]);
    const [prompt, setPrompt] = useState("");

    const [updateLoading, setUpdateLoading] = useState(false);
    const [thinkingIndex, setThinkingIndex] = useState(0);
    const [showCode, setShowCode] = useState(false);
    const [showFullPreview, setShowFullPreview] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [copiedCode, setCopiedCode] = useState(false);
    const [copiedMessageIdx, setCopiedMessageIdx] = useState(null);
    const [showScrollBottom, setShowScrollBottom] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // ==========================================
    // DELETE WEBSITE FROM DB
    // ==========================================

    const handleDeleteSite = async () => {
        try {
            setIsDeleting(true);
            await axios.delete(`${serverUrl}/api/website/delete/${id}`, {
                withCredentials: true
            });
            navigate("/dashboard");
        } catch (err) {
            console.error("DELETE WEBSITE ERROR:", err);
            alert(err.response?.data?.message || "Failed to delete project from database");
            setIsDeleting(false);
        }
    };

    const chatContainerRef = useRef(null);
    const messagesEndRef = useRef(null);

    const isReactCode = /export\s+default/i.test(code) || /import\s+React/i.test(code) || /function\s+App/i.test(code);

    const handleCopyCode = () => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(code);
            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2000);
        }
    };

    const handleCopyMessage = (text, idx) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text);
            setCopiedMessageIdx(idx);
            setTimeout(() => setCopiedMessageIdx(null), 2000);
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
    // THINKING STEPS & PROGRESS
    // ==========================================

    const thinkingSteps = [
        { title: "Analyzing DOM & style tree...", detail: "Inspecting component hierarchy & tokens", progress: 25 },
        { title: "Refactoring layout & components...", detail: "Applying requested UI modifications", progress: 50 },
        { title: "Wiring interactive JS event handlers...", detail: "Adding dynamic click & state logic", progress: 75 },
        { title: "Finalizing animations & live preview...", detail: "Rendering updated code into preview", progress: 95 }
    ];

    // ==========================================
    // AUTO-SCROLL TO BOTTOM
    // ==========================================

    const scrollToBottom = (behavior = "smooth") => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior, block: "nearest" });
        }
    };

    useEffect(() => {
        scrollToBottom("smooth");
    }, [messages, updateLoading, thinkingIndex]);

    const handleChatScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 80;
        setShowScrollBottom(!isNearBottom);
    };

    // ==========================================
    // SAFE MESSAGES
    // ==========================================

    const safeMessages = Array.isArray(messages) ? messages : [];

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

                const websiteData = result.data?.website;

                if (!websiteData) {
                    throw new Error("Website data was not returned by the server");
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
                console.error("GET WEBSITE ERROR:", error);
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
            setThinkingIndex((currentIndex) => (currentIndex + 1) % thinkingSteps.length);
        }, 1200);

        return () => clearInterval(interval);

    }, [updateLoading]);

    // ==========================================
    // UPDATE WEBSITE
    // ==========================================

    const handleUpdate = async (customPrompt = null) => {
        const text = typeof customPrompt === "string" && customPrompt.trim()
            ? customPrompt.trim()
            : prompt.trim();

        if (!text || updateLoading) return;

        setPrompt("");
        setUpdateLoading(true);

        const now = new Date().toISOString();

        setMessages((previousMessages) => [
            ...(Array.isArray(previousMessages) ? previousMessages : []),
            {
                role: "user",
                content: text,
                createdAt: now
            }
        ]);

        try {
            const result = await axios.post(
                `${serverUrl}/api/website/update/${id}`,
                { prompt: text },
                { withCredentials: true }
            );

            if (typeof result.data?.code === "string") {
                const cleanUpdated = unescapeRawCode(result.data.code);
                setCode(cleanUpdated);

                setWebsite((previousWebsite) => ({
                    ...previousWebsite,
                    latestCode: cleanUpdated,
                    conversation: result.data?.website?.conversation || previousWebsite?.conversation
                }));
            }

            const updatedConv = result.data?.website?.conversation;
            const latestAiMessage = Array.isArray(updatedConv) ? updatedConv[updatedConv.length - 1] : null;

            setMessages((previousMessages) => [
                ...(Array.isArray(previousMessages) ? previousMessages : []),
                {
                    role: "ai",
                    content: result.data?.message || "Website updated successfully.",
                    phase: latestAiMessage?.phase || 2,
                    interactiveCard: latestAiMessage?.interactiveCard || null,
                    agentQuestions: latestAiMessage?.agentQuestions || [],
                    suggestions: latestAiMessage?.suggestions || [],
                    createdAt: new Date().toISOString()
                }
            ]);

        } catch (error) {
            console.error("UPDATE ERROR:", error);
            setMessages((previousMessages) => [
                ...(Array.isArray(previousMessages) ? previousMessages : []),
                {
                    role: "ai",
                    content:
                        error.response?.data?.message ||
                        "Something went wrong while updating the website.",
                    createdAt: new Date().toISOString()
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

            const deployUrl = result.data?.url || result.data?.deployUrl || "";

            setWebsite((previousWebsite) => ({
                ...previousWebsite,
                deployed: true,
                deployUrl
            }));

            if (deployUrl) {
                window.open(deployUrl, "_blank");
            }

        } catch (error) {
            console.error("DEPLOY ERROR:", error);
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
    // CONTEXTUAL SUGGESTIONS HELPER (FALLBACK & SEED)
    // ==========================================

    const detectSiteDomain = (prompt = "", latestCode = "") => {
        const p = (prompt || "").toLowerCase();
        const c = (latestCode || "").toLowerCase();
        const combined = p + " " + c;

        // 1. Dashboard / Admin / Analytics / CRM / Metrics
        if (/\b(dashboard|analytics|admin\s*panel|kpi|metrics|data\s*table|crm|finance\s*tracker|inventory\s*manager)\b/i.test(combined)) {
            return "dashboard";
        }

        // 2. SaaS Landing / Lead Funnel / Waitlist
        if (/\b(saas|waitlist|landing\s*page|lead\s*capture|pricing\s*tier|startup\s*launch|conversion\s*funnel)\b/i.test(combined)) {
            return "landing";
        }

        // 3. Food Delivery / Restaurant / Cafe / Dining (STRICT: food/dining specific terms, NOT bare 'delivery')
        if (/\b(swiggy|zomato|doordash|uber\s*eats|restaurant|bistro|cafe|bakery|dining|pizza|pasta|biryani|burger|dosa|cuisine|meal|food\s*delivery|gourmet\s*dish|tiffin|chef|recipe|table\s*reservation|pure\s*veg|beverage|dessert)\b/i.test(combined)) {
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
    };

    const getDomainSuggestions = (title = "", code = "", turns = 1) => {
        const domain = detectSiteDomain(title, code);
        const phase = Math.min(4, Math.max(1, turns));

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
                    question: "How should dining guests interact with your restaurant online?",
                    options: [
                        {
                            icon: "📅",
                            label: "Table Reservation Booking Modal",
                            description: "Interactive reservation form with date/time pickers, party size, and confirmed table ticket",
                            prompt: "Add an interactive table reservation modal with date picker, time slots, party size pills, and confirmed ticket booking"
                        },
                        {
                            icon: "🥗",
                            label: "Dietary Badges & Search Filter",
                            description: "Instant menu search with Vegan, Gluten-Free, and Chef Choice filter pills",
                            prompt: "Add dietary filter badges (Vegan, Gluten-Free, Chef Choice) and instant live search to the food menu"
                        },
                        {
                            icon: "🍷",
                            label: "Sommelier Wine Pairing Notes",
                            description: "Curated wine pairing recommendations and flavor profiles under each signature dish",
                            prompt: "Add sommelier wine pairing notes and flavor profiles to each signature dish card on the menu"
                        }
                    ]
                };
            } else if (phase === 3) {
                card = {
                    question: "What ambiance aesthetic best reflects your dining experience?",
                    options: [
                        {
                            icon: "🕯️",
                            label: "Candlelit Dark Warmth",
                            description: "Deep espresso & warm gold accents with elegant serif headings and soft ambient glows",
                            prompt: "Upgrade the theme to Candlelit Dark Warmth with deep espresso background and warm gold accents"
                        },
                        {
                            icon: "🌿",
                            label: "Modern Botanical Organic",
                            description: "Sage green, stone textures, clean typography, and farm-to-table natural vibes",
                            prompt: "Switch to Modern Botanical Organic theme with sage green tones, clean typography, and organic styling"
                        },
                        {
                            icon: "🍕",
                            label: "Rustic Italian Trattoria",
                            description: "Warm terracotta, brick red, and chalkboard style menu accents",
                            prompt: "Apply a Rustic Italian Trattoria theme with warm terracotta highlights and artisan menu styling"
                        }
                    ]
                };
            } else {
                card = {
                    question: "Which ordering and loyalty channels should we activate?",
                    options: [
                        {
                            icon: "🛍️",
                            label: "Slide-out Takeaway Drawer",
                            description: "Quick online takeaway order cart drawer with pickup time slot picker",
                            prompt: "Add a slide-out online takeaway order drawer with pickup time selector and checkout"
                        },
                        {
                            icon: "👑",
                            label: "VIP Dining Club Perks",
                            description: "Loyalty club signup section with free appetizer on first visit",
                            prompt: "Add a VIP Dining Club membership section offering exclusive tasting invitations and welcome perks"
                        },
                        {
                            icon: "🎁",
                            label: "Digital Gift Card Selector",
                            description: "Interactive gift card denomination picker ($25, $50, $100) with instant voucher preview",
                            prompt: "Add an interactive dining gift card selector with preset amounts ($25, $50, $100) and instant digital voucher preview"
                        }
                    ]
                };
            }

            agentQuestions = [
                "Would you like to add an online Table Reservation modal with date picker and party size?",
                "Should we add dietary badges (🌱 Vegan, 🌾 Gluten-Free, ⭐ Chef's Special) to the menu?",
                "Do you want an interactive Wine Pairing recommendation on signature dishes?"
            ];

            suggestions = [
                { label: "+ Today's Chef Specials Carousel", prompt: "Add an animated Today's Chef Specials highlighted carousel at the top of the menu" },
                { label: "+ Live Opening Hours Badge", prompt: "Add a live 'Open Now / Closes at 11 PM' badge and detailed opening hours schedule in the header" },
                { label: "+ Interactive Map & Directions", prompt: "Add an interactive Google Map location section with one-click 'Get Directions' button" },
                { label: "+ Chef Story & Kitchen Gallery", prompt: "Add a master chef story section with kitchen action photo gallery and culinary awards badges" },
                { label: "+ Food Critic Quotes", prompt: "Add a quotes section featuring rave reviews from food critics and Michelin-guide mentions" }
            ];

        // ==========================================
        // 3. DASHBOARD / ANALYTICS / ADMIN / KPI
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
        // 4. SAAS LANDING PAGE / LEAD FUNNEL
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
        // 5. HEALTHCARE / CLINIC / DOCTOR
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
        // 6. REAL ESTATE / PROPERTY / VILLA
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
        // 7. FITNESS / GYM / WORKOUT
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
        // 8. GENERAL PORTFOLIO / AGENCY / CREATIVE
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
    };

    // Quick Action Prompt Chips above input bar
    const getQuickPromptChips = () => {
        const text = (website?.title + " " + code).toLowerCase();
        if (/\b(store|shop|shoe|sneaker|fashion|retail|product)\b/i.test(text)) {
            return [
                { label: "✨ Frosted Glass Header", prompt: "Make the navbar a modern floating frosted glass sticky header with backdrop blur" },
                { label: "🏷️ Add Sale Badge on Cards", prompt: "Add animated 'HOT' and '-20% OFF' discount badges to top selling product cards" },
                { label: "📱 Mobile Sticky Cart Bar", prompt: "Add a floating sticky bottom cart bar for mobile screens with 1-click checkout" },
                { label: "🎨 Dark High-Contrast Theme", prompt: "Switch page theme to sleek dark high-contrast mode with vibrant glowing buttons" }
            ];
        }
        if (/\b(restaurant|food|menu|cafe|dining|delivery|cuisine)\b/i.test(text)) {
            return [
                { label: "🍛 Indian & Biryani Specials", prompt: "Highlight Indian curries, royal saffron biryani handis, and tandoori naans on the menu" },
                { label: "🍕 Wood-Fired Pizza Strip", prompt: "Add Neapolitan wood-fired artisanal pizza highlights with crispy blistered crusts" },
                { label: "🥥 South Indian Ghee Dosas", prompt: "Add golden crispy ghee roast dosas, steamed idlis, and coconut chutney tiffins" },
                { label: "🍔 Wagyu Smash Burgers", prompt: "Add double smash Wagyu burgers with truffle aioli and crispy loaded fries" },
                { label: "🥢 Dim Sum & Chinese Wok", prompt: "Add handmade crystal dim sum steamers and fiery Sichuan wok noodles" },
                { label: "🌮 Street Food & Pani Puri", prompt: "Add 6-flavor pani puri shots, Mumbai pav bhaji, and crispy kathi wraps" },
                { label: "🥐 French Bakery & Desserts", prompt: "Add flaky French butter croissants, sourdough loaves, and tiramisu dolci" },
                { label: "🥗 Healthy Superfood Bowls", prompt: "Add organic Atlantic salmon poké bowls and Mediterranean quinoa salads" }
            ];
        }
        if (/\b(dashboard|analytics|admin|crm)\b/i.test(text)) {
            return [
                { label: "🌗 Dark / Light Mode Switch", prompt: "Add an interactive Dark Mode and Light Mode toggle switch in the dashboard top header" },
                { label: "🔍 Table Instant Search Bar", prompt: "Add an instant search input bar above the transactions table that filters rows dynamically" },
                { label: "📊 Add Metric Sparkline Chart", prompt: "Add mini sparkline trend curves inside all top KPI summary cards" },
                { label: "⚡ Live Syncing Pulse", prompt: "Add a pulsing 'Live Connected (every 5s)' status badge in top right corner" }
            ];
        }
        return [
            { label: "✨ Floating Frosted Navbar", prompt: "Upgrade navigation into a modern floating frosted glass sticky navbar" },
            { label: "🎨 Dark Glassmorphic Theme", prompt: "Upgrade page theme to an ultra-sleek dark glassmorphic style with subtle mesh glows" },
            { label: "📱 Mobile Responsive Polish", prompt: "Refine responsive grid layouts and touch tap target sizes for mobile screens" },
            { label: "⚡ Smooth Hover Micro-FX", prompt: "Add smooth spring-hover lift effects and glowing border transitions to all cards and buttons" }
        ];
    };

    // Timestamp Formatter Helper
    const formatTimestamp = (isoString) => {
        if (!isoString) return "Just now";
        try {
            const date = new Date(isoString);
            if (isNaN(date.getTime())) return "Just now";
            return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        } catch {
            return "Just now";
        }
    };

    // ==========================================
    // CHAT MESSAGES RENDERER (LIVE AI STREAM)
    // ==========================================

    const renderChatMessages = () => {
        const currentTurnCount = Math.floor(safeMessages.length / 2) + 1;
        const currentDomainData = getDomainSuggestions(website?.title, code, currentTurnCount);
        const currentPhase = Math.min(4, Math.max(1, currentTurnCount));

        const phaseSteps = [
            { step: 1, title: "Layout", desc: "Core Structure" },
            { step: 2, title: "Features", desc: "Key Interactions" },
            { step: 3, title: "Styling", desc: "Colors & Theme" },
            { step: 4, title: "Launch", desc: "Conversions" }
        ];

        return (
            <div
                ref={chatContainerRef}
                onScroll={handleChatScroll}
                className="flex-1 overflow-y-auto px-3.5 py-4 space-y-4 relative scroll-smooth"
            >
                {/* Live AI Status Bar */}
                <div className="p-3 rounded-2xl bg-zinc-900/90 border border-white/10 shadow-lg space-y-2.5 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="relative flex items-center justify-center">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="absolute w-4 h-4 rounded-full bg-emerald-400/30 animate-ping" />
                            </div>
                            <span className="text-xs font-bold text-white tracking-wide">
                                AI Co-Pilot
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                                Live & Connected
                            </span>
                        </div>

                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[10px] font-mono font-semibold">
                            Phase {currentPhase}/4
                        </span>
                    </div>

                    {/* Design Evolution Roadmap */}
                    <div className="grid grid-cols-4 gap-1.5 pt-1">
                        {phaseSteps.map((s) => {
                            const isDone = s.step < currentPhase;
                            const isActive = s.step === currentPhase;
                            return (
                                <div
                                    key={s.step}
                                    className={`py-1.5 px-1 rounded-xl text-center text-[10px] font-bold transition-all ${
                                        isActive
                                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-900/40 ring-1 ring-white/30 scale-[1.02]"
                                            : isDone
                                            ? "bg-emerald-950/50 border border-emerald-500/30 text-emerald-400"
                                            : "bg-white/5 text-zinc-500 border border-transparent"
                                    }`}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        {isDone ? (
                                            <CheckCircle2 size={10} className="text-emerald-400 shrink-0" />
                                        ) : isActive ? (
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping shrink-0" />
                                        ) : null}
                                        <span className="truncate">{s.title}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Kickstarter Initial State (If 0 messages) */}
                {safeMessages.length === 0 && !updateLoading && (
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-purple-950/30 to-black border border-indigo-500/40 text-left space-y-3 shadow-2xl animate-fadeIn">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 shrink-0">
                                <Sparkles size={18} />
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-white uppercase tracking-wider">AI Design Partner Ready</h4>
                                <p className="text-[11px] text-zinc-400">Choose a high-impact direction to get started:</p>
                            </div>
                        </div>

                        {currentDomainData?.interactiveCard && (
                            <div className="space-y-2 pt-1">
                                <p className="text-xs font-semibold text-zinc-200">
                                    {currentDomainData.interactiveCard.question}
                                </p>
                                <div className="space-y-2">
                                    {currentDomainData.interactiveCard.options.map((opt, oIdx) => (
                                        <button
                                            key={oIdx}
                                            onClick={() => handleUpdate(opt.prompt)}
                                            disabled={updateLoading}
                                            className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400/60 text-left transition-all group flex items-start gap-2.5 cursor-pointer shadow-sm hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                                        >
                                            <span className="text-base shrink-0 pt-0.5">{opt.icon}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs font-bold text-white group-hover:text-indigo-300 flex items-center justify-between">
                                                    <span>{opt.label}</span>
                                                    <span className="text-[11px] text-zinc-500 group-hover:text-indigo-400 transition-transform group-hover:translate-x-1">➔</span>
                                                </div>
                                                <p className="text-[10px] text-zinc-400 leading-tight mt-0.5">{opt.description}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Conversation Message Stream */}
                {safeMessages.map((message, index) => {
                    const isLatestAi = message.role === "ai" && index === safeMessages.length - 1;
                    const fallback = isLatestAi ? getDomainSuggestions(website?.title, code, currentTurnCount) : null;

                    const rawCard = message.interactiveCard || fallback?.interactiveCard;
                    const rawSuggestions = (Array.isArray(message.suggestions) && message.suggestions.length > 0)
                        ? message.suggestions
                        : (fallback ? fallback.suggestions : []);

                    // Deduplication Filter: Guarantee Quick Toggles never duplicate any Active Card Option
                    let deduplicatedSuggestions = rawSuggestions;
                    if (rawCard && Array.isArray(rawCard.options)) {
                        const cardKeys = rawCard.options.map(o => (o.label || "").toLowerCase().replace(/[^a-z0-9]/g, ""));
                        deduplicatedSuggestions = rawSuggestions.filter(s => {
                            const sKey = (s.label || "").toLowerCase().replace(/[^a-z0-9]/g, "");
                            return !cardKeys.some(cKey => cKey.includes(sKey) || sKey.includes(cKey));
                        });
                    }

                    const isUser = message.role === "user";

                    return (
                        <div
                            key={index}
                            className={`flex flex-col space-y-1.5 ${
                                isUser ? "items-end" : "items-start"
                            }`}
                        >
                            {/* Role Label & Timestamp */}
                            <div className="flex items-center gap-1.5 px-1 text-[11px] text-zinc-400">
                                {isUser ? (
                                    <>
                                        <span>{formatTimestamp(message.createdAt)}</span>
                                        <span className="font-semibold text-zinc-300">You</span>
                                        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold">
                                            <User size={11} />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-sm">
                                            <Bot size={11} />
                                        </div>
                                        <span className="font-semibold text-indigo-300">AI Co-Pilot</span>
                                        <span>•</span>
                                        <span>{formatTimestamp(message.createdAt)}</span>
                                    </>
                                )}
                            </div>

                            {/* Main Message Bubble */}
                            <div
                                className={`group relative px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words transition-all ${
                                    isUser
                                        ? "max-w-[88%] bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-tr-sm shadow-md shadow-indigo-950/40"
                                        : "max-w-[98%] bg-zinc-900/95 border border-white/10 text-zinc-200 rounded-tl-sm shadow-xl hover:border-white/20"
                                }`}
                            >
                                <div className="text-[13px]">{message.content}</div>

                                {/* Copy message pill */}
                                {!isUser && (
                                    <button
                                        onClick={() => handleCopyMessage(message.content, index)}
                                        className="absolute -top-2.5 right-3 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-0.5 rounded-full bg-zinc-800 border border-white/10 text-[10px] text-zinc-300 hover:text-white flex items-center gap-1 shadow-md cursor-pointer"
                                        title="Copy response"
                                    >
                                        {copiedMessageIdx === index ? (
                                            <>
                                                <Check size={10} className="text-emerald-400" />
                                                <span className="text-emerald-400">Copied</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={10} />
                                                <span>Copy</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            {/* Interactive AI Co-Pilot Strategic Card & Quick Toggles */}
                            {!isUser && (
                                <div className="w-full space-y-3 pt-1">
                                    
                                    {/* 1. Multi-Choice Interactive Inquiry Card */}
                                    {rawCard && Array.isArray(rawCard.options) && rawCard.options.length > 0 && (
                                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-black border border-indigo-500/30 text-left space-y-2.5 shadow-xl animate-fadeIn">
                                            <div className="flex items-center gap-1.5 text-indigo-400 font-extrabold text-[11px] uppercase tracking-wider">
                                                <Compass size={13} className="text-amber-400" />
                                                <span>AI Co-Pilot Inquires:</span>
                                            </div>
                                            <p className="text-xs font-bold text-white leading-snug">
                                                {rawCard.question}
                                            </p>
                                            <div className="space-y-2 pt-1">
                                                {rawCard.options.map((opt, oIdx) => (
                                                    <button
                                                        key={oIdx}
                                                        onClick={() => handleUpdate(opt.prompt)}
                                                        disabled={updateLoading}
                                                        className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-gradient-to-r hover:from-indigo-900/50 hover:to-purple-900/40 border border-white/10 hover:border-indigo-400/50 text-left transition-all group flex items-start gap-2.5 cursor-pointer shadow-sm hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                                                    >
                                                        <span className="text-base shrink-0 pt-0.5">{opt.icon || "⚡"}</span>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-xs font-extrabold text-white group-hover:text-indigo-300 flex items-center justify-between">
                                                                <span>{opt.label}</span>
                                                                <span className="text-[11px] text-zinc-500 group-hover:text-indigo-400 transition-transform group-hover:translate-x-1">➔</span>
                                                            </div>
                                                            {opt.description && (
                                                                <p className="text-[10px] text-zinc-400 leading-tight mt-0.5 font-normal">
                                                                    {opt.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 2. Secondary Unique Quick Action Pills */}
                                    {deduplicatedSuggestions.length > 0 && (
                                        <div className="space-y-1.5 text-left pt-0.5">
                                            <span className="text-[10px] uppercase font-extrabold text-zinc-400 tracking-wider flex items-center gap-1.5">
                                                <Zap size={11} className="text-amber-400" />
                                                <span>Quick Toggles:</span>
                                            </span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {deduplicatedSuggestions.map((s, sIdx) => (
                                                    <button
                                                        key={sIdx}
                                                        onClick={() => handleUpdate(s.prompt || s.label)}
                                                        disabled={updateLoading}
                                                        className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 text-white font-semibold text-xs border border-white/10 hover:border-transparent transition-all shadow-md hover:scale-[1.02] active:scale-95 disabled:opacity-50 text-left cursor-pointer flex items-center gap-1.5 group"
                                                    >
                                                        <span>{s.label}</span>
                                                        <span className="text-[10px] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform">➔</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Real-time AI Thinking Card */}
                {updateLoading && (
                    <div className="max-w-[95%] mr-auto space-y-1.5 animate-fadeIn">
                        <div className="flex items-center gap-1.5 px-1 text-[11px] text-zinc-400">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                                <Sparkles size={11} className="animate-spin" />
                            </div>
                            <span className="font-semibold text-indigo-300">AI Co-Pilot is coding...</span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-zinc-900 border border-indigo-500/30 text-zinc-200 shadow-xl space-y-2.5">
                            <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                                    <span className="font-bold text-white">
                                        {thinkingSteps[thinkingIndex].title}
                                    </span>
                                </div>
                                <span className="text-[10px] font-mono text-indigo-400 font-semibold">
                                    {thinkingSteps[thinkingIndex].progress}%
                                </span>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700 ease-out"
                                    style={{ width: `${thinkingSteps[thinkingIndex].progress}%` }}
                                />
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-0.5">
                                <span>{thinkingSteps[thinkingIndex].detail}</span>
                                <div className="flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <span className="w-1 h-1 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <span className="w-1 h-1 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Auto-scroll target anchor */}
                <div ref={messagesEndRef} className="h-1" />

                {/* Floating Jump to Latest Button */}
                {showScrollBottom && (
                    <button
                        onClick={() => scrollToBottom("smooth")}
                        className="sticky bottom-2 left-1/2 -translate-x-1/2 z-20 px-3 py-1.5 rounded-full bg-zinc-800/90 border border-white/20 hover:bg-zinc-700 text-white text-xs font-semibold shadow-2xl flex items-center gap-1.5 backdrop-blur-md transition-all hover:scale-105"
                    >
                        <ArrowDown size={12} />
                        <span>Jump to latest</span>
                    </button>
                )}

            </div>
        );
    };

    // ==========================================
    // HEADER RENDERER
    // ==========================================

    const renderHeader = (onClose) => (
        <div className="h-14 shrink-0 px-4 flex items-center justify-between border-b border-white/10 bg-black">
            <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
                    <Sparkles size={16} />
                </div>
                <div className="min-w-0">
                    <span className="font-semibold text-sm truncate block text-white">
                        {website?.title || "Untitled Website"}
                    </span>
                    <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                        <span>Live AI Editor</span>
                    </span>
                </div>
            </div>

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
    // CHAT INPUT RENDERER (LIVE AI CONSOLE)
    // ==========================================

    const renderChatInput = () => {
        const chips = getQuickPromptChips();

        return (
            <div className="border-t border-white/10 bg-black/95 backdrop-blur-md flex flex-col">
                {/* Dynamic Quick Prompt Chips */}
                <div className="px-3 pt-2.5 pb-1.5 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider shrink-0 flex items-center gap-1">
                        <Sparkles size={10} className="text-amber-400" />
                        <span>Ideas:</span>
                    </span>
                    {chips.map((chip, cIdx) => (
                        <button
                            key={cIdx}
                            onClick={() => handleUpdate(chip.prompt)}
                            disabled={updateLoading}
                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-indigo-600/30 hover:border-indigo-500/50 text-[11px] font-medium text-zinc-300 hover:text-white border border-white/5 transition-all shrink-0 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                        >
                            {chip.label}
                        </button>
                    ))}
                </div>

                {/* Input Console */}
                <div className="p-3 pt-1.5">
                    <div className="relative flex items-center rounded-2xl bg-zinc-900/90 border border-white/15 focus-within:border-indigo-500 focus-within:shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all">
                        <input
                            type="text"
                            placeholder="Message AI Co-Pilot... (e.g. 'Add a sticky glass navbar')"
                            className="flex-1 min-w-0 rounded-2xl px-4 py-3 bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none"
                            value={prompt}
                            disabled={updateLoading}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleUpdate();
                                }
                            }}
                        />

                        {prompt && (
                            <button
                                onClick={() => setPrompt("")}
                                className="p-1.5 text-zinc-400 hover:text-white transition mr-1"
                                title="Clear input"
                            >
                                <X size={14} />
                            </button>
                        )}

                        <button
                            className="mr-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-md shadow-indigo-900/40 hover:shadow-indigo-700/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 text-xs hover:scale-105 active:scale-95 shrink-0"
                            disabled={updateLoading || !prompt.trim()}
                            onClick={() => handleUpdate()}
                            title="Send prompt to AI"
                        >
                            <span>Send</span>
                            <Send size={13} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-zinc-500 px-1 pt-1.5 font-medium">
                        <span>Press <kbd className="px-1 py-0.5 rounded bg-white/10 text-zinc-300 font-mono text-[9px]">Enter ↵</kbd> to send</span>
                        <span>AI directly updates live preview</span>
                    </div>
                </div>
            </div>
        );
    };

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
                            title="Fullscreen Preview"
                        >
                            <Monitor size={18} />
                        </button>

                        <button
                            className="p-2 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-lg transition"
                            onClick={() =>
                                setShowDeleteModal(true)
                            }
                            title="Delete project from database"
                        >
                            <Trash2 size={18} />
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

            {/* DELETE CONFIRMATION MODAL */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
                    <div className="w-full max-w-md p-6 rounded-2xl border border-white/10 bg-zinc-950 text-white shadow-2xl">
                        <div className="w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/20 text-red-400 flex items-center justify-center mb-4">
                            <Trash2 size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Delete Project from Database?</h3>
                        <p className="text-sm text-zinc-400 mb-6">
                            Are you sure you want to permanently delete <strong className="text-red-400 font-semibold">"{website?.title || "Untitled Project"}"</strong>? This will remove all generated code, assets, and AI conversation history from MongoDB. This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isDeleting}
                                className="px-4 py-2.5 rounded-xl text-sm font-medium border border-white/10 hover:bg-white/5 text-zinc-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteSite}
                                disabled={isDeleting}
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-500 text-white flex items-center gap-2 transition disabled:opacity-60 cursor-pointer"
                            >
                                {isDeleting ? "Deleting..." : "Permanently Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default WebsiteEditor;