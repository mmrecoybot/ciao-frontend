
import { fetchData } from "@/db/db";
import Header from "../_components/Header";
import Products from "../_components/Products";
import Sidebar from "../_components/Sidebar";
import { getDictionary } from "@/app/[lang]/dictionary";


export default async function AddPage({ searchParams, params:{lang} }) {

  const dictionary = await getDictionary(lang);

  try {
    const {products , counts} = await fetchData("/shop/products");
    const sort = searchParams.sort || "default";
    const showPrices = searchParams.showPrices || "no";

    const selectedCategoryProducts = products.filter(
      (product) => product?.category?.name === searchParams.category
    );
    // Dynamic lists for the sidebar
    const subcategories = getUniqueSubcategories(selectedCategoryProducts);
    const brands = getUniqueBrands(selectedCategoryProducts);

    const filteredProducts = selectedCategoryProducts.filter((product=>{
      const searchProducts= searchParams?.search ? product?.name?.toLowerCase().includes(searchParams?.search.toLowerCase()):true;
      const subProducts= searchParams?.sub ? product?.subCategory?.name === searchParams?.sub:true;
      const brandProducts= searchParams?.brand ? product?.brand?.name === searchParams?.brand:true; 
      return searchProducts && subProducts && brandProducts;
    })).sort((a, b) => {
      if (sort === "asc") {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      }
      if (sort === "desc") {
        return b.name.toLowerCase().localeCompare(a.name.toLowerCase());
      }
      if (sort === "low-to-high") {
        return a.retail_price - b.retail_price;
      }
      if (sort === "high-to-low") {
        return b.retail_price - a.retail_price;
      }
      return 0;
    });

    return (
      <div className="w-full">
        <Header dictionary={dictionary} counts={counts} lang={lang} category={searchParams.category} />

        <div className="mx-auto py-6 flex gap-4 flex-col lg:flex-row">
          <Sidebar
            subcategories={subcategories} // Dynamic list of subcategories
            brands={brands} // Dynamic list of brands
            lang={lang}
            counts={counts}
            searchParams={searchParams}
            dictionary={dictionary}
          />

          <div className="w-full">
            <Products
              filteredProducts={filteredProducts}
              products={products}
              showPrices={showPrices}
              dictionary={dictionary}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return <div>Error loading products. Please try again later.</div>;
  }
}

// Extract unique subcategories from the filtered category products
const getUniqueSubcategories = (productsArray) => {
  return Array.from(
    new Set(productsArray.map((product) => product?.subCategory?.name))
  ).filter(Boolean); // Remove null/undefined values
};

// Extract unique brands from the filtered category products
const getUniqueBrands = (productsArray) => {
  return Array.from(
    new Set(productsArray.map((product) => product?.brand?.name))
  ).filter(Boolean); // Remove null/undefined values
};

