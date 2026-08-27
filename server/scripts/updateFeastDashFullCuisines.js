import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import Website from "../models/website.model.js";
import { normalizeHtml } from "../utils/normalizeHtml.js";

async function updateSite() {
    try {
        await mongoose.connect(process.env.MONGODB_URL || process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const site = await Website.findById("6a8fc4c3c438ac7f645d3a98");
        if (!site) {
            console.log("Site not found");
            process.exit(1);
        }

        console.log("Updating site with comprehensive 12-cuisine restaurant catalog:", site.title);

        // We build the complete enhanced HTML for FeastDash
        const fullHtml = `<!DOCTYPE html>
<html lang="en" class="dark scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FeastDash | Artisanal Gourmet Food & Restaurant Delivery</title>
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>
  
  <!-- Tailwind Configuration -->
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
            serif: ['"Playfair Display"', 'Georgia', 'serif']
          },
          colors: {
            stoneDark: { 950: '#0c0a09', 900: '#140f0c', 800: '#1c1714', 700: '#29221d' },
            brand: { 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706' }
          }
        }
      }
    }
  </script>
  <style>
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  </style>
</head>
<body class="bg-[#0c0a09] text-stone-100 font-sans min-h-screen flex flex-col selection:bg-amber-500 selection:text-black">

  <!-- TOP ANNOUNCEMENT TICKER -->
  <div class="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-stone-950 font-bold text-xs py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2">
    <i data-lucide="zap" class="w-3.5 h-3.5 fill-current"></i>
    <span>⚡ FLASH OFFER: Get 20% OFF across 12+ Cuisines with code <span class="underline font-extrabold">FEAST20</span> • Average delivery in 28 mins!</span>
  </div>

  <!-- STICKY GLASS NAVBAR -->
  <header class="sticky top-0 z-40 w-full bg-[#0c0a09]/95 backdrop-blur-xl border-b border-stone-800/80 transition-all duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
      
      <!-- BRAND LOGO -->
      <a href="#hero" class="flex items-center gap-2.5 group">
        <div class="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-stone-950 font-black text-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
          <i data-lucide="utensils-crossed" class="w-5 h-5"></i>
        </div>
        <div class="flex flex-col">
          <span class="font-serif font-extrabold text-xl tracking-tight text-white group-hover:text-amber-400 transition">FeastDash</span>
          <span class="text-[10px] text-amber-500/90 tracking-widest uppercase font-bold">Artisanal Dining & Delivery</span>
        </div>
      </a>

      <!-- DESKTOP NAVIGATION -->
      <nav class="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-stone-300">
        <a href="#hero" class="hover:text-amber-400 transition py-1">Home</a>
        <a href="#restaurants" class="hover:text-amber-400 transition py-1 flex items-center gap-1">
          <span>Restaurants</span>
          <span class="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[9px] font-bold">12 Cuisines</span>
        </a>
        <a href="#categories" class="hover:text-amber-400 transition py-1">Cuisines</a>
        <a href="#menu" class="hover:text-amber-400 transition py-1">Menu</a>
        <a href="#how-it-works" class="hover:text-amber-400 transition py-1">How It Works</a>
        <a href="#reviews" class="hover:text-amber-400 transition py-1">Reviews</a>
        <a href="#contact" class="hover:text-amber-400 transition py-1">Contact</a>
      </nav>

      <!-- HEADER ACTIONS -->
      <div class="flex items-center gap-3">
        <a href="#tracking" class="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs font-medium text-stone-300 hover:text-white hover:border-amber-500/50 transition">
          <i data-lucide="truck" class="w-4 h-4 text-amber-500"></i>
          <span>Track Order</span>
        </a>

        <!-- CART DRAWER TRIGGER -->
        <button type="button" onclick="toggleDrawer('cartDrawer')" class="relative p-2.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-500/50 text-stone-200 transition group flex items-center gap-2 cursor-pointer">
          <i data-lucide="shopping-bag" class="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform"></i>
          <span class="hidden xs:inline text-xs font-bold">Bag</span>
          <span id="cartBadgeCount" class="bg-amber-500 text-stone-950 font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-md shadow-amber-500/30">0</span>
        </button>
      </div>
    </div>
  </header>

  <!-- MAIN CONTENT CONTAINER -->
  <main class="flex-1 w-full flex flex-col">
    
    <!-- HERO SECTION (#hero) -->
    <section id="hero" class="relative pt-12 pb-20 md:py-28 overflow-hidden bg-gradient-to-b from-stone-950 via-[#0c0a09] to-stone-900/60">
      <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <!-- LEFT HERO CONTENT -->
          <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <i data-lucide="award" class="w-4 h-4 text-amber-400"></i>
              <span>#1 Gourmet Delivery Network • 12+ Specialty Cuisines • 4.9 ★★★★★</span>
            </div>

            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-white leading-[1.15] tracking-tight">
              Artisanal <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-200">Gourmet Cuisines</span> & Master Restaurants, delivered hot.
            </h1>

            <p class="text-base sm:text-lg text-stone-400 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Explore authentic Indian curries, royal Hyderabadi biryani, wood-fired pizzas, Wagyu smash burgers, South & North Indian feasts, Dim Sum, decadent bakeries & artisanal street food.
            </p>

            <!-- DELIVERY ADDRESS INPUT BAR -->
            <div class="bg-stone-900/90 border border-stone-800 p-2 sm:p-2.5 rounded-2xl shadow-2xl max-w-xl mx-auto lg:mx-0 backdrop-blur-md">
              <form onsubmit="event.preventDefault(); handleAddressSubmit()" class="flex flex-col sm:flex-row gap-2">
                <div class="relative flex-1 flex items-center">
                  <i data-lucide="map-pin" class="w-5 h-5 text-amber-500 absolute left-3.5 pointer-events-none"></i>
                  <input id="heroAddressInput" type="text" placeholder="Enter your delivery address..." required class="w-full pl-11 pr-4 py-3 bg-stone-950/80 border border-stone-800 rounded-xl text-xs sm:text-sm font-medium text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition">
                </div>
                <button type="submit" class="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 shrink-0 cursor-pointer">
                  <span>Explore Food</span>
                  <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </button>
              </form>
            </div>

            <!-- METRICS & SOCIAL PROOF -->
            <div class="pt-4 grid grid-cols-3 gap-4 border-t border-stone-800/80 max-w-xl mx-auto lg:mx-0 text-left">
              <div>
                <p class="text-2xl font-extrabold text-white font-serif">12+ Cuisines</p>
                <p class="text-xs text-stone-400 font-medium">Authentic Varieties</p>
              </div>
              <div>
                <p class="text-2xl font-extrabold text-white font-serif">28 Mins</p>
                <p class="text-xs text-stone-400 font-medium">Avg Express Delivery</p>
              </div>
              <div>
                <p class="text-2xl font-extrabold text-white font-serif">100% Fresh</p>
                <p class="text-xs text-stone-400 font-medium">Organic & Artisanal</p>
              </div>
            </div>
          </div>

          <!-- RIGHT HERO VISUAL -->
          <div class="lg:col-span-5 relative">
            <div class="relative mx-auto max-w-md lg:max-w-none">
              <!-- AMBIENT GLOW -->
              <div class="absolute -inset-4 bg-gradient-to-tr from-amber-500/20 to-amber-600/10 rounded-3xl blur-2xl"></div>
              
              <div class="relative rounded-3xl overflow-hidden border border-stone-800 bg-stone-900 shadow-2xl group">
                <img src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1000&auto=format&fit=crop&q=80" alt="Royal Biryani & Feast" class="w-full h-[440px] object-cover group-hover:scale-105 transition duration-700">
                <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent"></div>
                
                <!-- FLOATING BADGE -->
                <div class="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-stone-950/95 border border-stone-800/90 backdrop-blur-md flex items-center justify-between shadow-2xl">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                      <i data-lucide="flame" class="w-5 h-5"></i>
                    </div>
                    <div>
                      <p class="text-xs font-bold text-white">Royal Dum Biryani House</p>
                      <p class="text-[11px] text-amber-400 font-semibold">Hyderabadi Dum Gosht Biryani • $24.00</p>
                    </div>
                  </div>
                  <button type="button" onclick="quickAdd('biryani-1')" class="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition cursor-pointer shadow-md">
                    + Add to Bag
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ==================== 12 RESTAURANT CUISINES SHOWCASE (#restaurants) ==================== -->
    <section id="restaurants" class="py-20 bg-stone-950 border-t border-stone-800/80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <span class="text-xs font-bold uppercase tracking-widest text-amber-500">Master Kitchens & Cuisines</span>
            <h2 class="text-3xl sm:text-4xl font-serif font-extrabold text-white mt-1">Featured Restaurants by Cuisine</h2>
            <p class="text-stone-400 text-xs sm:text-sm mt-2 max-w-2xl">
              Curated artisanal kitchens delivering the finest specialties across 12 distinct flavor profiles.
            </p>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
              12 Handpicked Concepts
            </span>
          </div>
        </div>

        <!-- RESTAURANT CARDS GRID (12 VARIETIES) -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <!-- 1. INDIAN -->
          <div class="group rounded-3xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl hover:-translate-y-1">
            <div>
              <div class="relative h-52 w-full overflow-hidden">
                <img src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80" alt="The Saffron Heritage" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent"></div>
                <span class="absolute top-3 left-3 px-3 py-1 rounded-full bg-stone-950/90 border border-amber-500/40 text-amber-400 font-extrabold text-[10px] uppercase tracking-wider backdrop-blur-md">
                  🍛 Indian Heritage
                </span>
                <span class="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 font-bold text-[10px]">
                  25-35 min
                </span>
              </div>
              <div class="p-6 space-y-3">
                <div class="flex items-center justify-between">
                  <h3 class="font-serif font-extrabold text-xl text-white group-hover:text-amber-400 transition">The Saffron Heritage</h3>
                  <span class="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                    ★ 4.9 <span class="text-stone-400 font-normal">(1.4k)</span>
                  </span>
                </div>
                <p class="text-xs text-stone-400 leading-relaxed">
                  Celebrated Indian fine dining specializing in velvet Butter Chicken, slow-cooked Rogan Josh, and royal tandoor platters.
                </p>
                <div class="flex flex-wrap gap-1.5 pt-1">
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Butter Chicken</span>
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Paneer Tikka</span>
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Garlic Naan</span>
                </div>
              </div>
            </div>
            <div class="p-6 pt-0">
              <button type="button" onclick="filterCategory('indian')" class="w-full py-2.5 rounded-xl bg-stone-950 hover:bg-amber-500 hover:text-stone-950 border border-stone-800 hover:border-transparent text-amber-400 font-extrabold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-md">
                <span>Explore Indian Dishes</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>

          <!-- 2. PIZZA -->
          <div class="group rounded-3xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl hover:-translate-y-1">
            <div>
              <div class="relative h-52 w-full overflow-hidden">
                <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80" alt="Napoli Stone Woodfired" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent"></div>
                <span class="absolute top-3 left-3 px-3 py-1 rounded-full bg-stone-950/90 border border-amber-500/40 text-amber-400 font-extrabold text-[10px] uppercase tracking-wider backdrop-blur-md">
                  🍕 Pizza Artisan
                </span>
                <span class="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 font-bold text-[10px]">
                  20-30 min
                </span>
              </div>
              <div class="p-6 space-y-3">
                <div class="flex items-center justify-between">
                  <h3 class="font-serif font-extrabold text-xl text-white group-hover:text-amber-400 transition">Napoli & Stone Oven Co.</h3>
                  <span class="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                    ★ 4.9 <span class="text-stone-400 font-normal">(2.1k)</span>
                  </span>
                </div>
                <p class="text-xs text-stone-400 leading-relaxed">
                  Authentic Neapolitan wood-fired pizzas with 48-hour fermented dough, San Marzano D.O.P. tomatoes, and fresh buffalo mozzarella.
                </p>
                <div class="flex flex-wrap gap-1.5 pt-1">
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Margherita D.O.P.</span>
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Truffle Funghi</span>
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Diavola</span>
                </div>
              </div>
            </div>
            <div class="p-6 pt-0">
              <button type="button" onclick="filterCategory('pizza')" class="w-full py-2.5 rounded-xl bg-stone-950 hover:bg-amber-500 hover:text-stone-950 border border-stone-800 hover:border-transparent text-amber-400 font-extrabold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-md">
                <span>Explore Wood-Fired Pizzas</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>

          <!-- 3. BURGERS -->
          <div class="group rounded-3xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl hover:-translate-y-1">
            <div>
              <div class="relative h-52 w-full overflow-hidden">
                <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80" alt="Iron Grill Wagyu Lab" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent"></div>
                <span class="absolute top-3 left-3 px-3 py-1 rounded-full bg-stone-950/90 border border-amber-500/40 text-amber-400 font-extrabold text-[10px] uppercase tracking-wider backdrop-blur-md">
                  🍔 Gourmet Burgers
                </span>
                <span class="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 font-bold text-[10px]">
                  20-28 min
                </span>
              </div>
              <div class="p-6 space-y-3">
                <div class="flex items-center justify-between">
                  <h3 class="font-serif font-extrabold text-xl text-white group-hover:text-amber-400 transition">SmashLab Wagyu Burgers</h3>
                  <span class="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                    ★ 4.8 <span class="text-stone-400 font-normal">(1.8k)</span>
                  </span>
                </div>
                <p class="text-xs text-stone-400 leading-relaxed">
                  Double A5 Wagyu smashed patties, aged Vermont cheddar, caramelized shallots, and house black truffle aioli on brioche.
                </p>
                <div class="flex flex-wrap gap-1.5 pt-1">
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Double Wagyu</span>
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Truffle Smash</span>
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Nashville Hot</span>
                </div>
              </div>
            </div>
            <div class="p-6 pt-0">
              <button type="button" onclick="filterCategory('burgers')" class="w-full py-2.5 rounded-xl bg-stone-950 hover:bg-amber-500 hover:text-stone-950 border border-stone-800 hover:border-transparent text-amber-400 font-extrabold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-md">
                <span>Explore Wagyu Burgers</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>

          <!-- 4. BIRYANI -->
          <div class="group rounded-3xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl hover:-translate-y-1">
            <div>
              <div class="relative h-52 w-full overflow-hidden">
                <img src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80" alt="Royal Dum Biryani" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent"></div>
                <span class="absolute top-3 left-3 px-3 py-1 rounded-full bg-stone-950/90 border border-amber-500/40 text-amber-400 font-extrabold text-[10px] uppercase tracking-wider backdrop-blur-md">
                  🍚 Royal Biryani
                </span>
                <span class="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 font-bold text-[10px]">
                  30-40 min
                </span>
              </div>
              <div class="p-6 space-y-3">
                <div class="flex items-center justify-between">
                  <h3 class="font-serif font-extrabold text-xl text-white group-hover:text-amber-400 transition">Nizami Dastarkhwan Biryani</h3>
                  <span class="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                    ★ 5.0 <span class="text-stone-400 font-normal">(3.2k)</span>
                  </span>
                </div>
                <p class="text-xs text-stone-400 leading-relaxed">
                  Slow-cooked earthen handi dum biryani, aged long-grain basmati, Kashmiri saffron, and tender marinated lamb & chicken.
                </p>
                <div class="flex flex-wrap gap-1.5 pt-1">
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Hyderabadi Dum</span>
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Awadhi Dum</span>
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Mirchi Ka Salan</span>
                </div>
              </div>
            </div>
            <div class="p-6 pt-0">
              <button type="button" onclick="filterCategory('biryani')" class="w-full py-2.5 rounded-xl bg-stone-950 hover:bg-amber-500 hover:text-stone-950 border border-stone-800 hover:border-transparent text-amber-400 font-extrabold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-md">
                <span>Explore Royal Biryani</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>

          <!-- 5. CHINESE -->
          <div class="group rounded-3xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl hover:-translate-y-1">
            <div>
              <div class="relative h-52 w-full overflow-hidden">
                <img src="https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop&q=80" alt="Golden Wok Dragon" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent"></div>
                <span class="absolute top-3 left-3 px-3 py-1 rounded-full bg-stone-950/90 border border-amber-500/40 text-amber-400 font-extrabold text-[10px] uppercase tracking-wider backdrop-blur-md">
                  🥢 Chinese & Wok
                </span>
                <span class="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 font-bold text-[10px]">
                  22-30 min
                </span>
              </div>
              <div class="p-6 space-y-3">
                <div class="flex items-center justify-between">
                  <h3 class="font-serif font-extrabold text-xl text-white group-hover:text-amber-400 transition">Golden Wok & Dim Sum</h3>
                  <span class="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                    ★ 4.8 <span class="text-stone-400 font-normal">(1.6k)</span>
                  </span>
                </div>
                <p class="text-xs text-stone-400 leading-relaxed">
                  Master wok creations, handmade Cantonese crystal dim sums, spicy Sichuan noodles, and crispy Peking honey duck.
                </p>
                <div class="flex flex-wrap gap-1.5 pt-1">
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Truffle Dim Sum</span>
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Szechuan Noodles</span>
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Kung Pao</span>
                </div>
              </div>
            </div>
            <div class="p-6 pt-0">
              <button type="button" onclick="filterCategory('chinese')" class="w-full py-2.5 rounded-xl bg-stone-950 hover:bg-amber-500 hover:text-stone-950 border border-stone-800 hover:border-transparent text-amber-400 font-extrabold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-md">
                <span>Explore Chinese Delicacies</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>

          <!-- 6. SOUTH INDIAN -->
          <div class="group rounded-3xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl hover:-translate-y-1">
            <div>
              <div class="relative h-52 w-full overflow-hidden">
                <img src="https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80" alt="Malabar & Madras Dosa" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent"></div>
                <span class="absolute top-3 left-3 px-3 py-1 rounded-full bg-stone-950/90 border border-amber-500/40 text-amber-400 font-extrabold text-[10px] uppercase tracking-wider backdrop-blur-md">
                  🥥 South Indian
                </span>
                <span class="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 font-bold text-[10px]">
                  20-30 min
                </span>
              </div>
              <div class="p-6 space-y-3">
                <div class="flex items-center justify-between">
                  <h3 class="font-serif font-extrabold text-xl text-white group-hover:text-amber-400 transition">Dakshin & Malabar Tiffin</h3>
                  <span class="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                    ★ 4.9 <span class="text-stone-400 font-normal">(2.4k)</span>
                  </span>
                </div>
                <p class="text-xs text-stone-400 leading-relaxed">
                  Golden crispy Ghee Roast Dosas, steamed fluffy idlis, drumstick sambar, and coconut-infused Malabar curries.
                </p>
                <div class="flex flex-wrap gap-1.5 pt-1">
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Ghee Roast Dosa</span>
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Medu Vada</span>
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Malabar Parotta</span>
                </div>
              </div>
            </div>
            <div class="p-6 pt-0">
              <button type="button" onclick="filterCategory('south-indian')" class="w-full py-2.5 rounded-xl bg-stone-950 hover:bg-amber-500 hover:text-stone-950 border border-stone-800 hover:border-transparent text-amber-400 font-extrabold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-md">
                <span>Explore South Indian Tiffins</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>

          <!-- 7. NORTH INDIAN -->
          <div class="group rounded-3xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl hover:-translate-y-1">
            <div>
              <div class="relative h-52 w-full overflow-hidden">
                <img src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80" alt="Punjab Heritage Dhaba" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent"></div>
                <span class="absolute top-3 left-3 px-3 py-1 rounded-full bg-stone-950/90 border border-amber-500/40 text-amber-400 font-extrabold text-[10px] uppercase tracking-wider backdrop-blur-md">
                  🫓 North Indian Dhaba
                </span>
                <span class="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 font-bold text-[10px]">
                  25-35 min
                </span>
              </div>
              <div class="p-6 space-y-3">
                <div class="flex items-center justify-between">
                  <h3 class="font-serif font-extrabold text-xl text-white group-hover:text-amber-400 transition">Punjab Dhaba & Tandoor</h3>
                  <span class="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                    ★ 4.9 <span class="text-stone-400 font-normal">(2.8k)</span>
                  </span>
                </div>
                <p class="text-xs text-stone-400 leading-relaxed">
                  Authentic charcoal-simmered 24-hour Dal Makhani, Amritsari crispy stuffed kulchas, and rich shahi paneer gravies.
                </p>
                <div class="flex flex-wrap gap-1.5 pt-1">
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">24h Dal Makhani</span>
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Amritsari Kulcha</span>
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Tandoori Platter</span>
                </div>
              </div>
            </div>
            <div class="p-6 pt-0">
              <button type="button" onclick="filterCategory('north-indian')" class="w-full py-2.5 rounded-xl bg-stone-950 hover:bg-amber-500 hover:text-stone-950 border border-stone-800 hover:border-transparent text-amber-400 font-extrabold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-md">
                <span>Explore North Indian Feasts</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>

          <!-- 8. DESSERTS -->
          <div class="group rounded-3xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl hover:-translate-y-1">
            <div>
              <div class="relative h-52 w-full overflow-hidden">
                <img src="https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop&q=80" alt="Dolce Velvet Desserts" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent"></div>
                <span class="absolute top-3 left-3 px-3 py-1 rounded-full bg-stone-950/90 border border-amber-500/40 text-amber-400 font-extrabold text-[10px] uppercase tracking-wider backdrop-blur-md">
                  🍰 Artisan Desserts
                </span>
                <span class="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 font-bold text-[10px]">
                  15-25 min
                </span>
              </div>
              <div class="p-6 space-y-3">
                <div class="flex items-center justify-between">
                  <h3 class="font-serif font-extrabold text-xl text-white group-hover:text-amber-400 transition">Dolce & Velvet Patisserie</h3>
                  <span class="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                    ★ 4.9 <span class="text-stone-400 font-normal">(1.9k)</span>
                  </span>
                </div>
                <p class="text-xs text-stone-400 leading-relaxed">
                  Decadent Italian Tiramisu, warm Molten Valrhona Lava cakes, and artisan Saffron Gulab Jamun cheesecake slices.
                </p>
                <div class="flex flex-wrap gap-1.5 pt-1">
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Classic Tiramisu</span>
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Gulab Jamun Cake</span>
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Choco Lava</span>
                </div>
              </div>
            </div>
            <div class="p-6 pt-0">
              <button type="button" onclick="filterCategory('desserts')" class="w-full py-2.5 rounded-xl bg-stone-950 hover:bg-amber-500 hover:text-stone-950 border border-stone-800 hover:border-transparent text-amber-400 font-extrabold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-md">
                <span>Explore Artisan Desserts</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>

          <!-- 9. BAKERY -->
          <div class="group rounded-3xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl hover:-translate-y-1">
            <div>
              <div class="relative h-52 w-full overflow-hidden">
                <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80" alt="French Flour Bakery" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent"></div>
                <span class="absolute top-3 left-3 px-3 py-1 rounded-full bg-stone-950/90 border border-amber-500/40 text-amber-400 font-extrabold text-[10px] uppercase tracking-wider backdrop-blur-md">
                  🥐 Fresh Bakery
                </span>
                <span class="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 font-bold text-[10px]">
                  20-30 min
                </span>
              </div>
              <div class="p-6 space-y-3">
                <div class="flex items-center justify-between">
                  <h3 class="font-serif font-extrabold text-xl text-white group-hover:text-amber-400 transition">The French Flour Boulangerie</h3>
                  <span class="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                    ★ 4.9 <span class="text-stone-400 font-normal">(1.1k)</span>
                  </span>
                </div>
                <p class="text-xs text-stone-400 leading-relaxed">
                  Laminated butter croissants, pain au chocolat, sourdough batards, and cinnamon brioche baked fresh every dawn.
                </p>
                <div class="flex flex-wrap gap-1.5 pt-1">
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Butter Croissant</span>
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Pain au Chocolat</span>
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Sourdough Loaf</span>
                </div>
              </div>
            </div>
            <div class="p-6 pt-0">
              <button type="button" onclick="filterCategory('bakery')" class="w-full py-2.5 rounded-xl bg-stone-950 hover:bg-amber-500 hover:text-stone-950 border border-stone-800 hover:border-transparent text-amber-400 font-extrabold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-md">
                <span>Explore Fresh Bakes</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>

          <!-- 10. HEALTHY FOOD -->
          <div class="group rounded-3xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl hover:-translate-y-1">
            <div>
              <div class="relative h-52 w-full overflow-hidden">
                <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80" alt="Green Vitality Bowls" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent"></div>
                <span class="absolute top-3 left-3 px-3 py-1 rounded-full bg-stone-950/90 border border-amber-500/40 text-amber-400 font-extrabold text-[10px] uppercase tracking-wider backdrop-blur-md">
                  🥗 Healthy & Bowls
                </span>
                <span class="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 font-bold text-[10px]">
                  20-25 min
                </span>
              </div>
              <div class="p-6 space-y-3">
                <div class="flex items-center justify-between">
                  <h3 class="font-serif font-extrabold text-xl text-white group-hover:text-amber-400 transition">Green Vitality Superfoods</h3>
                  <span class="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                    ★ 4.8 <span class="text-stone-400 font-normal">(1.3k)</span>
                  </span>
                </div>
                <p class="text-xs text-stone-400 leading-relaxed">
                  Organic sashimi-grade salmon poké, warm quinoa Mediterranean harvest bowls, and macro-balanced keto salads.
                </p>
                <div class="flex flex-wrap gap-1.5 pt-1">
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Salmon Poké</span>
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Quinoa Bowl</span>
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Avocado Salad</span>
                </div>
              </div>
            </div>
            <div class="p-6 pt-0">
              <button type="button" onclick="filterCategory('healthy')" class="w-full py-2.5 rounded-xl bg-stone-950 hover:bg-amber-500 hover:text-stone-950 border border-stone-800 hover:border-transparent text-amber-400 font-extrabold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-md">
                <span>Explore Healthy Bowls</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>

          <!-- 11. DRINKS -->
          <div class="group rounded-3xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl hover:-translate-y-1">
            <div>
              <div class="relative h-52 w-full overflow-hidden">
                <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&auto=format&fit=crop&q=80" alt="Botanical Brews" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent"></div>
                <span class="absolute top-3 left-3 px-3 py-1 rounded-full bg-stone-950/90 border border-amber-500/40 text-amber-400 font-extrabold text-[10px] uppercase tracking-wider backdrop-blur-md">
                  🍹 Craft Drinks
                </span>
                <span class="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 font-bold text-[10px]">
                  15-20 min
                </span>
              </div>
              <div class="p-6 space-y-3">
                <div class="flex items-center justify-between">
                  <h3 class="font-serif font-extrabold text-xl text-white group-hover:text-amber-400 transition">Elixir Craft Shakes & Brews</h3>
                  <span class="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                    ★ 4.9 <span class="text-stone-400 font-normal">(950)</span>
                  </span>
                </div>
                <p class="text-xs text-stone-400 leading-relaxed">
                  Rich Alphonso mango kesar lassis, single-origin nitro cold brews, royal masala chai, and botanical mocktails.
                </p>
                <div class="flex flex-wrap gap-1.5 pt-1">
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Mango Lassi</span>
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Nitro Cold Brew</span>
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Masala Chai</span>
                </div>
              </div>
            </div>
            <div class="p-6 pt-0">
              <button type="button" onclick="filterCategory('drinks')" class="w-full py-2.5 rounded-xl bg-stone-950 hover:bg-amber-500 hover:text-stone-950 border border-stone-800 hover:border-transparent text-amber-400 font-extrabold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-md">
                <span>Explore Craft Drinks</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>

          <!-- 12. STREET FOOD -->
          <div class="group rounded-3xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl hover:-translate-y-1">
            <div>
              <div class="relative h-52 w-full overflow-hidden">
                <img src="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80" alt="Mumbai Street Chaat" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent"></div>
                <span class="absolute top-3 left-3 px-3 py-1 rounded-full bg-stone-950/90 border border-amber-500/40 text-amber-400 font-extrabold text-[10px] uppercase tracking-wider backdrop-blur-md">
                  🌮 Street Food
                </span>
                <span class="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 font-bold text-[10px]">
                  15-25 min
                </span>
              </div>
              <div class="p-6 space-y-3">
                <div class="flex items-center justify-between">
                  <h3 class="font-serif font-extrabold text-xl text-white group-hover:text-amber-400 transition">Old Chowk Chaat & Rolls</h3>
                  <span class="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                    ★ 5.0 <span class="text-stone-400 font-normal">(4.1k)</span>
                  </span>
                </div>
                <p class="text-xs text-stone-400 leading-relaxed">
                  Crispy 6-flavor pani puri shots, rich buttery Mumbai Pav Bhaji, and flaky Kolkata Kathi rolls wrapped hot.
                </p>
                <div class="flex flex-wrap gap-1.5 pt-1">
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Pani Puri Shots</span>
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Mumbai Pav Bhaji</span>
                  <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] border border-stone-800">Kathi Roll</span>
                </div>
              </div>
            </div>
            <div class="p-6 pt-0">
              <button type="button" onclick="filterCategory('street-food')" class="w-full py-2.5 rounded-xl bg-stone-950 hover:bg-amber-500 hover:text-stone-950 border border-stone-800 hover:border-transparent text-amber-400 font-extrabold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-md">
                <span>Explore Street Food</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- ==================== 12 CUISINES INTERACTIVE SELECTOR STRIP (#categories) ==================== -->
    <section id="categories" class="py-14 bg-stone-950 border-y border-stone-800/80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <span class="text-xs font-bold uppercase tracking-widest text-amber-500">Interactive Cuisine Filters</span>
            <h2 class="text-2xl sm:text-3xl font-serif font-extrabold text-white mt-1">Explore 12 Iconic Cuisines</h2>
          </div>
          <span class="text-xs text-stone-400 hidden sm:inline">Click any cuisine to instantly filter gourmet dishes</span>
        </div>

        <!-- 12-PILL INTERACTIVE HORIZONTAL / GRID SELECTOR -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          
          <button type="button" data-cat="all" onclick="filterCategory('all')" class="cat-pill active group p-3.5 rounded-2xl bg-stone-900 border border-amber-500/50 hover:border-amber-500 text-center transition flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-md">
            <span class="text-2xl group-hover:scale-110 transition-transform">✨</span>
            <span class="text-xs font-bold text-white">All Menu</span>
            <span class="text-[10px] text-amber-400 font-semibold">36 Dishes</span>
          </button>

          <button type="button" data-cat="indian" onclick="filterCategory('indian')" class="cat-pill group p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/50 text-center transition flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-sm">
            <span class="text-2xl group-hover:scale-110 transition-transform">🍛</span>
            <span class="text-xs font-bold text-white">Indian</span>
            <span class="text-[10px] text-stone-400 font-medium">Curries & Tandoor</span>
          </button>

          <button type="button" data-cat="pizza" onclick="filterCategory('pizza')" class="cat-pill group p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/50 text-center transition flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-sm">
            <span class="text-2xl group-hover:scale-110 transition-transform">🍕</span>
            <span class="text-xs font-bold text-white">Pizza</span>
            <span class="text-[10px] text-stone-400 font-medium">Wood-Fired D.O.P.</span>
          </button>

          <button type="button" data-cat="burgers" onclick="filterCategory('burgers')" class="cat-pill group p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/50 text-center transition flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-sm">
            <span class="text-2xl group-hover:scale-110 transition-transform">🍔</span>
            <span class="text-xs font-bold text-white">Burgers</span>
            <span class="text-[10px] text-stone-400 font-medium">A5 Wagyu Smash</span>
          </button>

          <button type="button" data-cat="biryani" onclick="filterCategory('biryani')" class="cat-pill group p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/50 text-center transition flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-sm">
            <span class="text-2xl group-hover:scale-110 transition-transform">🍚</span>
            <span class="text-xs font-bold text-white">Biryani</span>
            <span class="text-[10px] text-stone-400 font-medium">Handi Dum Sealed</span>
          </button>

          <button type="button" data-cat="chinese" onclick="filterCategory('chinese')" class="cat-pill group p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/50 text-center transition flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-sm">
            <span class="text-2xl group-hover:scale-110 transition-transform">🥢</span>
            <span class="text-xs font-bold text-white">Chinese</span>
            <span class="text-[10px] text-stone-400 font-medium">Dim Sum & Wok</span>
          </button>

          <button type="button" data-cat="south-indian" onclick="filterCategory('south-indian')" class="cat-pill group p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/50 text-center transition flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-sm">
            <span class="text-2xl group-hover:scale-110 transition-transform">🥥</span>
            <span class="text-xs font-bold text-white">South Indian</span>
            <span class="text-[10px] text-stone-400 font-medium">Ghee Dosa & Tiffin</span>
          </button>

          <button type="button" data-cat="north-indian" onclick="filterCategory('north-indian')" class="cat-pill group p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/50 text-center transition flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-sm">
            <span class="text-2xl group-hover:scale-110 transition-transform">🫓</span>
            <span class="text-xs font-bold text-white">North Indian</span>
            <span class="text-[10px] text-stone-400 font-medium">Dhaba & Kulchas</span>
          </button>

          <button type="button" data-cat="desserts" onclick="filterCategory('desserts')" class="cat-pill group p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/50 text-center transition flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-sm">
            <span class="text-2xl group-hover:scale-110 transition-transform">🍰</span>
            <span class="text-xs font-bold text-white">Desserts</span>
            <span class="text-[10px] text-stone-400 font-medium">Pastries & Cakes</span>
          </button>

          <button type="button" data-cat="bakery" onclick="filterCategory('bakery')" class="cat-pill group p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/50 text-center transition flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-sm">
            <span class="text-2xl group-hover:scale-110 transition-transform">🥐</span>
            <span class="text-xs font-bold text-white">Bakery</span>
            <span class="text-[10px] text-stone-400 font-medium">Croissants & Breads</span>
          </button>

          <button type="button" data-cat="healthy" onclick="filterCategory('healthy')" class="cat-pill group p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/50 text-center transition flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-sm">
            <span class="text-2xl group-hover:scale-110 transition-transform">🥗</span>
            <span class="text-xs font-bold text-white">Healthy Food</span>
            <span class="text-[10px] text-stone-400 font-medium">Poké & Quinoa</span>
          </button>

          <button type="button" data-cat="drinks" onclick="filterCategory('drinks')" class="cat-pill group p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/50 text-center transition flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-sm">
            <span class="text-2xl group-hover:scale-110 transition-transform">🍹</span>
            <span class="text-xs font-bold text-white">Drinks</span>
            <span class="text-[10px] text-stone-400 font-medium">Lassi & Cold Brew</span>
          </button>

          <button type="button" data-cat="street-food" onclick="filterCategory('street-food')" class="cat-pill group p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/50 text-center transition flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-sm">
            <span class="text-2xl group-hover:scale-110 transition-transform">🌮</span>
            <span class="text-xs font-bold text-white">Street Food</span>
            <span class="text-[10px] text-stone-400 font-medium">Pani Puri & Chaat</span>
          </button>

        </div>
      </div>
    </section>

    <!-- ==================== INTERACTIVE FOOD MENU CATALOG (#menu) ==================== -->
    <section id="menu" class="py-20 bg-[#0c0a09]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div class="flex items-center gap-2">
              <span id="activeCuisineBadge" class="text-xs font-bold uppercase tracking-widest text-amber-500">All 12 Cuisines</span>
              <span class="text-stone-600">•</span>
              <span id="dishCountBadge" class="text-xs font-semibold text-stone-400">36 Gourmet Dishes</span>
            </div>
            <h2 id="menuHeading" class="text-3xl sm:text-4xl font-serif font-extrabold text-white mt-1">Curated Gourmet Menu</h2>
          </div>

          <!-- SEARCH & LIVE FILTER BAR -->
          <div class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div class="relative w-full sm:w-80">
              <i data-lucide="search" class="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"></i>
              <input type="text" id="menuSearchInput" oninput="handleSearch(this.value)" placeholder="Search biryani, dosa, pizza, butter chicken..." class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs font-medium text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition">
            </div>
          </div>
        </div>

        <!-- DISH GRID CONTAINER (DYNAMIC RENDERED) -->
        <div id="menuGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Dynamically filled by JavaScript -->
        </div>

      </div>
    </section>

    <!-- HOW IT WORKS & TIMELINE (#how-it-works) -->
    <section id="how-it-works" class="py-20 bg-stone-950 border-t border-stone-800/80 relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <span class="text-xs font-bold uppercase tracking-widest text-amber-500">Seamless Luxury</span>
          <h2 class="text-3xl sm:text-4xl font-serif font-extrabold text-white mt-1">How FeastDash Works</h2>
          <p class="text-stone-400 text-xs sm:text-sm mt-2">From artisanal master kitchens to your dining table in four seamless steps.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          
          <!-- STEP 1 -->
          <div class="p-6 rounded-3xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/40 transition text-center space-y-4">
            <div class="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mx-auto flex items-center justify-center font-black text-xl">
              1
            </div>
            <h3 class="font-serif font-bold text-lg text-white">Pick Your Cuisine</h3>
            <p class="text-xs text-stone-400 leading-relaxed">Choose from 12 distinct culinary traditions or browse our all-encompassing menu.</p>
          </div>

          <!-- STEP 2 -->
          <div class="p-6 rounded-3xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/40 transition text-center space-y-4">
            <div class="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mx-auto flex items-center justify-center font-black text-xl">
              2
            </div>
            <h3 class="font-serif font-bold text-lg text-white">Chef Crafted Fresh</h3>
            <p class="text-xs text-stone-400 leading-relaxed">Master culinary artisans handcraft each dish using authentic heritage spices & organic produce.</p>
          </div>

          <!-- STEP 3 -->
          <div class="p-6 rounded-3xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/40 transition text-center space-y-4">
            <div class="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mx-auto flex items-center justify-center font-black text-xl">
              3
            </div>
            <h3 class="font-serif font-bold text-lg text-white">Thermal Dispatch</h3>
            <p class="text-xs text-stone-400 leading-relaxed">Insulated climate-controlled containers guarantee piping hot or chilled perfection.</p>
          </div>

          <!-- STEP 4 -->
          <div class="p-6 rounded-3xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/40 transition text-center space-y-4">
            <div class="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mx-auto flex items-center justify-center font-black text-xl">
              4
            </div>
            <h3 class="font-serif font-bold text-lg text-white">Savor & Indulge</h3>
            <p class="text-xs text-stone-400 leading-relaxed">Experience unforgettable restaurant-grade gastronomy in the comfort of your home.</p>
          </div>

        </div>
      </div>
    </section>

    <!-- LIVE ORDER TRACKER WIDGET (#tracking) -->
    <section id="tracking" class="py-20 bg-[#0c0a09] border-t border-stone-800/80">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="p-8 rounded-3xl bg-stone-900/80 border border-stone-800 backdrop-blur-xl shadow-2xl space-y-8">
          
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
            <div>
              <span class="text-xs font-bold text-amber-500 uppercase tracking-widest">Real-Time Fulfillment</span>
              <h2 class="text-2xl font-serif font-extrabold text-white mt-0.5">Live Order Tracker</h2>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
              <span class="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">System Active</span>
            </div>
          </div>

          <!-- SEARCH ORDER FORM -->
          <form onsubmit="event.preventDefault(); simulateOrderTracking()" class="flex flex-col sm:flex-row gap-3">
            <div class="relative flex-1">
              <i data-lucide="hash" class="w-4 h-4 text-amber-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"></i>
              <input id="trackingCodeInput" type="text" value="FD-8942" placeholder="Enter Order ID (e.g. FD-8942)..." class="w-full pl-10 pr-4 py-3 bg-stone-950 border border-stone-800 rounded-xl text-xs font-mono font-medium text-white focus:outline-none focus:border-amber-500 transition">
            </div>
            <button type="submit" class="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-md">
              <i data-lucide="search" class="w-4 h-4"></i>
              <span>Track Progress</span>
            </button>
          </form>

          <!-- TRACKING STAGE TIMELINE -->
          <div id="trackingTimeline" class="pt-4 space-y-6" style="display: none;">
            <div class="flex items-center justify-between text-xs font-bold text-stone-400 mb-2">
              <span>Order Code: <span id="displayOrderCode" class="text-amber-400 font-mono">#FD-8942</span></span>
              <span>Estimated Arrival: <span class="text-white font-extrabold">22 mins</span></span>
            </div>

            <!-- TIMELINE PROGRESS BAR -->
            <div class="w-full bg-stone-950 h-3 rounded-full overflow-hidden p-0.5 border border-stone-800">
              <div id="progressBar" class="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-700 w-3/4"></div>
            </div>

            <!-- STEPS GRID -->
            <div class="grid grid-cols-4 gap-2 text-center text-[11px] font-bold">
              <div class="text-amber-400 flex flex-col items-center gap-1">
                <i data-lucide="check-circle-2" class="w-4 h-4"></i>
                <span>Confirmed</span>
              </div>
              <div class="text-amber-400 flex flex-col items-center gap-1">
                <i data-lucide="chef-hat" class="w-4 h-4"></i>
                <span>Preparing</span>
              </div>
              <div class="text-amber-400 flex flex-col items-center gap-1">
                <i data-lucide="bike" class="w-4 h-4"></i>
                <span>On The Way</span>
              </div>
              <div class="text-stone-500 flex flex-col items-center gap-1">
                <i data-lucide="home" class="w-4 h-4"></i>
                <span>Delivered</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- CUSTOMER REVIEWS & TESTIMONIALS (#reviews) -->
    <section id="reviews" class="py-20 bg-stone-950 border-t border-stone-800/80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span class="text-xs font-bold uppercase tracking-widest text-amber-500">Verified Diners</span>
            <h2 class="text-3xl sm:text-4xl font-serif font-extrabold text-white mt-1">What Food Lovers Say</h2>
          </div>
          <button type="button" onclick="openModal('reviewModal')" class="px-5 py-2.5 rounded-xl bg-stone-900 border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-stone-950 font-extrabold text-xs uppercase tracking-wider transition flex items-center gap-2 self-start md:self-auto cursor-pointer">
            <i data-lucide="message-square-plus" class="w-4 h-4"></i>
            <span>Share Feedback</span>
          </button>
        </div>

        <div id="reviewsContainer" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Rendered dynamically -->
        </div>

      </div>
    </section>

    <!-- CONTACT & CONCIERGE (#contact) -->
    <section id="contact" class="py-20 bg-[#0c0a09] border-t border-stone-800/80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div class="lg:col-span-5 space-y-6">
            <span class="text-xs font-bold uppercase tracking-widest text-amber-500">24/7 Dining Concierge</span>
            <h2 class="text-3xl sm:text-4xl font-serif font-extrabold text-white">We're Here for Any Culinary Request</h2>
            <p class="text-xs sm:text-sm text-stone-400 leading-relaxed">
              Whether you're organizing a grand corporate banquet, a family celebration, or have customized dietary requirements, our dedicated concierge team is at your service.
            </p>

            <div class="space-y-4 pt-2 text-xs">
              <div class="flex items-center gap-3 p-4 rounded-2xl bg-stone-900/60 border border-stone-800">
                <i data-lucide="mail" class="w-5 h-5 text-amber-500 shrink-0"></i>
                <div>
                  <p class="font-bold text-white">Email Concierge</p>
                  <p class="text-stone-400">concierge@feastdash.com</p>
                </div>
              </div>
              <div class="flex items-center gap-3 p-4 rounded-2xl bg-stone-900/60 border border-stone-800">
                <i data-lucide="phone" class="w-5 h-5 text-amber-500 shrink-0"></i>
                <div>
                  <p class="font-bold text-white">VIP Direct Line</p>
                  <p class="text-stone-400">+1 (800) 555-FEAST (3327)</p>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-7">
            <div class="p-8 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-2xl space-y-6">
              <h3 class="font-serif font-bold text-xl text-white">Send Direct Message</h3>
              
              <form onsubmit="event.preventDefault(); submitContactForm(event)" class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label class="block text-xs font-bold text-stone-300">Your Full Name</label>
                    <input type="text" name="name" required placeholder="Marcus Vance" class="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-xs font-medium text-white focus:outline-none focus:border-amber-500 transition">
                  </div>
                  <div class="space-y-1.5">
                    <label class="block text-xs font-bold text-stone-300">Phone Number</label>
                    <input type="tel" name="phone" required placeholder="+1 (555) 000-0000" class="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-xs font-medium text-white focus:outline-none focus:border-amber-500 transition">
                  </div>
                </div>

                <div class="space-y-1.5">
                  <label class="block text-xs font-bold text-stone-300">Email Address</label>
                  <input type="email" name="email" required placeholder="marcus@example.com" class="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-xs font-medium text-white focus:outline-none focus:border-amber-500 transition">
                </div>

                <div class="space-y-1.5">
                  <label class="block text-xs font-bold text-stone-300">Message / Catering Inquiry</label>
                  <textarea name="message" rows="3" required placeholder="Tell us about your event date, cuisine preference, or feedback..." class="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-xs font-medium text-white focus:outline-none focus:border-amber-500 transition resize-none"></textarea>
                </div>

                <button type="submit" class="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer">
                  <span>Submit Inquiry</span>
                  <i data-lucide="send" class="w-4 h-4"></i>
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>

  </main>

  <!-- FOOTER -->
  <footer class="bg-stone-950 border-t border-stone-800 py-16 text-stone-400 text-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10">
        
        <div class="space-y-4">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-stone-950 font-black">
              <i data-lucide="utensils-crossed" class="w-4 h-4"></i>
            </div>
            <span class="font-serif font-extrabold text-lg text-white">FeastDash</span>
          </div>
          <p class="text-xs leading-relaxed text-stone-400">
            Delivering artisanal dining and 12+ iconic cuisines with precision express fulfillment.
          </p>
          <p class="text-[11px] text-stone-500">© <span id="yearSpan">2026</span> FeastDash Inc. All rights reserved.</p>
        </div>

        <div class="space-y-3">
          <p class="font-bold text-white uppercase tracking-wider text-xs">12 Cuisines</p>
          <ul class="space-y-2 text-xs">
            <li><button type="button" onclick="filterCategory('indian')" class="hover:text-amber-400 transition">Indian Curries</button></li>
            <li><button type="button" onclick="filterCategory('biryani')" class="hover:text-amber-400 transition">Royal Biryani</button></li>
            <li><button type="button" onclick="filterCategory('pizza')" class="hover:text-amber-400 transition">Wood-Fired Pizza</button></li>
            <li><button type="button" onclick="filterCategory('burgers')" class="hover:text-amber-400 transition">Wagyu Burgers</button></li>
            <li><button type="button" onclick="filterCategory('south-indian')" class="hover:text-amber-400 transition">South Indian Tiffins</button></li>
            <li><button type="button" onclick="filterCategory('chinese')" class="hover:text-amber-400 transition">Chinese & Dim Sum</button></li>
          </ul>
        </div>

        <div class="space-y-3">
          <p class="font-bold text-white uppercase tracking-wider text-xs">More Categories</p>
          <ul class="space-y-2 text-xs">
            <li><button type="button" onclick="filterCategory('north-indian')" class="hover:text-amber-400 transition">North Indian Dhaba</button></li>
            <li><button type="button" onclick="filterCategory('bakery')" class="hover:text-amber-400 transition">French Bakery</button></li>
            <li><button type="button" onclick="filterCategory('desserts')" class="hover:text-amber-400 transition">Artisan Desserts</button></li>
            <li><button type="button" onclick="filterCategory('healthy')" class="hover:text-amber-400 transition">Healthy Poké Bowls</button></li>
            <li><button type="button" onclick="filterCategory('drinks')" class="hover:text-amber-400 transition">Craft Drinks & Lassis</button></li>
            <li><button type="button" onclick="filterCategory('street-food')" class="hover:text-amber-400 transition">Pani Puri & Street Food</button></li>
          </ul>
        </div>

        <div class="space-y-3">
          <p class="font-bold text-white uppercase tracking-wider text-xs">VIP Foodie Club</p>
          <p class="text-xs text-stone-400">Receive private chef seasonal releases and weekly flash offers.</p>
          <form onsubmit="event.preventDefault(); submitNewsletter(event)" class="space-y-2">
            <div class="relative flex items-center">
              <i data-lucide="mail" class="w-4 h-4 text-stone-500 absolute left-3 pointer-events-none"></i>
              <input type="email" required placeholder="Enter your email..." class="w-full pl-9 pr-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-amber-500 transition">
            </div>
            <button type="submit" class="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs transition uppercase tracking-wider cursor-pointer">
              Subscribe
            </button>
          </form>
          <button type="button" onclick="window.scrollTo({top:0, behavior:'smooth'})" class="pt-2 flex items-center gap-1 text-xs text-amber-500 font-bold hover:underline cursor-pointer">
            <span>Back to top</span>
            <i data-lucide="arrow-up" class="w-3.5 h-3.5"></i>
          </button>
        </div>

      </div>
    </div>
  </footer>

  <!-- ==================== MODALS & DRAWERS ==================== -->

  <!-- DRAWER OVERLAY BACKDROP -->
  <div id="cartDrawerOverlay" onclick="toggleDrawer('cartDrawer')" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300" style="display: none;"></div>

  <!-- SLIDE-OUT CART DRAWER -->
  <div id="cartDrawer" class="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-stone-950 border-l border-stone-800 p-6 flex flex-col justify-between shadow-2xl translate-x-full transition-transform duration-300 ease-in-out">
    
    <div>
      <!-- DRAWER HEADER -->
      <div class="flex items-center justify-between pb-4 border-b border-stone-800">
        <div class="flex items-center gap-2">
          <i data-lucide="shopping-bag" class="w-5 h-5 text-amber-400"></i>
          <h3 class="font-serif font-extrabold text-lg text-white">Your Delivery Bag</h3>
        </div>
        <button type="button" onclick="toggleDrawer('cartDrawer')" class="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition cursor-pointer">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- DYNAMIC CART ITEMS CONTAINER -->
      <div id="cartItemsContainer" class="py-6 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
        <!-- Dynamically rendered -->
      </div>
    </div>

    <!-- DRAWER FOOTER / TOTAL -->
    <div id="cartFooter" class="border-t border-stone-800 pt-4 space-y-4">
      <div class="space-y-1.5 text-xs text-stone-400">
        <div class="flex justify-between">
          <span>Subtotal</span>
          <span id="cartSubtotalText" class="font-bold text-white">$0.00</span>
        </div>
        <div class="flex justify-between">
          <span>Estimated Express Delivery</span>
          <span class="font-bold text-emerald-400">$3.99</span>
        </div>
        <div class="flex justify-between text-sm font-bold text-white pt-2 border-t border-stone-800/60">
          <span>Total</span>
          <span id="cartTotalText" class="text-amber-400 font-extrabold">$3.99</span>
        </div>
      </div>

      <button type="button" id="checkoutBtn" onclick="openModal('checkoutModal')" disabled class="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer">
        <span>Proceed to Checkout</span>
        <i data-lucide="arrow-right" class="w-4 h-4"></i>
      </button>
    </div>

  </div>

  <!-- CHECKOUT MODAL -->
  <div id="checkoutModal" onclick="if(event.target === this) closeModal('checkoutModal')" style="display: none;" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
    <div class="bg-stone-900 border border-stone-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
      
      <div class="flex items-center justify-between border-b border-stone-800 pb-4">
        <h3 class="font-serif font-extrabold text-xl text-white flex items-center gap-2">
          <i data-lucide="credit-card" class="w-5 h-5 text-amber-500"></i>
          <span>Complete Your Gourmet Order</span>
        </h3>
        <button type="button" onclick="closeModal('checkoutModal')" class="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white transition cursor-pointer">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <form onsubmit="event.preventDefault(); processCheckout(event)" class="space-y-4">
        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-stone-300">Full Name</label>
          <input type="text" name="name" required placeholder="Alex Morgan" class="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs font-medium text-white focus:outline-none focus:border-amber-500 transition">
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-stone-300">Email Address</label>
            <input type="email" name="email" required placeholder="alex@example.com" class="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs font-medium text-white focus:outline-none focus:border-amber-500 transition">
          </div>
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-stone-300">Phone Number</label>
            <input type="tel" name="phone" required placeholder="+1 (555) 000-0000" class="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs font-medium text-white focus:outline-none focus:border-amber-500 transition">
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-stone-300">Delivery Street Address</label>
          <input type="text" name="address" required placeholder="742 Evergreen Terrace, Apt 4B" class="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs font-medium text-white focus:outline-none focus:border-amber-500 transition">
        </div>

        <div class="space-y-2 pt-2">
          <label class="block text-xs font-bold text-stone-300">Payment Method</label>
          <div class="grid grid-cols-3 gap-2">
            <label class="p-3 rounded-xl border border-amber-500 bg-amber-500/10 flex flex-col items-center justify-center gap-1 cursor-pointer text-center">
              <input type="radio" name="payMethod" value="Card" checked class="hidden">
              <i data-lucide="credit-card" class="w-4 h-4 text-amber-400"></i>
              <span class="text-[11px] font-bold text-white">Credit Card</span>
            </label>
            <label class="p-3 rounded-xl border border-stone-800 bg-stone-950 flex flex-col items-center justify-center gap-1 cursor-pointer text-center hover:border-amber-500/50 transition">
              <input type="radio" name="payMethod" value="ApplePay" class="hidden">
              <i data-lucide="smartphone" class="w-4 h-4 text-stone-400"></i>
              <span class="text-[11px] font-bold text-white">Apple Pay</span>
            </label>
            <label class="p-3 rounded-xl border border-stone-800 bg-stone-950 flex flex-col items-center justify-center gap-1 cursor-pointer text-center hover:border-amber-500/50 transition">
              <input type="radio" name="payMethod" value="COD" class="hidden">
              <i data-lucide="banknote" class="w-4 h-4 text-stone-400"></i>
              <span class="text-[11px] font-bold text-white">Cash on Delivery</span>
            </label>
          </div>
        </div>

        <button type="submit" class="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 mt-4 cursor-pointer">
          <i data-lucide="check-circle-2" class="w-4 h-4"></i>
          <span>Place Order Now</span>
        </button>
      </form>

    </div>
  </div>

  <!-- DISH QUICK VIEW MODAL -->
  <div id="dishModal" onclick="if(event.target === this) closeModal('dishModal')" style="display: none;" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
    <div class="bg-stone-900 border border-stone-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative flex flex-col">
      <div class="relative h-60 w-full">
        <img id="modalDishImage" src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=1400&auto=format&fit=crop&q=80" alt="Dish Preview" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-black/40"></div>
        <button type="button" onclick="closeModal('dishModal')" class="absolute top-4 right-4 p-2 rounded-full bg-stone-950/80 text-white hover:bg-stone-900 transition cursor-pointer">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
      
      <div class="p-6 space-y-4">
        <div class="flex items-start justify-between gap-4">
          <div>
            <span id="modalDishCategory" class="text-[10px] font-extrabold uppercase tracking-widest text-amber-500">Cuisine</span>
            <h3 id="modalDishTitle" class="font-serif font-extrabold text-2xl text-white">Dish Name</h3>
          </div>
          <span id="modalDishPrice" class="font-serif font-black text-2xl text-amber-400">$0.00</span>
        </div>

        <p id="modalDishDesc" class="text-xs text-stone-400 leading-relaxed">Detailed dish description</p>

        <div class="pt-2 border-t border-stone-800 flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs text-stone-300 font-medium">
            <i data-lucide="clock" class="w-4 h-4 text-amber-500"></i>
            <span>Prep: 15-25 mins</span>
          </div>
          <button id="modalAddBtn" type="button" class="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs transition uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer">
            <i data-lucide="shopping-bag" class="w-4 h-4"></i>
            <span>Add to Bag</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- WRITE A REVIEW MODAL -->
  <div id="reviewModal" onclick="if(event.target === this) closeModal('reviewModal')" style="display: none;" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
    <div class="bg-stone-900 border border-stone-800 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl relative">
      <div class="flex items-center justify-between border-b border-stone-800 pb-3">
        <h3 class="font-serif font-extrabold text-lg text-white">Share Your Dining Experience</h3>
        <button type="button" onclick="closeModal('reviewModal')" class="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white transition cursor-pointer">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>

      <form onsubmit="event.preventDefault(); submitReview(event)" class="space-y-4">
        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-stone-300">Your Name</label>
          <input type="text" name="reviewerName" required placeholder="e.g. Sarah Jenkins" class="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none focus:border-amber-500 transition">
        </div>

        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-stone-300">Rating</label>
          <select name="rating" class="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-amber-500 transition">
            <option value="5">★★★★★ (5/5) - Phenomenal!</option>
            <option value="4">★★★★☆ (4/5) - Delicious</option>
            <option value="3">★★★☆☆ (3/5) - Average</option>
          </select>
        </div>

        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-stone-300">Review</label>
          <textarea name="reviewText" rows="3" required placeholder="How was the taste, presentation, and delivery speed?" class="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none focus:border-amber-500 transition resize-none"></textarea>
        </div>

        <button type="submit" class="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20 cursor-pointer">
          Publish Review
        </button>
      </form>
    </div>
  </div>

  <!-- ==================== JAVASCRIPT STATE ENGINE ==================== -->
  <script>
    // 1. COMPREHENSIVE 12-CUISINE DISH CATALOG
    const DISHES = [
      // 1. INDIAN
      {
        id: 'ind-1',
        title: 'Butter Chicken Royale',
        category: 'indian',
        price: 23.50,
        image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80',
        badge: 'Chef Signature',
        desc: 'Tender tandoori chicken simmered in a velvety tomato cream gravy with aromatic kasuri methi and churned butter.',
        dietary: '🍛 Indian Heritage'
      },
      {
        id: 'ind-2',
        title: 'Shahi Paneer Tikka Masala',
        category: 'indian',
        price: 19.50,
        image: 'https://images.unsplash.com/photo-1567184109411-b28f2b33830a?w=800&auto=format&fit=crop&q=80',
        badge: 'Top Vegetarian',
        desc: 'Charcoal-roasted cottage cheese cubes simmered in a rich cashew-saffron gravy, garnished with fresh ginger juliennes.',
        dietary: '🌱 Pure Vegetarian'
      },
      {
        id: 'ind-3',
        title: 'Kashmiri Rogan Josh',
        category: 'indian',
        price: 25.00,
        image: 'https://images.unsplash.com/photo-1545247181-516773cae7be?w=800&auto=format&fit=crop&q=80',
        badge: 'Slow Cooked',
        desc: 'Braised spring lamb cooked with Kashmiri red chilies, ground fennel, and whole warming spices.',
        dietary: '🍖 Halal Meat'
      },

      // 2. PIZZA
      {
        id: 'piz-1',
        title: 'Wood-Fired Margherita D.O.P.',
        category: 'pizza',
        price: 18.90,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80',
        badge: 'Italian Classic',
        desc: 'San Marzano D.O.P. tomatoes, fresh buffalo mozzarella, aromatic basil, and Sicilian extra virgin olive oil.',
        dietary: '🌱 Vegetarian'
      },
      {
        id: 'piz-2',
        title: 'Black Truffle & Wild Porcini',
        category: 'pizza',
        price: 23.00,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
        badge: 'Gourmet Drop',
        desc: 'White base with Fior di latte, roasted wild porcini mushrooms, black truffle carpaccio, and shaved aged Parmesan.',
        dietary: '🍄 Artisan Truffle'
      },
      {
        id: 'piz-3',
        title: 'Spicy Diavola Pepperoni',
        category: 'pizza',
        price: 21.00,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&auto=format&fit=crop&q=80',
        badge: 'Best Seller',
        desc: 'Smoked mozzarella, spicy Calabrian salami, chili oil, and hot blossom honey drizzle on crispy charred crust.',
        dietary: '🌶️ Spicy Crust'
      },

      // 3. BURGERS
      {
        id: 'burg-1',
        title: 'Double Wagyu Smash Deluxe',
        category: 'burgers',
        price: 21.00,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
        badge: 'Juicy Drop',
        desc: 'Double smashed A5 Wagyu beef patties, melted Vermont sharp cheddar, caramelized shallots, house truffle aioli on brioche.',
        dietary: '🍔 Prime Beef'
      },
      {
        id: 'burg-2',
        title: 'Smoked Truffle Bacon Stack',
        category: 'burgers',
        price: 22.50,
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80',
        badge: 'Chef Favorite',
        desc: 'Oak-smoked crispy bacon strips, beef patty, grilled portobello mushroom, and aged gouda on toasted black sesame bun.',
        dietary: '🥓 Gourmet Stack'
      },
      {
        id: 'burg-3',
        title: 'Nashville Crispy Hot Chicken',
        category: 'burgers',
        price: 18.50,
        image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=800&auto=format&fit=crop&q=80',
        badge: 'Spicy Crunch',
        desc: 'Buttermilk soaked crispy chicken breast tossed in fiery cayenne pepper oil, tangy dill pickles, and creamy garlic slaw.',
        dietary: '🍗 Crispy Chicken'
      },

      // 4. BIRYANI
      {
        id: 'biryani-1',
        title: 'Hyderabadi Dum Gosht Biryani',
        category: 'biryani',
        price: 24.00,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
        badge: 'Royal Handi',
        desc: 'Slow-cooked mutton handi sealed with dough, aged long-grain basmati, Kashmiri saffron milk, served with mirchi ka salan.',
        dietary: '🍚 Nizami Royal'
      },
      {
        id: 'biryani-2',
        title: 'Royal Awadhi Chicken Dum',
        category: 'biryani',
        price: 21.50,
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80',
        badge: 'Nawabi Taste',
        desc: 'Fragrant Awadhi spiced chicken layered with caramelised onions, kewra essence, fresh mint, and burani raita.',
        dietary: '🍗 Tender Chicken'
      },
      {
        id: 'biryani-3',
        title: 'Subz Paneer Dum Biryani',
        category: 'biryani',
        price: 18.00,
        image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80',
        badge: 'Veg Special',
        desc: 'Farm-fresh garden vegetables and golden cottage cheese marinated in brown onion yogurt masala and aromatic saffron rice.',
        dietary: '🌱 Vegetarian'
      },

      // 5. CHINESE
      {
        id: 'chi-1',
        title: 'Steamed Crystal Truffle Dim Sum',
        category: 'chinese',
        price: 18.00,
        image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop&q=80',
        badge: 'Handmade Daily',
        desc: 'Handmade translucent dumplings filled with wild forest mushrooms, water chestnuts, and black truffle oil dip.',
        dietary: '🥟 Cantonese Dim Sum'
      },
      {
        id: 'chi-2',
        title: 'Fiery Szechuan Chili Noodles',
        category: 'chinese',
        price: 16.50,
        image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&auto=format&fit=crop&q=80',
        badge: 'Spicy Wok',
        desc: 'Hand-pulled wheat noodles tossed in authentic Sichuan peppercorn oil, garlic crisps, bok choy, and toasted sesame.',
        dietary: '🌶️ Wok Tossed'
      },
      {
        id: 'chi-3',
        title: 'Dragon Kung Pao Chicken',
        category: 'chinese',
        price: 19.00,
        image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&auto=format&fit=crop&q=80',
        badge: 'Best Seller',
        desc: 'Wok-seared diced chicken with dried red chilies, crunchy roasted peanuts, scallions, and sweet-tangy glaze.',
        dietary: '🥜 Contains Nuts'
      },

      // 6. SOUTH INDIAN
      {
        id: 'south-1',
        title: 'Golden Ghee Roast Masala Dosa',
        category: 'south-indian',
        price: 14.50,
        image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80',
        badge: 'Crispy Gold',
        desc: 'Paper-thin fermented crepe roasted in pure desi ghee, spiced potato masala, served with 3 fresh chutneys & piping hot sambar.',
        dietary: '🥥 Traditional Tiffin'
      },
      {
        id: 'south-2',
        title: 'Fluffy Steamed Idli & Medu Vada',
        category: 'south-indian',
        price: 12.50,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
        badge: 'Morning Classic',
        desc: 'Melt-in-mouth steamed rice cakes & golden crispy lentil fritters paired with roasted coconut chutney & drumstick sambar.',
        dietary: '🌱 Vegan Choice'
      },
      {
        id: 'south-3',
        title: 'Malabar Parotta & Vegetable Kurma',
        category: 'south-indian',
        price: 15.50,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
        badge: 'Kerala Special',
        desc: 'Flaky layered Kerala parottas served with rich coconut-cashew vegetable kurma and pickled shallots.',
        dietary: '🥥 Malabar Flavors'
      },

      // 7. NORTH INDIAN
      {
        id: 'north-1',
        title: '24-Hour Simmered Dal Makhani',
        category: 'north-indian',
        price: 17.50,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
        badge: 'Heritage Recipe',
        desc: 'Black lentils slow-cooked overnight on charcoal tandoor with fresh cream, churned white butter, and aromatic spices.',
        dietary: '🌱 Pure Vegetarian'
      },
      {
        id: 'north-2',
        title: 'Amritsari Kulcha & Pindi Chole',
        category: 'north-indian',
        price: 16.00,
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80',
        badge: 'Punjabi Feast',
        desc: 'Crispy herb-crusted tandoori kulcha stuffed with spiced potato & onion, served with dark pomegranate chole & tamarind dip.',
        dietary: '🫓 Dhaba Special'
      },
      {
        id: 'north-3',
        title: 'Tandoori Sizzling Kebab Platter',
        category: 'north-indian',
        price: 26.50,
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80',
        badge: 'Grand Platter',
        desc: 'Assortment of malai chicken tikka, mutton seekh kebabs, and charred tandoori prawns with mint chutney.',
        dietary: '🍖 Meat Feast'
      },

      // 8. DESSERTS
      {
        id: 'des-1',
        title: 'Artisanal Tiramisu Al Caffè',
        category: 'desserts',
        price: 11.00,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop&q=80',
        badge: 'Italian Dolci',
        desc: 'Espresso-soaked Savoiardi ladyfingers layered with rich mascarpone zabaglione and dusted with Valrhona cocoa.',
        dietary: '☕ Coffee Infused'
      },
      {
        id: 'des-2',
        title: 'Gulab Jamun Saffron Cheesecake',
        category: 'desserts',
        price: 12.50,
        image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&auto=format&fit=crop&q=80',
        badge: 'Fusion Special',
        desc: 'Velvety New York style baked cheesecake infused with whole soft saffron gulab jamuns and pistachio crumble base.',
        dietary: '🍰 Chef Fusion'
      },
      {
        id: 'des-3',
        title: 'Molten Dark Chocolate Lava Cake',
        category: 'desserts',
        price: 12.00,
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80',
        badge: 'Warm & Gooey',
        desc: '70% Belgian dark chocolate cake with a molten flowing center, served with Madagascar vanilla bean gelato.',
        dietary: '🍫 Decadent Chocolate'
      },

      // 9. BAKERY
      {
        id: 'bak-1',
        title: 'French Butter Croissant Box (3 pcs)',
        category: 'bakery',
        price: 13.50,
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80',
        badge: 'Freshly Baked',
        desc: 'Flaky 27-layer French butter croissants with golden honeycomb crumb and crisp caramelized exterior.',
        dietary: '🥐 Artisanal Viennoiserie'
      },
      {
        id: 'bak-2',
        title: 'Rustic Country Sourdough Batard',
        category: 'bakery',
        price: 9.50,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
        badge: 'Wild Ferment',
        desc: 'Naturally fermented 36-hour wild levain sourdough loaf with a blistered crunchy crust and tender open crumb.',
        dietary: '🌾 Organic Grain'
      },
      {
        id: 'bak-3',
        title: 'Valrhona Pain au Chocolat',
        category: 'bakery',
        price: 12.00,
        image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=800&auto=format&fit=crop&q=80',
        badge: 'Morning Treat',
        desc: 'Laminated buttery pastry dough enclosing twin batons of rich Valrhona dark chocolate, baked golden.',
        dietary: '🍫 Chocolate Bake'
      },

      // 10. HEALTHY FOOD
      {
        id: 'hlth-1',
        title: 'Dragon Atlantic Salmon Poké Bowl',
        category: 'healthy',
        price: 22.50,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
        badge: 'Omega-3 Rich',
        desc: 'Sashimi-grade Atlantic salmon, Hass avocado, edamame, pickled ginger, wakame, and ginger-tamari over brown sushi rice.',
        dietary: '🥗 High Protein'
      },
      {
        id: 'hlth-2',
        title: 'Mediterranean Superfood Quinoa Bowl',
        category: 'healthy',
        price: 17.00,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80',
        badge: 'Nutrient Dense',
        desc: 'Tri-color organic quinoa, baby spinach, Kalamata olives, Persian cucumbers, crumbled Greek feta, and lemon oregano vinaigrette.',
        dietary: '🌱 Gluten-Free'
      },
      {
        id: 'hlth-3',
        title: 'Herb Grilled Chicken & Avocado Salad',
        category: 'healthy',
        price: 18.50,
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
        badge: 'Clean Fuel',
        desc: 'Free-range rosemary grilled chicken breast, sliced avocado, cherry heirloom tomatoes, and toasted sunflower seeds.',
        dietary: '🥑 Low Carb'
      },

      // 11. DRINKS
      {
        id: 'drk-1',
        title: 'Royal Alphonso Mango Kesar Lassi',
        category: 'drinks',
        price: 7.50,
        image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&auto=format&fit=crop&q=80',
        badge: 'Chilled Royal',
        desc: 'Thick churned farm yogurt blended with sweet Ratnagiri Alphonso mango pulp, saffron strands, and crushed pistachios.',
        dietary: '🥭 Refreshing Lassi'
      },
      {
        id: 'drk-2',
        title: 'Nitro Cold Brew & Salted Caramel',
        category: 'drinks',
        price: 6.50,
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&auto=format&fit=crop&q=80',
        badge: 'Craft Cafe',
        desc: '18-hour cold steeped single-origin Ethiopian coffee beans infused with nitrogen and artisanal sea salt caramel.',
        dietary: '☕ Artisanal Brew'
      },
      {
        id: 'drk-3',
        title: 'Spiced Royal Saffron Masala Chai',
        category: 'drinks',
        price: 5.50,
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
        badge: 'Aromatic Warmth',
        desc: 'Strong Assam CTC tea brewed with fresh crushed green cardamom, ginger, cinnamon, and whole cloves in whole milk.',
        dietary: '🍵 Authentic Chai'
      },

      // 12. STREET FOOD
      {
        id: 'str-1',
        title: 'Royal 6-Flavor Pani Puri Experience',
        category: 'street-food',
        price: 13.50,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
        badge: 'Street Legend',
        desc: 'Crispy semolina puris served with spiced potato-chickpea filling and 6 flavored herbal waters (Mint, Tamarind, Garlic, Hing, Raw Mango, Jeera).',
        dietary: '🌮 Iconic Street Food'
      },
      {
        id: 'str-2',
        title: 'Mumbai Amul Butter Pav Bhaji',
        category: 'street-food',
        price: 14.00,
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&auto=format&fit=crop&q=80',
        badge: 'Crowd Favorite',
        desc: 'Mashed spiced tomato-vegetable gravy loaded with Amul butter, served with golden toasted soft pav buns and diced lemon onions.',
        dietary: '🧈 Buttery Feast'
      },
      {
        id: 'str-3',
        title: 'Kolkata Crispy Chicken Kathi Roll',
        category: 'street-food',
        price: 13.00,
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80',
        badge: 'Roll Master',
        desc: 'Flaky layered parotta lined with fried egg, stuffed with tandoor grilled chicken chunks, sliced red onions, and green chili lime sauce.',
        dietary: '🌯 Street Wrap'
      }
    ];

    let REVIEWS = [
      {
        name: 'Elena Rostova',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        stars: 5,
        date: '2 hours ago',
        comment: 'The Hyderabadi Dum Biryani arrived steaming hot in a sealed handi! The aroma of saffron and tenderness of meat was extraordinary.'
      },
      {
        name: 'Marcus Vance',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        stars: 5,
        date: 'Yesterday',
        comment: 'Having 12 authentic cuisines in one app is a gamechanger. The Butter Chicken and French Croissants were both 10/10.'
      },
      {
        name: 'Sophia Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
        stars: 5,
        date: '3 days ago',
        comment: 'Fast 25 min delivery. The Truffle Dim Sum and Ghee Roast Masala Dosa tasted straight out of a 5-star restaurant kitchen.'
      }
    ];

    // CART STATE
    let cart = [];
    let activeCategory = 'all';
    let searchQuery = '';

    // INITIALIZATION
    document.addEventListener('DOMContentLoaded', () => {
      document.getElementById('yearSpan').textContent = new Date().getFullYear();
      renderMenu();
      renderCart();
      renderReviews();
      if (window.lucide) lucide.createIcons();
    });

    // 2. RENDER FOOD MENU
    function renderMenu() {
      const container = document.getElementById('menuGrid');
      if (!container) return;

      const filtered = DISHES.filter(d => {
        const matchesCat = activeCategory === 'all' || d.category === activeCategory;
        const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              d.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              d.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
      });

      const countBadge = document.getElementById('dishCountBadge');
      if (countBadge) countBadge.textContent = \`\${filtered.length} Gourmet Dishes\`;

      if (filtered.length === 0) {
        container.innerHTML = \`
          <div class="col-span-full py-16 text-center text-stone-500 text-sm space-y-3">
            <div class="w-14 h-14 rounded-2xl bg-stone-900 mx-auto flex items-center justify-center text-stone-600 border border-stone-800">
              <i data-lucide="utensils-crossed" class="w-7 h-7 text-amber-500/50"></i>
            </div>
            <p class="font-bold text-stone-300">No dishes found matching "\${searchQuery}"</p>
            <p class="text-xs text-stone-500">Try searching for Biryani, Pizza, Butter Chicken, Dosa, Dim Sum or Breads.</p>
            <button type="button" onclick="filterCategory('all')" class="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-extrabold text-xs">
              View All 36 Dishes
            </button>
          </div>
        \`;
        if (window.lucide) lucide.createIcons();
        return;
      }

      container.innerHTML = filtered.map(item => \`
        <div class="group rounded-3xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl hover:-translate-y-1">
          <div>
            <!-- IMAGE & BADGE -->
            <div class="relative h-48 w-full overflow-hidden">
              <img src="\${item.image}" alt="\${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
              <div class="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent"></div>
              <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-stone-950/90 border border-amber-500/30 text-amber-400 font-extrabold text-[10px] tracking-wider uppercase backdrop-blur-md">
                \${item.badge}
              </span>
            </div>

            <!-- CONTENT -->
            <div class="p-5 space-y-2">
              <div class="flex items-center justify-between text-[11px] text-stone-400 font-bold uppercase tracking-wider">
                <span class="truncate max-w-[150px]">\${item.dietary}</span>
                <span class="text-amber-400 font-serif font-extrabold text-base">$\${item.price.toFixed(2)}</span>
              </div>
              <h3 class="font-serif font-extrabold text-lg text-white group-hover:text-amber-400 transition">\${item.title}</h3>
              <p class="text-xs text-stone-400 leading-relaxed line-clamp-2">\${item.desc}</p>
            </div>
          </div>

          <!-- ACTIONS -->
          <div class="p-5 pt-0 flex items-center gap-2">
            <button type="button" onclick="openDishModal('\${item.id}')" class="p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-300 hover:text-white hover:border-stone-700 transition cursor-pointer" title="Quick Details">
              <i data-lucide="eye" class="w-4 h-4"></i>
            </button>
            <button type="button" onclick="quickAdd('\${item.id}')" class="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs uppercase tracking-wider transition shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 cursor-pointer">
              <i data-lucide="shopping-bag" class="w-4 h-4"></i>
              <span>Add to Bag</span>
            </button>
          </div>
        </div>
      \`).join('');

      if (window.lucide) lucide.createIcons();
    }

    // 3. CART ACTIONS
    function quickAdd(id) {
      const dish = DISHES.find(d => d.id === id);
      if (!dish) return;
      
      const existing = cart.find(c => c.id === id);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ ...dish, qty: 1 });
      }
      renderCart();
      showToast(\`Added \${dish.title} to your bag! 🛵\`);
      
      // Auto open drawer so user sees items immediately
      const drawer = document.getElementById('cartDrawer');
      if (drawer && drawer.classList.contains('translate-x-full')) {
        drawer.classList.remove('translate-x-full');
        if (window.lucide) lucide.createIcons();
      }
    }

    function updateQty(id, delta) {
      const item = cart.find(c => c.id === id);
      if (!item) return;
      item.qty += delta;
      if (item.qty <= 0) {
        cart = cart.filter(c => c.id !== id);
      }
      renderCart();
    }

    function removeFromCart(id) {
      cart = cart.filter(c => c.id !== id);
      renderCart();
      showToast('Item removed from your bag.');
    }

    function renderCart() {
      const container = document.getElementById('cartItemsContainer');
      const badgeCount = document.getElementById('cartBadgeCount');
      const subtotalEl = document.getElementById('cartSubtotalText');
      const totalEl = document.getElementById('cartTotalText');
      const checkoutBtn = document.getElementById('checkoutBtn');

      const totalItems = cart.reduce((acc, i) => acc + i.qty, 0);
      const subtotal = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
      const deliveryFee = totalItems > 0 ? 3.99 : 0;
      const grandTotal = subtotal + deliveryFee;

      if (badgeCount) {
        badgeCount.textContent = totalItems;
        badgeCount.style.display = totalItems > 0 ? 'flex' : 'none';
      }
      if (subtotalEl) subtotalEl.textContent = \`$\${subtotal.toFixed(2)}\`;
      if (totalEl) totalEl.textContent = \`$\${grandTotal.toFixed(2)}\`;
      if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;

      if (!container) return;

      if (cart.length === 0) {
        container.innerHTML = \`
          <div class="py-12 text-center space-y-4 text-stone-500">
            <div class="w-14 h-14 rounded-2xl bg-stone-900 mx-auto flex items-center justify-center text-stone-600 border border-stone-800">
              <i data-lucide="shopping-bag" class="w-7 h-7 text-amber-500/50"></i>
            </div>
            <div class="space-y-1">
              <p class="text-sm font-bold text-stone-300">Your delivery bag is empty</p>
              <p class="text-xs text-stone-500 max-w-xs mx-auto">Explore our 12 cuisines and add delicious dishes to your bag.</p>
            </div>
            <button type="button" onclick="toggleDrawer('cartDrawer'); document.getElementById('menu').scrollIntoView({behavior: 'smooth'})" class="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs font-bold text-amber-400 hover:text-amber-300 transition cursor-pointer">
              Browse Menu ➔
            </button>
          </div>
        \`;
        if (window.lucide) lucide.createIcons();
        return;
      }

      container.innerHTML = cart.map(item => \`
        <div class="p-3.5 rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-stone-700/80 transition flex items-center justify-between gap-3 shadow-lg">
          <img src="\${item.image}" alt="\${item.title}" class="w-14 h-14 rounded-xl object-cover shrink-0 border border-stone-800">
          <div class="flex-1 min-w-0">
            <h4 class="text-xs font-serif font-bold text-white truncate">\${item.title}</h4>
            <p class="text-xs text-amber-400 font-extrabold mt-0.5">$\${(item.price * item.qty).toFixed(2)}</p>
          </div>
          <div class="flex items-center gap-1.5 bg-stone-950 px-2 py-1 rounded-xl border border-stone-800 shrink-0">
            <button type="button" onclick="updateQty('\${item.id}', -1)" class="w-6 h-6 flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-900 rounded text-xs font-bold transition cursor-pointer">-</button>
            <span class="text-xs font-bold text-white min-w-[16px] text-center">\${item.qty}</span>
            <button type="button" onclick="updateQty('\${item.id}', 1)" class="w-6 h-6 flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-900 rounded text-xs font-bold transition cursor-pointer">+</button>
          </div>
          <button type="button" onclick="removeFromCart('\${item.id}')" class="p-1.5 text-stone-500 hover:text-rose-400 transition rounded-lg hover:bg-rose-500/10 shrink-0 cursor-pointer" title="Remove item">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      \`).join('');

      if (window.lucide) lucide.createIcons();
    }

    // 4. CATEGORY & SEARCH FILTERING
    const CUISINE_NAMES = {
      'all': 'All 12 Cuisines',
      'indian': 'Indian Curries & Tandoor',
      'pizza': 'Wood-Fired Artisanal Pizza',
      'burgers': 'Gourmet Wagyu Burgers',
      'biryani': 'Royal Dum Biryani',
      'chinese': 'Chinese & Dim Sum',
      'south-indian': 'South Indian Dosa & Tiffins',
      'north-indian': 'North Indian Dhaba & Kulchas',
      'desserts': 'Artisanal Cakes & Dolci',
      'bakery': 'French Bakery & Croissants',
      'healthy': 'Superfood & Poké Bowls',
      'drinks': 'Craft Shakes & Brews',
      'street-food': 'Pani Puri & Street Food'
    };

    function filterCategory(cat) {
      activeCategory = cat;
      document.querySelectorAll('.cat-pill').forEach(btn => {
        const btnCat = btn.getAttribute('data-cat');
        if (btnCat === cat) {
          btn.classList.remove('bg-stone-900/60', 'border-stone-800');
          btn.classList.add('bg-stone-900', 'border-amber-500/50', 'active');
        } else {
          btn.classList.remove('bg-stone-900', 'border-amber-500/50', 'active');
          btn.classList.add('bg-stone-900/60', 'border-stone-800');
        }
      });

      const badge = document.getElementById('activeCuisineBadge');
      if (badge) badge.textContent = CUISINE_NAMES[cat] || cat.toUpperCase();

      const heading = document.getElementById('menuHeading');
      if (heading) heading.textContent = cat === 'all' ? 'Curated Gourmet Menu' : \`\${CUISINE_NAMES[cat]} Menu\`;

      renderMenu();

      // Smooth scroll to menu
      const menuSection = document.getElementById('menu');
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    function handleSearch(val) {
      searchQuery = val;
      renderMenu();
    }

    function handleAddressSubmit() {
      const val = document.getElementById('heroAddressInput').value;
      if (val) {
        showToast(\`Delivery confirmed for \${val} 🛵\`);
        document.getElementById('restaurants').scrollIntoView({ behavior: 'smooth' });
      }
    }

    // 5. MODAL DISH DETAIL
    function openDishModal(id) {
      const dish = DISHES.find(d => d.id === id);
      if (!dish) return;
      
      document.getElementById('modalDishImage').src = dish.image;
      document.getElementById('modalDishCategory').textContent = CUISINE_NAMES[dish.category] || dish.category.toUpperCase();
      document.getElementById('modalDishTitle').textContent = dish.title;
      document.getElementById('modalDishPrice').textContent = \`$\${dish.price.toFixed(2)}\`;
      document.getElementById('modalDishDesc').textContent = dish.desc;
      
      const btn = document.getElementById('modalAddBtn');
      btn.onclick = () => {
        quickAdd(dish.id);
        closeModal('dishModal');
      };

      openModal('dishModal');
    }

    // 6. PROCESS CHECKOUT
    function processCheckout(event) {
      const form = event.target;
      const name = form.name.value;
      const phone = form.phone.value;
      const address = form.address.value;
      
      const generatedOrderCode = 'FD-' + Math.floor(1000 + Math.random() * 9000);
      cart = [];
      renderCart();
      closeModal('checkoutModal');
      toggleDrawer('cartDrawer');
      
      document.getElementById('displayOrderCode').textContent = '#' + generatedOrderCode;
      document.getElementById('trackingCodeInput').value = generatedOrderCode;
      
      const timeline = document.getElementById('trackingTimeline');
      if (timeline) timeline.style.display = 'block';

      document.getElementById('tracking').scrollIntoView({ behavior: 'smooth' });
      
      showToast(\`Order #\${generatedOrderCode} placed! Preparing hot delivery to \${address}. 🚀\`);
      form.reset();
    }

    // 7. TRACKING SIMULATION
    function simulateOrderTracking() {
      const code = document.getElementById('trackingCodeInput').value || 'FD-8942';
      document.getElementById('displayOrderCode').textContent = '#' + code;
      const timeline = document.getElementById('trackingTimeline');
      if (timeline) timeline.style.display = 'block';

      const bar = document.getElementById('progressBar');
      const step1 = document.getElementById('trackStep1');
      const step2 = document.getElementById('trackStep2');
      const step3 = document.getElementById('trackStep3');
      const step4 = document.getElementById('trackStep4');

      if (bar) bar.style.width = '25%';
      showToast(\`Tracking updated for order #\${code} - Preparing 🛵\`);

      setTimeout(() => {
        if (bar) bar.style.width = '60%';
        if (step2) step2.classList.add('text-amber-400', 'scale-105');
      }, 1000);

      setTimeout(() => {
        if (bar) bar.style.width = '85%';
        if (step3) step3.classList.add('text-amber-400', 'scale-105');
        showToast(\`Order #\${code} is on the way! Arriving in ~12 mins 🛵\`);
      }, 2500);
    }

    // 8. REVIEWS SYSTEM
    function renderReviews() {
      const container = document.getElementById('reviewsContainer');
      if (!container) return;

      container.innerHTML = REVIEWS.map(r => \`
        <div class="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 space-y-4 flex flex-col justify-between shadow-xl">
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1 text-amber-400 text-xs font-bold">
                \${'★'.repeat(r.stars)}
              </div>
              <span class="text-[11px] text-stone-500 font-medium">\${r.date}</span>
            </div>
            <p class="text-xs text-stone-300 leading-relaxed font-normal">"\${r.comment}"</p>
          </div>
          <div class="flex items-center gap-3 pt-3 border-t border-stone-800/60">
            <img src="\${r.avatar}" alt="\${r.name}" class="w-9 h-9 rounded-full object-cover ring-2 ring-amber-500/30">
            <div>
              <p class="text-xs font-bold text-white">\${r.name}</p>
              <p class="text-[10px] text-emerald-400 font-semibold">✔ Verified Gourmet Diner</p>
            </div>
          </div>
        </div>
      \`).join('');
    }

    function submitReview(event) {
      const form = event.target;
      const name = form.reviewerName.value;
      const stars = parseInt(form.rating.value);
      const text = form.reviewText.value;

      REVIEWS.unshift({
        name,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        stars,
        date: 'Just now',
        comment: text
      });

      renderReviews();
      closeModal('reviewModal');
      showToast('Thank you! Your review has been published.');
      form.reset();
    }

    // 9. CONTACT FORM
    function submitContactForm(event) {
      const form = event.target;
      const name = form.name.value;
      const phone = form.phone.value;
      showToast(\`Thank you \${name}! Our concierge will contact \${phone} shortly. 🚀\`);
      form.reset();
    }

    function submitNewsletter(event) {
      showToast('Thank you for subscribing to VIP gourmet release alerts! 🍷');
      event.target.reset();
    }

    // UTILITIES
    function openModal(id) {
      const el = document.getElementById(id);
      if (el) el.style.display = 'flex';
      if (window.lucide) lucide.createIcons();
    }

    function closeModal(id) {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    }

    function toggleDrawer(id) {
      const el = document.getElementById(id);
      const overlay = document.getElementById('cartDrawerOverlay');
      if (el) {
        el.classList.toggle('translate-x-full');
        const isClosed = el.classList.contains('translate-x-full');
        if (overlay) {
          overlay.style.display = isClosed ? 'none' : 'block';
        }
      }
      if (window.lucide) lucide.createIcons();
    }

    function showToast(msg) {
      const existing = document.getElementById('globalToast');
      if (existing) existing.remove();
      
      const toast = document.createElement('div');
      toast.id = 'globalToast';
      toast.className = 'fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl bg-amber-500 text-stone-950 text-xs font-extrabold shadow-2xl transition-all duration-300 flex items-center gap-2.5';
      toast.innerHTML = '<i data-lucide="sparkles" class="w-4 h-4"></i><span>' + msg + '</span>';
      document.body.appendChild(toast);
      if (window.lucide) lucide.createIcons();
      
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
      }, 3200);
    }

    // Explicitly expose all functions on window
    window.filterCategory = filterCategory;
    window.handleSearch = handleSearch;
    window.quickAdd = quickAdd;
    window.updateQty = updateQty;
    window.removeFromCart = removeFromCart;
    window.renderCart = renderCart;
    window.renderMenu = renderMenu;
    window.renderReviews = renderReviews;
    window.openDishModal = openDishModal;
    window.processCheckout = processCheckout;
    window.simulateOrderTracking = simulateOrderTracking;
    window.submitReview = submitReview;
    window.submitContactForm = submitContactForm;
    window.submitNewsletter = submitNewsletter;
    window.handleAddressSubmit = handleAddressSubmit;
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.toggleDrawer = toggleDrawer;
    window.showToast = showToast;
  </script>
</body>
</html>`;

        const normalizedCode = normalizeHtml(fullHtml);
        site.latestCode = normalizedCode;
        await site.save();

        console.log("Successfully saved FeastDash with all 12 Cuisines & Restaurant descriptions to database!");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

updateSite();
