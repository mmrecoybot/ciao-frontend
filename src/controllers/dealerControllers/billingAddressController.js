// Assume BillingAddress model includes:
// model BillingAddress {
//   id        Int       @id @default(autoincrement())
//   dealerId  Int       @unique // Assuming a one-to-one relationship with unique dealerId
//   dealer    Dealer    @relation(fields: [dealerId], references: [id])
//   address1  String
//   address2  String?
//   city      String
//   state     String?
//   zipCode   String?
//   country   String
//   createdAt DateTime  @default(now())
//   updatedAt DateTime  @updatedAt
//   deletedAt DateTime? // NULL means not deleted
// }


const prisma = require("../../config/db")

 const billingAddressController = {
  // Get billing address for a dealer
  getBillingAddress: async (req, res) => {
    try {
      const { dealerId } = req.params;
      const dealerIdNum = Number(dealerId);

      if (isNaN(dealerIdNum)) {
          return res.status(400).json({ error: "Invalid dealer ID provided" });
      }

      const billingAddress = await prisma.billingAddress.findUnique({
        where: {
          dealerId: dealerIdNum,
          deletedAt: null, // Only find non-deleted address
        },
      })

      if (!billingAddress) {
        // Return 404 if not found or if it exists but is soft-deleted
        return res.status(404).json({ error: "Billing address not found for this dealer or is deleted" });
      }

      res.status(200).json(billingAddress); // Use 200 for success
    } catch (error) {
      console.error("Error getting billing address:", error); // Log the error
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  },

  // Create or update billing address
  upsertBillingAddress: async (req, res) => {
    try {
      const { dealerId } = req.params;
      const dealerIdNum = Number(dealerId);

       if (isNaN(dealerIdNum)) {
          return res.status(400).json({ error: "Invalid dealer ID provided" });
      }

      // Extract data, allowing deletedAt to be potentially set (e.g., to null for undelete)
      const { deletedAt, ...updateData } = req.body;

      const upsertData = {
        // The `where` condition for `upsert` determines which record to UPDATE.
        // We add `deletedAt: null` here so that if a deleted address exists for the dealerId,
        // upsert will perform a CREATE instead of updating the deleted one.
        where: {
          dealerId: dealerIdNum,
          deletedAt: null // Only find non-deleted address to update
        },
        // The `update` data for when a record is found
        update: {
          ...updateData,
          // Allow updating deletedAt field explicitly (e.g., set to null for undelete)
          deletedAt: deletedAt === undefined ? undefined : (deletedAt === null ? null : new Date(deletedAt)),
        },
        // The `create` data for when no non-deleted record is found
        create: {
          ...req.body, // include original req.body which might have other fields
          dealerId: dealerIdNum,
          // deletedAt will be null by default on create,
          // unless it was explicitly passed in req.body and handled above.
          // If you want to force null on create, even if body includes it, set it explicitly here.
          // deletedAt: null,
        },
      };


      const billingAddress = await prisma.billingAddress.upsert(upsertData);

      // Note: Upsert can result in either create (201) or update (200).
      // Prisma's upsert doesn't easily tell you which action was taken.
      // For simplicity, we'll return 200 for both or you could fetch afterwards to check.
      res.status(200).json(billingAddress);

    } catch (error) {
      console.error("Error upserting billing address:", error); // Log the error
      // Handle potential errors like invalid dealerId (if it's a foreign key) or validation issues
      if (error.code === 'P2003') { // Foreign key constraint failed (e.g., invalid dealerId)
         return res.status(400).json({ error: "Invalid dealer ID provided" });
      }
      if (error.code === 'P2002') { // Unique constraint violation (less likely here with unique dealerId, but possible with other fields)
         return res.status(409).json({ error: "A billing address already exists for this dealer." }); // Although upsert should prevent this if logic is correct
      }
      res.status(500).json({ error: error.message || "Internal Server Error" }); // Changed from 400 to 500 for unexpected errors
    }
  },

  // Delete billing address (soft delete)
  deleteBillingAddress: async (req, res) => {
    try {
      const { dealerId } = req.params;
      const dealerIdNum = Number(dealerId);

      if (isNaN(dealerIdNum)) {
        return res.status(400).json({ error: "Invalid dealer ID provided" });
      }

      // Perform soft deletion by updating the deletedAt field
      const billingAddress = await prisma.billingAddress.update({
        where: {
          dealerId: dealerIdNum,
          deletedAt: null, // Ensure it's not already deleted
        },
        data: {
          deletedAt: new Date(), // Set deletedAt to the current date/time
        },
      })

      // Success with no content
      res.status(200).json({ message: "Billing address soft deleted successfully", billingAddress }); // Returning 200 with message/body is also common for delete

    } catch (error) {
      console.error("Error soft-deleting billing address:", error); // Log the error
       // Handle case where the address is not found or already soft-deleted
       if (error.code === 'P2025') {
          return res.status(404).json({ error: "Billing address not found for this dealer or already deleted" });
       }
      res.status(500).json({ error: error.message || "Internal Server Error" }); // Changed from 400 to 500 for unexpected errors
    }
  },
}

module.exports = billingAddressController;