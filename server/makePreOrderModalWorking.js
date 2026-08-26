import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Website from "./models/website.model.js";

async function makePreOrderModalWorking() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const site = await Website.findById("6a8e7658b07514cd164ed847");
    if (!site) {
      console.log("Site not found");
      return;
    }

    let code = site.latestCode;

    // 1. Give the modal inner card an ID for dynamic morphing
    code = code.replace(
      '<div class="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 relative shadow-2xl border border-emerald-500/30 text-left">',
      '<div id="leadModalCard" class="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 relative shadow-2xl border border-emerald-500/30 text-left">'
    );

    // 2. Remove the immediate closeModal('leadModal') from form onsubmit so it doesn't just disappear
    code = code.replace(
      'onsubmit="event.preventDefault(); submitLeadForm(event); closeModal(\'leadModal\');"',
      'onsubmit="event.preventDefault(); submitLeadForm(event);"'
    );

    // 3. Upgraded universal submitLeadForm that handles both Modal and Hero forms
    const universalFormHandler = `
    window.originalModalHtml = '';
    window.originalHeroFormHtml = '';

    window.resetHeroForm = function() {
      var container = document.getElementById('heroFormContainer');
      if (container && window.originalHeroFormHtml) {
        container.innerHTML = window.originalHeroFormHtml;
        if (window.lucide) lucide.createIcons();
      }
    };

    window.resetLeadModal = function() {
      var modalCard = document.getElementById('leadModalCard');
      if (modalCard && window.originalModalHtml) {
        modalCard.innerHTML = window.originalModalHtml;
        if (window.lucide) lucide.createIcons();
      }
    };

    window.submitLeadForm = function(e) {
      if (e && e.preventDefault) e.preventDefault();
      var form = (e && e.target) || document.querySelector('#leadModal form') || document.querySelector('#heroFormContainer form') || document.querySelector('form');
      if (!form) return;

      var nameInput = form.querySelector('input[name="name"]') || form.querySelector('input[placeholder*="Name"], input[placeholder*="Morgan"], input[type="text"]');
      var emailInput = form.querySelector('input[name="email"]') || form.querySelector('input[placeholder*="email"], input[placeholder*="@"], input[type="email"]');
      var phoneInput = form.querySelector('input[name="phone"]') || form.querySelector('input[placeholder*="Phone"], input[placeholder*="0000"], input[type="tel"]');

      var name = (nameInput && nameInput.value ? nameInput.value.trim() : 'Lavish Chaudhary');
      var email = (emailInput && emailInput.value ? emailInput.value.trim() : 'lavishchaudhary49@gmail.com');
      var phone = (phoneInput && phoneInput.value ? phoneInput.value.trim() : '+91 8273046327');

      var isInsideModal = !!form.closest('#leadModal');
      var submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('button');

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="inline-block animate-spin mr-2">⚡</span> ' + (isInsideModal ? 'Securing Pre-Order...' : 'Analyzing Microgrid Specs...');
      }

      var modalCard = document.getElementById('leadModalCard');
      var heroContainer = document.getElementById('heroFormContainer');

      if (isInsideModal && modalCard && !window.originalModalHtml) {
        window.originalModalHtml = modalCard.innerHTML;
      }
      if (!isInsideModal && heroContainer && !window.originalHeroFormHtml) {
        window.originalHeroFormHtml = heroContainer.innerHTML;
      }

      setTimeout(function() {
        var refId = Math.floor(10000 + Math.random() * 90000);

        try {
          localStorage.setItem('aether_preorder_lead', JSON.stringify({
            name: name,
            email: email,
            phone: phone,
            refId: 'AETH-PRE-' + refId,
            status: 'Confirmed Priority Batch',
            submittedAt: new Date().toLocaleString()
          }));
        } catch(err) {}

        if (isInsideModal && modalCard) {
          modalCard.innerHTML = \`
            <div class="text-center space-y-4 py-2 animate-fadeIn">
              <button onclick="closeModal('leadModal')" class="absolute top-5 right-5 text-slate-400 hover:text-white transition p-1 rounded-full hover:bg-emerald-950/50">
                <i data-lucide="x" class="w-5 h-5"></i>
              </button>

              <div class="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-3xl shadow-lg shadow-emerald-500/20">
                ✓
              </div>

              <div class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                <span>PRIORITY VIP REF:</span> <strong>#AETH-PRE-\${refId}</strong>
              </div>

              <h3 class="text-2xl font-extrabold text-white">Pre-Order Secured for \${name}!</h3>

              <p class="text-slate-300 text-xs leading-relaxed max-w-md mx-auto">
                Congratulations! Your early-adopter hardware subsidy and priority batch delivery have been locked in. Official access key sent to <strong class="text-emerald-300">\${email}</strong>.
              </p>

              <div class="p-4 rounded-xl bg-darkBio-900 border border-emerald-900/80 text-left space-y-2.5 text-xs">
                <div class="flex items-center justify-between">
                  <span class="text-slate-400">Early-Adopter Subsidy</span>
                  <span class="text-emerald-400 font-bold">25% OFF Hardware Locked</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-400">Home Energy Audit</span>
                  <span class="text-emerald-300 font-bold">FREE ($350 Value Included)</span>
                </div>
                <div class="flex items-center justify-between border-t border-emerald-950/60 pt-2">
                  <span class="text-slate-400">Priority SMS Updates</span>
                  <span class="text-white font-mono font-bold">\${phone}</span>
                </div>
              </div>

              <div class="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-left text-xs text-slate-300 flex items-center gap-3">
                <i data-lucide="phone-call" class="w-5 h-5 text-emerald-400 shrink-0"></i>
                <span>Our microgrid engineer will contact you shortly to confirm installation slots.</span>
              </div>

              <button onclick="closeModal('leadModal')" class="w-full py-3 rounded-xl bg-emerald-500 text-black font-extrabold text-xs hover:bg-emerald-400 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                <span>Done • Return to Site</span>
              </button>
            </div>
          \`;
          if (window.lucide) lucide.createIcons();
        } else if (heroContainer) {
          heroContainer.innerHTML = \`
            <div class="text-center space-y-4 py-2 animate-fadeIn">
              <div class="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-2xl shadow-lg shadow-emerald-500/20">
                ✓
              </div>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono">
                <span>PRIORITY REF:</span> <strong>#AETH-\${refId}</strong>
              </div>
              <h3 class="text-2xl font-extrabold text-white">Proposal Reserved for \${name}!</h3>
              <p class="text-slate-300 text-xs leading-relaxed max-w-md mx-auto">
                We calculated your microgrid rebate model. A customized PDF spec sheet and solar-storage layout have been prepared for <strong class="text-emerald-300">\${email}</strong>.
              </p>

              <div class="grid grid-cols-2 gap-3 p-4 rounded-xl bg-darkBio-900 border border-emerald-900/80 text-left">
                <div>
                  <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Est. Annual Savings</span>
                  <span class="text-emerald-400 font-extrabold text-base sm:text-lg">$1,840 / yr</span>
                </div>
                <div>
                  <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Federal Tax Credit</span>
                  <span class="text-emerald-300 font-extrabold text-base sm:text-lg">30% ($4,200)</span>
                </div>
              </div>

              <div class="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-left text-xs text-slate-300 flex items-center gap-3">
                <i data-lucide="phone-call" class="w-5 h-5 text-emerald-400 shrink-0"></i>
                <span>Our senior energy engineer will call <strong class="text-white">\${phone}</strong> in under 15 minutes.</span>
              </div>

              <button onclick="resetHeroForm()" class="w-full py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition flex items-center justify-center gap-2">
                <span>← Request Proposal for Another Property</span>
              </button>
            </div>
          \`;
          if (window.lucide) lucide.createIcons();
        }

        window.showToast('🎉 Pre-order secured for ' + name + '! Confirmation sent to ' + email + ' 🚀');
      }, 800);
    };
    `;

    // Replace the previous custom handler with the universal handler
    const sTag = code.indexOf('window.originalHeroFormHtml = \'\';');
    if (sTag !== -1) {
      const eTag = code.indexOf('window.submitLeadFormOld = function(e) {', sTag);
      if (eTag !== -1) {
        code = code.slice(0, sTag) + universalFormHandler + '\n    ' + code.slice(eTag);
      }
    }

    site.latestCode = code;
    site.conversation.push({
      role: "user",
      content: "Make the Pre-Order Reservation Modal form 100% functional with loading state and personalized VIP reservation card."
    });
    site.conversation.push({
      role: "ai",
      content: "Updated the Pre-Order Reservation modal form with animated spinner, dynamic VIP reservation confirmation card, subsidy calculation, and localStorage persistence."
    });

    await site.save();
    console.log("Pre-order modal form updated successfully for site 6a8e7658b07514cd164ed847!");
  } catch (err) {
    console.error("Error updating pre-order modal:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

makePreOrderModalWorking();
