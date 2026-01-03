import "server-only";

const dictionaries = {
  en: () => import("./dictionaries/en.js").then((module) => module.default),
  it: () => import("./dictionaries/it.js").then((module) => module.default),
};

const getDictionary = async (locale) => {
  if (dictionaries[locale]) {
    return dictionaries[locale]();
  }
  return dictionaries["en"]();
};
export { getDictionary };
