import { getDictionary } from "@/app/[lang]/dictionary";
import BrandsPage from "./BrandsPage";

const BrandsHomePage = async ({ params }) => {
  const { lang } = params;
  const dictionary = await getDictionary(lang);

  return (
    <>
      <BrandsPage dictionary={dictionary} lang={lang} />
    </>
  );
};

export default BrandsHomePage;
