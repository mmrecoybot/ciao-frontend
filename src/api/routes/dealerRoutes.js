const express = require("express"); // Assuming this file should use express.Router() directly
const router = express.Router(); // Initialize a new router

// Import controllers
const billingAddressController = require("../../controllers/dealerControllers/billingAddressController");
const creditDetailsController = require("../../controllers/dealerControllers/creditDetailsController");
const dealerController = require("../../controllers/dealerControllers/dealerController");
const salePointController = require("../../controllers/dealerControllers/salePointController");
const signedContractController = require("../../controllers/dealerControllers/signedContractController");

// Import middleware
// authenticateToken is likely applied globally in index.js via router.use("/dealers", authenticateToken, dealerRoutes)
// So we only need checkPermission here.
const { checkPermission } = require("../../middlewares/authorizeRole"); // Assumes this checks role/permission.deletedAt

// Note: Authentication (authenticateToken) is expected to have run BEFORE this router

// --- Dealer Base Routes ---
// These routes are mounted under "/dealers" in the main router

// Get all dealers (requires viewing permission)
router.get(
  "/",
  checkPermission("view_dealers"),
  dealerController.getAllDealers
);

// Create a new dealer (requires creation/management permission)
router.post(
  "/",
  checkPermission("create_dealers"),
  dealerController.createDealer
); // Or manage_dealers

// Get a single dealer by ID (requires viewing permission)
router.get("/:id", checkPermission("view_dealers"), dealerController.getDealer);

// Update a dealer by ID (requires update/management permission)
router.put(
  "/:id",
  checkPermission("update_dealers"),
  dealerController.updateDealer
); // Or manage_dealers
// Note: The original had PATCH in comments but PUT in code. Sticking to PUT.

// Delete a dealer by ID (soft delete) (requires deletion/management permission)
router.delete(
  "/:id",
  checkPermission("delete_dealers"),
  dealerController.deleteDealer
); // Or manage_dealers

// --- Documents Routes (mounted under /dealers/documents) ---

// Create a new document (requires management permission)
router.post(
  "/documents",
  checkPermission("manage_dealer_documents"),
  dealerController.createDocument
);

// Get all documents for a dealer (requires viewing permission)
router.get(
  "/documents/:dealerId",
  checkPermission("view_dealer_documents"),
  dealerController.getAllDocuments
);

// Delete a document (soft delete) (requires management permission)
router.delete(
  "/documents/:id",
  checkPermission("manage_dealer_documents"),
  dealerController.deleteDocument
);

// --- Billing Address Routes (mounted under /dealers/billingaddress) ---

// Get billing address for a dealer (requires viewing permission)
router.get(
  "/billingaddress/:dealerId",
  checkPermission("view_dealer_billing"),
  billingAddressController.getBillingAddress
);

// Create or update billing address (upsert) (requires management permission)
router.put(
  "/billingaddress/:dealerId",
  checkPermission("manage_dealer_billing"),
  billingAddressController.upsertBillingAddress
);

// Delete billing address (soft delete) (requires management permission)
router.delete(
  "/billingaddress/:dealerId",
  checkPermission("manage_dealer_billing"),
  billingAddressController.deleteBillingAddress
);

// --- Credit Details Routes (mounted under /dealers/creditdetails) ---

// Get credit details for a dealer (requires viewing permission)
router.get(
  "/creditdetails/:dealerId",
  checkPermission("view_dealer_credit"),
  creditDetailsController.getCreditDetails
);

// Create or update credit details (upsert) (requires management permission)
router.put(
  "/creditdetails/:dealerId",
  checkPermission("manage_dealer_credit"),
  creditDetailsController.upsertCreditDetails
);

// Delete credit details (soft delete) (requires management permission)
router.delete(
  "/creditdetails/:dealerId",
  checkPermission("manage_dealer_credit"),
  creditDetailsController.deleteCreditDetails
);

// --- Sale Point Routes (mounted under /dealers/salepoint) ---

// Get all sale points for a dealer (requires viewing permission)
router.get(
  "/salepoint/dealer/:dealerId",
  checkPermission("view_dealer_salepoints"),
  salePointController.getAllSalePoints
);

// Get a single sale point by ID (requires viewing permission)
router.get(
  "/salepoint/:id",
  checkPermission("view_dealer_salepoints"),
  salePointController.getSalePoint
);

// Create a new sale point (requires management permission)
router.post(
  "/salepoint",
  checkPermission("manage_dealer_salepoints"),
  salePointController.createSalePoint
);

// Update a sale point by ID (requires management permission)
router.put(
  "/salepoint/:id",
  checkPermission("manage_dealer_salepoints"),
  salePointController.updateSalePoint
);

// Delete a sale point by ID (soft delete) (requires management permission)
router.delete(
  "/salepoint/:id",
  checkPermission("manage_dealer_salepoints"),
  salePointController.deleteSalePoint
);

// --- Signed Contract Routes (mounted under /dealers/signedcontract) ---

// Get all signed contracts for a dealer (requires viewing permission)
router.get(
  "/signedcontract/dealer/:dealerId",
  checkPermission("view_dealer_contracts"),
  signedContractController.getAllSignedContracts
);

// Get a single signed contract by ID (requires viewing permission)
router.get(
  "/signedcontract/:id",
  checkPermission("view_dealer_contracts"),
  signedContractController.getSignedContract
);

// Create a new signed contract (requires management permission)
router.post(
  "/signedcontract",
  checkPermission("manage_dealer_contracts"),
  signedContractController.createSignedContract
);

// Update a signed contract by ID (requires management permission)
router.put(
  "/signedcontract/:id",
  checkPermission("manage_dealer_contracts"),
  signedContractController.updateSignedContract
);

// Delete a signed contract by ID (soft delete) (requires management permission)
router.delete(
  "/signedcontract/:id",
  checkPermission("manage_dealer_contracts"),
  signedContractController.deleteSignedContract
);

module.exports = router;
