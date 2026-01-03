import { getDictionary } from "@/app/[lang]/dictionary";
import { auth } from "@/auth";
import ActivationPageSub from "./components/ActivationPageSub";

export default async function ActivationPage({ params }) {
  const session = await auth();
  const { lang } = params;
  const dictionary = await getDictionary(lang);
  return (
    <ActivationPageSub dictionary={dictionary} params={params} user={session.user} />
  );
}
