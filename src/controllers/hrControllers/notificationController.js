// Assume Notification model includes:
// model Notification {
//   id        Int       @id @default(autoincrement())
//   title     String
//   body      String
//   userId    Int
//   user      User      @relation(fields: [userId], references: [id])
//   seen      Boolean   @default(false)
//   createdAt DateTime  @default(now())
//   updatedAt DateTime  @updatedAt
//   deletedAt DateTime? // NULL means not deleted
// }

const prisma = require("../../config/db");
// Import controllers
// const notificationController = require("../../controllers/hrControllers/notificationController");
// Notification controller
const notificationController = {


  addNewNotification: async (req, res) => {
    try {
      const { title, body, userId } = req.body;
      const userIdNum = Number(userId);

      // Basic validation
      if (!title || !body || userId === undefined || isNaN(userIdNum)) {
        return res.status(400).json({
          error:
            "Missing required fields (title, body, userId) or invalid userId",
        });
      }

      const notification = await prisma.notification.create({
        data: {
          title,
          body,
          userId: userIdNum, // Ensure userId is a number
          seen: false,
          // deletedAt is null by default
        },
      });

      res.status(201).json(notification); // Use 201 for resource creation
    } catch (error) {
      console.error("Error adding new notification:", error); // Log the error
      // Handle foreign key constraint violation if userId doesn't exist
      if (error.code === "P2003") {
        return res
          .status(400)
          .json({ error: "Invalid userId provided, user not found" });
      }
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  },

  // Update a notification (specifically marking as seen by default, or allowing other updates)
  updateNotification: async (req, res) => {
    try {
      const { id } = req.params;
      const notificationId = parseInt(id);

      if (isNaN(notificationId)) {
        return res
          .status(400)
          .json({ error: "Invalid notification ID provided" });
      }

      // By default, this function only updates 'seen' to true.
      // If you want a generic update function, parse req.body like in other controllers.
      // Assuming this specific route/function is just for marking as seen:
      const updateData = { seen: true };

      // If you want to allow undeleting via this route as well:
      // const { seen, deletedAt } = req.body;
      // const updateData = {};
      // if (seen !== undefined) updateData.seen = seen;
      // if (deletedAt !== undefined) updateData.deletedAt = deletedAt === null ? null : new Date(deletedAt);

      const notification = await prisma.notification.update({
        where: {
          id: notificationId,
          // Usually, you'd only update a non-deleted notification for typical operations (like marking seen).
          // If you need to update a deleted one (e.g., for undelete), remove deletedAt: null here.
          // For marking as seen, it makes sense to only update if it's not deleted.
          deletedAt: null, // Add this condition
        },
        data: updateData,
      });

      res.status(200).json(notification); // Use 200 for success
    } catch (error) {
      console.error("Error updating notification:", error); // Log the error
      // Handle case where ID is not found or already soft-deleted
      if (error.code === "P2025") {
        return res
          .status(404)
          .json({ error: "Notification not found or is deleted" });
      }
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  },

  // Delete a notification (soft delete)
  deleteNotification: async (req, res) => {
    try {
      const { id } = req.params;
      const notificationId = parseInt(id);

      if (isNaN(notificationId)) {
        return res
          .status(400)
          .json({ error: "Invalid notification ID provided" });
      }

      // Perform soft deletion by updating the deletedAt field
      // Include deletedAt: null in where to ensure it fails if already deleted
      const notification = await prisma.notification.update({
        where: {
          id: notificationId,
          deletedAt: null, // Ensure it's not already deleted
        },
        data: { deletedAt: new Date() }, // Set deletedAt to the current date/time
      });

      // Return a success message for soft deletion
      res.status(200).json({
        message: "Notification soft deleted successfully",
        notification,
      }); // 200 with body is clearer for soft delete
    } catch (error) {
      console.error("Error soft-deleting notification:", error); // Log the error
      // Handle case where the notification is not found or already soft-deleted
      if (error.code === "P2025") {
        return res
          .status(404)
          .json({ error: "Notification not found or already deleted" });
      }
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  },

  // Get all notifications for a user (excluding soft-deleted)
  getAllNotificationsByUserId: async (req, res) => {
    try {
      const { userId } = req.params;
      const userIdNum = parseInt(userId);

      if (isNaN(userIdNum)) {
        return res.status(400).json({ error: "Invalid user ID provided" });
      }

      // Find notifications for the user, only if deletedAt is null
      const notifications = await prisma.notification.findMany({
        where: {
          userId: userIdNum, // Ensure userId is a number
          deletedAt: null, // Add this condition
        },
        orderBy: { createdAt: "desc" }, // Keep original ordering
      });

      // Optional: Return 404 if no notifications are found for the user (deleted or not)
      // if (notifications.length === 0) {
      //      return res.status(404).json({ error: "No notifications found for this user or all notifications are deleted" });
      // }

      res.status(200).json(notifications); // Use 200 for success
    } catch (error) {
      console.error("Error getting notifications by user ID:", error); // Log the error
      // Handle foreign key constraint error if userId doesn't exist (less likely in findMany)
      if (error.code === "P2003") {
        // This might happen if userId is valid type but doesn't exist as a User,
        // depending on Prisma setup.
        return res.status(400).json({ error: "Invalid user ID provided" });
      }
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  },

  // Get a single notification (excluding soft-deleted)
  getSingleNotification: async (req, res) => {
    try {
      const { id } = req.params;
      const notificationId = parseInt(id);

      if (isNaN(notificationId)) {
        return res
          .status(400)
          .json({ error: "Invalid notification ID provided" });
      }

      // Find unique notification, but only if deletedAt is null
      const notification = await prisma.notification.findUnique({
        where: {
          id: notificationId,
          deletedAt: null, // Add this condition
        },
      });

      if (!notification) {
        // Return 404 if not found or if it exists but is soft-deleted
        return res
          .status(404)
          .json({ error: "Notification not found or is deleted." });
      }

      res.status(200).json(notification); // Use 200 for success
    } catch (error) {
      console.error("Error getting single notification:", error); // Log the error
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  },

  // Get all notifications (excluding soft-deleted)
  getAllNotifications: async (req, res) => {
    try {
      // Find all notifications where deletedAt is null
      const notifications = await prisma.notification.findMany({
        where: { deletedAt: null }, // Add this condition
        orderBy: { createdAt: "desc" }, // Keep original ordering
      });
      res.status(200).json(notifications); // Use 200 for success
    } catch (error) {
      console.error("Error getting all notifications:", error); // Log the error
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  },
}

module.exports = notificationController;
