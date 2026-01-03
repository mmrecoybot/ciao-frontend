

import { getDictionary } from '@/app/[lang]/dictionary';
import ProductDetailsPage from './ProductDetailsPage';

const ProductDetailsHomePage = async ({ params }) => {

  const { lang } = params;
  const dictionary = await getDictionary(lang);

  return (
    <>
      <ProductDetailsPage dictionary={dictionary} />
    </>
  );
};

export default ProductDetailsHomePage;