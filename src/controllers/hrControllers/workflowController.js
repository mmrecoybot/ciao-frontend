// Assume Workflow model includes:
// model Workflow {
//   id            Int          @id @default(autoincrement())
//   type          String // e.g., "Order", "Activation"
//   referenceId   Int // ID of the Order, Activation, etc.
//   status        String // e.g., "Pending", "Processing", "Completed", "Canceled"
//   createdAt     DateTime     @default(now())
//   updatedAt     DateTime     @updatedAt
//   deletedAt     DateTime?    // NULL means not deleted
//   steps         WorkflowStep[] // Relation to steps
// }

// Assume WorkflowStep model includes:
// model WorkflowStep {
//   id          Int        @id @default(autoincrement())
//   workflowId  Int
//   workflow    Workflow   @relation(fields: [workflowId], references: [id])
//   action      String // e.g., "User Submitted", "Dealer Approved", "System Processed", "Order Canceled"
//   actorId     Int?       // ID of the user or system actor
//   actorRole   String?    // Role of the actor (e.g., "User", "DealerAdmin", "System")
//   timestamp   DateTime   @default(now())
//   metadata    Json?      // Additional details (e.g., { reason: "Cancelled by user" })
//   deletedAt   DateTime?  // NULL means not deleted (less common for steps, but added for consistency)
// }

const prisma = require("../../config/db");

