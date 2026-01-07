const express = require("express"); // Use express.Router() directly
const router = express.Router(); // Initialize a new router

// Import controllers
const categoryController = require("../../controllers/shopControllers/categoryController");
const subcategoryController = require("../../controllers/shopControllers/subcategoryController");
const brandsController = require("../../controllers/shopControllers/brandsController");
const productsController = require("../../controllers/shopControllers/productsController");
const ordersController = require("../../controllers/shopControllers/ordersController");
const cartsController = require("../../controllers/shopControllers/cartsController");
const banarController = require("../../controllers/shopControllers/banarController"); // Note: Typo in original file name? (banar vs banner) - sticking to banar

// Import middleware
// authenticateToken is expected to have run BEFORE this router via parent router.use("/shop", authenticateToken, shopRoutes)
const { checkPermission } = require("../../middlewares/authorizeRole"); // Assumes this checks role/permission.deletedAt

// Note: Authentication (authenticateToken) is expected to have run BEFORE this router

// --- Category Routes ---
// Mounted under "/shop/categories"

// Get all categories (public browsing or requires viewing?) - Assuming requires authentication here
router.get(
  "/categories",
  categoryController.getAllCategories
);
// Create new category (requires management)
router.post(
  "/categories",
  checkPermission("Manage Shop"),
  categoryController.addNewCategory
);
// Get single category (public browsing or requires viewing?) - Assuming requires authentication here
router.get(
  "/categories/:id",
  categoryController.singleCategory
);
// Update category (requires management)
router.put(
  "/categories/:id",
  checkPermission("Manage Shop"),
  categoryController.updateCategory
);
// Delete category (soft delete) (requires management)
router.delete(
  "/categories/:id",
  checkPermission("Manage Shop"),
  categoryController.deleteCategory
);

// --- Subcategory Routes ---
// Mounted under "/shop/subcategories"

// Get all subcategories (public browsing or requires viewing?) - Assuming requires authentication here
router.get(
  "/subcategories",
  subcategoryController.getAllSubCategories
); // Often same permission as categories
// Create new subcategory (requires management)
router.post(
  "/subcategories",
  checkPermission("Manage Shop"),
  subcategoryController.addNewSubCategory
); // Often same permission as categories
// Get single subcategory (public browsing or requires viewing?) - Assuming requires authentication here
router.get(
  "/subcategories/:id",
  subcategoryController.singleSubCategory
); // Often same permission as categories
// Update subcategory (requires management)
router.put(
  "/subcategories/:id",
  checkPermission("Manage Shop"),
  subcategoryController.updateSubCategory
); // Often same permission as categories
// Delete subcategory (soft delete) (requires management)
router.delete(
  "/subcategories/:id",
  checkPermission("Manage Shop"),
  subcategoryController.deleteSubCategory
); // Often same permission as categories

// --- Brand Routes ---
// Mounted under "/shop/brands"

// Get all brands (public browsing or requires viewing?) - Assuming requires authentication here
router.get(
  "/brands",
  brandsController.getAllBrands
); // Often same permission as products
// Create new brand (requires management)
router.post(
  "/brands",
  checkPermission("Manage Shop"),
  brandsController.addNewBrand
); // Often same permission as products
// Get single brand (public browsing or requires viewing?) - Assuming requires authentication here
router.get(
  "/brands/:id",
  brandsController.singleBrand
); // Often same permission as products
// Update brand (requires management)
router.put(
  "/brands/:id",
  checkPermission("Manage Shop"),
  brandsController.updateBrand
); // Often same permission as products
// Delete brand (soft delete) (requires management)
router.delete(
  "/brands/:id",
  checkPermission("Manage Shop"),
  brandsController.deleteBrand
); // Often same permission as products

// --- Product Routes ---
// Mounted under "/shop/products"

// Get all products (public browsing or requires viewing?) - Assuming requires authentication here
router.get(
  "/products",
  productsController.getAllProducts
);
// Create new product (requires management)
router.post(
  "/products",
  checkPermission("Manage Shop"),
  productsController.addNewProduct
);
// Get single product (public browsing or requires viewing?) - Assuming requires authentication here
router.get(
  "/products/:id",
  productsController.singleProduct
);
// Update product (requires management)
router.put(
  "/products/:id",
  checkPermission("Manage Shop"),
  productsController.updateProduct
);
// Delete product (soft delete) (requires management)
router.delete(
  "/products/:id",
  checkPermission("Manage Shop"),
  productsController.deleteProduct
);

