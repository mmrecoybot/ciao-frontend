//activation routes
// router.get("/activations", getAllActivations);
// router.post("/activations", addNewActivation);
// router.get("/activations/:id", singleActivation);
// router.patch("/activations/:id", updateActivation);
// router.delete("/activations/:id", deleteActivation);

// activation controller
const prisma = require("../../config/db");

const getAllActivations = async (req, res) => {
  try {
    const activations = await prisma.activation.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        company: true,
        tarrif: true,
        user: { select: { name: true, email: true } },
        serialNumber: { select: { number: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(activations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addNewActivation = async (req, res) => {
  try {
    const {
      userId,
      client,
      portability,
      categoryOffer,
      categoryTarrif,
      moodOfPayment,
      companyId,
      tarrifId,
      serialNumberId,
      paymentDocument,
      paymentDate,
    } = req.body;

    if (!userId || !tarrifId || !companyId || !serialNumberId) {
       return res.status(400).json({ error: "Missing required fields (userId, tarrifId, companyId, serialNumberId)." });
    }

    const tarrif = await prisma.tarrif.findUnique({
      where: { id: parseInt(tarrifId) },
    });

    if (!tarrif) {
      return res.status(404).json({ error: "Tarrif not found." });
    }

    const { name, description, price } = tarrif;

    const activation = await prisma.activation.create({
      data: {
        userId: parseInt(userId),
        client,
        portability,
        categoryOffer,
        categoryTarrif,
        moodOfPayment,
        companyId: parseInt(companyId),
        tarrifId: parseInt(tarrifId),
        serialNumberId: parseInt(serialNumberId),
        paymentDocument,
        paymentDate,
        price,
        name,
        details: description,
        status: "pending",
      },
    });

    res.status(201).json(activation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const singleActivation = async (req, res) => {
  try {
    const { id } = req.params;
    const activation = await prisma.activation.findUnique({
      where: {
        id: parseInt(id),
        deletedAt: null,
      },
      include: { company: true, tarrif: true, user: true, serialNumber: true },
    });
    if (!activation) {
      return res.status(404).json({ error: "Activation not found or deleted." });
    }
    res.json(activation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateActivation = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks, activationDocuments } = req.body;
    const updateActivation = {
      status,
      remarks,
      activationDocuments,
    };
    if (status == "processing") {
      updateActivation.paymentStatus = "Confirmed";
    }
    if (status == "active") {
      updateActivation.activationDate = new Date().toISOString();
    }
    const activation = await prisma.activation.update({
      where: { id: parseInt(id) },
      data: updateActivation,
    });

    await prisma.notification.create({
      data: {
        title: `Activation no ${activation.id} Updated`,
        body: remarks,
        userId: activation.userId,
        seen: false,
      },
    });

    res.json(activation);
  } catch (error) {
    res.json({ error: error.message });
  }
};

const deleteActivation = async (req, res) => {
  try {
    const { id } = req.params;
    const activation = await prisma.activation.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() },
    });
    res.json({ message: "Activation soft deleted successfully", activation });
  } catch (error) {
    if (error.code === 'P2025') {
       return res.status(404).json({ error: "Activation not found" });
    }
    res.status(500).json({ error: error.message });
  }
};

const getActivationsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const activations = await prisma.activation.findMany({
      where: {
        userId: parseInt(userId),
        deletedAt: null,
      },
      include: {
        company: true,
        tarrif: true,
        user: { select: { name: true, email: true } },
        serialNumber: { select: { number: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(activations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  getAllActivations,
  addNewActivation,
  singleActivation,
  updateActivation,
  deleteActivation,
  getActivationsByUserId,
};
