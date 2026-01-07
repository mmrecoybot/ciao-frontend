// model Product {
//     id             Int         @id @default(autoincrement())
//     name           String
//     description    String?
//     descriptionIt  String? // Added based on update logic
//     dealer_price   Decimal     // Use Decimal for currency
//     retail_price   Decimal
//     purchase_price Decimal
//     margin         Decimal
//     product_code   String      @unique // Assuming unique
//     categoryId     Int
//     category       Category    @relation(fields: [categoryId], references: [id])
//     subCategoryId  Int
//     subCategory    SubCategory @relation(fields: [subCategoryId], references: [id])
//     brandId        Int?        // Optional based on your default logic
//     brand          Brand?      @relation(fields: [brandId], references: [id])
//     createdAt      DateTime    @default(now())
//     updatedAt      DateTime    @updatedAt
//     deletedAt      DateTime?   // NULL means not deleted
//     variations     ProductVariation[]
//     OrderItem      OrderItem[] // Relation back to OrderItem if needed for reference
//   }

// model ProductVariation {
//     id          Int       @id @default(autoincrement())
//     productId   Int
//     product     Product   @relation(fields: [productId], references: [id])
//     img         String? // File path or URL
//     color       String?
//     stock       Int       @default(0)
//     size        String? // Added based on OrderItem include
//     createdAt   DateTime  @default(now())
//     updatedAt   DateTime  @updatedAt
//     deletedAt   DateTime? // NULL means not deleted
//     OrderItem   OrderItem[] // Relation back to OrderItem if needed for reference
//   }

const prisma = require("../../config/db");
const { generateProductCode } = require("../../lib"); // Assuming this exists and works

// product functions
const getAllProducts = async (req, res) => {
  try {
    // Use a transaction for fetching products and counts atomically
    const [products, categoryCounts, subCategoryCounts, brandCounts] =
      await prisma.$transaction([
        // Fetch only non-deleted products
        prisma.product.findMany({
          where: { deletedAt: null }, // Add this condition for the product
          include: {
            variations: {
              where: { deletedAt: null }, // Only include non-deleted variations
              orderBy: { id: "asc" }, // Optional: Order variations
            },
            category: true, // Include category details
            subCategory: true, // Include subCategory details
            brand: true, // Include brand details
          },
          orderBy: { createdAt: "desc" }, // Optional: Order products
        }),
        // Count only non-deleted products per category
        prisma.category.findMany({
          select: {
            id: true,
            name: true,
            _count: {
              select: {
                products: {
                  // Assuming relation name is 'products'
                  where: { deletedAt: null }, // Count only non-deleted products
                },
              },
            },
          },
          where: { deletedAt: null }, // Optional: Only include non-deleted categories themselves in counts
        }),
        // Count only non-deleted products per subCategory
        prisma.subCategory.findMany({
          select: {
            id: true,
            name: true,
            category: true,
            _count: {
              select: {
                Product: {
                  // Assuming relation name is 'Product'
                  where: { deletedAt: null }, // Count only non-deleted products
                },
              },
            },
          },
          where: { deletedAt: null }, // Optional: Only include non-deleted subCategories themselves in counts
        }),
        // Count only non-deleted products per brand
        prisma.brand.findMany({
          select: {
            id: true,
            name: true,
            _count: {
              select: {
                products: {
                  // Assuming relation name is 'products'
                  where: { deletedAt: null }, // Count only non-deleted products
                },
              },
            },
          },
          where: { deletedAt: null }, // Optional: Only include non-deleted brands themselves in counts
        }),
      ]);

    const processedData = {
      products: products, // This now only contains non-deleted products
      counts: {
        // Calculate total count based on the filtered products array length
        all: products.length,
        // Map counts, extracting the filtered count
        categories: categoryCounts.map((c) => ({
          id: c.id,
          name: c.name,
          count: c._count.products,
        })),
        subCategories: subCategoryCounts.map((sc) => ({
          id: sc.id,
          name: sc.name,
          count: sc._count.Product,
          category: sc.category.name,
        })), // Assuming sc.category.name is available
        brands: brandCounts.map((b) => ({
          id: b.id,
          name: b.name,
          count: b._count.products,
        })),
      },
    };

    res.status(200).json(processedData); // Use status 200
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      error: "An error occurred while fetching products",
      details: error.message,
    });
  }
};

const addNewProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      descriptionIt,
      dealer_price,
      retail_price,
      purchase_price,
      margin,
      variations, // Array of { img, color, stock, size? }
      categoryId,
      subCategoryId,
      brandId,
      thumbnail, // Add thumbnail field
    } = req.body;
    console.log("addNewProduct req.body:", req.body); // DEBUG LOG

    // Validation: Make sure required fields are provided and types are correct
    const missingFields = [];
    if (!name) missingFields.push("name");
    if (!description) missingFields.push("description");
    if (dealer_price === undefined || isNaN(parseFloat(dealer_price)))
      missingFields.push("dealer_price");
    if (retail_price === undefined || isNaN(parseFloat(retail_price)))
      missingFields.push("retail_price");
    if (purchase_price === undefined || isNaN(parseFloat(purchase_price)))
      missingFields.push("purchase_price");
    if (margin === undefined || isNaN(parseFloat(margin)))
      missingFields.push("margin");
    if (!variations || !Array.isArray(variations) || variations.length === 0)
      missingFields.push("variations");
    if (categoryId === undefined || isNaN(Number(categoryId)))
      missingFields.push("categoryId");
    if (subCategoryId === undefined || isNaN(Number(subCategoryId)))
      missingFields.push("subCategoryId");

    if (missingFields.length > 0) {
      console.log("Validation Failed. Missing/Invalid Fields:", missingFields); // DEBUG LOG
      return res.status(400).json({
        error: `Missing or invalid required fields: ${missingFields.join(
          ", "
        )}`,
      });
    }

    // Validate each variation item
    if (
      !variations.every(
        (v) =>
          v.img !== undefined &&
          v.color !== undefined &&
          v.stock !== undefined &&
          !isNaN(parseInt(v.stock)) &&
          parseInt(v.stock) >= 0
      )
    ) {
      return res.status(400).json({
        error:
          "Each variation must have valid img, color, and non-negative integer stock",
      });
    }

    const code = await generateProductCode(); // Assuming this generates a unique code

    // Use a transaction for atomicity: create product and variations
    const productWithVariations = await prisma.$transaction(async (tx) => {
      // 1. Create the Product record
      const product = await tx.product.create({
        data: {
          name,
          description,
          descriptionIt, // descriptionIt can be undefined if not provided
          dealer_price: parseFloat(dealer_price),
          retail_price: parseFloat(retail_price),
          purchase_price: parseFloat(purchase_price),
          margin: parseFloat(margin),
          product_code: code, // Use the generated code
          categoryId: Number(categoryId), // Ensure number
          subCategoryId: Number(subCategoryId), // Ensure number
          brandId:
            brandId !== undefined && !isNaN(Number(brandId))
              ? Number(brandId)
              : 1, // Ensure number or default
          thumbnail, // Save thumbnail
          // deletedAt is null by default
        },
      });

      // 2. Prepare data for creating Product Variations
      const variationCreationData = variations.map((variation) => ({
        img: variation.img,
        color: variation.color,
        stock: parseInt(variation.stock), // Stock should be an integer
        size: variation.size, // size is optional
        productId: product.id, // Associate the variation with the created product
        deletedAt: null, // Ensure deletedAt is null for new variations
      }));

      // 3. Create all variations in a batch (more efficient)
      await tx.productVariation.createMany({
        data: variationCreationData,
      });

      // 4. Fetch the product with its variations to return from the transaction
      const createdProduct = await tx.product.findUnique({
        where: { id: product.id },
        include: { variations: { where: { deletedAt: null } } }, // Include created, non-deleted variations
      });

      return createdProduct; // Return the complete product object from the transaction
    }); // End of transaction

    res.status(201).json(productWithVariations); // Use 201 for resource creation
  } catch (error) {
    console.error("Error adding product:", error);
    // Handle specific Prisma errors outside transaction block
    if (error.code === "P2002") {
      // Unique constraint violation (e.g., product_code or name if unique)
      const target = error.meta?.target?.join(", ") || "a unique field";
      return res.status(409).json({
        error: `A product with the provided ${target} already exists.`,
      });
    }
    if (error.code === "P2003") {
      // Foreign key constraint failed (e.g., invalid categoryId, subCategoryId, brandId)
      return res
        .status(400)
        .json({ error: "Invalid category, subCategory, or brand ID provided" });
    }
    // Handle other errors from the transaction
    if (
      error.message.includes("required fields") ||
      error.message.includes("invalid fields")
    ) {
      // Re-throw validation errors from above
      return res.status(400).json({ error: error.message });
    }

    res
      .status(500)
      .json({ error: "Error adding product", details: error.message }); // Generic 500 for unexpected errors
  }
};

