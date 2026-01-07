// // sim serial routes
// router.get("/simserials", getAllSimSerials);
// router.post("/simserials", addNewSimSerial);
// router.get("/simserials/:id", singleSimSerial);
// router.patch("/simserials/:id", updateSimSerial);
// router.delete("/simserials/:id", deleteSimSerial);

// sim serial controller
const prisma = require("../../config/db");

const getAllSimSerials = async (req, res) => {
  try {
    const simSerials = await prisma.simSerial.findMany();
    res.json(simSerials);
  } catch (error) {
    res.json({ error: error.message });
  }
};

const addNewSimSerial = async (req, res) => {
  try {
    const { name } = req.body;
    const simSerial = await prisma.simSerial.create({
      data: { name },
    });
    res.json(simSerial);
  } catch (error) {
    res.json({ error: error.message });
  }
};

const singleSimSerial = async (req, res) => {
  try {
    const { id } = req.params;
    const simSerial = await prisma.simSerial.findUnique({
      where: { id: parseInt(id) },
    });
    res.json(simSerial);
  } catch (error) {
    res.json({ error: error.message });
  }
};

const updateSimSerial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const simSerial = await prisma.simSerial.update({
      where: { id: parseInt(id) },
      data: { name },
    });
    res.json(simSerial);
  } catch (error) {
    res.json({ error: error.message });
  }
};

const deleteSimSerial = async (req, res) => {
  try {
    const { id } = req.params;
    const simSerial = await prisma.simSerial.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() },
    });
    res.json(simSerial);
  } catch (error) {
    res.json({ error: error.message });
  }
};

module.exports = {
  getAllSimSerials,
  addNewSimSerial,
  singleSimSerial,
  updateSimSerial,
  deleteSimSerial,
};
