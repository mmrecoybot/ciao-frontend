// Assume Order model includes:
// model Order {
//   id          Int       @id @default(autoincrement())
//   userId      Int
//   user        User      @relation(fields: [userId], references: [id])
//   status      String    @default("pending") // e.g., "pending", "processing", "shipped", "delivered", "cancelled"
//   total       Decimal // Use Decimal for currency
//   orderNumber String    @unique
//   subtotal    Decimal
//   tax         Decimal?
//   discount    Decimal?
//   shippingCost Decimal?
//   paymentMethod String?
//   paymentProof  String? // File path or URL
//   paymentDate DateTime?
//   shippingDate DateTime?
//   deliveryDate DateTime?
//   createdAt   DateTime  @default(now())
//   updatedAt   DateTime  @updatedAt
//   deletedAt   DateTime? // NULL means not deleted
//   OrderItem   OrderItem[]
//   OrderStatusHistory OrderStatusHistory[]
//   // remarks is often a field on OrderStatusHistory, not Order itself
// }

// Assume OrderItem model includes:
// model OrderItem {
//   id          Int       @id @default(autoincrement())
//   orderId     Int
//   order       Order     @relation(fields: [orderId], references: [id])
//   productId   Int
//   product     Product   @relation(fields: [productId], references: [id])
//   variationId Int
//   variation   ProductVariation @relation(fields: [variationId], references: [id])
//   quantity    Int
//   price       Decimal // Price *per item* at time of order
//   discount    Decimal? // Discount *per item* at time of order
//   color       String? // Redundant if using Variation relation, but kept from original
//   img         String? // Redundant if using Variation relation, but kept from original
//   createdAt   DateTime  @default(now())
//   updatedAt   DateTime  @updatedAt
//   deletedAt   DateTime? // NULL means not deleted
// }

// Assume OrderStatusHistory model includes:
// model OrderStatusHistory {
//   id           Int       @id @default(autoincrement())
//   orderId      Int
//   order        Order     @relation(fields: [orderId], references: [id])
//   status       String // The status at this point in time
//   changedAt    DateTime  @default(now())
//   changedById  Int
//   changedBy    User      @relation(fields: [changedById], references: [id]) // Assuming User model
//   remarks      String?
// }

const prisma = require("../../config/db");
const { generateOrderId } = require("../../lib"); // Assuming this function exists and works



