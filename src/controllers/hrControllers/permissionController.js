// Assume Permission model includes:
// model Permission {
//   id          Int       @id @default(autoincrement())
//   name        String    @unique // Assuming name is unique
//   description String?
//   createdAt   DateTime  @default(now())
//   updatedAt   DateTime  @updatedAt
//   deletedAt   DateTime? // NULL means not deleted
//   roles       Role[]    // Many-to-many relationship with Role
// }

// Assume Role model has a relation back to Permission:
// model Role {
//   id          Int       @id @default(autoincrement())
//   name        String    @unique
//   // ... other role fields
//   permissions Permission[] // Many-to-many relationship with Permission
// }

const prisma = require("../../config/db");

const assignPermission = async (req, res) => {
  try {
    const { roleId } = req.params;
    const roleIdNum = parseInt(roleId);

    if (isNaN(roleIdNum)) {
      return res.status(400).json({ error: "Invalid role ID provided" });
    }

    const { permissionIds } = req.body; // Array of permission IDs to be assigned

    // Validate permissionIds input
    if (!Array.isArray(permissionIds)) {
      return res.status(400).json({ error: "permissionIds must be an array" });
    }
    // Ensure all permissionIds are numbers
    const validPermissionIds = permissionIds
      .map((id) => Number(id))
      .filter((id) => !isNaN(id));
    if (validPermissionIds.length !== permissionIds.length) {
      return res
        .status(400)
        .json({ error: "Invalid permission ID(s) in the array" });
    }

    // Fetch the role, ensuring it's not deleted (if Role also has deletedAt)
    // and include only non-deleted permissions currently assigned
    const role = await prisma.role.findUnique({
      where: {
        id: roleIdNum,
        // If Role model also has deletedAt, add it here:
        // deletedAt: null
      },
      include: {
        permissions: {
          where: { deletedAt: null }, // Only include non-deleted permissions currently assigned
          select: { id: true }, // Only need the IDs for comparison
        },
      },
    });

    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    // Verify that all requested permissionIds exist and are not deleted
    const requestedPermissions = await prisma.permission.findMany({
      where: {
        id: { in: validPermissionIds },
        deletedAt: null, // Ensure the requested permissions are not deleted
      },
      select: { id: true },
    });

    if (requestedPermissions.length !== validPermissionIds.length) {
      // This means one or more requested permission IDs are invalid or deleted
      const foundIds = requestedPermissions.map((p) => p.id);
      const invalidIds = validPermissionIds.filter(
        (id) => !foundIds.includes(id)
      );
      return res.status(400).json({
        error: `One or more permission IDs are invalid or deleted: ${invalidIds.join(
          ", "
        )}`,
      });
    }

    // Determine which permissions should be removed (those currently assigned & non-deleted, but not in the new list)
    const currentNonDeletedPermissionIds = role.permissions.map(
      (perm) => perm.id
    );
    const permissionsToDisconnect = currentNonDeletedPermissionIds.filter(
      (id) => !validPermissionIds.includes(id)
    );

    // Determine which permissions should be added (those in the new list, but not currently assigned & non-deleted)
    const permissionsToConnect = validPermissionIds.filter(
      (id) => !currentNonDeletedPermissionIds.includes(id)
    );

    // 1. Disconnect permissions that are not in the new permission list
    if (permissionsToDisconnect.length > 0) {
      await prisma.role.update({
        where: { id: roleIdNum },
        data: {
          permissions: {
            disconnect: permissionsToDisconnect.map((id) => ({ id })),
          },
        },
      });
    }

    // 2. Connect new permissions
    if (permissionsToConnect.length > 0) {
      await prisma.role.update({
        where: { id: roleIdNum },
        data: {
          permissions: {
            connect: permissionsToConnect.map((id) => ({ id })),
          },
        },
      });
    }

    // Fetch the updated role with only its non-deleted permissions
    const updatedRole = await prisma.role.findUnique({
      where: {
        id: roleIdNum,
        // If Role model also has deletedAt, add it here:
        // deletedAt: null
      },
      include: {
        permissions: {
          where: { deletedAt: null }, // Only include non-deleted permissions in the response
        },
      },
    });

    res.status(200).json(updatedRole);
  } catch (error) {
    console.error("Error assigning permissions:", error);
    // Handle foreign key constraint violation if a connected permission ID or the role ID is invalid (less likely after checks, but good fallback)
    if (error.code === "P2003") {
      return res
        .status(400)
        .json({ error: "Referenced role or permission not found" });
    }
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

const removePermission = async (req, res) => {
  try {
    const { roleId, permissionId } = req.params;
    const roleIdNum = parseInt(roleId);
    const permissionIdNum = parseInt(permissionId);

    if (isNaN(roleIdNum) || isNaN(permissionIdNum)) {
      return res
        .status(400)
        .json({ error: "Invalid role ID or permission ID provided" });
    }

    // Disconnect the specific permission from the role
    // Adding deletedAt: null to the role's where clause means
    // you can only remove permissions from non-deleted roles.
    const role = await prisma.role.update({
      where: {
        id: roleIdNum,
        // If Role model also has deletedAt, add it here:
        // deletedAt: null
      },
      data: {
        permissions: {
          disconnect: { id: permissionIdNum },
        },
      },
      // Optional: Include permissions in the response if needed
      // include: { permissions: { where: { deletedAt: null } } }
    });

    // Note: Prisma's disconnect doesn't throw P2025 if the *relationship* doesn't exist,
    // only if the parent record (role) doesn't exist. You might want to verify the
    // relationship exists before attempting to disconnect if stricter error handling is needed.

    res.status(200).json(role); // Returning the updated role might be useful
  } catch (error) {
    console.error("Error removing permission:", error);
    // Handle case where role ID is not found (P2025 on update where clause)
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Role not found" });
    }
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

// --- Permissions Controller Functions (Soft Delete) ---

// Add a new permission
const addNewPermission = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Basic validation for name
    if (!name) {
      return res.status(400).json({ error: "Name is required for permission" });
    }

    const permission = await prisma.permission.create({
      data: {
        name,
        description,
        // deletedAt is null by default
      },
    });
    res.status(201).json(permission); // Use 201 for resource creation
  } catch (error) {
    console.error("Error creating permission:", error);
    // Handle unique constraint violation for name
    if (error.code === "P2002") {
      return res.status(409).json({
        error: `A permission with the name "${req.body.name}" already exists.`,
      });
    }
    res.status(500).json({ error: error.message || "Internal Server Error" }); // More specific message
  }
};

// Get all permissions (excluding soft-deleted)
const getAllPermissions = async (req, res) => {
  try {
    // Find all permissions where deletedAt is null
    const permissions = await prisma.permission.findMany({
      where: { deletedAt: null }, // Add this condition
      orderBy: { name: "asc" }, // Optional: Add sorting
    });
    res.status(200).json(permissions); // Use 200 for success
  } catch (error) {
    console.error("Error fetching permissions:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" }); // More specific message
  }
};

