// Assume SignedContract model includes:
// model SignedContract {
//   id          Int       @id @default(autoincrement())
//   dealerId    Int
//   dealer      Dealer    @relation(fields: [dealerId], references: [id])
//   contractUrl String
//   signDate    DateTime?
//   createdAt   DateTime  @default(now())
//   updatedAt   DateTime  @updatedAt
//   deletedAt   DateTime? // NULL means not deleted
// }

const prisma = require("../../config/db");

const signedContractController = {
  // Get all signed contracts for a dealer (excluding soft-deleted)
  getAllSignedContracts: async (req, res) => {
    try {
      const { dealerId } = req.params;
      const dealerIdNum = Number(dealerId);

      if (isNaN(dealerIdNum)) {
        return res.status(400).json({ error: "Invalid dealer ID provided" });
      }

      // Find signed contracts for the dealer, only if deletedAt is null
      const signedContracts = await prisma.signedContract.findMany({
        where: {
          dealerId: dealerIdNum,
          deletedAt: null, // Add this condition
        },
        orderBy: { signDate: "desc" }, // Optional: Order by sign date
      });

      // Optional: Return 404 if no signed contracts are found for the dealer (deleted or not)
      // if (signedContracts.length === 0) {
      //      return res.status(404).json({ error: "No signed contracts found for this dealer or all contracts are deleted" });
      // }

      res.status(200).json(signedContracts); // Use status 200
    } catch (error) {
      console.error("Error getting all signed contracts:", error); // Log the error
      // Handle potential foreign key constraint error if dealerId doesn't exist (less likely in findMany)
      if (error.code === "P2003") {
        return res.status(400).json({ error: "Invalid dealer ID provided" });
      }
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  },

  // Get a single signed contract (excluding soft-deleted)
  getSignedContract: async (req, res) => {
    try {
      const { id } = req.params;
      const contractId = Number(id);

      if (isNaN(contractId)) {
        return res
          .status(400)
          .json({ error: "Invalid signed contract ID provided" });
      }

      // Find unique signed contract, but only if deletedAt is null
      const signedContract = await prisma.signedContract.findUnique({
        where: {
          id: contractId,
          deletedAt: null, // Add this condition
        },
      });

      if (!signedContract) {
        // Return 404 if not found or if it exists but is soft-deleted
        return res
          .status(404)
          .json({ error: "Signed contract not found or is deleted" });
      }

      res.status(200).json(signedContract); // Use status 200
    } catch (error) {
      console.error("Error getting single signed contract:", error); // Log the error
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  },

  // Create a new signed contract
  createSignedContract: async (req, res) => {
    try {
      // Ensure dealerId is included and is a number
      const { dealerId, ...otherData } = req.body;

      if (dealerId === undefined || isNaN(Number(dealerId))) {
        return res.status(400).json({ error: "Invalid or missing dealerId" });
      }

      // Basic validation for required fields like contractUrl
      if (!otherData.contractUrl) {
        return res
          .status(400)
          .json({ error: "Missing required field: contractUrl" });
      }

      const signedContract = await prisma.signedContract.create({
        data: {
          dealerId: Number(dealerId), // Ensure dealerId is a number
          ...otherData,
          // deletedAt is null by default
          // Convert signDate if provided
          signDate: otherData.signDate
            ? new Date(otherData.signDate)
            : undefined,
        },
      });
      res.status(201).json(signedContract); // Use status 201
    } catch (error) {
      console.error("Error creating signed contract:", error); // Log the error
      // Handle foreign key constraint violation if dealerId doesn't exist
      if (error.code === "P2003") {
        return res
          .status(400)
          .json({ error: "Invalid dealer ID provided, dealer not found" });
      }
      // Handle potential unique constraint violation if applicable
      if (error.code === "P2002") {
        const target = error.meta?.target?.join(", ") || "a unique field";
        return res
          .status(409)
          .json({
            error: `A signed contract with the provided ${target} already exists.`,
          });
      }
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  },

  // Update a signed contract
  updateSignedContract: async (req, res) => {
    try {
      const { id } = req.params;
      const contractId = Number(id);

      if (isNaN(contractId)) {
        return res
          .status(400)
          .json({ error: "Invalid signed contract ID provided" });
      }

      // Extract deletedAt separately to handle undeleting
      const { deletedAt, ...updateData } = req.body;

      // Filter out undefined values and handle date conversions
      const filteredUpdateData = {};
      for (const key in updateData) {
        if (updateData[key] !== undefined) {
          if (key === "dealerId") {
            filteredUpdateData[key] = Number(updateData[key]); // Ensure dealerId is number
            if (isNaN(filteredUpdateData[key])) {
              return res
                .status(400)
                .json({ error: "Invalid dealerId provided in update data" });
            }
          } else if (key === "signDate") {
            // Handle date conversion, allow null
            filteredUpdateData[key] =
              updateData[key] === null ? null : new Date(updateData[key]);
          } else {
            filteredUpdateData[key] = updateData[key];
          }
        }
      }

      // Handle the deletedAt field for potential undelete
      if (deletedAt !== undefined) {
        filteredUpdateData.deletedAt =
          deletedAt === null ? null : new Date(deletedAt);
      }

      const signedContract = await prisma.signedContract.update({
        where: { id: contractId }, // Update by ID regardless of deleted status
        data: filteredUpdateData, // Use filtered and potentially modified data
      });

      res.status(200).json(signedContract); // Use status 200
    } catch (error) {
      console.error("Error updating signed contract:", error); // Log the error
      // Handle case where ID is not found
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Signed contract not found" });
      }
      // Handle unique constraint violation on update
      if (error.code === "P2002") {
        const target = error.meta?.target?.join(", ") || "a unique field";
        return res
          .status(409)
          .json({
            error: `A signed contract with the provided ${target} already exists.`,
          });
      }
      // Handle foreign key constraint violation if dealerId is updated to an invalid ID
      if (error.code === "P2003") {
        return res
          .status(400)
          .json({ error: "Invalid dealerId provided for update" });
      }
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  },

  // Delete a signed contract (soft delete)
  deleteSignedContract: async (req, res) => {
    try {
      const { id } = req.params;
      const contractId = Number(id);

      if (isNaN(contractId)) {
        return res
          .status(400)
          .json({ error: "Invalid signed contract ID provided" });
      }

      // Perform soft deletion by updating the deletedAt field
      // Include deletedAt: null in where to ensure it fails if already deleted
      const signedContract = await prisma.signedContract.update({
        where: {
          id: contractId,
          deletedAt: null, // Ensure it's not already deleted
        },
        data: { deletedAt: new Date() }, // Set deletedAt to the current date/time
      });

      // Return a success message for soft deletion
      res
        .status(200)
        .json({
          message: "Signed contract soft deleted successfully",
          signedContract,
        }); // 200 with body is clearer for soft delete
    } catch (error) {
      console.error("Error soft-deleting signed contract:", error); // Log the error
      // Handle case where the contract is not found or already soft-deleted
      if (error.code === "P2025") {
        return res
          .status(404)
          .json({ error: "Signed contract not found or already deleted" });
      }
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  },
};

module.exports = signedContractController;