// Get all orders (excluding soft-deleted orders and their soft-deleted items)
const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { deletedAt: null }, // Add this condition for the order
      include: {
        OrderItem: {
          where: { deletedAt: null }, // Only include non-deleted items
          include: {
            variation: {
              include: { product: { select: { name: true, brand: true } } }, // Keep original includes
            },
          },
          orderBy: { createdAt: "asc" }, // Optional: Order items
        },
        user: {
          // Include user details
          select: {
            name: true,
            email: true,
            dealer: {
              select: {
                companyName: true,
                billingAddress: true,
                adminEmail: true,
                adminPhone: true,
              },
            },
          },
        },
        // OrderStatusHistory is usually not soft-deleted, include all history for the order
        OrderStatusHistory: {
          orderBy: { changedAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" }, // Keep original ordering
    });
    res.status(200).json(orders); // Use status 200
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

// Add a new order
const addNewOrder = async (req, res) => {
  try {
    const {
      userId,
      products, // Array of { productId, quantity, variationId }
      tax,
      discount,
      shippingCost,
      paymentMethod,
      paymentProof,
      paymentDate,
      // total is calculated server-side based on products and costs
      // subtotal is calculated server-side based on products
    } = req.body;

    // Validation
    if (
      userId === undefined ||
      !products ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return res
        .status(400)
        .json({
          error: "User ID and a non-empty array of products are required",
        });
    }
    const userIdNum = Number(userId);
    if (isNaN(userIdNum)) {
      return res.status(400).json({ error: "Invalid User ID provided" });
    }

    // Validate each product item
    if (
      !products.every(
        (p) =>
          p.productId !== undefined &&
          p.quantity !== undefined &&
          p.variationId !== undefined &&
          Number(p.quantity) > 0
      )
    ) {
      return res
        .status(400)
        .json({
          error:
            "Each product must have valid productId, quantity (> 0), and variationId",
        });
    }

    // Generate a unique order number
    const orderNumber = await generateOrderId(userIdNum); // Use numeric userId if generateOrderId expects it

    // Use a transaction for atomicity: create order, create items, update stock, create status history
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create the order first
      const newOrder = await tx.order.create({
        data: {
          userId: userIdNum,
          status: "pending", // Set the initial status to "Pending"
          total: 0, // Calculate total server-side
          orderNumber: orderNumber,
          subtotal: 0, // Calculate subtotal server-side initially
          tax: tax !== undefined ? parseFloat(tax) : undefined,
          discount: discount !== undefined ? parseFloat(discount) : undefined,
          shippingCost:
            shippingCost !== undefined ? parseFloat(shippingCost) : undefined,
          paymentMethod,
          paymentProof,
          paymentDate: paymentDate,
          // deletedAt is null by default
        },
      });

      let calculatedSubtotal = 0;
      const orderItemsData = []; // Prepare data for batch creation if possible

      // 2. Loop through the products, create order items, and update stock
      for (const product of products) {
        const { productId, quantity, variationId } = product;
        const productIdNum = Number(productId);
        const variationIdNum = Number(variationId);
        const quantityNum = Number(quantity);

        // Fetch the product and its variation within the transaction
        const productData = await tx.product.findUnique({
          where: { id: productIdNum },
          select: {
            id: true,
            dealer_price: true,
            discount: true,
            variations: { where: { id: variationIdNum } },
          }, // Only fetch necessary fields
        });

        if (!productData) {
          throw new Error(`Product with ID ${productId} not found`);
        }
        if (!productData.variations || productData.variations.length === 0) {
          throw new Error(
            `Variation with ID ${variationId} not found for product ${productId}`
          );
        }
        const selectedVariation = productData.variations[0];

        // Check if there's enough stock for the selected variation *within the transaction*
        if (selectedVariation.stock < quantityNum) {
          throw new Error(
            `Not enough stock for the selected variation (ID: ${variationId}). Available: ${selectedVariation.stock}, Requested: ${quantityNum}`
          );
        }

        // Calculate the price and discount for this item based on product/variation data at time of order
        const itemPrice = parseFloat(productData.dealer_price); // Price per unit
        const itemDiscount =
          productData.discount !== undefined
            ? parseFloat(productData.discount)
            : 0; // Discount per unit
        const itemTotal = itemPrice * quantityNum;
        calculatedSubtotal += itemTotal;

        // Add data for OrderItem creation
        orderItemsData.push({
          orderId: newOrder.id,
          productId: productIdNum,
          variationId: variationIdNum,
          quantity: quantityNum,
          price: itemPrice,
          discount: itemDiscount, // Store discount per item
          color: selectedVariation.color, // These might be redundant if variation is included in fetch later
          img: selectedVariation.img,
          deletedAt: null, // Ensure deletedAt is null
        });

        // Update stock for the selected variation *within the transaction*
        await tx.productVariation.update({
          where: { id: variationIdNum },
          data: { stock: selectedVariation.stock - quantityNum },
        });
      }

      // 3. Create all order items in one batch (more efficient)
      await tx.orderItem.createMany({
        data: orderItemsData,
      });

      // 4. Update the order with the calculated subtotal and final total
      const finalTotal =
        calculatedSubtotal +
        (tax !== undefined ? parseFloat(tax) : 0) -
        (discount !== undefined ? parseFloat(discount) : 0) +
        (shippingCost !== undefined ? parseFloat(shippingCost) : 0);

      const updatedOrder = await tx.order.update({
        where: { id: newOrder.id },
        data: {
          subtotal: calculatedSubtotal,
          total: finalTotal,
        },
        // Include items and history in the transaction's return value
        include: {
          OrderItem: {
            where: { deletedAt: null }, // Only include non-deleted items
            include: {
              variation: true,
              product: true, // Include product details
            },
          },
          OrderStatusHistory: true, // Include history
        },
      });

      // 5. Add initial status history for the "Pending" status
      await tx.orderStatusHistory.create({
        data: {
          orderId: updatedOrder.id, // Use the ID of the updated order
          status: "pending",
          changedById: userIdNum, // Use the numeric userId
          remarks: "Order created and marked as Pending",
        },
      });

      // 6. Create initial workflow for the order
      // Assuming a workflow needs to be created for each new order
      // This might need more complex logic based on workflow type/setup
      await tx.workflow.create({
        data: {
          type: "Order", // or some specific order workflow type
          referenceId: updatedOrder.id.toString(),
          status: "Pending",
          deletedAt: null, // Ensure workflow is not deleted
          steps: {
            // Add an initial step
            create: {
              action: "Order Created",
              actorId: userIdNum, // The user who placed the order
              actorRole: "User", // Or derive role based on user type
              // deletedAt is null by default for the step
            },
          },
        },
      });

      // Return the updated order with items from the transaction
      return updatedOrder;
    });

    // Create notification *after* the transaction succeeds
    await prisma.notification.create({
      data: {
        title: `New Order Created: ${order.orderNumber}`,
        body: `Your order has been placed successfully with status: ${order.status}`,
        userId: userIdNum, // Use the numeric userId
        seen: false,
        deletedAt: null, // Ensure notification is not deleted
      },
    });

    res.status(201).json(order); // Use 201 for resource creation
  } catch (error) {
    console.error("Error creating order:", error);
    // Handle specific Prisma errors outside transaction block
    if (error.code === "P2002") {
      // Unique constraint violation (e.g., orderNumber)
      return res
        .status(409)
        .json({
          error: `Order number "${error.meta?.target}" already exists. Try again.`,
        }); // Or implement retry logic
    }
    if (error.code === "P2003") {
      // Foreign key constraint failed (e.g., invalid userId, productId, variationId)
      return res
        .status(400)
        .json({ error: "Invalid user, product, or variation ID provided" });
    }
    // Handle custom errors thrown during the transaction
    if (
      error.message.includes("not found") ||
      error.message.includes("stock")
    ) {
      return res.status(400).json({ error: error.message });
    }
    res
      .status(500)
      .json({ error: "Error creating order", details: error.message }); // Generic 500 for unexpected errors
  }
};

