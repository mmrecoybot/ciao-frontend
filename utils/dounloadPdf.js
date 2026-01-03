// import { PDFDocument } from "pdf-lib";

// const genPdfWithImageLiba = async (imageUrl) => {
//   if (!imageUrl) {
//     console.error("No image URL provided.");
//     return { success: false, error: "No image URL provided." };
//   }

//   try {
//     // Fetch the image from the URL
//     const response = await fetch(imageUrl);
//     if (!response.ok) {
//       console.error(`Failed to fetch image from ${imageUrl}, status: ${response.status}`);
//       return { success: false, error: `Failed to fetch image. Status: ${response.status}` };
//     }

//     const imageBytes = await response.arrayBuffer();

//     // Create a new PDF document
//     const pdfDoc = await PDFDocument.create();

//     // Add an A4-sized page to the document
//     const page = pdfDoc.addPage([595.28, 841.89]);

//     // Embed the image into the PDF
//     const fileType = imageUrl.split(".").pop().toLowerCase();
//     let image;
//     if (fileType === "png") {
//       image = await pdfDoc.embedPng(imageBytes);
//     } else if (fileType === "jpg" || fileType === "jpeg") {
//       image = await pdfDoc.embedJpg(imageBytes);
//     } else {
//       console.error("Unsupported image format:", fileType);
//       return { success: false, error: "Unsupported image format." };
//     }

//     // Scale the image to fit within the page's margins while maintaining aspect ratio
//     const { width, height } = image.scale(1);
//     const maxWidth = 595.28 - 100; // 50px margins on both sides
//     const maxHeight = 841.89 - 100; // 50px margins on top and bottom
//     const scale = Math.min(maxWidth / width, maxHeight / height);
//     const scaledWidth = width * scale;
//     const scaledHeight = height * scale;

//     // Center the image on the page
//     const x = (595.28 - scaledWidth) / 2;
//     const y = (841.89 - scaledHeight) / 2;

//     page.drawImage(image, {
//       x,
//       y,
//       width: scaledWidth,
//       height: scaledHeight,
//     });

//     // Serialize the PDF to bytes
//     const pdfBytes = await pdfDoc.save();
//     console.log("Created PDF successfully.");
//     return { success: true, data: pdfBytes };
//   } catch (error) {
//     console.error("Error creating PDF:", error);
//     return { success: false, error: error.message };
//   }
// };
// export default genPdfWithImageLiba ;
import jsPDF from "jspdf";
import { PDFDocument } from "pdf-lib";

const genPdfWithImageLiba = async (imageUrl) => {
  if (!imageUrl) {
    console.error("No image URL provided.");
    return { success: false, error: "No image URL provided." };
  }

  try {
    // Fetch the image from the URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error(`Failed to fetch image from ${imageUrl}, status: ${response.status}`);
      return { success: false, error: `Failed to fetch image. Status: ${response.status}` };
    }

    const imageBytes = await response.arrayBuffer();

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Add an A4-sized page to the document
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 dimensions in points

    // Embed the image into the PDF
    const fileType = imageUrl.split(".").pop().toLowerCase();
    let image;
    if (fileType === "png") {
      image = await pdfDoc.embedPng(imageBytes);
    } else if (fileType === "jpg" || fileType === "jpeg") {
      image = await pdfDoc.embedJpg(imageBytes);
    } else {
      console.error("Unsupported image format:", fileType);
      return { success: false, error: "Unsupported image format." };
    }

    // Scale the image to fit within the page's margins while maintaining aspect ratio
    const { width, height } = image.scale(1); // Get original dimensions of the image
    const maxWidth = 595.28 - 100; // Page width minus 50px margins on both sides
    const maxHeight = 841.89 - 100; // Page height minus 50px margins on top and bottom

    // Calculate the scale factor to fit the image within max dimensions
    const scale = Math.min(maxWidth / width, maxHeight / height);

    // Calculate the scaled width and height
    const scaledWidth = width * scale;
    const scaledHeight = height * scale;

    // Center the image on the page
    const x = (595.28 - scaledWidth) / 2; // Horizontal centering
    const y = (841.89 - scaledHeight) / 2; // Vertical centering

    // Draw the image onto the page
    page.drawImage(image, {
      x,
      y,
      width: scaledWidth,
      height: scaledHeight,
    });

    // Serialize the PDF to bytes
    const pdfBytes = await pdfDoc.save();

    console.log("Created PDF successfully.");
    return { success: true, data: pdfBytes };
  } catch (error) {
    console.error("Error creating PDF:", error);
    return { success: false, error: error.message };
  }
};



// Function to create PDF with adaptive orientation
const createPDF = (imgSrc, fileName) => {
  const img = new Image();
  img.src = imgSrc;

  img.onload = () => {
    const { width, height } = img;
    const orientation = width > height ? "landscape" : "portrait"; // Determine orientation
    const pdf = new jsPDF(orientation);

    // Calculate dimensions to fit the image on A4 size
    const pageWidth = orientation === "landscape" ? 297 : 210;
    const pageHeight = orientation === "landscape" ? 210 : 297;
    const aspectRatio = width / height;

    let imgWidth, imgHeight;

    // Scale the image to fit on the page, maintaining aspect ratio
    if (aspectRatio > 1) {
      // Landscape image (wider than tall)
      imgWidth = pageWidth;
      imgHeight = pageWidth / aspectRatio;
      // If the image is too tall for the page, scale by height instead
      if (imgHeight > pageHeight) {
        imgHeight = pageHeight;
        imgWidth = pageHeight * aspectRatio;
      }
    } else {
      // Portrait image (taller than wide)
      imgHeight = pageHeight;
      imgWidth = pageHeight * aspectRatio;
      // If the image is too wide for the page, scale by width instead
      if (imgWidth > pageWidth) {
        imgWidth = pageWidth;
        imgHeight = pageWidth / aspectRatio;
      }
    }

    const x = (pageWidth - imgWidth) / 2; // Center horizontally
    const y = (pageHeight - imgHeight) / 2; // Center vertically

    // Add the image to the PDF
    pdf.addImage(img, "JPEG", x, y, imgWidth, imgHeight);

    // Save the PDF
    pdf.save(`${fileName}.pdf`);
  };

  img.onerror = (err) => {
    console.error("Error loading image:", err);
  };
};

export default createPDF;