// Get a single permission (excluding soft-deleted)
const singlePermission = async (req, res) => {
  const { id } = req.params;
  const permissionId = parseInt(id);

  if (isNaN(permissionId)) {
    return res.status(400).json({ error: "Invalid permission ID provided" });
  }

  try {
    // Find unique permission, but only if deletedAt is null
    const permission = await prisma.permission.findUnique({
      where: {
        id: permissionId,
        deletedAt: null, // Add this condition
      },
    });

    if (!permission) {
      // Return 404 if not found or if it exists but is soft-deleted
      return res
        .status(404)
        .json({ message: "Permission not found or is deleted" });
    }
    res.status(200).json(permission); // Use 200 for success
  } catch (error) {
    console.error("Error fetching permission:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" }); // More specific message
  }
};

// Update a permission
const updatePermission = async (req, res) => {
  const { id } = req.params;
  const permissionId = parseInt(id);

  if (isNaN(permissionId)) {
    return res.status(400).json({ error: "Invalid permission ID provided" });
  }

  const { name, description, deletedAt } = req.body;

  // Build data object, filtering undefined fields from body
  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;

  // Handle the deletedAt field for potential undelete
  if (deletedAt !== undefined) {
    updateData.deletedAt = deletedAt === null ? null : new Date(deletedAt);
  }

  try {
    const permission = await prisma.permission.update({
      where: { id: permissionId }, // Update by ID regardless of deleted status
      data: updateData, // Use the constructed updateData
    });
    res.status(200).json(permission); // Use 200 for success
  } catch (error) {
    console.error("Error updating permission:", error);
    // Handle case where ID is not found
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Permission not found" });
    }
    // Handle unique constraint violation on update (e.g., name)
    if (error.code === "P2002") {
      const target = error.meta?.target?.join(", ") || "a unique field";
      return res.status(409).json({
        error: `A permission with the provided ${target} already exists.`,
      });
    }
    res.status(500).json({ error: error.message || "Internal Server Error" }); // More specific message
  }
};