// Get a single order by ID (excluding soft-deleted order and its soft-deleted items)
const singleOrder = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    if (isNaN(orderId)) {
      return res.status(400).json({ error: "Invalid Order ID provided" });
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        deletedAt: null, // Add this condition for the order
      },
      include: {
        user: {
          // Include user details
          select: {
            id: true, // Include user ID
            name: true,
            email: true,
            dealer: {
              select: {
                id: true, // Include dealer ID
                companyName: true,
                billingAddress: true, // Billing address also needs deletedAt check if applicable
                adminEmail: true,
                adminPhone: true,
              },
            },
          },
        },
        OrderItem: {
          where: { deletedAt: null }, // Only include non-deleted items
          include: {
            product: {
              select: {
                id: true,
                name: true,
                dealer_price: true,
                discount: true,
              },
            }, // Include product details
            variation: {
              select: {
                id: true,
                color: true,
                img: true,
                stock: true,
              },
            }, // Include variation details
          },
          orderBy: { createdAt: "asc" }, // Optional: Order items
        },
        // OrderStatusHistory is usually not soft-deleted, include all history for the order
        OrderStatusHistory: {
          orderBy: { changedAt: "asc" },
          include: {
            changedBy: { select: { id: true, name: true, email: true } }, // Include who changed the status
          },
        },
      },
    });
    if (!order) {
      // Return 404 if not found or if it exists but is soft-deleted
      return res.status(404).json({ error: "Order not found or is deleted" });
    }
    res.status(200).json(order); // Use status 200
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

