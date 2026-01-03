"use server";
import { signIn, signOut, auth } from "@/auth";
import { redirect } from "next/navigation";

export async function login(formData, role) {
  try {
    const response = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      role: role || "customer",
      redirect: false,
    });

    if (!response?.error) {
      const session = await auth();
      return { ...response, role: session?.user?.role };
    }
    return response;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

export async function logout() {
  try {
    await signOut({ redirect: false });
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    // You might want to return an error message or status here
    return { error: "Failed to logout. Please try again." };
  }
}
