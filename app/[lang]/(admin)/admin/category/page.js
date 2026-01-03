import { getDictionary } from "@/app/[lang]/dictionary";
import CategoryPage from "./CategoryPage";

const CategoryHomePage = async ({ params }) => {
  const { lang } = params;
  const dictionary = await getDictionary(lang);

  return (
    <>
      <CategoryPage dictionary={dictionary} lang={lang} />
    </>
  );
};

export default CategoryHomePage;