// Update an order (status, proofs, etc. and potentially its items)
// This function is complex and combines multiple concerns.
// Consider splitting into smaller functions (e.g., updateOrderStatus, updateOrderItems)
const updateOrder = async (req, res) => {
  try {
    // The order ID should ideally come from params, not body, for PATCH/PUT
    const orderId = parseInt(req.params.id); // Get orderId from params
    if (isNaN(orderId)) {
      return res
        .status(400)
        .json({ error: "Invalid Order ID provided in params" });
    }

    const {
      status, // New status
      remarks, // Remarks for status change
      userId, // ID of the user/actor making the change (crucial for history)
      products, // Optional array of new products to replace existing items
      deliveryProof, // Optional delivery proof file path/URL
      orderDocument, // Optional order document file path/URL
      deletedAt, // Optional: Allow setting deletedAt to null for undelete
    } = req.body; // Expecting status, remarks, userId, optional products, optional proofs, optional deletedAt

    // Validation: Ensure required fields are provided in the body
    // Check if status is a valid status (e.g., "pending", "processing", "shipped", "delivered", "cancelled")
    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ]; // Define your valid statuses
    if (
      !status ||
      !validStatuses.includes(status.toLowerCase()) ||
      userId === undefined
    ) {
      // Ensure status is valid
      return res.status(400).json({
        error:
          "Valid status and userId (of the actor making the change) are required",
        validStatuses: validStatuses,
      });
    }
    const userIdNum = Number(userId);
    if (isNaN(userIdNum)) {
      return res.status(400).json({ error: "Invalid userId provided in body" });
    }

    // Use a transaction for atomicity when updating items and stock
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // 1. Fetch the existing order within the transaction
      // Only update a non-deleted order. If status prevents update, P2025 will catch it.
      const existingOrder = await tx.order.findUnique({
        where: {
          id: orderId,
          deletedAt: null, // Only update non-deleted orders
          // Add conditions to prevent status changes from disallowed states if needed
          // E.g., status: { not: 'delivered' } // Cannot change status if already delivered
        },
        include: {
          OrderItem: {
            // Include items to potentially restore stock or soft-delete
            include: {
              variation: true, // Include variation for stock
              // product: true // Include product if needed for item updates
            },
            where: { deletedAt: null }, // Only consider non-deleted items currently
          },
        },
      });

      if (!existingOrder) {
        // This will be caught by the outer try-catch with P2025 if using `where` filter
        // If not using where filter on deletedAt, manually check:
        // if (!existingOrder || existingOrder.deletedAt) {
        //     throw new Error("Order not found or is deleted", { cause: { code: 'P2025' } }); // Throw with P2025 code
        // }
        throw new Error("Order not found or is deleted", {
          cause: { code: "P2025" },
        }); // P2025 will be caught
      }

      // --- Handle stock adjustments based on status changes ---
      // This is complex business logic. Example: Restore stock if status changes to 'cancelled'.
      // If you replace items, you typically restore old item stock and deduct new item stock.

      // Example logic: Restore stock if changing *to* Cancelled status
      if (
        status.toLowerCase() === "cancelled" &&
        existingOrder.status.toLowerCase() !== "cancelled"
      ) {
        for (const item of existingOrder.OrderItem) {
          await tx.productVariation.update({
            where: { id: item.variationId },
            data: { stock: item.variation.stock + item.quantity },
          });
        }
      }

      // --- Handle Item Updates (if products array is provided) ---
      if (products && Array.isArray(products)) {
        // Validate new product items
        if (
          !products.every(
            (p) =>
              p.productId !== undefined &&
              p.quantity !== undefined &&
              p.variationId !== undefined &&
              Number(p.quantity) > 0
          )
        ) {
          throw new Error(
            `Invalid product data in update array. Each item needs productId, quantity (>0), variationId.`,
            { cause: { code: "P2003" } }
          ); // Use P2003 for bad input data
        }

        // Option 1 (current logic): Soft-delete ALL existing non-deleted items and create new ones.
        // This is simpler but loses history/specific data on old items.
        await tx.orderItem.updateMany({
          where: {
            orderId: orderId,
            deletedAt: null, // Only soft-delete items that are currently non-deleted
          },
          data: {
            deletedAt: new Date(),
          },
        });

        // Restore stock for the items we just soft-deleted (if not already done by status change)
        // This might be redundant if cancelling, but needed if just replacing items in other statuses.
        // Check if stock was *not* restored by a status change (e.g., not changing to 'cancelled')
        if (
          !(
            status.toLowerCase() === "cancelled" &&
            existingOrder.status.toLowerCase() !== "cancelled"
          )
        ) {
          for (const item of existingOrder.OrderItem) {
            await tx.productVariation.update({
              where: { id: item.variationId },
              data: { stock: item.variation.stock + item.quantity }, // Restore stock of old items
            });
          }
        }

        // Create new items and deduct stock for the new list
        let newCalculatedSubtotal = 0;
        const newItemCreationData = [];

        for (const product of products) {
          const { productId, quantity, variationId } = product;
          const productIdNum = Number(productId);
          const quantityNum = Number(quantity);
          const variationIdNum = Number(variationId);

          const productData = await tx.product.findUnique({
            // Fetch product data for pricing
            where: { id: productIdNum },
            select: {
              id: true,
              dealer_price: true,
              discount: true,
              variations: { where: { id: variationIdNum } },
            },
          });

          if (
            !productData ||
            !productData.variations ||
            productData.variations.length === 0
          ) {
            throw new Error(
              `Product or Variation not found for item: productId=${productId}, variationId=${variationId}`,
              { cause: { code: "P2003" } }
            ); // Use P2003 for invalid ref
          }
          const selectedVariation = productData.variations[0];

          // Check stock for the *new* items *after* restoring old stock
          if (selectedVariation.stock < quantityNum) {
            throw new Error(
              `Not enough stock for updated item variation (ID: ${variationId}). Available: ${selectedVariation.stock}, Requested: ${quantityNum}`,
              { cause: { code: "STOCK_ERROR" } }
            ); // Use a custom code if helpful
          }

          const itemPrice = parseFloat(productData.dealer_price);
          const itemDiscount =
            productData.discount !== undefined
              ? parseFloat(productData.discount)
              : 0;
          newCalculatedSubtotal += itemPrice * quantityNum; // Recalculate subtotal

          newItemCreationData.push({
            orderId: orderId,
            productId: productIdNum,
            variationId: variationIdNum,
            quantity: quantityNum,
            price: itemPrice, // Store price at time of update
            discount: itemDiscount, // Store discount at time of update
            // color: selectedVariation.color, // Redundant
            // img: selectedVariation.img, // Redundant
            deletedAt: null, // Ensure new items are not deleted
          });

          // Deduct stock for the new item
          await tx.productVariation.update({
            where: { id: variationIdNum },
            data: { stock: selectedVariation.stock - quantityNum },
          });
        } // End loop for new items

        // Create the new order items in batch
        if (newItemCreationData.length > 0) {
          await tx.orderItem.createMany({
            data: newItemCreationData,
          });
        }

        // Update the order's subtotal based on the new items
        await tx.order.update({
          where: { id: orderId },
          data: { subtotal: newCalculatedSubtotal },
        });

        // Note: This logic completely replaces items. If you need to update quantities of existing items,
        // add/remove items individually, it's much more complex. The original code did a full replace.
      } // End if products provided

      // --- Prepare data for updating the Order record itself ---
      const orderUpdateData = {
        status: status.toLowerCase(), // Store status in lowercase for consistency
        // Use optional chaining for fields that might not be in the body
        ...(remarks !== undefined && { remarks: remarks }), // remarks might be on Order or only on History
        ...(deliveryProof !== undefined && { deliveryProof: deliveryProof }),
        ...(orderDocument !== undefined && { orderDocument: orderDocument }),
      };

      // Handle automatic date setting based on status transitions
      if (status.toLowerCase() === "shipped" && !existingOrder.shippingDate) {
        orderUpdateData.shippingDate = new Date().toISOString(); // Use Date object
      }
      if (status.toLowerCase() === "delivered" && !existingOrder.deliveryDate) {
        orderUpdateData.deliveryDate = new Date().toISOString();
      }
      if (
        status.toLowerCase() === "processing" &&
        !existingOrder.paymentConfirmationDate
      ) {
        orderUpdateData.paymentConfirmationDate = new Date().toISOString();
      }
      if (
        status.toLowerCase() === "cancelled" &&
        !existingOrder.cancelledDate
      ) {
        // Assuming cancelledDate field exists
        // This should align with the stock restoration logic above
        // orderUpdateData.cancelledDate = new Date();
      }
      // If 'remarks' is only on history, remove from orderUpdateData
      // if (orderUpdateData.remarks !== undefined) delete orderUpdateData.remarks;

      // Allow setting deletedAt explicitly (e.g., to null for undelete)
      if (deletedAt !== undefined) {
        orderUpdateData.deletedAt =
          deletedAt === null ? null : new Date(deletedAt);
      }

      // 5. Update the order record
      const resultOrder = await tx.order.update({
        where: { id: orderId }, // Update by ID regardless of deleted status for undelete case
        data: orderUpdateData,
        // Include relations in the transaction's return value
        include: {
          OrderItem: {
            where: { deletedAt: null }, // Only include non-deleted items in response
            include: {
              variation: true,
              product: true,
            },
          },
          OrderStatusHistory: {
            orderBy: { changedAt: "asc" },
            include: {
              changedBy: { select: { id: true, name: true, email: true } },
            },
          },
          user: {
            // Include user details
            select: {
              id: true,
              name: true,
              email: true,
              dealer: {
                select: {
                  id: true,
                  companyName: true,
                  billingAddress: true,
                  adminEmail: true,
                  adminPhone: true,
                },
              },
            },
          },
        },
      });

      // 6. Log the status change to the history table
      // This will be created even if the order was undeleted and status changed
      await tx.orderStatusHistory.create({
        data: {
          orderId: orderId, // Connect to the Order using its ID
          status: status.toLowerCase(), // Store status in lowercase
          changedAt: new Date(),
          changedById: userIdNum, // Connect to the User using the provided userId
          remarks: remarks,
        },
      });

      // 7. Update workflow status if applicable (assuming workflow exists and is linked by referenceId)
      // This assumes a workflow exists for this order (referenceId = orderId)
      // And we want to update its status based on the order status
      // Find the non-deleted workflow for this order
      const workflow = await tx.workflow.findFirst({
        where: {
          type: "Order", // Match the type used during creation
          referenceId: orderId.toString(),
          deletedAt: null, // Only update non-deleted workflows
        },
        orderBy: { createdAt: "desc" }, // Get the most recent workflow
      });

      if (workflow) {
        await tx.workflow.update({
          where: { id: workflow.id },
          data: {
            status: status, // Set workflow status to match order status
            // You might want to add a step here too
            // steps: { create: { action: `Order Status: ${status}`, actorId: userIdNum, actorRole: 'System' } }
          },
        });
      }

      return resultOrder; // Return the updated order object from the transaction
    }); // End of transaction

    // 8. Create notification *after* the transaction succeeds
    // Note: You might want different notification logic depending on the status change
    await prisma.notification.create({
      data: {
        title: `Order no ${updatedOrder.orderNumber} Status Updated`,
        body: `Status changed to: ${status.toLowerCase()}${remarks ? " - " + remarks : ""
          }`, // Use a more descriptive body
        userId: updatedOrder.userId, // Notify the user who owns the order
        seen: false,
        deletedAt: null, // Ensure notification is not deleted
      },
    });

    res.status(200).json(updatedOrder); // Use status 200 for success
  } catch (error) {
    console.error("Error updating order:", error);
    // Handle specific Prisma errors
    if (error.code === "P2025") {
      // Record to update not found
      return res
        .status(404)
        .json({
          error:
            "Order not found, is deleted, or cannot be updated in its current state",
        });
    }
    if (error.code === "P2003") {
      // Foreign key constraint failed (e.g., invalid userId, productId, variationId)
      return res
        .status(400)
        .json({
          error:
            "Invalid user, product, or variation ID provided in update data",
        });
    }
    // Handle custom stock errors thrown during the transaction
    if (error.message.includes("stock")) {
      return res.status(400).json({ error: error.message });
    }
    res
      .status(500)
      .json({ error: "Error updating order", details: error.message }); // Generic 500 for unexpected errors
  }
};

