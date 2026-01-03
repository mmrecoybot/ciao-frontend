import { auth } from "@/auth";
import LayoutWrap from "./components/LayoutWrap";
import { redirect } from "next/navigation";
import "@/app/globals.css";
import { getDictionary } from "@/app/[lang]/dictionary";

const DashboardLayout = async ({ children, params }) => {
  const session = await auth();

  if (!session) return redirect(`/${params.lang}/admin-login`);
  const { lang } = params;
  const dictionary = await getDictionary(lang);
  if (session?.user?.role == "user") {
    return redirect(`/${params.lang}/customer`);
  }
  return (
    <html lang={lang}>
      <body>
        <LayoutWrap params={params} dictionary={dictionary}>
          {children}
        </LayoutWrap>
      </body>
    </html>
  );
};

export default DashboardLayout;
