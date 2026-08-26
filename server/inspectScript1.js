import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Website from "./models/website.model.js";

async function inspectScript1() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const site = await Website.findById("6a8e7658b07514cd164ed847");
    const code = site.latestCode;
    const sIdx = code.indexOf("<script>\n    /* __DEFENSIVE_HELPERS__ */");
    const eIdx = code.indexOf("</script>", sIdx);
    console.log("--- FULL SCRIPT 1 ---");
    console.log(code.slice(sIdx, eIdx + 9));
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

inspectScript1();
