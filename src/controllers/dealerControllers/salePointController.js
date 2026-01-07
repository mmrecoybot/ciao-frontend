// Assume SalePoint model includes:
// model SalePoint {
//   id           Int       @id @default(autoincrement())
//   dealerId     Int
//   dealer       Dealer    @relation(fields: [dealerId], references: [id])
//   name         String
//   address1     String?
//   city         String?
//   // ... other sale point fields
//   createdAt    DateTime  @default(now())
//   updatedAt    DateTime  @updatedAt
//   deletedAt    DateTime? // NULL means not deleted
// }

const prisma = require("../../config/db")

 const salePointController = {
  // Get all sale points for a dealer
  getAllSalePoints: async (req, res) => {
    try {
      const { dealerId } = req.params;
      const dealerIdNum = Number(dealerId);

      if (isNaN(dealerIdNum)) {
         return res.status(400).json({ error: "Invalid dealer ID provided" });
      }

      // Find sale points for the dealer, only if deletedAt is null
      const salePoints = await prisma.salePoint.findMany({
        where: {
            dealerId: dealerIdNum,
            deletedAt: null, // Add this condition
        },
        orderBy: { createdAt: 'desc' } // Optional: Add sorting
      });

      // Optional: Return 404 if no sale points are found for the dealer (deleted or not)
      // if (salePoints.length === 0) {
      //     // Consider if you want 404 for "no points found" vs 200 with empty array
      //      return res.status(404).json({ error: "No sale points found for this dealer or all points are deleted" });
      // }

      res.status(200).json(salePoints); // Use status 200

    } catch (error) {
      console.error("Error getting all sale points:", error); // Log the error
      // Handle potential foreign key constraint error if dealerId doesn't exist
      if (error.code === 'P2003') {
          // This shouldn't happen with findMany unless dealerId is invalid type,
          // but good practice to consider.
         return res.status(400).json({ error: "Invalid dealer ID provided" });
      }
      res.status(500).json({ error: error.message || "Internal Server Error" }); // Changed from 500 (original)
    }
  },

  // Get a single sale point
  getSalePoint: async (req, res) => {
    try {
      const { id } = req.params;
      const salePointId = Number(id);

      if (isNaN(salePointId)) {
         return res.status(400).json({ error: "Invalid sale point ID provided" });
      }

      // Find unique sale point, but only if deletedAt is null
      const salePoint = await prisma.salePoint.findUnique({
        where: {
            id: salePointId,
            deletedAt: null, // Add this condition
        },
      })

      if (!salePoint) {
        // Return 404 if not found or if it exists but is soft-deleted
        return res.status(404).json({ error: "Sale point not found or is deleted" });
      }

      res.status(200).json(salePoint); // Use status 200

    } catch (error) {
      console.error("Error getting single sale point:", error); // Log the error
      res.status(500).json({ error: error.message || "Internal Server Error" }); // Changed from 500 (original)
    }
  },

  // Create a new sale point
  createSalePoint: async (req, res) => {
    try {
       // Ensure dealerId is included and is a number
       const { dealerId, ...otherData } = req.body;

       if (dealerId === undefined || isNaN(Number(dealerId))) {
           return res.status(400).json({ error: "Invalid or missing dealerId" });
       }

       // Basic validation for name or other required fields
       if (!otherData.name) {
           return res.status(400).json({ error: "Missing required field: name" });
       }


      const salePoint = await prisma.salePoint.create({
        data: {
            dealerId: Number(dealerId), // Ensure dealerId is a number
            ...otherData,
            // deletedAt is null by default
        },
      })
      res.status(201).json(salePoint); // Use status 201

    } catch (error) {
      console.error("Error creating sale point:", error); // Log the error
      // Handle foreign key constraint violation if dealerId doesn't exist
      if (error.code === 'P2003') {
         return res.status(400).json({ error: "Invalid dealer ID provided, dealer not found" });
      }
      // Handle potential unique constraint violation on name or other fields if applicable
       if (error.code === 'P2002') {
           const target = error.meta?.target?.join(', ') || 'a unique field';
           return res.status(409).json({ error: `A sale point with the provided ${target} already exists for this dealer.` });
        }
      res.status(500).json({ error: error.message || "Internal Server Error" }); // Changed from 400 (original)
    }
  },

  // Update a sale point
  updateSalePoint: async (req, res) => {
    try {
      const { id } = req.params;
      const salePointId = Number(id);

      if (isNaN(salePointId)) {
        return res.status(400).json({ error: "Invalid sale point ID provided" });
      }

       // Extract deletedAt separately to handle undeleting
       const { deletedAt, ...updateData } = req.body;

       // Map request body fields to Prisma model names if necessary (e.g., if using snake_case in body)
       // For simplicity here, assuming body keys match Prisma fields except deletedAt

       // Filter out undefined values from the update data
       const filteredUpdateData = Object.fromEntries(
           Object.entries(updateData).filter(([_, value]) => value !== undefined)
       );

       // Handle the deletedAt field for potential undelete
       if (deletedAt !== undefined) {
           filteredUpdateData.deletedAt = deletedAt === null ? null : new Date(deletedAt);
       }

        // Ensure dealerId in body is handled as a number if it's included in the update
        if (filteredUpdateData.dealerId !== undefined) {
            filteredUpdateData.dealerId = Number(filteredUpdateData.dealerId);
            if (isNaN(filteredUpdateData.dealerId)) {
                 return res.status(400).json({ error: "Invalid dealerId provided in update data" });
            }
        }


      const salePoint = await prisma.salePoint.update({
        where: { id: salePointId }, // Update by ID regardless of deleted status
        data: filteredUpdateData, // Use filtered and potentially modified data
      })

      res.status(200).json(salePoint); // Use status 200

    } catch (error) {
      console.error("Error updating sale point:", error); // Log the error
      // Handle case where ID is not found
       if (error.code === 'P2025') {
         return res.status(404).json({ error: "Sale point not found" });
       }
        // Handle unique constraint violation on update
        if (error.code === 'P2002') {
           const target = error.meta?.target?.join(', ') || 'a unique field';
           return res.status(409).json({ error: `A sale point with the provided ${target} already exists.` });
        }
        // Handle foreign key constraint violation if dealerId is updated to an invalid ID
        if (error.code === 'P2003') {
           return res.status(400).json({ error: "Invalid dealerId provided for update" });
        }
      res.status(500).json({ error: error.message || "Internal Server Error" }); // Changed from 400 (original)
    }
  },

  // Delete a sale point (soft delete)
  deleteSalePoint: async (req, res) => {
    try {
      const { id } = req.params;
      const salePointId = Number(id);

       if (isNaN(salePointId)) {
        return res.status(400).json({ error: "Invalid sale point ID provided" });
      }

      // Perform soft deletion by updating the deletedAt field
      // Include deletedAt: null in where to ensure it fails if already deleted
      const salePoint = await prisma.salePoint.update({
        where: {
            id: salePointId,
            deletedAt: null, // Ensure it's not already deleted
        },
        data: { deletedAt: new Date() }, // Set deletedAt to the current date/time
      })

       // Return a success message for soft deletion
      res.status(200).json({ message: "Sale point soft deleted successfully", salePoint }); // 200 with body is clearer for soft delete

    } catch (error) {
       console.error("Error soft-deleting sale point:", error); // Log the error
       // Handle case where the sale point is not found or already soft-deleted
       if (error.code === 'P2025') {
         return res.status(404).json({ error: "Sale point not found or already deleted" });
       }
      res.status(500).json({ error: error.message || "Internal Server Error" }); // Changed from 400 (original)
    }
  },
}

module.exports = salePointController;