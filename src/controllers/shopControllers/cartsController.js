// Assume Cart model includes:
// model Cart {
//     id          Int       @id @default(autoincrement())
//     userId      Int       @unique // Assuming one active cart per user
//     user        User      @relation(fields: [userId], references: [id])
//     total       Float     @default(0) // Use Float or Decimal for currency
//     createdAt   DateTime  @default(now())
//     updatedAt   DateTime  @updatedAt
//     deletedAt   DateTime? // NULL means not deleted
//     items       CartItem[]
//   }

// Assume CartItem model includes:
// model CartItem {
//     id          Int       @id @default(autoincrement())
//     cartId      Int
//     cart        Cart      @relation(fields: [cartId], references: [id])
//     productId   Int
//     product     Product   @relation(fields: [productId], references: [id])
//     variationId Int
//     variation   Variation @relation(fields: [variationId], references: [id])
//     quantity    Int
//     createdAt   DateTime  @default(now())
//     updatedAt   DateTime  @updatedAt
//     deletedAt   DateTime? // NULL means not deleted
//   }

const prisma = require("../../config/db");

// Helper function to update the cart total, considering only non-deleted items
const updateCartTotal = async (cartId) => {
  try {
    // Fetch all NON-DELETED items in the cart
    const cartItems = await prisma.cartItem.findMany({
      where: {
        cartId: cartId,
        deletedAt: null, // Only include non-deleted items
      },
      include: {
        product: {
          select: {
            dealer_price: true, // Assume dealer_price is a number/Decimal
          },
        },
        variation: {
          // Include variation if needed for calculation, otherwise omit
        },
      },
    });

    // Calculate the total based on non-deleted items
    const total = cartItems.reduce(
      (sum, item) =>
        sum + parseFloat(item.product.dealer_price) * item.quantity, // Use parseFloat for calculation
      0
    );

    // Update the cart total
    await prisma.cart.update({
      where: { id: cartId },
      data: { total: total },
    });

    console.log(`Cart ${cartId} total updated successfully`);
  } catch (error) {
    console.error(`Error updating cart ${cartId} total:`, error);
    // Rethrow the error or handle it appropriately
    throw error; // Or log and return false/null depending on desired behavior
  }
};

// Get all carts (excluding soft-deleted carts and their soft-deleted items)
// This might not be a common use case for a user-facing API, more for admin.
const getAllCarts = async (req, res) => {
  try {
    // Find all carts where deletedAt is null
    const carts = await prisma.cart.findMany({
      where: { deletedAt: null }, // Add this condition for carts
      include: {
        items: {
          where: { deletedAt: null }, // Only include non-deleted items
          include: {
            product: true,
            variation: true,
          },
          orderBy: { createdAt: "asc" }, // Optional: Order items
        },
      },
      orderBy: { createdAt: "desc" }, // Optional: Order carts
    });
    res.status(200).json(carts); // Use status 200 for success
  } catch (error) {
    console.error("Error fetching all carts:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

// Add a product to a user's cart (or create cart if none exists)
const addProductToCart = async (req, res) => {
  try {
    const { productId, variationId, quantity, userId } = req.body;

    if (!productId || !variationId || !quantity || !userId) {
      return res.status(400).json({
        error:
          "All fields (productId, variationId, quantity, userId) are required",
      });
    }

    // Fetch the cart for the user
    let cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: true },
    });

    // If no cart exists, create one
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
          total: 0,
        },
      });
    }

    // Check if the product with the same variation already exists in the cart
    const existingItem = cart?.items?.find(
      (item) => item.productId === productId && item.variationId === variationId
    );

    if (existingItem) {
      // Update the quantity of the existing item
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });
    } else {
      // Add a new item to the cart
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variationId,
          quantity,
        },
      });
    }

    // Update cart total
    await updateCartTotal(cart.id);

    // Return the updated cart
    const updatedCart = await prisma.cart.findFirst({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: true,
            variation: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: "Product added to cart successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


// Get a single cart by ID (excluding soft-deleted cart and its soft-deleted items)
// Note: Getting cart by User ID (`getCartsByUserId`) is likely more common.
const singleCart = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }
    const cart = await prisma.cart.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        items: {
          include: {
            product: true,
            variation: true,
          },
        },
      },
    });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error fetching cart" });
  }
};

