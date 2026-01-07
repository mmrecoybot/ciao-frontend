// Assume Dealer model includes:
// model Dealer {
//   id             Int       @id @default(autoincrement())
//   companyName    String
//   vatNumber      String?   @unique
//   taxCode        String?   @unique
//   dealerCode     String    @unique
//   adminPhone     String?
//   pecEmail       String?
//   adminEmail     String?
//   iban           String?
//   paymentMethod  String?
//   accountNumber  String?
//   recoveryEmail  String?
//   websiteUrl     String?
//   createdAt      DateTime  @default(now())
//   updatedAt      DateTime  @updatedAt
//   deletedAt      DateTime? // NULL means not deleted
//   // Relations (assuming they exist based on includes)
//   billingAddress BillingAddress?
//   creditDetails  CreditDetails?
//   salePoints     SalePoint[]
//   signedContracts SignedContract[]
//   Documents      Documents[]
//   User           User[] // Users associated with this dealer
//   serialNumber   serialNumber[] // Serial numbers assigned to this dealer
// }

// Assume Documents model includes:
// model Documents {
//   id          Int       @id @default(autoincrement())
//   dealerId    Int
//   dealer      Dealer    @relation(fields: [dealerId], references: [id])
//   name        String // e.g., "Contract", "ID Copy"
//   fileUrl     String
//   uploadDate  DateTime  @default(now())
//   createdAt   DateTime  @default(now())
//   updatedAt   DateTime  @updatedAt
//   deletedAt   DateTime? // NULL means not deleted
// }

const prisma = require("../../config/db");
const { generateDealerCode } = require("../../lib"); // Assuming this exists and works

