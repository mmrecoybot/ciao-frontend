const { cloudinary } = require("../lib/cloudinary"); // Assuming this is the cloudinary SDK config
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const nodemailer = require("nodemailer"); // For sending emails
const path = require("path");
const fetch = require("node-fetch"); // Add fetch if not globally available in your Node env
const { PDFDocument } = require("pdf-lib"); // Import PDF-lib components

// Ensure you have env vars for Cloudinary config (CLOUD_NAME, API_KEY, API_SECRET) and Email (EMAIL_USER, EMAIL_PASS)

// --- Cloudinary/Multer Configuration ---

// // Configure Multer storage with Cloudinary
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: async (req, file) => {
//     // Use async params if accessing req.user.id for dynamic folder

//     // **IMPORTANT**: This middleware runs *after* your authentication middleware.
//     // req.user must be populated by the auth middleware and should contain req.user.id
//     if (!req.user || !req.user.id) {
//       // This scenario should be caught by authentication middleware if it runs before,
//       // but as a fallback within multer config, throwing an error here will prevent upload.
//       // A more robust solution is to ensure auth middleware handles this.
//       console.error(
//         "Multer Storage Error: req.user or req.user.id is not available."
//       );
//       throw new Error("Authentication required for file upload.");
//     }
//     // Ensure req.body.folder is provided and sanitized if used for folder path
//     const dynamicFolder = req.body.folder
//       ? `uploads/${req.user.id}/${req.body.folder.replace(
//           /[^a-zA-Z0-9_/-]/g,
//           "_"
//         )}`
//       : `uploads/${req.user.id}/general`;

//     return {
//       folder: dynamicFolder,
//       allowed_formats: ["jpg", "png", "jpeg", "gif", "pdf"],
//       public_id: (req, file) => {
//         const originalName = path.parse(file.originalname).name;
//         const timestamp = Date.now();
//         const sanitizedOriginalName = originalName.replace(/[^a-zA-Z0-9_-]/g, "_");
//         return `${sanitizedOriginalName}-${timestamp}`.trim();
//       },

//       // Other Cloudinary upload options can go here (e.g., transformation, tags)
//       // tags: ['my-app', req.user.id],
//     };
//   },
// });

// // Initialize Multer middleware
// // Expose this middleware directly for route usage
// const uploadMiddleware = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 10, // Example: 10MB file size limit
//     // fileSize: parseInt(process.env.MAX_UPLOAD_SIZE_BYTES) // Use env var for limit
//   },
//   // Add fileFilter if you need custom file type checks before sending to Cloudinary
//   /* fileFilter: (req, file, cb) => {
//        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
//            cb(null, true);
//        } else {
//            cb(new Error('Unsupported file type'), false);
//        }
//    } */
// }).single("file"); // 'file' is the name of the form field for the file

// // --- File Handling Functions (API Endpoints) ---

// // Upload Asset Endpoint
// const uploadAsset = async (req, res) => {
//   // Multer middleware (uploadMiddleware) handles the actual upload and populates req.file
//   // This function just sends the response after Multer is done.
//   try {
//     const file = req.file; // File uploaded by uploadMiddleware

//     // Check if Multer successfully processed the file
//     if (!file) {
//       // If fileFilter was used and failed, or other multer error occurred
//       // Multer might pass the error to the next middleware, or you might handle it here
//       // depending on how the middleware is integrated.
//       // If it just means no file was sent:
//       if (!req.body.folder) {
//         // Check if folder was required but not sent
//         return res
//           .status(400)
//           .json({ error: "No file uploaded or missing required fields." });
//       } else {
//         return res.status(400).json({ error: "No file uploaded." });
//       }
//     }

//     const folder = req.body.folder; // Folder name sent in the request (used in Multer params)
// console.log(file);

//     // The file object from CloudinaryStorage has details like path (URL), public_id, format etc.
//     res.status(200).json({
//       message: "File uploaded successfully",
//       folder: folder, // The folder value from req.body
//       fileUrl: file.path, // Cloudinary file URL
//       publicId: file.filename, // Cloudinary public ID
//       fileType: file.mimetype,
//       // fileDetails: file, // Optional: return full file object for debugging
//     });
//   } catch (error) {
//     console.error("Error in uploadAsset handler:", error); // Log the actual error
//     // If an error occurs during multer processing (e.g., file size limit, file type),
//     // Multer error handling middleware is usually needed, but catching here as fallback.
//     // Specific Multer errors might have 'code' or be instanceof MulterError
//     if (error.message === "Authentication required for file upload.") {
//       // Error thrown from params async function
//       return res.status(401).json({ error: error.message });
//     }
//     res.status(500).json({ error: error.message || "File upload failed" }); // Provide a more specific error message
//   }
// };
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: (req, _file) => {
      // Dynamic folder name based on request
      return `uploads/${req.user.id}/${req.body.folder}`;
    },
    allowed_formats: ["jpg", "png", "jpeg", "gif", "pdf", "svg", "webp"],
    public_id: (req, file) => {
      // Use original file name without extension as public_id
      const originalName = path.parse(file.originalname).name; // Get name without extension
      const sanitizedOriginalName = originalName.replace(
        /[^a-zA-Z0-9_-]/g,
        "_"
      ); // Sanitize file name
      return sanitizedOriginalName;
    },
  },
});

