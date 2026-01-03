import { getDictionary } from "../../dictionary";
import Navigations from "./(navigations)/_components/Navigations";
import Posters from "./(navigations)/_components/Posters";

const HomePage = async ({ params }) => {
  const { lang } = params;
  const dictionary = await getDictionary(lang);

  return (
    <div className="bg-white dark:bg-slate-700  min-h-screen w-full">
      <div className="flex justify-center items-center py-4 border-b">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">CIAO MOBILE</h1>
      </div>
      <div className="flex w-full">
        {/* <Navigations lang={lang} /> */}
        <main className="flex-1">
          <Posters />
        </main>
      </div>
    </div>
  );
};

export default HomePage;