// --- Order Routes ---
// Mounted under "/shop/orders"

// Get all orders (Admin view) (requires management permission)
router.get(
  "/orders",
  checkPermission("view_all_orders"),
  ordersController.getAllOrders
);
// Create new order (User action) (requires authentication, controller checks ownership)
// No specific permission beyond being an active user
router.post("/orders", ordersController.addNewOrder);
// Get single order (Admin view or User view of their own)
// Requires authentication. Controller should check if req.user.id == order.userId OR req.user has 'view_all_orders' permission.
// No middleware permission check needed here, relies on controller logic.
router.get("/orders/:id", ordersController.singleOrder);
// Update order (Admin action - changing status, adding proofs) (requires management)
router.put(
  "/orders/:id",
  checkPermission("manage_orders"),
  ordersController.updateOrder
);
// Delete order (soft delete) (Admin action) (requires management)
router.delete(
  "/orders/:id",
  checkPermission("manage_orders"),
  ordersController.deleteOrder
);
// Get orders by user ID (Admin viewing another user's OR User viewing their own)
// Requires authentication. Controller should check if req.user.id == :userId OR req.user has 'view_all_orders' permission.
// No middleware permission check needed here, relies on controller logic.
router.get("/orders/user/:userId", ordersController.getOrdersByUserId);

// --- Cart Routes ---
// Mounted under "/shop/carts"

// Get all carts (Admin view) (requires management permission)
router.get(
  "/carts",
  checkPermission("view_all_carts"),
  cartsController.getAllCarts
);
// Add product to cart (User action) (requires authentication, controller handles user's cart)
// Note: addNewCart was renamed addProductToCart in controller review. Assuming it handles finding/creating user's cart.
router.post("/carts", cartsController.addProductToCart); // Using controller's new function name
// Get single cart by ID (Admin view) (requires management)
router.get(
  "/carts/:id",
  checkPermission("view_all_carts"),
  cartsController.singleCart
);
// Update cart item (User action) (requires authentication, controller ensures ownership)
// Note: updateCart was renamed updateCartItem in controller review.
router.put("/carts/:id", cartsController.updateCartItem); // Using controller's new function name
// Delete cart item (soft delete) (User action) (requires authentication, controller ensures ownership)
// Note: deleteCart was renamed deleteCartItem in controller review.
router.delete("/carts/:id", cartsController.deleteCartItem); // Using controller's new function name
// Get cart by user ID (Admin view or User view of their own)
// Requires authentication. Controller should check if req.user.id == :userId OR req.user has 'view_all_carts' permission.
// No middleware permission check needed here, relies on controller logic.
// Note: getCartsByUserId was renamed getCartsByUserId in controller review, but the function name is the same.
router.get("/carts/user/:userId", cartsController.getCartsByUserId);
// Clear cart items (soft delete) (User action) (requires authentication, controller ensures ownership)
// Note: clearCart was renamed clearCartItems in controller review.
router.delete("/carts/clear/:id", cartsController.clearCartItems); // Using controller's new function name

// --- Banner Routes ---
// Mounted under "/shop/banners"

// Get all banners (public browsing or requires viewing?) - Assuming requires authentication here
router.get(
  "/banners",
  banarController.getAllBanners
); // Using controller's new function name
// Create new banner (requires management)
router.post(
  "/banners",
  checkPermission("Manage Shop"),
  banarController.addNewBanner
);
// Get single banner (public browsing or requires viewing?) - Assuming requires authentication here
router.get(
  "/banners/:id",
  banarController.getBannerById
);
// Update banner (requires management)
router.put(
  "/banners/:id",
  checkPermission("Manage Shop"),
  banarController.updateBanner
);
// Delete banner (soft delete) (requires management)
router.delete(
  "/banners/:id",
  checkPermission("Manage Shop"),
  banarController.deleteBanner
);

module.exports = router;