// Get a single product (excluding soft-deleted product and its soft-deleted variations)
const singleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid Product ID provided" }); // More specific error
    }

    // Find unique product, but only if deletedAt is null
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
        deletedAt: null, // Add this condition for the product
      },
      include: {
        variations: {
          where: { deletedAt: null }, // Only include non-deleted variations
          orderBy: { id: "asc" }, // Optional: Order variations
        },
        category: true, // Include category details
        subCategory: true, // Include subCategory details
        brand: true, // Include brand details
      },
    });

    if (!product) {
      // Return 404 if not found or if it exists but is soft-deleted
      return res.status(404).json({ error: "Product not found or is deleted" });
    }
    res.status(200).json(product); // Use status 200 for success
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" }); // More specific message
  }
};

// Update a product and its variations
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid Product ID provided" });
    }

    // Extract data, allowing deletedAt to be potentially set (e.g., to null for undelete)
    const {
      name,
      description,
      descriptionIt,
      dealer_price,
      retail_price,
      purchase_price,
      margin,
      variations, // Array of { id?, img, color, stock, size? }
      // categoryId, // Can't change categoryId here based on original code? Assuming not allowed or handled differently.
      subCategoryId,
      brandId,
      deletedAt, // Allow setting deletedAt for the product
      thumbnail, // Add request to update thumbnail
    } = req.body;

    // Use a transaction for atomicity
    const updatedProduct = await prisma.$transaction(async (tx) => {
      // 1. Fetch the product within the transaction to get its current state and variations
      // Do NOT filter by deletedAt: null here, as we need to be able to update/undelete a deleted product.
      const product = await tx.product.findUnique({
        where: { id: productId },
        include: { variations: true }, // Include all variations (deleted or not) to manage them
      });

      if (!product) {
        // This will be caught by the outer try-catch with P2025
        throw new Error("Product not found", { cause: { code: "P2025" } });
      }

      // 2. Prepare data for updating the main product record
      const productUpdateData = {};
      if (name !== undefined) productUpdateData.name = name;
      if (description !== undefined)
        productUpdateData.description = description;
      if (descriptionIt !== undefined)
        productUpdateData.descriptionIt = descriptionIt;
      if (dealer_price !== undefined) {
        const price = parseFloat(dealer_price);
        if (isNaN(price))
          throw new Error("Invalid dealer_price provided", {
            cause: { code: "BAD_INPUT" },
          });
        productUpdateData.dealer_price = price;
      }
      if (retail_price !== undefined) {
        const price = parseFloat(retail_price);
        if (isNaN(price))
          throw new Error("Invalid retail_price provided", {
            cause: { code: "BAD_INPUT" },
          });
        productUpdateData.retail_price = price;
      }
      if (purchase_price !== undefined) {
        const price = parseFloat(purchase_price);
        if (isNaN(price))
          throw new Error("Invalid purchase_price provided", {
            cause: { code: "BAD_INPUT" },
          });
        productUpdateData.purchase_price = price;
      }
      if (margin !== undefined) {
        const marginVal = parseFloat(margin);
        if (isNaN(marginVal))
          throw new Error("Invalid margin provided", {
            cause: { code: "BAD_INPUT" },
          });
        productUpdateData.margin = marginVal;
      }
      if (thumbnail !== undefined) {
        productUpdateData.thumbnail = thumbnail;
      }

      // Allow updating subCategoryId and brandId if provided and valid number
      if (subCategoryId !== undefined) {
        const subCatIdNum = Number(subCategoryId);
        if (isNaN(subCatIdNum))
          throw new Error("Invalid subCategoryId provided", {
            cause: { code: "BAD_INPUT" },
          });
        productUpdateData.subCategoryId = subCatIdNum;
      }
      if (brandId !== undefined) {
        const brandIdNum = Number(brandId);
        // BrandId can be null, allow null but validate if not null
        if (!isNaN(brandIdNum)) productUpdateData.brandId = brandIdNum;
        else if (brandId === null) productUpdateData.brandId = null;
        else
          throw new Error("Invalid brandId provided", {
            cause: { code: "BAD_INPUT" },
          });
      }

      // Handle the deletedAt field for potential undelete/soft-delete of the product
      if (deletedAt !== undefined) {
        productUpdateData.deletedAt =
          deletedAt === null ? null : new Date(deletedAt);
      }

      // 3. Update the main product record
      await tx.product.update({
        where: { id: productId },
        data: productUpdateData,
      });

      // 4. Handle variations if provided
      if (Array.isArray(variations)) {
        // Validate incoming variation data structure and number types
        if (
          !variations.every((v) => {
            const hasId = v.id !== undefined;
            const idIsValid = !hasId || (hasId && !isNaN(Number(v.id)));
            const stockIsValid =
              v.stock === undefined || !isNaN(parseInt(v.stock));
            return idIsValid && stockIsValid;
          })
        ) {
          throw new Error(
            "Invalid variation data in array. Check IDs and stock values.",
            { cause: { code: "BAD_INPUT" } }
          );
        }

        // Get IDs of variations that are currently associated with the product (including soft-deleted ones)
        const currentVariationIds = product.variations.map((v) => v.id);

        // Get IDs from the incoming variations array
        const incomingVariationIds = variations
          .filter((variation) => variation.id !== undefined) // Only consider variations with an ID for updating
          .map((variation) => Number(variation.id));

        // Determine variations to soft-delete: existing variations (including deleted) whose IDs are NOT in the incoming list
        const variationsToSoftDelete = currentVariationIds.filter(
          (id) => !incomingVariationIds.includes(id)
        );

        // Perform soft deletion for removed variations
        if (variationsToSoftDelete.length > 0) {
          await tx.productVariation.updateMany({
            where: {
              id: { in: variationsToSoftDelete },
              deletedAt: null, // Optional: Only update if not already deleted? Or update regardless? Update regardless to ensure they're marked deleted.
            },
            data: {
              deletedAt: new Date(), // Soft delete the variations
            },
          });
        }

        // Update existing variations or create new ones
        const variationPromises = variations.map(async (variation) => {
          const variationId =
            variation.id !== undefined ? Number(variation.id) : undefined;
          const {
            img,
            color,
            stock,
            size,
            deletedAt: variationDeletedAt,
          } = variation; // Allow deletedAt for variation too? (Less common)

          // Build data object for variation update/create, filtering undefined
          const variationData = {};
          if (img !== undefined) variationData.img = img;
          if (color !== undefined) variationData.color = color;
          if (size !== undefined) variationData.size = size; // size is optional
          if (stock !== undefined) {
            const stockInt = parseInt(stock);
            if (isNaN(stockInt) || stockInt < 0)
              throw new Error(
                `Invalid stock value for variation ${variationId || "new"}`,
                { cause: { code: "BAD_INPUT" } }
              );
            variationData.stock = stockInt;
          }

          // Handle deletedAt for individual variation if provided (less common)
          if (variationDeletedAt !== undefined) {
            variationData.deletedAt =
              variationDeletedAt === null ? null : new Date(variationDeletedAt);
          } else {
            // If no deletedAt provided for an *existing* variation being updated,
            // ensure it's marked as NOT deleted if it was previously deleted.
            // If it's a *new* variation, deletedAt is null by default.
            if (variationId !== undefined) {
              // This check is only for existing variations being updated
              const isCurrentlyDeleted =
                product.variations.find((v) => v.id === variationId)
                  ?.deletedAt !== null;
              if (isCurrentlyDeleted) {
                // Implicitly undelete if it exists in the list and no deletedAt is provided
                variationData.deletedAt = null;
              }
            }
          }

          if (variationId !== undefined) {
            // Update existing variation
            const existingVariation = product.variations.find(
              (v) => v.id === variationId
            );
            if (!existingVariation) {
              // This should ideally not happen if incomingVariationIds check is robust
              // but good fallback. Note: P2025 is specific to update/delete where clause.
              throw new Error(
                `Variation with ID ${variationId} not found for this product during update`,
                { cause: { code: "NOT_FOUND" } }
              );
            }

            // If no explicit deletedAt was provided for this variation AND it was previously deleted,
            // ensure we set deletedAt to null to undelete it implicitly when updating.
            // This logic is handled in the `variationData` construction above.

            return tx.productVariation.update({
              where: { id: variationId }, // Update by ID regardless of deleted status
              data: variationData, // Use constructed data
            });
          } else {
            // Create new variation
            // Ensure required fields for new variation are present if they weren't in the initial loop validation
            if (
              variationData.img === undefined ||
              variationData.color === undefined ||
              variationData.stock === undefined
            ) {
              throw new Error(
                `Missing required fields for new variation: img, color, stock`,
                { cause: { code: "BAD_INPUT" } }
              );
            }
            return tx.productVariation.create({
              data: {
                productId: productId, // Associate with the product
                ...variationData, // Use constructed data
                deletedAt: null, // Ensure new variations are not deleted
              },
            });
          }
        });

        // Wait for all variation updates/creations to complete
        await Promise.all(variationPromises);
      } // End if variations array provided

      // 5. Fetch the final updated product with its *non-deleted* variations for the response
      const finalProduct = await tx.product.findUnique({
        where: { id: productId },
        include: {
          variations: {
            where: { deletedAt: null }, // Only include non-deleted variations in the response
            orderBy: { id: "asc" },
          },
          category: true,
          subCategory: true,
          brand: true,
        },
      });

      return finalProduct; // Return the complete product object from the transaction
    }); // End of transaction

    res.status(200).json(updatedProduct); // Use status 200 for success
  } catch (error) {
    console.error("Error updating product:", error);
    // Handle specific Prisma errors caught by the transaction or outer catch
    if (error.code === "P2025") {
      // Record to update not found
      return res.status(404).json({ error: "Product not found" }); // Already handled in transaction, but good fallback
    }
    if (error.code === "P2002") {
      // Unique constraint violation on update (e.g., name or product_code)
      const target = error.meta?.target?.join(", ") || "a unique field";
      return res.status(409).json({
        error: `A product with the provided ${target} already exists.`,
      });
    }
    if (error.code === "P2003") {
      // Foreign key constraint failed (e.g., invalid subCategoryId, brandId) OR custom BAD_INPUT code
      // Check if it's our custom error
      if (error.message.includes("BAD_INPUT")) {
        return res.status(400).json({
          error: error.message.replace(
            ', { "cause": { "code": "BAD_INPUT" } }',
            ""
          ),
        }); // Remove the custom code part
      }
      return res.status(400).json({
        error:
          "Invalid category, subCategory, brand, or variation reference provided",
      });
    }
    // Handle custom errors thrown during the transaction (e.g., stock, NOT_FOUND, BAD_INPUT if not using P2003 cause)
    if (
      error.message.includes("not found") ||
      error.message.includes("stock") ||
      error.message.includes("variation data")
    ) {
      // Depending on how specific you want the client error, parse message further
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({
      error: "An unexpected error occurred while updating the product",
      details: error.message,
    });
  }
};

