"use client";

import Link from "next/link";
import { useFetchProductsQuery } from "@/store/slices/productApi";
import { useState } from "react";
import { FaBoxesPacking } from "react-icons/fa6";
import ProductTable from "./components/ProductTable";
import ProductsFilters from "./components/ProductsFilters";

const ProductsPage = ({ params: { lang }, dictionary }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [brandsFilter, setBrandsFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const { data, isLoading, isError } = useFetchProductsQuery();

  if (isLoading) return <DashboardSkeleton />;
  if (isError)
    return <div className="p-6 text-red-500">Error loading products!</div>;

  // ব্যাকএন্ড থেকে আসা ডাটা থেকে প্রোডাক্ট লিস্ট বের করা
  const allProducts = data?.products || [];

  // ফিল্টারিং লজিক
  const filteredProduct = allProducts.filter((product) => {
    // ১. সার্চ লজিক (নাম, ব্র্যান্ড বা ক্যাটাগরি)
    const sTerm = searchTerm.toLowerCase();
    const searchMatch =
      !searchTerm ||
      product.name?.toLowerCase().includes(sTerm) ||
      product.brand?.name?.toLowerCase().includes(sTerm) ||
      product.category?.name?.toLowerCase().includes(sTerm);

    // ২. ব্র্যান্ড ফিল্টার লজিক
    const brandMatch =
      brandsFilter === "All" || product.brand?.name === brandsFilter;

    // ৩. ক্যাটাগরি ফিল্টার লজিক
    const categoryMatch =
      categoryFilter === "All" ||
      product.category?.name === categoryFilter ||
      product.subCategory?.name === categoryFilter;

    return searchMatch && brandMatch && categoryMatch;
  });

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex justify-between items-center bg-emerald-200 p-4 px-5 rounded-xl text-gray-800">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FaBoxesPacking size={50} />
          {dictionary.productsPages.product_dashboard}
        </h1>
        <Link
          href={`/${lang}/admin/products/new`}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
        >
          <FaBoxesPacking /> {dictionary.productsPages.add_product}
        </Link>
      </div>

      <ProductsFilters
        data={allProducts} // এখানে শুধু প্রোডাক্টের অ্যারে পাঠানো হচ্ছে
        brandsFilter={brandsFilter}
        setBrandsFilter={setBrandsFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        dictionary={dictionary}
      />

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 w-full">
        {filteredProduct.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-500 text-xl font-bold">
              {dictionary.productsPages.no_products_found}
            </p>
          </div>
        ) : (
          <ProductTable
            data={filteredProduct}
            lang={lang}
            dictionary={dictionary}
          />
        )}
      </div>
    </div>
  );
};

export default ProductsPage;

const DashboardSkeleton = () => (
  <div className="p-6 space-y-6 w-full animate-pulse">
    <div className="h-20 bg-gray-100 rounded-xl" />
    <div className="h-16 bg-gray-100 rounded-lg" />
    <div className="h-64 bg-gray-100 rounded-lg" />
  </div>
);
