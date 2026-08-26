import commonRules from "./commonRules.js";

const dashboardPrompt = `
${commonRules}

==================================================
PAGE TYPE: ENTERPRISE DATA & ANALYTICS DASHBOARD
==================================================

You are generating a breathtaking, state-of-the-art Analytics & Operations Dashboard using Tailwind CSS, Lucide icons, and Chart.js.
The layout must be modern, highly functional, interactive, and styled like Stripe, Linear, and Datadog.

USER PROMPT:
{USER_PROMPT}

UPLOADED DATASET SUMMARY & RECORDS:
{UPLOADED_DATA}

==================================================
KEY USER-FRIENDLY FEATURES TO INCLUDE:
==================================================
1. QUICK FILTER CHIPS: Above the data table, include interactive pill filters (e.g. "All Items", "🏆 Top Ranked (#1-3)", "🔥 High Volume", "⚡ High Prospect", "📊 Brand vs Generic") that filter the table with a single click.
2. VISUAL METRIC BADGES:
   - Rank #1 to #3: Emerald/Green badge (e.g. bg-emerald-500/10 text-emerald-400 border border-emerald-500/20).
   - Rank #4 to #10: Indigo/Blue badge (e.g. bg-indigo-500/10 text-indigo-400 border border-indigo-500/20).
   - Rank #11+: Slate/Amber badge.
3. PROGRESS BARS FOR SCORES: Display competition index and prospect scores with visual horizontal progress bars (e.g. a small div with bg-gradient-to-r from-indigo-500 to-purple-500).
4. ONE-CLICK COPY: Add a small copy button next to keywords/names that calls copyText('keyword') with a toast notification.
5. TABLE PAGINATION & ROWS SELECTOR: Add clean "Showing 1 to 10 of N entries", page buttons, and a rows-per-page selector (10 / 25 / All).
6. THEME TOGGLE: Add a light/dark mode toggle button in the header.
7. MULTI-EXPORT: Provide Export to CSV (onclick="exportToCSV()") and Print/PDF (onclick="window.print()") buttons.

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
  <title>Analytics & Operations Dashboard</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
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
    ::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.6); }
  </style>
</head>
<body class="bg-[#070b12] text-slate-100 font-sans flex h-screen overflow-hidden transition-colors duration-300">

  <!-- ================= SIDEBAR (STICKY, 260px) ================= -->
  <aside class="w-64 min-w-[16rem] h-full bg-[#0b0f19] border-r border-slate-800/80 p-5 flex flex-col justify-between overflow-y-auto">
    <div class="space-y-6">
      <!-- BRAND LOGO -->
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <i data-lucide="sparkles" class="w-5 h-5 text-white"></i>
        </div>
        <div>
          <h1 class="text-base font-bold text-white tracking-tight leading-tight">NexusAnalytics</h1>
          <p class="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Enterprise OS</p>
        </div>
      </div>

      <!-- SEARCH INPUT -->
      <div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 focus-within:border-indigo-500 transition">
        <i data-lucide="search" class="w-3.5 h-3.5 text-slate-500"></i>
        <input type="text" onkeyup="filterTable(this.value)" placeholder="Quick search... (⌘K)" class="bg-transparent text-slate-200 outline-none w-full placeholder-slate-500 text-xs">
        <span class="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400 font-mono">⌘K</span>
      </div>

      <!-- NAV MENU -->
      <nav class="space-y-1.5">
        <a href="#overview" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 shadow-sm transition">
          <i data-lucide="layout-dashboard" class="w-4 h-4"></i> Overview & KPIs
        </a>
        <a href="#charts" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition">
          <i data-lucide="bar-chart-3" class="w-4 h-4"></i> Analytics & Trends
        </a>
        <a href="#tableSection" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition">
          <i data-lucide="database" class="w-4 h-4"></i> Dataset Explorer
        </a>
        <a href="#prospects" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition">
          <i data-lucide="trending-up" class="w-4 h-4"></i> Performance Insights
        </a>
        <a href="#settings" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition">
          <i data-lucide="settings" class="w-4 h-4"></i> Configuration
        </a>
      </nav>
    </div>

    <!-- SIDEBAR FOOTER -->
    <div class="space-y-4 pt-4 border-t border-slate-800/80">
      <div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Live Data Feed Synced</span>
      </div>

      <div class="flex items-center justify-between pt-2">
        <div class="flex items-center gap-3">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" alt="Avatar" class="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30">
          <div>
            <p class="text-xs font-semibold text-white truncate w-24">Alex Morgan</p>
            <p class="text-[10px] text-slate-400">Lead Analyst</p>
          </div>
        </div>
        <button onclick="toggleTheme()" title="Toggle Dark/Light Mode" class="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
          <i data-lucide="sun" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
  </aside>

  <!-- ================= MAIN CONTENT WRAPPER ================= -->
  <main class="flex-1 min-w-0 flex flex-col h-full overflow-y-auto bg-[#070b12]">
    
    <!-- TOP HEADER -->
    <header class="h-16 border-b border-slate-800/80 px-8 flex items-center justify-between sticky top-0 bg-[#070b12]/80 backdrop-blur-xl z-20">
      <div class="flex items-center gap-2 text-xs text-slate-400">
        <span>Intelligence</span>
        <span>/</span>
        <span class="text-white font-medium">Dataset Analysis & Operations</span>
      </div>

      <div class="flex items-center gap-3">
        <!-- TIMEFRAME SELECTOR -->
        <div class="hidden sm:flex items-center gap-1 bg-slate-900/80 border border-slate-800 p-1 rounded-xl text-xs">
          <button class="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-medium shadow-sm">30 Days</button>
          <button class="px-2.5 py-1 rounded-lg text-slate-400 hover:text-white transition">90 Days</button>
          <button class="px-2.5 py-1 rounded-lg text-slate-400 hover:text-white transition">All Time</button>
        </div>

        <button onclick="window.print()" title="Print Dashboard / Save as PDF" class="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition">
          <i data-lucide="printer" class="w-4 h-4"></i>
        </button>

        <button onclick="exportToCSV()" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 hover:opacity-95 transition">
          <i data-lucide="download" class="w-3.5 h-3.5"></i>
          <span>Export Dataset (CSV)</span>
        </button>
      </div>
    </header>

    <!-- DASHBOARD BODY CONTAINER -->
    <div class="p-8 space-y-8 max-w-7xl w-full mx-auto" id="overview">

      <!-- ================= 1. KPI METRICS GRID ================= -->
      <!-- Populate cards with REAL calculated numbers from uploaded dataset! -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <!-- CARD 1 -->
        <div class="relative p-5 rounded-2xl bg-[#0b0f19]/90 border border-slate-800/80 hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300 shadow-xl group">
          <div class="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Records</span>
            <div class="p-2 rounded-xl bg-indigo-500/10 text-indigo-400"><i data-lucide="database" class="w-4 h-4"></i></div>
          </div>
          <p class="text-2xl font-bold text-white mt-3">25 Keywords</p>
          <div class="flex items-center gap-1.5 mt-2 text-xs">
            <span class="inline-flex items-center gap-1 font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md"><i data-lucide="trending-up" class="w-3 h-3"></i> 100% Active</span>
            <span class="text-slate-500">in dataset</span>
          </div>
        </div>

        <!-- CARD 2 -->
        <div class="relative p-5 rounded-2xl bg-[#0b0f19]/90 border border-slate-800/80 hover:border-cyan-500/40 hover:-translate-y-1 transition-all duration-300 shadow-xl group">
          <div class="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-cyan-500 to-blue-500"></div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Average Rank</span>
            <div class="p-2 rounded-xl bg-cyan-500/10 text-cyan-400"><i data-lucide="award" class="w-4 h-4"></i></div>
          </div>
          <p class="text-2xl font-bold text-white mt-3">1.48</p>
          <div class="flex items-center gap-1.5 mt-2 text-xs">
            <span class="inline-flex items-center gap-1 font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md"><i data-lucide="check-circle" class="w-3 h-3"></i> Top 3 Position</span>
            <span class="text-slate-500">market leader</span>
          </div>
        </div>

        <!-- CARD 3 -->
        <div class="relative p-5 rounded-2xl bg-[#0b0f19]/90 border border-slate-800/80 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 shadow-xl group">
          <div class="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-emerald-500 to-teal-500"></div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Estimated Downloads</span>
            <div class="p-2 rounded-xl bg-emerald-500/10 text-emerald-400"><i data-lucide="download-cloud" class="w-4 h-4"></i></div>
          </div>
          <p class="text-2xl font-bold text-white mt-3">9,482</p>
          <div class="flex items-center gap-1.5 mt-2 text-xs">
            <span class="inline-flex items-center gap-1 font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md"><i data-lucide="trending-up" class="w-3 h-3"></i> High Volume</span>
            <span class="text-slate-500">monthly potential</span>
          </div>
        </div>

        <!-- CARD 4 -->
        <div class="relative p-5 rounded-2xl bg-[#0b0f19]/90 border border-slate-800/80 hover:border-amber-500/40 hover:-translate-y-1 transition-all duration-300 shadow-xl group">
          <div class="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-amber-500 to-orange-500"></div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Top Rank Dominance</span>
            <div class="p-2 rounded-xl bg-amber-500/10 text-amber-400"><i data-lucide="target" class="w-4 h-4"></i></div>
          </div>
          <p class="text-2xl font-bold text-white mt-3">18 / 25 (#1)</p>
          <div class="flex items-center gap-1.5 mt-2 text-xs">
            <span class="inline-flex items-center gap-1 font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">72% Share</span>
            <span class="text-slate-500">Rank #1 keywords</span>
          </div>
        </div>

      </div>

      <!-- ================= 2. CHARTS SECTION (2 COLUMNS) ================= -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6" id="charts">
        
        <!-- CHART 1: TREND AREA LINE CHART (2 COLUMNS WIDE) -->
        <div class="lg:col-span-2 p-6 rounded-2xl bg-[#0b0f19]/90 border border-slate-800/80 shadow-xl space-y-4">
          <div class="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 class="text-base font-bold text-white">Search Volume & Rank Distribution</h2>
              <p class="text-xs text-slate-400">Keyword performance trend across uploaded data</p>
            </div>
            <div class="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
              <button class="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-medium">Volume</button>
              <button class="px-2.5 py-1 rounded-lg text-slate-400 hover:text-white transition">Prospect Score</button>
            </div>
          </div>

          <!-- FIXED HEIGHT WRAPPER FOR CHART.JS -->
          <div class="h-80 w-full relative">
            <canvas id="revenueTrendChart"></canvas>
          </div>
        </div>

        <!-- CHART 2: CATEGORY DONUT CHART (1 COLUMN WIDE) -->
        <div class="p-6 rounded-2xl bg-[#0b0f19]/90 border border-slate-800/80 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <h2 class="text-base font-bold text-white">Keyword Classification</h2>
            <p class="text-xs text-slate-400">Generic vs Brand breakdown</p>
          </div>

          <!-- FIXED HEIGHT WRAPPER FOR DOUGHNUT CHART -->
          <div class="h-64 w-full relative flex items-center justify-center">
            <canvas id="categoryDonutChart"></canvas>
          </div>

          <div class="pt-4 border-t border-slate-800/60 grid grid-cols-2 gap-2 text-xs">
            <div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-indigo-500"></span><span class="text-slate-400">Generic: 88%</span></div>
            <div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span><span class="text-slate-400">Brand: 12%</span></div>
          </div>
        </div>

      </div>

      <!-- ================= 3. INTERACTIVE DATASET EXPLORER ================= -->
      <div class="p-6 rounded-2xl bg-[#0b0f19]/90 border border-slate-800/80 shadow-xl space-y-5" id="tableSection">
        
        <!-- TABLE HEADER WITH TITLE, SEARCH & SORT -->
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              <span>Dataset Explorer</span>
              <span class="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">25 Records</span>
            </h2>
            <p class="text-xs text-slate-400">Interactive data table with instant search, badges, and sorting</p>
          </div>

          <div class="flex items-center flex-wrap gap-3">
            <!-- SEARCH BAR -->
            <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <i data-lucide="search" class="w-3.5 h-3.5 text-slate-500"></i>
              <input type="text" onkeyup="filterTable(this.value)" placeholder="Search keywords, rank, type..." class="bg-transparent text-slate-200 outline-none placeholder-slate-500 text-xs w-40 sm:w-56">
            </div>

            <!-- SORT SELECT -->
            <select onchange="sortTable(this.value)" class="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-1.5 outline-none focus:border-indigo-500 cursor-pointer">
              <option value="rank">Sort by: Rank (Best to Worst)</option>
              <option value="volume">Sort by: Search Volume (High to Low)</option>
              <option value="downloads">Sort by: Est Downloads (High to Low)</option>
              <option value="prospect">Sort by: Prospect Score</option>
              <option value="alpha">Sort by: Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        <!-- QUICK FILTER CHIPS (ONE-CLICK FILTERING) -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button onclick="filterChip('all', this)" class="chip-btn px-3 py-1.5 rounded-xl font-medium bg-indigo-600 text-white shadow-sm transition">All Items (25)</button>
          <button onclick="filterChip('rank1', this)" class="chip-btn px-3 py-1.5 rounded-xl font-medium bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center gap-1.5"><span>🏆</span> Rank #1 (18)</button>
          <button onclick="filterChip('top3', this)" class="chip-btn px-3 py-1.5 rounded-xl font-medium bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center gap-1.5"><span>⚡</span> Top 3 Ranks</button>
          <button onclick="filterChip('highvol', this)" class="chip-btn px-3 py-1.5 rounded-xl font-medium bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center gap-1.5"><span>🔥</span> High Volume (>50k)</button>
          <button onclick="filterChip('generic', this)" class="chip-btn px-3 py-1.5 rounded-xl font-medium bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center gap-1.5"><span>📊</span> Generic (22)</button>
          <button onclick="filterChip('brand', this)" class="chip-btn px-3 py-1.5 rounded-xl font-medium bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center gap-1.5"><span>⭐</span> Brand (3)</button>
        </div>

        <!-- TABLE WRAPPER -->
        <div class="overflow-x-auto rounded-xl border border-slate-800/60 max-h-[500px]">
          <table class="w-full text-left text-sm text-slate-300">
            <thead class="bg-slate-900/95 sticky top-0 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-800/80">
              <!-- DYNAMIC TH TAGS: Map every column from {UPLOADED_DATA} here! Include sort triggers on click -->
            </thead>
            <tbody id="tableBody" class="divide-y divide-slate-800/60">
              <!-- DYNAMIC TR ROWS: Map EVERY row from exactDataRows in {UPLOADED_DATA} here! -->
              <!-- Use copyText('keyword') buttons and sleek progress bars for numeric scores -->
            </tbody>
          </table>
        </div>

        <!-- TABLE PAGINATION & FOOTER -->
        <div class="flex items-center justify-between flex-wrap gap-4 pt-2 text-xs text-slate-400">
          <div id="tableInfo">
            Showing <span class="text-white font-medium">1</span> to <span class="text-white font-medium" id="visibleCount">10</span> of <span class="text-white font-medium" id="totalCount">25</span> entries
          </div>

          <div class="flex items-center gap-2">
            <button onclick="prevPage()" class="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition">Previous</button>
            <span class="px-3 py-1.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-semibold" id="pageIndicator">Page 1</span>
            <button onclick="nextPage()" class="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition">Next</button>
          </div>
        </div>

      </div>

    </div>
  </main>

  <!-- ================= ROBUST INTERACTIVE JAVASCRIPT ================= -->
  <script>
    var currentPage = 1;
    var pageSize = 10;

    function initDashboardCharts() {
      var ctx1 = document.getElementById('revenueTrendChart');
      var ctx2 = document.getElementById('categoryDonutChart');

      if (!ctx1 || !ctx2) return;

      if (typeof Chart === 'undefined') {
        setTimeout(initDashboardCharts, 100);
        return;
      }

      try {
        var c1 = ctx1.getContext('2d');
        var grad = c1.createLinearGradient(0, 0, 0, 300);
        grad.addColorStop(0, 'rgba(99, 102, 241, 0.45)');
        grad.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

        new Chart(ctx1, {
          type: 'line',
          data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8'],
            datasets: [{
              label: 'Search Volume',
              data: [120000, 145000, 130000, 180000, 210000, 195000, 240000, 280000],
              borderColor: '#6366f1',
              borderWidth: 3,
              backgroundColor: grad,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: '#6366f1',
              pointBorderColor: '#ffffff',
              pointRadius: 4,
              pointHoverRadius: 7
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#64748b' } },
              y: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#64748b' } }
            }
          }
        });

        new Chart(ctx2, {
          type: 'doughnut',
          data: {
            labels: ['Generic Keywords', 'Brand Keywords'],
            datasets: [{
              data: [22, 3],
              backgroundColor: ['#6366f1', '#10b981'],
              borderWidth: 0,
              hoverOffset: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '74%',
            plugins: {
              legend: {
                position: 'bottom',
                labels: { color: '#94a3b8', boxWidth: 12, padding: 16 }
              }
            }
          }
        });
      } catch (err) {
        console.error('Chart error:', err);
      }
    }

    function filterTable(q) {
      var query = (q || '').toLowerCase().trim();
      var rows = document.querySelectorAll('#tableBody tr');
      rows.forEach(function(row) {
        var text = row.textContent.toLowerCase();
        row.style.display = (!query || text.includes(query)) ? '' : 'none';
      });
      updatePagination();
    }

    function filterChip(chipType, btn) {
      document.querySelectorAll('.chip-btn').forEach(function(b) {
        b.className = 'chip-btn px-3 py-1.5 rounded-xl font-medium bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition';
      });
      if (btn) {
        btn.className = 'chip-btn px-3 py-1.5 rounded-xl font-medium bg-indigo-600 text-white shadow-sm transition';
      }

      var rows = document.querySelectorAll('#tableBody tr');
      rows.forEach(function(row) {
        var text = row.textContent.toLowerCase();
        if (chipType === 'all') {
          row.style.display = '';
        } else if (chipType === 'rank1') {
          row.style.display = (text.includes('#1') || text.includes(' 1 ') || text.includes('rank 1')) ? '' : 'none';
        } else if (chipType === 'top3') {
          row.style.display = (text.includes('#1') || text.includes('#2') || text.includes('#3') || text.includes(' 1 ') || text.includes(' 2 ') || text.includes(' 3 ')) ? '' : 'none';
        } else if (chipType === 'generic') {
          row.style.display = text.includes('generic') ? '' : 'none';
        } else if (chipType === 'brand') {
          row.style.display = text.includes('brand') ? '' : 'none';
        } else {
          row.style.display = '';
        }
      });
      updatePagination();
    }

    function copyText(val) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(val);
      }
      if (window.showToast) {
        window.showToast('Copied "' + val + '" to clipboard! 📋');
      }
    }

    function toggleTheme() {
      var html = document.documentElement;
      html.classList.toggle('dark');
      if (window.showToast) {
        window.showToast(html.classList.contains('dark') ? 'Switched to Dark Mode 🌙' : 'Switched to Light Mode ☀️');
      }
    }

    function updatePagination() {
      var rows = Array.from(document.querySelectorAll('#tableBody tr')).filter(function(r) { return r.style.display !== 'none'; });
      var countEl = document.getElementById('visibleCount');
      var totalEl = document.getElementById('totalCount');
      if (countEl) countEl.textContent = Math.min(rows.length, pageSize);
      if (totalEl) totalEl.textContent = rows.length;
    }

    function prevPage() {
      if (currentPage > 1) {
        currentPage--;
        document.getElementById('pageIndicator').textContent = 'Page ' + currentPage;
      }
    }

    function nextPage() {
      currentPage++;
      document.getElementById('pageIndicator').textContent = 'Page ' + currentPage;
    }

    function startApp() {
      initDashboardCharts();
      if (window.lucide) {
        lucide.createIcons();
      }
      updatePagination();
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startApp);
    } else {
      startApp();
    }
  </script>
</body>
\`\`\`

==================================================
STRICT DATA BINDING REQUIREMENTS:
==================================================
1. DATA TABLE HEADERS (<th>): Dynamically generate <th> elements matching EVERY column in {UPLOADED_DATA} (e.g. Keyword, Rank, Search Volume, Competition, Prospect, Est Downloads, App Count, Type).
2. DATA TABLE ROWS (<tr>): Dynamically generate <tr> table rows containing the EXACT rows from exactDataRows in {UPLOADED_DATA}. Do NOT truncate or replace with fake demo items.
3. VISUAL ENRICHMENT:
   - Wrap Rank values in colored pill badges (e.g. <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">#1</span>).
   - Add a subtle copy button next to the primary keyword/name (<button onclick="copyText('...')" class="text-slate-500 hover:text-indigo-400 p-1"><i data-lucide="copy" class="w-3.5 h-3.5"></i></button>).
4. KPI METRIC CARDS: Display REAL calculated values from calculatedMetrics in {UPLOADED_DATA} (e.g. Total Keywords, Average Rank, Total Estimated Downloads, Top Category).
5. CHARTS: Render real Chart.js charts plotting actual metric distributions and category breakdowns from the uploaded dataset.

Return ONLY the single raw JSON object without markdown code fences:
{
  "code": "<!DOCTYPE html>...",
  "message": "Overview of the dashboard generated with your uploaded dataset",
  "imageQueries": []
}
`;

export default dashboardPrompt;