const dealerController = {
  // Get all dealers
  getAllDealers: async (req, res) => {
    console.log("getAllDealers"); // Keep console.log if needed
    try {
      // Only find dealers where deletedAt is null
      const dealers = await prisma.dealer.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" }, // Optional: Add sorting
      });
      res.status(200).json(dealers); // Use status 200
    } catch (error) {
      console.error("Error getting all dealers:", error); // Log the error
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  },

  // Get a single dealer
  getDealer: async (req, res) => {
    console.log("getDealer"); // Keep console.log if needed
    try {
      const { id } = req.params;
      const dealerId = Number(id);

      if (isNaN(dealerId)) {
        return res.status(400).json({ error: "Invalid dealer ID provided" });
      }

      // Find unique dealer, but only if deletedAt is null
      const dealer = await prisma.dealer.findUnique({
        where: {
          id: dealerId,
          deletedAt: null, // Add this condition
        },
        include: {
          // Keep includes. Standard practice is not to filter included relations by their own deletedAt
          // when the parent is filtered. If the dealer is deleted, these related records
          // won't be returned anyway because the parent query filtered them out.
          billingAddress: true,
          creditDetails: true,
          salePoints: true,
          signedContracts: true,
          Documents: {
            // Optional: You might want to filter included Documents by their own deletedAt
            // depending on your UI/logic needs, but it's less common here.
            // If needed, add where: { deletedAt: null } inside this include block.
            // Example: where: { deletedAt: null }
          },
          User: {
            select: {
              id: true, // Include user ID
              name: true,
              email: true,
              Order: {
                orderBy: { createdAt: "desc" },
              },
              Activation: {
                select: {
                  id: true,
                  status: true,
                  serialNumber: {
                    select: {
                      number: true,
                    },
                  },
                  company: {
                    select: {
                      name: true,
                    },
                  },
                  activationDate: true,
                },
              },
            },
          },
          serialNumber: {
            select: {
              id: true, // Include serial number ID
              number: true,
              // dealer: true, // Redundant when fetching from dealer include
              Activation: {
                // Activation relation itself might be null if not activated
                select: {
                  id: true,
                  status: true,
                },
              },
              company: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            // Optional: You might want to filter included SerialNumbers by their own deletedAt
            // if your SerialNumber model also has it and you want to hide deleted ones.
            // Example: where: { deletedAt: null }
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (!dealer) {
        // Return 404 if not found or if it exists but is soft-deleted
        return res
          .status(404)
          .json({ error: "Dealer not found or is deleted" });
      }

      res.status(200).json(dealer); // Use status 200
    } catch (error) {
      console.error("Error getting dealer:", error); // Log the error
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  },

  // Create a new dealer
  createDealer: async (req, res) => {
    try {
      // Ensure dealerCode is generated and unique validation is handled by Prisma
      const dealerCode = await generateDealerCode(); // Assuming this handles uniqueness or you handle P2002

      // Extract specific fields from body to avoid potential issues with extra fields
      const {
        company_name,
        vat_number,
        tax_code,
        admin_phone,
        pec_email,
        admin_email,
        iban,
        payment_method,
        account_number,
        recovery_email,
        website_url,
        // Do not include deletedAt here, it's null by default
      } = req.body;

      // Basic validation for required fields if any
      if (!company_name) {
        return res.status(400).json({ error: "company_name is required" });
      }

      const dealer = await prisma.dealer.create({
        data: {
          companyName: company_name,
          vatNumber: vat_number,
          taxCode: tax_code,
          adminPhone: admin_phone,
          pecEmail: pec_email,
          adminEmail: admin_email,
          iban: iban,
          paymentMethod: payment_method,
          accountNumber: account_number,
          recoveryEmail: recovery_email,
          websiteUrl: website_url,
          dealerCode, // Use the generated unique code
          // deletedAt will be null by default
        },
      });
      res.status(201).json(dealer); // Use status 201
    } catch (error) {
      console.error("Error creating dealer:", error); // Log the error
      // Handle unique constraint violation error specifically
      if (error.code === "P2002") {
        // Identify which field caused the unique constraint error
        const target = error.meta?.target?.join(", ") || "a unique field";
        return res
          .status(409)
          .json({
            error: `A dealer with the provided ${target} already exists.`,
          });
      }
      res.status(500).json({ error: error.message || "Internal Server Error" }); // Changed from 400 to 500 for unexpected errors
    }
  },

  // Update a dealer
  updateDealer: async (req, res) => {
    try {
      const { id } = req.params;
      const dealerId = Number(id);

      if (isNaN(dealerId)) {
        return res.status(400).json({ error: "Invalid dealer ID provided" });
      }

      // Extract deletedAt separately to handle undeleting
      const { deletedAt, ...updateData } = req.body;

      // Map request body field names to Prisma model field names if necessary
      const prismaUpdateData = {
        companyName: updateData.company_name, // example mapping
        vatNumber: updateData.vat_number,
        taxCode: updateData.tax_code,
        adminPhone: updateData.admin_phone,
        pecEmail: updateData.pec_email,
        adminEmail: updateData.admin_email,
        iban: updateData.iban,
        paymentMethod: updateData.payment_method,
        accountNumber: updateData.account_number,
        recoveryEmail: updateData.recovery_email,
        websiteUrl: updateData.website_url,
        // dealerCode is usually not updated after creation, but if allowed, add here
      };

      // Filter out undefined values from the mapped data
      const filteredUpdateData = Object.fromEntries(
        Object.entries(prismaUpdateData).filter(
          ([_, value]) => value !== undefined
        )
      );

      // Handle the deletedAt field for potential undelete
      if (deletedAt !== undefined) {
        filteredUpdateData.deletedAt =
          deletedAt === null ? null : new Date(deletedAt);
      }

      const dealer = await prisma.dealer.update({
        where: { id: dealerId }, // Update by ID regardless of deleted status
        data: filteredUpdateData, // Use filtered and potentially modified data
      });

      res.status(200).json(dealer); // Use status 200
    } catch (error) {
      console.error("Error updating dealer:", error); // Log the error
      // Handle case where ID is not found
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Dealer not found" });
      }
      // Handle unique constraint violation on update
      if (error.code === "P2002") {
        const target = error.meta?.target?.join(", ") || "a unique field";
        return res
          .status(409)
          .json({
            error: `A dealer with the provided ${target} already exists.`,
          });
      }
      res.status(500).json({ error: error.message || "Internal Server Error" }); // Changed from 400 to 500
    }
  },

  // Delete a dealer (soft delete)
  deleteDealer: async (req, res) => {
    try {
      const { id } = req.params;
      const dealerId = Number(id);

      if (isNaN(dealerId)) {
        return res.status(400).json({ error: "Invalid dealer ID provided" });
      }

      // Perform soft deletion by updating the deletedAt field
      // Include deletedAt: null in where to ensure it fails if already deleted
      const dealer = await prisma.dealer.update({
        where: {
          id: dealerId,
          deletedAt: null, // Ensure it's not already deleted
        },
        data: { deletedAt: new Date() }, // Set deletedAt to the current date/time
      });

      // Return a success message for soft deletion
      res
        .status(200)
        .json({ message: "Dealer soft deleted successfully", dealer }); // 200 with body is clearer for soft delete
    } catch (error) {
      console.error("Error soft-deleting dealer:", error); // Log the error
      // Handle case where the dealer is not found or already soft-deleted
      if (error.code === "P2025") {
        return res
          .status(404)
          .json({ error: "Dealer not found or already deleted" });
      }
      res.status(500).json({ error: error.message || "Internal Server Error" }); // Changed from 400 to 500
    }
  },

  // --- Documents Controller Functions (Soft Delete) ---

  // Create a new document
  createDocument: async (req, res) => {
    try {
      // Assuming req.body contains { dealerId: number, name: string, fileUrl: string, ...other Document fields }
      const { dealerId } = req.body; // Keep dealerId for validation

      const dealerIdNum = Number(dealerId);

      if (isNaN(dealerIdNum)) {
        return res
          .status(400)
          .json({ error: "Invalid dealer ID provided for document" });
      }

      // Basic validation for required fields
      if (!req.body.name || !req.body.fileUrl) {
        return res
          .status(400)
          .json({ error: "Missing required fields (name, fileUrl)" });
      }

      const document = await prisma.documents.create({
        data: {
          ...req.body,
          dealerId: dealerIdNum, // Ensure dealerId is a number
          // deletedAt will be null by default
        },
      });
      res.status(201).json(document); // Use status 201
    } catch (error) {
      console.error("Error creating document:", error); // Log the error
      // Handle foreign key constraint violation if dealerId doesn't exist
      if (error.code === "P2003") {
        return res
          .status(400)
          .json({ error: "Invalid dealer ID provided, dealer not found" });
      }
      // Handle potential unique constraint violation on document fields if applicable
      if (error.code === "P2002") {
        const target = error.meta?.target?.join(", ") || "a unique field";
        return res
          .status(409)
          .json({
            error: `A document with the provided ${target} already exists for this dealer.`,
          });
      }
      res.status(500).json({ error: error.message || "Internal Server Error" }); // Changed from 400 to 500
    }
  },

  // Get all documents for a dealer
  getAllDocuments: async (req, res) => {
    try {
      const { dealerId } = req.params;
      const dealerIdNum = Number(dealerId);

      if (isNaN(dealerIdNum)) {
        return res.status(400).json({ error: "Invalid dealer ID provided" });
      }

      // Find documents for the dealer, only if deletedAt is null
      const documents = await prisma.documents.findMany({
        where: {
          dealerId: dealerIdNum,
          deletedAt: null, // Add this condition
        },
        orderBy: { uploadDate: "desc" }, // Optional: Add sorting
      });

      // Optional: Return 404 if no documents are found for the dealer (deleted or not)
      // if (documents.length === 0) {
      //      return res.status(404).json({ error: "No documents found for this dealer or all documents are deleted" });
      // }

      res.status(200).json(documents); // Use status 200
    } catch (error) {
      console.error("Error getting documents:", error); // Log the error
      res.status(500).json({ error: error.message || "Internal Server Error" }); // Changed from 400 to 500
    }
  },

  // Delete a document (soft delete)
  deleteDocument: async (req, res) => {
    try {
      const { id } = req.params;
      const documentId = Number(id);

      if (isNaN(documentId)) {
        return res.status(400).json({ error: "Invalid document ID provided" });
      }

      // Perform soft deletion by updating the deletedAt field
      // Include deletedAt: null in where to ensure it fails if already deleted
      const document = await prisma.documents.update({
        where: {
          id: documentId,
          deletedAt: null, // Ensure it's not already deleted
        },
        data: { deletedAt: new Date() }, // Set deletedAt to the current date/time
      });

      // Return a success message for soft deletion
      res
        .status(200)
        .json({ message: "Document soft deleted successfully", document }); // 200 with body is clearer for soft delete
    } catch (error) {
      console.error("Error soft-deleting document:", error); // Log the error
      // Handle case where the document is not found or already soft-deleted
      if (error.code === "P2025") {
        return res
          .status(404)
          .json({ error: "Document not found or already deleted" });
      }
      res.status(500).json({ error: error.message || "Internal Server Error" }); // Changed from 400 to 500
    }
  },
};

module.exports = dealerController;
