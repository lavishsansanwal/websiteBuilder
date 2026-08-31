import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Website from '../models/website.model.js';

dotenv.config();

const preRenderedRows = `
            <tbody id="tableBody" class="divide-y divide-slate-800/60 font-medium">
              <tr onclick="openRecordDrawer(0)" class="hover:bg-slate-800/50 cursor-pointer transition group border-b border-slate-800/40">
                <td class="p-4">
                  <div class="flex items-center gap-2.5">
                    <div class="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">W</div>
                    <div><span class="font-bold text-white group-hover:text-indigo-400 transition">Wireless Headphones</span></div>
                  </div>
                </td>
                <td class="p-4"><span class="px-2.5 py-1 rounded-full text-[11px] font-bold border bg-indigo-500/10 text-indigo-400 border-indigo-500/20">Electronics</span></td>
                <td class="p-4 font-mono font-bold text-white">$2,499</td>
                <td class="p-4"><div class="flex items-center gap-1 text-amber-400 font-bold"><i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400"></i><span>4.7</span></div></td>
                <td class="p-4 text-slate-400 max-w-xs truncate">Premium wireless headphones with noise cancellation and long battery life</td>
                <td class="p-4 text-right"><button onclick="event.stopPropagation(); copyRecordName('Wireless Headphones')" title="Copy Name" class="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"><i data-lucide="copy" class="w-3.5 h-3.5"></i></button></td>
              </tr>
              <tr onclick="openRecordDrawer(1)" class="hover:bg-slate-800/50 cursor-pointer transition group border-b border-slate-800/40">
                <td class="p-4">
                  <div class="flex items-center gap-2.5">
                    <div class="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">S</div>
                    <div><span class="font-bold text-white group-hover:text-indigo-400 transition">Smart Watch</span></div>
                  </div>
                </td>
                <td class="p-4"><span class="px-2.5 py-1 rounded-full text-[11px] font-bold border bg-indigo-500/10 text-indigo-400 border-indigo-500/20">Electronics</span></td>
                <td class="p-4 font-mono font-bold text-white">$3,999</td>
                <td class="p-4"><div class="flex items-center gap-1 text-amber-400 font-bold"><i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400"></i><span>4.5</span></div></td>
                <td class="p-4 text-slate-400 max-w-xs truncate">Modern smartwatch with fitness tracking and heart-rate monitoring</td>
                <td class="p-4 text-right"><button onclick="event.stopPropagation(); copyRecordName('Smart Watch')" title="Copy Name" class="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"><i data-lucide="copy" class="w-3.5 h-3.5"></i></button></td>
              </tr>
              <tr onclick="openRecordDrawer(2)" class="hover:bg-slate-800/50 cursor-pointer transition group border-b border-slate-800/40">
                <td class="p-4">
                  <div class="flex items-center gap-2.5">
                    <div class="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">R</div>
                    <div><span class="font-bold text-white group-hover:text-emerald-400 transition">Running Shoes</span></div>
                  </div>
                </td>
                <td class="p-4"><span class="px-2.5 py-1 rounded-full text-[11px] font-bold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Footwear</span></td>
                <td class="p-4 font-mono font-bold text-white">$2,999</td>
                <td class="p-4"><div class="flex items-center gap-1 text-amber-400 font-bold"><i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400"></i><span>4.6</span></div></td>
                <td class="p-4 text-slate-400 max-w-xs truncate">Lightweight running shoes designed for comfort and daily workouts</td>
                <td class="p-4 text-right"><button onclick="event.stopPropagation(); copyRecordName('Running Shoes')" title="Copy Name" class="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"><i data-lucide="copy" class="w-3.5 h-3.5"></i></button></td>
              </tr>
              <tr onclick="openRecordDrawer(3)" class="hover:bg-slate-800/50 cursor-pointer transition group border-b border-slate-800/40">
                <td class="p-4">
                  <div class="flex items-center gap-2.5">
                    <div class="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">T</div>
                    <div><span class="font-bold text-white group-hover:text-cyan-400 transition">Travel Backpack</span></div>
                  </div>
                </td>
                <td class="p-4"><span class="px-2.5 py-1 rounded-full text-[11px] font-bold border bg-cyan-500/10 text-cyan-400 border-cyan-500/20">Accessories</span></td>
                <td class="p-4 font-mono font-bold text-white">$1,799</td>
                <td class="p-4"><div class="flex items-center gap-1 text-amber-400 font-bold"><i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400"></i><span>4.4</span></div></td>
                <td class="p-4 text-slate-400 max-w-xs truncate">Water-resistant backpack with multiple compartments for travel and work</td>
                <td class="p-4 text-right"><button onclick="event.stopPropagation(); copyRecordName('Travel Backpack')" title="Copy Name" class="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"><i data-lucide="copy" class="w-3.5 h-3.5"></i></button></td>
              </tr>
              <tr onclick="openRecordDrawer(4)" class="hover:bg-slate-800/50 cursor-pointer transition group border-b border-slate-800/40">
                <td class="p-4">
                  <div class="flex items-center gap-2.5">
                    <div class="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">C</div>
                    <div><span class="font-bold text-white group-hover:text-amber-400 transition">Cotton T-Shirt</span></div>
                  </div>
                </td>
                <td class="p-4"><span class="px-2.5 py-1 rounded-full text-[11px] font-bold border bg-amber-500/10 text-amber-400 border-amber-500/20">Clothing</span></td>
                <td class="p-4 font-mono font-bold text-white">$799</td>
                <td class="p-4"><div class="flex items-center gap-1 text-amber-400 font-bold"><i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400"></i><span>4.3</span></div></td>
                <td class="p-4 text-slate-400 max-w-xs truncate">Comfortable premium cotton t-shirt suitable for everyday wear</td>
                <td class="p-4 text-right"><button onclick="event.stopPropagation(); copyRecordName('Cotton T-Shirt')" title="Copy Name" class="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"><i data-lucide="copy" class="w-3.5 h-3.5"></i></button></td>
              </tr>
            </tbody>
`;

