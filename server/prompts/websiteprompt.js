import { commonRules } from "./commonRules.js";

export const websitePrompt = `
${commonRules}

==================================================
PAGE TYPE: FULL PRODUCTION MULTI-SECTION WEBSITE
==================================================

You are generating a COMPLETE, feature-packed, visually stunning, production-ready website for the user's business/project.

CRITICAL INSTRUCTION: Examine the USER PROMPT carefully and adapt the layout, theme, color scheme, sections, and JavaScript state engine to MATCH THE EXACT BUSINESS DOMAIN:

--------------------------------------------------
DOMAIN ARCHITECTURE SELECTION:
--------------------------------------------------

### 🛵 IF FOOD DELIVERY / FOOD ORDERING / SWIGGY / ZOMATO / UBEREATS PLATFORM:
Build an ultra-modern, high-converting, Swiggy-grade food delivery platform with deep multi-cuisine catalogs and rich interactivity:
- **Theme**: Luxury dark charcoal / obsidian theme (\`bg-[#0c0a09] text-stone-100\`) with appetizing electric orange & emerald accents (\`text-orange-400\`, \`bg-orange-500\`, \`bg-emerald-600\`, \`border-orange-500/20\`, \`bg-stone-900/90\`, \`border-stone-800\`).
- **Required Swiggy Architecture & Complete Sections**:
  1. **Top Promo Ticker & Sticky Header with Location Selector**:
     - Promo ribbon: "⚡ SWIGGY ONE: 50% OFF up to $100 with code SWIGGY50 • Free Delivery in ~25 mins!".
     - Brand Logo (e.g. "FeastDash / SavorDash" with utensils icon).
     - Interactive Location Dropdown (\`onclick="openModal('locationModal')"\`) displaying "📍 Indiranagar, Bengaluru ▼" with delivery time.
     - Offers Trigger (\`onclick="openModal('offersModal')"\`), Track Order shortcut, and Bag button with live counter badge.
  2. **High-Impact Hero Section (#hero)**:
     - Full-bleed hero banner with bold food photography, headline ("Craving greatness? Delivered hot & fresh."), delivery metrics ("Avg. 24 Mins • 4.9/5 Rating"), instant search input, and "Explore 72 Dishes" primary CTA button.
  3. **"What's on your mind?" Swiggy Circular Cuisine Carousel (#categories)**:
     - 9-12 circular cuisine photo shortcuts with smooth hover effects: Biryani, Pizza, Burgers, Indian, Chinese, South Indian, Desserts, Healthy, Drinks.
     - Clicking any circle filters the menu to those 8 dishes and smooth-scrolls to \`#menu\`.
  4. **Top Restaurant Chains in Your Area (#restaurants)**:
     - 4-8 restaurant cards featuring: Cover photo, discount banner overlay (e.g. "50% OFF UP TO $100"), green rating pill ("★ 4.9"), cuisine specialties, distance ("2.1 km"), and "Explore 8 Dishes ➔" button.
  5. **Full 72-Dish Gourmet Menu Catalog with Veg/Non-Veg Switch (#menu)**:
     - Veg / Non-Veg Quick Filter Bar (\`🟢 Pure Veg Only\`, \`🔴 Non-Veg\`, \`✨ All 72 Dishes\`).
     - 9 Cuisine Filter Tabs (\`🍛 Biryani (8)\`, \`🍕 Pizza (8)\`, \`🍔 Burgers (8)\`, \`🇮🇳 Indian (8)\`, \`🥡 Chinese (8)\`, \`🥞 South Indian (8)\`, \`🍰 Desserts (8)\`, \`🥗 Healthy (8)\`, \`🥤 Drinks (8)\`).
     - Live search bar filtering dish titles, descriptions, and ingredients in real-time.
     - Dish Grid (72 items total, 8 per category) with:
       - 🟢 / 🔴 Veg/Non-Veg icon badge
       - Title, Star rating, Price
       - Appetizing description of ingredients & flavors
       - Right-aligned high-res photo with Quick View modal trigger (\`openDishModal(id)\`)
       - Signature Swiggy **\`ADD\`** button that dynamically turns into a working **\`- 1 +\` quantity stepper** when added!
  6. **Live GPS Order Tracking Timeline (#tracking)**:
     - Interactive order tracking widget with search input, simulated order #FD-8942, animated progress bar (0% ➔ 25% ➔ 65% ➔ 100%), delivery partner Ramesh Kumar (★ 4.9), and live status steps.
  7. **Verified Diner Reviews (#reviews)**:
     - 3-4 verified diner review cards with 5-star ratings, dates, verified badges, and "Share Feedback" button opening \`#reviewModal\`.
  8. **Modern Functional Footer**:
     - Brand story, 9 cuisine links, delivery locations, VIP newsletter subscription, and working Back-to-Top button.
- **Required Modals & Floating Components**:
  - \`#floatingBottomCart\` (Swiggy-style green floating pill that appears on scroll when items are in bag: "🟢 2 ITEMS | $38.50 • VIEW CART ➔").
  - \`#cartDrawer\` (Slide-out delivery bag drawer with item list, \`- 1 +\` steppers, promo coupon input with \`SWIGGY50\` 50% discount support, subtotal, delivery fee, taxes, and grand total).
  - \`#checkoutModal\` (Payment options for UPI, Card, and Cash on Delivery + delivery address input).
  - \`#dishModal\` (Quick view modal with high-res photo, prep time, and Add to Bag button).
  - \`#offersModal\` (Available discount coupons list with 1-click apply).
  - \`#locationModal\` (Delivery zone selector with delivery time estimates).
  - \`#reviewModal\` (Write a verified review modal with 1-5 star selector).

--------------------------------------------------

### 🍷 IF RESTAURANT / BISTRO / FINE DINING / CAFE / BAKERY:
Build a luxury, warm, ambient dining website with table reservations, chef stories, wine pairings, and gourmet menus:
- **Theme**: Warm espresso dark theme (\`bg-[#0c0a09] text-stone-100\`) with amber/gold/terracotta/emerald accents (\`text-amber-400\`, \`bg-amber-500\`, \`border-amber-500/20\`, \`bg-stone-900/90\`, \`border-stone-800\`).
- **Required 8+ Complete Sections**:
  1. **Sticky Glass Navbar**: Brand Logo (e.g. "✦ Osteria Bella Vita" with wine/fork icon), Nav links (Story, Specialties, Menu, Ambiance, Reviews, Location), Call Us button, and primary glowing CTA button: \`<button onclick="openReservationModal()" class="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs hover:opacity-95 shadow-lg shadow-amber-500/20 flex items-center gap-2"><i data-lucide="calendar"></i> Reserve a Table</button>\`.
  2. **Atmospheric Hero Section (#hero)**:
     - Hero background with high-res dining ambiance image and dark gradient overlay.
     - Announcement Pill Badge (e.g. "★ Michelin Guide 2024 Recommended • Farm-to-Table").
     - Elegant Serif Headline (e.g. "Authentic Tuscan Heritage & Artisanal Culinary Art").
     - Subtitle describing the dining experience, fresh seasonal ingredients, and master chef passion.
     - Dual CTAs: "Explore Food Menu" (scrolls to \`#menu\`) + "Book a Table" (\`onclick="openReservationModal()"\`).
     - Floating Social Proof Badges: "★ 4.9 (1,200+ Diners)", "45+ Curated Italian Wines", "Fresh Daily Pasta".
  3. **Featured Master Kitchens & Multi-Cuisine Showcase (#restaurants)**:
      - Highlight a diverse variety of cuisines & featured restaurant concepts across:
        - 🍛 **Indian**: Rich royal curries, tandoori marinades, and garlic butter naans.
        - 🍕 **Pizza**: Authentic Neapolitan wood-fired pizzas with San Marzano D.O.P. & buffalo mozzarella.
        - 🍔 **Burgers**: Double smash A5 Wagyu patties, melted Vermont cheddar, and truffle aioli.
        - 🍚 **Biryani**: Traditional earthen handi slow dum biryanis layered with saffron basmati.
        - 🥢 **Chinese & Wok**: Steamed crystal dim sums, spicy Sichuan noodles, and Kung Pao chicken.
        - 🥥 **South Indian**: Golden crispy ghee roast dosas, fluffy idlis, and coconut sambar tiffins.
        - 🫓 **North Indian**: 24-hour charcoal-simmered Dal Makhani, Amritsari kulchas, and tandoor kebabs.
        - 🍰 **Desserts**: Decadent Italian Tiramisu, saffron gulab jamun cheesecake, and molten lava cakes.
        - 🥐 **Bakery**: Freshly laminated butter croissants, pain au chocolat, and rustic sourdough loaves.
        - 🥗 **Healthy Food**: Sashimi salmon poké bowls, Mediterranean quinoa salads, and keto plates.
        - 🍹 **Drinks**: Alphonso mango kesar lassis, nitro cold brew coffees, and spiced royal masala chai.
        - 🌮 **Street Food**: 6-flavor pani puri shots, Mumbai butter pav bhaji, and Kolkata kathi wraps.
  4. **Interactive Food Menu with 12 Category Filter Tabs & Instant Search (#menu)**:
     - Category filter pills for the 12 cuisines (All, Indian, Pizza, Burgers, Biryani, Chinese, South Indian, North Indian, Desserts, Bakery, Healthy, Drinks, Street Food).
     - Live search input: \`<input type="text" onkeyup="handleMenuSearch(this.value)" placeholder="Search biryani, pizza, dosa, butter chicken, dim sum...">\`.
     - Dish Grid (12-36 items) with:
       - Dish photo with hover zoom
       - Dietary badges (🌱 Vegan, 🌾 Gluten-Free, 🌶️ Spicy, ⭐ Chef Choice, 🍛 Heritage)
       - Title, Price (e.g. "$23.50")
       - Ingredients & Flavor summary
       - Action buttons: "Quick View" (\`onclick="openDishModal('\${d.id}')"\`) and "Add to Bag" (\`onclick="quickAdd('\${d.id}')"\`).
  5. **Chef's Story & Interior Ambiance (#story)**:
     - Split section: Left side master chef portrait & restaurant interior ambiance photos; Right side story of culinary heritage, generational recipes, organic Tuscan suppliers, and wood-fired oven philosophy.
  6. **Customer Testimonials & Critic Reviews (#reviews)**:
     - Overall Score Banner (4.9 / 5.0 score with 5 gold stars and badges like "Michelin Guide", "TripAdvisor Travelers Choice").
     - 3-4 verified diner review cards with customer photos, names, verified diner badge, star rating, date, and review text.
     - "Write a Review" button that opens \`#reviewModal\` with star selector and submits dynamically to the page with a success toast!
  7. **Hours, Location & Interactive Map Card (#location)**:
     - Opening hours table (Lunch 12:00-15:00, Dinner 18:00-23:00).
     - Simulated interactive map preview card with "Get Directions" and "Private Event Inquiries" button.
  8. **Modern Functional Footer (STRICTLY WORKING LINKS ONLY)**:
     - Column 1: Brand story, logo, and current copyright year.
     - Column 2: Quick Navigation links pointing ONLY to on-page sections (\`#hero\`, \`#story\`, \`#specialties\`, \`#menu\`, \`#reviews\`, \`#location\`).
     - Column 3: Contact & Hours (working \`mailto:\`, \`tel:\`, and "Inquire / Book Table" button triggering \`openModal('reservationModal')\`).
     - Column 4: Newsletter subscription with \`onsubmit="event.preventDefault(); showToast('Subscribed to VIP culinary updates! 🍷')"\` + Back-to-Top button.
     - Bottom Bar: Working "Privacy Policy" and "Terms" modal triggers (\`openModal('privacyModal')\`) and copyright notice. ZERO dummy links!
- **Required Modals & Drawers for Restaurant**:
  - \`#privacyModal\` (Modal displaying restaurant privacy & reservation policies - \`style="display: none;"\` by default).
  - \`#dishModal\` (Quick view modal with high-res photo, full ingredients, wine pairing, and dietary tags - \`style="display: none;"\` by default).
  - \`#reservationModal\` (Interactive table booking modal - \`style="display: none;"\` by default):
    - Date picker (\`type="date"\` with calendar icon).
    - Party Size selection pills (1, 2, 3, 4, 5, 6, 8+ Guests).
    - Time Slot selection pills (5:30 PM, 6:00 PM, 6:30 PM, 7:00 PM, 7:30 PM, 8:00 PM, 8:30 PM, 9:00 PM).
    - Seating Area selector (Cozy Main Dining Room, Romantic Garden Patio, Chef's Counter, Private Wine Cellar).
    - Special Occasion / Dietary Notes input.
    - Guest Full Name, Email, and Phone inputs.
    - Submit button: When submitted, renders an animated **Booking Confirmation Ticket** with Reference \`#RES-7829\`, table summary, and triggers \`showToast("Table reserved successfully! 🎉")\`.
  - \`#reviewModal\` (Write a review modal with clickable 1-5 star selector - \`style="display: none;"\` by default).
  - \`#cartDrawer\` (Slide-out takeaway order dr### 🛍️ IF E-COMMERCE / BRAND CLONE / NIKE / STREETWEAR / SNEAKERS / FASHION / RETAIL:
Build an ultra-rich, multi-collection, high-converting retail storefront with deep catalog departments and authentic brand fidelity:
- **Theme**: High-impact stark obsidian / stealth black theme (\`bg-[#06080d] text-white\` or \`bg-black text-white\`) with electric infrared, neon amber, volt, or monochrome silver accents (\`text-amber-400\`, \`bg-amber-500\`, \`border-amber-500/20\`, \`bg-slate-900/90\`, \`border-slate-800\`).
- **Typography**: Bold, heavy condensed italic typography (\`font-black uppercase italic tracking-tighter\`) matching iconic athletic & streetwear brands.
- **Required Multi-Department & Multi-Collection Architecture (At least 12-18 realistic items across 4-6 categories)**:
  1. **Top Sub-Brand Announcement Strip & Sticky Navbar**:
     - Sub-brand utility links (e.g. Jordan, Converse, SNKRS, Track Order, Help).
     - Promo ticker: "⚡ MEMBER EXCLUSIVE: Free Express Delivery on orders $100+ • Code: **NIKE20** for 20% OFF".
     - Sticky Header with brand logo, department links ("Featured", "Sneakers", "Apparel", "Innovation Lab", "Lookbook", "Reviews").
     - Search Bar with real-time multi-term filtering.
     - Wishlist Heart button (\`onclick="toggleDrawer('wishlistDrawer')"\`) with live count badge.
     - Dynamic Bag button (\`onclick="toggleDrawer('cartDrawer')"\`) with live item counter badge.
  2. **High-Impact Kinetic Hero Banner (#hero)**:
     - Full-bleed hero with dynamic athletic photography / 3D sneaker spotlight, seasonal pill badge ("Next-Gen Performance Drop 2025"), heavy condensed headline ("UNFILTERED INNOVATION." / "JUST DO IT."), dual CTAs ("Shop New Releases", "Explore Air Lab"), and trust metrics ("100% Authentic", "24-Hour Dispatch", "4.9/5 Rating").
  3. **Visual Department Category Carousel (#categories)**:
     - 4-6 circular department photo shortcuts with hover-zoom:
       - 👟 **Sneakers & Shoes** (\`onclick="filterCategory('sneakers')"\`)
       - 🧥 **Hoodies & Apparel** (\`onclick="filterCategory('hoodies')"\`)
       - 🏃 **Running & Performance** (\`onclick="filterCategory('running')"\`)
       - 👕 **Graphic Tees & Tops** (\`onclick="filterCategory('tees')"\`)
       - 🏀 **Jordan & Icon Series** (\`onclick="filterCategory('jordan')"\`)
       - 🎒 **Accessories & Gear** (\`onclick="filterCategory('accessories')"\`)
  4. **Multi-Category Filter Tabs & Real-Time Search Bar (#products)**:
     - Live search input: \`<input type="text" oninput="handleProductSearch(this.value)" placeholder="Search Jordan, Air Max, Pegasus, Tech Fleece...">\`.
     - 100% Functional Category Tabs with item counters: \`All Items (12+)\`, \`Sneakers (4+)\`, \`Apparel (4+)\`, \`Jordan (3+)\`, \`Accessories (3+)\`.
     - Clicking ANY category tab MUST instantly filter the product grid and highlight the active button!
  5. **Dense, Multi-Category Product Grid (At least 12-18 Realistic Items in JS)**:
     - Each product card MUST include:
       - Product Image with smooth hover-zoom and badge (e.g. \`BESTSELLER\`, \`NEW DROP\`, \`LIMITED\`, \`HOT\`).
       - Heart wishlist toggle button (\`onclick="window.toggleWishlist(this, 'p1')"\`).
       - Quick View eye button (\`onclick="window.openProductModal('p1')"\`).
       - Product Title (e.g. "Air Jordan 1 Retro Red Edition", "Pegasus Flyknit Turbo", "Tech Fleece Heavyweight Hoodie").
       - Subtitle category label & Star Rating ⭐⭐⭐⭐⭐ \`(4.9 • 240 reviews)\`.
       - Pricing: Sale price \`$139.00\` + Original strikethrough \`$180.00\`.
       - Primary Action Button: \`<button onclick="window.addToCart('p1', ...)" class="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider transition shadow-md shadow-amber-500/20 flex items-center gap-1.5"><i data-lucide="shopping-bag"></i> <span>Add to Bag</span></button>\`.
  6. **Innovation Lab / Tech Showcase (#sneaker-lab)**:
     - Highlighting Zoom Air pods, React foam, carbon fiber plating, with 3 metric cards (e.g. "88% Energy Return", "195g Featherweight", "3D Flyknit") and "Inspect Tech" modal trigger.
  7. **Editorial Streetwear & Athletic Lookbook (#lookbook)**:
     - 3 editorial lifestyle looks with interactive "Shop the Look" buttons that open the matching product quick-view modal.
  8. **Verified Customer Reviews & Community (#reviews)**:
     - 4.9/5 overall rating summary with 3 verified buyer review cards and "Write a Review" button opening \`#reviewModal\`.
  9. **Live Order Tracking & Dispatch Timeline (#tracking)**:
     - Order tracking lookup form with interactive 4-step dispatch status (Order Placed ➔ Quality Verified ➔ In Transit ➔ Delivered).
  10. **Modern Functional Footer (STRICTLY WORKING LINKS ONLY)**:
      - Brand mission, on-page anchor navigation, customer care modal triggers, newsletter sign-up with toast feedback, and Back to Top button.
- **Required Modals & Drawers for E-Commerce**:
  - \`#cartDrawer\` (Slide-out shopping bag: **Starts empty** with \`let cart = [];\`. Features item list, \`+\` / \`-\` quantity steppers, promo code \`NIKE20\` with 20% discount calculation, subtotal, free shipping indicator, and "Proceed to Checkout" button).
  - \`#wishlistDrawer\` (Slide-out saved items with "Move to Bag" action).
  - \`#productModal\` (Product Quick View with image, size selector pills \`US 8\`, \`US 9\`, \`US 10\`, \`US 11\`, color swatches, and instant Add to Bag).
  - \`#checkoutModal\` (Fast dispatch checkout with Name, Email, Phone, Address, payment choice, and instant confirmation).
  - \`#reviewModal\` (Write a review modal with 1-5 star selector).
  - \`#privacyModal\` (Terms & authenticity policy modal).

--------------------------------------------------

### 💼 IF SERVICES / AGENCY / SAAS / CORPORATE / PORTFOLIO / FITNESS / HEALTHCARE:
Build a high-converting modern digital showcase:
- **Theme**: Deep slate dark theme (\`bg-[#070b12] text-slate-100\`) with indigo/cyan/emerald accents.
- **Required Sections**:
  1. Sticky Glass Header with Brand Logo, Nav links, and "Book Consultation" / "Get Started" CTA button.
  2. Hero Section with gradient headline, value proposition, dual CTAs, interactive product/service preview, and client logos.
  3. Services Bento Grid with icon badges, descriptions, and "Learn More" modal trigger.
  4. Interactive Case Studies / Portfolio with filter tabs and metric statistics.
  5. Interactive Pricing Table with Monthly vs Annual (Save 20%) billing toggle switch.
  6. Team / Leadership Showcase.
  7. Verified Testimonials Wall of Love with star ratings.
  8. Interactive FAQ Accordion.
  9. High-impact Consultation / Contact Form Section (#contact) with 3 required inputs: Full Name (\`data-lucide="user"\`), Work Email (\`data-lucide="mail"\`), and Phone Number (\`data-lucide="phone"\`) + Project scope and instant toast confirmation.
  10. Modern Functional Footer (ONLY working on-page anchors \`#hero\`, \`#services\`, \`#pricing\`, \`#testimonials\`, \`#faq\`, \`#contact\`, working \`#privacyModal\` trigger, working email/phone links, newsletter capture with toast, and Back to Top).
- **Required Modals**:
  - \`#privacyModal\` (Privacy & Terms modal - \`style="display: none;"\` by default).
  - \`#consultationModal\` / \`#serviceModal\` (Interactive consultation booking / quote request modal with Name, Email, Phone inputs - \`style="display: none;"\` by default).
  - \`#reviewModal\` (Write a review modal).ationModal\` / \`#serviceModal\` (Interactive consultation booking / quote request modal with Name, Email, Phone inputs - \`style="display: none;"\` by default).
  - \`#reviewModal\` (Write a review modal).

==================================================
CRITICAL PAGE STRUCTURE (VERTICAL FLOW ONLY)
==================================================
The document MUST follow this clean vertical layout:
\`\`\`html
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Website Title</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/lucide@latest"></script>
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
            dark: { 950: '#070b12', 900: '#0b0f19', 800: '#111827', 700: '#1f2937' },
            stoneDark: { 950: '#0c0a09', 900: '#140f0c', 800: '#1c1714', 700: '#29221d' },
            brand: { 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706' },
            indigoBrand: { 400: '#818cf8', 500: '#6366f1', 600: '#4f46e5' }
          }
        }
      }
    }
  </script>
</head>
<body class="bg-[#0c0a09] text-stone-100 font-sans min-h-screen flex flex-col overflow-x-hidden">
  
  <!-- STICKY NAVBAR -->
  <header class="sticky top-0 z-40 w-full bg-[#0c0a09]/90 backdrop-blur-xl border-b border-stone-800/80">...</header>

  <!-- MAIN CONTENT SECTIONS -->
  <main class="flex-1 w-full flex flex-col">
    <!-- All sections rendered in clean vertical order -->
  </main>

  <!-- FOOTER -->
  <footer class="bg-[#080605] border-t border-stone-800/80 pt-16 pb-12">...</footer>

  <!-- ================= DRAWERS & MODALS (MUST HAVE style="display: none;" OR translate-x-full) ================= -->
  
</body>
</html>
\`\`\`

==================================================
COMPLETE IN-MEMORY JAVASCRIPT STATE ENGINE (MANDATORY & ATTACHED TO WINDOW)
==================================================
Inside \`<script>\`, ALWAYS implement a complete, self-contained JavaScript engine with:
1. **Data State Arrays**: Rich initial items (8-16 items with real names, images, descriptions, prices, tags, categories).
2. **Category / Cuisine Filter & Search Handlers**:
   \`\`\`javascript
   window.currentCategory = 'all';
   window.filterCategory = function(cat) {
     window.currentCategory = (cat || 'all').toLowerCase().trim();
     document.querySelectorAll('.cat-pill, .chip-btn, .category-card, [data-category-btn], [onclick*="filterCategory"]').forEach(function(btn) {
       var onclickAttr = (btn.getAttribute('onclick') || '').toLowerCase();
       var txt = (btn.textContent || '').toLowerCase();
       var match = (window.currentCategory === 'all' && (onclickAttr.includes("'all'") || txt.includes('view all') || txt.includes('all'))) ||
                   (onclickAttr.includes("'" + window.currentCategory + "'") || onclickAttr.includes('"' + window.currentCategory + '"') || txt.includes(window.currentCategory));
       if (match) {
         btn.classList.add('border-orange-500', 'border-amber-500', 'bg-zinc-800', 'bg-slate-800', 'shadow-lg');
       } else {
         btn.classList.remove('border-orange-500', 'border-amber-500', 'bg-zinc-800', 'bg-slate-800', 'shadow-lg');
       }
     });
     if (typeof renderProducts === 'function') renderProducts();
     if (typeof renderMenu === 'function') renderMenu();
     if (typeof renderDishes === 'function') renderDishes();

     var target = document.getElementById('products') || document.getElementById('menu') || document.getElementById('catalog') || document.getElementById('dishes') || document.getElementById('productGrid');
     if (target) {
       target.scrollIntoView({ behavior: 'smooth', block: 'start' });
     }
     window.showToast('Filtered by ' + (cat === 'all' ? 'All Items' : cat.toUpperCase()));
   };
   window.filterCuisine = window.filterCategory;
   window.filterProducts = window.filterCategory;
   window.handleSearch = function(query) {
     window.searchQuery = (query || '').toLowerCase().trim();
     if (typeof renderProducts === 'function') renderProducts();
     if (typeof renderMenu === 'function') renderMenu();
     if (typeof renderDishes === 'function') renderDishes();
   };
   window.handleProductSearch = window.handleSearch;
   window.handleMenuSearch = window.handleSearch;
   ```
