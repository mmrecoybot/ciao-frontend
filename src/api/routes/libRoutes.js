const express = require("express"); // Import express
const router = express.Router(); // Initialize a new router

// Import controllers
const libController = require("../../controllers/libController");

// Import middleware
// authenticateToken is expected to have run BEFORE this router via parent router.use("/lib", authenticateToken, libRoutes)
const { checkPermission } = require("../../middlewares/authorizeRole"); // Assumes this checks role/permission.deletedAt

// Note: Authentication (authenticateToken) is expected to have run BEFORE this router


// --- Lib Routes with Permission Checks ---
// These routes are mounted under "/lib" in the main router

// Upload Asset
// Requires authentication AND permission to upload assets
router.post(
    "/upload",
    checkPermission('upload_assets'), // Requires permission to upload assets
    libController.uploadMiddleware, // Multer middleware (handles file processing and Cloudinary upload)
    libController.uploadAsset // Controller (handles sending response after successful upload)
);

// Get All Assets (with optional folder filter)
// Requires authentication AND permission to view assets
// The controller filters results based on the user's ID and potentially a folder prefix.
router.get(
    "/assets",
    checkPermission('view_assets'), // Requires permission to view assets
    libController.getAllAssets
);

// Delete Asset by Public ID
// Requires authentication AND permission to delete/manage assets
// The controller expects the publicId in the request body.
// The route path variable is often used when the ID is in the URL.
// Let's stick to the controller's expectation of body, but change the route param name for clarity if it were used.
// Since publicId is expected in body, the param isn't strictly needed, but common in DELETE routes.
// Let's keep the param name as :publicId for clarity, even if the controller primarily uses req.body.publicId
router.delete(
    "/assets/:publicId", // Use :publicId in the path for clarity, though controller uses body
    checkPermission('manage_assets'), // Requires permission to delete/manage assets
    libController.deleteAsset
);

// Send Email
// Requires authentication AND permission to send emails
router.post(
    "/mail",
    checkPermission('send_emails'), // Requires permission to send emails
    libController.sendMail
);

// Generate PDF from Image URL
// Requires authentication AND permission to generate PDFs
// Route is GET, controller expects imageUrl in query params.
router.get(
    "/pdf_image",
    checkPermission('generate_pdfs'), // Requires permission to generate PDFs
    libController.genPdfWithImageLib
);


module.exports = router;