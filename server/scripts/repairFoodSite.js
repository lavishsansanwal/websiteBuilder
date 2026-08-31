import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Website from '../models/website.model.js';

dotenv.config();

const fullDishesData = [
  // Biryani
  {
    id: 'd1',
    name: 'Royal Saffron Dum Biryani',
    category: 'biryani',
    veg: false,
    price: 18.99,
    rating: 4.9,
    prepTime: '25 mins',
    img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    desc: 'Aged basmati rice infused with Kashmiri saffron, tender marinated chicken, slow cooked in earthen pots.'
  },
  {
    id: 'd2',
    name: 'Hyderabadi Lamb Shank Biryani',
    category: 'biryani',
    veg: false,
    price: 22.50,
    rating: 4.9,
    prepTime: '28 mins',
    img: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80',
    desc: 'Fall-off-the-bone lamb shanks layered with caramelized onions, fresh mint, and spiced aromatic rice.'
  },
  {
    id: 'd3',
    name: 'Awadhi Paneer Tikka Biryani',
    category: 'biryani',
    veg: true,
    price: 16.50,
    rating: 4.8,
    prepTime: '20 mins',
    img: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80',
    desc: 'Smoked cottage cheese cubes, saffron basmati, caramelized nuts, and cooling mint raita.'
  },

  // Pizza
  {
    id: 'd4',
    name: 'Neapolitan Margherita D.O.P.',
    category: 'pizza',
    veg: true,
    price: 16.99,
    rating: 4.8,
    prepTime: '18 mins',
    img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=80',
    desc: 'Wood-fired sourdough base with San Marzano tomatoes, fresh Buffalo Mozzarella, and organic basil leaves.'
  },
  {
    id: 'd5',
    name: 'Truffle Wild Mushroom Pizza',
    category: 'pizza',
    veg: true,
    price: 19.50,
    rating: 4.9,
    prepTime: '20 mins',
    img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
    desc: 'Black truffle crema, sautéed porcini and shiitake mushrooms, fontina cheese, and fresh thyme.'
  },
  {
    id: 'd6',
    name: 'Spicy Smoked Pepperoni Rustica',
    category: 'pizza',
    veg: false,
    price: 18.50,
    rating: 4.9,
    prepTime: '18 mins',
    img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&auto=format&fit=crop&q=80',
    desc: 'Artisanal cured pepperoni, hot honey drizzle, chili oil, smoked provolone on crispy sourdough crust.'
  },

  // Burgers
  {
    id: 'd7',
    name: 'Double Smash A5 Wagyu Burger',
    category: 'burgers',
    veg: false,
    price: 17.99,
    rating: 4.9,
    prepTime: '15 mins',
    img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    desc: 'Seared double Wagyu patties, aged Vermont cheddar, caramelized shallots, house truffle aioli on toasted brioche.'
  },
  {
    id: 'd8',
    name: 'Crispy Fiery Chicken Stack',
    category: 'burgers',
    veg: false,
    price: 14.50,
    rating: 4.7,
    prepTime: '15 mins',
    img: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80',
    desc: 'Buttermilk fried chicken breast drenched in Nashville hot glaze, dill pickles, and crunchy slaw.'
  },
  {
    id: 'd9',
    name: 'Portobello & Truffle Gouda Burger',
    category: 'burgers',
    veg: true,
    price: 15.00,
    rating: 4.8,
    prepTime: '14 mins',
    img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
    desc: 'Panko crusted grilled portobello mushroom stuffed with smoked gouda, garlic aioli, and baby arugula.'
  },

  // North Indian
  {
    id: 'd10',
    name: 'Velvet Butter Chicken (Murgh Makhani)',
    category: 'indian',
    veg: false,
    price: 17.50,
    rating: 4.9,
    prepTime: '22 mins',
    img: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80',
    desc: 'Charcoal-grilled chicken tikka simmered in rich creamy tomato, cashew nut sauce & fenugreek butter.'
  },
  {
    id: 'd11',
    name: '24-Hour Charcoal Dal Makhani',
    category: 'indian',
    veg: true,
    price: 13.99,
    rating: 4.9,
    prepTime: '20 mins',
    img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
    desc: 'Black lentils slow-cooked overnight with white butter, fresh cream, and smoky charcoal aroma.'
  },
  {
    id: 'd12',
    name: 'Paneer Tikka Lababdar',
    category: 'indian',
    veg: true,
    price: 15.50,
    rating: 4.8,
    prepTime: '20 mins',
    img: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&auto=format&fit=crop&q=80',
    desc: 'Tandoori spiced paneer cubes simmered in spiced onion-tomato gravy with toasted butter naan.'
  },

  // Chinese
  {
    id: 'd13',
    name: 'Steamed Crystal Dim Sum Basket',
    category: 'chinese',
    veg: true,
    price: 15.00,
    rating: 4.8,
    prepTime: '16 mins',
    img: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop&q=80',
    desc: 'Translucent steamed dumplings stuffed with water chestnuts, edamame, shiitake, and chili oil dip.'
  },
  {
    id: 'd14',
    name: 'Fiery Szechuan Chili Noodles',
    category: 'chinese',
    veg: false,
    price: 14.50,
    rating: 4.8,
    prepTime: '14 mins',
    img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80',
    desc: 'Hand-pulled noodles tossed in fiery Szechuan peppercorn oil, minced tender chicken, and crushed peanuts.'
  },

  // South Indian
  {
    id: 'd15',
    name: 'Ghee Roast Mysore Masala Dosa',
    category: 'south indian',
    veg: true,
    price: 12.99,
    rating: 4.9,
    prepTime: '15 mins',
    img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
    desc: 'Crispy golden crepe smeared with red chili garlic chutney, spiced potato mash, served with trio chutneys and sambar.'
  },
  {
    id: 'd16',
    name: 'Chettinad Pepper Chicken Fry',
    category: 'south indian',
    veg: false,
    price: 16.50,
    rating: 4.9,
    prepTime: '20 mins',
    img: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=80',
    desc: 'Tender chicken morsels tossed in stone-ground black pepper, curry leaves, and toasted coconut masala.'
  },

  // Desserts
  {
    id: 'd17',
    name: 'Warm Belgian Molten Chocolate Lava',
    category: 'desserts',
    veg: true,
    price: 9.99,
    rating: 4.9,
    prepTime: '12 mins',
    img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80',
    desc: 'Decadent dark chocolate cake with warm flowing molten center, served with Madagascar vanilla bean gelato.'
  },
  {
    id: 'd18',
    name: 'Kesar Pista Saffron Matka Kulfi',
    category: 'desserts',
    veg: true,
    price: 7.50,
    rating: 4.9,
    prepTime: '5 mins',
    img: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&auto=format&fit=crop&q=80',
    desc: 'Traditional slow-reduced milk ice cream flavored with saffron, green cardamom, and roasted pistachios.'
  },

  // Healthy
  {
    id: 'd19',
    name: 'Avocado, Quinoa & Edamame Power Bowl',
    category: 'healthy',
    veg: true,
    price: 14.99,
    rating: 4.8,
    prepTime: '12 mins',
    img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    desc: 'Organic tricolor quinoa, Hass avocado, crisp cucumbers, edamame, pomegranate, and tahini-lemon dressing.'
  },
  {
    id: 'd20',
    name: 'Grilled Lemon Herb Salmon & Greens',
    category: 'healthy',
    veg: false,
    price: 19.99,
    rating: 4.9,
    prepTime: '18 mins',
    img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80',
    desc: 'Pan-seared Atlantic salmon fillet with grilled asparagus, heirloom tomatoes, and wild citrus vinaigrette.'
  }
];

