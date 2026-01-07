// Assume Admin model includes:
// model Admin {
//   id          Int       @id @default(autoincrement())
//   name        String
//   roleId      Int
//   role        Role      @relation(fields: [roleId], references: [id])
//   email       String    @unique
//   password    String // Consider hashing passwords!
//   createdAt   DateTime  @default(now())
//   updatedAt   DateTime  @updatedAt
//   deletedAt   DateTime? // NULL means not deleted
// }

const prisma = require("../../config/db");

const adminControllers = {
  // Get all admins (excluding soft-deleted)
  getAllAdmins: async (req, res) => {
    try {
      // Only find admins where deletedAt is null
      const admins = await prisma.admin.findMany({
        where: { deletedAt: null }, // Add this condition
        include: { role: { select: { name: true } } },
        orderBy: { id: "asc" }, // Keep original ordering
      });
      res.status(200).json(admins); // Use status 200
    } catch (error) {
      console.error("Error getting all admins:", error); // Log the error
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  },

  // Add a new admin
  addNewAdmin: async (req, res) => {
    try {
      const { name, roleId, email, password } = req.body;

      // Basic validation
      if (!name || roleId === undefined || !email || !password) {
        return res
          .status(400)
          .json({
            error: "Missing required fields (name, roleId, email, password)",
          });
      }

      const admin = await prisma.admin.create({
        data: {
          name,
          roleId: Number(roleId), // Ensure roleId is a number
          email,
          password, // Remember to hash this in a real application!
          // deletedAt is null by default
        },
      });
      res.status(201).json(admin); // Use status 201 for resource creation
    } catch (error) {
      console.error("Error adding new admin:", error); // Log the error
      // Handle potential unique constraint violation for email
      if (error.code === "P2002") {
        return res
          .status(409)
          .json({
            error: `An admin with the email "${req.body.email}" already exists.`,
          });
      }
      // Handle foreign key constraint violation if roleId doesn't exist
      if (error.code === "P2003") {
        return res.status(400).json({ error: "Invalid roleId provided" });
      }
      res.status(500).json({ error: error.message || "Internal Server Error" }); // Changed from 500 (original)
    }
  },

  // Get admin by ID (excluding soft-deleted)
  getAdminById: async (req, res) => {
    try {
      const { id } = req.params;
      const adminId = parseInt(id);

      if (isNaN(adminId)) {
        return res.status(400).json({ error: "Invalid admin ID provided" });
      }

      // Find unique admin, but only if deletedAt is null
      const admin = await prisma.admin.findUnique({
        where: {
          id: adminId,
          deletedAt: null, // Add this condition
        },
        include: { role: { select: { name: true } } }, // Keep include
      });

      if (!admin) {
        // Return 404 if not found or if it exists but is soft-deleted
        return res.status(404).json({ error: "Admin not found or is deleted" });
      }

      res.status(200).json(admin); // Use status 200
    } catch (error) {
      console.error("Error getting admin by ID:", error); // Log the error
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  },

  // Update an admin
  updateAdmin: async (req, res) => {
    try {
      const { id } = req.params;
      const adminId = parseInt(id);

      if (isNaN(adminId)) {
        return res.status(400).json({ error: "Invalid admin ID provided" });
      }

      // Extract deletedAt separately to handle undeleting
      const { deletedAt, name, roleId, email, password } = req.body;

      // Build data object, filtering undefined/null fields from body
      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (roleId !== undefined) {
        updateData.roleId = Number(roleId); // Ensure number
        if (isNaN(updateData.roleId)) {
          return res
            .status(400)
            .json({ error: "Invalid roleId provided in update data" });
        }
      }
      if (email !== undefined) updateData.email = email;
      if (password !== undefined) updateData.password = password; // Remember to hash this!

      // Handle the deletedAt field for potential undelete
      if (deletedAt !== undefined) {
        updateData.deletedAt = deletedAt === null ? null : new Date(deletedAt);
      }

      const admin = await prisma.admin.update({
        where: { id: adminId }, // Update by ID regardless of deleted status
        data: updateData, // Use the constructed updateData
      });

      res.status(200).json(admin); // Use status 200
    } catch (error) {
      console.error("Error updating admin:", error); // Log the error
      // Handle case where ID is not found
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Admin not found" });
      }
      // Handle unique constraint violation on update (e.g., email)
      if (error.code === "P2002") {
        const target = error.meta?.target?.join(", ") || "a unique field";
        return res
          .status(409)
          .json({
            error: `An admin with the provided ${target} already exists.`,
          });
      }
      // Handle foreign key constraint violation if roleId is updated to an invalid ID
      if (error.code === "P2003") {
        return res
          .status(400)
          .json({ error: "Invalid roleId provided for update" });
      }
      res.status(500).json({ error: error.message || "Internal Server Error" }); // Changed from 400 (original)
    }
  },

  // Delete an admin (soft delete)
  deleteAdmin: async (req, res) => {
    try {
      const { id } = req.params;
      const adminId = parseInt(id);

      if (isNaN(adminId)) {
        return res.status(400).json({ error: "Invalid admin ID provided" });
      }

      // Perform soft deletion by updating the deletedAt field
      // Include deletedAt: null in where to ensure it fails if already deleted
      const admin = await prisma.admin.update({
        where: {
          id: adminId,
          deletedAt: null, // Ensure it's not already deleted
        },
        data: { deletedAt: new Date() }, // Set deletedAt to the current date/time
      });

      // Return a success message for soft deletion
      res
        .status(200)
        .json({ message: "Admin soft deleted successfully", admin }); // 200 with body is clearer for soft delete
    } catch (error) {
      console.error("Error soft-deleting admin:", error); // Log the error
      // Handle case where the admin is not found or already soft-deleted
      if (error.code === "P2025") {
        return res
          .status(404)
          .json({ error: "Admin not found or already deleted" });
      }
      res.status(500).json({ error: error.message || "Internal Server Error" }); // Changed from 400 (original)
    }
  },
  // New function: Undelete a user (Admin action)
  undeleteUser: async (req, res) => {
    try {
      const userId = parseInt(req.params.id); // Get user ID from params

      // Validate ID
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID provided." });
      }

      // Perform undeletion by setting deletedAt to null
      // Include deletedAt: { not: null } in where to ensure it fails if not deleted
      const user = await prisma.admin.update({
        where: {
          id: userId,
          deletedAt: { not: null }, // Only update if it is currently deleted
        },
        data: {
          deletedAt: null, // Set deletedAt to null
          // Optional: Restore other fields if they were cleared on deletion (e.g., password field if it was set to a placeholder)
        },
        select: { id: true, email: true, deletedAt: true } // Select info for response
      });

      // Optional: Also undelete related entities if they were soft-deleted when the user was deleted.
      // This might require finding the user first (without the deletedAt filter)
      // to check their related entities, then performing batched updates in a transaction.
      // Example (concept):
      // await prisma.$transaction(async (tx) => {
      //    await tx.user.update({ ... }); // The user undelete update
      //    await tx.order.updateMany({ where: { userId: userId, deletedAt: { not: null } }, data: { deletedAt: null } });
      //    await tx.cart.updateMany({ where: { userId: userId, deletedAt: { not: null } }, data: { deletedAt: null } });
      //    ... etc for other relations
      // });


      // Return a success message for undeletion
      res.status(200).json({ message: "User undeleted successfully", user: user }); // 200 with body

    } catch (error) {
      console.error("Error undeleting user:", error);
      // Handle case where the user is not found or is not deleted (P2025)
      if (error.code === 'P2025') {
        return res.status(404).json({ message: "User not found or is not deleted." });
      }
      res.status(500).json({ message: error.message || "Internal Server Error" });
    }
  }
};

module.exports = adminControllers;
