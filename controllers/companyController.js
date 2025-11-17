import Company from "../models/Company.js";

// =============================
// GET COMPANIES (with pagination, filters, sorting)
// =============================
export const getCompanies = async (req, res) => {
  try {
    let {
      search = "",
      industry = "",
      location = "",
      sortBy = "name",
      sortDir = "asc",
      page = 1,
      limit = 10,
    } = req.query;

    page = Number(page);
    limit = Number(limit);

    // Build query
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { industry: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    if (industry) query.industry = industry;
    if (location) query.location = location;

    // Sorting
    const sortOrder = sortDir === "desc" ? -1 : 1;
    const sortOptions = sortBy ? { [sortBy]: sortOrder } : {};

    // Fetch companies
    const companies = await Company.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);

    // Get total count
    const totalRecords = await Company.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / limit);

    res.json({
      success: true,
      data: companies,
      meta: {
        page,
        limit,
        totalPages,
        totalRecords,
        hasPrev: page > 1,
        hasNext: page < totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// =============================
// GET FILTERS (industry + location)
// =============================
export const getCompanyFilters = async (req, res) => {
  try {
    const industries = await Company.distinct("industry");
    const locations = await Company.distinct("location");

    res.json({
      success: true,
      industries,
      locations,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// =============================
// ADD COMPANY
// =============================
export const addCompany = async (req, res) => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
