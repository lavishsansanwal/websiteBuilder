import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import Website from "../models/website.model.js";
import { normalizeHtml } from "../utils/normalizeHtml.js";

async function fix() {
    try {
        await mongoose.connect(process.env.MONGODB_URL || process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const site = await Website.findById("6a8fc4c3c438ac7f645d3a98");
        if (!site) {
            console.log("Site 6a8fc4c3c438ac7f645d3a98 not found!");
            process.exit(1);
        }

        console.log("Fixing site:", site.title);
        let code = site.latestCode;

        // 1. Remove translate-x-full from cartItemsContainer and cartFooter
        code = code.replace(/id="cartItemsContainer"\s+class="([^"]*?)translate-x-full\s*([^"]*?)"/gi, 'id="cartItemsContainer" class="$1$2"');
        code = code.replace(/id="cartFooter"\s+class="([^"]*?)translate-x-full\s*([^"]*?)"/gi, 'id="cartFooter" class="$1$2"');

        // 2. Clean up any remaining extra spaces in class attributes
        code = code.replace(/id="cartItemsContainer"([^>]*?)class="([^"]*?)"/gi, (match, before, cls) => {
            const cleanCls = cls.replace(/\btranslate-x-full\b/g, '').replace(/\s+/g, ' ').trim();
            return `id="cartItemsContainer"${before}class="${cleanCls}"`;
        });
        code = code.replace(/id="cartFooter"([^>]*?)class="([^"]*?)"/gi, (match, before, cls) => {
            const cleanCls = cls.replace(/\btranslate-x-full\b/g, '').replace(/\s+/g, ' ').trim();
            return `id="cartFooter"${before}class="${cleanCls}"`;
        });

        // 3. Make sure renderCart handles items cleanly with delete button and empty state
        const enhancedRenderCart = `function renderCart() {
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
              <p class="text-xs text-stone-500 max-w-xs mx-auto">Explore our gourmet artisanal menu and add dishes to your bag.</p>
            </div>
            <button type="button" onclick="toggleDrawer('cartDrawer'); document.getElementById('menu').scrollIntoView({behavior: 'smooth'})" class="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs font-bold text-amber-400 hover:text-amber-300 transition">
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
            <button type="button" onclick="updateQty('\${item.id}', -1)" class="w-6 h-6 flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-900 rounded text-xs font-bold transition">-</button>
            <span class="text-xs font-bold text-white min-w-[16px] text-center">\${item.qty}</span>
            <button type="button" onclick="updateQty('\${item.id}', 1)" class="w-6 h-6 flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-900 rounded text-xs font-bold transition">+</button>
          </div>
          <button type="button" onclick="removeFromCart('\${item.id}')" class="p-1.5 text-stone-500 hover:text-rose-400 transition rounded-lg hover:bg-rose-500/10 shrink-0" title="Remove item">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      \`).join('');

      if (window.lucide) lucide.createIcons();
    }

    function removeFromCart(id) {
      cart = cart.filter(c => c.id !== id);
      renderCart();
      showToast('Item removed from your bag.');
    }`;

        // Replace existing renderCart
        code = code.replace(/function\s+renderCart\(\)\s*\{[\s\S]*?\n\s*\}\s*(?:\n\s*function\s+filterCategory|\n\s*\/\/ 4)/, `${enhancedRenderCart}\n\n    // 4`);

        // 4. Ensure quickAdd automatically opens the drawer if user wants, or keeps it updated
        const enhancedQuickAdd = `function quickAdd(id) {
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
      
      // Auto open drawer to show the added item
      const drawer = document.getElementById('cartDrawer');
      if (drawer && drawer.classList.contains('translate-x-full')) {
        drawer.classList.remove('translate-x-full');
        if (window.lucide) lucide.createIcons();
      }
    }`;

        code = code.replace(/function\s+quickAdd\(id\)\s*\{[\s\S]*?\n\s*\}\s*\n\s*function\s+updateQty/, `${enhancedQuickAdd}\n\n    function updateQty`);

        // 5. Run normalizeHtml
        const finalCode = normalizeHtml(code);

        site.latestCode = finalCode;
        await site.save();

        console.log("Successfully updated site FeastDash in database!");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

fix();
