// Assume User model includes:
// model User {
//   id                 Int       @id @default(autoincrement())
//   name               String
//   email              String    @unique
//   password           String // Remember to hash passwords!
//   roleId             Int
//   role               Role      @relation(fields: [roleId], references: [id])
//   passwordResetToken String?   @unique // Unique for pending resets
//   passwordResetExpires DateTime?
//   createdAt          DateTime  @default(now())
//   updatedAt          DateTime  @updatedAt
//   deletedAt          DateTime? // NULL means not deleted
//   refreshToken       RefreshToken[] // Assuming relation
//   Order              Order[] // Assuming relation
//   Activation         Activation[] // Assuming relation
//   Notification       Notification[] // Assuming relation
//   OrderStatusHistory OrderStatusHistory[] // Assuming relation
// }

// Assume RefreshToken model includes:
// model RefreshToken {
//    id       Int       @id @default(autoincrement())
//    token    String    @unique
//    userId   Int
//    user     User      @relation(fields: [userId], references: [id])
//    createdAt DateTime @default(now())
// }


const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const prisma = require("../config/db");
const { sendMailFunc } = require("./libController"); // Assuming this exists and works
const util = require('util');
const verifyAsync = util.promisify(jwt.verify);

// --- Authentication & User Management Functions ---

const register = async (req, res) => {
  try {
    const { name, email, password, roleId } = req.body;

    // Basic Validation
    if (!name || !email || !password || roleId === undefined) {
      return res.status(400).json({ message: "Missing required fields (name, email, password, roleId)" });
    }
    const roleIdNum = Number(roleId);
    if (isNaN(roleIdNum)) {
      return res.status(400).json({ message: "Invalid roleId provided" });
    }
    // Add basic email format validation if needed

    // Check if user with this email exists (active or deleted)
    // Prisma's @unique constraint on email prevents duplicate emails regardless of deletedAt
    // If you want to allow re-registering with a soft-deleted email, you need a custom
    // unique constraint (e.g., unique constraint on [email, deletedAt] where deletedAt is null)
    // and manual checks. Sticking to standard @unique behavior for now.
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      // Provide a more specific error if they are just soft-deleted vs active
      if (user.deletedAt) {
        // Optional: Handle this case differently if you want to allow reactivation
        return res.status(409).json({ message: "User with this email is deactivated." });
      }
      return res.status(409).json({ message: "Registration failed or user already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT_ROUNDS || 10) // Use a default if env var is missing
    );

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId: roleIdNum, // Use numeric roleId
        // deletedAt is null by default on creation
      },
    });

    // In a real app, you might send a confirmation email here

    res
      .status(201) // 201 Created
      .json({ message: "User registered successfully", user: newUser });

  } catch (error) {
    console.error("Error during user registration:", error);
    // Handle specific Prisma errors like unique constraint violation (P2002)
    if (error.code === 'P2002') {
      return res.status(409).json({ message: `User with email "${req.body.email}" already exists.` });
    }
    // Handle foreign key constraint violation (P2003) for roleId
    if (error.code === 'P2003') {
      return res.status(400).json({ message: "Invalid roleId provided" });
    }
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find the user by email, *only if they are not deleted*
    const user = await prisma.user.findUnique({
      where: {
        email,
        deletedAt: null, // Only allow login for non-deleted users
      },
      include: { role: true,}, // Include role details
    });

    // If user not found OR found but deleted (due to where clause)
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials (User not found or is deactivated)" }); // Use 401 for authentication failure
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials (Incorrect password)" }); // Use 401
    }

    // Create access token
    // Note: Storing the entire role object in the token might be large.
    // Consider storing only role ID or role name.
    const accessToken = jwt.sign(
      { id: user.id, role: user.role }, // Include role in token payload
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m', // Use default if env var missing
      }
    );

    // Create refresh token
    // Note: The refresh token payload typically only needs the user ID
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d', // Use default if env var missing
      }
    );

    // Store refresh token in the database
    // Ensure RefreshToken model has userId field
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        // refreshToken might have its own deletedAt if you soft-delete tokens, but hard delete is common.
      },
    });

    // Send the tokens and user info back in the response
    res.status(200).json({ // 200 OK
      message: "Login successful!",
      token: accessToken,
      refreshToken,
      user: { // Return necessary user info, exclude sensitive fields like password/deletedAt
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role, // Include role
        dealerId: user.dealerId // Include dealerId
      },
    });

  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Basic Validation
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    // Delete the refresh token from the database
    // Use deleteMany in case multiple tokens exist, or findUnique + delete if you expect only one
    // Let's stick to deleteUnique as in the original code, but    // Delete the refresh token from the database
    await prisma.refreshToken.delete({
      where: { token: refreshToken },
    });

    // If delete succeeded, token was found
    console.log("Refresh token deleted successfully");
    res.status(200).json({ message: "Logged out successfully" }); // 200 OK with message

  } catch (error) {
    console.error("Error during logout:", error);
    // Handle case where refresh token was not found (e.g., already deleted, invalid)
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Refresh token not found" }); // Or 400 depending on expected behavior
    }
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "No refresh token provided" });
    }

    // Find the refresh token in the database
    // If RefreshToken has deletedAt, add filter here: where: { token: refreshToken, deletedAt: null }
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken) {
      // Token not found in DB means it's invalid or has been revoked/deleted
      return res.status(401).json({ message: "Invalid or expired refresh token" }); // Use 401
    }

    // Verify the refresh token's signature and expiry
    const decoded = await verifyAsync(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Find the user associated with the refresh token, *only if they are not deleted*
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id, // User ID from refresh token payload
        deletedAt: null // Ensure the user is not deleted
      },
      include: { role: true } // Include role for the new access token
    });

    // If user not found OR found but deleted (due to where clause)
    if (!user) {
      // Stored token exists but user is deleted -> token is invalid for getting new access token
      // Optionally, delete the stored token here as the user is invalid
      await prisma.refreshToken.delete({ where: { token: refreshToken } }).catch(console.error); // Log delete error, don't block refresh response

      return res.status(401).json({ message: "User not found or is deactivated" }); // Use 401
    }


    // Create a new access token
    const newAccessToken = jwt.sign(
      { id: user.id, role: user.role }, // Include user ID and role from the database record
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m',
      }
    );

    res.status(200).json({ accessToken: newAccessToken }); // 200 OK

  } catch (error) {
    console.error("Error during token refresh:", error);
    // If jwt.verify fails, it throws an error (e.g., TokenExpiredError, JsonWebTokenError)
    // These indicate an invalid token signature or expired token
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Refresh token has expired" });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid refresh token signature" });
    }
    return res.status(500).json({ message: error.message || "Internal Server Error" }); // Generic 500 for other errors
  }
};