const newScript = `
<script>
  window.dishes = ${JSON.stringify(fullDishesData, null, 2)};
  window.cart = window.cart || [];
  window.currentCategory = 'all';
  window.vegFilter = 'all';
  window.searchQuery = '';
  window.appliedDiscount = 0;

  // Auto-init Lucide
  function initLucide() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  // TOAST
  window.showToast = function(msg) {
    var existing = document.getElementById('globalToast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'fixed bottom-6 right-6 z-[999999] px-5 py-3.5 rounded-2xl bg-orange-500 text-black text-xs font-black shadow-2xl transition-all duration-300 flex items-center gap-2 border border-orange-300';
    toast.innerHTML = '<i data-lucide="sparkles" class="w-4 h-4 text-black"></i><span>' + (msg || 'Action completed!') + '</span>';
    document.body.appendChild(toast);
    initLucide();
    setTimeout(function() {
      toast.style.opacity = '0';
      setTimeout(function() { toast.remove(); }, 300);
    }, 3000);
  };

  // RENDER MENU DISHES
  window.renderMenu = function() {
    var grid = document.getElementById('dishesGrid');
    if (!grid) return;

    var filtered = window.dishes.filter(function(d) {
      var cat = (d.category || '').toLowerCase();
      var curCat = (window.currentCategory || 'all').toLowerCase();
      
      var matchCat = (curCat === 'all');
      if (!matchCat) {
        if (curCat === 'indian' || curCat === 'north indian') {
          matchCat = (cat === 'indian' || cat === 'north indian');
        } else {
          matchCat = cat.includes(curCat) || curCat.includes(cat);
        }
      }

      var matchVeg = true;
      if (window.vegFilter === 'veg') matchVeg = d.veg === true;
      if (window.vegFilter === 'nonveg') matchVeg = d.veg === false;

      var matchSearch = true;
      if (window.searchQuery) {
        var text = (d.name + ' ' + d.desc + ' ' + d.category).toLowerCase();
        matchSearch = text.includes(window.searchQuery);
      }

      return matchCat && matchVeg && matchSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = '<div class="col-span-full py-16 text-center text-stone-500 font-bold">' +
        '<i data-lucide="search-x" class="w-12 h-12 mx-auto mb-3 opacity-40"></i>' +
        '<p class="text-base font-extrabold text-stone-300">No dishes match your selected filter.</p>' +
        '<button onclick="window.filterCategory(\\'all\\')" class="mt-4 px-4 py-2 rounded-xl bg-orange-500 text-black font-extrabold text-xs">View All Dishes</button>' +
      '</div>';
      initLucide();
      return;
    }

    grid.innerHTML = filtered.map(function(d) {
      var cartItem = window.cart.find(function(item) { return item.id === d.id; });
      var qty = cartItem ? cartItem.qty : 0;

      var vegBadge = d.veg 
        ? '<span class="w-4 h-4 rounded-sm border border-emerald-500 flex items-center justify-center p-0.5" title="Pure Veg"><span class="w-2 h-2 rounded-full bg-emerald-500"></span></span>'
        : '<span class="w-4 h-4 rounded-sm border border-rose-500 flex items-center justify-center p-0.5" title="Non-Veg"><span class="w-2 h-2 rounded-full bg-rose-500"></span></span>';

      var actionButtonHTML = qty > 0
        ? '<div class="flex items-center gap-2 bg-orange-500 text-black px-3 py-1.5 rounded-xl font-black text-xs shadow-md">' +
            '<button onclick="window.updateCartQty(\\'' + d.id + '\\', -1)" class="w-5 h-5 flex items-center justify-center text-black hover:bg-black/10 rounded cursor-pointer">-</button>' +
            '<span>' + qty + '</span>' +
            '<button onclick="window.updateCartQty(\\'' + d.id + '\\', 1)" class="w-5 h-5 flex items-center justify-center text-black hover:bg-black/10 rounded cursor-pointer">+</button>' +
          '</div>'
        : '<button onclick="window.addToCart(\\'' + d.id + '\\', \\'' + d.name.replace(/'/g, "\\\\'") + '\\', ' + d.price + ', \\'' + d.img + '\\')" class="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-extrabold text-xs uppercase tracking-wider transition shadow-md flex items-center gap-1.5 cursor-pointer">' +
            '<span>ADD</span> <i data-lucide="plus" class="w-3.5 h-3.5 stroke-[3]"></i>' +
          '</button>';

      return '<div class="rounded-3xl border border-stone-800 bg-stone-900/70 p-5 flex flex-col justify-between hover:border-orange-500/40 transition duration-300 shadow-xl group">' +
        '<div class="space-y-3">' +
          '<div class="relative h-44 rounded-2xl overflow-hidden cursor-pointer" onclick="window.openDishModal(\\'' + d.id + '\\')">' +
            '<img src="' + d.img + '" onerror="this.onerror=null;this.src=\\'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80\\'" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">' +
            '<div class="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-white font-extrabold text-[10px] flex items-center gap-1.5">' + vegBadge + '<span>' + d.prepTime + '</span></div>' +
            '<div class="absolute top-3 right-3 bg-emerald-500 text-black px-2 py-0.5 rounded-md font-black text-[10px]">★ ' + d.rating + '</div>' +
          '</div>' +
          '<div class="flex items-start justify-between gap-2">' +
            '<div>' +
              '<h3 class="text-base font-black text-white group-hover:text-orange-400 transition cursor-pointer" onclick="window.openDishModal(\\'' + d.id + '\\')">' + d.name + '</h3>' +
              '<p class="text-xs text-stone-400 line-clamp-2 mt-1 leading-relaxed">' + d.desc + '</p>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="flex items-center justify-between pt-4 mt-4 border-t border-stone-800/80">' +
          '<div class="text-lg font-black text-white">$' + d.price.toFixed(2) + '</div>' +
          actionButtonHTML +
        '</div>' +
      '</div>';
    }).join('');

    initLucide();
  };

  // FILTER CATEGORY
  window.filterCategory = function(cat) {
    window.currentCategory = (cat || 'all').toLowerCase().trim();
    
    // Update active state on circular shortcut buttons & pills
    document.querySelectorAll('.cat-pill, [data-cat-btn]').forEach(function(btn) {
      var bCat = (btn.getAttribute('data-cat-btn') || btn.getAttribute('data-category') || '').toLowerCase().trim();
      var match = (window.currentCategory === 'all' && (bCat === 'all' || !bCat)) || (bCat === window.currentCategory);
      if (match) {
        btn.classList.add('bg-orange-500', 'text-black', 'shadow-lg', 'font-black');
        btn.classList.remove('bg-stone-900', 'text-stone-400');
      } else {
        btn.classList.remove('bg-orange-500', 'text-black', 'shadow-lg', 'font-black');
        btn.classList.add('bg-stone-900', 'text-stone-400');
      }
    });

    window.renderMenu();

    // Scroll to menu section
    var menuSec = document.getElementById('menu') || document.getElementById('dishesGrid');
    if (menuSec) {
      menuSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    window.showToast('Showing ' + (cat === 'all' ? 'All Gourmet Dishes' : cat.toUpperCase()));
  };

  window.filterMenu = window.filterCategory;
  window.filterCuisine = window.filterCategory;

  // VEG / NON-VEG FILTER
  window.setVegFilter = function(type) {
    window.vegFilter = type;
    ['all', 'veg', 'nonveg'].forEach(function(t) {
      var btn = document.getElementById('vegFilter' + t.charAt(0).toUpperCase() + t.slice(1));
      if (!btn) return;
      if (t === type) {
        btn.className = 'px-3.5 py-2 rounded-xl bg-orange-500 text-black font-extrabold shadow-md transition cursor-pointer';
      } else {
        btn.className = 'px-3.5 py-2 rounded-xl text-stone-400 hover:text-white font-bold transition flex items-center gap-1.5 cursor-pointer';
      }
    });
    window.renderMenu();
  };

  // SEARCH HANDLER
  window.handleSearch = function(query) {
    window.searchQuery = (query || '').toLowerCase().trim();
    window.renderMenu();
  };

  // ADD TO CART
  window.addToCart = function(id, name, price, img) {
    var existing = window.cart.find(function(item) { return item.id === id; });
    if (existing) {
      existing.qty += 1;
    } else {
      window.cart.push({ id: id, name: name, price: parseFloat(price) || 15.00, img: img, qty: 1 });
    }
    window.updateCartUI();
    window.renderMenu();
    window.showToast(name + ' added to Bag! 🛒');
  };

  // UPDATE CART QTY
  window.updateCartQty = function(id, delta) {
    var item = window.cart.find(function(i) { return i.id === id; });
    if (item) {
      item.qty += delta;
      if (item.qty <= 0) {
        window.cart = window.cart.filter(function(i) { return i.id !== id; });
      }
    }
    window.updateCartUI();
    window.renderMenu();
  };

  // APPLY COUPON
  window.applyCoupon = function() {
    var inp = document.getElementById('couponInput');
    var val = (inp ? inp.value : '').trim().toUpperCase();
    if (val === 'SWIGGY50' || val === 'FEAST50') {
      window.appliedDiscount = 0.50;
      var discRow = document.getElementById('discountRow');
      if (discRow) discRow.classList.remove('hidden');
      window.showToast('50% OFF Promo Applied! 🎉');
    } else if (val === 'FREEDEL') {
      window.showToast('FREEDEL Applied! Free Express Shipping 🎉');
    } else {
      window.showToast('Invalid Coupon Code. Try SWIGGY50');
    }
    window.updateCartUI();
  };

  // UPDATE CART UI
  window.updateCartUI = function() {
    var totalCount = window.cart.reduce(function(sum, i) { return sum + i.qty; }, 0);
    var subtotal = window.cart.reduce(function(sum, i) { return sum + (i.price * i.qty); }, 0);
    var discountVal = subtotal * window.appliedDiscount;
    var grandTotal = Math.max(0, subtotal - discountVal);

    var badge = document.getElementById('cartCountBadge') || document.getElementById('cartBadgeCount');
    if (badge) {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'inline-flex' : 'none';
    }

    var floatCart = document.getElementById('floatingCart') || document.getElementById('floatingBottomCart');
    if (floatCart) {
      if (totalCount > 0) {
        floatCart.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
        var cntEl = document.getElementById('floatingCartCount');
        if (cntEl) cntEl.textContent = totalCount + (totalCount === 1 ? ' ITEM' : ' ITEMS');
        var totEl = document.getElementById('floatingCartTotal');
        if (totEl) totEl.textContent = '$' + grandTotal.toFixed(2);
      } else {
        floatCart.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
      }
    }

    var drawerContainer = document.getElementById('cartDrawerItems');
    if (drawerContainer) {
      if (window.cart.length === 0) {
        drawerContainer.innerHTML = '<div class="py-16 text-center space-y-3"><i data-lucide="shopping-bag" class="w-12 h-12 mx-auto text-stone-700"></i><p class="text-stone-400 font-bold text-xs">Your bag is empty.<br>Add some delicious dishes!</p></div>';
      } else {
        drawerContainer.innerHTML = window.cart.map(function(item) {
          return '<div class="flex items-center justify-between p-3 rounded-2xl bg-stone-900 border border-stone-800">' +
            '<div class="flex items-center gap-3">' +
              '<img src="' + item.img + '" class="w-12 h-12 rounded-xl object-cover">' +
              '<div>' +
                '<div class="text-xs font-black text-white">' + item.name + '</div>' +
                '<div class="text-[11px] font-bold text-orange-400">$' + (item.price * item.qty).toFixed(2) + '</div>' +
              '</div>' +
            '</div>' +
            '<div class="flex items-center gap-2 bg-stone-800 px-2 py-1 rounded-xl text-xs font-black text-white">' +
              '<button onclick="window.updateCartQty(\\'' + item.id + '\\', -1)" class="w-5 h-5 flex items-center justify-center hover:text-orange-400 cursor-pointer">-</button>' +
              '<span>' + item.qty + '</span>' +
              '<button onclick="window.updateCartQty(\\'' + item.id + '\\', 1)" class="w-5 h-5 flex items-center justify-center hover:text-orange-400 cursor-pointer">+</button>' +
            '</div>' +
          '</div>';
        }).join('');
      }
    }

    var subtotalEls = document.querySelectorAll('#cartSubtotal, #cartSubtotalText, #cartSubtotalVal, #subtotalText, .cart-subtotal');
    subtotalEls.forEach(function(el) { el.textContent = '$' + subtotal.toFixed(2); });

    var discountEls = document.querySelectorAll('#cartDiscount, #cartDiscountText, .cart-discount');
    discountEls.forEach(function(el) { el.textContent = '-$' + discountVal.toFixed(2); });

    var totalEls = document.querySelectorAll('#cartTotal, #cartGrandTotal, #cartGrandTotalText, #cartTotalText, #grandTotalText, .cart-total');
    totalEls.forEach(function(el) { el.textContent = '$' + grandTotal.toFixed(2); });

    initLucide();
  };

  // MODALS
  window.openModal = function(id) {
    var el = document.getElementById(id);
    if (el) { el.style.display = 'flex'; el.classList.remove('hidden'); }
    initLucide();
  };
  window.closeModal = function(id) {
    var el = document.getElementById(id);
    if (el) { el.style.display = 'none'; el.classList.add('hidden'); }
  };
  window.toggleDrawer = function(id) {
    var el = document.getElementById(id);
    if (el) { el.classList.toggle('translate-x-full'); }
    initLucide();
  };

  window.openDishModal = function(id) {
    var dish = window.dishes.find(function(d) { return d.id === id; });
    if (!dish) return;
    var content = document.getElementById('dishModalContent');
    if (content) {
      content.innerHTML = '<div class="space-y-4">' +
        '<div class="relative h-64 rounded-2xl overflow-hidden">' +
          '<img src="' + dish.img + '" class="w-full h-full object-cover">' +
          '<div class="absolute top-3 right-3 bg-emerald-500 text-black px-2.5 py-1 rounded-md font-black text-xs">★ ' + dish.rating + '</div>' +
        '</div>' +
        '<div class="flex items-center justify-between">' +
          '<h3 class="text-2xl font-black text-white">' + dish.name + '</h3>' +
          '<span class="text-xl font-black text-orange-400">$' + dish.price.toFixed(2) + '</span>' +
        '</div>' +
        '<p class="text-stone-300 text-xs leading-relaxed">' + dish.desc + '</p>' +
        '<div class="pt-3">' +
          '<button onclick="window.addToCart(\\'' + dish.id + '\\', \\'' + dish.name.replace(/'/g, "\\\\'") + '\\', ' + dish.price + ', \\'' + dish.img + '\\'); window.closeModal(\\'dishModal\\')" class="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-black text-xs uppercase tracking-wider transition shadow-xl cursor-pointer">' +
            'Add to Bag • $' + dish.price.toFixed(2) + ' ➔' +
          '</button>' +
        '</div>' +
      '</div>';
    }
    window.openModal('dishModal');
  };

  // DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function() {
    initLucide();
    window.renderMenu();
    window.updateCartUI();
  });
  window.addEventListener('load', function() {
    initLucide();
    window.renderMenu();
  });
  setTimeout(function() {
    initLucide();
    window.renderMenu();
  }, 100);
</script>
`;

async function run() {
  await mongoose.connect(process.env.MONGODB_URL || process.env.MONGODB_URI);
  const site = await Website.findById('6a95234ddf675d856a84cfba');
  if (!site) {
    console.log('Site not found');
    process.exit(1);
  }

  console.log('Site found. Current length:', site.latestCode.length);

  // Replace script in latestCode
  const scriptStartIdx = site.latestCode.lastIndexOf('<script>');
  if (scriptStartIdx === -1) {
    console.log('No script tag found');
    process.exit(1);
  }

  const updatedCode = site.latestCode.slice(0, scriptStartIdx) + newScript + '\n</body>\n</html>';

  site.latestCode = updatedCode;
  await site.save();
  console.log('Website 6a95234ddf675d856a84cfba successfully updated and saved in MongoDB! 🚀');
  console.log('New code length:', site.latestCode.length);

  await mongoose.disconnect();
}

run().catch(console.error);