const addNewWorkflow = async (req, res) => {
  try {
    const { type, referenceId, steps } = req.body;

    // Basic validation
    if (
      !type ||
      referenceId === undefined ||
      !Array.isArray(steps) ||
      steps.length === 0
    ) {
      return res
        .status(400)
        .json({
          error:
            "Missing required fields (type, referenceId, steps) or steps is not a non-empty array",
        });
    }

    // Validate steps format if necessary (e.g., steps should have 'action')
    if (!steps.every((step) => step.action)) {
      return res.status(400).json({ error: "Each step must have an 'action'" });
    }

    const workflow = await prisma.workflow.create({
      data: {
        type,
        referenceId: Number(referenceId), // Ensure referenceId is a number
        status: "Pending", // Default status
        steps: {
          create: steps.map((step) => ({
            // Ensure steps are created correctly
            ...step,
            // Assuming actorId is optional and can be null/undefined,
            // and actorRole/metadata are optional as per your original code.
            // If WorkflowStep also has deletedAt, it will be null by default here.
            // Ensure metadata is treated as Json
            metadata: step.metadata !== undefined ? step.metadata : null, // Store null if not provided
          })),
        },
        // deletedAt is null by default for the workflow
      },
      include: {
        steps: true, // Include created steps in response
      },
    });
    res.status(201).json(workflow); // Use 201 for resource creation
  } catch (error) {
    console.error("Error adding new workflow:", error);
    // Handle foreign key constraint violation if referenceId refers to a non-existent record
    if (error.code === "P2003") {
      return res.status(400).json({ error: "Invalid referenceId provided" });
    }
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

const addNewStep = async (req, res) => {
  try {
    const { id } = req.params;
    const workflowIdNum = parseInt(id);

    if (isNaN(workflowIdNum)) {
      return res.status(400).json({ error: "Invalid workflow ID provided" });
    }

    const { action, actorId, actorRole, metadata } = req.body;

    // Basic validation
    if (!action) {
      return res.status(400).json({ error: "Missing required field: action" });
    }

    // Optional: Verify the workflow exists and is not deleted before adding a step
    const existingWorkflow = await prisma.workflow.findUnique({
      where: {
        id: workflowIdNum,
        deletedAt: null, // Only add steps to non-deleted workflows
      },
    });

    if (!existingWorkflow) {
      return res
        .status(404)
        .json({ error: "Workflow not found or is deleted" });
    }

    const step = await prisma.workflowStep.create({
      data: {
        workflowId: workflowIdNum,
        action,
        actorId: actorId !== undefined ? Number(actorId) : null, // Ensure actorId is number or null
        actorRole,
        metadata: metadata !== undefined ? metadata : null, // Store metadata as Json, handle undefined
        // deletedAt is null by default for the step
      },
    });

    res.status(201).json(step); // Use 201 for resource creation
  } catch (error) {
    console.error("Error adding new workflow step:", error);
    // Handle foreign key constraint violation if workflowId doesn't exist (less likely after manual check)
    if (error.code === "P2003") {
      return res.status(400).json({ error: "Invalid workflowId provided" });
    }
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

const cancelWorkflow = async (req, res) => {
  try {
    const { id } = req.params;
    const workflowIdNum = parseInt(id);

    if (isNaN(workflowIdNum)) {
      return res.status(400).json({ error: "Invalid workflow ID provided" });
    }

    const { actorId, actorRole, reason } = req.body;

    // Find the workflow and ensure it's not deleted before canceling
    const workflow = await prisma.workflow.update({
      where: {
        id: workflowIdNum,
        deletedAt: null, // Only cancel non-deleted workflows
        status: {
          // Optional: Add condition to only cancel if it's not already completed/canceled
          notIn: ["Completed", "Canceled"],
        },
      },
      data: {
        status: "Canceled", // Set status to Canceled
        steps: {
          create: {
            // Create a step indicating cancellation
            action: "Workflow Canceled", // More specific action name
            actorId: actorId !== undefined ? Number(actorId) : null, // Ensure actorId is number or null
            actorRole,
            metadata: { reason: reason || "No reason provided" }, // Store reason in metadata as Json
            // deletedAt is null by default for the new step
          },
        },
        // deletedAt is not affected by this update unless explicitly in data
      },
      include: { steps: true }, // Include steps in response
    });

    // If the update failed because it was already deleted or in an invalid status
    // P2025 will be thrown by Prisma. We handle that below.

    res.status(200).json(workflow); // Use 200 for success
  } catch (error) {
    console.error("Error canceling workflow:", error);
    // Handle case where ID is not found, already deleted, or status prevented update
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({
          error:
            "Workflow not found, already canceled/completed, or is deleted",
        });
    }
    // Handle foreign key constraint violation for actorId if applicable
    if (error.code === "P2003") {
      return res
        .status(400)
        .json({ error: "Invalid actorId provided for cancellation step" });
    }
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

// Get a single workflow (excluding soft-deleted workflow and its soft-deleted steps)
const getSingleWorkflow = async (req, res) => {
  try {
    const { id } = req.params;
    const workflowIdNum = parseInt(id);

    if (isNaN(workflowIdNum)) {
      return res.status(400).json({ error: "Invalid workflow ID provided" });
    }

    const workflow = await prisma.workflow.findUnique({
      where: {
        id: workflowIdNum,
        deletedAt: null, // Add this condition for the workflow
      },
      include: {
        steps: {
          where: { deletedAt: null }, // Optional: Add this condition for steps if they have deletedAt
          orderBy: { timestamp: "asc" }, // Optional: Order steps
        },
      },
    });

    if (!workflow) {
      // Return 404 if not found or if it exists but is soft-deleted
      return res
        .status(404)
        .json({ error: "Workflow not found or is deleted" });
    }

    res.status(200).json(workflow); // Use 200 for success
  } catch (error) {
    console.error("Error getting single workflow:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

// Get all workflows (excluding soft-deleted workflows and their soft-deleted steps)
const getAllWorkflows = async (req, res) => {
  try {
    const workflows = await prisma.workflow.findMany({
      where: { deletedAt: null }, // Add this condition for the workflows
      include: {
        steps: {
          where: { deletedAt: null }, // Optional: Add this condition for steps if they have deletedAt
          orderBy: { createdAt: "asc" }, // Optional: Order steps within workflow
        },
      },
      orderBy: { createdAt: "desc" }, // Keep original ordering
    });
    res.status(200).json(workflows); // Use 200 for success
  } catch (error) {
    console.error("Error getting all workflows:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

// New function: Delete a workflow (soft delete)
const deleteWorkflow = async (req, res) => {
  try {
    const { id } = req.params;
    const workflowIdNum = parseInt(id);

    if (isNaN(workflowIdNum)) {
      return res.status(400).json({ error: "Invalid workflow ID provided" });
    }

    // Perform soft deletion by updating the deletedAt field
    // Include deletedAt: null in where to ensure it fails if already deleted
    const workflow = await prisma.workflow.update({
      where: {
        id: workflowIdNum,
        deletedAt: null, // Ensure it's not already deleted
        // Optional: Prevent deletion if related entities exist that shouldn't be orphaned.
        // Or configure Prisma relations for cascading deletes (hard delete) or set null.
        // Soft delete doesn't typically cascade automatically.
      },
      data: {
        deletedAt: new Date(), // Set deletedAt to the current date/time
        // Optional: You might want to also soft-delete related steps here
        // steps: {
        //    updateMany: {
        //       where: { deletedAt: null }, // Only soft-delete steps that aren't already deleted
        //       data: { deletedAt: new Date() }
        //    }
        // }
      },
    });

    // Return a success message for soft deletion
    res
      .status(200)
      .json({ message: "Workflow soft deleted successfully", workflow }); // 200 with body is clearer for soft delete
  } catch (error) {
    console.error("Error soft-deleting workflow:", error);
    // Handle case where the workflow is not found or already soft-deleted
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ error: "Workflow not found or already deleted" });
    }
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

const workflowController = {
  addNewWorkflow, // Added validation, status, error handling
  addNewStep, // Added validation, status, pre-check for non-deleted workflow, error handling
  cancelWorkflow, // Added validation, status, filter for non-deleted/non-completed workflow, error handling
  getAllWorkflows, // Added deletedAt: null filter for workflow and steps, status
  getSingleWorkflow, // Added deletedAt: null filter for workflow and steps, 404 logic, status
  deleteWorkflow, // New: Soft delete implementation
};

module.exports = workflowController;