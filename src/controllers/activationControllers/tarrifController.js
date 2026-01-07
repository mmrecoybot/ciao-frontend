// Tariff selection routes
// router.get("/tarrif", getAlltarrif);
// router.post("/tarrif", addNewTrarrif);
// router.get("/tarrif/:id", singleTrarrif);
// router.patch("/tarrif/:id", updateTrarrif);
// router.delete("/tarrif/:id", deleteTrarrif);

// Tariff selection controller
const prisma = require("../../config/db");

const getAlltarrif = async (req, res) => {
  try {
    // Only find tariffs where deletedAt is null
    const tariffs = await prisma.tarrif.findMany({
      where: { deletedAt: null },
      include: { company: true },
    });
    res.status(200).json(tariffs); // Use status 200 for success
  } catch (error) {
    console.error("Error getting all tariffs:", error); // Log the error
    res.status(500).json({ error: error.message || "Internal Server Error" }); // Provide a generic error message
  }
};

const addNewTrarrif = async (req, res) => {
  try {
    const {
      name,
      description,
      companyId,
      categoryTarrif,
      categoryOffer,
      portability,
      client,
      price
    } = req.body;

    // Check for required fields if necessary
    if (!name || !companyId || !price) {
        return res.status(400).json({ error: "Missing required fields (name, companyId, price)" });
    }

    const tariff = await prisma.tarrif.create({
      data: {
        name,
        description,
        companyId, // Ensure companyId is a number if coming from client
        categoryTarrif,
        categoryOffer,
        portability,
        client,
        price: parseFloat(price), // Ensure price is a number/float
        // deletedAt is null by default
      },
    });
    res.status(201).json(tariff); // Use status 201 for resource creation
  } catch (error) {
     console.error("Error adding new tariff:", error); // Log the error
     // Handle potential unique constraint violation if 'name' or other fields are unique
     if (error.code === 'P2002') {
       return res.status(409).json({ error: `Tariff with this name or unique field already exists.` });
     }
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

const singleTrarrif = async (req, res) => {
  try {
    const { id } = req.params;
    const tariffId = parseInt(id);

    if (isNaN(tariffId)) {
       return res.status(400).json({ error: "Invalid tariff ID provided" });
    }

    // Find unique tariff, but only if deletedAt is null
    const tariff = await prisma.tarrif.findUnique({
      where: {
        id: tariffId,
        deletedAt: null, // Add this condition
      },
      include: { company: true },
    });

    if (!tariff) {
      // Return 404 if not found or if it exists but is soft-deleted
      return res.status(404).json({ error: "Tariff not found or is deleted" });
    }

    res.status(200).json(tariff); // Use status 200 for success
  } catch (error) {
    console.error("Error getting single tariff:", error); // Log the error
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

const updateTrarrif = async (req, res) => {
  try {
    const { id } = req.params;
     const tariffId = parseInt(id);

     if (isNaN(tariffId)) {
       return res.status(400).json({ error: "Invalid tariff ID provided" });
     }

    const {
      name,
      description,
      companyId,
      categoryTarrif,
      categoryOffer,
      portability,
      client,
      price,
      deletedAt // Allow updating deletedAt to undelete
    } = req.body;

    // Filter out undefined or null values from body so we don't accidentally overwrite
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (companyId !== undefined) updateData.companyId = Number(companyId); // Ensure number
    if (categoryTarrif !== undefined) updateData.categoryTarrif = categoryTarrif;
    if (categoryOffer !== undefined) updateData.categoryOffer = categoryOffer;
    if (portability !== undefined) updateData.portability = portability;
    if (client !== undefined) updateData.client = client;
    if (price !== undefined) updateData.price = parseFloat(price); // Ensure number
    // Allow setting deletedAt explicitly (e.g., to null for undelete)
    if (deletedAt !== undefined) {
         updateData.deletedAt = deletedAt === null ? null : new Date(deletedAt);
    }


    const tariff = await prisma.tarrif.update({
      where: { id: tariffId }, // Update by ID regardless of deleted status
      data: updateData,
    });

    res.status(200).json(tariff); // Use status 200 for success
  } catch (error) {
    console.error("Error updating tariff:", error); // Log the error
    // Handle case where ID is not found
     if (error.code === 'P2025') {
       return res.status(404).json({ error: "Tariff not found" });
     }
     // Handle unique constraint violation on update
      if (error.code === 'P2002') {
        return res.status(409).json({ error: `Tariff with this name or unique field already exists.` });
      }
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

const deleteTrarrif = async (req, res) => {
  try {
    const { id } = req.params;
     const tariffId = parseInt(id);

      if (isNaN(tariffId)) {
       return res.status(400).json({ error: "Invalid tariff ID provided" });
     }

    // Perform soft deletion by updating the deletedAt field
    const tariff = await prisma.tarrif.update({
      where: {
         id: tariffId,
         // Optional: Only allow soft-deleting if not already deleted.
         // If you want to allow re-deleting, remove the deletedAt: null check.
         deletedAt: null // Ensure it's not already deleted
      },
      data: {
        deletedAt: new Date(), // Set deletedAt to the current date/time
      },
    });
    // Return a success message indicating soft deletion
    res.status(200).json({ message: "Tariff soft deleted successfully", tariff });
  } catch (error) {
     console.error("Error soft-deleting tariff:", error); // Log the error
     // Handle case where ID is not found or already soft-deleted (if where: { deletedAt: null } was included)
     if (error.code === 'P2025') {
       return res.status(404).json({ error: "Tariff not found or already deleted" });
     }
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

module.exports = {
  getAlltarrif,
  addNewTrarrif,
  singleTrarrif,
  updateTrarrif,
  deleteTrarrif,
};