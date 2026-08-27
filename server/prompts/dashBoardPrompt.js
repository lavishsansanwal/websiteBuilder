import commonRules from "./commonRules.js";

const dashboardPrompt = `
${commonRules}

==================================================
PAGE TYPE: UNIVERSAL ENTERPRISE DATA & ANALYTICS DASHBOARD
==================================================

You are generating a breathtaking, state-of-the-art Analytics & Operations Dashboard using Tailwind CSS, Lucide icons, and Chart.js.
The layout must be modern, highly functional, interactive, and styled like Stripe, Linear, Datadog, and Sensor Tower.

USER PROMPT:
{USER_PROMPT}

UPLOADED DATASET SUMMARY & RECORDS:
{UPLOADED_DATA}

==================================================
KEY USER-FRIENDLY & ANALYTICAL FEATURES TO INCLUDE:
==================================================
1. EXECUTIVE 4-KPI SUMMARY STRIP:
   - Display real calculated totals, averages, and peak values from {UPLOADED_DATA}.
   - Currency values formatted with symbols ($ / € / ₹) and decimals.
   - Volume/Count metrics formatted with locale commas (e.g. 9,482).
   - Rank / Score / Status badges in glowing emerald, cyan, amber, or purple pills.

2. THE 3-CHART INTELLIGENCE SUITE:
   - Chart 1 (Top Distribution): Bar or Line chart displaying the top 10 items by primary metric. If outliers exist, ensure tooltip and scale do not distort.
   - Chart 2 (Composition Ratio): Doughnut chart showing primary category / type distribution with clean legend and percentage badges.
   - Chart 3 (2x2 Opportunity Matrix / Scatter Bubble): An interactive 2x2 scatter/bubble quadrant chart (e.g., Competition Index vs. Volume / Yield, or Cost vs. Revenue) mapping High-Opportunity vs Strategic-Focus items.

3. INTERACTIVE DATASET EXPLORER:
   - Client-side reactive data array containing exact records from {UPLOADED_DATA}.
   - Quick Filter Chips auto-generated for key categories and top ranks.
   - Real-time search across all columns.
   - Multi-column sort dropdown (numerical, alphabetical, rank).
   - Pagination (10 per page) with record counters ("Showing 1 to 10 of N").
   - 1-Click Clipboard Copy on primary item names.
   - Clickable table rows that open the Record Inspection Drawer (#recordDrawer).

4. MULTI-EXPORT SUITE:
   - Export CSV (onclick="exportToCSV()"): Safe Blob download with NO unescaped newline syntax errors.
   - Export JSON (onclick="exportToJSON()"): Clean JSON file download.
   - Print / Save PDF (onclick="window.print()").

5. ZERO SYNTAX ERRORS & CLEAN HTML:
   - NEVER put raw multi-line string literals inside double quotes in JavaScript. Always use \\n or array joins.
   - Single clean <body class="..."> tag without duplicate class attributes.

==================================================
EXACT HTML & TAILWIND LAYOUT STRUCTURE (MANDATORY)
==================================================

Build the document following this exact clean architecture:

\`\`\`html
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Enterprise Analytics & Intelligence Dashboard</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif']
          },
          colors: {
            dark: { 950: '#070b12', 900: '#0b0f19', 800: '#111827', 700: '#1f2937' },
            indigoBrand: { 400: '#818cf8', 500: '#6366f1', 600: '#4f46e5' }
          }
        }
      }
    }
  </script>
  <style>
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: rgba(11, 15, 25, 0.8); }
    ::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.3); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.6); }
    .glass-card { background: rgba(11, 15, 25, 0.85); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.08); }
  </style>
</head>
<body class="bg-[#070b12] text-slate-100 font-sans flex h-screen overflow-hidden transition-colors duration-300">

  <!-- TOAST NOTIFICATION CONTAINER -->
  <div id="toastContainer" class="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none"></div>

  <!-- ================= SIDEBAR NAVIGATION ================= -->
  <aside class="w-64 min-w-[16rem] h-full bg-[#0b0f19] border-r border-slate-800/80 p-5 flex flex-col justify-between overflow-y-auto hidden md:flex">
    <div class="space-y-6">
      <!-- BRAND LOGO -->
      <div class="flex items-center gap-3 px-1">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <i data-lucide="sparkles" class="w-5 h-5 text-white"></i>
        </div>
        <div>
          <h1 class="text-base font-bold text-white tracking-tight leading-tight">NexusAnalytics</h1>
          <p class="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">Enterprise OS</p>
        </div>
      </div>

      <!-- QUICK SEARCH IN SIDEBAR -->
      <div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 focus-within:border-indigo-500 transition">
        <i data-lucide="search" class="w-3.5 h-3.5 text-slate-500"></i>
        <input type="text" id="sidebarSearch" onkeyup="filterTable(this.value)" placeholder="Search dataset..." class="bg-transparent text-slate-200 outline-none w-full placeholder-slate-500 text-xs">
      </div>

      <!-- NAV NAVIGATION -->
      <nav class="space-y-1.5">
        <a href="#overview" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 shadow-sm transition">
          <i data-lucide="layout-dashboard" class="w-4 h-4"></i> Metrics Overview
        </a>
        <a href="#charts" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition">
          <i data-lucide="bar-chart-3" class="w-4 h-4"></i> Visual Analytics
        </a>
        <a href="#tableSection" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition">
          <i data-lucide="database" class="w-4 h-4"></i> Data Explorer
        </a>
        <a href="#opportunityMatrix" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition">
          <i data-lucide="crosshair" class="w-4 h-4"></i> Opportunity Matrix
        </a>
      </nav>
    </div>

    <!-- SIDEBAR FOOTER -->
    <div class="space-y-4 pt-4 border-t border-slate-800/80">
      <div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span id="sidebarRecordStatus">Verified Dataset Synced</span>
      </div>

      <div class="flex items-center justify-between pt-1">
        <div class="flex items-center gap-3">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" alt="Avatar" class="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30">
          <div>
            <p class="text-xs font-bold text-white truncate w-24">Alex Morgan</p>
            <p class="text-[10px] text-slate-400">Lead Analyst</p>
          </div>
        </div>
        <button onclick="toggleTheme()" title="Toggle Dark/Light Mode" class="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition">
          <i data-lucide="sun" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
  </aside>

  <!-- ================= MAIN CONTENT AREA ================= -->
  <main class="flex-1 min-w-0 flex flex-col h-full overflow-y-auto bg-[#070b12]">
    
    <!-- TOP HEADER -->
    <header class="h-16 border-b border-slate-800/80 px-6 sm:px-8 flex items-center justify-between sticky top-0 bg-[#070b12]/90 backdrop-blur-xl z-20">
      <div class="flex items-center gap-2 text-xs text-slate-400">
        <span class="hidden sm:inline">Dataset Intelligence</span>
        <span class="hidden sm:inline">/</span>
        <span class="text-white font-semibold" id="headerTitle">Analytics Report</span>
      </div>

      <div class="flex items-center gap-3">
        <button onclick="window.print()" title="Print Report / Save PDF" class="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold px-3">
          <i data-lucide="printer" class="w-3.5 h-3.5"></i>
          <span class="hidden sm:inline">Print PDF</span>
        </button>
        <button onclick="exportToJSON()" title="Export JSON" class="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold px-3">
          <i data-lucide="file-json" class="w-3.5 h-3.5"></i>
          <span class="hidden sm:inline">JSON</span>
        </button>
        <button onclick="exportToCSV()" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 hover:opacity-95 transition">
          <i data-lucide="download" class="w-3.5 h-3.5"></i>
          <span>Export CSV</span>
        </button>
      </div>
    </header>

    <!-- DASHBOARD CONTAINER -->
    <div class="p-6 sm:p-8 space-y-8 max-w-7xl w-full mx-auto" id="overview">

      <!-- BANNER -->
      <div class="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-slate-900 border border-indigo-500/20 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="relative z-10 space-y-1">
          <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">Intelligence Feed Active</span>
          <h2 class="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Executive Performance & Metric Overview</h2>
          <p class="text-xs text-slate-400 max-w-2xl">Interactive analytics, opportunity clustering, statistical distributions, and deep-dive dataset explorer.</p>
        </div>
        <div class="relative z-10 flex items-center gap-3 shrink-0">
          <button onclick="showToast('Re-computed metric aggregates across all rows! ⚡')" class="px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition flex items-center gap-2">
            <i data-lucide="refresh-cw" class="w-3.5 h-3.5 text-indigo-400"></i> Sync Metrics
          </button>
        </div>
      </div>

      <!-- ================= 1. 4-KPI SUMMARY STRIP ================= -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <!-- DYNAMIC KPI CARD 1: TOTAL RECORDS / ENTITIES -->
        <!-- DYNAMIC KPI CARD 2: PRIMARY VOLUME / SUM -->
        <!-- DYNAMIC KPI CARD 3: AVERAGE BENCHMARK / RATIO -->
        <!-- DYNAMIC KPI CARD 4: PEAK PERFORMER / TOP PROSPECT -->
      </div>

      <!-- ================= 2. MULTI-CHART INTELLIGENCE SUITE ================= -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6" id="charts">
        
        <!-- CHART 1: TOP 10 DISTRIBUTION (BAR / LINE) -->
        <div class="lg:col-span-2 p-6 rounded-2xl glass-card shadow-xl space-y-4 flex flex-col justify-between">
          <div class="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 class="text-base font-bold text-white flex items-center gap-2">
                <i data-lucide="bar-chart-2" class="w-4 h-4 text-indigo-400"></i>
                <span id="chart1Title">Top Entity Metric Distribution</span>
              </h3>
              <p class="text-xs text-slate-400">Comparative performance across top dataset items</p>
            </div>
          </div>
          <div class="h-72 w-full relative">
            <canvas id="distributionBarChart"></canvas>
          </div>
        </div>

        <!-- CHART 2: COMPOSITION DONUT -->
        <div class="p-6 rounded-2xl glass-card shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <h3 class="text-base font-bold text-white flex items-center gap-2">
              <i data-lucide="pie-chart" class="w-4 h-4 text-emerald-400"></i>
              <span id="chart2Title">Classification Breakdown</span>
            </h3>
            <p class="text-xs text-slate-400">Ratio distribution by category</p>
          </div>
          <div class="h-56 w-full relative flex items-center justify-center">
            <canvas id="compositionDonutChart"></canvas>
          </div>
          <div id="donutStatsSummary" class="pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
            <!-- Dynamic Badges -->
          </div>
        </div>

      </div>

      <!-- ================= 3. 2x2 OPPORTUNITY QUADRANT SCATTER MATRIX ================= -->
      <div class="p-6 rounded-2xl glass-card shadow-xl space-y-4" id="opportunityMatrix">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 class="text-base font-bold text-white flex items-center gap-2">
              <i data-lucide="crosshair" class="w-4 h-4 text-cyan-400"></i>
              <span>2x2 Strategic Opportunity Quadrant</span>
            </h3>
            <p class="text-xs text-slate-400">Identify high-yield opportunities vs high-friction targets at a glance</p>
          </div>
          <div class="flex items-center gap-2 text-[11px] font-semibold">
            <span class="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">🟢 High Opportunity</span>
            <span class="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">🟣 High Volume</span>
            <span class="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">🟡 Monitor</span>
          </div>
        </div>
        <div class="h-80 w-full relative">
          <canvas id="opportunityScatterChart"></canvas>
        </div>
      </div>

      <!-- ================= 4. INTERACTIVE DATASET EXPLORER ================= -->
      <div class="p-6 rounded-2xl glass-card shadow-xl space-y-5" id="tableSection">
        
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 class="text-lg font-bold text-white flex items-center gap-2.5">
              <i data-lucide="table" class="w-5 h-5 text-indigo-400"></i>
              <span>Dataset Explorer</span>
              <span id="tableRowsBadge" class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">Records</span>
            </h3>
            <p class="text-xs text-slate-400">Click any row to inspect deep-dive record details</p>
          </div>

          <div class="flex items-center flex-wrap gap-3">
            <div class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs focus-within:border-indigo-500 transition">
              <i data-lucide="search" class="w-3.5 h-3.5 text-slate-400"></i>
              <input type="text" id="tableSearch" onkeyup="filterTable(this.value)" placeholder="Search any column..." class="bg-transparent text-slate-200 outline-none placeholder-slate-500 text-xs w-44 sm:w-60">
            </div>

            <div class="relative flex items-center">
              <i data-lucide="arrow-up-down" class="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none"></i>
              <select id="sortSelect" onchange="sortTable(this.value)" class="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl pl-9 pr-4 py-2 outline-none focus:border-indigo-500 cursor-pointer font-medium">
                <option value="default">Sort: Default Order</option>
                <!-- Dynamic Sort Options generated from columns -->
              </select>
            </div>
          </div>
        </div>

        <!-- QUICK FILTER CHIPS -->
        <div id="filterChipsContainer" class="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <!-- Dynamic Chips -->
        </div>

        <!-- TABLE WRAPPER -->
        <div class="overflow-x-auto rounded-xl border border-slate-800/80">
          <table class="w-full text-left text-xs text-slate-300">
            <thead id="tableHeader" class="bg-slate-900/95 uppercase tracking-wider text-[10px] text-slate-400 font-bold border-b border-slate-800/80 sticky top-0 backdrop-blur-md">
              <!-- Dynamically rendered <th> for each column in {UPLOADED_DATA} -->
            </thead>
            <tbody id="tableBody" class="divide-y divide-slate-800/60 font-medium">
              <!-- Dynamically rendered <tr> for rows -->
            </tbody>
          </table>
        </div>

        <!-- TABLE PAGINATION FOOTER -->
        <div class="flex items-center justify-between flex-wrap gap-4 pt-2 text-xs text-slate-400">
          <div id="tableInfo">
            Showing <span id="shownStart" class="text-white font-bold">1</span> to <span id="shownEnd" class="text-white font-bold">10</span> of <span id="totalRowsCount" class="text-white font-bold">0</span> records
          </div>

          <div class="flex items-center gap-2">
            <button onclick="prevPage()" class="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition font-medium flex items-center gap-1">
              <i data-lucide="chevron-left" class="w-3.5 h-3.5"></i> Previous
            </button>
            <span id="pageIndicator" class="px-3.5 py-1.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-bold">Page 1</span>
            <button onclick="nextPage()" class="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition font-medium flex items-center gap-1">
              Next <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>

      </div>

    </div>
  </main>

  <!-- ================= RECORD INSPECTION DRAWER ================= -->
  <div id="recordDrawer" class="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-[#0b0f19] border-l border-slate-800 shadow-2xl p-6 transform translate-x-full transition-transform duration-300 overflow-y-auto flex flex-col justify-between">
    <div class="space-y-6">
      <div class="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <span class="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Record Intelligence</span>
          <h3 id="drawerRecordTitle" class="text-lg font-bold text-white">Item Details</h3>
        </div>
        <button onclick="closeRecordDrawer()" class="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white transition">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>

      <div id="drawerFieldList" class="space-y-3 text-xs">
        <!-- Dynamically rendered key-value pairs -->
      </div>
    </div>

    <div class="pt-6 border-t border-slate-800 flex items-center gap-3">
      <button onclick="copyDrawerRecord()" class="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center justify-center gap-2">
        <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copy JSON Record
      </button>
      <button onclick="closeRecordDrawer()" class="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs hover:text-white transition">
        Close
      </button>
    </div>
  </div>

  <!-- ================= JAVASCRIPT ENGINE ================= -->
  <script>
    // RAW DATASET INGESTION
    const rawDataset = [
      /* Insert EXACT array of objects from exactDataRows in {UPLOADED_DATA} */
    ];

    let currentData = [...rawDataset];
    let currentPage = 1;
    const pageSize = 10;
    let selectedDrawerRecord = null;

    // RENDER TABLE FUNCTION
    function renderTable() {
      // Handles slicing, rendering tr rows with badges, progress bars, and click listeners
    }

    // SEARCH & FILTER
    function filterTable(q) {
      const query = (q || '').toLowerCase().trim();
      currentData = rawDataset.filter(row => {
        return Object.values(row).some(val => String(val).toLowerCase().includes(query));
      });
      currentPage = 1;
      renderTable();
    }

    // SAFE EXPORT TO CSV (NO UNTERMINATED STRING LITERALS)
    function exportToCSV() {
      if (!rawDataset.length) return;
      const headers = Object.keys(rawDataset[0]);
      const csvRows = [headers.join(',')];

      rawDataset.forEach(row => {
        const values = headers.map(header => {
          const val = row[header] === undefined || row[header] === null ? '' : String(row[header]);
          const escaped = val.replace(/"/g, '""');
          return '"' + escaped + '"';
        });
        csvRows.push(values.join(','));
      });

      const blob = new Blob([csvRows.join('\\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'dataset_analytics_export_' + Date.now() + '.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('Dataset exported as CSV! 📥');
    }

    // EXPORT TO JSON
    function exportToJSON() {
      const dataStr = JSON.stringify(rawDataset, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'dataset_analytics_export_' + Date.now() + '.json');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('Dataset exported as JSON! 📦');
    }

    // RECORD DRAWER
    function openRecordDrawer(index) {
      const record = currentData[index];
      if (!record) return;
      selectedDrawerRecord = record;
      
      const drawer = document.getElementById('recordDrawer');
      const titleEl = document.getElementById('drawerRecordTitle');
      const fieldList = document.getElementById('drawerFieldList');
      
      titleEl.textContent = record[Object.keys(record)[0]] || 'Record Deep-Dive';
      fieldList.innerHTML = '';

      Object.entries(record).forEach(([k, v]) => {
        const div = document.createElement('div');
        div.className = 'p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between';
        div.innerHTML = '<span class="text-slate-400 font-medium">' + k + ':</span><span class="text-white font-bold font-mono">' + v + '</span>';
        fieldList.appendChild(div);
      });

      drawer.classList.remove('translate-x-full');
      if (window.lucide) lucide.createIcons();
    }

    function closeRecordDrawer() {
      const drawer = document.getElementById('recordDrawer');
      if (drawer) drawer.classList.add('translate-x-full');
    }

    function copyDrawerRecord() {
      if (selectedDrawerRecord && navigator.clipboard) {
        navigator.clipboard.writeText(JSON.stringify(selectedDrawerRecord, null, 2));
        showToast('Record JSON copied to clipboard! 📋');
      }
    }

    // TOAST SYSTEM
    function showToast(msg) {
      const container = document.getElementById('toastContainer');
      if (!container) return;
      const toast = document.createElement('div');
      toast.className = 'px-4 py-3 rounded-xl bg-slate-900 border border-indigo-500/40 text-xs font-semibold text-white shadow-2xl flex items-center gap-2 transform transition-all duration-300 translate-y-4 opacity-0 pointer-events-auto';
      toast.innerHTML = '<i data-lucide="sparkles" class="w-4 h-4 text-indigo-400"></i><span>' + msg + '</span>';
      container.appendChild(toast);
      if (window.lucide) lucide.createIcons();

      setTimeout(() => { toast.classList.remove('translate-y-4', 'opacity-0'); }, 10);
      setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
      }, 3500);
    }
  </script>
</body>
</html>
\`\`\`

==================================================
STRICT DATA BINDING REQUIREMENTS:
==================================================
1. DATA TABLE HEADERS (<th>): Dynamically generate <th> elements matching EVERY column in {UPLOADED_DATA}.
2. DATA TABLE ROWS (<tr>): Dynamically generate <tr> table rows containing the EXACT rows from exactDataRows in {UPLOADED_DATA}.
3. 3 CHARTS WITH REAL DATA:
   - Render Chart 1: Bar/Line distribution.
   - Render Chart 2: Donut composition.
   - Render Chart 3: 2x2 Opportunity Quadrant Scatter Bubble Chart with X and Y values from the dataset.
4. METRIC STRIP: Display REAL calculated values from columnProfiles in {UPLOADED_DATA}.
5. SAFE JAVASCRIPT: Ensure exportToCSV() uses safe Blob with \\n linebreaks.

Return ONLY the single raw JSON object without markdown code fences:
{
  "code": "<!DOCTYPE html>...",
  "message": "Overview of the enterprise dashboard generated with your uploaded dataset",
  "imageQueries": []
}
`;

export default dashboardPrompt;