// Assume User model includes:
// model User {
//   id                 Int       @id @default(autoincrement())
//   name               String
//   email              String    @unique // Assuming unique email
//   password           String // Remember to hash passwords!
//   roleId             Int
//   role               Role      @relation(fields: [roleId], references: [id])
//   dealerId           Int? // Assuming relation to Dealer
//   dealer             Dealer?   @relation(fields: [dealerId], references: [id])
//   passwordResetToken String?   @unique
//   passwordResetExpires DateTime?
//   createdAt          DateTime  @default(now())
//   updatedAt          DateTime  @updatedAt
//   deletedAt          DateTime? // NULL means not deleted
//   refreshToken       RefreshToken[]
//   Order              Order[]
//   Activation         Activation[]
//   Notification       Notification[]
//   OrderStatusHistory OrderStatusHistory[]
// }


const prisma = require("../config/db");

const adminControllers = {
  // Get all users (excluding soft-deleted)
  getAllUsers: async (req, res) => {
    try {
      const user = req.user;
      // Find all users where deletedAt is null
      const adminUsers = await prisma.user.findMany({
        where: { deletedAt: null, role: { name: { notIn: ['SuperAdmin'] } } }, // Add this condition
        include: {
          role: { select: { name: true } }, // Include role name
          dealer: { // Include dealer details
            select: {
              id: true,
              companyName: true,
            },
          },

        },
        orderBy: { id: "asc" }, // Keep original ordering
      });

      const managerUsers = await prisma.user.findMany({
        where: { deletedAt: null, role: { name: { notIn: ['SuperAdmin', 'admin'] } } }, // Add this condition
        include: {
          role: { select: { name: true } }, // Include role name
          dealer: { // Include dealer details
            select: {
              id: true,
              companyName: true,
            },
          },

        },
        orderBy: { id: "asc" }, // Keep original ordering
      });

      const allUsers = await prisma.user.findMany({
        include: {
          role: { select: { name: true } }, // Include role name
          dealer: { // Include dealer details
            select: {
              id: true,
              companyName: true,
            },
          },

        },
        orderBy: { id: "asc" }, // Keep original ordering
      });

      res.status(200).json(user.role.name === 'SuperAdmin' ? allUsers : user.role.name === 'admin' ? adminUsers : managerUsers); // Use status 200
    } catch (error) {
      console.error("Error fetching all users:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  },

  // Get a single user by ID (excluding soft-deleted)
  getUserById: async (req, res) => {
    try {
      const userId = parseInt(req.params.id);

      // Validate ID
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID provided." });
      }

      // Find user by ID, but only if not deleted
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
          deletedAt: null, // Add this condition
        },
        include: {
          role: true, // Include role
          dealer: true, // Include dealer
          // Include other relations needed for admin view (Orders, Activations, etc.)
          // Consider filtering related records by their deletedAt if applicable
          // Order: { where: { deletedAt: null }, orderBy: { createdAt: 'desc' } },
          // Activation: { where: { deletedAt: null }, orderBy: { createdAt: 'desc' } },
          // Notification: { where: { deletedAt: null }, orderBy: { createdAt: 'desc' } },
          // OrderStatusHistory: { orderBy: { changedAt: 'asc' } }, // History usually not deleted
        },
      });

      if (!user) {
        // If user not found or found but deleted
        return res.status(404).json({ error: "User not found or is deleted." }); // 404 Not Found
      }

      res.status(200).json(user); // Use status 200
    } catch (error) {
      console.error("Error getting user by ID:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  },

  // Update user details (allows undeleting)
  updateUser: async (req, res) => {
    try {
      const userId = parseInt(req.params.id);

      // Validate ID
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID provided." });
      }

      // Extract fields from body, including potentially deletedAt
      const { name, roleId, dealerId, deletedAt } = req.body; // Include other fields if update should be generic

      // Build update data object, filtering undefined fields
      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (roleId !== undefined) {
        const roleIdNum = Number(roleId);
        if (isNaN(roleIdNum)) return res.status(400).json({ error: "Invalid roleId provided." });
        updateData.roleId = roleIdNum;
      }
      if (dealerId !== undefined) {
        const dealerIdNum = Number(dealerId);
        // Allow null for dealerId, but validate if not null
        if (!isNaN(dealerIdNum)) updateData.dealerId = dealerIdNum;
        else if (dealerId === null) updateData.dealerId = null;
        else return res.status(400).json({ error: "Invalid dealerId provided." });
      }
      // Include other fields from body if needed for a generic update
      // Object.assign(updateData, otherData); // Be cautious with unexpected fields

      // Handle the deletedAt field for potential undelete
      if (deletedAt !== undefined) {
        updateData.deletedAt = deletedAt === null ? null : new Date(deletedAt);
      }

      // Update the user record
      // Do NOT filter by deletedAt: null in where, so you can update/undelete deleted users
      const user = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        // Include updated role/dealer in response
        include: { role: true, dealer: true }
      });

      // Respond with the updated user
      res.status(200).json(user); // Use status 200

    } catch (error) {
      console.error("Error updating user:", error);
      // Handle case where ID is not found
      if (error.code === 'P2025') {
        return res.status(404).json({ error: "User not found." });
      }
      // Handle foreign key constraint violation (P2003) for roleId or dealerId
      if (error.code === 'P2003') {
        return res.status(400).json({ error: "Invalid role ID or dealer ID provided." });
      }
      // Handle unique constraint violation (P2002) if email is updated and conflicts
      if (error.code === 'P2002') {
        const target = error.meta?.target?.join(', ') || 'a unique field';
        return res.status(409).json({ error: `User with the provided ${target} already exists.` });
      }
      res.status(500).json({ error: error.message || "An error occurred while updating the user." });
    }
  },

  // Soft delete a user
  deleteUser: async (req, res) => {
    try {
      const userId = parseInt(req.params.id);

      // Validate ID
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID provided." });
      }

      // Perform soft deletion by updating the deletedAt field
      // Include deletedAt: null in where to ensure it fails if already deleted
      const user = await prisma.user.update({
        where: {
          id: userId,
          deletedAt: null, // Ensure it's not already deleted
          // Optional Business Logic: Prevent deletion if related entities exist (e.g., active orders)
          // If you need to check, add a nested where clause here or perform a separate count before update.
          // E.g., Order: { some: { deletedAt: null, status: { notIn: ['cancelled', 'delivered'] } } } // Prevent if active orders exist
        },
        data: {
          deletedAt: new Date(), // Set deletedAt to the current date/time
          // Optional: Clear sensitive fields on soft deletion (e.g., password reset token)
          passwordResetToken: null,
          passwordResetExpires: null,
          // Consider soft-deleting related entities like refresh tokens, carts, etc. in a transaction here.
          // Soft deleting a user doesn't automatically soft-delete related records unless configured with cascade (hard delete).
        },
        select: { id: true, email: true, deletedAt: true } // Select info for response
      });

      // Return a success message for soft deletion
      res.status(200).json({ message: "User soft deleted successfully", user: user }); // 200 with body is clearer for soft delete

    } catch (error) {
      console.error("Error soft-deleting user:", error);
      // Handle case where the user is not found or already soft-deleted (P2025)
      if (error.code === 'P2025') {
        return res.status(404).json({ error: "User not found or already deleted." });
      }
      // Handle custom delete constraint errors if implemented
      if (error.message.includes('Cannot delete user')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message || "Internal Server Error" });
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
      const user = await prisma.user.update({
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


}; // End of adminControllers object

module.exports = adminControllers;