// Get user by ID (excluding soft-deleted) - Added this common function
const getUserById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID provided" });
    }

    // Find user by ID, but only if not deleted
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
        deletedAt: null, // Only find non-deleted user
      },
      include: { role: true } // Include role if needed
      // Include other relations like dealer, orders etc. if this is a profile endpoint
      // include: { role: true, dealer: true, Order: { where: { deletedAt: null } }, ... }
    });

    if (!user) {
      // If user not found or found but deleted
      return res.status(404).json({ message: "User not found or is deleted" }); // 404 Not Found
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      // Include other non-sensitive fields you fetched
    }); // 200 OK

  } catch (error) {
    console.error("Error getting user by ID:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};


const changeUserPassword = async (req, res) => {
  try {
    // Get ID from params or authenticated user (params is less secure)
    // Assuming id is from params based on original code, but strongly recommend using req.user.id
    const userId = parseInt(req.body.id || req.params.id); // Prioritize body if id is in body too? Or strictly params? Let's assume id from params or body
    const { currentPassword, newPassword } = req.body;

    // Basic Validation
    if (isNaN(userId) || !currentPassword || !newPassword) {
      return res.status(400).json({ message: "Valid user ID, current password, and new password are required" });
    }
    // Add validation for newPassword strength if needed

    // Find the user by ID, *only if they are not deleted*
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
        deletedAt: null, // Only allow changing password for non-deleted users
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found or is deleted" }); // 404 Not Found
    }

    // Verify current password
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Current password is incorrect" }); // 401 Unauthorized
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_SALT_ROUNDS || 10));

    // Update password
    const updatedUser = await prisma.user.update({
      where: { id: userId }, // Update by ID regardless of deleted status if it was found (it wasn't because of the filter)
      data: {
        password: hashedPassword,
        // Keep deletedAt as is, unless you want changing password to implicitly undelete
        // deletedAt: null // Uncomment if changing password should undelete
      },
      select: { id: true, name: true, email: true } // Select non-sensitive fields for response
    });

    res.status(200).json({ message: "Password changed successfully", user: updatedUser }); // 200 OK

  } catch (error) {
    console.error("Error changing user password:", error);
    // Handle P2025 if the update fails (shouldn't happen with the findUnique check unless concurrent modification)
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "User not found" }); // Fallback 404
    }
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Basic Validation
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    // Add basic email format validation if needed

    // Find the user by email, *only if they are not deleted*
    // If you want to allow resetting password for soft-deleted users (to undelete them), remove deletedAt: null here.
    const user = await prisma.user.findUnique({
      where: {
        email,
        deletedAt: null, // Only allow forgot password for non-deleted users
      }
    });

    // If user not found OR found but deleted (due to where clause)
    if (!user) {
      return res.status(404).json({ message: "User not found with that email or is deactivated." }); // 404 Not Found
    }

    // Generate a unique password reset token (using JWT)
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.PASSWORD_RESET_TOKEN_EXPIRY || '15m', // Use env var or default
    });

    // Save the token and its expiration time in the database
    await prisma.user.update({
      where: { id: user.id }, // Update by ID regardless of deleted status (it was found as non-deleted)
      data: {
        passwordResetToken: token,
        passwordResetExpires: new Date(Date.now() + (parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRY_MS) || 15 * 60 * 1000)), // Use env var for ms or default
      },
    });

    // Prepare email content
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const subject = "Password Reset Request";
    const text = `You requested a password reset. Please use the following link to reset your password: ${resetLink}\n\nThis link will expire in ${process.env.PASSWORD_RESET_TOKEN_EXPIRY || '15 minutes'}.`;
    const html = `
    <p>You requested a password reset.</p>
    <p>Please click the link below to reset your password:</p>
    <a href="${resetLink}">${resetLink}</a>
    <p>This link will expire in ${process.env.PASSWORD_RESET_TOKEN_EXPIRY || '15 minutes'}.</p>
    <p>If you did not request a password reset, please ignore this email.</p>
  `;

    // Send the email using your email service function
    await sendMailFunc(user.email, subject, text, html); // Send to the user's email


    res.status(200).json({ message: "Password reset email has been sent successfully." }); // 200 OK

  } catch (error) {
    console.error("Error during forgot password request:", error);
    res.status(500).json({ error: error.message || "Something went wrong while requesting a password reset." }); // Generic 500
  }
};