const interactiveScript = `
<script>
  // RAW DATASET INGESTION
  const rawDataset = [
    {
      "name": "Wireless Headphones",
      "price": "2499",
      "category": "Electronics",
      "description": "Premium wireless headphones with noise cancellation and long battery life",
      "rating": "4.7"
    },
    {
      "name": "Smart Watch",
      "price": "3999",
      "category": "Electronics",
      "description": "Modern smartwatch with fitness tracking and heart-rate monitoring",
      "rating": "4.5"
    },
    {
      "name": "Running Shoes",
      "price": "2999",
      "category": "Footwear",
      "description": "Lightweight running shoes designed for comfort and daily workouts",
      "rating": "4.6"
    },
    {
      "name": "Travel Backpack",
      "price": "1799",
      "category": "Accessories",
      "description": "Water-resistant backpack with multiple compartments for travel and work",
      "rating": "4.4"
    },
    {
      "name": "Cotton T-Shirt",
      "price": "799",
      "category": "Clothing",
      "description": "Comfortable premium cotton t-shirt suitable for everyday wear",
      "rating": "4.3"
    }
  ];

  let currentData = [...rawDataset];
  let selectedCategory = 'All';
  let currentPage = 1;
  const pageSize = 10;
  let selectedDrawerRecord = null;

  function initLucide() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try { window.lucide.createIcons(); } catch(e) {}
    }
  }

  // RENDER TABLE FUNCTION
  function renderTable() {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const startIdx = (currentPage - 1) * pageSize;
    const pageItems = currentData.slice(startIdx, startIdx + pageSize);

    const shownStartEl = document.getElementById('shownStart');
    if (shownStartEl) shownStartEl.textContent = currentData.length === 0 ? 0 : startIdx + 1;
    const shownEndEl = document.getElementById('shownEnd');
    if (shownEndEl) shownEndEl.textContent = Math.min(startIdx + pageSize, currentData.length);
    const totalRowsCountEl = document.getElementById('totalRowsCount');
    if (totalRowsCountEl) totalRowsCountEl.textContent = currentData.length;
    const tableRowsBadgeEl = document.getElementById('tableRowsBadge');
    if (tableRowsBadgeEl) tableRowsBadgeEl.textContent = currentData.length + ' Records';
    const pageIndicatorEl = document.getElementById('pageIndicator');
    if (pageIndicatorEl) pageIndicatorEl.textContent = 'Page ' + currentPage;

    if (pageItems.length === 0) {
      tbody.innerHTML = \`
        <tr>
          <td colspan="6" class="p-8 text-center text-slate-400 font-medium">
            <div class="flex flex-col items-center gap-2">
              <i data-lucide="search-x" class="w-8 h-8 text-slate-500"></i>
              <p>No matching records found</p>
            </div>
          </td>
        </tr>
      \`;
      initLucide();
      return;
    }

    pageItems.forEach((row, idx) => {
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-slate-800/50 cursor-pointer transition group border-b border-slate-800/40';
      const globalIndex = startIdx + idx;
      tr.onclick = () => openRecordDrawer(globalIndex);

      const catBadgeColors = {
        'Electronics': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        'Footwear': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        'Accessories': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
        'Clothing': 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      };
      const badgeClass = catBadgeColors[row.category] || 'bg-slate-700/30 text-slate-300 border-slate-700';

      tr.innerHTML = \`
        <td class="p-4">
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
              \${row.name.charAt(0)}
            </div>
            <div>
              <span class="font-bold text-white group-hover:text-indigo-400 transition">\${row.name}</span>
            </div>
          </div>
        </td>
        <td class="p-4">
          <span class="px-2.5 py-1 rounded-full text-[11px] font-bold border \${badgeClass}">\${row.category}</span>
        </td>
        <td class="p-4 font-mono font-bold text-white">$\${Number(row.price).toLocaleString()}</td>
        <td class="p-4">
          <div class="flex items-center gap-1 text-amber-400 font-bold">
            <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400"></i>
            <span>\${row.rating}</span>
          </div>
        </td>
        <td class="p-4 text-slate-400 max-w-xs truncate">\${row.description}</td>
        <td class="p-4 text-right">
          <button onclick="event.stopPropagation(); copyRecordName('\${row.name}')" title="Copy Name" class="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer">
            <i data-lucide="copy" class="w-3.5 h-3.5"></i>
          </button>
        </td>
      \`;
      tbody.appendChild(tr);
    });

    initLucide();
  }

  // SEARCH & FILTER
  function filterTable(q) {
    const query = (q || '').toLowerCase().trim();
    currentData = rawDataset.filter(row => {
      const matchCat = (selectedCategory === 'All' || selectedCategory === 'all') ? true : (row.category.toLowerCase() === selectedCategory.toLowerCase());
      const matchQuery = !query || Object.values(row).some(val => String(val).toLowerCase().includes(query));
      return matchCat && matchQuery;
    });
    currentPage = 1;
    renderTable();
  }

  // CATEGORY PILL FILTER
  function filterCategory(cat) {
    selectedCategory = cat;
    
    // Highlight category pills
    document.querySelectorAll('.cat-pill, .chip-btn, [onclick*="filterCategory"]').forEach(btn => {
      const txt = (btn.getAttribute('data-cat') || btn.textContent || '').trim().toLowerCase();
      const match = (cat.toLowerCase() === 'all' && txt.includes('all')) || (txt.includes(cat.toLowerCase()));
      if (match) {
        btn.classList.add('bg-indigo-600', 'text-white', 'font-bold');
        btn.classList.remove('bg-slate-900', 'text-slate-400', 'text-slate-300', 'border-slate-800');
      } else {
        btn.classList.remove('bg-indigo-600', 'text-white', 'font-bold');
        btn.classList.add('bg-slate-900', 'text-slate-300', 'border-slate-800');
      }
    });

    filterTable(document.getElementById('tableSearch')?.value || '');
    showToast('Filtered by ' + (cat === 'All' ? 'All Categories' : cat));
  }

  // SORT TABLE
  function sortTable(criteria) {
    const val = String(criteria || '').toLowerCase();
    currentData.sort((a, b) => {
      if (val.includes('z-a') || val.includes('z to a')) {
        return b.name.localeCompare(a.name);
      }
      if (val.includes('a-z') || val.includes('a to z') || val.includes('name')) {
        return a.name.localeCompare(b.name);
      }
      if (val.includes('price: low') || val.includes('price-asc') || val.includes('low')) {
        return Number(a.price) - Number(b.price);
      }
      if (val.includes('price: high') || val.includes('price-desc') || val.includes('high')) {
        return Number(b.price) - Number(a.price);
      }
      if (val.includes('rating')) {
        return Number(b.rating) - Number(a.rating);
      }
      return 0;
    });
    renderTable();
    showToast('Sorted table by ' + criteria);
  }

  // PAGINATION
  function prevPage() {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  }

  function nextPage() {
    if (currentPage * pageSize < currentData.length) {
      currentPage++;
      renderTable();
    }
  }

  function copyRecordName(name) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(name);
      showToast('Product name copied: ' + name);
    }
  }

  // RECORD DRAWER
  function openRecordDrawer(index) {
    const record = currentData[index];
    if (!record) return;
    selectedDrawerRecord = record;

    const drawer = document.getElementById('recordDrawer');
    const titleEl = document.getElementById('drawerRecordTitle');
    const fieldList = document.getElementById('drawerFieldList');

    if (titleEl) titleEl.textContent = record.name || 'Record Deep-Dive';
    if (fieldList) {
      fieldList.innerHTML = '';
      Object.entries(record).forEach(([k, v]) => {
        const div = document.createElement('div');
        div.className = 'p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between';
        div.innerHTML = '<span class="text-slate-400 font-medium capitalize">' + k + ':</span><span class="text-white font-bold font-mono">' + v + '</span>';
        fieldList.appendChild(div);
      });
    }

    if (drawer) drawer.classList.remove('translate-x-full');
    initLucide();
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

  // EXPORT TO CSV
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

  // TOAST SYSTEM
  function showToast(msg) {
    const container = document.getElementById('toastContainer') || document.body;
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-6 right-6 z-[99999] px-4 py-3 rounded-xl bg-slate-900 border border-indigo-500/40 text-xs font-semibold text-white shadow-2xl flex items-center gap-2 transform transition-all duration-300 translate-y-4 opacity-0 pointer-events-auto';
    toast.innerHTML = '<i data-lucide="sparkles" class="w-4 h-4 text-indigo-400"></i><span>' + msg + '</span>';
    container.appendChild(toast);
    initLucide();

    setTimeout(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
    }, 10);

    setTimeout(() => {
      toast.classList.add('translate-y-4', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // THEME TOGGLE
  function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      document.body.classList.add('light');
      showToast('Switched to Light Mode ☀️');
    } else {
      document.documentElement.classList.add('dark');
      document.body.classList.remove('light');
      showToast('Switched to Dark Obsidian Mode 🌙');
    }
  }

  // INITIALIZE CHARTS
  function initCharts() {
    if (typeof Chart === 'undefined') return;
    Chart.defaults.font.family = 'Plus Jakarta Sans, Inter, sans-serif';
    Chart.defaults.color = '#94a3b8';

    // 1. DISTRIBUTION BAR CHART
    const ctxBar = document.getElementById('distributionBarChart')?.getContext('2d');
    if (ctxBar) {
      new Chart(ctxBar, {
        type: 'bar',
        data: {
          labels: rawDataset.map(d => d.name),
          datasets: [{
            label: 'Price ($)',
            data: rawDataset.map(d => Number(d.price)),
            backgroundColor: [
              'rgba(99, 102, 241, 0.85)',
              'rgba(168, 85, 247, 0.85)',
              'rgba(16, 185, 129, 0.85)',
              'rgba(6, 182, 212, 0.85)',
              'rgba(245, 158, 11, 0.85)'
            ],
            borderRadius: 8,
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 11, weight: '600' } } },
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', callback: (v) => '$' + v } }
          }
        }
      });
    }

    // 2. COMPOSITION DONUT CHART
    const ctxDonut = document.getElementById('compositionDonutChart')?.getContext('2d');
    if (ctxDonut) {
      new Chart(ctxDonut, {
        type: 'doughnut',
        data: {
          labels: ['Electronics', 'Footwear', 'Accessories', 'Clothing'],
          datasets: [{
            data: [2, 1, 1, 1],
            backgroundColor: ['#6366f1', '#10b981', '#06b6d4', '#f59e0b'],
            borderWidth: 0,
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '72%',
          plugins: {
            legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 11, weight: '600' }, boxWidth: 10, padding: 15 } }
          }
        }
      });
    }

    // 3. OPPORTUNITY MATRIX SCATTER CHART
    const ctxScatter = document.getElementById('opportunityScatterChart')?.getContext('2d');
    if (ctxScatter) {
      new Chart(ctxScatter, {
        type: 'scatter',
        data: {
          datasets: [{
            label: 'Products',
            data: rawDataset.map(d => ({
              x: Number(d.rating),
              y: Number(d.price),
              name: d.name,
              category: d.category
            })),
            backgroundColor: [
              'rgba(99, 102, 241, 0.9)',
              'rgba(168, 85, 247, 0.9)',
              'rgba(16, 185, 129, 0.9)',
              'rgba(6, 182, 212, 0.9)',
              'rgba(245, 158, 11, 0.9)'
            ],
            pointRadius: 10,
            pointHoverRadius: 14
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { min: 4.0, max: 5.0, ticks: { color: '#94a3b8' } },
            y: { min: 0, max: 4500, ticks: { color: '#94a3b8', callback: (v) => '$' + v } }
          }
        }
      });
    }
  }

  // ATTACH GLOBAL SCOPE HANDLERS (CRITICAL)
  window.renderTable = renderTable;
  window.filterTable = filterTable;
  window.filterCategory = filterCategory;
  window.sortTable = sortTable;
  window.prevPage = prevPage;
  window.nextPage = nextPage;
  window.copyRecordName = copyRecordName;
  window.toggleTheme = toggleTheme;
  window.exportToCSV = exportToCSV;
  window.exportToJSON = exportToJSON;
  window.openRecordDrawer = openRecordDrawer;
  window.closeRecordDrawer = closeRecordDrawer;
  window.copyDrawerRecord = copyDrawerRecord;
  window.showToast = showToast;

  // MULTI-PHASE ROBUST INITIALIZATION
  function initAll() {
    renderTable();
    initCharts();
    initLucide();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
  window.addEventListener('load', initAll);
  setTimeout(initAll, 50);
  setTimeout(initAll, 250);
</script>
`;

