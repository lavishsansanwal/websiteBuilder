import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import User from "./models/user.model.js";
import Website from "./models/website.model.js";

async function inspectCurrentUser() {
  await mongoose.connect(process.env.MONGODB_URL);
  const users = await User.find({}).lean();
  console.log("All Users:", JSON.stringify(users, null, 2));
  await mongoose.disconnect();
}

inspectCurrentUser();
