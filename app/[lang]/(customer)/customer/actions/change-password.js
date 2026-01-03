"use server"

export async function changePassword(prevState, formData) {
  // Removed validation logic

  const currentPassword = formData.get("currentPassword");
  const newPassword = formData.get("newPassword");
  const confirmNewPassword = formData.get("confirmNewPassword");

  // Mock implementation remains the same
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulating API call

  // For demonstration, we'll just check if the current password is "password123"
  if (currentPassword !== "password123") {
    return {
      errors: {
        currentPassword: ["Current password is incorrect"],
      },
      message: "Failed to change password.",
    };
  }

  // Password change successful
  return {
    errors: {},
    message: "Password changed successfully!",
  };
}