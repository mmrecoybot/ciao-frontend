import { getDictionary } from "@/app/[lang]/dictionary";
import Dealers from "./Dealers";

const DealersPage = async ({ params }) => {
  const { lang } = params;
  const dictionary = await getDictionary(lang);

  return (
    <>
      <Dealers dictionary={dictionary} params={params} />
    </>
  );
};

export default DealersPage;
