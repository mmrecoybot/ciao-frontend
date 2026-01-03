import { getDictionary } from "@/app/[lang]/dictionary";
import PhoneNumberDashboard from "./components/PhoneNumberDashboard";

export default async function SimsPage({ params }) {
  const { lang } = params;
  const dictionary = await getDictionary(lang);

  return (
    <div className="w-full h-full ">
      <PhoneNumberDashboard dictionary={dictionary} lang={lang} />
    </div>
  );
}
