import { getDictionary } from "@/app/[lang]/dictionary";
import Navigations from "./_components/Navigations";

const HomeLayout = ({ children, params }) => {
  const { lang } = params;
  const dictionaries = getDictionary(lang);
  return (
    <div>
      <Navigations dictionaries={dictionaries} lang={lang} />
      {children}
    </div>
  );
};

export default HomeLayout;