3. **Cart & Wishlist Handlers**:
   ```javascript
    window.cart = [];
    window.wishlist = [];
    window.addToCart = function(id, name, price, img) {
      var allItems = (typeof products !== 'undefined' && Array.isArray(products)) ? products :
                     (typeof dishes !== 'undefined' && Array.isArray(dishes)) ? dishes :
                     (typeof menuItems !== 'undefined' && Array.isArray(menuItems)) ? menuItems : [];
      var found = allItems.find(function(i) { return i.id === id; });
      var itemName = name || (found ? found.name : 'Item');
      var itemPrice = (price !== undefined && price !== null) ? parseFloat(price) : (found ? parseFloat(found.price) : 49);
      var itemImg = img || (found ? found.img : '');

      var existing = window.cart.find(function(item) { return item.id === id; });
      if (existing) {
        existing.qty += 1;
      } else {
        window.cart.push({ id: id, name: itemName, price: itemPrice, img: itemImg, qty: 1 });
      }
      window.updateCartUI();
      window.showToast(itemName + ' added to Bag! 🛒');
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
     window.showToast('Item removed from Bag');
   };
    window.updateCartUI = function() {
      var totalCount = window.cart.reduce(function(sum, i) { return sum + i.qty; }, 0);
      var subtotal = window.cart.reduce(function(sum, i) { return sum + (i.price * i.qty); }, 0);
      var discountVal = subtotal * (window.appliedDiscount || 0);
      var grandTotal = Math.max(0, subtotal - discountVal);

      // Badges
      var badges = document.querySelectorAll('.cart-count-badge, #cartCountBadge, #cartBadgeCount, [data-cart-count]');
      badges.forEach(function(b) {
        b.textContent = totalCount;
        b.style.display = totalCount > 0 ? 'inline-flex' : 'none';
      });

      // Subtotals & Grand Totals across all common selector patterns
      var subtotalEls = document.querySelectorAll('#cartSubtotal, #cartSubtotalText, #cartSubtotalVal, #subtotalText, .cart-subtotal');
      subtotalEls.forEach(function(el) { el.textContent = '$' + subtotal.toFixed(2); });

      var totalEls = document.querySelectorAll('#cartTotal, #cartGrandTotal, #cartGrandTotalText, #cartTotalText, #grandTotalText, #floatingCartTotal, .cart-total');
      totalEls.forEach(function(el) { el.textContent = '$' + grandTotal.toFixed(2); });

      if (typeof renderCartDrawer === 'function') renderCartDrawer();
    };
   window.toggleWishlist = function(btn, id) {
     var idx = window.wishlist.indexOf(id);
     var icon = btn ? btn.querySelector('svg, i') : null;
     if (idx === -1) {
       window.wishlist.push(id);
       if (btn) btn.classList.add('text-rose-500', 'fill-rose-500');
       window.showToast('Added to Wishlist! ❤️');
     } else {
       window.wishlist.splice(idx, 1);
       if (btn) btn.classList.remove('text-rose-500', 'fill-rose-500');
       window.showToast('Removed from Wishlist');
     }
     var wBadges = document.querySelectorAll('.wishlist-count-badge, #wishlistCountBadge');
     wBadges.forEach(function(b) { b.textContent = window.wishlist.length; });
   };
   \`\`\`
4. **Modal & Drawer Toggle Functions**:
   \`\`\`javascript
   window.openModal = function(id) {
     var el = document.getElementById(id);
     if (el) {
       el.style.display = 'flex';
       el.classList.remove('hidden');
     }
     if (window.lucide) lucide.createIcons();
   };
   window.closeModal = function(id) {
     var el = document.getElementById(id);
     if (el) {
       el.style.display = 'none';
       el.classList.add('hidden');
     }
   };
   window.toggleDrawer = function(id) {
     var el = document.getElementById(id);
     if (el) {
       el.classList.toggle('translate-x-full');
     }
     if (window.lucide) lucide.createIcons();
   };
   \`\`\`
5. **Form Handling with Interactive Feedback**:
   - \`window.submitReservation(event)\` validates inputs, renders confirmation ticket, and calls \`showToast("Table reserved successfully! 🎉")\`.
   - \`window.submitReview(event)\` adds review to array, re-renders reviews, and calls \`showToast("Thank you! Review published ⭐")\`.
   - \`window.submitLeadForm(event)\` extracts contact info and calls \`showToast("Inquiry received! We will reach out shortly. 🚀")\`.
   - \`window.processCheckout(event)\` clears cart, closes checkout modal, and calls \`showToast("Order placed successfully! Tracking #ORD-8942 🎉")\`.
6. **Toast Notification System**:
   \`\`\`javascript
   window.showToast = function(msg) {
     var existing = document.getElementById('globalToast');
     if (existing) existing.remove();
     var toast = document.createElement('div');
     toast.id = 'globalToast';
     toast.className = 'fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-amber-500 text-black text-xs font-extrabold shadow-2xl transition-all duration-300 flex items-center gap-2 pointer-events-auto';
     toast.innerHTML = '<i data-lucide="sparkles" class="w-4 h-4"></i><span>' + msg + '</span>';
     document.body.appendChild(toast);
     if (window.lucide) lucide.createIcons();
     setTimeout(function() {
       toast.style.opacity = '0';
       setTimeout(function() { toast.remove(); }, 300);
     }, 3000);
   };
   \`\`\`
7. **Initialization**:
   \`\`\`javascript
   document.addEventListener('DOMContentLoaded', function() {
     if (typeof renderMenu === 'function') renderMenu();
     if (typeof renderProducts === 'function') renderProducts();
     if (typeof renderReviews === 'function') renderReviews();
     if (typeof updateCartUI === 'function') updateCartUI();
     if (window.lucide) lucide.createIcons();
   });
   \`\`\`

==================================================
TOKEN BUDGET & COMPLETENESS (CRITICAL):
==================================================
- Ensure the complete HTML page is between 350 to 550 lines of clean, concise, production-ready code.
- Use compact arrays (6-8 items max) so you NEVER exceed output token limits.
- Make sure ALL <script> tags, template literals, functions, and </html> are 100% complete and NEVER cut off.

==================================================
USER PROMPT:
==================================================
{USER_PROMPT}

==================================================
UPLOADED DATA:
==================================================
{UPLOADED_DATA}

Return ONLY one valid raw JSON object without markdown code fences containing:
{
  "code": "<!DOCTYPE html>...",
  "message": "Short summary of the generated website",
  "imageQueries": []
}
`;

export default websitePrompt;