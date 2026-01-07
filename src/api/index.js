const router = require("../config/router");

// Import route files
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const hrRoutes = require("./routes/hrRoutes"); // Assuming this contains Role/Permission/Admin controllers
const shopRoutes = require("./routes/shopRoutes");
const activationRoutes = require("./routes/activationRoutes");
const libRoutes = require("./routes/libRoutes");
const dealerRoutes = require("./routes/dealerRoutes");
const analyticsController = require("../controllers/analyticsController");

// Import middleware
const authenticateToken = require("../middlewares/authenticate"); // Checks token AND user.deletedAt

// Analytics Route - Placed top for priority
router.get("/analytics", authenticateToken, analyticsController.handleGetDashboardAnalytics);

// --- Public Routes (No Authentication Required) ---
// Authentication routes (login, register, forgot password, reset password, refresh)
// These controllers handle user.deletedAt logic internally where applicable.
// No middleware needed here.
router.use("/auth", authRoutes);

// --- Authenticated Routes (Requires authenticateToken) ---
// These routes require a valid access token AND the user must NOT be soft-deleted.
// Specific granular permission checks (`checkPermission`) should ideally be applied
// *within* the individual route files (`userRoutes`, `hrRoutes`, etc.) for more
// flexibility (e.g., different permissions for GET vs POST vs PATCH on the same resource).

// User management routes (e.g., admin endpoints for managing users)
// These likely require authentication. Permission checks for admin role should be in userRoutes.
router.use("/users", authenticateToken, userRoutes);

// HR management routes (Roles, Permissions, Admins)
// These require authentication. Permission checks should be in hrRoutes.
router.use("/hr", authenticateToken, hrRoutes);

// Shop related routes (Products, Categories, Carts, Orders etc.)
// Access typically requires authentication. Permission checks in shopRoutes.
router.use("/shop", authenticateToken, shopRoutes);

// Activation related routes
// Access typically requires authentication. Permission checks in activationRoutes.
router.use("/activation", authenticateToken, activationRoutes);

// Dealer management routes
// Access typically requires authentication. Permission checks in dealerRoutes.
router.use("/dealers", authenticateToken, dealerRoutes);

// Utility/Library routes (upload, delete asset, send email, generate PDF)
// Access typically requires authentication. Permission checks in libRoutes.
router.use("/lib", authenticateToken, libRoutes);



// --- Specific Authenticated & Permissioned Routes ---
// Example: Listing roles might require authentication and a specific permission.
// The original code `router.use("/role", getAllRoles);` is likely a typo
// and should be a GET route with middleware.
// Assuming '/roles' is the intended path for listing roles via GET.
/*
// Import the specific controller if it's not handled in hrRoutes
const { getAllRoles: getAllRolesController } = require("../controllers/hrControllers/roleController");

router.get(
    "/roles", // Changed from /role to /roles for collection consistency
    authenticateToken, // User must be authenticated and not deleted
    // Add permission check here if ALL requests to GET /roles require a specific permission
    // Example: user must have the 'view_roles' permission
    checkPermission('view_roles'), // User must have the non-deleted 'view_roles' permission via a non-deleted role
    getAllRolesController // The controller function
);

// Example: Getting a single role by ID might also require authentication and permission
const { singleRole: singleRoleController } = require("../controllers/hrControllers/roleController");
router.get(
    "/roles/:id",
    authenticateToken,
    checkPermission('view_roles'), // Or checkPermission('manage_roles')
    singleRoleController
);
*/
// If Role/Permission controllers are within hrRoutes, remove the direct imports and routes above.

// Export the configured router
module.exports = router;
