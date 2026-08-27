import mongoose from "mongoose";
import dotenv from "dotenv";
import Website from "../models/website.model.js";
import { normalizeHtml } from "../utils/normalizeHtml.js";

dotenv.config();

const SITE_ID = "6a8fc4c3c438ac7f645d3a98";

async function updateSite() {
    try {
        const mongoUri = process.env.MONGODB_URL || process.env.MONGO_URI;
        if (!mongoUri) {
            console.error("No MongoDB URI in env");
            process.exit(1);
        }
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB");

        const site = await Website.findById(SITE_ID);
        if (!site) {
            console.error("Site not found:", SITE_ID);
            process.exit(1);
        }

        const fullHtml = `<!DOCTYPE html>
<html lang="en" class="dark scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FeastDash | Swiggy-Grade Gourmet Food Delivery</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&display=swap" rel="stylesheet">
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
            swiggyOrange: { 400: '#ff7e33', 500: '#fc8019', 600: '#e56c0b' },
            swiggyGreen: { 500: '#00a650', 600: '#008a42' },
            stoneDark: { 950: '#0c0a09', 900: '#140f0c', 800: '#1c1714', 700: '#29221d' }
          }
        }
      }
    }
  </script>
</head>
<body class="bg-[#0c0a09] text-stone-100 font-sans min-h-screen flex flex-col selection:bg-orange-500 selection:text-black">

  <!-- TOP PROMO TICKER -->
  <div class="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 text-stone-950 font-bold text-xs py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2">
    <i data-lucide="zap" class="w-3.5 h-3.5 fill-current"></i>
    <span>⚡ SWIGGY ONE EXCLUSIVE: 50% OFF up to $100 with code <span class="underline font-extrabold cursor-pointer" onclick="applyPromoCode('SWIGGY50')">SWIGGY50</span> • Free Express Delivery in ~25 mins!</span>
  </div>

  <!-- STICKY NAVBAR -->
  <header class="sticky top-0 z-40 w-full bg-[#0c0a09]/95 backdrop-blur-xl border-b border-stone-800/80 transition-all duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
      
      <!-- BRAND & LOCATION SELECTOR -->
      <div class="flex items-center gap-6">
        <a href="#hero" class="flex items-center gap-2.5 group">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-stone-950 font-black text-xl shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <i data-lucide="utensils-crossed" class="w-5 h-5"></i>
          </div>
          <div class="flex flex-col">
            <span class="font-serif font-extrabold text-xl tracking-tight text-white group-hover:text-orange-400 transition">FeastDash</span>
            <span class="text-[9px] text-orange-400 tracking-widest uppercase font-extrabold">Swiggy Gourmet</span>
          </div>
        </a>

        <!-- LOCATION SELECTOR -->
        <div onclick="openModal('locationModal')" class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-orange-500/50 cursor-pointer transition group">
          <i data-lucide="map-pin" class="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform"></i>
          <div class="flex flex-col text-left">
            <div class="flex items-center gap-1">
              <span id="currentCityText" class="text-xs font-extrabold text-white">Indiranagar</span>
              <i data-lucide="chevron-down" class="w-3 h-3 text-stone-400"></i>
            </div>
            <span id="currentAreaText" class="text-[10px] text-stone-400 truncate max-w-[120px]">Bengaluru, Karnataka</span>
          </div>
        </div>
      </div>

      <!-- DESKTOP NAV -->
      <nav class="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-stone-300">
        <a href="#hero" class="hover:text-orange-400 transition py-1">Home</a>
        <a href="#categories" class="hover:text-orange-400 transition py-1">Cuisines</a>
        <a href="#restaurants" class="hover:text-orange-400 transition py-1">Chains</a>
        <a href="#menu" class="hover:text-orange-400 transition py-1">72 Dishes</a>
        <a href="#reviews" class="hover:text-orange-400 transition py-1">Reviews</a>
      </nav>

      <!-- HEADER ACTIONS -->
      <div class="flex items-center gap-3">
        <!-- OFFERS TRIGGER -->
        <button type="button" onclick="openModal('offersModal')" class="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs font-bold text-orange-400 hover:border-orange-500/50 transition">
          <i data-lucide="percent" class="w-4 h-4"></i>
          <span>Offers</span>
        </button>

        <!-- TRACK ORDER -->
        <a href="#tracking" class="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs font-medium text-stone-300 hover:text-white hover:border-orange-500/50 transition">
          <i data-lucide="truck" class="w-4 h-4 text-orange-500"></i>
          <span>Track</span>
        </a>

        <!-- CART BUTTON -->
        <button type="button" onclick="toggleDrawer('cartDrawer')" class="relative p-2.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-orange-500/50 text-stone-200 transition group flex items-center gap-2 cursor-pointer">
          <i data-lucide="shopping-bag" class="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform"></i>
          <span class="hidden xs:inline text-xs font-bold">Bag</span>
          <span id="cartBadgeCount" class="bg-orange-500 text-stone-950 font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-md shadow-orange-500/30">0</span>
        </button>
      </div>
    </div>
  </header>

  <!-- MAIN CONTAINER -->
  <main class="flex-1 w-full flex flex-col">

    <!-- HERO SECTION -->
    <section id="hero" class="relative py-12 lg:py-16 overflow-hidden border-b border-stone-800/60 bg-gradient-to-b from-stone-950 via-[#0f0c0a] to-[#0c0a09]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        <div class="lg:col-span-7 space-y-6">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
            <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
            <span>India's #1 Gourmet Food Network • 72 Handcrafted Dishes</span>
          </div>

          <h1 class="font-serif font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
            Craving greatness? <br>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">Delivered hot & fresh.</span>
          </h1>

          <p class="text-sm sm:text-base text-stone-400 max-w-xl leading-relaxed">
            Order from top gourmet kitchens across 9 iconic cuisines. Explore 72 signature dishes with live Swiggy partner GPS tracking.
          </p>

          <!-- SEARCH & ADDRESS BAR -->
          <div class="p-2 rounded-2xl bg-stone-900/90 border border-stone-800 max-w-xl shadow-2xl flex flex-col sm:flex-row gap-2">
            <div class="flex-1 flex items-center gap-3 px-3 py-2 bg-stone-950 rounded-xl border border-stone-800/80">
              <i data-lucide="search" class="w-4 h-4 text-orange-500"></i>
              <input type="text" id="heroSearchInput" onkeyup="handleSearch(this.value)" placeholder="Search biryani, pizza, burger, dosa, dal makhani..." class="w-full bg-transparent text-xs text-white placeholder-stone-500 focus:outline-none">
            </div>
            <button type="button" onclick="document.getElementById('menu').scrollIntoView({behavior:'smooth'})" class="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-stone-950 font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer">
              <span>Explore 72 Dishes</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
          </div>

          <!-- QUICK METRICS -->
          <div class="flex flex-wrap items-center gap-6 pt-2 text-xs text-stone-400 font-medium">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span>Avg. Delivery: <strong class="text-white">24 Mins</strong></span>
            </div>
            <div class="flex items-center gap-2">
              <i data-lucide="star" class="w-4 h-4 text-amber-400 fill-amber-400"></i>
              <span>Rating: <strong class="text-white">4.9/5 (18k+ reviews)</strong></span>
            </div>
            <div class="flex items-center gap-2">
              <i data-lucide="shield-check" class="w-4 h-4 text-orange-400"></i>
              <span>Thermal Sealed Hygiene</span>
            </div>
          </div>
        </div>

        <!-- HERO HIGHLIGHT CARDS -->
        <div class="lg:col-span-5 relative">
          <div class="relative rounded-3xl overflow-hidden border border-stone-800 shadow-2xl group">
            <img src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1000&auto=format&fit=crop&q=80" alt="Authentic Royal Biryani" class="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent"></div>
            
            <div class="absolute bottom-6 left-6 right-6 space-y-2">
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500 text-stone-950 text-[10px] font-black uppercase tracking-wider">
                ★ Today's #1 Pick
              </div>
              <h3 class="font-serif font-extrabold text-2xl text-white">Hyderabadi Dum Gosht Biryani</h3>
              <p class="text-xs text-stone-300">Slow cooked with Kashmiri saffron & royal spices in traditional handi.</p>
              <div class="flex items-center justify-between pt-2">
                <span class="text-xl font-serif font-black text-orange-400">$24.00</span>
                <button type="button" onclick="quickAdd('bir-1')" class="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-stone-950 font-extrabold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-orange-500/20">
                  <i data-lucide="shopping-bag" class="w-3.5 h-3.5"></i>
                  <span>Add to Bag</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- "WHAT'S ON YOUR MIND?" SWIGGY CIRCULAR CUISINE CAROUSEL -->
    <section id="categories" class="py-10 bg-[#0c0a09] border-b border-stone-800/80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div class="flex items-center justify-between">
          <div>
            <h2 class="font-serif font-extrabold text-2xl text-white">What's on your mind?</h2>
            <p class="text-xs text-stone-400">Select any cuisine to browse 8 authentic dishes</p>
          </div>
          <span class="text-xs text-orange-400 font-bold">9 Cuisines • 8 Dishes Each</span>
        </div>

        <!-- CIRCULAR CUISINE STRIP -->
        <div class="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-4 text-center">
          
          <!-- 1. BIRYANI -->
          <div onclick="filterCategory('biryani')" class="cursor-pointer group flex flex-col items-center gap-2">
            <div id="circ-biryani" class="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-stone-800 group-hover:border-orange-500 transition-all p-1 bg-stone-900 group-hover:scale-105 shadow-lg">
              <img src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=300&auto=format&fit=crop&q=80" alt="Biryani" class="w-full h-full object-cover rounded-full">
            </div>
            <span class="text-xs font-bold text-stone-300 group-hover:text-orange-400 transition">Biryani (8)</span>
          </div>

          <!-- 2. PIZZA -->
          <div onclick="filterCategory('pizza')" class="cursor-pointer group flex flex-col items-center gap-2">
            <div id="circ-pizza" class="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-stone-800 group-hover:border-orange-500 transition-all p-1 bg-stone-900 group-hover:scale-105 shadow-lg">
              <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop&q=80" alt="Pizza" class="w-full h-full object-cover rounded-full">
            </div>
            <span class="text-xs font-bold text-stone-300 group-hover:text-orange-400 transition">Pizza (8)</span>
          </div>

          <!-- 3. BURGERS -->
          <div onclick="filterCategory('burgers')" class="cursor-pointer group flex flex-col items-center gap-2">
            <div id="circ-burgers" class="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-stone-800 group-hover:border-orange-500 transition-all p-1 bg-stone-900 group-hover:scale-105 shadow-lg">
              <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=80" alt="Burgers" class="w-full h-full object-cover rounded-full">
            </div>
            <span class="text-xs font-bold text-stone-300 group-hover:text-orange-400 transition">Burgers (8)</span>
          </div>

          <!-- 4. INDIAN -->
          <div onclick="filterCategory('indian')" class="cursor-pointer group flex flex-col items-center gap-2">
            <div id="circ-indian" class="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-stone-800 group-hover:border-orange-500 transition-all p-1 bg-stone-900 group-hover:scale-105 shadow-lg">
              <img src="https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=300&auto=format&fit=crop&q=80" alt="Indian" class="w-full h-full object-cover rounded-full">
            </div>
            <span class="text-xs font-bold text-stone-300 group-hover:text-orange-400 transition">Indian (8)</span>
          </div>

          <!-- 5. CHINESE -->
          <div onclick="filterCategory('chinese')" class="cursor-pointer group flex flex-col items-center gap-2">
            <div id="circ-chinese" class="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-stone-800 group-hover:border-orange-500 transition-all p-1 bg-stone-900 group-hover:scale-105 shadow-lg">
              <img src="https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=300&auto=format&fit=crop&q=80" alt="Chinese" class="w-full h-full object-cover rounded-full">
            </div>
            <span class="text-xs font-bold text-stone-300 group-hover:text-orange-400 transition">Chinese (8)</span>
          </div>

          <!-- 6. SOUTH INDIAN -->
          <div onclick="filterCategory('south-indian')" class="cursor-pointer group flex flex-col items-center gap-2">
            <div id="circ-south-indian" class="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-stone-800 group-hover:border-orange-500 transition-all p-1 bg-stone-900 group-hover:scale-105 shadow-lg">
              <img src="https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=300&auto=format&fit=crop&q=80" alt="South Indian" class="w-full h-full object-cover rounded-full">
            </div>
            <span class="text-xs font-bold text-stone-300 group-hover:text-orange-400 transition">South Ind (8)</span>
          </div>

          <!-- 7. DESSERTS -->
          <div onclick="filterCategory('desserts')" class="cursor-pointer group flex flex-col items-center gap-2">
            <div id="circ-desserts" class="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-stone-800 group-hover:border-orange-500 transition-all p-1 bg-stone-900 group-hover:scale-105 shadow-lg">
              <img src="https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&auto=format&fit=crop&q=80" alt="Desserts" class="w-full h-full object-cover rounded-full">
            </div>
            <span class="text-xs font-bold text-stone-300 group-hover:text-orange-400 transition">Desserts (8)</span>
          </div>

          <!-- 8. HEALTHY -->
          <div onclick="filterCategory('healthy')" class="cursor-pointer group flex flex-col items-center gap-2">
            <div id="circ-healthy" class="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-stone-800 group-hover:border-orange-500 transition-all p-1 bg-stone-900 group-hover:scale-105 shadow-lg">
              <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80" alt="Healthy" class="w-full h-full object-cover rounded-full">
            </div>
            <span class="text-xs font-bold text-stone-300 group-hover:text-orange-400 transition">Healthy (8)</span>
          </div>

          <!-- 9. DRINKS -->
          <div onclick="filterCategory('drinks')" class="cursor-pointer group flex flex-col items-center gap-2">
            <div id="circ-drinks" class="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-stone-800 group-hover:border-orange-500 transition-all p-1 bg-stone-900 group-hover:scale-105 shadow-lg">
              <img src="https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300&auto=format&fit=crop&q=80" alt="Drinks" class="w-full h-full object-cover rounded-full">
            </div>
            <span class="text-xs font-bold text-stone-300 group-hover:text-orange-400 transition">Drinks (8)</span>
          </div>

        </div>
      </div>
    </section>

    <!-- TOP RESTAURANT CHAINS IN YOUR AREA -->
    <section id="restaurants" class="py-12 bg-stone-950/60 border-b border-stone-800/80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div class="flex items-center justify-between">
          <div>
            <h2 class="font-serif font-extrabold text-2xl text-white">Top Restaurant Chains in Bengaluru</h2>
            <p class="text-xs text-stone-400">Famous master kitchens with exclusive discounts</p>
          </div>
          <button type="button" onclick="document.getElementById('menu').scrollIntoView({behavior:'smooth'})" class="text-xs text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1">
            <span>View All 72 Dishes</span>
            <i data-lucide="chevron-right" class="w-4 h-4"></i>
          </button>
        </div>

        <!-- RESTAURANT CHAINS GRID -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <!-- 1. MEGHANA BIRYANI -->
          <div class="rounded-3xl bg-stone-900/80 border border-stone-800 overflow-hidden hover:border-orange-500/50 transition-all duration-300 shadow-xl group flex flex-col justify-between">
            <div class="relative h-44 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80" alt="Meghana Foods" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
              <div class="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[11px] font-black text-orange-400 border border-orange-500/30">
                50% OFF UP TO $100
              </div>
            </div>
            <div class="p-5 space-y-2">
              <div class="flex items-center justify-between">
                <h3 class="font-serif font-extrabold text-base text-white">Meghana Royal Biryani</h3>
                <span class="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[11px] font-black">★ 4.9</span>
              </div>
              <p class="text-xs text-stone-400">Biryani, Andhra Spicy, Kebabs</p>
              <div class="flex items-center justify-between pt-2 border-t border-stone-800 text-[11px] text-stone-400">
                <span>Indiranagar • 2.1 km</span>
                <button onclick="filterCategory('biryani')" class="text-orange-400 font-extrabold hover:underline">Explore 8 Dishes ➔</button>
              </div>
            </div>
          </div>

          <!-- 2. NAPOLI STONE PIZZA -->
          <div class="rounded-3xl bg-stone-900/80 border border-stone-800 overflow-hidden hover:border-orange-500/50 transition-all duration-300 shadow-xl group flex flex-col justify-between">
            <div class="relative h-44 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80" alt="Napoli Stone" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
              <div class="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[11px] font-black text-orange-400 border border-orange-500/30">
                ITEMS AT $14.99
              </div>
            </div>
            <div class="p-5 space-y-2">
              <div class="flex items-center justify-between">
                <h3 class="font-serif font-extrabold text-base text-white">Napoli Wood-Fired Co.</h3>
                <span class="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[11px] font-black">★ 4.8</span>
              </div>
              <p class="text-xs text-stone-400">Neapolitan Pizza, Pastas, Burrata</p>
              <div class="flex items-center justify-between pt-2 border-t border-stone-800 text-[11px] text-stone-400">
                <span>Koramangala • 3.4 km</span>
                <button onclick="filterCategory('pizza')" class="text-orange-400 font-extrabold hover:underline">Explore 8 Dishes ➔</button>
              </div>
            </div>
          </div>

          <!-- 3. TRUFFLES BURGERS -->
          <div class="rounded-3xl bg-stone-900/80 border border-stone-800 overflow-hidden hover:border-orange-500/50 transition-all duration-300 shadow-xl group flex flex-col justify-between">
            <div class="relative h-44 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80" alt="Truffles Burgers" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
              <div class="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[11px] font-black text-orange-400 border border-orange-500/30">
                FLAT 20% OFF
              </div>
            </div>
            <div class="p-5 space-y-2">
              <div class="flex items-center justify-between">
                <h3 class="font-serif font-extrabold text-base text-white">Truffles Smash Burger Lab</h3>
                <span class="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[11px] font-black">★ 4.9</span>
              </div>
              <p class="text-xs text-stone-400">Wagyu Smash, Truffle Fries, Shakes</p>
              <div class="flex items-center justify-between pt-2 border-t border-stone-800 text-[11px] text-stone-400">
                <span>MG Road • 1.5 km</span>
                <button onclick="filterCategory('burgers')" class="text-orange-400 font-extrabold hover:underline">Explore 8 Dishes ➔</button>
              </div>
            </div>
          </div>

          <!-- 4. DAKSHIN DOSA TIFFINS -->
          <div class="rounded-3xl bg-stone-900/80 border border-stone-800 overflow-hidden hover:border-orange-500/50 transition-all duration-300 shadow-xl group flex flex-col justify-between">
            <div class="relative h-44 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80" alt="Dakshin Tiffins" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
              <div class="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[11px] font-black text-orange-400 border border-orange-500/30">
                FREE FILTER COFFEE
              </div>
            </div>
            <div class="p-5 space-y-2">
              <div class="flex items-center justify-between">
                <h3 class="font-serif font-extrabold text-base text-white">Dakshin Ghee Tiffins</h3>
                <span class="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[11px] font-black">★ 4.9</span>
              </div>
              <p class="text-xs text-stone-400">Ghee Roast Dosa, Idli, Medu Vada</p>
              <div class="flex items-center justify-between pt-2 border-t border-stone-800 text-[11px] text-stone-400">
                <span>Jayanagar • 4.0 km</span>
                <button onclick="filterCategory('south-indian')" class="text-orange-400 font-extrabold hover:underline">Explore 8 Dishes ➔</button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- FULL 72 DISHES MENU SECTION -->
    <section id="menu" class="py-14 bg-[#0c0a09]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <!-- SECTION TITLE & FILTERS -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-800">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-extrabold">
              <span id="activeCuisineBadge">All Cuisines (72 Dishes)</span>
            </div>
            <h2 id="menuHeading" class="font-serif font-extrabold text-3xl sm:text-4xl text-white">Gourmet Food Catalog</h2>
            <p class="text-xs text-stone-400">8 signature dishes handcrafted across each of our 9 culinary departments</p>
          </div>

          <!-- SWIGGY VEG / NON-VEG TOGGLES -->
          <div class="flex flex-wrap items-center gap-2">
            <button type="button" id="vegFilterAll" onclick="setDietaryFilter('all')" class="px-3.5 py-2 rounded-xl bg-orange-500 text-stone-950 font-extrabold text-xs transition cursor-pointer">
              All (72)
            </button>
            <button type="button" id="vegFilterVeg" onclick="setDietaryFilter('veg')" class="px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-emerald-500 text-stone-300 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Pure Veg Only</span>
            </button>
            <button type="button" id="vegFilterNonVeg" onclick="setDietaryFilter('nonveg')" class="px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-red-500 text-stone-300 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer">
              <span class="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span>Non-Veg</span>
            </button>
          </div>
        </div>

        <!-- 9 CUISINE FILTER PILLS -->
        <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button onclick="filterCategory('all')" id="tab-all" class="px-4 py-2 rounded-xl bg-orange-500 text-stone-950 font-black text-xs whitespace-nowrap transition cursor-pointer">
            ✨ All (72)
          </button>
          <button onclick="filterCategory('biryani')" id="tab-biryani" class="px-4 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-orange-500/50 text-stone-300 font-bold text-xs whitespace-nowrap transition cursor-pointer">
            🍛 Biryani (8)
          </button>
          <button onclick="filterCategory('pizza')" id="tab-pizza" class="px-4 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-orange-500/50 text-stone-300 font-bold text-xs whitespace-nowrap transition cursor-pointer">
            🍕 Pizza (8)
          </button>
          <button onclick="filterCategory('burgers')" id="tab-burgers" class="px-4 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-orange-500/50 text-stone-300 font-bold text-xs whitespace-nowrap transition cursor-pointer">
            🍔 Burgers (8)
          </button>
          <button onclick="filterCategory('indian')" id="tab-indian" class="px-4 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-orange-500/50 text-stone-300 font-bold text-xs whitespace-nowrap transition cursor-pointer">
            🇮🇳 Indian (8)
          </button>
          <button onclick="filterCategory('chinese')" id="tab-chinese" class="px-4 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-orange-500/50 text-stone-300 font-bold text-xs whitespace-nowrap transition cursor-pointer">
            🥡 Chinese (8)
          </button>
          <button onclick="filterCategory('south-indian')" id="tab-south-indian" class="px-4 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-orange-500/50 text-stone-300 font-bold text-xs whitespace-nowrap transition cursor-pointer">
            🥞 South Indian (8)
          </button>
          <button onclick="filterCategory('desserts')" id="tab-desserts" class="px-4 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-orange-500/50 text-stone-300 font-bold text-xs whitespace-nowrap transition cursor-pointer">
            🍰 Desserts (8)
          </button>
          <button onclick="filterCategory('healthy')" id="tab-healthy" class="px-4 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-orange-500/50 text-stone-300 font-bold text-xs whitespace-nowrap transition cursor-pointer">
            🥗 Healthy (8)
          </button>
          <button onclick="filterCategory('drinks')" id="tab-drinks" class="px-4 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-orange-500/50 text-stone-300 font-bold text-xs whitespace-nowrap transition cursor-pointer">
            🥤 Drinks (8)
          </button>
        </div>

        <!-- SEARCH INPUT -->
        <div class="relative">
          <i data-lucide="search" class="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2"></i>
          <input type="text" id="menuSearchInput" onkeyup="handleSearch(this.value)" placeholder="Search any of 72 dishes by name, ingredients, or cuisine..." class="w-full pl-11 pr-4 py-3 rounded-2xl bg-stone-900/90 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-orange-500 transition">
        </div>

        <!-- 72 DISHES GRID -->
        <div id="menuGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Dynamically Rendered via JS -->
        </div>

      </div>
    </section>

    <!-- LIVE ORDER TRACKING SECTION -->
    <section id="tracking" class="py-14 bg-stone-950 border-t border-stone-800/80">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div class="text-center space-y-2">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Swiggy Live Partner Tracking</span>
          </div>
          <h2 class="font-serif font-extrabold text-3xl text-white">Track Your Gourmet Order</h2>
          <p class="text-xs text-stone-400">Enter your order ID (e.g. #FD-8942) or place an order to see live GPS simulation</p>
        </div>

        <!-- TRACKING INPUT FORM -->
        <form onsubmit="event.preventDefault(); simulateOrderTracking()" class="flex gap-2 max-w-md mx-auto">
          <input type="text" id="trackingCodeInput" value="FD-8942" placeholder="Enter Order ID" class="flex-1 px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-xs font-bold text-white focus:outline-none focus:border-orange-500">
          <button type="submit" class="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-stone-950 font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-orange-500/20 cursor-pointer">
            Track
          </button>
        </form>

        <!-- LIVE TRACKING TIMELINE CARD -->
        <div id="trackingTimeline" class="p-6 sm:p-8 rounded-3xl bg-stone-900/90 border border-stone-800 space-y-6 shadow-2xl">
          
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
            <div>
              <span class="text-[10px] uppercase font-black tracking-widest text-orange-500">Active Live Order</span>
              <h3 id="displayOrderCode" class="font-serif font-extrabold text-xl text-white">#FD-8942</h3>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <i data-lucide="bike" class="w-5 h-5"></i>
              </div>
              <div>
                <p class="text-xs font-extrabold text-white">Ramesh Kumar (★ 4.9)</p>
                <p class="text-[10px] text-emerald-400 font-semibold">Thermal Sealed • Arriving in ~18 Mins</p>
              </div>
            </div>
          </div>

          <!-- PROGRESS BAR -->
          <div class="space-y-2">
            <div class="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
              <div id="progressBar" class="bg-gradient-to-r from-orange-500 to-emerald-500 h-full w-[65%] transition-all duration-700"></div>
            </div>
            <div class="grid grid-cols-4 text-[10px] font-bold text-stone-400 text-center pt-1">
              <span id="trackStep1" class="text-orange-400">1. Placed</span>
              <span id="trackStep2" class="text-orange-400">2. In Kitchen</span>
              <span id="trackStep3" class="text-emerald-400 font-extrabold">3. On the Way 🛵</span>
              <span id="trackStep4">4. Delivered</span>
            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- DINER REVIEWS SECTION -->
    <section id="reviews" class="py-14 bg-[#0c0a09] border-t border-stone-800/80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 class="font-serif font-extrabold text-3xl text-white">Verified Diner Reviews</h2>
            <p class="text-xs text-stone-400">Real feedback from gourmet food lovers across Bengaluru</p>
          </div>
          <button type="button" onclick="openModal('reviewModal')" class="px-5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-orange-500/50 text-xs font-bold text-white transition flex items-center gap-2 cursor-pointer">
            <i data-lucide="edit-3" class="w-4 h-4 text-orange-500"></i>
            <span>Share Feedback</span>
          </button>
        </div>

        <div id="reviewsContainer" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Dynamic reviews -->
        </div>
      </div>
    </section>

  </main>

  <!-- FOOTER -->
  <footer class="bg-stone-950 border-t border-stone-800 pt-12 pb-8 text-xs text-stone-400">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center text-stone-950 font-black">
              <i data-lucide="utensils-crossed" class="w-4 h-4"></i>
            </div>
            <span class="font-serif font-extrabold text-lg text-white">FeastDash</span>
          </div>
          <p class="text-xs text-stone-400 leading-relaxed">
            Delivering artisanal gourmet dishes from 9 iconic culinary departments straight to your doorstep.
          </p>
          <p class="text-[11px] text-stone-500">© 2026 FeastDash India Inc. All rights reserved.</p>
        </div>

        <div class="space-y-2">
          <h4 class="font-bold text-white uppercase tracking-wider text-[11px]">Explore 9 Cuisines</h4>
          <div class="grid grid-cols-2 gap-1 text-xs">
            <button onclick="filterCategory('biryani')" class="text-left text-stone-400 hover:text-orange-400 transition">🍛 Biryani (8)</button>
            <button onclick="filterCategory('pizza')" class="text-left text-stone-400 hover:text-orange-400 transition">🍕 Pizza (8)</button>
            <button onclick="filterCategory('burgers')" class="text-left text-stone-400 hover:text-orange-400 transition">🍔 Burgers (8)</button>
            <button onclick="filterCategory('indian')" class="text-left text-stone-400 hover:text-orange-400 transition">🇮🇳 Indian (8)</button>
            <button onclick="filterCategory('chinese')" class="text-left text-stone-400 hover:text-orange-400 transition">🥡 Chinese (8)</button>
            <button onclick="filterCategory('south-indian')" class="text-left text-stone-400 hover:text-orange-400 transition">🥞 South Ind (8)</button>
            <button onclick="filterCategory('desserts')" class="text-left text-stone-400 hover:text-orange-400 transition">🍰 Desserts (8)</button>
            <button onclick="filterCategory('healthy')" class="text-left text-stone-400 hover:text-orange-400 transition">🥗 Healthy (8)</button>
            <button onclick="filterCategory('drinks')" class="text-left text-stone-400 hover:text-orange-400 transition">🥤 Drinks (8)</button>
          </div>
        </div>

        <div class="space-y-2">
          <h4 class="font-bold text-white uppercase tracking-wider text-[11px]">Delivery Locations</h4>
          <ul class="space-y-1 text-stone-400 text-xs">
            <li>• Indiranagar, Bengaluru</li>
            <li>• Koramangala, Bengaluru</li>
            <li>• Whitefield, Bengaluru</li>
            <li>• Jayanagar, Bengaluru</li>
            <li>• MG Road & CBD</li>
          </ul>
        </div>

        <div class="space-y-3">
          <h4 class="font-bold text-white uppercase tracking-wider text-[11px]">VIP Gourmet Alerts</h4>
          <form onsubmit="event.preventDefault(); submitNewsletter(event)" class="flex gap-2">
            <input type="email" required placeholder="Enter your email" class="flex-1 px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white focus:outline-none focus:border-orange-500">
            <button type="submit" class="px-4 py-2 rounded-xl bg-orange-500 text-stone-950 font-extrabold text-xs cursor-pointer">Join</button>
          </form>
          <button onclick="window.scrollTo({top: 0, behavior: 'smooth'})" class="text-xs text-orange-400 hover:underline flex items-center gap-1">
            <span>Back to top</span>
            <i data-lucide="arrow-up" class="w-3.5 h-3.5"></i>
          </button>
        </div>

      </div>

    </div>
  </footer>

  <!-- ==================== SWIGGY FLOATING BOTTOM CART BAR ==================== -->
  <div id="floatingBottomCart" onclick="toggleDrawer('cartDrawer')" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center justify-between gap-6 cursor-pointer border border-emerald-400/30 transition-all duration-300 scale-95 opacity-0 pointer-events-none w-[90%] max-w-md">
    <div class="flex items-center gap-3">
      <span id="floatingCartCount" class="bg-black/30 text-white font-black text-xs px-2.5 py-1 rounded-lg">0 ITEMS</span>
      <span id="floatingCartTotal" class="font-extrabold text-sm">$0.00</span>
    </div>
    <div class="flex items-center gap-1.5 font-black text-xs uppercase tracking-wider">
      <span>View Cart</span>
      <i data-lucide="arrow-right" class="w-4 h-4"></i>
    </div>
  </div>

  <!-- ==================== MODALS & DRAWERS ==================== -->

  <!-- DRAWER OVERLAY BACKDROP -->
  <div id="cartDrawerOverlay" onclick="toggleDrawer('cartDrawer')" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300" style="display: none;"></div>

  <!-- SWIGGY SLIDE-OUT CART DRAWER -->
  <div id="cartDrawer" class="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-stone-950 border-l border-stone-800 p-6 flex flex-col justify-between shadow-2xl translate-x-full transition-transform duration-300 ease-in-out">
    
    <div class="space-y-4">
      <!-- DRAWER HEADER -->
      <div class="flex items-center justify-between pb-4 border-b border-stone-800">
        <div class="flex items-center gap-2">
          <i data-lucide="shopping-bag" class="w-5 h-5 text-orange-400"></i>
          <h3 class="font-serif font-extrabold text-lg text-white">Your Delivery Bag</h3>
        </div>
        <button type="button" onclick="toggleDrawer('cartDrawer')" class="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition cursor-pointer">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- PROMO CODE INPUT -->
      <div class="p-3 rounded-2xl bg-stone-900/80 border border-stone-800 flex items-center gap-2">
        <i data-lucide="tag" class="w-4 h-4 text-orange-500"></i>
        <input type="text" id="couponInput" placeholder="Enter coupon (e.g. SWIGGY50)" class="flex-1 bg-transparent text-xs font-bold text-white uppercase placeholder-stone-500 focus:outline-none">
        <button type="button" onclick="applyEnteredCoupon()" class="px-3 py-1.5 rounded-xl bg-orange-500 text-stone-950 font-black text-xs cursor-pointer">Apply</button>
      </div>

      <!-- DYNAMIC CART ITEMS CONTAINER -->
      <div id="cartItemsContainer" class="py-2 space-y-3 max-h-[45vh] overflow-y-auto pr-1">
        <!-- Dynamically rendered items -->
      </div>
    </div>

    <!-- DRAWER FOOTER / BILL DETAILS -->
    <div id="cartFooter" class="border-t border-stone-800 pt-4 space-y-4">
      <div class="space-y-1.5 text-xs text-stone-400">
        <div class="flex justify-between">
          <span>Item Total</span>
          <span id="cartSubtotalText" class="font-bold text-white">$0.00</span>
        </div>
        <div class="flex justify-between" id="discountRow" style="display: none;">
          <span class="text-emerald-400">Coupon Discount</span>
          <span id="cartDiscountText" class="font-bold text-emerald-400">-$0.00</span>
        </div>
        <div class="flex justify-between">
          <span>Express Delivery Fee</span>
          <span id="cartDeliveryFee" class="font-bold text-emerald-400">$3.99</span>
        </div>
        <div class="flex justify-between">
          <span>Platform Fee & Govt. Taxes</span>
          <span class="font-bold text-stone-300">$1.50</span>
        </div>
        <div class="flex justify-between text-sm font-bold text-white pt-2 border-t border-stone-800/60">
          <span>To Pay</span>
          <span id="cartTotalText" class="text-orange-400 font-extrabold text-base">$5.49</span>
        </div>
      </div>

      <button type="button" id="checkoutBtn" onclick="openModal('checkoutModal')" disabled class="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer">
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
          <i data-lucide="credit-card" class="w-5 h-5 text-orange-500"></i>
          <span>Complete Your Swiggy Order</span>
        </h3>
        <button type="button" onclick="closeModal('checkoutModal')" class="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white transition cursor-pointer">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>

      <form onsubmit="event.preventDefault(); processCheckout(event)" class="space-y-4">
        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-stone-300">Full Name</label>
          <input type="text" name="name" required placeholder="Aarav Sharma" class="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs font-medium text-white focus:outline-none focus:border-orange-500 transition">
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-stone-300">Email Address</label>
            <input type="email" name="email" required placeholder="aarav@example.com" class="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs font-medium text-white focus:outline-none focus:border-orange-500 transition">
          </div>
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-stone-300">Phone Number</label>
            <input type="tel" name="phone" required placeholder="+91 98765 43210" class="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs font-medium text-white focus:outline-none focus:border-orange-500 transition">
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-stone-300">Delivery Street Address</label>
          <input type="text" name="address" required placeholder="Flat 402, Prestige Tower, 12th Main Indiranagar" class="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs font-medium text-white focus:outline-none focus:border-orange-500 transition">
        </div>

        <!-- LIVE CHECKOUT BILL SUMMARY WITH COUPON -->
        <div id="checkoutBillSummary" class="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 space-y-1.5 text-xs text-stone-400">
          <div class="flex justify-between">
            <span>Subtotal</span>
            <span id="checkoutSubtotal" class="font-bold text-white">$0.00</span>
          </div>
          <div class="flex justify-between" id="checkoutDiscountRow" style="display: none;">
            <span id="checkoutCouponLabel" class="text-emerald-400 font-bold">Coupon Savings (SWIGGY50)</span>
            <span id="checkoutDiscountAmount" class="font-bold text-emerald-400">-$0.00</span>
          </div>
          <div class="flex justify-between">
            <span>Delivery & Platform Fee</span>
            <span id="checkoutFees" class="font-bold text-stone-300">$5.49</span>
          </div>
          <div class="flex justify-between font-black text-sm text-white pt-2 border-t border-stone-800">
            <span>Final Amount to Pay</span>
            <span id="checkoutFinalAmount" class="text-orange-400 font-black text-base">$0.00</span>
          </div>
        </div>

        <div class="space-y-2 pt-2">
          <label class="block text-xs font-bold text-stone-300">Payment Option</label>
          <div class="grid grid-cols-3 gap-2">
            <label class="p-3 rounded-xl border border-orange-500 bg-orange-500/10 flex flex-col items-center justify-center gap-1 cursor-pointer text-center">
              <input type="radio" name="payMethod" value="UPI" checked class="hidden">
              <i data-lucide="qr-code" class="w-4 h-4 text-orange-400"></i>
              <span class="text-[11px] font-bold text-white">Instant UPI</span>
            </label>
            <label class="p-3 rounded-xl border border-stone-800 bg-stone-950 flex flex-col items-center justify-center gap-1 cursor-pointer text-center hover:border-orange-500/50 transition">
              <input type="radio" name="payMethod" value="Card" class="hidden">
              <i data-lucide="credit-card" class="w-4 h-4 text-stone-400"></i>
              <span class="text-[11px] font-bold text-white">Credit Card</span>
            </label>
            <label class="p-3 rounded-xl border border-stone-800 bg-stone-950 flex flex-col items-center justify-center gap-1 cursor-pointer text-center hover:border-orange-500/50 transition">
              <input type="radio" name="payMethod" value="COD" class="hidden">
              <i data-lucide="banknote" class="w-4 h-4 text-stone-400"></i>
              <span class="text-[11px] font-bold text-white">Pay on Delivery</span>
            </label>
          </div>
        </div>

        <button type="submit" class="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 mt-4 cursor-pointer">
          <i data-lucide="check-circle-2" class="w-4 h-4"></i>
          <span>Place Order Now</span>
        </button>
      </form>

    </div>
  </div>

  <!-- DISH DETAIL MODAL -->
  <div id="dishModal" onclick="if(event.target === this) closeModal('dishModal')" style="display: none;" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
    <div class="bg-stone-900 border border-stone-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative flex flex-col">
      <div class="relative h-64 w-full">
        <img id="modalDishImage" src="" alt="Dish Preview" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-black/40"></div>
        <button type="button" onclick="closeModal('dishModal')" class="absolute top-4 right-4 p-2 rounded-full bg-stone-950/80 text-white hover:bg-stone-900 transition cursor-pointer">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
      
      <div class="p-6 space-y-4">
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <span id="modalDishVegBadge" class="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span id="modalDishCategory" class="text-[10px] font-extrabold uppercase tracking-widest text-orange-500">Cuisine</span>
            </div>
            <h3 id="modalDishTitle" class="font-serif font-extrabold text-2xl text-white">Dish Name</h3>
          </div>
          <span id="modalDishPrice" class="font-serif font-black text-2xl text-orange-400">$0.00</span>
        </div>

        <p id="modalDishDesc" class="text-xs text-stone-300 leading-relaxed">Detailed dish description</p>

        <div class="pt-2 border-t border-stone-800 flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs text-stone-400 font-medium">
            <i data-lucide="clock" class="w-4 h-4 text-orange-500"></i>
            <span id="modalDishPrep">Prep: 20-25 mins</span>
          </div>
          <button id="modalAddBtn" type="button" class="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-stone-950 font-extrabold text-xs transition uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-orange-500/20 cursor-pointer">
            <i data-lucide="shopping-bag" class="w-4 h-4"></i>
            <span>Add to Bag</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- OFFERS MODAL -->
  <div id="offersModal" onclick="if(event.target === this) closeModal('offersModal')" style="display: none;" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
    <div class="bg-stone-900 border border-stone-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
      <div class="flex items-center justify-between border-b border-stone-800 pb-3">
        <h3 class="font-serif font-extrabold text-lg text-white flex items-center gap-2">
          <i data-lucide="percent" class="w-5 h-5 text-orange-500"></i>
          <span>Available Swiggy Coupons</span>
        </h3>
        <button type="button" onclick="closeModal('offersModal')" class="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white transition cursor-pointer">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>

      <div class="space-y-3">
        <div class="p-4 rounded-2xl bg-stone-950 border border-orange-500/40 space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-extrabold text-sm text-orange-400">SWIGGY50</span>
            <button onclick="applyPromoCode('SWIGGY50'); closeModal('offersModal');" class="text-xs font-black text-white bg-orange-500 px-3 py-1 rounded-lg">APPLY</button>
          </div>
          <p class="text-xs text-stone-300">50% OFF up to $100 on all orders above $20.</p>
        </div>

        <div class="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-extrabold text-sm text-emerald-400">FREEDEL</span>
            <button onclick="applyPromoCode('FREEDEL'); closeModal('offersModal');" class="text-xs font-black text-white bg-stone-800 hover:bg-orange-500 px-3 py-1 rounded-lg">APPLY</button>
          </div>
          <p class="text-xs text-stone-300">100% Free Express Delivery on orders above $15.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- LOCATION SELECTOR MODAL -->
  <div id="locationModal" onclick="if(event.target === this) closeModal('locationModal')" style="display: none;" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
    <div class="bg-stone-900 border border-stone-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
      <div class="flex items-center justify-between border-b border-stone-800 pb-3">
        <h3 class="font-serif font-extrabold text-lg text-white">Select Delivery Area</h3>
        <button type="button" onclick="closeModal('locationModal')" class="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white transition cursor-pointer">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>

      <div class="space-y-2">
        <button onclick="selectLocation('Indiranagar', 'Bengaluru, Karnataka')" class="w-full text-left p-3 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 flex items-center justify-between transition">
          <div>
            <p class="text-xs font-bold text-white">Indiranagar</p>
            <p class="text-[10px] text-stone-400">100ft Road, Defence Colony</p>
          </div>
          <span class="text-xs text-emerald-400 font-bold">20 min delivery</span>
        </button>
        <button onclick="selectLocation('Koramangala', 'Bengaluru, Karnataka')" class="w-full text-left p-3 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 flex items-center justify-between transition">
          <div>
            <p class="text-xs font-bold text-white">Koramangala</p>
            <p class="text-[10px] text-stone-400">5th Block, Sony World Signal</p>
          </div>
          <span class="text-xs text-emerald-400 font-bold">25 min delivery</span>
        </button>
        <button onclick="selectLocation('Whitefield', 'Bengaluru, Karnataka')" class="w-full text-left p-3 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 flex items-center justify-between transition">
          <div>
            <p class="text-xs font-bold text-white">Whitefield</p>
            <p class="text-[10px] text-stone-400">ITPL Main Road, Hope Farm</p>
          </div>
          <span class="text-xs text-emerald-400 font-bold">28 min delivery</span>
        </button>
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
          <input type="text" name="reviewerName" required placeholder="e.g. Sarah Jenkins" class="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none focus:border-orange-500 transition">
        </div>

        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-stone-300">Rating</label>
          <select name="rating" class="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-orange-500 transition">
            <option value="5">★★★★★ (5/5) - Phenomenal!</option>
            <option value="4">★★★★☆ (4/5) - Delicious</option>
            <option value="3">★★★☆☆ (3/5) - Average</option>
          </select>
        </div>

        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-stone-300">Review</label>
          <textarea name="reviewText" rows="3" required placeholder="How was the taste, presentation, and delivery speed?" class="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none focus:border-orange-500 transition resize-none"></textarea>
        </div>

        <button type="submit" class="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-stone-950 font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-orange-500/20 cursor-pointer">
          Publish Review
        </button>
      </form>
    </div>
  </div>

  <!-- JAVASCRIPT LOGIC & COMPLETE 72 DISHES DATASET -->
  <script>
    // ==========================================
    // COMPLETE 72 DISHES DATASET (9 CUISINES X 8 DISHES)
    // ==========================================
    const DISHES = [
      // 1. BIRYANI (8 DISHES)
      {
        id: 'bir-1',
        title: 'Hyderabadi Dum Gosht Mutton Biryani',
        category: 'biryani',
        price: 24.00,
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80',
        badge: 'Bestseller',
        isVeg: false,
        rating: 4.9,
        ratingCount: 1420,
        desc: 'Earthen pot slow dum biryani with tender marinated lamb chunks, aged basmati rice, Kashmiri saffron, and fried onions.',
        prepTime: '25 mins'
      },
      {
        id: 'bir-2',
        title: 'Royal Awadhi Chicken Dum Biryani',
        category: 'biryani',
        price: 21.50,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
        badge: 'Chef Special',
        isVeg: false,
        rating: 4.8,
        ratingCount: 980,
        desc: 'Lucknowi style fragrant basmati layered with succulent bone-in chicken infused with ittar, mace, and cardamom.',
        prepTime: '20 mins'
      },
      {
        id: 'bir-3',
        title: 'Nizami Subz Dum Paneer Biryani',
        category: 'biryani',
        price: 18.00,
        image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80',
        badge: 'Pure Veg',
        isVeg: true,
        rating: 4.7,
        ratingCount: 760,
        desc: 'Charcoal roasted malai paneer cubes, french beans, carrots, and saffron basmati infused with mint salan.',
        prepTime: '20 mins'
      },
      {
        id: 'bir-4',
        title: 'Kolkata Egg & Saffron Potato Biryani',
        category: 'biryani',
        price: 17.50,
        image: 'https://images.unsplash.com/photo-1630851840633-f96999247032?w=800&auto=format&fit=crop&q=80',
        badge: 'Heritage',
        isVeg: false,
        rating: 4.7,
        ratingCount: 540,
        desc: 'Famous light golden Kolkata style biryani with soft spiced potato, boiled farm eggs, and subtle kewra water aroma.',
        prepTime: '15 mins'
      },
      {
        id: 'bir-5',
        title: 'Thalassery Malabar Prawns Biryani',
        category: 'biryani',
        price: 26.00,
        image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&auto=format&fit=crop&q=80',
        badge: 'Seafood Special',
        isVeg: false,
        rating: 4.9,
        ratingCount: 620,
        desc: 'Kerala coastal Kaima rice biryani cooked with jumbo coastal tiger prawns, roasted cashews, and golden raisins.',
        prepTime: '25 mins'
      },
      {
        id: 'bir-6',
        title: 'Charcoal Smoked Chicken Tikka Biryani',
        category: 'biryani',
        price: 22.50,
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80',
        badge: 'Spicy & Smoky',
        isVeg: false,
        rating: 4.8,
        ratingCount: 890,
        desc: 'Smoky tandoor-roasted red chili chicken tikka tossed in rich masala gravy layered over fragrant basmati.',
        prepTime: '20 mins'
      },
      {
        id: 'bir-7',
        title: 'Shahi Soya Chaap Dum Biryani',
        category: 'biryani',
        price: 17.00,
        image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=800&auto=format&fit=crop&q=80',
        badge: 'High Protein',
        isVeg: true,
        rating: 4.6,
        ratingCount: 430,
        desc: 'Juicy tandoori marinated soya chaap pieces layered with biryani masala, caramelized onions, and fresh coriander.',
        prepTime: '18 mins'
      },
      {
        id: 'bir-8',
        title: 'Chettinad Spicy Mutton Biryani',
        category: 'biryani',
        price: 25.50,
        image: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800&auto=format&fit=crop&q=80',
        badge: 'Fiery South',
        isVeg: false,
        rating: 4.9,
        ratingCount: 710,
        desc: 'Seeraga samba rice cooked with freshly stone-ground Chettinad pepper spices and tender baby goat meat.',
        prepTime: '25 mins'
      },

      // 2. PIZZA (8 DISHES)
      {
        id: 'piz-1',
        title: 'Wood-Fired Margherita D.O.P.',
        category: 'pizza',
        price: 18.90,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=80',
        badge: 'Italian Classic',
        isVeg: true,
        rating: 4.9,
        ratingCount: 1650,
        desc: 'San Marzano D.O.P. tomato sauce, fresh creamy buffalo mozzarella, sweet garden basil, and extra virgin olive oil.',
        prepTime: '15 mins'
      },
      {
        id: 'piz-2',
        title: 'Truffle & Wild Porcini Mushroom Pizza',
        category: 'pizza',
        price: 23.00,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
        badge: 'Gourmet Choice',
        isVeg: true,
        rating: 4.8,
        ratingCount: 820,
        desc: 'White base pizza with sauteed wild porcini mushrooms, Fior di Latte mozzarella, thyme, and black truffle oil drizzle.',
        prepTime: '18 mins'
      },
      {
        id: 'piz-3',
        title: 'Spicy Diavola & Pepperoni Crunch',
        category: 'pizza',
        price: 21.50,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&auto=format&fit=crop&q=80',
        badge: 'Top Pick',
        isVeg: false,
        rating: 4.8,
        ratingCount: 1100,
        desc: 'Crispy artisanal beef pepperoni slices, spicy Calabrian chili paste, melted mozzarella, and hot honey drizzle.',
        prepTime: '15 mins'
      },
      {
        id: 'piz-4',
        title: 'Quattro Formaggi 4-Cheese Gourmet',
        category: 'pizza',
        price: 20.00,
        image: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?w=800&auto=format&fit=crop&q=80',
        badge: 'Cheesy Delight',
        isVeg: true,
        rating: 4.7,
        ratingCount: 680,
        desc: 'Rich four-cheese blend of Gorgonzola, aged Parmigiano Reggiano, smoked provolone, and fresh mozzarella.',
        prepTime: '15 mins'
      },
      {
        id: 'piz-5',
        title: 'Burrata & Prosciutto di Parma Pizza',
        category: 'pizza',
        price: 24.50,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80',
        badge: 'Chef Signature',
        isVeg: false,
        rating: 4.9,
        ratingCount: 540,
        desc: 'Cured Prosciutto di Parma, baby wild rocket arugula, shaved parmesan, and a whole creamy Burrata ball in center.',
        prepTime: '18 mins'
      },
      {
        id: 'piz-6',
        title: 'Spicy Peri-Peri Paneer Pizza',
        category: 'pizza',
        price: 19.00,
        image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&auto=format&fit=crop&q=80',
        badge: 'Fusion Hit',
        isVeg: true,
        rating: 4.7,
        ratingCount: 880,
        desc: 'Peri-peri tossed cottage cheese cubes, sweet bell peppers, red onions, jalapeños, and spiced mozzarella.',
        prepTime: '15 mins'
      },
      {
        id: 'piz-7',
        title: 'Smoked BBQ Pulled Chicken & Bacon',
        category: 'pizza',
        price: 22.00,
        image: 'https://images.unsplash.com/photo-1594007654729-407edc4be65b?w=800&auto=format&fit=crop&q=80',
        badge: 'Smoky BBQ',
        isVeg: false,
        rating: 4.8,
        ratingCount: 940,
        desc: 'Hickory smoked shredded BBQ chicken breast, crispy smoked bacon bits, red onion rings, and cilantro.',
        prepTime: '16 mins'
      },
      {
        id: 'piz-8',
        title: 'Garden Basil Pesto & Artichoke Pizza',
        category: 'pizza',
        price: 19.50,
        image: 'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?w=800&auto=format&fit=crop&q=80',
        badge: 'Farm Fresh',
        isVeg: true,
        rating: 4.6,
        ratingCount: 410,
        desc: 'Homemade genovese basil pesto sauce, grilled artichoke hearts, sundried tomatoes, and pine nuts.',
        prepTime: '15 mins'
      },

      // 3. BURGERS (8 DISHES)
      {
        id: 'bur-1',
        title: 'Double Wagyu Smash Burger Deluxe',
        category: 'burgers',
        price: 21.00,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
        badge: 'Best Smash',
        isVeg: false,
        rating: 4.9,
        ratingCount: 1850,
        desc: 'Twin smashed A5 Wagyu beef patties with crisp lacy edges, melted sharp cheddar, caramelized shallots, and house burger sauce.',
        prepTime: '15 mins'
      },
      {
        id: 'bur-2',
        title: 'Smoked Truffle Bacon & Cheddar Stack',
        category: 'burgers',
        price: 22.50,
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80',
        badge: 'Meat Monster',
        isVeg: false,
        rating: 4.9,
        ratingCount: 1200,
        desc: 'Charbroiled beef patty, thick cut applewood smoked bacon, truffle garlic aioli, arugula, and Vermont cheddar on brioche.',
        prepTime: '16 mins'
      },
      {
        id: 'bur-3',
        title: 'Nashville Crispy Hot Chicken Burger',
        category: 'burgers',
        price: 18.50,
        image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=800&auto=format&fit=crop&q=80',
        badge: 'Spicy Crunchy',
        isVeg: false,
        rating: 4.8,
        ratingCount: 1450,
        desc: '24-hour buttermilk soaked crunchy chicken thigh tossed in cayenne chili oil with dill pickles and creamy slaw.',
        prepTime: '15 mins'
      },
      {
        id: 'bur-4',
        title: 'Chipotle Black Bean & Guacamole Burger',
        category: 'burgers',
        price: 16.50,
        image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800&auto=format&fit=crop&q=80',
        badge: 'Vegan Legend',
        isVeg: true,
        rating: 4.6,
        ratingCount: 560,
        desc: 'Spiced roasted black bean and sweet corn patty, fresh mashed Hass guacamole, pico de gallo, and chipotle crema.',
        prepTime: '14 mins'
      },
      {
        id: 'bur-5',
        title: 'Truffle Butter Portobello Mushroom Burger',
        category: 'burgers',
        price: 17.50,
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
        badge: 'Gourmet Veg',
        isVeg: true,
        rating: 4.7,
        ratingCount: 680,
        desc: 'Whole grilled balsamic glazed Portobello mushroom cap, melted Swiss gruyère cheese, and roasted garlic herb butter.',
        prepTime: '15 mins'
      },
      {
        id: 'bur-6',
        title: 'Korean Gochujang Glazed Crispy Chicken',
        category: 'burgers',
        price: 19.00,
        image: 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=800&auto=format&fit=crop&q=80',
        badge: 'Sweet & Spicy',
        isVeg: false,
        rating: 4.8,
        ratingCount: 780,
        desc: 'Double fried chicken breast glazed in sweet spicy gochujang chili sauce, sesame kimchi slaw, and kewpie mayo.',
        prepTime: '16 mins'
      },
      {
        id: 'bur-7',
        title: 'Double Smash Cheesy Beast Burger',
        category: 'burgers',
        price: 20.00,
        image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&auto=format&fit=crop&q=80',
        badge: 'Cheese Overload',
        isVeg: false,
        rating: 4.8,
        ratingCount: 920,
        desc: 'Double beef patties drenched in warm liquid cheddar cheese sauce, grilled onions, pickles, and crispy onion straws.',
        prepTime: '15 mins'
      },
      {
        id: 'bur-8',
        title: 'Crispy Paneer Makhani Brioche Burger',
        category: 'burgers',
        price: 16.00,
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80',
        badge: 'Desi Fusion',
        isVeg: true,
        rating: 4.7,
        ratingCount: 840,
        desc: 'Crispy fried panko paneer steak tossed in rich butter makhani gravy with mint chutney and pickled onions on brioche.',
        prepTime: '14 mins'
      },

      // 4. INDIAN (8 DISHES)
      {
        id: 'ind-1',
        title: '24-Hour Charcoal Simmered Dal Makhani',
        category: 'indian',
        price: 17.50,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
        badge: 'Must Try',
        isVeg: true,
        rating: 4.9,
        ratingCount: 2200,
        desc: 'Whole black urad lentils slow-cooked overnight over live charcoal with churned white butter, cream, and kasuri methi.',
        prepTime: '15 mins'
      },
      {
        id: 'ind-2',
        title: 'Velvet Butter Chicken Royale (Murgh Makhani)',
        category: 'indian',
        price: 23.50,
        image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80',
        badge: 'Royal Favorite',
        isVeg: false,
        rating: 4.9,
        ratingCount: 2800,
        desc: 'Tandoor-charred boneless chicken tikka simmered in a silky tomato, cashew cream, and sun-dried fenugreek gravy.',
        prepTime: '18 mins'
      },
      {
        id: 'ind-3',
        title: 'Shahi Paneer Lababdar',
        category: 'indian',
        price: 19.50,
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80',
        badge: 'Pure Veg Royal',
        isVeg: true,
        rating: 4.8,
        ratingCount: 1400,
        desc: 'Fresh cottage cheese cubes folded with grated paneer in an aromatic onion-tomato reduction with royal spices.',
        prepTime: '16 mins'
      },
      {
        id: 'ind-4',
        title: 'Kashmiri Mutton Rogan Josh',
        category: 'indian',
        price: 25.00,
        image: 'https://images.unsplash.com/photo-1545247181-516773cae7be?w=800&auto=format&fit=crop&q=80',
        badge: 'Slow Cooked',
        isVeg: false,
        rating: 4.9,
        ratingCount: 950,
        desc: 'Tender baby lamb shanks braised with Kashmiri deggi mirch, fennel powder, and ratan jot root in aromatic mustard oil gravy.',
        prepTime: '22 mins'
      },
      {
        id: 'ind-5',
        title: 'Amritsari Stuffed Aloo Kulcha & Chole',
        category: 'indian',
        price: 15.50,
        image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=800&auto=format&fit=crop&q=80',
        badge: 'Punjab Dhaba',
        isVeg: true,
        rating: 4.7,
        ratingCount: 1100,
        desc: 'Crispy layered tandoor baked bread stuffed with spiced mashed potatoes, served with dark spiced Punjabi chickpea curry.',
        prepTime: '15 mins'
      },
      {
        id: 'ind-6',
        title: 'Sizzling Murgh Malai Tikka',
        category: 'indian',
        price: 22.00,
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80',
        badge: 'Tandoor Grill',
        isVeg: false,
        rating: 4.8,
        ratingCount: 890,
        desc: 'Boneless chicken supreme steeped in clotted cream, green cardamom, cheese, and roasted cumin, grilled over charcoal.',
        prepTime: '18 mins'
      },
      {
        id: 'ind-7',
        title: 'Garlic Butter Naan & Laccha Paratha Basket',
        category: 'indian',
        price: 8.50,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
        badge: 'Fresh Breads',
        isVeg: true,
        rating: 4.9,
        ratingCount: 1750,
        desc: 'Basket of 2 Garlic Naans, 1 Butter Roti, and 1 Multi-layered flaky Laccha Paratha baked fresh to order in tandoor.',
        prepTime: '10 mins'
      },
      {
        id: 'ind-8',
        title: 'Pindi Chana Masala with Bhature',
        category: 'indian',
        price: 16.00,
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&auto=format&fit=crop&q=80',
        badge: 'Delhi Classic',
        isVeg: true,
        rating: 4.7,
        ratingCount: 1320,
        desc: 'Fluffy golden fried bhature served with tea-leaf simmered Rawalpindi chickpeas, pickled onions, and green chilies.',
        prepTime: '15 mins'
      },

      // 5. CHINESE (8 DISHES)
      {
        id: 'chn-1',
        title: 'Steamed Crystal Truffle Dim Sum (6 pcs)',
        category: 'chinese',
        price: 18.00,
        image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop&q=80',
        badge: 'Artisan Dim Sum',
        isVeg: true,
        rating: 4.9,
        ratingCount: 1150,
        desc: 'Translucent steamed dumplings stuffed with water chestnuts, wild mushrooms, edamame, and aromatic white truffle oil.',
        prepTime: '15 mins'
      },
      {
        id: 'chn-2',
        title: 'Fiery Szechuan Chili Garlic Noodles',
        category: 'chinese',
        price: 16.50,
        image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80',
        badge: 'Wok Sizzle',
        isVeg: true,
        rating: 4.8,
        ratingCount: 1340,
        desc: 'Fresh hand-pulled egg noodles wok-tossed in artisanal Szechuan peppercorn chili paste, crispy garlic, and scallions.',
        prepTime: '14 mins'
      },
      {
        id: 'chn-3',
        title: 'Dragon Kung Pao Chicken with Peanuts',
        category: 'chinese',
        price: 19.00,
        image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&auto=format&fit=crop&q=80',
        badge: 'Classic Wok',
        isVeg: false,
        rating: 4.8,
        ratingCount: 980,
        desc: 'Crispy diced chicken tossed with dry red facing-heaven chilies, bell peppers, roasted peanuts, and sweet soy glaze.',
        prepTime: '16 mins'
      },
      {
        id: 'chn-4',
        title: 'Cantonese Crispy Vegetable Spring Rolls',
        category: 'chinese',
        price: 13.50,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
        badge: 'Crispy Starter',
        isVeg: true,
        rating: 4.6,
        ratingCount: 720,
        desc: 'Golden fried paper-thin rolls filled with shredded cabbage, bamboo shoots, carrots, and sweet plum chili dipping sauce.',
        prepTime: '12 mins'
      },
      {
        id: 'chn-5',
        title: 'Spicy Chili Garlic Butter Prawns',
        category: 'chinese',
        price: 23.00,
        image: 'https://images.unsplash.com/photo-1559742811-82286364ceaf?w=800&auto=format&fit=crop&q=80',
        badge: 'Chef Favorite',
        isVeg: false,
        rating: 4.9,
        ratingCount: 840,
        desc: 'Wok tossed jumbo prawns in fiery fermented chili bean sauce, minced garlic, spring onions, and Shaoxing wine.',
        prepTime: '18 mins'
      },
      {
        id: 'chn-6',
        title: 'Chicken Manchurian Gravy with Fried Rice',
        category: 'chinese',
        price: 18.50,
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop&q=80',
        badge: 'Indo-Chinese',
        isVeg: false,
        rating: 4.7,
        ratingCount: 1560,
        desc: 'Crispy chicken meatballs in thick dark soy-coriander garlic gravy served with wok tossed egg & vegetable fried rice.',
        prepTime: '16 mins'
      },
      {
        id: 'chn-7',
        title: 'Crispy Honey Chili Lotus Stem',
        category: 'chinese',
        price: 15.00,
        image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80',
        badge: 'Crunchy Veg',
        isVeg: true,
        rating: 4.7,
        ratingCount: 630,
        desc: 'Thin sliced lotus root fried to golden crispness, glazed in organic wildflower honey, red chili flakes, and toasted sesame.',
        prepTime: '14 mins'
      },
      {
        id: 'chn-8',
        title: 'Hakka Street Style Egg & Chicken Noodles',
        category: 'chinese',
        price: 17.00,
        image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=800&auto=format&fit=crop&q=80',
        badge: 'Street Hit',
        isVeg: false,
        rating: 4.8,
        ratingCount: 1210,
        desc: 'High flame wok tossed noodles with scrambled farm eggs, shredded chicken, crunchy bell peppers, and Hakka spice blend.',
        prepTime: '15 mins'
      },

      // 6. SOUTH INDIAN (8 DISHES)
      {
        id: 'sin-1',
        title: 'Golden Ghee Roast Masala Dosa',
        category: 'south-indian',
        price: 14.50,
        image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80',
        badge: 'Iconic Dosa',
        isVeg: true,
        rating: 4.9,
        ratingCount: 2600,
        desc: 'Paper-thin ultra crispy crepe roasted in pure A2 cow ghee, stuffed with spiced potato masala, served with 3 chutneys & drumstick sambar.',
        prepTime: '12 mins'
      },
      {
        id: 'sin-2',
        title: 'Steamed Kanchipuram Idli & Medu Vada (2+2)',
        category: 'south-indian',
        price: 12.50,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
        badge: 'Morning Tiffin',
        isVeg: true,
        rating: 4.8,
        ratingCount: 1800,
        desc: 'Soft fluffy steamed rice idlis and crispy golden fried lentil vadas served with fresh coconut chutney, tomato chutney & piping hot sambar.',
        prepTime: '10 mins'
      },
      {
        id: 'sin-3',
        title: 'Crispy Rava Onion Masala Dosa',
        category: 'south-indian',
        price: 13.50,
        image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=800&auto=format&fit=crop&q=80',
        badge: 'Crunchy Net',
        isVeg: true,
        rating: 4.7,
        ratingCount: 940,
        desc: 'Semolina and rice flour net crepe studded with chopped green chilies, ginger, cracked black pepper, and roasted onions.',
        prepTime: '14 mins'
      },
      {
        id: 'sin-4',
        title: 'Flaky Malabar Parotta with Veg Kurma',
        category: 'south-indian',
        price: 15.00,
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80',
        badge: 'Kerala Classic',
        isVeg: true,
        rating: 4.8,
        ratingCount: 1120,
        desc: '2 flaky spiral layered Malabar parottas served with rich coconut-cashew vegetable kurma and pickled shallots.',
        prepTime: '15 mins'
      },
      {
        id: 'sin-5',
        title: 'Mysore Masala Butter Dosa',
        category: 'south-indian',
        price: 14.00,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
        badge: 'Spicy Mysore',
        isVeg: true,
        rating: 4.8,
        ratingCount: 1420,
        desc: 'Crispy dosa spread on the inside with spicy red garlic-chili paste, loaded with butter and seasoned potato filling.',
        prepTime: '12 mins'
      },
      {
        id: 'sin-6',
        title: 'Chettinad Pepper Chicken with Appams (3 pcs)',
        category: 'south-indian',
        price: 21.50,
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80',
        badge: 'Fiery Feast',
        isVeg: false,
        rating: 4.9,
        ratingCount: 880,
        desc: 'Soft centered bowl-shaped lace appams served with spicy Chettinad black pepper dry chicken roast.',
        prepTime: '18 mins'
      },
      {
        id: 'sin-7',
        title: 'South Indian Curd Rice with Pomegranate',
        category: 'south-indian',
        price: 10.50,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
        badge: 'Comfort Food',
        isVeg: true,
        rating: 4.7,
        ratingCount: 650,
        desc: 'Creamy tempered yogurt rice with mustard seeds, curry leaves, ginger, green chilies, and fresh pomegranate jewels.',
        prepTime: '10 mins'
      },
      {
        id: 'sin-8',
        title: 'Malabar Fish Curry with Steamed Rice',
        category: 'south-indian',
        price: 24.00,
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80',
        badge: 'Coastal Gold',
        isVeg: false,
        rating: 4.9,
        ratingCount: 760,
        desc: 'Fresh Kingfish steaks cooked in coconut milk, Kokum tamarind, shallots, and green chilies with hot steamed Matta rice.',
        prepTime: '20 mins'
      },

      // 7. DESSERTS (8 DISHES)
      {
        id: 'des-1',
        title: 'Signature Artisanal Tiramisu Al Caffè',
        category: 'desserts',
        price: 11.00,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop&q=80',
        badge: 'Italian Icon',
        isVeg: true,
        rating: 4.9,
        ratingCount: 1950,
        desc: 'Espresso-soaked ladyfinger biscuits layered with Italian mascarpone cream and dusted with Valrhona bitter cocoa.',
        prepTime: '5 mins'
      },
      {
        id: 'des-2',
        title: 'Saffron Gulab Jamun NY Cheesecake',
        category: 'desserts',
        price: 12.50,
        image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&auto=format&fit=crop&q=80',
        badge: 'Fusion Magic',
        isVeg: true,
        rating: 4.9,
        ratingCount: 1420,
        desc: 'Creamy New York baked cheesecake baked with whole soft saffron gulab jamuns inside on a cardamom graham crust.',
        prepTime: '5 mins'
      },
      {
        id: 'des-3',
        title: 'Molten Dark Chocolate Valrhona Lava Cake',
        category: 'desserts',
        price: 12.00,
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80',
        badge: 'Warm & Gooey',
        isVeg: true,
        rating: 4.8,
        ratingCount: 1680,
        desc: 'Warm baked 70% French dark chocolate fondant with a flowing molten center, served with vanilla bean ice cream scoop.',
        prepTime: '12 mins'
      },
      {
        id: 'des-4',
        title: 'Royal Rasmalai Tres Leches Cake',
        category: 'desserts',
        price: 11.50,
        image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&auto=format&fit=crop&q=80',
        badge: 'Desi Delight',
        isVeg: true,
        rating: 4.8,
        ratingCount: 930,
        desc: 'Light sponge cake soaked in saffron-pistachio evaporated milk, topped with whipped cream and crushed almonds.',
        prepTime: '5 mins'
      },
      {
        id: 'des-5',
        title: 'Death By Chocolate Hot Fudge Sundae',
        category: 'desserts',
        price: 12.00,
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80',
        badge: 'Chocoholic',
        isVeg: true,
        rating: 4.9,
        ratingCount: 1540,
        desc: 'Layered Belgian chocolate pastry, dark chocolate fudge sauce, vanilla bean ice cream, chocolate chips, and maraschino cherry.',
        prepTime: '8 mins'
      },
      {
        id: 'des-6',
        title: 'Sicilian Pistachio & Honey Gelato Tub',
        category: 'desserts',
        price: 9.50,
        image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&auto=format&fit=crop&q=80',
        badge: 'Artisan Gelato',
        isVeg: true,
        rating: 4.8,
        ratingCount: 720,
        desc: 'Slow-churned Italian gelato made with 100% roasted Bronte pistachio paste and raw organic honey (300ml tub).',
        prepTime: '5 mins'
      },
      {
        id: 'des-7',
        title: 'Warm Belgian Waffle with Nutella & Berries',
        category: 'desserts',
        price: 13.00,
        image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=800&auto=format&fit=crop&q=80',
        badge: 'Fresh Waffle',
        isVeg: true,
        rating: 4.8,
        ratingCount: 1100,
        desc: 'Golden crispy Liege waffle smothered with Nutella hazelnut spread, fresh strawberries, blueberries, and powdered sugar.',
        prepTime: '12 mins'
      },
      {
        id: 'des-8',
        title: 'Kesar Pista Kulfi Falooda Royale',
        category: 'desserts',
        price: 10.00,
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80',
        badge: 'Summer Royal',
        isVeg: true,
        rating: 4.7,
        ratingCount: 880,
        desc: 'Traditional malai kulfi slice topped with soaked basil seeds, cornstarch falooda sev, rose syrup, and pistachios.',
        prepTime: '5 mins'
      },

      // 8. HEALTHY (8 DISHES)
      {
        id: 'hlth-1',
        title: 'Dragon Atlantic Salmon Poké Bowl',
        category: 'healthy',
        price: 22.50,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
        badge: 'Omega-3 Rich',
        isVeg: false,
        rating: 4.9,
        ratingCount: 1380,
        desc: 'Sashimi-grade Norwegian salmon cubes, organic brown sushi rice, edamame, Hass avocado, wakame seaweed, and sesame ponzu dressing.',
        prepTime: '15 mins'
      },
      {
        id: 'hlth-2',
        title: 'Mediterranean Superfood Quinoa Harvest',
        category: 'healthy',
        price: 17.00,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80',
        badge: 'High Fiber',
        isVeg: true,
        rating: 4.8,
        ratingCount: 920,
        desc: 'Fluffy rainbow quinoa, roasted baby beets, Kalamata olives, English cucumbers, Greek feta cheese, and lemon-oregano vinaigrette.',
        prepTime: '12 mins'
      },
      {
        id: 'hlth-3',
        title: 'Rosemary Herb Grilled Chicken Avocado Salad',
        category: 'healthy',
        price: 18.50,
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
        badge: 'Lean Protein',
        isVeg: false,
        rating: 4.8,
        ratingCount: 1250,
        desc: 'Free-range rosemary grilled chicken breast, sliced avocado, cherry heirloom tomatoes, and toasted sunflower seeds.',
        prepTime: '15 mins'
      },
      {
        id: 'hlth-4',
        title: 'Acai Berry Chia Seed Protein Smoothie Bowl',
        category: 'healthy',
        price: 15.00,
        image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&auto=format&fit=crop&q=80',
        badge: 'Antioxidant Super',
        isVeg: true,
        rating: 4.7,
        ratingCount: 680,
        desc: 'Thick Brazilian organic acai smoothie blend topped with organic chia seeds, hemp hearts, banana slices, and toasted coconut.',
        prepTime: '8 mins'
      },
      {
        id: 'hlth-5',
        title: 'Grilled Tofu & Edamame Soba Noodle Bowl',
        category: 'healthy',
        price: 16.50,
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop&q=80',
        badge: 'Plant Power',
        isVeg: true,
        rating: 4.7,
        ratingCount: 540,
        desc: 'Buckwheat soba noodles, organic miso-glazed pressed tofu, steamed edamame, baby bok choy, and toasted sesame ginger dressing.',
        prepTime: '14 mins'
      },
      {
        id: 'hlth-6',
        title: 'California Smashed Avocado Toast & Egg',
        category: 'healthy',
        price: 15.50,
        image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80',
        badge: 'Brunch Healthy',
        isVeg: false,
        rating: 4.8,
        ratingCount: 880,
        desc: 'Rustic sourdough bread, chunky lemon Hass avocado spread, two pasture-raised poached eggs, and everything bagel seasoning.',
        prepTime: '10 mins'
      },
      {
        id: 'hlth-7',
        title: 'Keto Grilled Lemon Herb Prawns & Greens',
        category: 'healthy',
        price: 23.50,
        image: 'https://images.unsplash.com/photo-1559742811-82286364ceaf?w=800&auto=format&fit=crop&q=80',
        badge: 'Keto Low-Carb',
        isVeg: false,
        rating: 4.9,
        ratingCount: 710,
        desc: 'Charbroiled wild tiger prawns in lemon garlic herb butter served over a bed of baby arugula, shaved parmesan, and olive oil.',
        prepTime: '15 mins'
      },
      {
        id: 'hlth-8',
        title: 'Roasted Beetroot & Goat Cheese Walnut Salad',
        category: 'healthy',
        price: 16.00,
        image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&auto=format&fit=crop&q=80',
        badge: 'Clean Eating',
        isVeg: true,
        rating: 4.7,
        ratingCount: 490,
        desc: 'Honey-roasted candy cane beetroots, creamy French chèvre goat cheese, candied walnuts, and baby spinach with balsamic glaze.',
        prepTime: '10 mins'
      },

      // 9. DRINKS (8 DISHES)
      {
        id: 'drk-1',
        title: 'Royal Alphonso Mango Kesar Lassi',
        category: 'drinks',
        price: 7.50,
        image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&auto=format&fit=crop&q=80',
        badge: 'Chilled Royal',
        isVeg: true,
        rating: 4.9,
        ratingCount: 2100,
        desc: 'Thick churned farm yogurt blended with sweet Ratnagiri Alphonso mango pulp, saffron strands, and crushed pistachios.',
        prepTime: '5 mins'
      },
      {
        id: 'drk-2',
        title: 'Nitro Cold Brew & Salted Caramel',
        category: 'drinks',
        price: 6.50,
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&auto=format&fit=crop&q=80',
        badge: 'Craft Coffee',
        isVeg: true,
        rating: 4.8,
        ratingCount: 1450,
        desc: '18-hour cold steeped single-origin Ethiopian coffee beans infused with nitrogen and artisanal sea salt caramel.',
        prepTime: '3 mins'
      },
      {
        id: 'drk-3',
        title: 'Spiced Royal Saffron Masala Chai (Serves 2)',
        category: 'drinks',
        price: 5.50,
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
        badge: 'Aromatic Warmth',
        isVeg: true,
        rating: 4.9,
        ratingCount: 1820,
        desc: 'Strong Assam CTC tea brewed with fresh crushed green cardamom, ginger, cinnamon, and whole cloves in whole milk.',
        prepTime: '8 mins'
      },
      {
        id: 'drk-4',
        title: 'Belgian Dark Chocolate Thickshake',
        category: 'drinks',
        price: 8.00,
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80',
        badge: 'Decadent Shake',
        isVeg: true,
        rating: 4.8,
        ratingCount: 1250,
        desc: 'Extra thick milkshake made with 70% Callebaut Belgian dark chocolate, double chocolate fudge ice cream, and whipped cream.',
        prepTime: '6 mins'
      },
      {
        id: 'drk-5',
        title: 'Cold Pressed Valencia Orange Juice',
        category: 'drinks',
        price: 6.50,
        image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&auto=format&fit=crop&q=80',
        badge: '100% Pure Raw',
        isVeg: true,
        rating: 4.7,
        ratingCount: 890,
        desc: 'Freshly cold-pressed sweet Valencia oranges with pulp, zero added sugar, zero preservatives, 100% vitamin C boost.',
        prepTime: '5 mins'
      },
      {
        id: 'drk-6',
        title: 'Watermelon Basil Mint Hydration Cooler',
        category: 'drinks',
        price: 6.00,
        image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=800&auto=format&fit=crop&q=80',
        badge: 'Refreshing Mint',
        isVeg: true,
        rating: 4.7,
        ratingCount: 760,
        desc: 'Chilled freshly pressed summer watermelon juice infused with torn holy basil leaves, fresh mint, black salt, and lime.',
        prepTime: '5 mins'
      },
      {
        id: 'drk-7',
        title: 'Matcha Green Tea Iced Latte with Oat Milk',
        category: 'drinks',
        price: 7.00,
        image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&auto=format&fit=crop&q=80',
        badge: 'Kyoto Ceremonial',
        isVeg: true,
        rating: 4.8,
        ratingCount: 640,
        desc: 'Ceremonial grade Uji Japanese matcha green tea whisked with barista oat milk and touch of Madagascar vanilla.',
        prepTime: '5 mins'
      },
      {
        id: 'drk-8',
        title: 'Ferrero Rocher Hazelnut Dream Shake',
        category: 'drinks',
        price: 8.50,
        image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=800&auto=format&fit=crop&q=80',
        badge: 'Signature Shake',
        isVeg: true,
        rating: 4.9,
        ratingCount: 1390,
        desc: 'Crushed Ferrero Rocher chocolates blended with roasted hazelnut spread, vanilla bean cream, and wafer stick garnish.',
        prepTime: '6 mins'
      }
    ];

    // ==========================================
    // REVIEWS DATA
    // ==========================================
    let REVIEWS = [
      {
        name: 'Rohan Deshmukh',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        stars: 5,
        date: '2 hours ago',
        comment: 'The Hyderabadi Dum Gosht Biryani arrived piping hot in 22 minutes! Rice was so fragrant and meat fell off the bone.'
      },
      {
        name: 'Ananya Sen',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
        stars: 5,
        date: 'Yesterday',
        comment: 'The Truffle & Wild Porcini Pizza + Mango Kesar Lassi combo is pure heaven. Swiggy coupon SWIGGY50 gave me $25 discount!'
      },
      {
        name: 'Vikramaditya Rao',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
        stars: 5,
        date: '3 days ago',
        comment: 'Unbeatable Dal Makhani and Garlic Naans. The live GPS tracking was super accurate down to the minute.'
      }
    ];

    // ==========================================
    // APPLICATION STATE
    // ==========================================
    let cart = [];
    let currentCategory = 'all';
    let currentDietary = 'all'; // 'all', 'veg', 'nonveg'
    let currentSearch = '';
    let appliedCoupon = null; // e.g. { code: 'SWIGGY50', discountPercent: 50, maxDiscount: 100 }

    // ==========================================
    // INITIALIZATION
    // ==========================================
    document.addEventListener('DOMContentLoaded', () => {
      renderMenu();
      renderCart();
      renderReviews();
      if (window.lucide) lucide.createIcons();
    });

    // ==========================================
    // MENU RENDERING ENGINE
    // ==========================================
    function renderMenu() {
      const grid = document.getElementById('menuGrid');
      if (!grid) return;

      const filtered = DISHES.filter(dish => {
        const matchesCategory = currentCategory === 'all' || dish.category === currentCategory;
        const matchesDietary = currentDietary === 'all' || 
                               (currentDietary === 'veg' && dish.isVeg) || 
                               (currentDietary === 'nonveg' && !dish.isVeg);
        const matchesSearch = !currentSearch || 
                              dish.title.toLowerCase().includes(currentSearch.toLowerCase()) || 
                              dish.desc.toLowerCase().includes(currentSearch.toLowerCase()) ||
                              dish.category.toLowerCase().includes(currentSearch.toLowerCase());
        return matchesCategory && matchesDietary && matchesSearch;
      });

      if (filtered.length === 0) {
        grid.innerHTML = \`
          <div class="col-span-full py-16 text-center space-y-4">
            <div class="w-16 h-16 rounded-full bg-stone-900 mx-auto flex items-center justify-center text-stone-500">
              <i data-lucide="utensils" class="w-8 h-8"></i>
            </div>
            <p class="text-base font-bold text-stone-300">No dishes match your filter criteria</p>
            <button onclick="resetFilters()" class="px-5 py-2.5 rounded-xl bg-orange-500 text-stone-950 font-extrabold text-xs">
              View All 72 Dishes
            </button>
          </div>
        \`;
        if (window.lucide) lucide.createIcons();
        return;
      }

      grid.innerHTML = filtered.map(dish => {
        const inCartItem = cart.find(c => c.id === dish.id);
        const qty = inCartItem ? inCartItem.qty : 0;

        return \`
          <div class="p-5 rounded-3xl bg-stone-900/90 border border-stone-800 hover:border-orange-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between group">
            
            <div class="space-y-3">
              <!-- TOP BADGES -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <span class="w-3.5 h-3.5 border \${dish.isVeg ? 'border-emerald-500' : 'border-red-500'} flex items-center justify-center p-0.5 rounded-sm">
                    <span class="w-1.5 h-1.5 rounded-full \${dish.isVeg ? 'bg-emerald-500' : 'bg-red-500'}"></span>
                  </span>
                  <span class="text-[10px] font-extrabold uppercase tracking-wider text-orange-400">\${dish.badge}</span>
                </div>
                <span class="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 text-[10px] font-bold flex items-center gap-1">
                  <span class="text-amber-400">★</span> \${dish.rating} (\${dish.ratingCount})
                </span>
              </div>

              <!-- DISH TITLE & PRICE -->
              <div>
                <h3 class="font-serif font-extrabold text-base text-white group-hover:text-orange-400 transition">\${dish.title}</h3>
                <p class="font-serif font-black text-lg text-orange-400 pt-0.5">$\${dish.price.toFixed(2)}</p>
              </div>

              <!-- DESCRIPTION -->
              <p class="text-xs text-stone-400 leading-relaxed line-clamp-2">\${dish.desc}</p>
            </div>

            <!-- PHOTO & ACTION BUTTON -->
            <div class="pt-4 border-t border-stone-800/80 flex items-center justify-between gap-4 mt-3">
              <div class="relative w-24 h-24 rounded-2xl overflow-hidden border border-stone-800 flex-shrink-0">
                <img src="\${dish.image}" alt="\${dish.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                <button type="button" onclick="openDishModal('\${dish.id}')" class="absolute bottom-1.5 right-1.5 p-1 rounded-md bg-stone-950/80 text-white hover:bg-orange-500 hover:text-black transition" title="Quick View">
                  <i data-lucide="eye" class="w-3.5 h-3.5"></i>
                </button>
              </div>

              <!-- SWIGGY ADD / STEPPER BUTTON -->
              <div>
                \${qty === 0 ? \`
                  <button type="button" onclick="quickAdd('\${dish.id}')" class="w-28 py-2.5 rounded-xl bg-stone-950 border-2 border-emerald-500 hover:bg-emerald-500 hover:text-white text-emerald-400 font-black text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-1 cursor-pointer">
                    <span>ADD</span>
                    <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                  </button>
                \` : \`
                  <div class="w-28 py-1.5 rounded-xl bg-emerald-600 border border-emerald-500 text-white font-black text-xs flex items-center justify-between px-2 shadow-lg">
                    <button type="button" onclick="updateQty('\${dish.id}', -1)" class="p-1 hover:bg-emerald-700 rounded transition cursor-pointer">
                      <i data-lucide="minus" class="w-3.5 h-3.5"></i>
                    </button>
                    <span>\${qty}</span>
                    <button type="button" onclick="updateQty('\${dish.id}', 1)" class="p-1 hover:bg-emerald-700 rounded transition cursor-pointer">
                      <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                    </button>
                  </div>
                \`}
              </div>
            </div>

          </div>
        \`;
      }).join('');

      if (window.lucide) lucide.createIcons();
    }

    // ==========================================
    // FILTERING FUNCTIONS
    // ==========================================
    function filterCategory(cat) {
      currentCategory = cat;
      
      // Update Tab Styles
      const allTabs = ['all', 'biryani', 'pizza', 'burgers', 'indian', 'chinese', 'south-indian', 'desserts', 'healthy', 'drinks'];
      allTabs.forEach(t => {
        const btn = document.getElementById('tab-' + t);
        if (btn) {
          if (t === cat) {
            btn.className = 'px-4 py-2 rounded-xl bg-orange-500 text-stone-950 font-black text-xs whitespace-nowrap transition cursor-pointer';
          } else {
            btn.className = 'px-4 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-orange-500/50 text-stone-300 font-bold text-xs whitespace-nowrap transition cursor-pointer';
          }
        }
      });

      // Update Active Badge
      const badge = document.getElementById('activeCuisineBadge');
      if (badge) {
        badge.textContent = cat === 'all' ? 'All Cuisines (72 Dishes)' : \`\${cat.toUpperCase()} (8 Dishes)\`;
      }

      renderMenu();
      const menuSec = document.getElementById('menu');
      if (menuSec) menuSec.scrollIntoView({ behavior: 'smooth' });
    }

    function setDietaryFilter(diet) {
      currentDietary = diet;
      
      const allBtn = document.getElementById('vegFilterAll');
      const vegBtn = document.getElementById('vegFilterVeg');
      const nonVegBtn = document.getElementById('vegFilterNonVeg');

      if (allBtn) allBtn.className = diet === 'all' ? 'px-3.5 py-2 rounded-xl bg-orange-500 text-stone-950 font-extrabold text-xs transition cursor-pointer' : 'px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 font-bold text-xs transition cursor-pointer';
      if (vegBtn) vegBtn.className = diet === 'veg' ? 'px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-extrabold text-xs transition flex items-center gap-1.5 cursor-pointer' : 'px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-emerald-500 text-stone-300 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer';
      if (nonVegBtn) nonVegBtn.className = diet === 'nonveg' ? 'px-3.5 py-2 rounded-xl bg-red-600 text-white font-extrabold text-xs transition flex items-center gap-1.5 cursor-pointer' : 'px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-red-500 text-stone-300 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer';

      renderMenu();
    }

    function handleSearch(q) {
      currentSearch = q;
      renderMenu();
    }

    function resetFilters() {
      currentCategory = 'all';
      currentDietary = 'all';
      currentSearch = '';
      const s1 = document.getElementById('heroSearchInput');
      const s2 = document.getElementById('menuSearchInput');
      if (s1) s1.value = '';
      if (s2) s2.value = '';
      filterCategory('all');
    }

    // ==========================================
    // CART ENGINE & FLOATING BOTTOM BAR
    // ==========================================
    function quickAdd(dishId) {
      const item = DISHES.find(d => d.id === dishId);
      if (!item) return;

      const existing = cart.find(c => c.id === dishId);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ ...item, qty: 1 });
      }

      renderCart();
      renderMenu();
      showToast(\`Added \${item.title} to your bag! 🛒\`);
    }

    function updateQty(dishId, delta) {
      const existing = cart.find(c => c.id === dishId);
      if (!existing) return;

      existing.qty += delta;
      if (existing.qty <= 0) {
        cart = cart.filter(c => c.id !== dishId);
      }

      renderCart();
      renderMenu();
    }

    function removeFromCart(dishId) {
      cart = cart.filter(c => c.id !== dishId);
      renderCart();
      renderMenu();
    }

    function renderCart() {
      const container = document.getElementById('cartItemsContainer');
      const badge = document.getElementById('cartBadgeCount');
      const subtotalText = document.getElementById('cartSubtotalText');
      const discountRow = document.getElementById('discountRow');
      const discountText = document.getElementById('cartDiscountText');
      const deliveryFeeText = document.getElementById('cartDeliveryFee');
      const totalText = document.getElementById('cartTotalText');
      const checkoutBtn = document.getElementById('checkoutBtn');
      const floatingBar = document.getElementById('floatingBottomCart');
      const floatingCount = document.getElementById('floatingCartCount');
      const floatingTotal = document.getElementById('floatingCartTotal');

      const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
      const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);

      if (badge) badge.textContent = totalItems;

      // Handle Coupon
      let discount = 0;
      let deliveryFee = subtotal > 0 ? 3.99 : 0;
      if (appliedCoupon && subtotal > 0) {
        if (appliedCoupon.code === 'SWIGGY50') {
          discount = Math.min(subtotal * 0.5, 100);
        } else if (appliedCoupon.code === 'FREEDEL') {
          deliveryFee = 0;
        }
      }

      const platformFee = subtotal > 0 ? 1.50 : 0;
      const grandTotal = Math.max(0, subtotal - discount + deliveryFee + platformFee);

      if (subtotalText) subtotalText.textContent = '$' + subtotal.toFixed(2);
      if (discountRow) discountRow.style.display = discount > 0 ? 'flex' : 'none';
      if (discountText) discountText.textContent = '-$' + discount.toFixed(2);
      if (deliveryFeeText) deliveryFeeText.textContent = deliveryFee === 0 ? 'FREE' : '$' + deliveryFee.toFixed(2);
      if (totalText) totalText.textContent = '$' + grandTotal.toFixed(2);
      if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;

      // Update Floating Bottom Bar
      if (floatingBar) {
        if (totalItems > 0) {
          floatingBar.classList.remove('opacity-0', 'pointer-events-none', 'scale-95');
          floatingBar.classList.add('opacity-100', 'scale-100');
          if (floatingCount) floatingCount.textContent = \`\${totalItems} ITEMS\`;
          if (floatingTotal) floatingTotal.textContent = \`$\${grandTotal.toFixed(2)}\`;
        } else {
          floatingBar.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
          floatingBar.classList.remove('opacity-100', 'scale-100');
        }
      }

      if (!container) return;

      if (cart.length === 0) {
        container.innerHTML = \`
          <div class="py-12 text-center space-y-3">
            <div class="w-14 h-14 rounded-full bg-stone-900 mx-auto flex items-center justify-center text-stone-500">
              <i data-lucide="shopping-bag" class="w-6 h-6"></i>
            </div>
            <p class="text-xs font-bold text-stone-300">Your bag is empty</p>
            <p class="text-[11px] text-stone-500">Explore our 72 dishes to add tasty items!</p>
            <button onclick="toggleDrawer('cartDrawer'); document.getElementById('menu').scrollIntoView({behavior:'smooth'})" class="text-xs font-extrabold text-orange-400 hover:underline">
              Browse Menu ➔
            </button>
          </div>
        \`;
        if (window.lucide) lucide.createIcons();
        return;
      }

      container.innerHTML = cart.map(item => \`
        <div class="p-3 rounded-2xl bg-stone-900/80 border border-stone-800 flex items-center justify-between gap-3">
          <img src="\${item.image}" alt="\${item.title}" class="w-12 h-12 rounded-xl object-cover">
          <div class="flex-1 min-w-0">
            <h4 class="text-xs font-extrabold text-white truncate">\${item.title}</h4>
            <p class="text-[11px] text-orange-400 font-bold">$\${(item.price * item.qty).toFixed(2)}</p>
          </div>
          <div class="flex items-center gap-2">
            <div class="flex items-center bg-stone-950 border border-stone-800 rounded-lg p-0.5 text-xs font-bold">
              <button onclick="updateQty('\${item.id}', -1)" class="px-2 py-0.5 text-stone-400 hover:text-white">-</button>
              <span class="px-1.5 text-white">\${item.qty}</span>
              <button onclick="updateQty('\${item.id}', 1)" class="px-2 py-0.5 text-stone-400 hover:text-white">+</button>
            </div>
            <button onclick="removeFromCart('\${item.id}')" class="p-1 text-stone-500 hover:text-red-400 transition" title="Remove">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      \`).join('');

      if (window.lucide) lucide.createIcons();
    }

    // ==========================================
    // COUPON LOGIC
    // ==========================================
    function applyEnteredCoupon() {
      const input = document.getElementById('couponInput');
      if (!input || !input.value) return;
      applyPromoCode(input.value.trim().toUpperCase());
    }

    function applyPromoCode(code) {
      if (code === 'SWIGGY50') {
        appliedCoupon = { code: 'SWIGGY50', discountPercent: 50, maxDiscount: 100 };
        showToast('🎉 Coupon SWIGGY50 applied! 50% discount active.');
      } else if (code === 'FREEDEL') {
        appliedCoupon = { code: 'FREEDEL', discountPercent: 0, freeDelivery: true };
        showToast('🚚 Free Express Delivery coupon applied!');
      } else {
        showToast('Invalid coupon code. Try SWIGGY50 or FREEDEL');
        return;
      }
      renderCart();
    }

    // ==========================================
    // CHECKOUT & TRACKING SIMULATION
    // ==========================================
    function updateCheckoutModalBill() {
      let subtotal = 0;
      cart.forEach(item => {
        subtotal += item.price * item.qty;
      });

      let discount = 0;
      let deliveryFee = subtotal > 0 ? 3.99 : 0;

      if (appliedCoupon) {
        if (appliedCoupon.discountPercent) {
          discount = Math.min(appliedCoupon.maxDiscount || 100, subtotal * (appliedCoupon.discountPercent / 100));
        }
        if (appliedCoupon.freeDelivery) {
          deliveryFee = 0;
        }
      }

      const platformFee = subtotal > 0 ? 1.50 : 0;
      const grandTotal = Math.max(0, subtotal - discount + deliveryFee + platformFee);

      const subtotalEl = document.getElementById('checkoutSubtotal');
      const discountRow = document.getElementById('checkoutDiscountRow');
      const discountLabel = document.getElementById('checkoutCouponLabel');
      const discountAmount = document.getElementById('checkoutDiscountAmount');
      const feesEl = document.getElementById('checkoutFees');
      const finalAmountEl = document.getElementById('checkoutFinalAmount');

      if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2);
      if (discountRow) {
        discountRow.style.display = discount > 0 ? 'flex' : 'none';
        if (discountLabel && appliedCoupon) discountLabel.textContent = \`Coupon Savings (\${appliedCoupon.code})\`;
        if (discountAmount) discountAmount.textContent = '-$' + discount.toFixed(2);
      }
      if (feesEl) feesEl.textContent = deliveryFee === 0 ? '$1.50 (FREE Delivery!)' : '$' + (deliveryFee + platformFee).toFixed(2);
      if (finalAmountEl) finalAmountEl.textContent = '$' + grandTotal.toFixed(2);
    }

    function processCheckout(event) {
      const form = event.target;
      const name = form.name.value;
      const orderId = 'FD-' + Math.floor(1000 + Math.random() * 9000);

      let subtotal = 0;
      cart.forEach(i => { subtotal += i.price * i.qty; });
      let discount = 0;
      let couponCode = appliedCoupon ? appliedCoupon.code : null;
      let deliveryFee = subtotal > 0 ? 3.99 : 0;

      if (appliedCoupon) {
        if (appliedCoupon.discountPercent) discount = Math.min(100, subtotal * (appliedCoupon.discountPercent / 100));
        if (appliedCoupon.freeDelivery) deliveryFee = 0;
      }
      const finalPaid = Math.max(0, subtotal - discount + deliveryFee + (subtotal > 0 ? 1.50 : 0));

      // Reset Cart
      cart = [];
      appliedCoupon = null;
      renderCart();
      renderMenu();

      closeModal('checkoutModal');
      const drawer = document.getElementById('cartDrawer');
      const overlay = document.getElementById('cartDrawerOverlay');
      if (drawer) drawer.classList.add('translate-x-full');
      if (overlay) overlay.style.display = 'none';

      // Update Tracking
      const codeInput = document.getElementById('trackingCodeInput');
      if (codeInput) codeInput.value = orderId;
      const displayCode = document.getElementById('displayOrderCode');
      if (displayCode) displayCode.textContent = '#' + orderId;

      const discountMsg = discount > 0 ? \` • Saved $\${discount.toFixed(2)} with \${couponCode}!\` : '';
      showToast(\`Order #\${orderId} placed! Paid: $\${finalPaid.toFixed(2)}\${discountMsg} 🎉\`);
      
      const trackingSec = document.getElementById('tracking');
      if (trackingSec) trackingSec.scrollIntoView({ behavior: 'smooth' });

      simulateOrderTracking();
      form.reset();
    }

    function simulateOrderTracking() {
      const code = document.getElementById('trackingCodeInput').value || 'FD-8942';
      document.getElementById('displayOrderCode').textContent = '#' + code;

      const bar = document.getElementById('progressBar');
      const step1 = document.getElementById('trackStep1');
      const step2 = document.getElementById('trackStep2');
      const step3 = document.getElementById('trackStep3');
      const step4 = document.getElementById('trackStep4');

      if (bar) bar.style.width = '25%';
      showToast(\`Tracking updated for order #\${code} - Kitchen Preparing 🍳\`);

      setTimeout(() => {
        if (bar) bar.style.width = '65%';
        if (step2) step2.classList.add('text-orange-400');
        if (step3) step3.classList.add('text-emerald-400', 'font-black');
        showToast(\`Ramesh is on the way with order #\${code}! 🛵\`);
      }, 1200);
    }

    // ==========================================
    // REVIEWS
    // ==========================================
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
            <img src="\${r.avatar}" alt="\${r.name}" class="w-9 h-9 rounded-full object-cover ring-2 ring-orange-500/30">
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
      showToast('Thank you! Your verified review has been published.');
      form.reset();
    }

    // ==========================================
    // DISH DETAIL MODAL
    // ==========================================
    function openDishModal(dishId) {
      const dish = DISHES.find(d => d.id === dishId);
      if (!dish) return;

      document.getElementById('modalDishImage').src = dish.image;
      document.getElementById('modalDishTitle').textContent = dish.title;
      document.getElementById('modalDishPrice').textContent = '$' + dish.price.toFixed(2);
      document.getElementById('modalDishDesc').textContent = dish.desc;
      document.getElementById('modalDishCategory').textContent = dish.category.toUpperCase();
      document.getElementById('modalDishPrep').textContent = 'Prep: ' + dish.prepTime;
      
      const vegBadge = document.getElementById('modalDishVegBadge');
      if (vegBadge) {
        vegBadge.className = \`w-3 h-3 rounded-full \${dish.isVeg ? 'bg-emerald-500' : 'bg-red-500'}\`;
      }

      const addBtn = document.getElementById('modalAddBtn');
      if (addBtn) {
        addBtn.onclick = function() {
          quickAdd(dish.id);
          closeModal('dishModal');
        };
      }

      openModal('dishModal');
    }

    // ==========================================
    // LOCATION & NEWSLETTER
    // ==========================================
    function selectLocation(city, area) {
      document.getElementById('currentCityText').textContent = city;
      document.getElementById('currentAreaText').textContent = area;
      closeModal('locationModal');
      showToast(\`Delivery location set to \${city} (\${area}) 📍\`);
    }

    function submitNewsletter(event) {
      showToast('Subscribed to VIP Swiggy Gourmet alerts! 🍷');
      event.target.reset();
    }

    // ==========================================
    // UTILITIES
    // ==========================================
    function openModal(id) {
      if (id === 'checkoutModal') {
        updateCheckoutModalBill();
      }
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
      toast.className = 'fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl bg-orange-500 text-stone-950 text-xs font-black shadow-2xl transition-all duration-300 flex items-center gap-2.5';
      toast.innerHTML = '<i data-lucide="sparkles" class="w-4 h-4"></i><span>' + msg + '</span>';
      document.body.appendChild(toast);
      if (window.lucide) lucide.createIcons();
      
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }

    // Explicit window bindings
    window.filterCategory = filterCategory;
    window.setDietaryFilter = setDietaryFilter;
    window.handleSearch = handleSearch;
    window.resetFilters = resetFilters;
    window.quickAdd = quickAdd;
    window.updateQty = updateQty;
    window.removeFromCart = removeFromCart;
    window.renderCart = renderCart;
    window.renderMenu = renderMenu;
    window.openDishModal = openDishModal;
    window.applyPromoCode = applyPromoCode;
    window.applyEnteredCoupon = applyEnteredCoupon;
    window.processCheckout = processCheckout;
    window.simulateOrderTracking = simulateOrderTracking;
    window.submitReview = submitReview;
    window.selectLocation = selectLocation;
    window.submitNewsletter = submitNewsletter;
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

        console.log("Successfully saved FeastDash with all 72 Dishes across 9 Cuisines to database!");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

updateSite();
