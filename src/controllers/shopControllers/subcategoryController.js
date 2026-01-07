// model SubCategory {
//     id          Int       @id @default(autoincrement())
//     name        String    @unique // Assuming name is unique
//     categoryId  Int
//     category    Category  @relation(fields: [categoryId], references: [id])
//     description String?
//     logo        String?   // Assuming this stores a file path or URL
//     createdAt   DateTime  @default(now())
//     updatedAt   DateTime  @updatedAt
//     deletedAt   DateTime? // NULL means not deleted
//     Product     Product[] // Assuming relation back to Product model
//   }
const prisma = require("../../config/db");
// subcategory functions
const getAllSubCategories = async (req, res) => {
  try {
    // Find all subcategories where deletedAt is null
    const subcategories = await prisma.subCategory.findMany({
      where: { deletedAt: null }, // Add this condition
      include: {
        category: true, // Include category details (doesn't need deletedAt filter unless Category also has it)
      },
      orderBy: { name: "asc" }, // Optional: Order by name
    });
    res.status(200).json(subcategories); // Use status 200 for success
  } catch (error) {
    console.error("Error fetching all subcategories:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" }); // More specific message
  }
};

const addNewSubCategory = async (req, res) => {
  try {
    const { name, categoryId, description, logo } = req.body;

    // Basic validation for required fields and categoryId format
    if (!name || categoryId === undefined || isNaN(Number(categoryId))) {
      return res
        .status(400)
        .json({ error: "Name and a valid numeric category ID are required" });
    }
    const categoryIdNum = Number(categoryId);

    const subcategory = await prisma.subCategory.create({
      data: {
        name,
        categoryId: categoryIdNum, // Ensure categoryId is a number
        description, // description and logo are optional
        logo,
        // deletedAt is null by default
      },
    });
    res.status(201).json(subcategory); // Use status 201 for resource creation
  } catch (error) {
    console.error("Error creating subcategory:", error);
    // Handle unique constraint violation for name
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({
          error: `A subcategory with the name "${req.body.name}" already exists.`,
        });
    }
    // Handle foreign key constraint violation if categoryId doesn't exist
    if (error.code === "P2003") {
      return res
        .status(400)
        .json({ error: "Invalid category ID provided, category not found" });
    }
    res.status(500).json({ error: error.message || "Internal Server Error" }); // More specific message
  }
};

const singleSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategoryId = parseInt(id);

    // Basic ID validation
    if (isNaN(subcategoryId)) {
      return res.status(400).json({ error: "Invalid subcategory ID provided" }); // More specific error
    }

    // Find unique subcategory, but only if deletedAt is null
    const subcategory = await prisma.subCategory.findUnique({
      where: {
        id: subcategoryId,
        deletedAt: null, // Add this condition
      },
      include: {
        category: true, // Include category details
      },
    });

    if (!subcategory) {
      // Return 404 if not found or if it exists but is soft-deleted
      return res
        .status(404)
        .json({ error: "Subcategory not found or is deleted" });
    }
    res.status(200).json(subcategory); // Use status 200 for success
  } catch (error) {
    console.error("Error fetching subcategory:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" }); // More specific message
  }
};

const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategoryId = parseInt(id);

    // Basic ID validation
    if (isNaN(subcategoryId)) {
      return res.status(400).json({ error: "Invalid subcategory ID provided" }); // More specific error
    }

    // Extract data, allowing deletedAt to be potentially set (e.g., to null for undelete)
    const { name, categoryId, description, logo, deletedAt } = req.body;

    // Build data object, filtering undefined fields from body
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (categoryId !== undefined) {
      const categoryIdNum = Number(categoryId);
      if (isNaN(categoryIdNum))
        throw new Error("Invalid categoryId provided in update data", {
          cause: { code: "BAD_INPUT" },
        });
      updateData.categoryId = categoryIdNum;
    }
    if (description !== undefined) updateData.description = description;
    if (logo !== undefined) updateData.logo = logo;

    // Handle the deletedAt field for potential undelete
    if (deletedAt !== undefined) {
      updateData.deletedAt = deletedAt === null ? null : new Date(deletedAt);
    }

    const subcategory = await prisma.subCategory.update({
      where: { id: subcategoryId }, // Update by ID regardless of deleted status
      data: updateData, // Use the constructed updateData
    });
    res.status(200).json(subcategory); // Use status 200 for success
  } catch (error) {
    console.error("Error updating subcategory:", error);
    // Handle case where ID is not found
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Subcategory not found" });
    }
    // Handle unique constraint violation on update
    if (error.code === "P2002") {
      const target = error.meta?.target?.join(", ") || "a unique field";
      return res
        .status(409)
        .json({
          error: `A subcategory with the provided ${target} already exists.`,
        });
    }
    // Handle foreign key constraint violation if categoryId is updated to an invalid ID, or our custom BAD_INPUT
    if (
      error.code === "P2003" ||
      (error.cause && error.cause.code === "BAD_INPUT")
    ) {
      const errorMessage = error.message.includes("BAD_INPUT")
        ? error.message.replace(', { "cause": { "code": "BAD_INPUT" } }', "")
        : "Invalid category ID provided for update";
      return res.status(400).json({ error: errorMessage });
    }
    res.status(500).json({ error: error.message || "Internal Server Error" }); // More specific message
  }
};

const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategoryId = parseInt(id);

    // Basic ID validation
    if (isNaN(subcategoryId)) {
      return res.status(400).json({ error: "Invalid subcategory ID provided" }); // More specific error
    }

    // Perform soft deletion by updating the deletedAt field
    // Include deletedAt: null in where to ensure it fails if already deleted
    const subcategory = await prisma.subCategory.update({
      where: {
        id: subcategoryId,
        deletedAt: null, // Ensure it's not already deleted
        // Optional Business Logic: Prevent deletion if related Products exist.
        // const productCount = await prisma.product.count({ where: { subCategoryId: subcategoryId, deletedAt: null } });
        // if (productCount > 0) {
        //     throw new Error("Cannot delete subcategory with existing products.", { cause: { code: 'DELETE_CONSTRAINT' } });
        // }
        // If you decide to delete regardless, consider soft-deleting related Products and their Variations too (transaction needed).
      },
      data: { deletedAt: new Date() }, // Set deletedAt to the current date/time
    });

    // Return a success message for soft deletion
    // Returning 200 with body is clearer for soft delete than 204
    res
      .status(200)
      .json({ message: "Subcategory soft deleted successfully", subcategory });
  } catch (error) {
    console.error("Error soft-deleting subcategory:", error);
    // Handle case where the subcategory is not found or already soft-deleted (P2025)
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ error: "Subcategory not found or already deleted" });
    }
    // Handle custom delete constraint errors (if implemented)
    if (error.message.includes("Cannot delete subcategory")) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message || "Internal Server Error" }); // More specific message
  }
};

module.exports = {
  getAllSubCategories, // Added deletedAt: null filter
  addNewSubCategory, // Added validation and error handling
  singleSubCategory, // Added deletedAt: null filter, 404 logic, and validation
  updateSubCategory, // Added deletedAt handling, validation, and error handling
  deleteSubCategory, // Changed to soft delete, added validation and error handling (including P2025 for deleted items)
};
