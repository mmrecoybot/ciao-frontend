import { getDictionary } from "@/app/[lang]/dictionary";
import ChangePasswordForm from "./components/ChangePasswordForm";

export default async function ChangePasswordPage({ params }) {
  const { lang } = params;
  const dictionary = await getDictionary(lang);
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5 text-center">
        {dictionary.navItems.change_password}
      </h1>
      <ChangePasswordForm dictionary={dictionary} lang={lang} />
    </div>
  );
}
