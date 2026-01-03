"use server";
import { redirect } from "next/navigation";

// export default async function redirectHard(uri) {
//   redirect(uri);
// }

export const redirectHard = (url) => {
  window.location.href = url;
};
