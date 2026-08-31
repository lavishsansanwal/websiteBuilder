import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Website from '../models/website.model.js';

dotenv.config();

const nikeProducts = [
  {
    id: 'p1',
    name: 'Nike Air Max Plus Drift',
    category: 'sneakers',
    dept: 'sneakers',
    price: 185,
    oldPrice: 210,
    rating: 4.9,
    reviewsCount: 240,
    tag: 'NEW DROP',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    desc: 'Engineered with dual-pressure Zoom Air pods for maximum kinetic return and targeted forefoot support.'
  },
  {
    id: 'p2',
    name: 'Air Jordan 1 Retro High OG',
    category: 'jordan',
    dept: 'jordan',
    price: 180,
    oldPrice: 220,
    rating: 5.0,
    reviewsCount: 512,
    tag: 'ICONIC',
    img: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
    desc: 'Pristine full-grain leather construction layered over classic rubber cupsole cushioning.'
  },
  {
    id: 'p3',
    name: 'Nike Tech Fleece Heavyweight Hoodie',
    category: 'apparel',
    dept: 'apparel',
    price: 130,
    oldPrice: 155,
    rating: 4.8,
    reviewsCount: 190,
    tag: 'BESTSELLER',
    img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    desc: 'Double-sided smooth fleece providing lightweight warmth with tailored ergonomic seams.'
  },
  {
    id: 'p4',
    name: 'Nike ZoomX Vaporfly NEXT% 3',
    category: 'running',
    dept: 'running',
    price: 260,
    oldPrice: 300,
    rating: 4.9,
    reviewsCount: 310,
    tag: 'RACE DAY',
    img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
    desc: 'Full-length carbon fiber Flyplate paired with ultra-light ZoomX foam for marathon dominance.'
  },
  {
    id: 'p5',
    name: 'Air Jordan 4 Retro Metallic Silver',
    category: 'jordan',
    dept: 'jordan',
    price: 210,
    oldPrice: 250,
    rating: 5.0,
    reviewsCount: 420,
    tag: 'LIMITED',
    img: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&auto=format&fit=crop&q=80',
    desc: 'Sculpted heel wings and visible Air-Sole unit in a high-voltage metallic finish.'
  },
  {
    id: 'p6',
    name: 'Nike Solo Swoosh Heavyweight Tee',
    category: 'graphic-tees',
    dept: 'graphic-tees',
    price: 45,
    oldPrice: 60,
    rating: 4.7,
    reviewsCount: 145,
    tag: 'STREETWEAR',
    img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    desc: 'Premium 100% organic cotton drop-shoulder streetwear silhouette with embroidered tonal Swoosh.'
  },
  {
    id: 'p7',
    name: 'Nike Utility Elite Duffel Bag 32L',
    category: 'accessories',
    dept: 'accessories',
    price: 85,
    oldPrice: 110,
    rating: 4.8,
    reviewsCount: 88,
    tag: 'GEAR',
    img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    desc: 'Water-resistant coated canvas with dedicated ventilated shoe compartment and padded straps.'
  },
  {
    id: 'p8',
    name: 'Nike Air Force 1 07 Triple White',
    category: 'sneakers',
    dept: 'sneakers',
    price: 115,
    oldPrice: 135,
    rating: 4.9,
    reviewsCount: 1250,
    tag: 'CLASSIC',
    img: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=800&auto=format&fit=crop&q=80',
    desc: 'The legendary silhouette featuring crisp leather overlays and encapsulated Nike Air unit.'
  },
  {
    id: 'p9',
    name: 'Jordan Flight Heritage Cargo Pants',
    category: 'jordan',
    dept: 'jordan',
    price: 110,
    oldPrice: 140,
    rating: 4.7,
    reviewsCount: 94,
    tag: 'STREET',
    img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
    desc: 'Durable stretch twill fabric equipped with heavy-duty snap cargo pockets.'
  },
  {
    id: 'p10',
    name: 'Nike Dri-FIT Apex Bucket Hat',
    category: 'accessories',
    dept: 'accessories',
    price: 38,
    oldPrice: 50,
    rating: 4.6,
    reviewsCount: 62,
    tag: 'NEW',
    img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80',
    desc: 'Moisture-wicking 360-degree brim hat engineered to block solar rays during workouts.'
  },
  {
    id: 'p11',
    name: 'Nike Sportswear Windrunner Jacket',
    category: 'apparel',
    dept: 'apparel',
    price: 120,
    oldPrice: 150,
    rating: 4.8,
    reviewsCount: 204,
    tag: 'WEATHER-PROOF',
    img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80',
    desc: 'Iconic 26-degree chevron design made from lightweight, wind-resistant woven taffeta.'
  },
  {
    id: 'p12',
    name: 'Nike Pegasus Trail 4 GORE-TEX',
    category: 'running',
    dept: 'running',
    price: 170,
    oldPrice: 200,
    rating: 4.9,
    reviewsCount: 180,
    tag: 'TRAIL RUN',
    img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=80',
    desc: 'Waterproof GORE-TEX layer coupled with rugged multi-surface rubber lugs.'
  },
  {
    id: 'p13',
    name: 'Nike SB Dunk Low Pro Chicago',
    category: 'sneakers',
    dept: 'sneakers',
    price: 135,
    oldPrice: 160,
    rating: 4.9,
    reviewsCount: 430,
    tag: 'LIMITED DROP',
    img: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=800&auto=format&fit=crop&q=80',
    desc: 'Iconic red, white, and black color blocking with padded tongue and Zoom Air heel unit.'
  },
  {
    id: 'p14',
    name: 'Nike Air Zoom Alphafly NEXT% 2',
    category: 'running',
    dept: 'running',
    price: 275,
    oldPrice: 320,
    rating: 5.0,
    reviewsCount: 195,
    tag: 'ELITE RACER',
    img: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
    desc: 'Dual Zoom Air pods, full-length carbon plate and Atomknit 2.0 upper for world record speed.'
  },
  {
    id: 'p15',
    name: 'Nike Graphic Boxy Oversized Tee',
    category: 'graphic-tees',
    dept: 'graphic-tees',
    price: 48,
    oldPrice: 65,
    rating: 4.8,
    reviewsCount: 112,
    tag: 'STREETWEAR',
    img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
    desc: 'Heavyweight retro wash jersey with bold archival Nike typography graphics.'
  },
  {
    id: 'p16',
    name: 'Nike Club Fleece Cargo Joggers',
    category: 'apparel',
    dept: 'apparel',
    price: 65,
    oldPrice: 80,
    rating: 4.7,
    reviewsCount: 380,
    tag: 'ESSENTIAL',
    img: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&auto=format&fit=crop&q=80',
    desc: 'Brushed-back fleece delivering everyday comfort with athletic tapered ribbed cuffs.'
  }
];

