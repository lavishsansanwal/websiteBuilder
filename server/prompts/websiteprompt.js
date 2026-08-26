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

### 🛍️ IF E-COMMERCE / STREETWEAR / FASHION / ELECTRONICS / RETAIL STORE:
Build an ultra-sleek, end-to-end online store:
- **Theme**: Obsidian dark theme (\`bg-[#070b12] text-slate-100\`) with amber/orange accents.
- **Required Sections**:
  1. Sticky Navbar with Brand Logo, Search trigger, Wishlist counter, Cart counter (starts at 0 / hidden when empty), and Track Order button.
  2. Hero Section with Announcement pill, high-impact imagery, dual CTAs ("Shop Collection", "Lookbook"), and trust badges.
  3. Product Catalog with Live Search, Multi-Category Filter Pills, and Sort Dropdown.
  4. Product Grid (6-8 items) with badges ("20% OFF", "Bestseller"), hover zoom, wishlist heart toggle, quick view eye button, price, and Add to Cart button.
  5. Lookbook & Brand Story showcase.
  6. Customer Reviews & Ratings section with 5-star breakdown bars and "Write a Review" modal.
  7. Order Tracking Section with 4-step progress timeline.
  8. Modern Functional Footer (ONLY working on-page anchors \`#hero\`, \`#products\`, \`#lookbook\`, \`#reviews\`, \`#tracking\`, working modal triggers \`#privacyModal\`, \`#trackingModal\`, newsletter subscription with toast, and Back-to-Top).
- **Required Modals & Drawers**:
  - \`#privacyModal\` (Terms & Privacy modal - \`style="display: none;"\` by default).
  - \`#productModal\` (Product Quick View with size pills, color selector, quantity, and specs).
  - \`#cartDrawer\` (Slide-out cart drawer: **MUST start completely empty** with \`let cart = [];\`. When empty, renders "Your bag is empty" empty state with a "Browse Collection" button. Items are ONLY added when user clicks "Add to Cart").
  - \`#wishlistDrawer\` (Slide-out wishlist drawer with Move to Cart and Remove actions).
  - \`#checkoutModal\` (Multi-step checkout with shipping address and simulated payment gateway: Card / UPI / COD).
  - \`#trackingModal\` (Order tracking modal with 4-step progress timeline).
  - \`#reviewModal\` (Write a review modal).

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