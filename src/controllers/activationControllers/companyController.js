// company routes
// router.get("/companies", getAllCompanies);
// router.post("/companies", addNewCompany);
// router.get("/companies/:id", singleCompany);
// router.patch("/companies/:id", updateCompany);
// router.delete("/companies/:id", deleteCompany);

// company controller
const prisma = require("../../config/db");

const getAllCompanies = async (req, res) => {
  try {
    const companies = await prisma.company.findMany({
      where: { deletedAt: null },
      include: {
        Tarrif: {
          where: { deletedAt: null },
        },
      },
    });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addNewCompany = async (req, res) => {
  try {
    const { name, description, logo } = req.body;
    const company = await prisma.company.create({
      data: { name, description, logo },
    });
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const singleCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await prisma.company.findUnique({
      where: { id: parseInt(id) },
      include: { Tarrif: true },
    });
    res.json(company);
  } catch (error) {
    res.json({ error: error.message });
  }
};

const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description,logo } = req.body;
    const company = await prisma.company.update({
      where: { id: parseInt(id) },
      data: { name, description,logo },
    });
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.company.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() },
    });
    res.json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCompanies,
  addNewCompany,
  singleCompany,
  updateCompany,
  deleteCompany,
};
