import { getDictionary } from "@/app/[lang]/dictionary";
import Dashboard from "./Dashboard";

const DashboardPage = async ({ params }) => {
  const { lang } = params;
  const dictionary = await getDictionary(lang);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL_API}/api/v1/analytics`
  );
  const analytics = await res.json();
  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 w-full min-h-screen">
      <div className="w-full mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-500">
            {dictionary.orderPages.welcome_to_your_dashboard}
          </h1>
          <p className="text-gray-600">
            {dictionary.orderPages.overview_of_your_store_performance}
          </p>
        </div>
        <div className="pb-10">
          <Dashboard analytics={analytics} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
