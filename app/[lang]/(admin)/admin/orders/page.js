

import { getDictionary } from "@/app/[lang]/dictionary";
import OrderPage from "./OrderPage";

const OrderHomePage = async ({ params }) => {
  const { lang } = params;
  const dictionary = await getDictionary(lang);

  return (
    <>
      <OrderPage params={params} dictionary={dictionary} />
    </>
  );
};

export default OrderHomePage;
