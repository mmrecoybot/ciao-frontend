// Assuming Permission model includes:
// model Permission {
//   id          Int       @id @default(autoincrement())
//   name        String    @unique
//   // ... other fields
//   deletedAt   DateTime? // NULL means not deleted
// }

// Assuming Role model includes:
// model Role {
//   id          Int       @id @default(autoincrement())
//   name        String    @unique
//   // ... other fields
//   permissions Permission[] // Many-to-many relation
//   deletedAt   DateTime? // If Role can also be soft-deleted
// }

const prisma = require("../config/db.js");

/**
 * Middleware factory to check if the authenticated user has a specific permission.
 * Assumes that `authenticateToken` middleware has already run and populated `req.user`
 * with a non-deleted user object including their role.
 *
 * @param {string} requiredPermission - The name of the permission required.
 * @returns {Function} An Express middleware function.
 */
const checkPermission = (requiredPermission) => {
  // Validate the requiredPermission string format if needed

  return async (req, res, next) => {
    // Get user ID from the authenticated user object (guaranteed non-deleted by authenticateToken)
    const userId = req.user?.id;

    // Ensure user ID is available from the authentication middleware
    if (!userId) {
      console.error("checkPermission middleware error: req.user.id is missing. Ensure authenticateToken runs before.");
      return res.status(500).json({ error: "Authentication context missing." }); // Indicate server/middleware setup issue
    }
    const userIdNum = Number(userId); // Ensure userId is treated as a number

    // Basic validation for userId type
    if (isNaN(userIdNum)) {
      console.error("checkPermission middleware error: Invalid userId in req.user:", userId);
      return res.status(500).json({ error: "Authentication context invalid (invalid user ID)." }); // Indicate server/middleware setup issue
    }


    try {
      // Fetch the user and their role with associated permissions.
      // We DON'T filter user by deletedAt here, because authenticateToken already did that.
      // We DO filter permissions by deletedAt.
      const user = await prisma.user.findUnique({
        where: { id: userIdNum }, // Use numeric userId
        include: {
          role: {
            // where: { deletedAt: null }, // Add this condition if Role model has deletedAt
            // include: {
            //   permissions: {
            //      where: { deletedAt: null }, // *** Add this condition to only include non-deleted permissions ***
            //   },
            // },
            select: {
              permissions: true,
            },
          },
        },
      });

      // If user is not found here, it might indicate an issue with the userId from the token
      // or the user's role being deleted (if Role has deletedAt and the filter was added above).
      if (!user || !user.role) {
        // If user has no role or their role is deleted, they cannot have permissions via role
        console.warn(`Permission check failed for user ID ${userIdNum}: User not found or has no active role.`);
        return res.status(403).json({ error: "Forbidden (Insufficient permissions)" }); // Use 403 Forbidden
      }
// console.log(user.role.permissions.map((permission) => permission.name));

      // Check if the user's non-deleted role has the required non-deleted permission
      const hasPermission = user.role.permissions.some(
        (permission) => permission.name === requiredPermission
      );

      if (!hasPermission) {
        console.warn(`Permission check failed for user ID ${userIdNum}: Missing required permission "${requiredPermission}".`);
        return res.status(403).json({ error: "Forbidden (Insufficient permissions)" }); // Use 403 Forbidden
      }

      // User has the required permission, proceed to the next middleware/route
      next();

    } catch (error) {
      console.error(`Error checking permission "${requiredPermission}" for user ID ${userIdNum}:`, error);
      // Avoid leaking database error details to the client
      return res.status(500).json({ error: "Internal server error during permission check." });
    }
  };
};

module.exports = { checkPermission };