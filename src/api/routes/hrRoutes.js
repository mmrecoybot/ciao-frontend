const express = require("express"); // Use express.Router() directly in modular files
const router = express.Router();

// Import controllers
const notificationController = require("../../controllers/hrControllers/notificationController");
const permissionController = require("../../controllers/hrControllers/permissionController");
const roleController = require("../../controllers/hrControllers/roleController");
const workflowController = require("../../controllers/hrControllers/workflowController");
const adminController = require("../../controllers/hrControllers/adminController"); // Assuming this contains admin-specific user management

// Import middleware
// authenticateToken is expected to have run BEFORE this router via parent router.use
const { checkPermission } = require("../../middlewares/authorizeRole"); // Assumes this checks role/permission.deletedAt

// Note: Authentication (authenticateToken) is expected to have run BEFORE this router

// --- Role Management Routes (Admin/HR) ---
// Mounted under "/hr/roles"
// These require specific permissions to manage roles and their permissions

router.post(
  "/roles",
  checkPermission("manage_roles"),
  roleController.addNewRole
); // Create role
router.get("/roles", checkPermission("view_roles"), roleController.getAllRoles); // Get all roles
router.get(
  "/roles/:id",
  checkPermission("view_roles"),
  roleController.singleRole
); // Get single role
router.put(
  "/roles/:id",
  checkPermission("manage_roles"),
  roleController.updateRole
); // Update role
router.delete(
  "/roles/:id",
  checkPermission("manage_roles"),
  roleController.deleteRole
); // Delete (soft delete) role

// Role-Permission Assignment Routes
router.post(
  "/roles/:roleId/permissions",
  checkPermission("assign_permissions"),
  permissionController.assignPermission
); // Assign permissions to a role
router.delete(
  "/roles/:roleId/permissions/:permissionId",
  checkPermission("assign_permissions"),
  permissionController.removePermission
); // Remove permission from a role

// --- Permission Management Routes (Admin/HR) ---
// Mounted under "/hr/permissions"
// These require specific permissions to manage available permissions

router.post(
  "/permissions",
  checkPermission("manage_permissions"),
  permissionController.addNewPermission
); // Create permission
router.get(
  "/permissions",
  checkPermission("view_permissions"),
  permissionController.getAllPermissions
); // Get all permissions
router.get(
  "/permissions/:id",
  checkPermission("view_permissions"),
  permissionController.singlePermission
); // Get single permission
router.put(
  "/permissions/:id",
  checkPermission("manage_permissions"),
  permissionController.updatePermission
); // Update permission
router.delete(
  "/permissions/:id",
  checkPermission("manage_permissions"),
  permissionController.deletePermission
); // Delete (soft delete) permission

router.get(
  "/permissions/user/:userId",
  permissionController.getPermissionsByUserId
); // Get permissions by user ID

// --- Workflow Management Routes (Admin/HR) ---
// Mounted under "/hr/workflows"
// These require specific permissions to manage workflows

// Note: Workflow creation might happen automatically via other controllers (e.g., OrderController)
// This route might be for manual admin creation/management.
router.post(
  "/workflows",
  checkPermission("manage_workflows"),
  workflowController.addNewWorkflow
); // Create workflow (if manual)

router.post(
  "/workflows/:id/steps",
  checkPermission("manage_workflows"),
  workflowController.addNewStep
); // Add step to workflow
router.put(
  "/workflows/:id/cancel",
  checkPermission("manage_workflows"),
  workflowController.cancelWorkflow
); // Cancel workflow
router.get(
  "/workflows/:id",
  checkPermission("view_workflows"),
  workflowController.getSingleWorkflow
); // Get single workflow
router.get(
  "/workflows",
  checkPermission("view_workflows"),
  workflowController.getAllWorkflows
); // Get all workflows

// --- Notification Routes (Admin/HR and Self-Service) ---
// Mounted under "/hr/notifications"

// Admin view: Get all notifications (requires broad permission)
router.get(
  "/notifications",
  checkPermission("view_all_notifications"),
  notificationController.getAllNotifications
);

// Admin view: Add a new notification (likely for specific users - requires management permission)
router.post(
  "/notifications",
  checkPermission("manage_notifications"),
  notificationController.addNewNotification
);

// User view/action: Mark a notification as seen
// Requires authentication (handled by router.use), controller MUST verify ownership (notification.userId === req.user.id)
router.patch(
  "/notifications/:id/seen",
  notificationController.updateNotification
);

// User view/action: Delete (soft delete) a notification
// Requires authentication, controller MUST verify ownership
router.delete("/notifications/:id", notificationController.deleteNotification);

// User view: Get all notifications for the authenticated user
// Route uses userId from params, controller should check if it matches req.user.id or get from req.user
// Assuming this route is for getting *authenticated user's* notifications.
router.get(
  "/notifications/user/:userId",
  notificationController.getAllNotificationsByUserId
);
// Note: Controller for this route should likely use req.user.id instead of trusting :userId param,
// or verify that :userId == req.user.id if it's intended for self-service.
// If intended for admin to view ANY user's notifications, use checkPermission('view_all_notifications') here instead.

// User view: Get a single notification by ID
// Requires authentication, controller MUST verify ownership (notification.userId === req.user.id)
router.get("/notifications/:id", notificationController.getSingleNotification);

// --- Admin Management Routes (for Users treated as Admins) ---
// Mounted under "/hr/admins"
// These require specific permissions to manage administrators

router.get(
  "/admins",
  checkPermission("view_admins"),
  adminController.getAllAdmins
); // Get all admins (filtered by deletedAt in controller)
router.post(
  "/admins",
  checkPermission("manage_admins"),
  adminController.addNewAdmin
); // Create new admin
router.get(
  "/admins/:id",
  checkPermission("view_admins"),
  adminController.getAdminById
); // Get single admin (filtered by deletedAt in controller)
router.put(
  "/admins/:id",
  checkPermission("manage_admins"),
  adminController.updateAdmin
); // Update admin (allows undeleting)
router.delete(
  "/admins/:id",
  checkPermission("manage_admins"),
  adminController.deleteAdmin
); // Delete (soft delete) admin

// Add route for undeleting an admin (user) explicitly
router.put(
  "/admins/:id/undelete",
  checkPermission("manage_admins"),
  adminController.undeleteUser
); // Uses the undeleteUser function from adminController

module.exports = router;
