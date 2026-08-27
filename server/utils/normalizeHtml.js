/**
 * Deterministic HTML & CSS Normalizer.
 * Guarantees that EVERY generated website has a clean layout,
 * hidden modals/drawers on initial load, vertical body flow, and working CDNs.
 */
export function stripJsonArtifacts(code) {
    if (!code || typeof code !== "string") return "";
    let clean = code.trim();

    clean = clean.replace(/^```(?:html|json|javascript|js|jsx|react)?\s*/i, "").replace(/\s*```$/i, "").trim();
    clean = clean.replace(/^\{\s*["']?code["']?\s*:\s*["'`]/i, "").trim();
    clean = clean.replace(/["'`]\s*,\s*["']?message["']?\s*:\s*[\s\S]*?\}\s*$/i, "").trim();
    clean = clean.replace(/["'`]\s*,\s*["']?imageQueries["']?\s*:\s*[\s\S]*?\}\s*$/i, "").trim();
    clean = clean.replace(/["'`]\s*\}\s*$/i, "").trim();

    const docTypeIdx = clean.search(/<!DOCTYPE\s+html/i);
    if (docTypeIdx > 0) {
        clean = clean.slice(docTypeIdx);
    } else {
        const htmlTagIdx = clean.search(/<html[\s>]/i);
        if (htmlTagIdx > 0 && !clean.includes("<!DOCTYPE")) {
            clean = clean.slice(htmlTagIdx);
        }
    }

    const endHtmlIdx = clean.search(/<\/html>/i);
    if (endHtmlIdx !== -1) {
        clean = clean.slice(0, endHtmlIdx + 7);
    }

    return clean.trim();
}

export function normalizeHtml(html) {
    if (!html || typeof html !== "string") return html;

    const sanitizedInput = stripJsonArtifacts(html);

    // Do NOT normalize React (JSX) component code
    const isReact = /export\s+default/i.test(sanitizedInput) ||
                    /import\s+React/i.test(sanitizedInput) ||
                    /function\s+App/i.test(sanitizedInput) ||
                    /const\s+App\s*=/i.test(sanitizedInput) ||
                    /use(State|Effect|Memo|Ref|Callback)\s*\(/i.test(sanitizedInput);
    if (isReact) {
        return sanitizedInput;
    }

    let normalized = sanitizedInput
        .replace(/<script>(?:(?!<\/script>)[\s\S])*?__DEFENSIVE_HELPERS__[\s\S]*?<\/script>/gi, "")
        .replace(/<script>(?:(?!<\/script>)[\s\S])*?Auto-initialize Lucide Icons[\s\S]*?<\/script>/gi, "");

    // 1. Ensure Tailwind CSS CDN is in <head>
    if (!normalized.includes("cdn.tailwindcss.com") && normalized.includes("<head>")) {
        normalized = normalized.replace(
            "<head>",
            `<head>\n  <script src="https://cdn.tailwindcss.com"></script>`
        );
    }

    // 2. Ensure Lucide Icons CDN is in <head>
    if (!normalized.includes("unpkg.com/lucide") && normalized.includes("<head>")) {
        normalized = normalized.replace(
            "<head>",
            `<head>\n  <script src="https://unpkg.com/lucide@latest"></script>`
        );
    }

    // 3. Inject Defensive Global Fallbacks in <head> to prevent ReferenceErrors
    if (normalized.includes("<head>")) {
        const defensiveScript = `
  <script>
    /* __DEFENSIVE_HELPERS__ */
    window.openModal = window.openModal || function(id) {
      var el = document.getElementById(id);
      if (el) { el.style.display = 'flex'; }
      if (window.lucide) lucide.createIcons();
    };
    window.closeModal = window.closeModal || function(id) {
      var el = document.getElementById(id);
      if (el) { el.style.display = 'none'; }
    };
    window.toggleDrawer = window.toggleDrawer || function(id) {
      var el = document.getElementById(id);
      if (el) { el.classList.toggle('translate-x-full'); }
      if (window.lucide) lucide.createIcons();
    };
    window.showToast = window.showToast || function(msg) {
      var existing = document.getElementById('globalToast');
      if (existing) existing.remove();
      var toast = document.createElement('div');
      toast.id = 'globalToast';
      toast.className = 'fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-amber-500 text-black text-xs font-extrabold shadow-2xl transition-all duration-300 flex items-center gap-2';
      toast.innerHTML = '<span>' + (msg || 'Action completed successfully!') + '</span>';
      document.body.appendChild(toast);
      setTimeout(function() { toast.remove(); }, 3000);
    };
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
    window.filterData = window.filterData || window.filterStatus;

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

    window.openLeadModal = window.openLeadModal || function() { (window.openModal && (window.openModal('leadModal') || window.openModal('contactModal'))) || window.showToast('Sign up form opened!'); };
    window.closeLeadModal = window.closeLeadModal || function() { window.closeModal && (window.closeModal('leadModal') || window.closeModal('contactModal')); };
    window.submitLeadForm = window.submitLeadForm || function(e) {
      if (e && e.preventDefault) e.preventDefault();
      var form = (e && e.target) || document.querySelector('#contact form') || document.querySelector('form');
      var name = (form && (form.querySelector('input[name="name"]') || form.querySelector('input[type="text"]')) || {}).value || 'there';
      window.showToast('Thank you, ' + name + '! We received your inquiry and will contact you shortly. 🚀');
      if (form && form.reset) form.reset();
    };
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



    function handleGlobalClick(event) {
      var link = event.target.closest("a");
      if (link) {
        var href = (link.getAttribute("href") || "").trim();
        if (!href || href === "#" || href === "/" || href.startsWith("javascript:")) {
          event.preventDefault();
          return;
        }
        if (href.startsWith("#")) {
          event.preventDefault();
          var targetId = decodeURIComponent(href.slice(1)).trim();
          var target = document.getElementById(targetId) || document.querySelector(href);
          if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        if (href.startsWith("http://") || href.startsWith("https://")) {
          event.preventDefault();
          window.open(href, "_blank", "noopener,noreferrer");
          return;
        }
        event.preventDefault();
        var cleanId = (href.startsWith('/') ? href.slice(1) : href).trim();
        var fallbackTarget = document.getElementById(cleanId) || document.querySelector('[data-section="' + cleanId + '"]');
        if (fallbackTarget) fallbackTarget.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    window.addEventListener("click", handleGlobalClick, true);
    document.addEventListener("click", handleGlobalClick, true);
  </script>`;
        normalized = normalized.replace(/<head[^>]*>/i, (match) => match + "\n" + defensiveScript);
    }

    // 4. Ensure <body> has vertical flex layout (NEVER horizontal flex row)
    normalized = normalized.replace(/<body([^>]*)>/i, (match, bodyAttrs) => {
        if (!bodyAttrs.includes("flex-col")) {
            return `<body${bodyAttrs} class="bg-[#070b12] text-slate-100 font-sans min-h-screen flex flex-col overflow-x-hidden">`;
        }
        return match;
    });

    // 5. Ensure All Outer Drawers (#cartDrawer, #wishlistDrawer, #filterDrawer, id="*drawer*") are tucked off-screen by default (translate-x-full)
    normalized = normalized.replace(/<div([^>]*?id=["']([^"']+)["'][^>]*?)>/gi, (match, attrs, idVal) => {
        const idLower = idVal.toLowerCase();
        // Skip child elements or non-drawer elements
        const isChildOrNonDrawer = /item|container|footer|header|total|subtotal|count|badge|list|body|btn|button|price|summary|inner|content|title|text|input|form/i.test(idLower);
        const isDrawer = !isChildOrNonDrawer && (
            idLower.endsWith('drawer') || 
            idLower.endsWith('sidebar') ||
            idLower === 'cartdrawer' ||
            idLower === 'cart-drawer' ||
            idLower === 'cart_drawer' ||
            idLower === 'wishlistdrawer' ||
            idLower === 'wishlist-drawer' ||
            idLower === 'filterdrawer' ||
            idLower === 'menudrawer' ||
            idLower === 'navdrawer' ||
            idLower === 'mobiledrawer' ||
            idLower === 'sidedrawer'
        );

        if (isDrawer && !attrs.includes("translate-x-full")) {
            if (attrs.includes("class=")) {
                return match.replace(/class=["']([^"']*)["']/, 'class="$1 translate-x-full transition-transform duration-300 ease-in-out"');
            } else {
                return `<div${attrs} class="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#0b0f19] border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl translate-x-full transition-transform duration-300 ease-in-out">`;
            }
        }
        return match;
    });

    // 6. Ensure All Modals (#productModal, #quickViewModal, #checkoutModal, #trackingModal, #reviewModal, #reservationModal, id="*modal*") are HIDDEN by default on page load
    normalized = normalized.replace(/<div([^>]*?id=["']([^"']+)["'][^>]*?)>/gi, (match, attrs, idVal) => {
        const idLower = idVal.toLowerCase();
        // Skip non-modal elements like buttons, forms, sections, headers, cards
        const isNonModal = /btn|button|trigger|toggle|form|input|text|title|header|footer|badge|count|section|container|wrapper|grid|table|row|card|summary/i.test(idLower);
        const isModal = !isNonModal && (
            idLower.endsWith('modal') ||
            idLower.endsWith('dialog') ||
            idLower.endsWith('popup') ||
            idLower === 'quickview' ||
            idLower === 'quick-view' ||
            idLower === 'checkoutmodal' ||
            idLower === 'trackingmodal' ||
            idLower === 'reservationmodal' ||
            idLower === 'leadmodal' ||
            idLower === 'contactmodal' ||
            idLower === 'reviewmodal'
        );

        if (isModal && !attrs.includes('style="display: none;"') && !attrs.includes("style='display: none;'") && !attrs.includes("display:none")) {
            if (attrs.includes("style=")) {
                return match.replace(/style=["']([^"']*)["']/, 'style="display: none; $1"');
            } else {
                return `<div${attrs} style="display: none;">`;
            }
        }
        return match;
    });

    // 7. Ensure forms do not perform default page reloads/routes
    normalized = normalized.replace(/<form\s+([^>]*?)>/gi, (match, formAttrs) => {
        let cleanAttrs = formAttrs.replace(/action=["'][^"']*["']/gi, 'action="javascript:void(0);"');
        if (!cleanAttrs.includes("onsubmit=")) {
            cleanAttrs = `onsubmit="event.preventDefault();" ${cleanAttrs}`;
        }
        return `<form ${cleanAttrs}>`;
    });

    // 8. Repair any unclosed <script> tags due to token limits
    const lastScriptOpen = normalized.lastIndexOf("<script");
    const lastScriptClose = normalized.lastIndexOf("</script>");
    if (lastScriptOpen > lastScriptClose) {
        const unclosedScriptBody = normalized.slice(lastScriptOpen);
        const backtickCount = (unclosedScriptBody.match(/`/g) || []).length;
        if (backtickCount % 2 !== 0) {
            normalized += "`;\n";
        }
        const openBraces = (unclosedScriptBody.match(/\{/g) || []).length;
        const closeBraces = (unclosedScriptBody.match(/\}/g) || []).length;
        if (openBraces > closeBraces) {
            normalized += "\n".repeat(openBraces - closeBraces) + "}\n".repeat(openBraces - closeBraces);
        }
        normalized = normalized + "\n</script>\n";
    }

    // 9. Ensure lucide.createIcons() is called on DOMContentLoaded
    if (!normalized.includes("lucide.createIcons()") && normalized.includes("</body>")) {
        const lucideScript = `
<script>
  document.addEventListener('DOMContentLoaded', function() {
    if (window.lucide) lucide.createIcons();
  });
</script>
`;
        normalized = normalized.replace("</body>", `${lucideScript}</body>`);
    }

    // 10. Ensure closing </body> and </html>
    if (!normalized.includes("</body>")) {
        normalized += "\n</body>\n</html>";
    }

    return normalized;
}
