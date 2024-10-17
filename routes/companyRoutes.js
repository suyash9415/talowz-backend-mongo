const express = require("express");
const router = express.Router();
const Company = require("../models/companyModel");

//Get All
router.get("/", async (req, res) => {
  try {
    const { industry, category } = req.query;
    let query = {};
    if (industry) query.industry = industry;
    if (category) query.category = category;

    const companies = await Company.find(query);
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get By ID
router.get("/:id", getCompany, (req, res) => {
  res.json(res.company);
});

//Get Companies By Category and Industry
router.post("/search", async (req, res) => {
  try {
    const { category, industry } = req.body;
    let query = {};
    if (category) query.category = category;
    if (industry) query.industry = industry;

    if (category && Array.isArray(category) && category.length > 0) {
      query.category = { $in: category };
    }

    if (industry && Array.isArray(industry) && industry.length > 0) {
      query.industry = { $in: industry };
    }

    const companies = await Company.find(query);

    if (companies.length === 0) {
      return res.status(404).json({ message: "No companies found" });
    }

    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Add New Company
router.post("/", async (req, res) => {
  const company = new Company({
    name: req.body.name,
    industry: req.body.industry,
    category: req.body.category,
    website: req.body.website,
    description: req.body.description,
    additionalInfo: req.body.additionalInfo,
  });

  try {
    const newCompany = await company.save();
    res.status(201).json(newCompany);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Update Company
router.patch("/:id", getCompany, async (req, res) => {
  if (req.body.name != null) {
    res.company.name = req.body.name;
  }
  if (req.body.industry != null) {
    res.company.industry = req.body.industry;
  }
  if (req.body.category != null) {
    res.company.category = req.body.category;
  }
  if (req.body.website != null) {
    res.company.website = req.body.website;
  }
  if (req.body.description != null) {
    res.company.description = req.body.description;
  }
  if (req.body.additionalInfo != null) {
    res.company.additionalInfo = req.body.additionalInfo;
  }

  try {
    const updatedCompany = await res.company.save();
    res.json(updatedCompany);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Delete Company
router.delete("/:id", getCompany, async (req, res) => {
  try {
    await res.company.deleteOne();
    res.json({ message: "Company deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getCompany(req, res, next) {
  let company;
  try {
    company = await Company.findById(req.params.id);
    if (company == null) {
      return res.status(404).json({ message: "Company not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.company = company;
  next();
}

module.exports = router;
