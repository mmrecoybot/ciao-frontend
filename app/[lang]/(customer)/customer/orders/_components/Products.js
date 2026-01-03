import { auth } from "@/auth";
import NoDataFound from "../../components/NoDataFound";
import ProductCard from "./ProductCard";

const Products = async ({ filteredProducts, showPrices, dictionary }) => {
  const session = await auth();
  if (filteredProducts.length === 0) return <NoDataFound title={dictionary.ordersPages.products} />;

  return (
    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4  gap-6">
      {filteredProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          showPrices={showPrices}
          user={session?.user}
          dictionary={dictionary}
        />
      ))}
    </div>
  );
};

export default Products;