const completeNikeScript = `
<script>
  const products = ${JSON.stringify(nikeProducts, null, 2)};

  window.currentCategory = 'all';
  window.searchQuery = '';
  window.cart = [];
  window.wishlist = [];
  window.appliedDiscount = 0;
  window.selectedSize = '9';
  window.activeQuickViewProduct = null;

  function initLucide() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try { window.lucide.createIcons(); } catch(e) {}
    }
  }

  // TOAST SYSTEM
  window.showToast = function(msg) {
    var existing = document.getElementById('globalToast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'fixed bottom-6 right-6 z-[999999] px-5 py-3.5 rounded-2xl bg-orange-500 text-black text-xs font-black shadow-2xl transition-all duration-300 flex items-center gap-2 border border-orange-300 pointer-events-auto shadow-orange-500/30';
    toast.innerHTML = '<span class="text-sm">🔥</span><span>' + msg + '</span>';
    document.body.appendChild(toast);
    initLucide();
    setTimeout(function() {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(function() { toast.remove(); }, 300);
    }, 3000);
  };

  // FILTER CATEGORY
  window.filterCategory = function(cat) {
    const rawCat = (cat || 'all').toLowerCase().trim();
    window.currentCategory = rawCat;

    // Highlight category cards
    document.querySelectorAll('[onclick*="filterCategory"]').forEach(btn => {
      const onclickAttr = (btn.getAttribute('onclick') || '').toLowerCase();
      const txt = (btn.textContent || '').toLowerCase();
      const match = (rawCat === 'all' && (onclickAttr.includes("'all'") || txt.includes('view all') || txt.includes('all'))) ||
                    (onclickAttr.includes("'" + rawCat + "'") || onclickAttr.includes('"' + rawCat + '"') || txt.includes(rawCat));
      
      if (match) {
        btn.classList.add('border-orange-500', 'bg-zinc-800', 'shadow-lg', 'shadow-orange-500/20');
        btn.classList.remove('border-white/10', 'bg-zinc-900');
      } else {
        btn.classList.remove('border-orange-500', 'bg-zinc-800', 'shadow-lg', 'shadow-orange-500/20');
        btn.classList.add('border-white/10', 'bg-zinc-900');
      }
    });

    // Update section title subtitle
    const catTitleEl = document.getElementById('catalogCategoryTitle');
    if (catTitleEl) {
      catTitleEl.textContent = rawCat === 'all' ? 'All Iconic Drops' : (rawCat.replace('-', ' ').toUpperCase() + ' COLLECTION');
    }

    window.renderProducts();

    // Scroll to products section smoothly
    const productsSection = document.getElementById('products') || document.getElementById('catalog') || document.getElementById('productGrid');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    const catName = rawCat === 'all' ? 'All Products' : (rawCat.charAt(0).toUpperCase() + rawCat.slice(1));
    window.showToast('Displaying ' + catName + ' Drops! 👟');
  };

  // RENDER PRODUCTS
  window.renderProducts = function() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    const filtered = products.filter(p => {
      let matchesCat = true;
      if (window.currentCategory !== 'all') {
        const target = window.currentCategory;
        matchesCat = p.category === target || p.dept === target || 
                     (target === 'sneakers' && (p.category === 'sneakers' || p.category === 'jordan')) ||
                     (target === 'running' && (p.category === 'running' || p.desc.toLowerCase().includes('run'))) ||
                     (target === 'graphic-tees' && (p.category === 'graphic-tees' || p.name.toLowerCase().includes('tee'))) ||
                     (target === 'apparel' && (p.category === 'apparel' || p.category === 'graphic-tees')) ||
                     (target === 'accessories' && p.category === 'accessories');
      }
      const matchesSearch = !window.searchQuery || p.name.toLowerCase().includes(window.searchQuery) || p.desc.toLowerCase().includes(window.searchQuery);
      return matchesCat && matchesSearch;
    });

    const countEl = document.getElementById('productCountBadge');
    if (countEl) countEl.textContent = filtered.length + ' Drops Available';

    if (filtered.length === 0) {
      grid.innerHTML = \`
        <div class="col-span-full py-20 text-center text-zinc-500">
          <i data-lucide="package-search" class="w-16 h-16 mx-auto mb-4 text-zinc-600"></i>
          <h3 class="text-xl font-black italic uppercase text-white mb-2">No Matching Drops Found</h3>
          <p class="text-xs text-zinc-400 max-w-sm mx-auto mb-6">We could not find any Nike items matching your selected department or search filter.</p>
          <button onclick="window.filterCategory('all')" class="px-8 py-3 rounded-full bg-orange-500 hover:bg-orange-400 text-black font-black text-xs uppercase tracking-wider transition cursor-pointer">
            Explore All 16 Drops
          </button>
        </div>
      \`;
      initLucide();
      return;
    }

    grid.innerHTML = filtered.map(p => {
      const isWish = window.wishlist.includes(p.id);
      return \`
        <div class="group relative rounded-3xl bg-zinc-900 border border-white/10 p-5 flex flex-col justify-between hover:border-orange-500/50 transition duration-300 shadow-2xl hover:shadow-orange-500/10">
          <!-- Top Media -->
          <div class="relative rounded-2xl overflow-hidden bg-black mb-4 aspect-square flex items-center justify-center cursor-pointer" onclick="window.openProductModal('\${p.id}')">
            <img src="\${p.img}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="\${p.name}">
            <span class="absolute top-3 left-3 px-3 py-1 rounded-full bg-orange-500 text-black text-[10px] font-black uppercase tracking-wider shadow-md">\${p.tag}</span>
            
            <button onclick="event.stopPropagation(); window.toggleWishlist(this, '\${p.id}')" class="absolute top-3 right-3 p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 \${isWish ? 'text-rose-500' : 'text-zinc-400 hover:text-white'} transition hover:scale-110 cursor-pointer">
              <i data-lucide="heart" class="w-4 h-4 \${isWish ? 'fill-rose-500 text-rose-500' : ''}"></i>
            </button>

            <!-- Quick View Hover Button -->
            <button onclick="event.stopPropagation(); window.openProductModal('\${p.id}')" class="absolute bottom-3 left-3 right-3 py-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 text-white font-extrabold text-[11px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-1.5 hover:bg-orange-500 hover:text-black cursor-pointer">
              <i data-lucide="eye" class="w-3.5 h-3.5"></i>
              <span>Quick View</span>
            </button>
          </div>

          <!-- Product Details -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs text-zinc-400">
              <span class="font-bold uppercase tracking-wider text-[10px] text-orange-400">\${p.category.toUpperCase()}</span>
              <div class="flex items-center gap-1 text-amber-400 font-bold">
                <i data-lucide="star" class="w-3 h-3 fill-amber-400"></i>
                <span>\${p.rating} (\${p.reviewsCount})</span>
              </div>
            </div>

            <h3 onclick="window.openProductModal('\${p.id}')" class="font-black text-base italic uppercase tracking-tight text-white group-hover:text-orange-400 transition cursor-pointer line-clamp-1">\${p.name}</h3>
            <p class="text-xs text-zinc-400 line-clamp-2 leading-relaxed">\${p.desc}</p>

            <div class="flex items-baseline gap-2 pt-1">
              <span class="text-xl font-black text-white font-mono">$\${p.price}</span>
              <span class="text-xs text-zinc-500 line-through font-mono">$\${p.oldPrice}</span>
              <span class="text-[10px] font-black text-emerald-400 uppercase tracking-wider">SAVE \${Math.round((1 - p.price/p.oldPrice)*100)}%</span>
            </div>
          </div>

          <!-- Action Button -->
          <div class="pt-4 mt-2 border-t border-white/5 flex items-center gap-2">
            <button onclick="window.addToCart('\${p.id}')" class="flex-1 py-3 rounded-2xl bg-white hover:bg-orange-500 hover:text-black text-black font-black text-xs uppercase tracking-wider transition duration-200 flex items-center justify-center gap-2 shadow-lg cursor-pointer">
              <i data-lucide="shopping-bag" class="w-4 h-4"></i>
              <span>Add to Bag</span>
            </button>
            <button onclick="window.openProductModal('\${p.id}')" title="Inspect" class="p-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition cursor-pointer border border-white/10">
              <i data-lucide="maximize-2" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      \`;
    }).join('');

    initLucide();
  };

  // ADD TO CART
  window.addToCart = function(id, name, price, img) {
    const p = (typeof products !== 'undefined' && Array.isArray(products)) ? products.find(i => i.id === id) : null;
    const itemName = name || (p ? p.name : 'Nike Item');
    const itemPrice = (price !== undefined && price !== null) ? Number(price) : (p ? Number(p.price) : 120);
    const itemImg = img || (p ? p.img : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80');

    const existing = window.cart.find(i => i.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      window.cart.push({
        id: id,
        name: itemName,
        price: itemPrice,
        img: itemImg,
        qty: 1,
        size: window.selectedSize || '9'
      });
    }

    window.updateCartUI();
    window.showToast(itemName + ' added to Bag! 🛍️');
  };

  // UPDATE CART UI & TOTALS
  window.updateCartUI = function() {
    const totalCount = window.cart.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = window.cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    const discountVal = subtotal * (window.appliedDiscount || 0);
    const grandTotal = Math.max(0, subtotal - discountVal);

    // Badges
    document.querySelectorAll('#cartCountBadge, #cartBadgeCount, .cart-count-badge, [data-cart-count]').forEach(b => {
      b.textContent = totalCount;
      b.style.display = totalCount > 0 ? 'inline-flex' : 'none';
    });

    // Subtotals & Grand Totals
    document.querySelectorAll('#cartSubtotal, #cartSubtotalText, #cartSubtotalVal, #subtotalText, .cart-subtotal').forEach(el => {
      el.textContent = '$' + subtotal.toFixed(2);
    });

    document.querySelectorAll('#cartTotal, #cartGrandTotal, #cartGrandTotalText, #cartTotalText, #grandTotalText, #floatingCartTotal, .cart-total').forEach(el => {
      el.textContent = '$' + grandTotal.toFixed(2);
    });

    // Render Drawer items
    const drawerList = document.getElementById('cartItemList') || document.getElementById('cartDrawerItems');
    if (drawerList) {
      if (window.cart.length === 0) {
        drawerList.innerHTML = \`
          <div class="py-16 text-center text-zinc-500">
            <i data-lucide="shopping-bag" class="w-12 h-12 mx-auto mb-3 text-zinc-600"></i>
            <p class="text-xs uppercase font-bold tracking-wider">Your Nike Bag is Empty</p>
            <p class="text-[11px] text-zinc-400 mt-1">Add iconic sneakers and apparel to get started.</p>
          </div>
        \`;
      } else {
        drawerList.innerHTML = window.cart.map(item => \`
          <div class="p-3.5 rounded-2xl bg-zinc-900 border border-white/10 flex items-center gap-3.5">
            <img src="\${item.img}" class="w-16 h-16 rounded-xl object-cover bg-black" alt="\${item.name}">
            <div class="flex-1 min-w-0">
              <h4 class="text-xs font-black uppercase text-white truncate">\${item.name}</h4>
              <p class="text-[10px] text-zinc-400 font-medium mt-0.5">Size: US \${item.size || '9'}</p>
              <div class="flex items-center justify-between mt-2">
                <span class="text-xs font-mono font-bold text-orange-400">$\${(item.price * item.qty).toFixed(2)}</span>
                <div class="flex items-center gap-2 bg-black border border-white/10 rounded-lg px-2 py-0.5">
                  <button onclick="window.updateCartQty('\${item.id}', -1)" class="text-xs text-zinc-400 hover:text-white font-bold cursor-pointer">-</button>
                  <span class="text-xs font-bold text-white px-1">\${item.qty}</span>
                  <button onclick="window.updateCartQty('\${item.id}', 1)" class="text-xs text-zinc-400 hover:text-white font-bold cursor-pointer">+</button>
                </div>
              </div>
            </div>
            <button onclick="window.removeCartItem('\${item.id}')" class="p-2 text-zinc-500 hover:text-rose-400 transition cursor-pointer">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        \`).join('');
      }
    }

    initLucide();
  };

  window.updateCartQty = function(id, delta) {
    const item = window.cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      window.cart = window.cart.filter(i => i.id !== id);
      window.showToast('Item removed from Bag');
    }
    window.updateCartUI();
  };

  window.removeCartItem = function(id) {
    window.cart = window.cart.filter(i => i.id !== id);
    window.updateCartUI();
    window.showToast('Item removed from Bag');
  };

  // WISHLIST TOGGLE
  window.toggleWishlist = function(btn, id) {
    const idx = window.wishlist.indexOf(id);
    if (idx === -1) {
      window.wishlist.push(id);
      window.showToast('Saved to Favorites! ❤️');
    } else {
      window.wishlist.splice(idx, 1);
      window.showToast('Removed from Favorites');
    }
    window.renderProducts();
  };

  // QUICK VIEW PRODUCT MODAL
  window.openProductModal = function(id) {
    const p = products.find(i => i.id === id);
    if (!p) return;
    window.activeQuickViewProduct = p;

    let modal = document.getElementById('productQuickModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'productQuickModal';
      modal.className = 'fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4';
      document.body.appendChild(modal);
    }

    modal.innerHTML = \`
      <div class="relative w-full max-w-2xl rounded-3xl bg-zinc-950 border border-white/10 p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button onclick="window.closeProductModal()" class="absolute top-5 right-5 p-2 rounded-full bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition cursor-pointer">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div class="rounded-2xl overflow-hidden bg-black aspect-square">
            <img src="\${p.img}" class="w-full h-full object-cover" alt="\${p.name}">
          </div>

          <div class="space-y-4">
            <span class="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-black uppercase tracking-wider">\${p.tag}</span>
            <h3 class="text-2xl font-black italic uppercase text-white">\${p.name}</h3>
            
            <div class="flex items-center gap-2">
              <span class="text-2xl font-black text-white font-mono">$\${p.price}</span>
              <span class="text-sm text-zinc-500 line-through font-mono">$\${p.oldPrice}</span>
              <span class="text-xs font-black text-emerald-400">Save $\${p.oldPrice - p.price}</span>
            </div>

            <p class="text-xs text-zinc-400 leading-relaxed">\${p.desc}</p>

            <!-- Size Selector -->
            <div class="space-y-2">
              <span class="text-xs font-bold uppercase tracking-wider text-zinc-300">Select US Size:</span>
              <div class="flex items-center gap-2 flex-wrap">
                \${['7', '8', '9', '10', '11', '12'].map(s => \`
                  <button onclick="window.selectSize('\${s}', this)" class="size-btn px-3 py-2 rounded-xl text-xs font-bold \${s === window.selectedSize ? 'bg-orange-500 text-black' : 'bg-zinc-900 border border-white/10 text-white hover:border-orange-500'} transition cursor-pointer">
                    US \${s}
                  </button>
                \`).join('')}
              </div>
            </div>

            <button onclick="window.addToCart('\${p.id}'); window.closeProductModal();" class="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-400 text-black font-black text-xs uppercase tracking-wider transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 cursor-pointer">
              <i data-lucide="shopping-bag" class="w-4 h-4"></i>
              <span>Add to Bag - $\${p.price}</span>
            </button>
          </div>
        </div>
      </div>
    \`;

    modal.style.display = 'flex';
    initLucide();
  };

  window.closeProductModal = function() {
    const modal = document.getElementById('productQuickModal');
    if (modal) modal.style.display = 'none';
  };

  window.selectSize = function(size, btn) {
    window.selectedSize = size;
    document.querySelectorAll('.size-btn').forEach(b => {
      b.classList.remove('bg-orange-500', 'text-black');
      b.classList.add('bg-zinc-900', 'text-white');
    });
    if (btn) {
      btn.classList.add('bg-orange-500', 'text-black');
      btn.classList.remove('bg-zinc-900', 'text-white');
    }
  };

  // CART DRAWER TOGGLE
  window.toggleDrawer = function(id) {
    const drawer = document.getElementById(id) || document.getElementById('cartDrawer');
    if (!drawer) return;
    const isClosed = drawer.classList.contains('translate-x-full');
    if (isClosed) {
      drawer.classList.remove('translate-x-full');
      window.updateCartUI();
    } else {
      drawer.classList.add('translate-x-full');
    }
    initLucide();
  };

  // COUPON SYSTEM
  window.applyCoupon = function() {
    const input = document.getElementById('couponInput');
    const code = (input?.value || '').trim().toUpperCase();
    if (code === 'NIKE20' || code === 'JUSTDOIT') {
      window.appliedDiscount = 0.20;
      window.updateCartUI();
      window.showToast('20% NIKE VIP Discount Applied! ⚡');
    } else {
      window.showToast('Invalid promo code. Try: NIKE20');
    }
  };

  // SEARCH INPUT LISTENER
  window.handleSearch = function(query) {
    window.searchQuery = (query || '').toLowerCase().trim();
    window.renderProducts();
  };

  // INITIALIZATION
  function initAll() {
    window.renderProducts();
    window.updateCartUI();
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
  const site = await Website.findById('6a953d7ed4298bf3113bf5d9');
  if (!site) {
    console.log('Site 6a953d7ed4298bf3113bf5d9 not found');
    process.exit(1);
  }

  let code = site.latestCode;

  // 1. Wire category buttons with exact filterCategory calls
  code = code.replace(/<button[^>]*onclick="[^"]*filterCategory\('sneakers'\)"[^>]*>/gi,
    '<button onclick="window.filterCategory(\'sneakers\')" class="group relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 p-4 text-center hover:border-orange-500 transition duration-300 flex flex-col items-center cursor-pointer">');

  code = code.replace(/<button[^>]*onclick="[^"]*filterCategory\('jordan'\)"[^>]*>/gi,
    '<button onclick="window.filterCategory(\'jordan\')" class="group relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 p-4 text-center hover:border-orange-500 transition duration-300 flex flex-col items-center cursor-pointer">');

  code = code.replace(/<button[^>]*onclick="[^"]*filterCategory\('apparel'\)"[^>]*>/gi,
    '<button onclick="window.filterCategory(\'apparel\')" class="group relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 p-4 text-center hover:border-orange-500 transition duration-300 flex flex-col items-center cursor-pointer">');

  code = code.replace(/<button[^>]*onclick="[^"]*filterCategory\('running'\)"[^>]*>/gi,
    '<button onclick="window.filterCategory(\'running\')" class="group relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 p-4 text-center hover:border-orange-500 transition duration-300 flex flex-col items-center cursor-pointer">');

  code = code.replace(/<button[^>]*onclick="[^"]*filterCategory\('graphic-tees'\)"[^>]*>/gi,
    '<button onclick="window.filterCategory(\'graphic-tees\')" class="group relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 p-4 text-center hover:border-orange-500 transition duration-300 flex flex-col items-center cursor-pointer">');

  code = code.replace(/<button[^>]*onclick="[^"]*filterCategory\('accessories'\)"[^>]*>/gi,
    '<button onclick="window.filterCategory(\'accessories\')" class="group relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 p-4 text-center hover:border-orange-500 transition duration-300 flex flex-col items-center cursor-pointer">');

  // Search input
  code = code.replace(/<input[^>]*placeholder="Search Air Jordan[^"]*"[^>]*>/gi,
    '<input type="text" oninput="window.handleSearch(this.value)" placeholder="Search Air Jordan, Tech Fleece, Sneakers..." class="bg-transparent text-xs text-white outline-none placeholder-zinc-500 w-48 sm:w-72">');

  // Bag / Cart header button
  code = code.replace(/<button[^>]*class="[^"]*relative p-2.5 rounded-full bg-orange-500[^"]*"[^>]*>/gi,
    '<button onclick="window.toggleDrawer(\'cartDrawer\')" class="relative p-2.5 rounded-full bg-orange-500 text-black hover:bg-orange-400 transition cursor-pointer shadow-lg shadow-orange-500/20">');

  // Replace script tag with complete non-truncated interactive script
  const scriptStart = code.lastIndexOf('<script>');
  code = code.slice(0, scriptStart) + completeNikeScript + '\n</body>\n</html>';

  site.latestCode = code;
  await site.save();
  console.log('Site 6a953d7ed4298bf3113bf5d9 successfully updated with 16 drops, working categories, and complete state engine! 🚀');

  await mongoose.disconnect();
}

run().catch(console.error);
