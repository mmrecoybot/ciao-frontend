import { getDictionary } from "@/app/[lang]/dictionary";
import BannerPage from "./BannerPage";

const BannerHomePage = async ({ params }) => {
  const { lang } = params;
  const dictionary = await getDictionary(lang);

  return (
    <>
      <BannerPage dictionary={dictionary} />
    </>
  );
};

export default BannerHomePage;
