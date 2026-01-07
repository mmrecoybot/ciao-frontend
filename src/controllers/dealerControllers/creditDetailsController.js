// Assume CreditDetails model includes:
// model CreditDetails {
//   id                 Int       @id @default(autoincrement())
//   dealerId           Int       @unique // Assuming a one-to-one relationship with unique dealerId
//   dealer             Dealer    @relation(fields: [dealerId], references: [id])
//   creditLimit        Decimal // Example field
//   currentCreditUsed  Decimal // Example field
//   creditScore        Int?    // Example field
//   createdAt          DateTime  @default(now())
//   updatedAt          DateTime  @updatedAt
//   deletedAt          DateTime? // NULL means not deleted
// }


const prisma = require("../../config/db")

const creditDetailsController = {
  // Get credit details for a dealer
  getCreditDetails: async (req, res) => {
    try {
      const { dealerId } = req.params;
      const dealerIdNum = Number(dealerId);

      if (isNaN(dealerIdNum)) {
          return res.status(400).json({ error: "Invalid dealer ID provided" });
      }

      const creditDetails = await prisma.creditDetails.findUnique({
        where: {
          dealerId: dealerIdNum,
          deletedAt: null, // Only find non-deleted details
        },
      })

      if (!creditDetails) {
        // Return 404 if not found or if it exists but is soft-deleted
        return res.status(404).json({ error: "Credit details not found for this dealer or are deleted" });
      }

      res.status(200).json(creditDetails); // Use 200 for success
    } catch (error) {
      console.error("Error getting credit details:", error); // Log the error
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  },

  // Create or update credit details
  upsertCreditDetails: async (req, res) => {
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
        // We add `deletedAt: null` here so that if deleted details exist for the dealerId,
        // upsert will perform a CREATE instead of updating the deleted one.
        where: {
          dealerId: dealerIdNum,
          deletedAt: null // Only find non-deleted details to update
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

      const creditDetails = await prisma.creditDetails.upsert(upsertData);

      // Note: Upsert can result in either create (201) or update (200).
      // For simplicity, returning 200.
      res.status(200).json(creditDetails);

    } catch (error) {
      console.error("Error upserting credit details:", error); // Log the error
       // Handle potential errors like invalid dealerId (if it's a foreign key) or validation issues
      if (error.code === 'P2003') { // Foreign key constraint failed (e.g., invalid dealerId)
         return res.status(400).json({ error: "Invalid dealer ID provided" });
      }
      if (error.code === 'P2002') { // Unique constraint violation (less likely here with unique dealerId, but possible with other fields)
         return res.status(409).json({ error: "Credit details already exist for this dealer." }); // Although upsert should prevent this if logic is correct
      }
      res.status(500).json({ error: error.message || "Internal Server Error" }); // Changed from 400 to 500 for unexpected errors
    }
  },

  // Delete credit details (soft delete)
  deleteCreditDetails: async (req, res) => {
    try {
      const { dealerId } = req.params;
      const dealerIdNum = Number(dealerId);

      if (isNaN(dealerIdNum)) {
        return res.status(400).json({ error: "Invalid dealer ID provided" });
      }

      // Perform soft deletion by updating the deletedAt field
      const creditDetails = await prisma.creditDetails.update({
        where: {
          dealerId: dealerIdNum,
          deletedAt: null, // Ensure it's not already deleted
        },
        data: {
          deletedAt: new Date(), // Set deletedAt to the current date/time
        },
      })

      // Success message for soft delete
      res.status(200).json({ message: "Credit details soft deleted successfully", creditDetails }); // Returning 200 with message/body is common

    } catch (error) {
      console.error("Error soft-deleting credit details:", error); // Log the error
      // Handle case where the details are not found or already soft-deleted
       if (error.code === 'P2025') {
          return res.status(404).json({ error: "Credit details not found for this dealer or already deleted" });
       }
      res.status(500).json({ error: error.message || "Internal Server Error" }); // Changed from 400 to 500 for unexpected errors
    }
  },
}

module.exports = creditDetailsController;