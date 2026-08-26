import commonRules from "./commonRules.js";

const reactDashboardPrompt = `
${commonRules}

==================================================
PAGE TYPE: ENTERPRISE REACT (JSX + TAILWIND) DASHBOARD
==================================================

You are generating a state-of-the-art, interactive **React (JSX) Dashboard Component** using Tailwind CSS, Lucide icons, and Chart.js.
The layout must be modern, highly functional, interactive, and styled like Stripe, Linear, and Datadog.

USER PROMPT:
{USER_PROMPT}

UPLOADED DATASET SUMMARY & RECORDS:
{UPLOADED_DATA}

==================================================
REACT ARCHITECTURE & STATE REQUIREMENTS (MANDATORY)
==================================================
1. Write a single, complete, production-ready React component named \`App\`.
2. Use standard React hooks (\`useState\`, \`useMemo\`, \`useEffect\`, \`useRef\`).
3. Embed the uploaded dataset in an in-memory state variable \`dataset\`.
4. Implement reactive state:
   - \`const [searchQuery, setSearchQuery] = useState('')\` -> Filters keywords/records in real time via \`useMemo\`.
   - \`const [activeFilter, setActiveFilter] = useState('all')\` -> Interactive filter chips ("All", "Top Rank #1", "Top 3", "High Volume", "Generic", "Brand").
   - \`const [sortBy, setSortBy] = useState('rank')\` -> Multi-column sorting (Rank, Volume, Downloads, Alphabetical).
   - \`const [currentPage, setCurrentPage] = useState(1)\` -> Dynamic pagination (10 rows per page).
   - \`const [isDarkMode, setIsDarkMode] = useState(true)\` -> Dark / Light mode toggle.
   - \`const [toast, setToast] = useState(null)\` -> Temporary toast feedback for copying keywords or exporting data.
5. In \`useEffect\`, initialize Chart.js trend charts using \`chartRef\` and call \`lucide.createIcons()\`.
6. Provide an \`exportToCSV()\` function that downloads the currently filtered dataset as a .csv file.

==================================================
EXACT REACT COMPONENT STRUCTURE (EXAMPLE)
==================================================

\`\`\`jsx
import React, { useState, useMemo, useEffect, useRef } from 'react';

export default function App() {
  // 1. DATA STATE (Populate with real dataset records from {UPLOADED_DATA})
  const initialData = [
    // Real records from {UPLOADED_DATA}
  ];

  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState('');
  const [filterChip, setFilterChip] = useState('all');
  const [sortBy, setSortBy] = useState('rank');
  const [page, setPage] = useState(1);
  const [isDark, setIsDark] = useState(true);
  const [toast, setToast] = useState('');

  const pageSize = 10;
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Toast Helper
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Copy Helper
  const copyKeyword = (text) => {
    navigator.clipboard?.writeText(text);
    showToast(\`Copied "\${text}" to clipboard! 📋\`);
  };

  // 2. FILTERED & SORTED DATA (useMemo for lightning speed)
  const filteredData = useMemo(() => {
    return initialData.filter(item => {
      const matchSearch = Object.values(item).some(val => 
        String(val).toLowerCase().includes(search.toLowerCase())
      );
      if (!matchSearch) return false;

      if (filterChip === 'rank1') return Number(item.rank) === 1;
      if (filterChip === 'top3') return Number(item.rank) <= 3;
      if (filterChip === 'highvol') return Number(item.volume || item.searchVolume) > 50000;
      if (filterChip === 'generic') return String(item.type).toLowerCase().includes('generic');
      if (filterChip === 'brand') return String(item.type).toLowerCase().includes('brand');
      return true;
    }).sort((a, b) => {
      if (sortBy === 'rank') return Number(a.rank) - Number(b.rank);
      if (sortBy === 'volume') return (Number(b.volume) || 0) - (Number(a.volume) || 0);
      if (sortBy === 'downloads') return (Number(b.downloads) || 0) - (Number(a.downloads) || 0);
      return String(a.keyword || '').localeCompare(String(b.keyword || ''));
    });
  }, [search, filterChip, sortBy]);

  // Paginated Slice
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page]);

  // 3. CHART.JS INITIALIZATION
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }

    if (chartRef.current && window.Chart) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      const grad = ctx.createLinearGradient(0, 0, 0, 300);
      grad.addColorStop(0, 'rgba(99, 102, 241, 0.45)');
      grad.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

      chartInstance.current = new window.Chart(chartRef.current, {
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
            pointBackgroundColor: '#6366f1'
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
    }

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [filteredData]);

  // 4. EXPORT TO CSV
  const exportCSV = () => {
    if (!filteredData.length) return;
    const headers = Object.keys(filteredData[0]).join(',');
    const rows = filteredData.map(obj => Object.values(obj).map(v => \`"\${String(v).replace(/"/g, '""')}"\`).join(','));
    const blob = new Blob([[headers, ...rows].join('\\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = \`dataset_export_\${Date.now()}.csv\`;
    link.click();
    showToast('Exported dataset to CSV! 📥');
  };

  return (
    <div className={\`flex h-screen overflow-hidden font-sans \${isDark ? 'bg-[#070b12] text-slate-100 dark' : 'bg-slate-50 text-slate-900'}\`}>
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-amber-500 text-black text-xs font-extrabold shadow-2xl transition-all duration-300 flex items-center gap-2">
          <span>{toast}</span>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="w-64 min-w-[16rem] h-full bg-[#0b0f19] border-r border-slate-800/80 p-5 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <i data-lucide="sparkles" className="w-5 h-5 text-white"></i>
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight leading-tight">NexusAnalytics</h1>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Enterprise React OS</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 focus-within:border-indigo-500 transition">
            <i data-lucide="search" className="w-3.5 h-3.5 text-slate-500"></i>
            <input 
              type="text" 
              value={search} 
              onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
              placeholder="Search data... (⌘K)" 
              className="bg-transparent text-slate-200 outline-none w-full placeholder-slate-500 text-xs" 
            />
          </div>

          <nav className="space-y-1.5">
            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 shadow-sm transition">
              <i data-lucide="layout-dashboard" className="w-4 h-4"></i> Overview & KPIs
            </button>
            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition">
              <i data-lucide="bar-chart-3" className="w-4 h-4"></i> Analytics & Trends
            </button>
            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition">
              <i data-lucide="database" className="w-4 h-4"></i> Dataset Explorer
            </button>
          </nav>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>React State Synced</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" alt="Avatar" className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30" />
              <div>
                <p className="text-xs font-semibold text-white truncate w-24">Alex Morgan</p>
                <p className="text-[10px] text-slate-400">Lead Analyst</p>
              </div>
            </div>
            <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
              <i data-lucide={isDark ? "sun" : "moon"} className="w-4 h-4"></i>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 min-w-0 flex flex-col h-full overflow-y-auto bg-[#070b12]">
        <header className="h-16 border-b border-slate-800/80 px-8 flex items-center justify-between sticky top-0 bg-[#070b12]/80 backdrop-blur-xl z-20">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Intelligence</span>
            <span>/</span>
            <span className="text-white font-medium">Dataset Analysis & Operations</span>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => window.print()} className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition">
              <i data-lucide="printer" className="w-4 h-4"></i>
            </button>
            <button onClick={exportCSV} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 hover:opacity-95 transition">
              <i data-lucide="download" className="w-3.5 h-3.5"></i>
              <span>Export Dataset</span>
            </button>
          </div>
        </header>

        <div className="p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Populate with calculated values from {UPLOADED_DATA} */}
          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0b0f19]/90 border border-slate-800/80 shadow-xl space-y-4">
              <h2 className="text-base font-bold text-white">Performance Dynamics</h2>
              <div className="h-80 w-full relative">
                <canvas ref={chartRef}></canvas>
              </div>
            </div>
          </div>

          {/* INTERACTIVE DATA TABLE */}
          <div className="p-6 rounded-2xl bg-[#0b0f19]/90 border border-slate-800/80 shadow-xl space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Dataset Explorer</span>
                <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  {filteredData.length} Records
                </span>
              </h2>

              <div className="flex items-center flex-wrap gap-3">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-1.5 outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="rank">Sort by: Rank</option>
                  <option value="volume">Sort by: Search Volume</option>
                  <option value="downloads">Sort by: Est Downloads</option>
                  <option value="alpha">Sort by: Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>

            {/* FILTER CHIPS */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <button 
                onClick={() => { setFilterChip('all'); setPage(1); }}
                className={\`px-3 py-1.5 rounded-xl font-medium transition \${filterChip === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}\`}
              >
                All Items ({initialData.length})
              </button>
              <button 
                onClick={() => { setFilterChip('rank1'); setPage(1); }}
                className={\`px-3 py-1.5 rounded-xl font-medium transition \${filterChip === 'rank1' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}\`}
              >
                🏆 Rank #1
              </button>
              <button 
                onClick={() => { setFilterChip('top3'); setPage(1); }}
                className={\`px-3 py-1.5 rounded-xl font-medium transition \${filterChip === 'top3' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}\`}
              >
                ⚡ Top 3 Ranks
              </button>
            </div>

            {/* DATA TABLE */}
            <div className="overflow-x-auto rounded-xl border border-slate-800/60 max-h-[500px]">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900/95 sticky top-0 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-800/80">
                  {/* Generate <th> headers dynamically based on columns */}
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {paginatedData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition">
                      {/* Render row cells with badges and copyKeyword(row.keyword) buttons */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-between flex-wrap gap-4 pt-2 text-xs text-slate-400">
              <div>
                Showing <span className="text-white font-medium">{(page - 1) * pageSize + 1}</span> to <span className="text-white font-medium">{Math.min(page * pageSize, filteredData.length)}</span> of <span className="text-white font-medium">{filteredData.length}</span> entries
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 text-slate-300 transition"
                >
                  Previous
                </button>
                <span className="px-3 py-1.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-semibold">
                  Page {page} of {Math.max(1, Math.ceil(filteredData.length / pageSize))}
                </span>
                <button 
                  onClick={() => setPage(Math.min(Math.ceil(filteredData.length / pageSize), page + 1))}
                  disabled={page >= Math.ceil(filteredData.length / pageSize)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 text-slate-300 transition"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
\`\`\`

==================================================
STRICT DATA BINDING & OUTPUT RULES:
==================================================
1. Populate \`initialData\` with all exact rows from \`exactDataRows\` in {UPLOADED_DATA}.
2. Ensure every column in \`{UPLOADED_DATA}\` is mapped to table headers and row cells.
3. Render KPI metric values from \`calculatedMetrics\` in \`{UPLOADED_DATA}\`.
4. Output valid, complete, modern React (JSX) code. Do NOT output incomplete components or pseudo-code.

Return ONLY the single raw JSON object without markdown code fences:
{
  "code": "import React, { useState, useMemo, useEffect, useRef } from 'react';\\n\\nexport default function App() { ... }",
  "message": "Overview of the React dashboard generated with your uploaded dataset",
  "imageQueries": []
}
`;

export default reactDashboardPrompt;