const resetPassword = async (req, res) => {
  // Check for POST method is typically handled by router config, not here.
  // if (req.method !== 'POST') { return res.status(405).json({ error: 'Method not allowed.' }); } // Remove this line

  try {
    const { token, newPassword } = req.body;

    // Basic Validation
    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token and new password are required." });
    }
    // Add validation for newPassword strength if needed

    let decoded;
    try {
      // Verify the token signature and expiry
      decoded = await verifyAsync(token, process.env.JWT_SECRET);
    } catch (err) {
      // If verification fails, the token is invalid or expired
      return res.status(401).json({ error: 'Invalid or expired token.' }); // 401 Unauthorized
    }

    const userId = decoded.userId;
    // Validate userId from token payload
    if (isNaN(userId)) {
      console.error("Invalid userId in password reset token payload:", decoded.userId);
      return res.status(401).json({ error: 'Invalid token payload.' }); // 401 Unauthorized
    }


    // Find the user by ID from the token payload.
    // DO NOT filter by deletedAt: null here. We want to find the user regardless of their deleted status
    // so they can reset their password and potentially be undeleted.
    const user = await prisma.user.findUnique({ where: { id: userId } });

    // Check if user exists, the token matches, and the token is not expired
    if (!user || user.passwordResetToken !== token || new Date(user.passwordResetExpires || 0) < new Date()) { // Handle potential null passwordResetExpires
      // If any of these conditions fail, the token is invalid or has been used/expired
      return res.status(401).json({ error: 'Invalid or expired token.' }); // 401 Unauthorized
    }

    const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_SALT_ROUNDS || 10)); // Use env var or default

    await prisma.user.update({
      where: { id: userId }, // Update by ID
      data: {
        password: hashedPassword,
        passwordResetToken: null, // Clear reset token fields
        passwordResetExpires: null,
        deletedAt: null, // <-- Add this: Successfully resetting password also undeletes the user
      },
      select: { id: true, name: true, email: true } // Select non-sensitive fields for response
    });

    // Optional: Send a password change confirmation email here

    res.status(200).json({ message: 'Password has been reset and user activated successfully.' }); // 200 OK, adjusted message

  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({ error: error.message || 'Something went wrong while resetting the password.' }); // Generic 500
  }
};




module.exports = {
  register, // Handles unique email (standard Prisma behavior)
  login, // Filters by deletedAt: null
  logout, // No change related to user soft delete
  refresh, // Filters user lookup by deletedAt: null
  getUserById, // New function, filters by deletedAt: null
  changeUserPassword, // Filters user lookup by deletedAt: null
  forgotPassword, // Filters user lookup by deletedAt: null
  resetPassword, // Finds user regardless of deletedAt, sets deletedAt: null in update data
};