// Initialize Multer
const upload = multer({ storage });

// Upload Asset
const uploadAsset = async (req, res) => {
  const file = req.file; // File uploaded
  const folder = req.body.folder; // Folder name sent in the request
  try {
    res.status(200).json({
      message: "File uploaded successfully",
      folder: folder,
      fileUrl: file.path, // Cloudinary file URL
      fileDetails: file,
      fileType: file.mimetype,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "File upload failed" });
  }
};

// Delete Asset Endpoint
const deleteAsset = async (req, res) => {
  const { publicId } = req.body; // Cloudinary public ID of the file to delete

  // Basic Validation
  if (!publicId || typeof publicId !== "string") {
    return res.status(400).json({ error: "Valid Public ID is required" });
  }

  try {
    // Use cloudinary.uploader.destroy with the public ID
    const result = await cloudinary.uploader.destroy(publicId);

    // Check the result status if needed (e.g., 'ok' for success, 'not found')
    if (result.result === "not found") {
      // Consider 404 if the asset wasn't found on Cloudinary
      console.warn(`Attempted to delete non-existent asset: ${publicId}`);
      return res
        .status(404)
        .json({ message: "Asset not found on Cloudinary", result });
    }
    if (result.result !== "ok") {
      // Handle other potential non-ok results if Cloudinary returns them
      console.error(`Cloudinary deletion failed for ${publicId}:`, result);
      return res
        .status(500)
        .json({ error: "Cloudinary deletion failed", result });
    }

    res.status(200).json({
      message: `File with public ID ${publicId} deleted successfully`,
      result, // Cloudinary result object
    });
  } catch (error) {
    console.error(`Error deleting file with public ID ${publicId}:`, error);
    res.status(500).json({ error: error.message || "File deletion failed" });
  }
};

// Get All Assets Endpoint (with optional folder filter)
const getAllAssets = async (req, res) => {
  const { folder } = req.query; // Optional folder query parameter

  try {
    // Prepare options for the Cloudinary API call
    const options = {
      type: "upload",
      max_results: parseInt(req.query.limit) || 100, // Allow limit override, default 100
      next_cursor: req.query.next_cursor, // For pagination
      // Add other relevant options like tags, context, etc.
    };

    // If folder is provided, use the prefix option
    if (folder && typeof folder === "string") {
      // You might want to prepend the user ID path here too if fetching user-specific assets
      // Example: options.prefix = `uploads/${req.user.id}/${folder}`;
      options.prefix = folder.replace(/[^a-zA-Z0-9_/-]/g, "_"); // Sanitize folder name
    } else if (req.user && req.user.id) {
      // If no specific folder requested, maybe default to listing user's root upload folder?
      options.prefix = `uploads/${req.user.id}/`;
    }

    // Make the Cloudinary API call to list resources
    const assets = await cloudinary.api.resources(options);

    // Cloudinary API responses contain 'resources' (array of asset info) and 'next_cursor' for pagination
    res.status(200).json({
      message: "Assets fetched successfully",
      resources: assets.resources,
      next_cursor: assets.next_cursor, // Pass this back for client-side pagination
      total_count: assets.total_count, // Cloudinary might provide total count (depends on API version/options)
    });
  } catch (error) {
    console.error("Error fetching assets from Cloudinary:", error);
    // Cloudinary API errors might have specific structure or codes
    res.status(500).json({ error: error.message || "Failed to fetch assets" });
  }
};