// Delete an order (soft delete) and its items (soft delete)
const deleteOrder = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id); // Expecting the orderId in the request params

    // Validation: Ensure orderId is provided and is a number
    if (isNaN(orderId)) {
      return res.status(400).json({ error: "Invalid Order ID provided" });
    }

    // Use a transaction for atomicity
    const softDeletedOrder = await prisma.$transaction(async (tx) => {
      // 1. Fetch the order within the transaction to get its items and status
      // Only allow soft-deleting a non-deleted order
      const orderToSoftDelete = await tx.order.findUnique({
        where: {
          id: orderId,
          deletedAt: null, // Ensure it's not already deleted
        },
        include: {
          OrderItem: {
            where: { deletedAt: null }, // Only get non-deleted items currently in the order
            include: {
              variation: true, // Include variation to restore stock
            },
          },
        },
      });

      if (!orderToSoftDelete) {
        // This will be caught by the outer try-catch with P2025
        throw new Error("Order not found or already deleted", {
          cause: { code: "P2025" },
        });
      }

      // 2. Restore stock of the items being soft-deleted
      // This assumes deleting an order implies returning stock. Adjust business logic as needed.
      // It might also depend on the order's current status.
      if (orderToSoftDelete.status !== "cancelled") {
        // Only restore stock if the order wasn't already cancelled
        for (const item of orderToSoftDelete.OrderItem) {
          // Ensure variation exists before attempting to update stock
          if (item.variation) {
            await tx.productVariation.update({
              where: { id: item.variationId },
              data: { stock: item.variation.stock + item.quantity },
            });
          } else {
            console.warn(
              `Variation ${item.variationId} not found for item ${item.id} during stock restoration for order ${orderId}`
            );
          }
        }
      }

      // 3. Soft-delete the order items linked to this order
      // Only soft-delete items that are currently non-deleted
      await tx.orderItem.updateMany({
        where: {
          orderId: orderId,
          deletedAt: null, // Ensure it's not already deleted
        },
        data: { deletedAt: new Date() },
      });

      // 4. Soft-delete the order itself
      const updatedOrder = await tx.order.update({
        where: { id: orderId }, // The deletedAt: null check was done on the initial fetch
        data: { deletedAt: new Date() },
        // Include items and history in the transaction's return value if needed
        include: {
          OrderItem: true, // Includes all items, even the ones just soft-deleted
          // If you want only non-deleted items in the response, add where: { deletedAt: null }
          // OrderItem: { where: { deletedAt: null } }
        },
      });

      // Optional: Soft-delete related workflow if it exists
      // Find the non-deleted workflow for this order
      const workflow = await tx.workflow.findFirst({
        where: {
          type: "Order", // Match the type
          referenceId: orderId,
          deletedAt: null, // Only update non-deleted workflows
        },
        orderBy: { createdAt: "desc" }, // Get the most recent workflow
      });

      if (workflow) {
        await tx.workflow.update({
          where: { id: workflow.id },
          data: { deletedAt: new Date() }, // Soft delete the workflow
        });
      }

      return updatedOrder; // Return the soft-deleted order from the transaction
    }); // End of transaction

    // Create notification *after* the transaction succeeds
    // This notification will go to the user who placed the order
    await prisma.notification.create({
      data: {
        title: `Order no ${softDeletedOrder.orderNumber} Deleted`,
        body: `Your order has been soft deleted.`, // Or a more descriptive message
        userId: softDeletedOrder.userId, // Notify the user who owns the order
        seen: false,
        deletedAt: null, // Ensure notification is not deleted
      },
    });

    // Return a success message for soft deletion
    res.status(200).json({
      message: "Order and associated items have been soft deleted successfully",
      order: softDeletedOrder, // Return the soft-deleted order object
    });
  } catch (error) {
    console.error("Error soft-deleting order:", error);
    // Handle specific Prisma errors
    if (error.code === "P2025") {
      // Record to update not found
      return res
        .status(404)
        .json({ error: "Order not found or already deleted" });
    }
    res
      .status(500)
      .json({ error: "Error soft-deleting order", details: error.message });
  }
};

