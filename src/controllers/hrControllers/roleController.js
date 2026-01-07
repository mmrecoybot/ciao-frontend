// Assume Role model includes:
// model Role {
//   id          Int       @id @default(autoincrement())
//   name        String    @unique // Assuming name is unique
//   description String?
//   createdAt   DateTime  @default(now())
//   updatedAt   DateTime  @updatedAt
//   deletedAt   DateTime? // NULL means not deleted
//   permissions Permission[] // Many-to-many relationship with Permission
//   admins      Admin[] // Assuming relationship back to Admin model
// }

const prisma = require("../../config/db");

// Add new role
const addNewRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Basic validation for name
    if (!name) {
      return res.status(400).json({ error: "Name is required for role" });
    }

    const role = await prisma.role.create({
      data: {
        name,
        description,
        // deletedAt is null by default
      },
    });
    res.status(201).json(role); // Use 201 for resource creation
  } catch (error) {
    console.error("Error creating role:", error);
    // Handle unique constraint violation for name
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({
          error: `A role with the name "${req.body.name}" already exists.`,
        });
    }
    res.status(500).json({ error: error.message || "Internal Server Error" }); // More specific message
  }
};

// Get all roles (excluding soft-deleted roles and their soft-deleted permissions)
const getAllRoles = async (req, res) => {
  const user = req.user;
  try {
    // Find all roles where deletedAt is null
    const roles = await prisma.role.findMany({
      where: { deletedAt: null }, // Add this condition
      include: {
        permissions: {
          where: { deletedAt: null }, // Only include non-deleted permissions
        },
        // Include admins if needed, filtering by deletedAt if Admin model has it
        // admins: { where: { deletedAt: null } }
      },
      orderBy: { id: "asc" }, // Keep original ordering
    });

    const adminRoles = ['admin', 'user']
    const manegerRoles = ['manager', 'user']
    const filteredRoles = roles.filter(role => adminRoles.includes(role.name))
    const filteredManegerRoles = roles.filter(role => manegerRoles.includes(role.name))
    res.status(200).json(user.role.name === 'SuperAdmin' ? roles : user.role.name === 'admin' ? filteredRoles : filteredManegerRoles); // Use 200 for success
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" }); // More specific message
  }
};

// Get a single role (excluding soft-deleted role and its soft-deleted permissions)
const singleRole = async (req, res) => {
  const { id } = req.params;
  const roleId = parseInt(id);

  if (isNaN(roleId)) {
    return res.status(400).json({ error: "Invalid role ID provided" });
  }

  try {
    // Find unique role, but only if deletedAt is null
    const role = await prisma.role.findUnique({
      where: {
        id: roleId,
        deletedAt: null, // Add this condition
      },
      include: {
        permissions: {
          where: { deletedAt: null }, // Only include non-deleted permissions
        },
        // Include admins if needed, filtering by deletedAt if Admin model has it
        // admins: { where: { deletedAt: null } }
      },
    });

    if (!role) {
      // Return 404 if not found or if it exists but is soft-deleted
      return res.status(404).json({ message: "Role not found or is deleted" });
    }
    res.status(200).json(role); // Use 200 for success
  } catch (error) {
    console.error("Error fetching role:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" }); // More specific message
  }
};

// Update role
const updateRole = async (req, res) => {
  const { id } = req.params;
  const roleId = parseInt(id);

  if (isNaN(roleId)) {
    return res.status(400).json({ error: "Invalid role ID provided" });
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
    const role = await prisma.role.update({
      where: { id: roleId }, // Update by ID regardless of deleted status
      data: updateData, // Use the constructed updateData
    });
    res.status(200).json(role); // Use 200 for success
  } catch (error) {
    console.error("Error updating role:", error);
    // Handle case where ID is not found
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Role not found" });
    }
    // Handle unique constraint violation on update (e.g., name)
    if (error.code === "P2002") {
      const target = error.meta?.target?.join(", ") || "a unique field";
      return res
        .status(409)
        .json({ error: `A role with the provided ${target} already exists.` });
    }
    res.status(500).json({ error: error.message || "Internal Server Error" }); // More specific message
  }
};

// Delete a role (soft delete)
const deleteRole = async (req, res) => {
  const { id } = req.params;
  const roleId = parseInt(id);

  if (isNaN(roleId)) {
    return res.status(400).json({ error: "Invalid role ID provided" });
  }

  try {
    // Perform soft deletion by updating the deletedAt field
    // Include deletedAt: null in where to ensure it fails if already deleted
    const role = await prisma.role.update({
      where: {
        id: roleId,
        deletedAt: null, // Ensure it's not already deleted
      },
      data: { deletedAt: new Date() }, // Set deletedAt to the current date/time
    });

    // Return a success message for soft deletion
    res.status(200).json({ message: "Role soft deleted successfully", role }); // 200 with body is clearer for soft delete
  } catch (error) {
    console.error("Error soft-deleting role:", error);
    // Handle case where the role is not found or already soft-deleted
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ error: "Role not found or already deleted" });
    }
    res.status(500).json({ error: error.message || "Internal Server Error" }); // More specific message
  }
};
const roleController = {
  addNewRole, // Added validation and error handling
  getAllRoles, // Added deletedAt: null filter for role and permissions
  singleRole, // Added deletedAt: null filter for role and permissions, 404 logic
  updateRole, // Added deletedAt handling, validation, error handling
  deleteRole, // Changed to soft delete
};

module.exports = roleController;