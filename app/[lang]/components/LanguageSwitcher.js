"use client";

import { useParams, usePathname, useSearchParams } from "next/navigation";

export default function LanguageSwitcher({ dictionary, isCollapsed }) {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const { lang } = useParams();

  const handleChange = (newLang) => {
    const params = new URLSearchParams(searchParams);
    const newPath = pathName.replace(`/${lang}`, `/${newLang}`);
    const url = `${newPath}?${params.toString()}`;
    window.location.href = url;
  };

  return (
    !isCollapsed && (
      <div className="flex flex-col space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {dictionary.select_language}
        </h3>
        <div className="relative flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full p-1  w-56 h-10">
          {/* <div className="absolute left-0 bg-white dark:bg-gray-700 w-[50%] h-8 rounded-full shadow-md" /> */}
          <button
            onClick={() => handleChange("en")}
            className={`relative z-10 w-1/2 py-2 text-sm font-medium transition-colors duration-200 ${
              lang === "en"
                ? "text-gray-800 dark:text-white bg-emerald-200 dark:bg-gray-700 w-[50%] h-8 rounded-full shadow-md"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            English
          </button>
          <button
            onClick={() => handleChange("it")}
            className={`relative z-10 w-1/2 py-2 text-sm font-medium transition-colors duration-200 ${
              lang === "it"
                ? "text-gray-800 dark:text-white bg-emerald-200 dark:bg-gray-700 w-[50%] h-8 rounded-full shadow-md"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Italiano
          </button>
        </div>
      </div>
    )
  );
}
