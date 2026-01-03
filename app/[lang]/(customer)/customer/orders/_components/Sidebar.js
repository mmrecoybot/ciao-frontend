import { updateSearchParams } from "@/utils/updateSearchParams";
import Link from "next/link";
import Search from "./Search";

const Sidebar = ({ subcategories, brands, lang, counts, searchParams, dictionary }) => {

  const findSubCategoryCount = (subc) => {
    return (
      counts?.subCategories?.find(
        (item) => item.name === subc && item.category === searchParams.category
      )?.count || 0
    );
  };

  const findBrandCount = (brand) => {
    return counts?.brands?.find((item) => item.name === brand)?.count || 0;
  };

  const baseUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${lang}/customer/orders/add?${Object.entries(

    searchParams
  )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&")}`;

  return (
    <div className="w-full lg:w-48 2xl:w-72 flex-shrink-0  dark:bg-gray-800 dark:text-gray-400">
      <div className="rounded-lg p-4">
        <h2 className="text-lg mb-4">{dictionary.ordersPages.search}</h2>
        <div className="mb-4">
          <Search searchParams={searchParams} />
        </div>
        <div className="space-y-4">
          {subcategories.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">{dictionary.ordersPages.categories}</h3>

              <div className="space-y-1">
                {subcategories &&
                  subcategories.map((subc) => (
                    <Link
                      href={updateSearchParams(baseUrl, { sub: subc })}
                      key={subc}
                      className={`flex items-center gap-2 text-sm px-2 py-0.5 rounded-r-full justify-between ${
                        decodeURIComponent(searchParams.sub).startsWith(
                          subc.split("&")[0]
                        )
                          ? "border border-gray-300 font-medium bg-blue-200 text-blue-700"
                          : ""
                      }`}
                    >
                      <span className="capitalize">{subc}</span>
                      <span className="font-bold">
                        ({findSubCategoryCount(subc)})
                      </span>
                    </Link>
                  ))}
              </div>
            </div>
          )}
          <div>
            {brands.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">{dictionary.ordersPages.brands}</h3>
                <div className="space-y-1">
                  {brands &&
                    brands.map((brand) => (
                      <Link
                        href={updateSearchParams(baseUrl, { brand: brand })}
                        key={brand}
                        className={`flex items-center gap-2 text-sm px-2 py-0.5 rounded-r-full justify-between ${
                          searchParams.brand === brand
                            ? "border border-gray-300 font-medium bg-blue-200 text-blue-700"
                            : ""
                        }`}
                      >
                        <span className="capitalize">{brand}</span>
                        <span className="font-bold">
                          ({findBrandCount(brand)})
                        </span>
                      </Link>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
