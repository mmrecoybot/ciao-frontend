import React from "react";
import SubCategoryPage from "./SubCategoryPage";
import { getDictionary } from "@/app/[lang]/dictionary";

const SubCategoryHomePage = async ({ params }) => {
  const { lang } = params;
  const dictionary = await getDictionary(lang);

  return (
    <>
      <SubCategoryPage dictionary={dictionary} lang={lang} />
    </>
  );
};

export default SubCategoryHomePage;