// Delete a permission (soft delete)
const deletePermission = async (req, res) => {
  const { id } = req.params;
  const permissionId = parseInt(id);

  if (isNaN(permissionId)) {
    return res.status(400).json({ error: "Invalid permission ID provided" });
  }

  try {
    // Perform soft deletion by updating the deletedAt field
    // Include deletedAt: null in where to ensure it fails if already deleted
    const permission = await prisma.permission.update({
      where: {
        id: permissionId,
        deletedAt: null, // Ensure it's not already deleted
      },
      data: { deletedAt: new Date() }, // Set deletedAt to the current date/time
    });

    // Return a success message for soft deletion
    res
      .status(200)
      .json({ message: "Permission soft deleted successfully", permission }); // 200 with body is clearer for soft delete
  } catch (error) {
    console.error("Error soft-deleting permission:", error);
    // Handle case where the permission is not found or already soft-deleted
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ error: "Permission not found or already deleted" });
    }
    res.status(500).json({ error: error.message || "Internal Server Error" }); // More specific message
  }
};
const getPermissionsByUserId = async (req, res) => {
  const { userId } = req.params;
  const userIdNum = parseInt(userId);

  if (isNaN(userIdNum)) {
    return res.status(400).json({ error: "Invalid user ID provided" });
  }

  // Authorization: Allow self-access, otherwise require "user_permissions"
  // req.user is populated by authenticateToken middleware
  if (req.user.id !== userIdNum) {
    try {
      const requestingUser = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: {
          role: {
            include: {
              permissions: {
                where: { deletedAt: null },
              },
            },
          },
        },
      });

      const hasPermission = requestingUser?.role?.permissions.some(
        (p) => p.name === "user_permissions"
      );

      if (!hasPermission) {
        return res
          .status(403)
          .json({ error: "Forbidden: Missing required permission" });
      }
    } catch (authError) {
      console.error("Authorization check failed:", authError);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  try {
    // Find unique permission, but only if deletedAt is null
    const permission = await prisma.user.findUnique({
      where: {
        id: userIdNum,
        deletedAt: null, // Add this condition
      },
      include: {
        role: {
          include: {
            permissions: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!permission) {
      // Return 404 if not found or if it exists but is soft-deleted
      return res.status(404).json({ message: "User not found or is deleted" });
    }
    res.status(200).json(permission.role.permissions); // Use 200 for success
  } catch (error) {
    console.error("Error fetching permissions by user ID:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" }); // More specific message
  }
};

const permissionControllers = {
  assignPermission,
  removePermission,
  addNewPermission,
  getAllPermissions,
  singlePermission,
  updatePermission,
  deletePermission,
  getPermissionsByUserId,
};

module.exports = permissionControllers;
