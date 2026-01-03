import { auth } from "@/auth";
import OrderList from "./_components/OrderList";
import { getDictionary } from "@/app/[lang]/dictionary";

export default async function Orders({ params: { lang } }) {
  const session = await auth();

  // const { lang } =  params;
  const dictionary = await getDictionary(lang);
  return (
    <div className="w-full p-6">
      <div className="mb-6 ">
        <h1 className="text-xl font-medium uppercase bg-emerald-200 dark:bg-emerald-200/20 dark:text-gray-400 p-3 rounded shadow-emerald-400/40">
          <span className="text-gray-700 dark:text-gray-300">{dictionary.navItems.orders}</span>
        </h1>
      </div>

      <OrderList dictionary={dictionary} user={session.user} lang={lang} />
    </div>
  );
}