// Get orders by User ID (excluding soft-deleted orders and their soft-deleted items)
const getOrdersByUserId = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId); // Correctly named params key

    // Validation: Ensure userId is provided and is a number
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid User ID provided" });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
        deletedAt: null, // Only find non-deleted orders for this user
      },
      include: {
        OrderItem: {
          where: { deletedAt: null }, // Only include non-deleted items
          include: {
            product: {
              select: {
                id: true,
                name: true,
                dealer_price: true,
                discount: true,
              },
            }, // Include product details
            variation: {
              select: {
                id: true,
                color: true,
                img: true,
                stock: true,
              },
            }, // Include variation details
          },
          orderBy: { createdAt: "asc" }, // Optional: Order items
        },
        // OrderStatusHistory is usually not soft-deleted, include all history for the order
        OrderStatusHistory: {
          orderBy: { changedAt: "asc" },
          include: {
            changedBy: { select: { id: true, name: true, email: true } }, // Include who changed the status
          },
        },
      },
      orderBy: { createdAt: "desc" }, // Keep original ordering
    });

    // Optional: Return 404 if no orders are found for the user (deleted or not)
    // if (orders.length === 0) {
    //      return res.status(404).json({ message: "No orders found for this user" });
    // }

    res.status(200).json(orders); // Use status 200. Empty array is valid if no orders found.
  } catch (error) {
    console.error("Error fetching orders by user ID:", error);
    // Handle foreign key constraint error if userId doesn't exist (less likely in findMany)
    if (error.code === "P2003") {
      return res.status(400).json({ error: "Invalid user ID provided" });
    }
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

// Helper function to generate unique order ID (kept from original)
// async function generateOrderId(userId) { ... }

module.exports = {
  getAllOrders, // Filtered by deletedAt for Order and OrderItem
  addNewOrder, // Uses transaction, handles product/variation validation/stock, calculates subtotal/total, creates history, creates workflow, sends notification
  singleOrder, // Filtered by deletedAt for Order and OrderItem, 404 logic, validation
  updateOrder, // Uses transaction, handles status changes, product item replacement (soft delete old items), stock adjustments, logs history, updates workflow, sends notification, validation, error handling (including P2025 for deleted/un-updatable orders)
  deleteOrder, // Changed to soft delete (Order and OrderItems), uses transaction, restores stock, updates workflow, sends notification, validation, error handling (including P2025 for deleted orders)
  getOrdersByUserId, // Filtered by deletedAt for Order and OrderItem, validation, error handling
  // generateOrderId // Helper function, not typically exposed via routes
  // updateOrderSubtotal // Helper function, not typically exposed via routes
};
