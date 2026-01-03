import { auth } from "@/auth";
import { getDictionary } from "@/app/[lang]/dictionary";
import Notification from "./component/Notification";

export default async function Notifications({ params }) {
  const session = await auth();
  
  const { lang } =  params;
  const dictionary = await getDictionary(lang);
  
  return (
    <div className="p-6 w-full">
      {/* Header */}
      <div className="flex items-center gap-2 text-xl mb-6 drop-shadow-lg bg-emerald-200 dark:bg-emerald-200/20 dark:text-gray-400 p-3 rounded shadow-emerald-400/40">
        <h1>{dictionary.notificationPage.notifications}</h1>
      </div>
      <Notification dictionary={dictionary} params={params} user={session.user} />
    </div>
  );
}
