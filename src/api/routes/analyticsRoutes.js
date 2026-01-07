const express = require("express");
const router = express.Router();

// Import controllers
const analyticsController = require("../../controllers/analyticsController");

// Import middleware
const authenticateToken = require("../../middlewares/authenticate"); // Assumes this checks token AND user.deletedAt
const { checkPermission } = require("../../middlewares/authorizeRole"); // Assumes this checks role/permission.deletedAt


// Protect all analytics routes with authentication first
// This ensures req.user is populated with a non-deleted user object for subsequent middleware
router.use(authenticateToken);

// --- Analytics Routes with Permission Checks ---

// Sales Analytics
// Requires authentication AND the 'view_sales_analytics' permission
router.get(
    "/sales",
    checkPermission('view_sales_analytics'),
    analyticsController.getSalesAnalytics
);

// Product Analytics
// Requires authentication AND the 'view_product_analytics' permission
router.get(
    "/products",
    checkPermission('view_product_analytics'),
    analyticsController.getProductAnalytics
);

// User Analytics
// Requires authentication AND the 'view_user_analytics' permission
router.get(
    "/users",
    checkPermission('view_user_analytics'),
    analyticsController.getUserAnalytics
);

// Dealer Analytics
// Requires authentication AND the 'view_dealer_analytics' permission
router.get(
    "/dealers",
    checkPermission('view_dealer_analytics'),
    analyticsController.getDealerAnalytics
);

// Activation Analytics
// Requires authentication AND the 'view_activation_analytics' permission
router.get(
    "/activations",
    checkPermission('view_activation_analytics'),
    analyticsController.getActivationAnalytics
);

// Revenue Forecasting
// Requires authentication AND the 'view_revenue_forecast' permission
// Alternatively, might require 'view_sales_analytics'
router.get(
    "/forecast",
    checkPermission('view_revenue_forecast'), // Or checkPermission('view_sales_analytics')
    analyticsController.getRevenueForecast
);


module.exports = router;