import { getDictionary } from "@/app/[lang]/dictionary";
import ProductsPage from "./ProductsPage";

const ProductsHomePage = async ({ params }) => {
  const { lang } = params;
  const dictionary = await getDictionary(lang);

  return (
    <>
      <ProductsPage params={params} dictionary={dictionary} />
    </>
  );
};

export default ProductsHomePage;
