const jwt = require("jsonwebtoken");
const prisma = require("../config/db");
const util = require('util'); // Node.js built-in module for utilities

// Promisify jwt.verify for easier async/await usage
const verifyAsync = util.promisify(jwt.verify);


/**
 * Middleware to authenticate user via access token.
 * Verifies the token, decodes the user ID, looks up the user in the database,
 * and ensures the user is not soft-deleted before attaching the user object to the request.
 *
 * @param {Object} req - Express request object. Expects Authorization: Bearer <token> header.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void} - Calls next() on success, sends response on failure.
 */
const authenticateToken = async (req, res, next) => {
  // Extract token from Authorization header (Bearer token)
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // 1. Check if token exists
  if (!token) {
    // Use 401 Unauthorized for missing authentication credentials
    return res.status(401).json({ message: "Access token is required" });
  }

  try {
    // 2. Verify the token signature and expiry
    // If verification fails (invalid signature, expired), an error is thrown.
    const decoded = await verifyAsync(token, process.env.ACCESS_TOKEN_SECRET);

    // The decoded payload should contain the user ID (e.g., { id: userId, ... })
    if (!decoded || !decoded.id) {
         console.error("Access token payload missing user ID:", decoded);
         return res.status(401).json({ message: "Invalid access token payload" });
    }

    // 3. Look up the user in the database
    // Crucially, only find the user if they are NOT soft-deleted.
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id, // User ID from the token payload
        deletedAt: null, // *** Add this condition to check for soft deletion ***
      },
      // Include relations needed for the application's context if necessary,
      // e.g., role, dealer, permissions. Fetching the role is recommended
      // to ensure the role attached to the request is current.
      include: { role: true }, // Include user's current role
    });

    // 4. Check if user exists and is active (not deleted)
    // If user is null, it means either the ID from the token doesn't exist,
    // or the user exists but is soft-deleted. In both cases, the token
    // is invalid for accessing protected resources.
    if (!user) {
      console.warn(`Authentication failed for user ID ${decoded.id}: User not found or is deleted.`);
      return res.status(401).json({ message: "Invalid access token (User not found or deactivated)" }); // 401 Unauthorized
    }

    // 5. Attach the fetched user object (including current role) to the request object
    // This ensures req.user has the latest data from the DB and is guaranteed to be an active user.
    req.user = user;

    // 6. Proceed to the next middleware or route handler
    next();

  } catch (err) {
    console.error("Error verifying access token or finding user:", err.message);

    // Handle specific JWT verification errors
    if (err.name === 'TokenExpiredError') {
      // If the token is expired, return 401. The client can then attempt refresh.
      return res.status(401).json({ message: "Access token expired" });
    }
    if (err.name === 'JsonWebTokenError') {
       // Invalid signature, malformed token, etc.
       return res.status(401).json({ message: "Invalid access token" }); // 401 Unauthorized
    }

    // Handle other errors (e.g., database errors)
    return res.status(500).json({ message: "Authentication failed due to server error" }); // 500 Internal Server Error
  }
};

module.exports = authenticateToken;