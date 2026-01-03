import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LoginLayout({ children, params: { lang } }) {
    const session = await auth();
    if (session) {
        if (session?.user?.role !== "user") {
            return redirect(`/${lang}/admin/dashboard`);
        } else if (session?.user?.role === "user") {
            return redirect(`/${lang}/customer`);
        }
    }
  return <div>{children}</div>;
}
