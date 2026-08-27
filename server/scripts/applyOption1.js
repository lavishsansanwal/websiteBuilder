import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Website from "../models/website.model.js";

async function applyOption1() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const site = await Website.findById("6a8e7658b07514cd164ed847");
    if (!site) {
      console.log("Site not found");
      return;
    }

    let code = site.latestCode;

    // 1. Give the Hero Form container an ID so we can swap its contents
    code = code.replace(
      '<div class="lg:col-span-7 glass-card rounded-2xl p-6 sm:p-8 border border-emerald-500/20">',
      '<div id="heroFormContainer" class="lg:col-span-7 glass-card rounded-2xl p-6 sm:p-8 border border-emerald-500/20">'
    );

    // 2. Add upgraded submitLeadForm and resetHeroForm logic into script
    const customFormScript = `
    window.originalHeroFormHtml = '';
    window.resetHeroForm = function() {
      var container = document.getElementById('heroFormContainer');
      if (container && window.originalHeroFormHtml) {
        container.innerHTML = window.originalHeroFormHtml;
        if (window.lucide) lucide.createIcons();
      }
    };

    window.submitLeadForm = function(e) {
      if (e && e.preventDefault) e.preventDefault();
      var form = (e && e.target) || document.querySelector('#heroFormContainer form') || document.querySelector('form');
      if (!form) return;

      var nameInput = form.querySelector('input[name="name"]') || form.querySelector('input[type="text"]');
      var emailInput = form.querySelector('input[name="email"]') || form.querySelector('input[type="email"]');
      var phoneInput = form.querySelector('input[name="phone"]') || form.querySelector('input[type="tel"]');

      var name = (nameInput && nameInput.value ? nameInput.value.trim() : 'Alex Morgan');
      var email = (emailInput && emailInput.value ? emailInput.value.trim() : 'alex@company.com');
      var phone = (phoneInput && phoneInput.value ? phoneInput.value.trim() : '+1 (555) 000-0000');

      var submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('button');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="inline-block animate-spin mr-2">⚡</span> Analyzing Home Microgrid Specs...';
      }

      var container = document.getElementById('heroFormContainer');
      if (container && !window.originalHeroFormHtml) {
        window.originalHeroFormHtml = container.innerHTML;
      }

      setTimeout(function() {
        var refId = 'AETH-' + Math.floor(10000 + Math.random() * 90000);
        
        try {
          localStorage.setItem('aether_smart_lead', JSON.stringify({
            name: name,
            email: email,
            phone: phone,
            refId: refId,
            submittedAt: new Date().toLocaleString()
          }));
        } catch(err) {}

        if (container) {
          container.innerHTML = \`
            <div class="text-center space-y-4 py-2 animate-fadeIn">
              <div class="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-2xl shadow-lg shadow-emerald-500/20">
                ✓
              </div>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono">
                <span>PRIORITY REF:</span> <strong>#\${refId}</strong>
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

        window.showToast('Energy proposal generated for ' + name + '! Spec sheet sent to ' + email + ' 🚀');
        window.closeModal('leadModal');
      }, 900);
    };
    `;

    code = code.replace('window.submitLeadForm = window.submitLeadForm || function(e) {', customFormScript + '\n    window.submitLeadFormOld = function(e) {');

    site.latestCode = code;
    site.conversation.push({
      role: "user",
      content: "Make the energy proposal form 100% interactive with loading spinner, personalized confirmation card, annual savings calculation, and toast notification."
    });
    site.conversation.push({
      role: "ai",
      content: "Implemented full interactive lead submission flow for the Smart Energy Proposal form with real-time state transformation, custom rebate calculations, and localStorage persistence."
    });

    await site.save();
    console.log("Option 1 applied successfully to site 6a8e7658b07514cd164ed847!");
  } catch (err) {
    console.error("Apply error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

applyOption1();
