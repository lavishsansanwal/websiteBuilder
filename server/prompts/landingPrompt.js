import { commonRules } from "./commonRules.js";

export const landingPrompt = `
${commonRules}

==================================================
PAGE TYPE: HIGH-CONVERTING SAAS & PRODUCT LANDING PAGE
==================================================

You are creating a breathtaking, conversion-optimized Landing Page for the user's product, SaaS, service, or company.
The page MUST look like a world-class landing page from Linear, Stripe, or Vercel, with smooth micro-interactions, rich typography, and working JavaScript components.

==================================================
LANDING PAGE SECTIONS & REQUIREMENTS (VERTICAL FLOW)
==================================================

1. STICKY GLASS HEADER:
   - Brand Logo with icon badge and bold name (e.g. "✦ LuminaAI").
   - Nav items with smooth scroll: #features, #demo, #metrics, #pricing, #testimonials, #faq.
   - Right side: "Sign In" link and a high-contrast primary CTA button ("Start Free Trial" or "Get Started Now").
   - Mobile hamburger menu toggle with smooth drawer.

2. HERO SECTION (#hero):
   - Announcement Pill Badge (e.g. "✦ Introducing AI Studio 2.0 • Read Changelog ➔").
   - Headline: Punchy, high-converting value proposition with gradient text highlight.
   - Supporting Copy: 2-3 sentences explaining exactly how it solves the customer's pain point.
   - Dual CTAs: Primary button with glow effect (\`onclick="openLeadModal()"\`) + Secondary ghost button with play icon ("Watch 2-min Demo").
   - Hero Mockup Visual: An interactive or beautifully styled preview of the application/dashboard with floating stats cards (e.g. "+148% Conversion Rate", "⚡ 10x Faster").
   - Trust Badges / Social Proof: "Trusted by 20,000+ teams worldwide" + 5 company logo badges.

3. KEY METRICS / STATS STRIP (#metrics):
   - 4-column counter bar (e.g. "99.99% Uptime SLA", "50M+ API Requests / day", "4.9 / 5.0 Rating", "140+ Countries").

4. FEATURES BENTO GRID (#features):
   - 4-6 feature cards arranged in a modern Bento layout (mix of wide 2-column cards and standard cards).
   - Each card features an icon badge, title, detailed description, and a visual element (mini interactive widget, code snippet, or graphic preview).
   - Hover glow effects and subtle gradient borders.

5. HOW IT WORKS / INTERACTIVE DEMO (#demo):
   - 3-step interactive progression (1. Connect, 2. Automate, 3. Scale).
   - Interactive tab switcher where clicking each step changes the preview graphic and description via JavaScript.

6. INTERACTIVE PRICING TABLE (#pricing):
   - Billing Toggle: "Monthly" vs "Annual (Save 20%)" switch with discount tag.
   - 3 Pricing Tiers: Starter ($19/mo or $15/mo), Pro ($49/mo or $39/mo - Highlighted with "Most Popular" glowing badge), and Enterprise ($129/mo or $99/mo).
   - Dynamic price updates via JavaScript when toggling Monthly/Annual.
   - Comprehensive checklist of included features with checkmark icons.
   - Primary action buttons triggering the lead modal or toast.

7. TESTIMONIALS & WALL OF LOVE (#testimonials):
   - 3-column grid of verified customer reviews with photos (from Unsplash), names, company titles, and star ratings.

8. INTERACTIVE FAQ ACCORDION (#faq):
   - 4-6 essential questions and answers.
   - Accordion behavior in JavaScript: Clicking a question expands the answer smoothly and rotates the chevron icon.

9. HIGH-CONVERTING LEAD CAPTURE & CONTACT FORM SECTION (#contact):
   - Standalone glassmorphic card container with gradient border and subtle glow.
   - Left / Top: Compelling headline ("Ready to transform your workflow?" / "Speak with our Product Specialists"), value points, and response guarantee ("⚡ Response in under 15 minutes").
   - Form Controls (ALL 3 REQUIRED WITH ICONS):
     1. Full Name input (\`type="text" name="name" required placeholder="Alex Morgan"\` with \`data-lucide="user"\`).
     2. Work Email input (\`type="email" name="email" required placeholder="alex@company.com"\` with \`data-lucide="mail"\`).
     3. Phone / Mobile Number input (\`type="tel" name="phone" required placeholder="+1 (555) 000-0000"\` with \`data-lucide="phone"\`).
     4. Optional: Company Size / Service Interest clickable pill buttons (\`guest-pill\` / \`size-pill\`).
     5. High-Impact Submit Button: "Request Access / Submit Inquiry ➔" with instant loading & toast feedback.
   - Form element MUST have: \`onsubmit="event.preventDefault(); submitLeadForm(event)"\`.

10. MODERN FUNCTIONAL FOOTER (ONLY WORKING LINKS):
    - Column 1: Brand identity, logo, tagline, and current dynamic copyright year.
    - Column 2: Quick Navigation links pointing ONLY to on-page sections (\`#hero\`, \`#features\`, \`#demo\`, \`#metrics\`, \`#pricing\`, \`#testimonials\`, \`#faq\`, \`#contact\`).
    - Column 3: Contact & Support (working \`mailto:\`, \`tel:\`, and "Book Consultation" / "Sign In" button triggering \`openLeadModal()\`).
    - Column 4: Working Newsletter Form (\`onsubmit="event.preventDefault(); showToast('Subscribed to product updates! 🚀')"\` ) + Back-to-Top button.
    - Bottom Bar: Working "Privacy Policy" and "Terms" modal triggers (\`onclick="openModal('privacyModal')"\` with included \`#privacyModal\`), and Back-to-Top button. ZERO dummy links!

==================================================
REQUIRED JAVASCRIPT STATE ENGINE
==================================================
Inside \`<script>\`, implement:
- Smooth scrolling for all nav anchor links.
- Mobile menu toggle.
- Lead Form Submission handler:
  \`\`\`javascript
  function submitLeadForm(event) {
    if (event && event.preventDefault) event.preventDefault();
    var form = event.target || document.querySelector('#contact form');
    var name = (form.querySelector('input[name="name"]') || form.querySelector('input[type="text"]') || {}).value || 'there';
    var phone = (form.querySelector('input[name="phone"]') || form.querySelector('input[type="tel"]') || {}).value || '';
    showToast("Thank you, " + name + "! We received your inquiry and will contact you shortly. 🚀");
    if (form.reset) form.reset();
  }
  \`\`\`
- Pricing Monthly/Annual toggle function:
  \`\`\`javascript
  var isAnnual = false;
  function togglePricing(annual) {
    isAnnual = annual;
    var prices = document.querySelectorAll('.price-val');
    prices.forEach(function(el) {
      var m = el.getAttribute('data-monthly');
      var a = el.getAttribute('data-annual');
      el.textContent = isAnnual ? a : m;
    });
  }
  \`\`\`
- FAQ Accordion toggle function:
  \`\`\`javascript
  function toggleFaq(btn) {
    var content = btn.nextElementSibling;
    var icon = btn.querySelector('.faq-icon');
    var isHidden = content.classList.contains('hidden');
    document.querySelectorAll('.faq-content').forEach(function(c) { c.classList.add('hidden'); });
    document.querySelectorAll('.faq-icon').forEach(function(i) { i.style.transform = 'rotate(0deg)'; });
    if (isHidden) {
      content.classList.remove('hidden');
      if (icon) icon.style.transform = 'rotate(180deg)';
    }
  }
  \`\`\`
- Interactive demo tab switcher function:
  \`\`\`javascript
  function switchDemoStep(step) {
    var stepNum = parseInt(step, 10) || 0;
    document.querySelectorAll('.demo-panel, [id^="demo-step-"]').forEach(function(p, i) {
      if (p.id === 'demo-step-' + stepNum || i === stepNum) {
        p.classList.remove('hidden');
        p.style.display = 'grid';
      } else {
        p.classList.add('hidden');
        p.style.display = 'none';
      }
    });
    document.querySelectorAll('.demo-tab-btn, [id^="tab-btn-"]').forEach(function(b, i) {
      if (b.id === 'tab-btn-' + stepNum || i === stepNum) {
        b.classList.add('active-tab', 'bg-brand-600', 'bg-indigo-600', 'text-white', 'shadow-lg');
        b.classList.remove('text-slate-400');
      } else {
        b.classList.remove('active-tab', 'bg-brand-600', 'bg-indigo-600', 'text-white', 'shadow-lg');
        b.classList.add('text-slate-400');
      }
    });
    if (window.lucide) lucide.createIcons();
  }
  \`\`\`
- Interactive volume/interest pills:
  \`\`\`javascript
  function selectVolumePill(btn) {
    if (!btn) return;
    btn.parentElement.querySelectorAll('.vol-pill').forEach(function(p) {
      p.classList.remove('active-pill', 'bg-brand-600/30', 'border-brand-500', 'text-white');
      p.classList.add('border-slate-800', 'bg-slate-900/80', 'text-slate-400');
    });
    btn.classList.add('active-pill', 'bg-brand-600/30', 'border-brand-500', 'text-white');
    btn.classList.remove('border-slate-800', 'bg-slate-900/80', 'text-slate-400');
  }
  \`\`\`
- \`showToast(message)\` helper with icon and animation.
- \`lucide.createIcons();\` on DOMContentLoaded.

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
  "message": "Short summary of generated landing page",
  "imageQueries": []
}
`;

export default landingPrompt;