// --- Email Sending Functions ---

// Send Email Endpoint
const sendMail = async (req, res) => {
  const { to, subject, text, html } = req.body;

  // Basic Validation
  if (
    !to ||
    typeof to !== "string" ||
    !subject ||
    typeof subject !== "string" ||
    (!text && !html) ||
    (text && typeof text !== "string") ||
    (html && typeof html !== "string")
  ) {
    return res.status(400).json({
      error:
        "Missing or invalid required email fields (to, subject, text or html)",
    });
  }
  // Add email format validation for 'to' if needed

  try {
    // Use the helper function for the actual sending logic
    await sendMailFunc(to, subject, text, html);

    res.status(200).json({
      message: "Email sent successfully",
      // Do not return sensitive info like `info` object from Nodemailer typically
    });
  } catch (error) {
    console.error("Error in sendMail endpoint:", error);
    // The helper function throws a specific error message
    res.status(500).json({ error: error.message || "Email sending failed" });
  }
};

// Send Email Helper Function (used internally by other controllers like auth)
const sendMailFunc = async (to, subject, text, html) => {
  // Basic Validation (can add more robust checks if this is also called with user input)
  if (!to || !subject || (!text && !html)) {
    console.error("sendMailFunc called with missing required fields.");
    throw new Error("Missing required email fields for sending."); // Throw an error for invalid input
  }

  try {
    // Create a Nodemailer transporter
    // Consider creating the transporter once and reusing it if possible in your application setup
    const transporter = nodemailer.createTransport({
      service: "gmail", // Or use host/port/secure options for other providers
      // Ensure these environment variables are configured
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Add connection timeout or other options if needed
      // pool: true, // Use connection pooling for better performance with multiple emails
      // maxConnections: 5,
    });

    // Verify connection configuration if running for the first time or periodically
    // await transporter.verify(); // Add this check if critical

    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender's email address
      to, // Recipient(s)
      subject,
      text, // Plain text body
      html, // HTML body
      // Add attachments, replyTo, cc, bcc etc. as needed
      // attachments: [{ filename: 'example.pdf', path: '/path/to/example.pdf' }]
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);

    // Return success indicator and info object (info contains messageId, response, etc.)
    return { success: true, message: "Email sent successfully", info };
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    // Throw a new Error with a clearer message for the caller
    throw new Error(error.message || "Failed to send email."); // Throw the actual error message from Nodemailer
  }
};

// --- PDF Generation Function ---

