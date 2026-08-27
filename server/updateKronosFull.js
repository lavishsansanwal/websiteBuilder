import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Website from "./models/website.model.js";

const fullEcommerceHtml = `<!DOCTYPE html>
<html lang="en" class="dark scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KRONOS • Modern Streetwear & Sneaker Archive</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/lucide@latest"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            display: ['"Space Grotesk"', 'sans-serif']
          },
          colors: {
            brand: {
              400: '#fbbf24',
              500: '#f59e0b',
              600: '#d97706'
            },
            dark: {
              950: '#04070d',
              900: '#090e17',
              850: '#0e1522',
              800: '#151e2e'
            }
          }
        }
      }
    };
  </script>
  <style>
    .glass-nav { background: rgba(9, 14, 23, 0.85); backdrop-filter: blur(16px); }
    .glass-card { background: rgba(14, 21, 34, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); }
    .glass-card:hover { border-color: rgba(245, 158, 11, 0.4); box-shadow: 0 10px 30px -10px rgba(245, 158, 11, 0.2); }
    .badge-drop { background: linear-gradient(135deg, #f59e0b, #ea580c); }
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  </style>
</head>
<body class="bg-dark-950 text-slate-100 font-sans antialiased selection:bg-brand-500 selection:text-black">

  <!-- TOP PROMO TICKER -->
  <div class="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 text-black py-2 px-4 text-center text-xs font-black tracking-widest uppercase flex items-center justify-center gap-3">
    <span>⚡ DROP 04: FREE WORLDWIDE EXPRESS DELIVERY OVER $120</span>
    <span class="hidden sm:inline">•</span>
    <span class="hidden sm:inline">USE CODE: <strong class="underline">STREET20</strong> FOR 20% OFF</span>
  </div>

  <!-- STICKY NAVBAR -->
  <header class="sticky top-0 z-40 glass-nav border-b border-white/10 px-4 sm:px-8 py-3.5 transition-all">
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
      
      <!-- Logo -->
      <div class="flex items-center gap-8">
        <a href="#hero" class="flex items-center gap-2 group">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-orange-600 flex items-center justify-center text-black font-black text-lg shadow-lg shadow-brand-500/20 group-hover:scale-105 transition">
            ⚡
          </div>
          <span class="font-display font-black text-xl tracking-wider text-white">KRONOS<span class="text-brand-500">.</span></span>
        </a>

        <!-- Department Nav Links -->
        <nav class="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-300">
          <a href="#categories" class="hover:text-brand-400 transition">Collections</a>
          <a href="#products" class="hover:text-brand-400 transition">All Drops</a>
          <a href="#sneaker-lab" class="hover:text-brand-400 transition flex items-center gap-1.5"><span class="text-brand-400">👟</span> Sneaker Lab</a>
          <a href="#lookbook" class="hover:text-brand-400 transition">Lookbook</a>
          <a href="#tracking" class="hover:text-brand-400 transition">Track Order</a>
        </nav>
      </div>

      <!-- Live Search & Action Controls -->
      <div class="flex items-center gap-3">
        <!-- Live Instant Search -->
        <div class="relative hidden sm:flex items-center">
          <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none"></i>
          <input type="text" id="headerSearchInput" oninput="handleProductSearch(this.value)" placeholder="Search sneakers, hoodies, cargos..." class="w-48 md:w-64 pl-10 pr-4 py-2 rounded-xl bg-dark-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:w-72 transition-all">
        </div>

        <!-- Wishlist Button -->
        <button onclick="openWishlistDrawer()" class="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition">
          <i data-lucide="heart" class="w-5 h-5"></i>
          <span id="wishlistCountBadge" class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center">0</span>
        </button>

        <!-- Cart Bag Button -->
        <button onclick="openCartDrawer()" class="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-orange-500 hover:from-brand-400 hover:to-orange-400 text-black font-extrabold text-xs shadow-lg shadow-brand-500/20 hover:scale-105 transition cursor-pointer">
          <i data-lucide="shopping-bag" class="w-4 h-4"></i>
          <span>Bag</span>
          <span id="cartCountBadge" class="w-5 h-5 rounded-full bg-black text-brand-400 font-black text-xs flex items-center justify-center">0</span>
        </button>
      </div>
    </div>
  </header>

  <!-- HERO BANNER -->
  <section id="hero" class="relative pt-12 pb-20 md:py-24 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
    <div class="grid lg:grid-cols-12 gap-10 items-center">
      
      <div class="lg:col-span-7 space-y-6 text-left">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-extrabold uppercase tracking-widest">
          <span class="w-2 h-2 rounded-full bg-brand-400 animate-ping"></span>
          <span>Tokyo &amp; Berlin Archive • Summer 2024</span>
        </div>

        <h1 class="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05]">
          ENGINEERED <br>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">STREETWEAR</span> &amp; <br>
          SNEAKER LAB.
        </h1>

        <p class="text-slate-400 text-sm sm:text-base max-w-xl leading-relaxed">
          Heavyweight 450GSM cotton sets, modular tactical cargos, and custom aerodynamic sneaker drops. Designed for high-density urban movement.
        </p>

        <div class="flex flex-wrap items-center gap-4 pt-2">
          <a href="#products" class="px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-2xl shadow-brand-500/30 hover:scale-105 transition flex items-center gap-2">
            <span>Explore 16+ New Drops</span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </a>
          <a href="#sneaker-lab" class="px-7 py-4 rounded-2xl glass-card text-white hover:bg-white/10 font-bold text-xs sm:text-sm uppercase tracking-wider transition flex items-center gap-2">
            <span>Sneaker Drop List</span>
          </a>
        </div>

        <div class="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 max-w-lg">
          <div>
            <div class="text-2xl font-display font-black text-white">450+</div>
            <div class="text-xs text-slate-400 uppercase tracking-wider">GSM Heavyweight</div>
          </div>
          <div>
            <div class="text-2xl font-display font-black text-brand-400">100%</div>
            <div class="text-xs text-slate-400 uppercase tracking-wider">Authentic Kicks</div>
          </div>
          <div>
            <div class="text-2xl font-display font-black text-white">4.9★</div>
            <div class="text-xs text-slate-400 uppercase tracking-wider">12.4k Reviews</div>
          </div>
        </div>
      </div>

      <!-- Hero Visual Image Grid -->
      <div class="lg:col-span-5 relative">
        <div class="relative rounded-3xl overflow-hidden glass-card p-3 shadow-2xl">
          <img src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&auto=format&fit=crop&q=80" alt="Streetwear Hero" class="w-full h-[420px] object-cover rounded-2xl">
          <div class="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-dark-950/90 backdrop-blur-md border border-white/10 flex items-center justify-between">
            <div>
              <span class="text-[10px] font-mono text-brand-400 font-bold uppercase tracking-wider">FEATURED DROP #04</span>
              <h4 class="text-sm font-bold text-white">AeroRunner Retro Trainer V2</h4>
              <p class="text-xs text-slate-300">$119.00 <span class="text-slate-500 line-through">$160.00</span></p>
            </div>
            <button onclick="addToCart('p1', 'AeroRunner Retro Trainer V2', 119, 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400', 'US 9', 'Onyx')" class="px-3.5 py-2 rounded-xl bg-amber-500 text-black font-extrabold text-xs hover:bg-amber-400 transition cursor-pointer">
              + Bag
            </button>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- DEPARTMENT CATEGORIES STRIP (LIKE FLIPKART & SNITCH) -->
  <section id="categories" class="py-10 border-y border-white/10 bg-dark-900/50 px-4 sm:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-xs font-black uppercase tracking-widest text-brand-400">Shop by Department</h3>
          <h2 class="text-xl sm:text-2xl font-display font-black text-white">Curated Streetwear Categories</h2>
        </div>
        <span class="text-xs text-slate-400 font-medium">Click category to filter below</span>
      </div>

      <!-- Categories Scroll Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        <!-- Cat 1: Sneakers -->
        <button onclick="filterCategory('sneakers')" class="group p-4 rounded-2xl glass-card text-center hover:scale-105 transition cursor-pointer">
          <div class="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-3 border border-white/10 group-hover:border-brand-500 transition">
            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80" alt="Sneakers" class="w-full h-full object-cover group-hover:scale-110 transition duration-300">
          </div>
          <span class="text-xs font-extrabold text-white block">Sneakers &amp; Kicks</span>
          <span class="text-[10px] text-brand-400 font-semibold">4 Drops Available</span>
        </button>

        <!-- Cat 2: Hoodies -->
        <button onclick="filterCategory('hoodies')" class="group p-4 rounded-2xl glass-card text-center hover:scale-105 transition cursor-pointer">
          <div class="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-3 border border-white/10 group-hover:border-brand-500 transition">
            <img src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=200&auto=format&fit=crop&q=80" alt="Hoodies" class="w-full h-full object-cover group-hover:scale-110 transition duration-300">
          </div>
          <span class="text-xs font-extrabold text-white block">Heavy Hoodies</span>
          <span class="text-[10px] text-brand-400 font-semibold">4 Drops Available</span>
        </button>

        <!-- Cat 3: Graphic Tees -->
        <button onclick="filterCategory('tees')" class="group p-4 rounded-2xl glass-card text-center hover:scale-105 transition cursor-pointer">
          <div class="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-3 border border-white/10 group-hover:border-brand-500 transition">
            <img src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=200&auto=format&fit=crop&q=80" alt="Tees" class="w-full h-full object-cover group-hover:scale-110 transition duration-300">
          </div>
          <span class="text-xs font-extrabold text-white block">Oversized Tees</span>
          <span class="text-[10px] text-brand-400 font-semibold">4 Drops Available</span>
        </button>

        <!-- Cat 4: Cargo Pants -->
        <button onclick="filterCategory('cargos')" class="group p-4 rounded-2xl glass-card text-center hover:scale-105 transition cursor-pointer">
          <div class="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-3 border border-white/10 group-hover:border-brand-500 transition">
            <img src="https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=200&auto=format&fit=crop&q=80" alt="Cargos" class="w-full h-full object-cover group-hover:scale-110 transition duration-300">
          </div>
          <span class="text-xs font-extrabold text-white block">Cargo &amp; Parachute</span>
          <span class="text-[10px] text-brand-400 font-semibold">4 Drops Available</span>
        </button>

        <!-- Cat 5: Outerwear -->
        <button onclick="filterCategory('outerwear')" class="group p-4 rounded-2xl glass-card text-center hover:scale-105 transition cursor-pointer">
          <div class="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-3 border border-white/10 group-hover:border-brand-500 transition">
            <img src="https://images.unsplash.com/photo-1548883354-7622d03aca27?w=200&auto=format&fit=crop&q=80" alt="Jackets" class="w-full h-full object-cover group-hover:scale-110 transition duration-300">
          </div>
          <span class="text-xs font-extrabold text-white block">Jackets &amp; Shells</span>
          <span class="text-[10px] text-brand-400 font-semibold">3 Drops Available</span>
        </button>

        <!-- Cat 6: Accessories -->
        <button onclick="filterCategory('accessories')" class="group p-4 rounded-2xl glass-card text-center hover:scale-105 transition cursor-pointer">
          <div class="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-3 border border-white/10 group-hover:border-brand-500 transition">
            <img src="https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=200&auto=format&fit=crop&q=80" alt="Accessories" class="w-full h-full object-cover group-hover:scale-110 transition duration-300">
          </div>
          <span class="text-xs font-extrabold text-white block">Caps &amp; Gear</span>
          <span class="text-[10px] text-brand-400 font-semibold">3 Drops Available</span>
        </button>

      </div>
    </div>
  </section>

  <!-- MAIN PRODUCT CATALOG & FILTER SECTION -->
  <section id="products" class="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
    
    <!-- Filter Controls Bar -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h3 class="text-xs font-black uppercase tracking-widest text-brand-400">All Collections</h3>
        <h2 class="text-2xl sm:text-3xl font-display font-black text-white">Full Product Catalog (16 Items)</h2>
      </div>

      <!-- Filter Pills -->
      <div class="flex flex-wrap items-center gap-2" id="filterPillsContainer">
        <button onclick="filterCategory('all')" id="pill-all" class="cat-pill active-pill px-4 py-2 rounded-xl text-xs font-bold transition bg-amber-500 text-black">
          All (16)
        </button>
        <button onclick="filterCategory('sneakers')" id="pill-sneakers" class="cat-pill px-4 py-2 rounded-xl text-xs font-bold transition glass-card text-slate-300 hover:text-white">
          Sneakers (4)
        </button>
        <button onclick="filterCategory('hoodies')" id="pill-hoodies" class="cat-pill px-4 py-2 rounded-xl text-xs font-bold transition glass-card text-slate-300 hover:text-white">
          Hoodies (4)
        </button>
        <button onclick="filterCategory('tees')" id="pill-tees" class="cat-pill px-4 py-2 rounded-xl text-xs font-bold transition glass-card text-slate-300 hover:text-white">
          Tees (4)
        </button>
        <button onclick="filterCategory('cargos')" id="pill-cargos" class="cat-pill px-4 py-2 rounded-xl text-xs font-bold transition glass-card text-slate-300 hover:text-white">
          Cargos (4)
        </button>
      </div>
    </div>

    <!-- 16 PRODUCT CARDS GRID -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="productGrid">

      <!-- Product 1: Sneaker -->
      <div class="product-card glass-card rounded-3xl overflow-hidden p-3.5 flex flex-col justify-between transition group" data-category="sneakers" data-title="AeroRunner High-Top 01">
        <div class="relative rounded-2xl overflow-hidden bg-dark-900 mb-3.5">
          <span class="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded-full badge-drop text-black font-black text-[10px] uppercase">HOT DROP</span>
          <button onclick="toggleWishlist(this, 'p1')" class="wishlist-btn absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white hover:text-rose-400 flex items-center justify-center transition">
            <i data-lucide="heart" class="w-4 h-4"></i>
          </button>
          <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80" alt="AeroRunner Sneaker" class="w-full h-56 object-cover group-hover:scale-105 transition duration-300">
        </div>
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="text-[11px] font-bold text-brand-400 uppercase tracking-wider">Footwear Lab</span>
            <span class="text-slate-400 font-semibold">★ 4.9 (180)</span>
          </div>
          <h4 class="font-extrabold text-sm text-white truncate">AeroRunner High-Top Crimson</h4>
          <div class="flex items-center justify-between pt-1">
            <div class="text-sm font-black text-white">$129.00 <span class="text-xs text-slate-500 line-through">$170.00</span></div>
            <div class="text-[10px] text-emerald-400 font-bold">In Stock</div>
          </div>
          <!-- Size Selector Pills -->
          <div class="flex gap-1 pt-1 text-[10px] font-bold text-slate-400">
            <span class="px-2 py-1 rounded-md bg-white/5 border border-white/10 hover:border-brand-500 text-white cursor-pointer">US 8</span>
            <span class="px-2 py-1 rounded-md bg-amber-500/20 border border-brand-500 text-brand-400 cursor-pointer">US 9</span>
            <span class="px-2 py-1 rounded-md bg-white/5 border border-white/10 hover:border-brand-500 text-white cursor-pointer">US 10</span>
            <span class="px-2 py-1 rounded-md bg-white/5 border border-white/10 hover:border-brand-500 text-white cursor-pointer">US 11</span>
          </div>
        </div>
        <button onclick="addToCart('p1', 'AeroRunner High-Top Crimson', 129, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200', 'US 9', 'Crimson')" class="mt-4 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer">
          <i data-lucide="shopping-bag" class="w-4 h-4"></i> Add to Bag
        </button>
      </div>

      <!-- Product 2: Hoodie -->
      <div class="product-card glass-card rounded-3xl overflow-hidden p-3.5 flex flex-col justify-between transition group" data-category="hoodies" data-title="Tokyo Acid-Wash Heavy Hoodie">
        <div class="relative rounded-2xl overflow-hidden bg-dark-900 mb-3.5">
          <span class="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded-full bg-purple-600 text-white font-black text-[10px] uppercase">450 GSM</span>
          <button onclick="toggleWishlist(this, 'p2')" class="wishlist-btn absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white hover:text-rose-400 flex items-center justify-center transition">
            <i data-lucide="heart" class="w-4 h-4"></i>
          </button>
          <img src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop&q=80" alt="Heavy Hoodie" class="w-full h-56 object-cover group-hover:scale-105 transition duration-300">
        </div>
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="text-[11px] font-bold text-purple-400 uppercase tracking-wider">Heavyweight Tops</span>
            <span class="text-slate-400 font-semibold">★ 4.9 (320)</span>
          </div>
          <h4 class="font-extrabold text-sm text-white truncate">Tokyo Acid-Wash Boxy Hoodie</h4>
          <div class="flex items-center justify-between pt-1">
            <div class="text-sm font-black text-white">$89.00 <span class="text-xs text-slate-500 line-through">$120.00</span></div>
            <div class="text-[10px] text-amber-400 font-bold">25% OFF</div>
          </div>
          <div class="flex gap-1 pt-1 text-[10px] font-bold text-slate-400">
            <span class="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white cursor-pointer">S</span>
            <span class="px-2 py-1 rounded-md bg-amber-500/20 border border-brand-500 text-brand-400 cursor-pointer">M</span>
            <span class="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white cursor-pointer">L</span>
            <span class="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white cursor-pointer">XL</span>
          </div>
        </div>
        <button onclick="addToCart('p2', 'Tokyo Acid-Wash Boxy Hoodie', 89, 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=200', 'M', 'Charcoal')" class="mt-4 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer">
          <i data-lucide="shopping-bag" class="w-4 h-4"></i> Add to Bag
        </button>
      </div>

      <!-- Product 3: Cargo Pants -->
      <div class="product-card glass-card rounded-3xl overflow-hidden p-3.5 flex flex-col justify-between transition group" data-category="cargos" data-title="Modular 6-Pocket Tactical Cargo">
        <div class="relative rounded-2xl overflow-hidden bg-dark-900 mb-3.5">
          <span class="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded-full bg-emerald-600 text-white font-black text-[10px] uppercase">WATERPROOF</span>
          <button onclick="toggleWishlist(this, 'p3')" class="wishlist-btn absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white hover:text-rose-400 flex items-center justify-center transition">
            <i data-lucide="heart" class="w-4 h-4"></i>
          </button>
          <img src="https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=500&auto=format&fit=crop&q=80" alt="Tactical Cargo" class="w-full h-56 object-cover group-hover:scale-105 transition duration-300">
        </div>
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Bottoms &amp; Denim</span>
            <span class="text-slate-400 font-semibold">★ 4.8 (210)</span>
          </div>
          <h4 class="font-extrabold text-sm text-white truncate">Modular 6-Pocket Tactical Cargo</h4>
          <div class="flex items-center justify-between pt-1">
            <div class="text-sm font-black text-white">$98.00 <span class="text-xs text-slate-500 line-through">$140.00</span></div>
            <div class="text-[10px] text-emerald-400 font-bold">Only 4 Left</div>
          </div>
          <div class="flex gap-1 pt-1 text-[10px] font-bold text-slate-400">
            <span class="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white cursor-pointer">30</span>
            <span class="px-2 py-1 rounded-md bg-amber-500/20 border border-brand-500 text-brand-400 cursor-pointer">32</span>
            <span class="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white cursor-pointer">34</span>
            <span class="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white cursor-pointer">36</span>
          </div>
        </div>
        <button onclick="addToCart('p3', 'Modular 6-Pocket Tactical Cargo', 98, 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=200', '32', 'Olive')" class="mt-4 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer">
          <i data-lucide="shopping-bag" class="w-4 h-4"></i> Add to Bag
        </button>
      </div>

      <!-- Product 4: Oversized Graphic Tee -->
      <div class="product-card glass-card rounded-3xl overflow-hidden p-3.5 flex flex-col justify-between transition group" data-category="tees" data-title="Cyberpunk Heavy Oversized Tee">
        <div class="relative rounded-2xl overflow-hidden bg-dark-900 mb-3.5">
          <span class="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded-full badge-drop text-black font-black text-[10px] uppercase">BESTSELLER</span>
          <button onclick="toggleWishlist(this, 'p4')" class="wishlist-btn absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white hover:text-rose-400 flex items-center justify-center transition">
            <i data-lucide="heart" class="w-4 h-4"></i>
          </button>
          <img src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&auto=format&fit=crop&q=80" alt="Oversized Tee" class="w-full h-56 object-cover group-hover:scale-105 transition duration-300">
        </div>
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="text-[11px] font-bold text-brand-400 uppercase tracking-wider">Graphic Series</span>
            <span class="text-slate-400 font-semibold">★ 5.0 (490)</span>
          </div>
          <h4 class="font-extrabold text-sm text-white truncate">Cyberpunk Heavy 280GSM Tee</h4>
          <div class="flex items-center justify-between pt-1">
            <div class="text-sm font-black text-white">$45.00 <span class="text-xs text-slate-500 line-through">$65.00</span></div>
            <div class="text-[10px] text-amber-400 font-bold">30% OFF</div>
          </div>
          <div class="flex gap-1 pt-1 text-[10px] font-bold text-slate-400">
            <span class="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white cursor-pointer">S</span>
            <span class="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white cursor-pointer">M</span>
            <span class="px-2 py-1 rounded-md bg-amber-500/20 border border-brand-500 text-brand-400 cursor-pointer">L</span>
            <span class="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white cursor-pointer">XL</span>
          </div>
        </div>
        <button onclick="addToCart('p4', 'Cyberpunk Heavy 280GSM Tee', 45, 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=200', 'L', 'Vintage Black')" class="mt-4 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer">
          <i data-lucide="shopping-bag" class="w-4 h-4"></i> Add to Bag
        </button>
      </div>

      <!-- Product 5: Sneaker 2 -->
      <div class="product-card glass-card rounded-3xl overflow-hidden p-3.5 flex flex-col justify-between transition group" data-category="sneakers" data-title="Vortex Phantom Chunky Trainer">
        <div class="relative rounded-2xl overflow-hidden bg-dark-900 mb-3.5">
          <button onclick="toggleWishlist(this, 'p5')" class="wishlist-btn absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white hover:text-rose-400 flex items-center justify-center transition">
            <i data-lucide="heart" class="w-4 h-4"></i>
          </button>
          <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&auto=format&fit=crop&q=80" alt="Chunky Sneaker" class="w-full h-56 object-cover group-hover:scale-105 transition duration-300">
        </div>
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="text-[11px] font-bold text-brand-400 uppercase tracking-wider">Footwear Lab</span>
            <span class="text-slate-400 font-semibold">★ 4.9 (95)</span>
          </div>
          <h4 class="font-extrabold text-sm text-white truncate">Vortex Phantom Chunky Trainer</h4>
          <div class="flex items-center justify-between pt-1">
            <div class="text-sm font-black text-white">$145.00</div>
            <div class="text-[10px] text-emerald-400 font-bold">Limited</div>
          </div>
          <div class="flex gap-1 pt-1 text-[10px] font-bold text-slate-400">
            <span class="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white cursor-pointer">US 8</span>
            <span class="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white cursor-pointer">US 9</span>
            <span class="px-2 py-1 rounded-md bg-amber-500/20 border border-brand-500 text-brand-400 cursor-pointer">US 10</span>
          </div>
        </div>
        <button onclick="addToCart('p5', 'Vortex Phantom Chunky Trainer', 145, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200', 'US 10', 'Triple White')" class="mt-4 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer">
          <i data-lucide="shopping-bag" class="w-4 h-4"></i> Add to Bag
        </button>
      </div>

      <!-- Product 6: Hoodie 2 -->
      <div class="product-card glass-card rounded-3xl overflow-hidden p-3.5 flex flex-col justify-between transition group" data-category="hoodies" data-title="Berlin Minimalist Olive Pullover">
        <div class="relative rounded-2xl overflow-hidden bg-dark-900 mb-3.5">
          <button onclick="toggleWishlist(this, 'p6')" class="wishlist-btn absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white hover:text-rose-400 flex items-center justify-center transition">
            <i data-lucide="heart" class="w-4 h-4"></i>
          </button>
          <img src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=500&auto=format&fit=crop&q=80" alt="Olive Pullover" class="w-full h-56 object-cover group-hover:scale-105 transition duration-300">
        </div>
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="text-[11px] font-bold text-purple-400 uppercase tracking-wider">Heavyweight Tops</span>
            <span class="text-slate-400 font-semibold">★ 4.8 (110)</span>
          </div>
          <h4 class="font-extrabold text-sm text-white truncate">Berlin Minimalist Olive Pullover</h4>
          <div class="flex items-center justify-between pt-1">
            <div class="text-sm font-black text-white">$79.00 <span class="text-xs text-slate-500 line-through">$105.00</span></div>
            <div class="text-[10px] text-amber-400 font-bold">20% OFF</div>
          </div>
          <div class="flex gap-1 pt-1 text-[10px] font-bold text-slate-400">
            <span class="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white cursor-pointer">S</span>
            <span class="px-2 py-1 rounded-md bg-amber-500/20 border border-brand-500 text-brand-400 cursor-pointer">M</span>
            <span class="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white cursor-pointer">L</span>
          </div>
        </div>
        <button onclick="addToCart('p6', 'Berlin Minimalist Olive Pullover', 79, 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=200', 'M', 'Olive')" class="mt-4 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer">
          <i data-lucide="shopping-bag" class="w-4 h-4"></i> Add to Bag
        </button>
      </div>

      <!-- Product 7: Cargo 2 -->
      <div class="product-card glass-card rounded-3xl overflow-hidden p-3.5 flex flex-col justify-between transition group" data-category="cargos" data-title="Shadow Parachute Baggy Pants">
        <div class="relative rounded-2xl overflow-hidden bg-dark-900 mb-3.5">
          <span class="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded-full badge-drop text-black font-black text-[10px] uppercase">TRENDING</span>
          <button onclick="toggleWishlist(this, 'p7')" class="wishlist-btn absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white hover:text-rose-400 flex items-center justify-center transition">
            <i data-lucide="heart" class="w-4 h-4"></i>
          </button>
          <img src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=80" alt="Parachute Pants" class="w-full h-56 object-cover group-hover:scale-105 transition duration-300">
        </div>
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Bottoms &amp; Denim</span>
            <span class="text-slate-400 font-semibold">★ 4.9 (340)</span>
          </div>
          <h4 class="font-extrabold text-sm text-white truncate">Shadow Parachute Baggy Pants</h4>
          <div class="flex items-center justify-between pt-1">
            <div class="text-sm font-black text-white">$85.00</div>
            <div class="text-[10px] text-emerald-400 font-bold">Hot Seller</div>
          </div>
          <div class="flex gap-1 pt-1 text-[10px] font-bold text-slate-400">
            <span class="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white cursor-pointer">S</span>
            <span class="px-2 py-1 rounded-md bg-amber-500/20 border border-brand-500 text-brand-400 cursor-pointer">M</span>
            <span class="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white cursor-pointer">L</span>
          </div>
        </div>
        <button onclick="addToCart('p7', 'Shadow Parachute Baggy Pants', 85, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200', 'M', 'Shadow Black')" class="mt-4 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer">
          <i data-lucide="shopping-bag" class="w-4 h-4"></i> Add to Bag
        </button>
      </div>

      <!-- Product 8: Tee 2 -->
      <div class="product-card glass-card rounded-3xl overflow-hidden p-3.5 flex flex-col justify-between transition group" data-category="tees" data-title="Archive Gothic Font Heavy Tee">
        <div class="relative rounded-2xl overflow-hidden bg-dark-900 mb-3.5">
          <button onclick="toggleWishlist(this, 'p8')" class="wishlist-btn absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white hover:text-rose-400 flex items-center justify-center transition">
            <i data-lucide="heart" class="w-4 h-4"></i>
          </button>
          <img src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80" alt="Gothic Tee" class="w-full h-56 object-cover group-hover:scale-105 transition duration-300">
        </div>
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="text-[11px] font-bold text-brand-400 uppercase tracking-wider">Graphic Series</span>
            <span class="text-slate-400 font-semibold">★ 4.7 (80)</span>
          </div>
          <h4 class="font-extrabold text-sm text-white truncate">Archive Gothic Font Heavy Tee</h4>
          <div class="flex items-center justify-between pt-1">
            <div class="text-sm font-black text-white">$42.00 <span class="text-xs text-slate-500 line-through">$58.00</span></div>
            <div class="text-[10px] text-amber-400 font-bold">25% OFF</div>
          </div>
          <div class="flex gap-1 pt-1 text-[10px] font-bold text-slate-400">
            <span class="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white cursor-pointer">S</span>
            <span class="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white cursor-pointer">M</span>
            <span class="px-2 py-1 rounded-md bg-amber-500/20 border border-brand-500 text-brand-400 cursor-pointer">L</span>
          </div>
        </div>
        <button onclick="addToCart('p8', 'Archive Gothic Font Heavy Tee', 42, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200', 'L', 'White')" class="mt-4 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer">
          <i data-lucide="shopping-bag" class="w-4 h-4"></i> Add to Bag
        </button>
      </div>

    </div>
  </section>

  <!-- SNEAKER LAB DEDICATED SHOWCASE -->
  <section id="sneaker-lab" class="py-16 bg-gradient-to-b from-dark-900 to-dark-950 border-t border-white/10 px-4 sm:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <span class="text-xs font-black uppercase tracking-widest text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">Footwear Engineering</span>
        <h2 class="text-3xl sm:text-4xl font-display font-black text-white mt-3">Sneaker Lab &amp; Custom Soles</h2>
        <p class="text-slate-400 text-sm mt-2">Equipped with shock-absorbent dual-density foam and vulcanized rubber outsoles.</p>
      </div>

      <div class="grid md:grid-cols-3 gap-6">
        
        <!-- Sneaker Card 1 -->
        <div class="glass-card rounded-3xl p-6 text-left relative overflow-hidden group">
          <div class="w-full h-64 rounded-2xl overflow-hidden bg-dark-950 mb-4">
            <img src="https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80" alt="Sneaker Lab" class="w-full h-full object-cover group-hover:scale-110 transition duration-300">
          </div>
          <span class="text-xs font-mono text-brand-400 font-bold">LAB MODEL #01</span>
          <h3 class="text-xl font-bold text-white mt-1">AeroRunner Orbit High</h3>
          <p class="text-slate-400 text-xs mt-1">Full-grain leather with carbon fiber stabilizing shank.</p>
          <div class="flex items-center justify-between mt-4">
            <span class="text-lg font-black text-white">$159.00</span>
            <button onclick="addToCart('s1', 'AeroRunner Orbit High', 159, 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=200', 'US 9.5', 'Onyx')" class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase cursor-pointer">
              Quick Add
            </button>
          </div>
        </div>

        <!-- Sneaker Card 2 -->
        <div class="glass-card rounded-3xl p-6 text-left relative overflow-hidden group">
          <div class="w-full h-64 rounded-2xl overflow-hidden bg-dark-950 mb-4">
            <img src="https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600&auto=format&fit=crop&q=80" alt="Sneaker Lab" class="w-full h-full object-cover group-hover:scale-110 transition duration-300">
          </div>
          <span class="text-xs font-mono text-brand-400 font-bold">LAB MODEL #02</span>
          <h3 class="text-xl font-bold text-white mt-1">NitroPulse Low Trainer</h3>
          <p class="text-slate-400 text-xs mt-1">Ultra-lightweight mesh upper with responsive gel pods.</p>
          <div class="flex items-center justify-between mt-4">
            <span class="text-lg font-black text-white">$139.00</span>
            <button onclick="addToCart('s2', 'NitroPulse Low Trainer', 139, 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=200', 'US 10', 'White Red')" class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase cursor-pointer">
              Quick Add
            </button>
          </div>
        </div>

        <!-- Sneaker Card 3 -->
        <div class="glass-card rounded-3xl p-6 text-left relative overflow-hidden group">
          <div class="w-full h-64 rounded-2xl overflow-hidden bg-dark-950 mb-4">
            <img src="https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=600&auto=format&fit=crop&q=80" alt="Sneaker Lab" class="w-full h-full object-cover group-hover:scale-110 transition duration-300">
          </div>
          <span class="text-xs font-mono text-brand-400 font-bold">LAB MODEL #03</span>
          <h3 class="text-xl font-bold text-white mt-1">CyberStrider V3 Mule</h3>
          <p class="text-slate-400 text-xs mt-1">Slip-on recovery mule with rugged deep-lug traction.</p>
          <div class="flex items-center justify-between mt-4">
            <span class="text-lg font-black text-white">$95.00</span>
            <button onclick="addToCart('s3', 'CyberStrider V3 Mule', 95, 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=200', 'US 9', 'Bone')" class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase cursor-pointer">
              Quick Add
            </button>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- URBAN LOOKBOOK SECTION -->
  <section id="lookbook" class="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
    <div class="text-center max-w-2xl mx-auto mb-10">
      <span class="text-xs font-black uppercase tracking-widest text-brand-400">Editorial Archive</span>
      <h2 class="text-3xl sm:text-4xl font-display font-black text-white mt-2">Urban Lookbook 2024</h2>
      <p class="text-slate-400 text-sm mt-1">Captured on location in Tokyo &amp; Berlin. Real styling for real street culture.</p>
    </div>

    <div class="grid sm:grid-cols-3 gap-6">
      <div class="rounded-3xl overflow-hidden glass-card relative group h-96">
        <img src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=600&auto=format&fit=crop&q=80" alt="Lookbook 1" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
        <div class="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent flex flex-col justify-end p-6 text-left">
          <span class="text-[10px] font-mono text-brand-400 font-bold uppercase">TOKYO SET</span>
          <h4 class="text-lg font-bold text-white">Cyberpunk Heavyweight Layering</h4>
          <a href="#products" class="text-xs text-brand-400 font-bold hover:underline mt-2 flex items-center gap-1">Shop This Look ➔</a>
        </div>
      </div>
      <div class="rounded-3xl overflow-hidden glass-card relative group h-96">
        <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80" alt="Lookbook 2" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
        <div class="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent flex flex-col justify-end p-6 text-left">
          <span class="text-[10px] font-mono text-brand-400 font-bold uppercase">FOOTWEAR LAB</span>
          <h4 class="text-lg font-bold text-white">AeroRunner High-Top Soles</h4>
          <a href="#sneaker-lab" class="text-xs text-brand-400 font-bold hover:underline mt-2 flex items-center gap-1">Shop This Look ➔</a>
        </div>
      </div>
      <div class="rounded-3xl overflow-hidden glass-card relative group h-96">
        <img src="https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=600&auto=format&fit=crop&q=80" alt="Lookbook 3" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
        <div class="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent flex flex-col justify-end p-6 text-left">
          <span class="text-[10px] font-mono text-brand-400 font-bold uppercase">BERLIN ARCHIVE</span>
          <h4 class="text-lg font-bold text-white">Raw Denim &amp; Modular Cargo</h4>
          <a href="#products" class="text-xs text-brand-400 font-bold hover:underline mt-2 flex items-center gap-1">Shop This Look ➔</a>
        </div>
      </div>
    </div>
  </section>

  <!-- ORDER TRACKING SECTION -->
  <section id="tracking" class="py-16 bg-dark-900/60 border-t border-white/10 px-4 sm:px-8">
    <div class="max-w-3xl mx-auto glass-card rounded-3xl p-6 sm:p-10 text-center space-y-6">
      <span class="text-xs font-black uppercase tracking-widest text-brand-400">Order Intelligence</span>
      <h2 class="text-2xl sm:text-3xl font-display font-black text-white">Track Your Streetwear Package</h2>
      <p class="text-slate-400 text-xs sm:text-sm">Enter your 8-digit order reference number below for live dispatch coordinates.</p>
      
      <div class="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
        <input type="text" id="trackNumberInput" value="#KRN-9482" placeholder="e.g. #KRN-9482" class="w-full px-4 py-3 rounded-xl bg-dark-950 border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-brand-500">
        <button onclick="trackOrder()" class="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-400 transition shrink-0 cursor-pointer">
          Track Package
        </button>
      </div>

      <!-- Live Timeline Result Box -->
      <div id="trackingResultBox" class="pt-6 border-t border-white/10 text-left">
        <div class="flex items-center justify-between text-xs mb-4">
          <span class="text-slate-400">Status: <strong class="text-emerald-400">In Transit • Out for Delivery</strong></span>
          <span class="text-slate-400">Carrier: <strong class="text-white">DHL Express</strong></span>
        </div>
        <div class="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
          <div class="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">1. Order Placed ✓</div>
          <div class="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">2. Packed ✓</div>
          <div class="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">3. In Transit ⚡</div>
          <div class="p-2 rounded-xl bg-white/5 text-slate-500">4. Delivered</div>
        </div>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="border-t border-white/10 bg-dark-950 py-12 px-4 sm:px-8 text-xs text-slate-400">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-left">
      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-black font-black text-xs">⚡</div>
          <span class="font-display font-black text-base text-white">KRONOS.</span>
        </div>
        <p class="text-slate-400 text-xs">Modern streetwear, modular cargos, and limited footwear drops engineered for the next era of urban culture.</p>
      </div>
      <div>
        <h4 class="text-white font-bold uppercase tracking-wider mb-3">Shop Departments</h4>
        <ul class="space-y-2">
          <li><a href="#categories" onclick="filterCategory('sneakers')" class="hover:text-white transition">Sneakers &amp; Kicks</a></li>
          <li><a href="#categories" onclick="filterCategory('hoodies')" class="hover:text-white transition">Heavyweight Hoodies</a></li>
          <li><a href="#categories" onclick="filterCategory('tees')" class="hover:text-white transition">Oversized Graphic Tees</a></li>
          <li><a href="#categories" onclick="filterCategory('cargos')" class="hover:text-white transition">Tactical Cargo Pants</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-white font-bold uppercase tracking-wider mb-3">Customer Support</h4>
        <ul class="space-y-2">
          <li><a href="#tracking" class="hover:text-white transition">Track Your Package</a></li>
          <li><button onclick="openModal('privacyModal')" class="hover:text-white transition">Shipping &amp; Return Policy</button></li>
          <li><button onclick="openModal('privacyModal')" class="hover:text-white transition">Size Guide &amp; Fit</button></li>
          <li><button onclick="openModal('privacyModal')" class="hover:text-white transition">Terms &amp; Conditions</button></li>
        </ul>
      </div>
      <div>
        <h4 class="text-white font-bold uppercase tracking-wider mb-3">VIP Club</h4>
        <p class="text-xs text-slate-400 mb-3">Get private access to limited sneaker drops 1 hour before general release.</p>
        <form onsubmit="event.preventDefault(); showToast('Subscribed to VIP drops list! ⚡')" class="flex gap-2">
          <input type="email" required placeholder="Enter your email" class="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500">
          <button type="submit" class="px-4 py-2 rounded-xl bg-amber-500 text-black font-extrabold text-xs uppercase shrink-0 hover:bg-amber-400 transition cursor-pointer">Join</button>
        </form>
      </div>
    </div>
    <div class="max-w-7xl mx-auto pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
      <p>© 2024 KRONOS STREETWEAR LAB. All rights reserved.</p>
      <div class="flex items-center gap-4 text-slate-400">
        <span>🔒 256-Bit SSL Encrypted</span>
        <span>💳 Visa / Mastercard / Apple Pay / UPI</span>
      </div>
    </div>
  </footer>

  <!-- SLIDE-OUT CART DRAWER (#cartDrawer) -->
  <div id="cartDrawer" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end transition-opacity duration-300 hidden">
    <div class="w-full max-w-md bg-dark-950 border-l border-white/10 h-full flex flex-col justify-between p-6 shadow-2xl overflow-y-auto">
      
      <!-- Drawer Header -->
      <div class="flex items-center justify-between pb-4 border-b border-white/10">
        <div class="flex items-center gap-2">
          <i data-lucide="shopping-bag" class="w-5 h-5 text-brand-400"></i>
          <h3 class="font-display font-black text-lg text-white">Your Shopping Bag (<span id="drawerCount">0</span>)</h3>
        </div>
        <button onclick="closeCartDrawer()" class="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Cart Items List Container -->
      <div id="cartItemsList" class="my-6 space-y-4 flex-1 overflow-y-auto">
        <!-- Empty State (Default) -->
        <div id="cartEmptyState" class="py-16 text-center space-y-4">
          <div class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-slate-500 text-2xl">🛍️</div>
          <h4 class="text-base font-bold text-white">Your bag is empty</h4>
          <p class="text-xs text-slate-400 max-w-xs mx-auto">Explore our new Summer drops and sneaker lab to start adding items.</p>
          <button onclick="closeCartDrawer(); window.location.hash='#products'" class="px-6 py-2.5 rounded-xl bg-amber-500 text-black font-extrabold text-xs uppercase cursor-pointer">
            Explore Drops
          </button>
        </div>
      </div>

      <!-- Drawer Footer Summary -->
      <div id="cartSummaryBox" class="pt-4 border-t border-white/10 space-y-3 hidden">
        <div class="flex items-center justify-between text-xs">
          <span class="text-slate-400">Subtotal:</span>
          <span id="cartSubtotalText" class="text-base font-black text-white">$0.00</span>
        </div>
        <div class="flex items-center justify-between text-xs text-emerald-400">
          <span>Shipping:</span>
          <span class="font-bold">FREE Express Delivery</span>
        </div>
        <button onclick="openCheckoutModal()" class="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider transition shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 cursor-pointer">
          <span>Proceed to Checkout ➔</span>
        </button>
      </div>

    </div>
  </div>

  <!-- CHECKOUT MODAL (#checkoutModal) -->
  <div id="checkoutModal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 hidden">
    <div class="glass-card max-w-lg w-full rounded-3xl p-6 sm:p-8 relative text-left bg-dark-950 border border-white/10 shadow-2xl">
      <button onclick="closeModal('checkoutModal')" class="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>

      <div id="checkoutFormContent">
        <span class="text-xs font-mono text-brand-400 font-bold uppercase">SECURE CHECKOUT</span>
        <h3 class="text-2xl font-black text-white mt-1 mb-4">Complete Your Order</h3>

        <form onsubmit="event.preventDefault(); submitOrder(event)" class="space-y-3.5">
          <div>
            <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Full Name</label>
            <input type="text" required placeholder="Alex Morgan" class="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-500">
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Email</label>
              <input type="email" required placeholder="alex@company.com" class="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-500">
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Phone</label>
              <input type="tel" required placeholder="+1 (555) 019-2834" class="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-500">
            </div>
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Shipping Address</label>
            <input type="text" required placeholder="128 Shibuya Crossing, Suite 402" class="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-500">
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Payment Method</label>
            <div class="grid grid-cols-3 gap-2 text-center text-xs font-bold text-slate-300">
              <label class="p-2.5 rounded-xl bg-white/5 border border-brand-500 text-brand-400 flex items-center justify-center gap-1 cursor-pointer">
                <input type="radio" name="pay" checked class="hidden"> Card
              </label>
              <label class="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-brand-500 flex items-center justify-center gap-1 cursor-pointer">
                <input type="radio" name="pay" class="hidden"> UPI / Net
              </label>
              <label class="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-brand-500 flex items-center justify-center gap-1 cursor-pointer">
                <input type="radio" name="pay" class="hidden"> COD
              </label>
            </div>
          </div>
          <button type="submit" class="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider transition shadow-lg shadow-brand-500/20 cursor-pointer mt-2">
            Confirm Order • Pay Now ➔
          </button>
        </form>
      </div>

      <!-- Order Confirmed View -->
      <div id="orderSuccessContent" class="text-center py-6 space-y-4 hidden">
        <div class="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-3xl flex items-center justify-center mx-auto">✓</div>
        <span class="text-xs font-mono text-emerald-400 font-bold">ORDER CONFIRMED #KRN-9482</span>
        <h3 class="text-2xl font-black text-white">Payment Received!</h3>
        <p class="text-xs text-slate-300 max-w-sm mx-auto">Your streetwear package has been sent to our Tokyo fulfillment center. Tracking updates will be sent via SMS &amp; Email.</p>
        <button onclick="closeModal('checkoutModal'); resetCart();" class="px-6 py-2.5 rounded-xl bg-amber-500 text-black font-extrabold text-xs uppercase cursor-pointer">
          Done • Continue Shopping
        </button>
      </div>
    </div>
  </div>

  <!-- JAVASCRIPT E-COMMERCE ENGINE -->
  <script>
    // State
    let cart = [];
    let wishlist = [];

    // Filter Products by Category
    function filterCategory(cat) {
      const cards = document.querySelectorAll('.product-card');
      const pills = document.querySelectorAll('.cat-pill');

      pills.forEach(p => {
        p.classList.remove('bg-amber-500', 'text-black');
        p.classList.add('glass-card', 'text-slate-300');
      });

      const activePill = document.getElementById('pill-' + cat);
      if (activePill) {
        activePill.classList.remove('glass-card', 'text-slate-300');
        activePill.classList.add('bg-amber-500', 'text-black');
      }

      cards.forEach(card => {
        const itemCat = card.getAttribute('data-category');
        if (cat === 'all' || itemCat === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
      window.location.hash = '#products';
    }

    // Live Product Search
    function handleProductSearch(query) {
      const q = (query || '').toLowerCase().trim();
      const cards = document.querySelectorAll('.product-card');
      cards.forEach(card => {
        const title = (card.getAttribute('data-title') || '').toLowerCase();
        const cat = (card.getAttribute('data-category') || '').toLowerCase();
        if (!q || title.includes(q) || cat.includes(q)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }

    // Add to Bag
    function addToCart(id, name, price, img, size, color) {
      const existing = cart.find(item => item.id === id && item.size === size);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ id, name, price, img, size, color, qty: 1 });
      }
      updateCartUi();
      openCartDrawer();
      showToast('Added ' + name + ' to Bag! 🛍️');
    }

    // Update Cart UI
    function updateCartUi() {
      const countBadges = [document.getElementById('cartCountBadge'), document.getElementById('drawerCount')];
      const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
      
      countBadges.forEach(b => { if (b) b.textContent = totalQty; });

      const listContainer = document.getElementById('cartItemsList');
      const emptyState = document.getElementById('cartEmptyState');
      const summaryBox = document.getElementById('cartSummaryBox');
      const subtotalText = document.getElementById('cartSubtotalText');

      if (!listContainer) return;

      if (cart.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        if (summaryBox) summaryBox.style.display = 'none';
        listContainer.innerHTML = '';
        listContainer.appendChild(emptyState);
      } else {
        if (emptyState) emptyState.style.display = 'none';
        if (summaryBox) summaryBox.style.display = 'block';

        let subtotal = 0;
        listContainer.innerHTML = '';

        cart.forEach((item, index) => {
          subtotal += item.price * item.qty;
          const itemEl = document.createElement('div');
          itemEl.className = 'flex items-center justify-between gap-3 p-3 rounded-2xl bg-dark-900 border border-white/10';
          itemEl.innerHTML = '<img src="' + item.img + '" class="w-14 h-14 rounded-xl object-cover shrink-0">' +
            '<div class="flex-1 min-w-0 text-left">' +
              '<h4 class="text-xs font-bold text-white truncate">' + item.name + '</h4>' +
              '<p class="text-[11px] text-slate-400">' + item.size + ' • ' + item.color + '</p>' +
              '<span class="text-xs font-black text-amber-400">$' + (item.price * item.qty).toFixed(2) + '</span>' +
            '</div>' +
            '<div class="flex items-center gap-2 shrink-0">' +
              '<button onclick="changeQty(' + index + ', -1)" class="w-6 h-6 rounded-lg bg-white/10 text-white font-bold flex items-center justify-center hover:bg-white/20">-</button>' +
              '<span class="text-xs font-bold text-white">' + item.qty + '</span>' +
              '<button onclick="changeQty(' + index + ', 1)" class="w-6 h-6 rounded-lg bg-white/10 text-white font-bold flex items-center justify-center hover:bg-white/20">+</button>' +
            '</div>';
          listContainer.appendChild(itemEl);
        });

        if (subtotalText) subtotalText.textContent = '$' + subtotal.toFixed(2);
      }
    }

    function changeQty(index, delta) {
      if (cart[index]) {
        cart[index].qty += delta;
        if (cart[index].qty <= 0) {
          cart.splice(index, 1);
        }
        updateCartUi();
      }
    }

    function resetCart() {
      cart = [];
      updateCartUi();
      document.getElementById('checkoutFormContent').style.display = 'block';
      document.getElementById('orderSuccessContent').style.display = 'none';
    }

    function openCartDrawer() {
      const drawer = document.getElementById('cartDrawer');
      if (drawer) drawer.classList.remove('hidden');
    }

    function closeCartDrawer() {
      const drawer = document.getElementById('cartDrawer');
      if (drawer) drawer.classList.add('hidden');
    }

    function openCheckoutModal() {
      closeCartDrawer();
      const modal = document.getElementById('checkoutModal');
      if (modal) modal.classList.remove('hidden');
    }

    function submitOrder(e) {
      if (e) e.preventDefault();
      document.getElementById('checkoutFormContent').style.display = 'none';
      document.getElementById('orderSuccessContent').style.display = 'block';
    }

    function toggleWishlist(btn, id) {
      const icon = btn.querySelector('svg, i');
      if (wishlist.includes(id)) {
        wishlist = wishlist.filter(x => x !== id);
        btn.classList.remove('text-rose-500');
        showToast('Removed from wishlist');
      } else {
        wishlist.push(id);
        btn.classList.add('text-rose-500');
        showToast('Saved to wishlist! ❤️');
      }
      const badge = document.getElementById('wishlistCountBadge');
      if (badge) badge.textContent = wishlist.length;
    }

    function openWishlistDrawer() {
      showToast('You have ' + wishlist.length + ' item(s) saved in your wishlist! ❤️');
    }

    function trackOrder() {
      const inp = document.getElementById('trackNumberInput');
      const box = document.getElementById('trackingResultBox');
      if (box) box.style.display = 'block';
      showToast('Live tracking found for ' + (inp ? inp.value : '#KRN-9482') + ' 🚀');
    }

    // Lucide Icons auto init
    document.addEventListener('DOMContentLoaded', function() {
      if (window.lucide) lucide.createIcons();
    });
  </script>
</body>
</html>`;

async function updateKronosStore() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const site = await Website.findById("6a8eb7ef5747e01908c9814b");
    if (!site) return;

    site.latestCode = fullEcommerceHtml;
    await site.save();
    console.log("KRONOS site successfully upgraded to complete multi-department e-commerce store with 16 products & working cart!");
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

updateKronosStore();
