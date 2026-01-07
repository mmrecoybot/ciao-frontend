// model Brand {
//     id          Int       @id @default(autoincrement())
//     name        String    @unique // Assuming name is unique
//     description String?
//     logo        String?   // Assuming this stores a file path or URL
//     createdAt   DateTime  @default(now())
//     updatedAt   DateTime  @updatedAt
//     deletedAt   DateTime? // NULL means not deleted
//     // products    Product[] // Assuming relation back to Product model
//   }
const prisma = require("../../config/db");
// brand functions
const getAllBrands = async (req, res) => {
  try {
    // Find all brands where deletedAt is null
    const brands = await prisma.brand.findMany({
      where: { deletedAt: null }, // Add this condition
      orderBy: { name: "asc" }, // Optional: Order by name
    });
    res.status(200).json(brands); // Use status 200 for success
  } catch (error) {
    console.error("Error fetching all brands:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" }); // More specific message
  }
};

const addNewBrand = async (req, res) => {
  try {
    const { name, description, logo } = req.body;

    // Basic validation for name
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const brand = await prisma.brand.create({
      data: {
        name,
        description,
        logo,
        // deletedAt is null by default
      },
    });
    res.status(201).json(brand); // Use status 201 for resource creation
  } catch (error) {
    console.error("Error creating brand:", error);
    // Handle unique constraint violation for name
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({
          error: `A brand with the name "${req.body.name}" already exists.`,
        });
    }
    res.status(500).json({ error: error.message || "Internal Server Error" }); // More specific message
  }
};

const singleBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brandId = parseInt(id);

    if (isNaN(brandId)) {
      return res.status(400).json({ error: "Invalid brand ID provided" }); // More specific error
    }

    // Find unique brand, but only if deletedAt is null
    const brand = await prisma.brand.findUnique({
      where: {
        id: brandId,
        deletedAt: null, // Add this condition
      },
    });

    if (!brand) {
      // Return 404 if not found or if it exists but is soft-deleted
      return res.status(404).json({ error: "Brand not found or is deleted" });
    }
    res.status(200).json(brand); // Use status 200 for success
  } catch (error) {
    console.error("Error fetching brand:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" }); // More specific message
  }
};

const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brandId = parseInt(id);

    if (isNaN(brandId)) {
      return res.status(400).json({ error: "Invalid brand ID provided" }); // More specific error
    }

    // Extract data, allowing deletedAt to be potentially set (e.g., to null for undelete)
    const { name, description, logo, deletedAt } = req.body;

    // Build data object, filtering undefined fields from body
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (logo !== undefined) updateData.logo = logo;

    // Handle the deletedAt field for potential undelete
    if (deletedAt !== undefined) {
      updateData.deletedAt = deletedAt === null ? null : new Date(deletedAt);
    }

    const brand = await prisma.brand.update({
      where: { id: brandId }, // Update by ID regardless of deleted status
      data: updateData, // Use the constructed updateData
    });
    res.status(200).json(brand); // Use status 200 for success
  } catch (error) {
    console.error("Error updating brand:", error);
    // Handle case where ID is not found
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Brand not found" });
    }
    // Handle unique constraint violation on update
    if (error.code === "P2002") {
      const target = error.meta?.target?.join(", ") || "a unique field";
      return res
        .status(409)
        .json({ error: `A brand with the provided ${target} already exists.` });
    }
    res.status(500).json({ error: error.message || "Internal Server Error" }); // More specific message
  }
};

const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brandId = parseInt(id);

    if (isNaN(brandId)) {
      return res.status(400).json({ error: "Invalid brand ID provided" }); // More specific error
    }

    // Perform soft deletion by updating the deletedAt field
    // Include deletedAt: null in where to ensure it fails if already deleted
    const brand = await prisma.brand.update({
      where: {
        id: brandId,
        deletedAt: null, // Ensure it's not already deleted
        // Optional: Prevent deletion if related products exist that shouldn't be orphaned.
        // Or configure Prisma relations for cascading deletes (hard delete) or set null.
        // Soft delete doesn't typically cascade automatically.
      },
      data: { deletedAt: new Date() }, // Set deletedAt to the current date/time
    });

    // Return a success message for soft deletion
    // Returning 200 with body is clearer for soft delete than 204
    res.status(200).json({ message: "Brand soft deleted successfully", brand });
  } catch (error) {
    console.error("Error soft-deleting brand:", error);
    // Handle case where the brand is not found or already soft-deleted
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ error: "Brand not found or already deleted" });
    }
    res.status(500).json({ error: error.message || "Internal Server Error" }); // More specific message
  }
};

module.exports = {
  getAllBrands, // Added deletedAt: null filter
  addNewBrand, // Added validation and error handling
  singleBrand, // Added deletedAt: null filter, 404 logic, and validation
  updateBrand, // Added deletedAt handling, validation, and error handling
  deleteBrand, // Changed to soft delete, added validation and error handling
};