// Generate PDF with Image Library Endpoint
const genPdfWithImageLib = async (req, res) => {
  // Image URL should ideally be in the request body for POST requests, but keeping query for PATCH/GET consistency
  const imageUrl = req.query.imageUrl;

  // Validate input
  if (!imageUrl || typeof imageUrl !== "string") {
    return res
      .status(400)
      .json({ error: "Valid image URL is required as a query parameter." });
  }

  try {
    // Validate the image URL domain to prevent SSRF
    const allowedDomains = ["res.cloudinary.com"];
    let parsedUrl;
    try {
      parsedUrl = new URL(imageUrl);
    } catch (e) {
      return res.status(400).json({ error: "Invalid URL provided." });
    }

    if (!allowedDomains.includes(parsedUrl.hostname)) {
      return res
        .status(400)
        .json({ error: "Image URL domain is not allowed." });
    }

    // Fetch the image from the URL using node-fetch or built-in fetch in Node 18+
    const response = await fetch(imageUrl);

    // Check if the image URL was fetched successfully
    if (!response.ok) {
      // Check for 404 specifically if appropriate
      if (response.status === 404) {
        console.error(`Image not found at ${imageUrl}`);
        return res
          .status(404)
          .json({ error: "Image not found at the provided URL." });
      }
      console.error(
        `Failed to fetch image from ${imageUrl}, status: ${response.status}`
      );
      return res
        .status(400) // Use 400 for client-side error (invalid URL/resource)
        .json({
          error: `Failed to fetch the image from the URL. Status: ${response.status}`,
        });
    }

    const imageBytes = await response.arrayBuffer();
    console.log("Fetched image, arrayBuffer size:", imageBytes.byteLength);

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Add an A4-sized page to the document (Portrait orientation)
    const pageWidth = 595.28; // A4 width in points
    const pageHeight = 841.89; // A4 height in points
    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    // Embed the image into the PDF based on its format
    let image;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("image/png")) {
      image = await pdfDoc.embedPng(imageBytes);
    } else if (
      contentType &&
      (contentType.includes("image/jpeg") || contentType.includes("image/jpg"))
    ) {
      image = await pdfDoc.embedJpg(imageBytes);
    } else {
      // Attempt embedding based on URL extension if content type is unreliable
      if (imageUrl.toLowerCase().endsWith(".png")) {
        image = await pdfDoc.embedPng(imageBytes);
      } else if (
        imageUrl.toLowerCase().endsWith(".jpg") ||
        imageUrl.toLowerCase().endsWith(".jpeg")
      ) {
        image = await pdfDoc.embedJpg(imageBytes);
      } else {
        console.error(
          `Unsupported content type or file extension for ${imageUrl}: ${contentType}`
        );
        return res.status(400).json({
          error: `Unsupported image format fetched from URL (Content-Type: ${
            contentType || "N/A"
          }). Only PNG and JPG are supported.`,
        });
      }
    }

    // Scale the image to fit the A4 page with margins while maintaining its aspect ratio
    const margin = 50; // Points
    const usableWidth = pageWidth - margin * 2;
    const usableHeight = pageHeight - margin * 2;

    const { width: originalWidth, height: originalHeight } = image;
    const scale = Math.min(
      usableWidth / originalWidth,
      usableHeight / originalHeight
    );

    const scaledWidth = originalWidth * scale;
    const scaledHeight = originalHeight * scale;

    // Center the image on the page
    const x = (pageWidth - scaledWidth) / 2;
    const y = (pageHeight - scaledHeight) / 2; // Center vertically

    page.drawImage(image, {
      x,
      y,
      width: scaledWidth,
      height: scaledHeight,
    });

    // Serialize the PDF to bytes
    const pdfBytes = await pdfDoc.save();
    console.log("Created PDF, byte size:", pdfBytes.byteLength);

    // Send the PDF as a response
    res.setHeader("Content-Type", "application/pdf");
    // Suggest a dynamic filename based on image URL if possible
    const suggestedFilename =
      path.parse(new URL(imageUrl).pathname).name || "output";
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${suggestedFilename}.pdf"`
    );
    res.status(200).send(Buffer.from(pdfBytes)); // Send buffer with status 200
  } catch (error) {
    console.error("Error generating PDF from image:", error.message);
    // Catch errors from fetch, pdf-lib embedding, etc.
    res.status(500).json({
      error:
        error.message ||
        "Failed to create the PDF. Please check the image URL and format.",
    });
  }
};

// Export functions and the Multer middleware
const libController = {
  uploadAsset, // Endpoint that uses the middleware result
  deleteAsset, // Endpoint for deleting from Cloudinary
  sendMail, // Endpoint for sending email via API
  getAllAssets, // Endpoint for listing Cloudinary assets
  genPdfWithImageLib, // Endpoint for PDF generation
  sendMailFunc, // Helper function for sending email (used internally)
  uploadMiddleware: upload.single("file"), // Export the configured Multer middleware directly
};
module.exports = libController;