async function run() {
  await mongoose.connect(process.env.MONGODB_URL || process.env.MONGODB_URI);
  const site = await Website.findById('6a952ddc7280df6707c142b5');
  if (!site) {
    console.log('Site not found');
    process.exit(1);
  }

  // 1. Replace empty tbody with pre-rendered rows
  let code = site.latestCode;
  const tbodyStart = code.indexOf('<tbody id="tableBody"');
  const tbodyEnd = code.indexOf('</tbody>', tbodyStart) + 8;
  if (tbodyStart !== -1 && tbodyEnd !== -1) {
    code = code.slice(0, tbodyStart) + preRenderedRows.trim() + code.slice(tbodyEnd);
  }

  // 2. Ensure header export buttons have exact onclick attributes
  code = code.replace(/<button[^>]*>\s*<i[^>]*data-lucide="file-spreadsheet"[\s\S]*?Export CSV\s*<\/button>/gi, 
    '<button onclick="exportToCSV()" class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5 cursor-pointer"><i data-lucide="file-spreadsheet" class="w-3.5 h-3.5"></i> Export CSV</button>');

  code = code.replace(/<button[^>]*>\s*<i[^>]*data-lucide="code"[\s\S]*?JSON\s*<\/button>/gi, 
    '<button onclick="exportToJSON()" class="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs hover:text-white transition flex items-center gap-1.5 cursor-pointer"><i data-lucide="code" class="w-3.5 h-3.5"></i> JSON</button>');

  code = code.replace(/<button[^>]*>\s*<i[^>]*data-lucide="printer"[\s\S]*?Print PDF\s*<\/button>/gi, 
    '<button onclick="window.print()" class="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs hover:text-white transition flex items-center gap-1.5 cursor-pointer"><i data-lucide="printer" class="w-3.5 h-3.5"></i> Print PDF</button>');

  // 3. Replace script tag with full interactive script
  const scriptStart = code.lastIndexOf('<script>');
  code = code.slice(0, scriptStart) + interactiveScript + '\n</body>\n</html>';

  site.latestCode = code;
  await site.save();
  console.log('Site 6a952ddc7280df6707c142b5 successfully updated with pre-rendered rows and full interactivity! 🚀');

  await mongoose.disconnect();
}

run().catch(console.error);
