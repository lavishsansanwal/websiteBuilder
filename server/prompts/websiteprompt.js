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

### 🍷 IF RESTAURANT / BISTRO / CAFE / BAKERY / PIZZERIA / FOOD & DINING:
Build a luxury, warm, ambient dining website:
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
  3. **Chef's Specialties & Signatures (#specialties)**:
     - 3-4 featured signature dish cards (e.g. Truffle Tagliatelle, Bistecca alla Fiorentina, Burrata Caprese, Wood-fired Margherita).
     - Each card features: Chef's Badge, appetizing photo, price, detailed description, wine pairing recommendation, and "Quick View" / "Add to Order" buttons.
  4. **Interactive Food Menu with Category Filter Tabs (#menu)**:
     - Category filter pills: All, Antipasti / Starters, Primi / Handmade Pasta, Secondi / Wood-Fired Mains, Pizza Napoletana, Dolci / Artisan Desserts, Fine Wines & Cocktails.
     - Live search input: \`<input type="text" onkeyup="handleMenuSearch(this.value)" placeholder="Search pasta, pizza, wine...">\`.
     - Dish Grid (8-10 items) with:
       - Dish photo with hover zoom
       - Dietary badges (🌱 Vegan, 🌾 Gluten-Free, 🌶️ Spicy, ⭐ Chef Choice)
       - Title, Price (e.g. "$24.00")
       - Ingredients summary (e.g. "San Marzano D.O.P., Buffalo Mozzarella, Fresh Basil, Extra Virgin Olive Oil")
       - Action buttons: "Quick View" (\`onclick="openDishModal('\${d.id}')"\`) and "Add to Order" (\`onclick="addToCart('\${d.id}')"\`).
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
  - \`#cartDrawer\` (Slide-out takeaway order drawer with items, subtotal, tip selector, and checkout - \`translate-x-full\` by default).

--------------------------------------------------

### 🛍️ IF E-COMMERCE / STREETWEAR / SNEAKERS / FASHION / ELECTRONICS / MULTI-CATEGORY RETAIL (e.g. Snitch, Flipkart, Zara, Nike):
Build an ultra-rich, multi-collection, high-converting retail storefront with deep catalog departments and rich interactivity:
- **Theme**: Luxury obsidian streetwear / modern retail dark theme (\`bg-[#06080d] text-slate-100\`) with vibrant neon amber, electric violet, or cobalt accents (\`text-amber-400\`, \`bg-amber-500\`, \`border-amber-500/20\`, \`bg-slate-900/90\`, \`border-slate-800\`).
- **Required Multi-Department & Multi-Collection Architecture (At least 12-16 realistic products across collections)**:
  1. **Top Announcement Strip & Sticky Navbar**:
     - Promotional top ticker (e.g., "⚡ DROP 04: Free Express Delivery on orders over $100 • Use Code: STREET20 for 20% OFF").
     - Brand Logo (e.g., "✦ KRONOS APPAREL" / "SNITCH LAB").
     - Department Links ("Sneakers", "Hoodies & Tees", "Cargo Pants", "Lookbook", "Sale").
     - Search Bar trigger with live instant input.
     - Wishlist Heart button (\`onclick="openWishlistDrawer()"\`) with badge counter.
     - Dynamic Bag / Cart button (\`onclick="openCartDrawer()"\`) with live count badge \`<span id="cartCountBadge" class="bg-amber-500 text-black font-extrabold text-xs px-2 py-0.5 rounded-full">0</span>\`.
  2. **High-Impact Hero Banner (#hero)**:
     - Full-bleed hero banner with bold editorial street model / sneaker drop photo, seasonal badge ("LIMITED SUMMER DROP 2024"), heavy kinetic typography ("UNFILTERED STREETWEAR & SNEAKER ARCHIVE"), and dual CTAs ("Shop All Drops", "Explore Lookbook").
  3. **Visual Department Category Strip / Carousel (#categories)**:
     - 5-6 circular/card department shortcuts with high-res photos and category labels:
       - 👟 **Sneakers & Trainers** (\`onclick="filterCategory('sneakers')"\`)
       - 👕 **Oversized Graphic Tees** (\`onclick="filterCategory('tees')"\`)
       - 🧥 **Heavyweight Hoodies** (\`onclick="filterCategory('hoodies')"\`)
       - 👖 **Tactical Cargo & Denim** (\`onclick="filterCategory('pants')"\`)
       - 🥼 **Windbreakers & Outerwear** (\`onclick="filterCategory('jackets')"\`)
       - 🧢 **Caps, Bags & Accessories** (\`onclick="filterCategory('accessories')"\`)
  4. **Multi-Category Filter Tabs & Real-Time Search Bar (#products)**:
     - Live search input: \`<input type="text" oninput="handleProductSearch(this.value)" placeholder="Search sneakers, boxy hoodies, parachute pants...">\`.
     - Filter Pills: \`All Items (16)\`, \`Sneakers (4)\`, \`Hoodies & Tees (4)\`, \`Cargo Pants (4)\`, \`Outerwear (4)\`, \`Accessories (4)\`.
     - Sort dropdown (Featured, Price: Low to High, Price: High to Low, Customer Rating).
  5. **Rich Product Grid (At least 12-16 Diverse, High-Res Product Cards)**:
     - Each product card MUST include:
       - Product Image with smooth hover-zoom and discount pill (e.g. \`30% OFF\`, \`BESTSELLER\`, \`HOT DROP\`).
       - Heart wishlist toggle button (\`onclick="toggleWishlist(this, 'product_id')"\`).
       - Quick View eye button (\`onclick="openProductModal('product_id')"\`).
       - Product Title (e.g. "AeroRunner High-Top Retro Trainers", "Tokyo Acid-Wash Boxy Tee", "Modular 6-Pocket Tactical Cargo").
       - Star Rating ⭐⭐⭐⭐⭐ \`(4.9 • 180+ sold)\`.
       - Pricing: Sale price \`$89.00\` + Original strikethrough \`$130.00\`.
       - Size Selector Pills (\`S\`, \`M\`, \`L\`, \`XL\` or \`US 8\`, \`US 9\`, \`US 10\`, \`US 11\`).
       - Color Swatches (\`⚫ Black\`, \`⚪ Off-White\`, \`🟢 Olive\`, \`🟣 Violet\`).
       - Primary Action Button: \`<button onclick="addToCart('p1', 'AeroRunner High-Top', 89, 'https://images.unsplash.com/...', 'US 9', 'Black')" class="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"><i data-lucide="shopping-bag"></i> Add to Bag</button>\`.
  6. **Curated Footwear & Sneaker Lab Section (#sneaker-lab)**:
     - Dedicated highlight showcasing 3-4 limited edition sneakers with 360 view badge, cushioned insole specs, and direct size selection.
  7. **Editorial Urban Lookbook (#lookbook)**:
     - High-fashion lifestyle model photoshoot with interactive "Shop the Look" callouts.
  8. **Flash Deal Countdown Section (#flash-sale)**:
     - Live JS countdown timer (\`04h : 18m : 45s\`), progress bar ("78% Claimed"), and instant discount promo code box with copy button.
  9. **Verified Customer Reviews & Photo Gallery (#reviews)**:
     - 4.9/5 overall rating summary with 5-star distribution bars, verified buyer badges, and "Write a Review" modal trigger (\`openModal('reviewModal')\`).
  10. **Order Tracking & Dispatch Timeline (#tracking)**:
      - Live tracking search box (e.g. Enter \`#KRN-8492\`) with interactive 4-step dispatch status (Order Placed ➔ Packed ➔ Shipped ➔ Delivered).
  11. **Modern Functional Footer (STRICTLY WORKING LINKS ONLY)**:
      - Brand story, working on-page anchors (\`#hero\`, \`#products\`, \`#categories\`, \`#lookbook\`, \`#reviews\`, \`#tracking\`), newsletter sign-up with toast, payment partner badges (Visa, Mastercard, Apple Pay, UPI), and working \`#privacyModal\` trigger.
- **Required Modals & Drawers for E-Commerce**:
  - \`#cartDrawer\` (Slide-out shopping bag: **Starts empty** with \`let cart = [];\`. When items are added, renders thumbnail, title, size, color, quantity adjusters \`+\` / \`-\`, remove button, subtotal, promo code input \`STREET20\`, and "Proceed to Checkout" button).
  - \`#wishlistDrawer\` (Slide-out saved items drawer with "Move to Bag" action).
  - \`#productModal\` (Product Quick View with image gallery, detailed sizing chart, material breakdown, and Add to Bag).
  - \`#checkoutModal\` (Step 1: Shipping address with Name, Email, Phone, Address; Step 2: Payment choice with Card/UPI/COD; Step 3: Instant confirmed order receipt with Order ID \`#KRN-9482\`).
  - \`#trackingModal\` (Interactive delivery status lookup modal).
  - \`#reviewModal\` (Interactive review submission modal).
  - \`#privacyModal\` (Terms & Shipping policy modal).

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
COMPLETE IN-MEMORY JAVASCRIPT STATE ENGINE REQUIREMENTS
==================================================
Inside \`<script>\`, ALWAYS implement a complete, self-contained JavaScript engine with:
1. **Data State Arrays**: Rich initial items (6-10 items with real names, images, descriptions, prices, tags).
2. **Dynamic Render Functions**: Render items dynamically and attach event listeners.
3. **Modal & Drawer Toggle Functions**:
   \`\`\`javascript
   function openModal(id) {
     var el = document.getElementById(id);
     if (el) el.style.display = 'flex';
     if (window.lucide) lucide.createIcons();
   }
   function closeModal(id) {
     var el = document.getElementById(id);
     if (el) el.style.display = 'none';
   }
   function toggleDrawer(id) {
     var el = document.getElementById(id);
     if (el) el.classList.toggle('translate-x-full');
     if (window.lucide) lucide.createIcons();
   }
   \`\`\`
4. **Form Handling with Interactive Feedback**:
   - For Restaurant: \`submitReservation(event)\` validates inputs, generates a reference code (e.g. \`#RES-7829\`), renders an animated Confirmation Ticket into the modal with date/time/guest summary, and calls \`showToast("Table reserved successfully for Friday at 7:30 PM! 🎉")\`.
   - For Reviews: \`submitReview(event)\` appends the review to the reviews array, re-renders the reviews grid, closes the modal, and calls \`showToast("Thank you! Your review has been published.")\`.
   - For Cart & Orders: Start with empty array \`let cart = [];\` (NEVER pre-populate with mock items). Implement \`addToCart(id)\`, \`updateCartQty(id, delta)\`, \`removeCartItem(id)\`, \`processPayment(event)\` with simulated order tracking. The bag MUST start with 0 items on load.
5. **Toast Notification System**:
   \`\`\`javascript
   function showToast(msg) {
     var existing = document.getElementById('globalToast');
     if (existing) existing.remove();
     var toast = document.createElement('div');
     toast.id = 'globalToast';
     toast.className = 'fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-amber-500 text-black text-xs font-extrabold shadow-2xl transition-all duration-300 flex items-center gap-2';
     toast.innerHTML = '<i data-lucide="sparkles" class="w-4 h-4"></i><span>' + msg + '</span>';
     document.body.appendChild(toast);
     if (window.lucide) lucide.createIcons();
     setTimeout(function() {
       toast.style.opacity = '0';
       setTimeout(function() { toast.remove(); }, 300);
     }, 3000);
   }
   \`\`\`
6. **Initialization**:
   \`\`\`javascript
   document.addEventListener('DOMContentLoaded', function() {
     if (typeof renderMenu === 'function') renderMenu();
     if (typeof renderProducts === 'function') renderProducts();
     if (typeof renderReviews === 'function') renderReviews();
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