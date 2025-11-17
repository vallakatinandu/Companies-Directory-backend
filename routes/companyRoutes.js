import express from "express";
import {
  getCompanies,
  addCompany,
  getCompanyFilters,
} from "../controllers/companyController.js";

const router = express.Router();

router.get("/", getCompanies);
router.get("/filters", getCompanyFilters);
router.post("/", addCompany);

export default router;
