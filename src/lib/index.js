const prisma = require("../config/db");

/**
 * Generates the next sequential product code based on the last created non-deleted product.
 * The code is a 3-digit padded number (e.g., "001", "123").
 * @returns {Promise<string>} The generated product code.
 * @throws {Error} If a database error occurs.
 */
const generateProductCode = async () => {
  try {
    // Find the last created product that is NOT soft-deleted, ordered by ID descending.
    const lastProduct = await prisma.product.findFirst({
      where: { deletedAt: null }, // Only consider non-deleted products
      orderBy: { id: "desc" },
      select: { product_code: true } // Only select the code field
    });

    // If no non-deleted product is found, start from "000" (the logic will increment to "001").
    // If found, use its product_code. Assuming product_code is always a 3-digit number string.
    let lastCodeNumeric = lastProduct?.product_code ? parseInt(lastProduct.product_code, 10) : 0; // Default to 0 if no product or no code

     // Check if parsing failed (unexpected format)
     if (isNaN(lastCodeNumeric)) {
         console.warn(`Unexpected product_code format found: ${lastProduct.product_code}. Starting next code from 0.`);
         // Decide how to handle this: either throw or reset sequence
         // throw new Error(`Unexpected product_code format found on last product: ${lastProduct.product_code}`);
         lastCodeNumeric = 0; // Reset sequence if format is bad
     }


    const nextCodeNumeric = lastCodeNumeric + 1;
    const newCode = String(nextCodeNumeric).padStart(3, "0"); // Pad to 3 digits

    console.log(`Generated new product code: ${newCode} (based on last non-deleted code: ${lastProduct?.product_code || 'N/A'})`);

    return newCode;

  } catch (error) {
    console.error("Error generating product code:", error);
    // Re-throw the error so the caller knows the generation failed
    throw new Error("Failed to generate unique product code.");
  }
};


/**
 * Generates the next sequential dealer code based on the last created non-deleted dealer.
 * The code is prefixed with "D" and followed by a 3-digit padded number (e.g., "D001", "D123").
 * @returns {Promise<string>} The generated dealer code.
 * @throws {Error} If a database error occurs or dealer code format is unexpected.
 */
const generateDealerCode = async () => {
  try {
    // Find the last created dealer that is NOT soft-deleted, ordered by ID descending.
    const lastDealer = await prisma.dealer.findFirst({
      where: { deletedAt: null }, // Only consider non-deleted dealers
      orderBy: { id: "desc" },
      select: { dealerCode: true } // Only select the dealerCode field
    });

    // If no non-deleted dealer is found, start from "D000" (the logic will generate "D001").
    // If found, extract the numeric part of its code. Assuming dealerCode format is "DXXX".
    const lastCode = lastDealer?.dealerCode || "D000";

    // Extract numeric part (after "D") and parse as integer
    const numericPartString = lastCode.slice(1);
    let numericPart = parseInt(numericPartString, 10);

    // Check if the numeric part was successfully parsed
    if (isNaN(numericPart)) {
         console.warn(`Unexpected dealerCode format found: ${lastCode}. Starting next code from D000.`);
         // Decide how to handle this: throw or reset sequence
         // throw new Error(`Unexpected dealerCode format found on last dealer: ${lastCode}`);
         numericPart = 0; // Reset sequence if format is bad
    }

    const newNumericPart = numericPart + 1; // Increment the numeric part

    // Generate new code by adding the prefix "D" and padding with zeros
    const newCode = `D${String(newNumericPart).padStart(3, "0")}`; // Pad to 3 digits

    console.log(`Generated new dealer code: ${newCode} (based on last non-deleted code: ${lastDealer?.dealerCode || 'N/A'})`);

    return newCode;

  } catch (error) {
    console.error("Error generating dealer code:", error);
    // Re-throw the error so the caller knows the generation failed
    throw new Error("Failed to generate unique dealer code.");
  }
};

async function generateOrderId(userId) {
  const userOrderNum = await prisma.order.count({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
  });
  const totalOrderNum = await prisma.order.count();
  // Get the current date
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(today.getDate()).padStart(2, "0");

  // Format date as YYYYMMDD
  const dateStr = `${year}${month}${day}`;

  // Format order numbers with leading zeros
  const userOrderNumStr = String(userOrderNum + 1).padStart(3, "0"); // e.g., 3 -> 003
  const totalOrderNumStr = String(totalOrderNum + 1).padStart(6, "0"); // e.g., 125 -> 000125

  // Create the Order ID
  const orderId = `${dateStr}-${userId}-${userOrderNumStr}-${totalOrderNumStr}`;
  console.log(orderId);
  return orderId;
}

module.exports = { generateProductCode,  generateDealerCode, generateOrderId };