// model serialNumber {
//     id          Int      @id @default(autoincrement())
//     number      String   @unique
//     activationId Int?
//     activation Activation?  @relation(fields: [activationId], references: [id])
//     dealerId   Int?
//     dealer     Dealer?   @relation(fields: [dealerId], references: [id])
//     companyId  Int? // Assuming you have a companyId field based on createSerialNumber & getByCompanyId functions
//     company    Company? @relation(fields: [companyId], references: [id]) // Assuming a Company model
//     createdAt   DateTime @default(now())
//     updatedAt   DateTime @updatedAt @default(now())
//     deletedAt   DateTime? // NULL means not deleted
//   }
const prisma = require("../../config/db");

const createSerialNumber = async (req, res) => {
  const { number, dealerId, companyId } = req.body;
  try {
    const serialNumber = await prisma.serialNumber.create({
      data: {
        number,
        dealerId,
        companyId,
      },
    });
    res.status(201).json(serialNumber);
  } catch (error) {
    // Check for unique constraint violation error specifically
    if (error.code === "P2002") {
      res
        .status(409)
        .json({ error: `Serial number '${number}' already exists.` });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

const getAllSerialNumbers = async (req, res) => {
  try {
    const serialNumbers = await prisma.serialNumber.findMany({
      where: {
        deletedAt: null, // Add this condition
      },
      include: {
        dealer: {
          select: {
            id: true,
            companyName: true,
          },
        },
        company: {
          // Include company based on your usage
          select: {
            id: true,
            name: true,
          },
        },
        Activation: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });
    res.status(200).json(serialNumbers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSerialNumberByDealerId = async (req, res) => {
  const { dealerId } = req.params;

  try {
    const serialNumbers = await prisma.serialNumber.findMany({
      // Renamed variable to serialNumbers as it's findMany
      where: {
        dealerId: Number(dealerId),
        deletedAt: null, // Add this condition
      },
      orderBy: { createdAt: "desc" },
      include: {
        dealer: {
          select: {
            id: true,
            companyName: true,
          },
        },
        company: {
          // Include company based on your usage
          select: {
            id: true,
            name: true,
          },
        },
        Activation: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });
    // Check if the array is empty for a 404
    if (serialNumbers.length === 0) {
      return res.status(404).json({
        error: "Serial numbers not found for this dealer or are deleted",
      });
    }
    res.status(200).json(serialNumbers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSerialNumberByCompanyId = async (req, res) => {
  const { companyId } = req.params;
  try {
    const serialNumbers = await prisma.serialNumber.findMany({
      // Renamed variable to serialNumbers as it's findMany
      where: {
        companyId: Number(companyId),
        deletedAt: null, // Add this condition
      },
      include: {
        dealer: {
          select: {
            id: true,
            companyName: true,
          },
        },
        company: {
          // Include company based on your usage
          select: {
            id: true,
            name: true,
          },
        },
        Activation: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });
    // Check if the array is empty for a 404
    if (serialNumbers.length === 0) {
      return res.status(404).json({
        error: "Serial numbers not found for this company or are deleted",
      });
    }
    res.status(200).json(serialNumbers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getNonActivatedSerialNumbers = async (req, res) => {
  // Note: This function's name is generic, but the implementation uses dealerId from params.
  // It might be a duplicate or slightly different logic than getNonActivatedSerialNumbersByDealerId.
  // Assuming it's intended to work off dealerId from params based on current code.
  // If it's meant to be ALL non-activated across dealers/companies, remove the dealerId filter.
  const { dealerId } = req.params;
  try {
    const serialNumbers = await prisma.serialNumber.findMany({
      where: {
        dealerId: Number(dealerId), // Filter by dealerId as per original code
        Activation: null, // Keep this condition for non-activated
        deletedAt: null, // Add this condition
      },
      include: {
        dealer: {
          select: {
            id: true,
            companyName: true,
          },
        },
        company: {
          // Include company based on your usage
          select: {
            id: true,
            name: true,
          },
        },
        Activation: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });
    // console.log(serialNumbers); // Keep console.log if needed for debugging

    // Check if the array is empty for a 404
    if (serialNumbers.length === 0) {
      return res.status(404).json({
        error:
          "Non-activated serial numbers not found for this dealer or are deleted",
      });
    }

    res.status(200).json(serialNumbers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getNonActivatedSerialNumbersByDealerId = async (req, res) => {
  const { dealerId } = req.params;
  try {
    const serialNumbers = await prisma.serialNumber.findMany({
      where: {
        dealerId: Number(dealerId),
        Activation: {
          // Keep this condition for non-activated
          none: {},
        },
        deletedAt: null, // Add this condition
      },
      include: {
        dealer: {
          select: {
            id: true,
            companyName: true,
          },
        },
        company: {
          // Include company based on your usage
          select: {
            id: true,
            name: true,
          },
        },
        Activation: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    // console.log(serialNumbers); // Keep console.log if needed for debugging

    // Check if the array is empty for a 404
    if (serialNumbers.length === 0) {
      return res.status(404).json({
        error:
          "Non-activated serial numbers not found for this dealer or are deleted",
      });
    }

    res.status(200).json(serialNumbers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSerialNumber = async (req, res) => {
  const { id } = req.params;
  // Note: You generally wouldn't filter by deletedAt: null here,
  // as you might need to update a soft-deleted record (e.g., to undelete it).
  const { activationId, dealerId, companyId, number } = req.body;
  try {
    const serialNumber = await prisma.serialNumber.update({
      where: { id: Number(id) }, // Update by ID regardless of deleted status
      data: {
        activationId,
        dealerId,
        companyId,
        number,
      },
    });
    res.status(200).json(serialNumber);
  } catch (error) {
    // Handle case where ID is not found
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Serial number not found" });
    }
    // Handle unique constraint violation on 'number' if updated
    if (error.code === "P2002" && error.meta?.target?.includes("number")) {
      return res
        .status(409)
        .json({ error: `Serial number '${number}' already exists.` });
    }
    res.status(500).json({ error: error.message });
  }
};

const deleteSerialNumber = async (req, res) => {
  const { id } = req.params;
  try {
    // Update deletedAt to the current time for soft deletion
    const serialNumber = await prisma.serialNumber.update({
      where: {
        id: Number(id),
        // Optional: Only allow soft-deleting if not already deleted.
        // If you want to allow re-deleting, remove the deletedAt: null check.
        // deletedAt: null
      },
      data: {
        deletedAt: new Date(),
      },
    });
    res.status(200).json({
      message: "Serial number soft deleted successfully",
      serialNumber,
    });
  } catch (error) {
    // Handle case where ID is not found or already soft-deleted (if you added the where condition)
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ error: "Serial number not found or already deleted" });
    }
    res.status(500).json({ error: error.message });
  }
};

const simController = {
  createSerialNumber,
  getAllSerialNumbers,
  updateSerialNumber,
  deleteSerialNumber,
  getSerialNumberByCompanyId,
  getSerialNumberByDealerId,
  getNonActivatedSerialNumbers,
  getNonActivatedSerialNumbersByDealerId,
};
module.exports = simController;
