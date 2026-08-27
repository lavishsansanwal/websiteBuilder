import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import User from "./models/user.model.js";
import Website from "./models/website.model.js";

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
  const users = await User.find({}).lean();
  console.log("Users:", users.map(u => ({ id: u._id.toString(), email: u.email, name: u.name, credits: u.credits })));

  const websites = await Website.find({}, "_id title user deployed createdAt").lean();
  console.log("Websites:", websites.map(w => ({ id: w._id.toString(), title: w.title?.slice(0, 30), user: w.user?.toString(), deployed: w.deployed })));
  await mongoose.disconnect();
}

main();
