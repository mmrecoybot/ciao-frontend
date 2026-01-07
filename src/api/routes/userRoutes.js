const express = require("express"); // Import express
const router = express.Router(); // Assuming this file defines a modular router using express.Router()

// Import controllers
const userController = require("../../controllers/userController"); // Assuming this is the admin userController

// Import middleware
// authenticateToken is expected to have run BEFORE this router via parent router.use("/users", authenticateToken, userRoutes)
const { checkPermission } = require("../../middlewares/authorizeRole"); // Assumes this checks role/permission.deletedAt

// Note: Authentication (authenticateToken) is expected to have run BEFORE this router

// --- User Management Routes (Admin) with Permission Checks ---
// These routes are mounted under "/users" in the main router

// Get all users (Admin view)
// Requires authentication AND permission to view users
// Controller filters for deletedAt: null
router.get(
  "/", // Mounted at /users, so path is /
  checkPermission("view_users"), // User must have the 'view_users' permission
  userController.getAllUsers
);

// Get a single user by ID (Admin view)
// Requires authentication AND permission to view users
// Controller filters for deletedAt: null
router.get(
  "/:id", // Mounted at /users/:id
  checkPermission("view_users"), // User must have the 'view_users' permission
  userController.getUserById
);

// Update a user by ID (Admin action)
// Requires authentication AND permission to manage users
// Controller handles setting deletedAt for undeleting
router.put(
  "/:id", // Mounted at /users/:id
  checkPermission("manage_users"), // User must have the 'manage_users' permission
  // responseLogger, // Keep responseLogger if needed, placed after auth and permission
  userController.updateUser
);

// Delete a user by ID (Admin action - soft delete)
// Requires authentication AND permission to manage users
// Controller handles soft deletion by setting deletedAt
router.delete(
  "/:id", // Mounted at /users/:id
  checkPermission("manage_users"), // User must have the 'manage_users' permission
  userController.deleteUser
);

// Undelete a user by ID (Admin action)
// Requires authentication AND permission to manage users
// Controller handles setting deletedAt back to null
// Assuming the undelete function is available in the userController (likely from adminController)
router.put(
  "/:id/undelete", // Mounted at /users/:id/undelete
  checkPermission("manage_users"), // User must have the 'manage_users' permission
  userController.undeleteUser // Assuming this function exists in the controller
);

// Note: The responseLogger middleware was present on the update route.
// If you intend to use it on ALL these routes, you could add it after checkPermission on each.
// If it's a global logger, it should be applied earlier in your main application middleware stack.
// I've commented it out above but keep it in mind for your actual setup.

module.exports = router;
