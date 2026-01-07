const {
  register, // Handles check for existing (incl. soft-deleted) email
  login, // Checks for non-deleted user
  refresh, // Checks for non-deleted user
  logout, // No user deletedAt check needed
  changeUserPassword, // Checks for non-deleted user
  forgotPassword, // Checks for non-deleted user (by default)
  resetPassword, // Finds user regardless of deletedAt, explicitly sets deletedAt: null
} = require("../../controllers/authController");
const authenticateToken = require("../../middlewares/authenticate"); // Checks token AND user.deletedAt

const router = require("../../config/router"); // Assuming this is express.Router()
// const authenticateToken = require("../../middlewares/authenticate"); // Already imported

// --- Public Routes (No Authentication Required) ---

// User registration: Public. Controller handles email existence (incl. deleted).
router.post("/register", register); // Correct

// User login: Public. Controller checks for non-deleted user.
router.post("/login", login); // Correct

// Refresh token: Public (client sends refresh token directly). Controller checks for non-deleted user via token.
router.post("/refresh-token", refresh); // Correct

// Logout: Public (client sends refresh token to invalidate). Controller handles token deletion.
router.post("/logout", logout); // Correct

// Forgot password: Public. Controller checks for non-deleted user by email (by default).
router.post("/password/forgot", forgotPassword); // Correct

// Reset password: Public (client uses reset token). Controller finds user regardless of deleted status and undeletes on success.
router.post("/password/reset", resetPassword); // Correct

// --- Authenticated Routes (Requires authenticateToken) ---

// Change user password: Requires user to be logged in and authenticated.
// The `authenticateToken` middleware ensures the user is both authenticated AND non-deleted
// before the controller runs. The controller also performs a non-deleted check, which
// acts as a good safeguard.
// Assuming this route is for the *authenticated user* changing *their own* password.
router.put("/password/change", authenticateToken, changeUserPassword); // Correct

// Note: Routes for admin actions like deleting/undeleting users should be in userRoutes
// or an admin-specific user management route file, not here.
// The deleteUser/undeleteUser functions were added to adminControllers previously.

module.exports = router;
