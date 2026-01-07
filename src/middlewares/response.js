const prisma = require("../config/db");

/**
 * Middleware to log request and response details, saving them as a Workflow entry.
 * Relies on `authenticateToken` middleware having run before it to populate `req.user`
 * with an authenticated, non-deleted user object.
 *
 * Note: Logging every response synchronously to the database can be a performance bottleneck
 * under high traffic. Consider asynchronous logging mechanisms for production.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void} - Calls next(). Overrides res.send.
 */
const responseLogger = (req, res, next) => {
  const start = Date.now(); // Record start time of the request

  // Keep a reference to the original res.send function
  const originalSend = res.send;

  // Override res.send
  res.send = async function (body) {
    const responseTime = Date.now() - start; // Calculate response time
    const user = req.user; // Get user info from the request (populated by auth middleware)

    // Extract user details safely. req.user should be a non-deleted user object.
    const userId = user?.id ? user.id : "anonymous"; // Default to 'anonymous' if user not available
    // Assume user.role is an object { id: ..., name: ... } if role is included by auth middleware
    const userRoleName = user?.role?.name ? user.role.name : "none"; // Get role name or default

    // Prepare data for logging
    let responseBodyForLog;
    try {
      // Attempt to parse the body if it's a string, otherwise use it directly
      // This handles res.send('string'), res.send({ json }), res.send([array]), res.send(buffer), etc.
      responseBodyForLog = typeof body === "string" ? JSON.parse(body) : body;
      // Limit the size of the response body logged to avoid filling the database
      // Example: Stringify and truncate large bodies
      const maxBodySize = 1024; // Log up to 1KB of the response body
      if (
        typeof responseBodyForLog === "object" ||
        Array.isArray(responseBodyForLog)
      ) {
        responseBodyForLog = JSON.stringify(responseBodyForLog);
        if (responseBodyForLog.length > maxBodySize) {
          responseBodyForLog =
            responseBodyForLog.substring(0, maxBodySize) + "...[truncated]";
        }
      } else if (
        typeof responseBodyForLog === "string" &&
        responseBodyForLog.length > maxBodySize
      ) {
        responseBodyForLog =
          responseBodyForLog.substring(0, maxBodySize) + "...[truncated]";
      } else if (responseBodyForLog instanceof Buffer) {
        responseBodyForLog = `Buffer of size ${responseBodyForLog.byteLength}`; // Don't log buffer content
      }
    } catch (e) {
      // If JSON parsing failed (e.g., non-JSON string response)
      console.error("Error parsing response body for logging:", e);
      responseBodyForLog =
        String(body).substring(0, 500) + "...[parse error or non-string]"; // Log partial string or indicator
    }

    // Construct the activity log data structure based on the Workflow model
    // Using Workflow as a generic activity log model as per your pattern
    const activityLogData = {
      type: `${req.method} ${req.originalUrl}`, // Type of activity
      // ReferenceId points to the user performing the action
      // Ensure it's a string if your model expects String, or Number if Int
      // If userId is 'anonymous', use a placeholder or null if allowed by schema
      referenceId: userId !== "anonymous" ? String(userId) : "0", // Or null, depending on schema (assuming String type)
      status: res.statusCode.toString(), // Store status code as string
      metadata: {
        // Store additional details in metadata (Json field)
        responseTime: responseTime,
        timestamp: new Date().toISOString(), // Log the exact time the response was sent
        method: req.method,
        path: req.originalUrl,
        userAgent: req.get("user-agent"), // Log user agent
        ip: req.ip, // Log IP address
        // Log response body carefully to avoid sensitive data
        responseBody: responseBodyForLog, // Include the processed response body
      },
      // deletedAt is null by default for a new log entry
    };

    // Create a step within the workflow entry
    // Note: This creates a workflow with one step. You might just want a flat log table instead of Workflow/WorkflowStep.
    // If using Workflow/WorkflowStep, ensure the step data matches that model.
    const stepData = {
      action: `${req.method} ${req.originalUrl}`, // Action performed (same as type)
      // Actor ID is the user ID performing the action
      actorId: userId !== "anonymous" ? userId : null, // Use null if anonymous and schema allows
      actorRole: userRoleName, // Use the extracted role name
      metadata: {
        // Metadata specific to the step (can overlap with workflow metadata)
        // Add step-specific metadata if needed
        statusCode: res.statusCode, // Redundant if also in workflow metadata, but consistent with original structure
      },
      // deletedAt is null by default for a new step
    };

    // Combine activityLogData and stepData into a single logData object for the new Log model


    try {
      await prisma.workflow.create({
        data: {
          ...activityLogData,
          steps: {
            create: stepData,
          },
        },
      });
      // console.log('Saved workflow log for:', activityLogData.type); // Log successful save
    } catch (error) {
      // Log the error saving the workflow log to the database, but continue sending the response
      console.error("Error saving workflow log to database:", error);
      // Important: DO NOT send a response here (res.status or res.json),
      // as the original response is about to be sent.
    } finally {
      // Call the original res.send function to send the response to the client.
      // This MUST happen regardless of whether saving the log succeeded or failed.
      // Use .apply() or .call() to maintain the correct 'this' context.
      originalSend.call(this, body);
    }
  };

  // Proceed to the next middleware or route handler immediately
  next();
};

module.exports = { responseLogger };