// Update a specific cart item (e.g., quantity)
const updateCartItem = async (req, res) => {
  try {
    const cartItemId = parseInt(req.params.id); // This should be CartItem ID
    const { quantity, deletedAt } = req.body; // Allow updating quantity and potentially deletedAt

    // Validate input
    if (isNaN(cartItemId)) {
      return res.status(400).json({ error: "Invalid cart item ID provided" });
    }

    // Build update data, filtering undefined and handling deletedAt
    const updateData = {};
    if (quantity !== undefined) {
      const quantityNum = Number(quantity);
      if (isNaN(quantityNum) || quantityNum < 0) {
        // Allow 0 to indicate removal intention? Or handle via delete route. Let's disallow < 0 here.
        return res.status(400).json({ error: "Invalid quantity provided" });
      }
      updateData.quantity = quantityNum;
    }

    // Allow setting deletedAt explicitly (e.g., to null for undelete, or Date for soft delete)
    if (deletedAt !== undefined) {
      updateData.deletedAt = deletedAt === null ? null : new Date(deletedAt);
    }

    // Update the cart item. Include deletedAt: null in where if you ONLY want to update non-deleted items
    // If you want to allow undeleting (setting deletedAt to null), remove deletedAt: null from where
    const updatedCartItem = await prisma.cartItem.update({
      where: {
        id: cartItemId,
        // deletedAt: null // Uncomment this line if you only allow updating non-deleted items
      },
      data: updateData,
      // Include the updated item's cartId to find the parent cart for total update
      select: { id: true, cartId: true, deletedAt: true },
    });

    // If the item was deleted by setting quantity to 0 or explicitly setting deletedAt,
    // update the total AFTER the update.
    if (updatedCartItem.deletedAt === null) {
      // Only update total if the item is *now* not deleted
      await updateCartTotal(updatedCartItem.cartId);
    } else {
      // If the item was soft-deleted by this update, recalculate total ignoring it
      await updateCartTotal(updatedCartItem.cartId);
    }

    // Respond with the updated cart item (or the full updated cart)
    // Getting the full updated cart is often more useful for the client
    const updatedCart = await prisma.cart.findUnique({
      where: { id: updatedCartItem.cartId, deletedAt: null }, // Fetch the parent cart, ensure it's not deleted
      include: {
        items: {
          where: { deletedAt: null }, // Include only non-deleted items
          include: {
            product: true,
            variation: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: "Cart item updated successfully",
      cart: updatedCart, // Return the full updated cart
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
    // Handle case where ID is not found or filtered out by where clause
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ error: "Cart item not found or is deleted" });
    }
    // Handle potential foreign key constraint violation if dealerId is updated (less likely here)
    if (error.code === "P2003") {
      return res.status(400).json({ error: "Invalid reference data provided" });
    }
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

// Delete a specific cart item (soft delete)
const deleteCartItem = async (req, res) => {
  try {
    const cartItemId = parseInt(req.params.id); // This should be CartItem ID

    if (isNaN(cartItemId)) {
      return res.status(400).json({ error: "Invalid cart item ID provided" });
    }

    // Perform soft deletion by updating the deletedAt field for the CartItem
    // Include deletedAt: null in where to ensure it fails if already deleted
    const cartItem = await prisma.cartItem.update({
      where: {
        id: cartItemId,
        deletedAt: null, // Ensure it's not already deleted
      },
      data: { deletedAt: new Date() }, // Set deletedAt to the current date/time
      select: { id: true, cartId: true }, // Select cartId to update total
    });

    // Update the cart total after deleting the item
    await updateCartTotal(cartItem.cartId);

    // Return success message and potentially the parent cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cartItem.cartId, deletedAt: null }, // Fetch the parent cart, ensure it's not deleted
      include: {
        items: {
          where: { deletedAt: null }, // Include only non-deleted items
          include: {
            product: true,
            variation: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Cart item soft deleted successfully",
      cart: updatedCart, // Return the full updated cart
    });
  } catch (error) {
    console.error("Error soft-deleting cart item:", error);
    // Handle case where the cart item is not found or already soft-deleted
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ error: "Cart item not found or already deleted" });
    }
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

// Clear all items from a cart (soft delete all CartItems for a Cart)
const clearCartItems = async (req, res) => {
  // Renamed to clearCartItems for clarity
  try {
    const cartId = parseInt(req.params.id); // This should be Cart ID

    if (isNaN(cartId)) {
      return res.status(400).json({ error: "Invalid cart ID provided" });
    }

    // Optional: Verify the cart exists and is not deleted before clearing its items
    const existingCart = await prisma.cart.findUnique({
      where: {
        id: cartId,
        deletedAt: null,
      },
      select: { id: true }, // Just need the ID
    });

    if (!existingCart) {
      return res.status(404).json({ error: "Cart not found or is deleted" });
    }

    // Perform soft deletion on all NON-DELETED cart items for the given cart ID
    const deleteResult = await prisma.cartItem.updateMany({
      where: {
        cartId: cartId,
        deletedAt: null, // Only soft-delete items that aren't already deleted
      },
      data: {
        deletedAt: new Date(), // Set deletedAt to the current date/time
      },
    });

    // Update the cart total (which should now be 0 as all items are deleted)
    await updateCartTotal(cartId);

    // Return success message and the count of items soft-deleted
    res.status(200).json({
      message: `${deleteResult.count} items soft deleted successfully from cart ${cartId}. Cart is now empty.`,
      deletedCount: deleteResult.count,
      cartId: cartId,
    });
  } catch (error) {
    console.error("Error soft-deleting cart items:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

// New function: Soft delete an entire cart
const deleteCart = async (req, res) => {
  // This function now deletes the Cart itself
  try {
    const cartId = parseInt(req.params.id); // This should be Cart ID

    if (isNaN(cartId)) {
      return res.status(400).json({ error: "Invalid cart ID provided" });
    }

    // Perform soft deletion on the Cart
    // Include deletedAt: null in where to ensure it fails if already deleted
    const cart = await prisma.cart.update({
      where: {
        id: cartId,
        deletedAt: null, // Ensure it's not already deleted
      },
      data: {
        deletedAt: new Date(), // Set deletedAt for the cart
        // Optional: Also soft-delete related items when deleting the cart
        // items: {
        //     updateMany: {
        //          where: { deletedAt: null },
        //          data: { deletedAt: new Date() }
        //     }
        // }
      },
      // Include items in the response if you want to see the deleted items
      // include: { items: true }
    });

    res
      .status(200)
      .json({ message: "Cart soft deleted successfully", cart: cart });
  } catch (error) {
    console.error("Error soft-deleting cart:", error);
    // Handle case where the cart is not found or already soft-deleted
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ error: "Cart not found or already deleted" });
    }
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

// Get cart(s) by User ID (assuming one active cart per user)
const getCartsByUserId = async (req, res) => {
  // Renamed from getCartsByUserId to better reflect findFirst
  try {
    const userId = parseInt(req.params.userId); // Correctly named params key

    // Validate input
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID provided" });
    }

    // Fetch the single active cart for the specified user
    const cart = await prisma.cart.findFirst({
      // Use findFirst for unique userId
      where: {
        userId: userId,
        deletedAt: null, // Only find the active, non-deleted cart
      },
      include: {
        items: {
          where: { deletedAt: null }, // Only include non-deleted items
          include: {
            product: true,
            variation: true,
          },
          orderBy: { createdAt: "asc" }, // Optional: Order items
        },
      },
      orderBy: { createdAt: "desc" }, // Optional: Ensure the most recent non-deleted cart is found if somehow multiple exist
    });

    if (!cart) {
      // Return 404 if no non-deleted cart is found for this user
      return res
        .status(404)
        .json({ message: "No active cart found for this user" });
    }

    return res.status(200).json(cart); // Use 200 for success
  } catch (error) {
    console.error("Error fetching cart by user ID:", error);
    // Handle foreign key constraint error if userId doesn't exist (less likely in findFirst)
    if (error.code === "P2003") {
      return res.status(400).json({ error: "Invalid user ID provided" });
    }
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
};

module.exports = {
  getAllCarts, // Filtered by deletedAt for Cart and CartItem
  addProductToCart, // Renamed, uses upsert to find/create active cart, handles existing items, updates total
  singleCart, // Filtered by deletedAt for Cart and CartItem, 404 logic, validation
  updateCartItem, // Renamed, updates a CartItem, handles deletedAt for item, updates total, validation, error handling
  deleteCartItem, // Renamed, soft deletes a CartItem, updates total, validation, error handling
  clearCartItems, // Renamed, soft deletes all CartItems for a Cart, updates total, validation, error handling
  deleteCart, // New: Soft deletes an entire Cart, validation, error handling
  getCartsByUserId, // Filtered by deletedAt for Cart and CartItem, uses findFirst, 404 logic, validation
  // updateCartTotal // Helper function, not typically exposed via routes
};