// Delete a product (soft delete) and its variations (soft delete)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid Product ID provided" });
    }

    // Use a transaction for atomicity
    const softDeletedProduct = await prisma.$transaction(async (tx) => {
      // 1. Fetch the product within the transaction to get its variations
      // Only allow soft-deleting a non-deleted product
      const productToSoftDelete = await tx.product.findUnique({
        where: {
          id: productId,
          deletedAt: null, // Ensure it's not already deleted
        },
        include: {
          variations: { where: { deletedAt: null } }, // Only get non-deleted variations currently linked
        },
      });

      if (!productToSoftDelete) {
        // This will be caught by the outer try-catch with P2025
        throw new Error("Product not found or already deleted", {
          cause: { code: "P2025" },
        });
      }

      // Optional Business Logic: Prevent deletion if related OrderItems exist (depending on your rules)
      // const orderItemsCount = await tx.OrderItem.count({ where: { productId: productId, deletedAt: null } });
      // if (orderItemsCount > 0) {
      //      // You might need to check variations too if items link directly to variations
      //      const variationIds = productToSoftDelete.variations.map(v => v.id);
      //      const orderItemsByVariationCount = await tx.OrderItem.count({ where: { variationId: { in: variationIds }, deletedAt: null } });
      //       if (orderItemsByVariationCount > 0) {
      //           throw new Error("Cannot delete product with existing order items.", { cause: { code: 'DELETE_CONSTRAINT' } });
      //       }
      // }
      // If you decide to delete regardless, consider soft-deleting related OrderItems too.

      // 2. Soft-delete the product variations linked to this product
      // Only soft-delete variations that are currently non-deleted
      await tx.productVariation.updateMany({
        where: {
          productId: productId,
          deletedAt: null, // Ensure it's not already deleted
        },
        data: { deletedAt: new Date() }, // Set deletedAt
      });

      // 3. Soft-delete the product itself
      const updatedProduct = await tx.product.update({
        where: { id: productId }, // The deletedAt: null check was done on the initial fetch
        data: { deletedAt: new Date() }, // Set deletedAt
        // Include variations in the response if you want to see the soft-deleted variations
        // include: { variations: true } // This will include ALL variations (deleted and non-deleted)
        // Or include only the ones just soft-deleted?
        // include: { variations: { where: { id: { in: productToSoftDelete.variations.map(v => v.id) } } } } // Incl non-deleted variations that were just deleted
      });

      return updatedProduct; // Return the soft-deleted product from the transaction
    }); // End of transaction

    // Return a success message for soft deletion
    // Returning 200 with body is clearer for soft delete than 204
    res.status(200).json({
      message: "Product and associated variations soft deleted successfully",
      product: softDeletedProduct,
    });
  } catch (error) {
    console.error("Error soft-deleting product:", error);
    // Handle specific Prisma errors
    if (error.code === "P2025") {
      // Record to update not found (because deletedAt: null was in where)
      return res
        .status(404)
        .json({ error: "Product not found or already deleted" });
    }
    // Handle custom delete constraint errors
    if (error.message.includes("Cannot delete product")) {
      return res.status(400).json({ error: error.message });
    }
    res
      .status(500)
      .json({ error: "Error soft-deleting product", details: error.message });
  }
};

module.exports = {
  getAllProducts, // Filtered by deletedAt for Product and ProductVariation, counts updated
  addNewProduct, // Uses transaction, handles variations, validation, error handling
  singleProduct, // Filtered by deletedAt for Product and ProductVariation, 404 logic, validation
  updateProduct, // Uses transaction, handles Product and Variation updates/creations/soft-deletions, validation, error handling (including P2025 for deleted/un-updatable products)
  deleteProduct, // Changed to soft delete (Product and ProductVariations), uses transaction, validation, error handling (including P2025 for deleted products)
  // generateProductCode // Helper function, not typically exposed via routes
};
