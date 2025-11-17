import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Company from "./models/Company.js";

dotenv.config();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read JSON file manually
const companiesPath = path.join(__dirname, "data", "companies.json");
const companies = JSON.parse(fs.readFileSync(companiesPath, "utf-8"));

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    await Company.deleteMany(); // optional
    await Company.insertMany(companies);

    console.log("Companies Imported Successfully!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();
