const router = require("../../config/router");

// Import controllers
const {
  deleteActivation,
  updateActivation,
  singleActivation,
  addNewActivation,
  getAllActivations,
  getActivationsByUserId,
} = require("../../controllers/activationControllers/activationController"); // Assuming these are updated
const {
  deleteCompany,
  updateCompany,
  singleCompany,
  addNewCompany,
  getAllCompanies,
} = require("../../controllers/activationControllers/companyController"); // Assuming these are updated
const {
  updateTrarrif,
  singleTrarrif,
  addNewTrarrif,
  deleteTrarrif, // Soft Delete
  getAlltarrif, // Filters by deletedAt
} = require("../../controllers/activationControllers/tarrifController"); // Assuming these are updated
const {
  deleteTrarrifoptions, // Soft Delete
  updateTrarrifoptions, // Handles deletedAt
  singleTrarrifoptions, // Filters by deletedAt
  addNewTrarrifoptions, // Default deletedAt
  getAlltarrifoptions, // Filters by deletedAt
} = require("../../controllers/activationControllers/tarrifOptionsController"); // Assuming these are updated

// simSerialController seems unused or functions not provided.
// const { deleteSimSerial, updateSimSerial, singleSimSerial, addNewSimSerial, getAllSimSerials } = require("../../controllers/activationControllers/simSerialController");

const simController = require("../../controllers/activationControllers/simController"); // This is the serialNumberController, already updated

// Import middleware

const { checkPermission } = require("../../middlewares/authorizeRole"); // Checks user's role/permissions (considering Role.deletedAt, Permission.deletedAt)

// Apply authentication middleware to all routes in this file
// Ensure this sub-router is used AFTER the top-level router's /activation group
// Example: router.use("/activation", authenticateToken, activationRoutes); in main router
// For clarity here, let's add it to each route definition or a group below
// If authenticateToken is already applied at the router.use("/activation", ...) level
// in the main router, you can remove it from these individual route definitions.
// Assuming it's applied at the group level in the main router,
// we only need to add checkPermission here.

// --- Companies Routes ---
router.get("/companies", getAllCompanies);
router.post("/companies", checkPermission("manage_companies"), addNewCompany);
router.get("/companies/:id", singleCompany); // Or checkPermission('manage_companies')
router.put(
  "/companies/:id",
  checkPermission("manage_companies"),
  updateCompany
);
router.delete(
  "/companies/:id",
  checkPermission("manage_companies"),
  deleteCompany
); // Soft Delete

// --- Tariff Selection Routes ---
router.get("/tarrifs", checkPermission("view_tariffs"), getAlltarrif); // Filters by deletedAt
router.post("/tarrifs", checkPermission("manage_tariffs"), addNewTrarrif); // Default deletedAt
router.get("/tarrifs/:id", checkPermission("view_tariffs"), singleTrarrif); // Filters by deletedAt
router.put("/tarrifs/:id", checkPermission("manage_tariffs"), updateTrarrif); // Handles deletedAt
router.delete("/tarrifs/:id", checkPermission("manage_tariffs"), deleteTrarrif); // Soft Delete

// --- Tariff Options Routes ---
router.get(
  "/tarrifoptions",
  checkPermission("view_tariffs"),
  getAlltarrifoptions
); // Filters by deletedAt
router.post(
  "/tarrifoptions",
  checkPermission("manage_tariffs"),
  addNewTrarrifoptions
); // Default deletedAt
router.get(
  "/tarrifoptions/:id",
  checkPermission("view_tariffs"),
  singleTrarrifoptions
); // Filters by deletedAt
router.put(
  "/tarrifoptions/:id",
  checkPermission("manage_tariffs"),
  updateTrarrifoptions
); // Handles deletedAt
router.delete(
  "/tarrifoptions/:id",
  checkPermission("manage_tariffs"),
  deleteTrarrifoptions
); // Soft Delete

// --- SIM Serial Routes (Assuming redundant or controllers not provided - Commented out) ---
/*
router.get("/simserials", checkPermission('view_serial_numbers'), getAllSimSerials);
router.post("/simserials", checkPermission('manage_serial_numbers'), addNewSimSerial);
router.get("/simserials/:id", checkPermission('view_serial_numbers'), singleSimSerial);
router.put("/simserials/:id", checkPermission('manage_serial_numbers'), updateSimSerial);
router.delete("/simserials/:id", checkPermission('manage_serial_numbers'), deleteSimSerial); // Assumed Soft Delete
*/

// --- Serial Number Routes (Using simController - Already updated) ---
router.get(
  "/serialnumbers",
  checkPermission("view_serial_numbers"),
  simController.getAllSerialNumbers
); // Filters by deletedAt
router.post(
  "/serialnumbers",
  checkPermission("manage_serial_numbers"),
  simController.createSerialNumber
); // Default deletedAt
router.put(
  "/serialnumbers/:id",
  checkPermission("manage_serial_numbers"),
  simController.updateSerialNumber
); // Handles deletedAt
router.delete(
  "/serialnumbers/:id",
  checkPermission("manage_serial_numbers"),
  simController.deleteSerialNumber
); // Soft Delete

router.get(
  "/serialnumbers/dealer/:dealerId",
  checkPermission("view_dealer_serial_numbers"),
  simController.getSerialNumberByDealerId
); // Filters by deletedAt
router.get(
  "/serialnumbers/company/:companyId",
  checkPermission("view_company_serial_numbers"),
  simController.getSerialNumberByCompanyId
); // Filters by deletedAt

router.get(
  "/serialnumbers/dealer/:dealerId/nonactivated",
  checkPermission("view_dealer_serial_numbers"),
  simController.getNonActivatedSerialNumbersByDealerId
); // Filters by deletedAt
// --- ERROR Route: This calls getSerialNumberByCompanyId which is not a non-activated filter ---
// --- Commenting out this route as it seems incorrect and no matching controller was provided ---
// router.get("/serialnumbers/company/:companyId/nonactivated", checkPermission('view_company_serial_numbers'), simController.getSerialNumberByCompanyId);
// If you need this, you likely need a controller like getNonActivatedSerialNumbersByCompanyId

// Note: getNonActivatedSerialNumbers fetches ALL non-activated, which might be slow/undesired.
// It also overlaps with getNonActivatedSerialNumbersByDealerId if dealerId is in req.params for both.
// Review the intended use of this route.
router.get(
  "/serialnumbers/nonactivated",
  checkPermission("view_serial_numbers"),
  simController.getNonActivatedSerialNumbers
); // Filters by deletedAt (and activation)

// --- Activation Routes ---
router.get(
  "/activations",
  checkPermission("view_activations"),
  getAllActivations
); // Assuming getAllActivations filters by deletedAt
router.post(
  "/activations",
  checkPermission("create_activations"),
  addNewActivation
); // Assuming addNewActivation defaults deletedAt
router.get(
  "/activations/:id",
  checkPermission("view_activations"),
  singleActivation
); // Assuming singleActivation filters by deletedAt
router.put(
  "/activations/:id",
  checkPermission("update_activations"),
  updateActivation
); // Assuming updateActivation handles deletedAt
router.delete(
  "/activations/:id",
  checkPermission("delete_activations"),
  deleteActivation
); // Assuming deleteActivation is soft delete
router.get(
  "/activations/user/:userId",
  checkPermission("view_activations"),
  getActivationsByUserId
); // Assuming getActivationsByUserId filters by deletedAt

// Export the configured router
module.exports = router;
