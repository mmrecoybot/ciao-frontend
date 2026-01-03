import { getDictionary } from "@/app/[lang]/dictionary";
import SingleProduct from "./_components/SingleProduct";

const SingleProductPage = async ({ params }) => {
  const { lang } = params;
  const dictionary = await getDictionary(lang);
  const id = await params.id;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL_API}/api/v1/shop/products/${id}`
  );
  const product = await response.json();

  return <SingleProduct dictionary={dictionary} product={product} />;
};

export default SingleProductPage;
