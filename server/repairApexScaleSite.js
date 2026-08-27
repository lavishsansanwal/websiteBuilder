import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Website from "./models/website.model.js";

async function repairApexScaleSite() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const site = await Website.findById("6a8e9f1952004025128566b6");
    if (!site) return;

    let code = site.latestCode;
    
    // Check if the submit button is missing in the form before </body>
    if (!code.includes("Submit Request & Claim") && !code.includes("Claim 50 Free")) {
      code = code.replace(
        `100 - 500\n</body>`,
        `100 - 500
                  </button>
                </div>
              </div>

              <div class="pt-4">
                <button type="submit" class="w-full py-4 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-brand-500/30 hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer">
                  <span>Claim 50 Free Qualified Leads ➔</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-slate-800/80 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-lg bg-brand-600 flex items-center justify-center text-white font-black text-xs">A</div>
          <span class="font-bold text-white text-sm">ApexScale AI</span>
        </div>
        <p>© ${new Date().getFullYear()} ApexScale AI. All rights reserved.</p>
        <div class="flex items-center gap-4">
          <button onclick="openModal('signInModal')" class="hover:text-white transition">Sign In</button>
          <button onclick="openModal('leadModal')" class="hover:text-white transition">Contact</button>
        </div>
      </div>
    </footer>
</body>`
      );
      site.latestCode = code;
      await site.save();
      console.log("ApexScale site HTML successfully repaired and saved to DB!");
    }
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

repairApexScaleSite();
