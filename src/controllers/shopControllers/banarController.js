// model Banner {
//     id          Int      @id @default(autoincrement())
//     title       String
//     image       String
//     createdAt   DateTime @default(now())
//     updatedAt   DateTime @updatedAt @default(now())
//     deletedAt   DateTime? // NULL means not deleted
//   }
const prisma = require("../../config/db");

const getAllBanners = async (req, res) => {
  try {
    // Find all banners where deletedAt is null
    const banners = await prisma.banner.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" }, // Optional: Add ordering
    });
    return res.status(200).json(banners); // Use status 200 for success
  } catch (error) {
    console.error("Error fetching all banners:", error); // Log the error
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" }); // Provide a generic error message
  }
};

const getBannerById = async (req, res) => {
  try {
    const bannerId = parseInt(req.params.id);

    if (isNaN(bannerId)) {
      return res.status(400).json({ message: "Invalid banner ID provided" });
    }

    // Find unique banner, but only if deletedAt is null
    const banner = await prisma.banner.findUnique({
      where: {
        id: bannerId,
        deletedAt: null, // Add this condition
      },
    });

    if (!banner) {
      // Return 404 if not found or if it exists but is soft-deleted
      return res
        .status(404)
        .json({ message: "Banner not found or is deleted" });
    }

    return res.status(200).json(banner); // Use status 200 for success
  } catch (error) {
    console.error("Error fetching banner by ID:", error); // Log the error
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

const addNewBanner = async (req, res) => {
  try {
    const { title, image } = req.body;

    // Basic validation
    if (!title || !image) {
      return res
        .status(400)
        .json({ message: "Missing required fields (title, image)" });
    }

    const banner = await prisma.banner.create({
      data: {
        title,
        image,
        // deletedAt is null by default
      },
    });
    return res.status(201).json(banner); // Use status 201 for resource creation
  } catch (error) {
    console.error("Error adding new banner:", error); // Log the error
    // Handle potential unique constraint violation on title or image if applicable
    if (error.code === "P2002") {
      const target = error.meta?.target?.join(", ") || "a unique field";
      return res
        .status(409)
        .json({
          error: `A banner with the provided ${target} already exists.`,
        });
    }
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const bannerId = parseInt(id);

    if (isNaN(bannerId)) {
      return res.status(400).json({ message: "Invalid banner ID provided" });
    }

    // Extract data, allowing deletedAt to be potentially set (e.g., to null for undelete)
    const { title, image, deletedAt } = req.body;

    // Build data object, filtering undefined fields from body
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (image !== undefined) updateData.image = image;

    // Handle the deletedAt field for potential undelete
    if (deletedAt !== undefined) {
      updateData.deletedAt = deletedAt === null ? null : new Date(deletedAt);
    }

    const banner = await prisma.banner.update({
      where: { id: bannerId }, // Update by ID regardless of deleted status
      data: updateData, // Use the constructed updateData
    });

    return res.status(200).json(banner); // Use status 200 for success
  } catch (error) {
    console.error("Error updating banner:", error); // Log the error
    // Handle case where ID is not found
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Banner not found" });
    }
    // Handle unique constraint violation on update
    if (error.code === "P2002") {
      const target = error.meta?.target?.join(", ") || "a unique field";
      return res
        .status(409)
        .json({
          error: `A banner with the provided ${target} already exists.`,
        });
    }
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const bannerId = parseInt(id);

    if (isNaN(bannerId)) {
      return res.status(400).json({ message: "Invalid banner ID provided" });
    }

    // Perform soft deletion by updating the deletedAt field
    // Include deletedAt: null in where to ensure it fails if already deleted
    const banner = await prisma.banner.update({
      where: {
        id: bannerId,
        deletedAt: null, // Ensure it's not already deleted
      },
      data: { deletedAt: new Date() }, // Set deletedAt to the current date/time
    });

    // Return a success message for soft deletion
    return res
      .status(200)
      .json({ message: "Banner soft deleted successfully", banner }); // 200 with body is clearer for soft delete
  } catch (error) {
    console.error("Error soft-deleting banner:", error); // Log the error
    // Handle case where the banner is not found or already soft-deleted
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ message: "Banner not found or already deleted" });
    }
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};
module.exports = {
  getAllBanners,
  getBannerById,
  addNewBanner,
  updateBanner,
  deleteBanner,
};
