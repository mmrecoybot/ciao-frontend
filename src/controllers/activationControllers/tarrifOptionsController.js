// // tarrif options routes
// router.get("/tarrifoptions", getAlltarrifoptions);
// router.post("/tarrifoptions", addNewTrarrifoptions);
// router.get("/tarrifoptions/:id", singleTrarrifoptions);
// router.patch("/tarrifoptions/:id", updateTrarrifoptions); // Assuming PATCH is used for partial updates, PUT replaces entirely
// router.delete("/tarrifoptions/:id", deleteTrarrifoptions);

//TariffOptions selection controller
const prisma = require("../../config/db");

const getAlltarrifoptions = async (req, res) => {
  try {
    // Only find tariff options where deletedAt is null
    const tariffOptions = await prisma.tarrifOptions.findMany({
      where: { deletedAt: null },
      include: { tarrif: true },
    });
    res.status(200).json(tariffOptions); // Use status 200 for success
  } catch (error) {
    console.error("Error getting all tariff options:", error); // Log the error
    res.status(500).json({ error: error.message || "Internal Server Error" }); // Provide a generic error message
  }
};

const addNewTrarrifoptions = async (req, res) => {
  try {
    const { name, description, tarrifId } = req.body;

    // Basic validation
    if (!name || !tarrifId) {
      return res
        .status(400)
        .json({ error: "Missing required fields (name, tarrifId)" });
    }

    const tariffOption = await prisma.tarrifOptions.create({
      data: {
        name,
        description,
        tarrifId: Number(tarrifId), // Ensure tarrifId is a number
        // deletedAt is null by default
      },
    });
    res.status(201).json(tariffOption); // Use status 201 for resource creation
  } catch (error) {
    console.error("Error adding new tariff option:", error); // Log the error
    // Handle potential unique constraint violation
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({
          error: `Tariff option with this name or unique field already exists.`,
        });
    }
    // Handle foreign key constraint violation if tarrifId doesn't exist
    if (error.code === "P2003") {
      return res.status(400).json({ error: "Invalid tarrifId provided" });
    }
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

const singleTrarrifoptions = async (req, res) => {
  try {
    const { id } = req.params;
    const optionId = parseInt(id);

    if (isNaN(optionId)) {
      return res
        .status(400)
        .json({ error: "Invalid tariff option ID provided" });
    }

    // Find unique tariff option, but only if deletedAt is null
    const tariffOption = await prisma.tarrifOptions.findUnique({
      where: {
        id: optionId,
        deletedAt: null, // Add this condition
      },
      include: { tarrif: true },
    });

    if (!tariffOption) {
      // Return 404 if not found or if it exists but is soft-deleted
      return res
        .status(404)
        .json({ error: "Tariff option not found or is deleted" });
    }

    res.status(200).json(tariffOption); // Use status 200 for success
  } catch (error) {
    console.error("Error getting single tariff option:", error); // Log the error
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

const updateTrarrifoptions = async (req, res) => {
  try {
    const { id } = req.params;
    const optionId = parseInt(id);

    if (isNaN(optionId)) {
      return res
        .status(400)
        .json({ error: "Invalid tariff option ID provided" });
    }

    const { name, description, tarrifId, deletedAt } = req.body;

    // Filter out undefined or null values from body so we don't accidentally overwrite
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (tarrifId !== undefined) updateData.tarrifId = Number(tarrifId); // Ensure number
    // Allow setting deletedAt explicitly (e.g., to null for undelete)
    if (deletedAt !== undefined) {
      updateData.deletedAt = deletedAt === null ? null : new Date(deletedAt);
    }

    const tariffOption = await prisma.tarrifOptions.update({
      where: { id: optionId }, // Update by ID regardless of deleted status
      data: updateData,
    });

    res.status(200).json(tariffOption); // Use status 200 for success
  } catch (error) {
    console.error("Error updating tariff option:", error); // Log the error
    // Handle case where ID is not found
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Tariff option not found" });
    }
    // Handle unique constraint violation on update
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({
          error: `Tariff option with this name or unique field already exists.`,
        });
    }
    // Handle foreign key constraint violation if tarrifId is updated to an invalid ID
    if (error.code === "P2003") {
      return res
        .status(400)
        .json({ error: "Invalid tarrifId provided for update" });
    }
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

const deleteTrarrifoptions = async (req, res) => {
  try {
    const { id } = req.params;
    const optionId = parseInt(id);

    if (isNaN(optionId)) {
      return res
        .status(400)
        .json({ error: "Invalid tariff option ID provided" });
    }

    // Perform soft deletion by updating the deletedAt field
    const tariffOption = await prisma.tarrifOptions.update({
      where: {
        id: optionId,
        // Optional: Only allow soft-deleting if not already deleted.
        // If you want to allow re-deleting, remove the deletedAt: null check.
        deletedAt: null, // Ensure it's not already deleted
      },
      data: { deletedAt: new Date() }, // Set deletedAt to the current date/time
    });

    // Return a success message indicating soft deletion
    res
      .status(200)
      .json({
        message: "Tariff option soft deleted successfully",
        tariffOption,
      });
  } catch (error) {
    console.error("Error soft-deleting tariff option:", error); // Log the error
    // Handle case where ID is not found or already soft-deleted (if where: { deletedAt: null } was included)
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ error: "Tariff option not found or already deleted" });
    }
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

module.exports = {
  getAlltarrifoptions,
  addNewTrarrifoptions,
  singleTrarrifoptions,
  updateTrarrifoptions,
  deleteTrarrifoptions,
};
