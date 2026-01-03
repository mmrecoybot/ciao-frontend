"use client";

import Link from "next/link";

import { useFetchProductsQuery } from "@/store/slices/productApi";
import { useState } from "react";
import {
  FaBoxesPacking,
  FaChartLine,
  FaDollarSign,
  FaMobile,
} from "react-icons/fa6";
import ProductTable from "./components/ProductTable";
import ProductsFilters from "./components/ProductsFilters";
import { AiOutlineAppstore } from "react-icons/ai";

const ProductsPage = ({ params: { lang }, dictionary }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [brandsFilter, setBrandsFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const { data, isLoading, isError, error } = useFetchProductsQuery();


  if (isLoading) return <DashboardSkeleton />;

  const filteredProduct = data?.products?.filter((product) => {
    const searchMatch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product?.brand?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product?.category?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const brandMatch = brandsFilter === "All" || product.brand.name === brandsFilter;
    return searchMatch && brandMatch;

  });

  // const analytics = {
  //   totalProducts: products.length,
  //   totalStockProducts: products.reduce(
  //     (acc, product) => acc + product.stock,
  //     0
  //   ),
  //   totalValue: products.reduce(
  //     (acc, product) =>
  //       acc + Number(product.purchase_price) * Number(product.stock),
  //     0
  //   ),

  //   lowStock: products.filter((product) => product.stock < 10).length,
  //   topSelling:
  //     [...products]?.sort((a, b) => b.sold_out - a.sold_out)[0]?.name || "N/A",
  // };

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex justify-between  xs:gap-2 items-center bg-emerald-200 p-4 px-5 rounded-xl text-gray-800">
        <h1 className="text-2xl xs:text-xl font-bold dark:text-gray-400 flex items-center gap-2">
          <FaBoxesPacking size={50} />
          {dictionary.productsPages.product_dashboard}
        </h1>
        <Link
          href={`/${lang}/admin/products/new`}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2 transition-colors"
        >
          <FaBoxesPacking /> {dictionary.productsPages.add_product}
        </Link>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticCard
          title="Total Products"
          value={analytics.totalProducts}
          value2={analytics.totalStockProducts}
          icon={<FaBoxesPacking />}
          color="bg-blue-500"
        />
        <AnalyticCard
          title="Total Value"
          value={`€${analytics.totalValue.toLocaleString()}`}
          icon={<FaDollarSign />}
          color="bg-green-500"
        />
        <AnalyticCard
          title="Low Stock Items"
          value={analytics.lowStock}
          icon={<FaChartLine />}
          color="bg-yellow-500"
        />
        <AnalyticCard
          title="Top Selling"
          value={analytics.topSelling}
          icon={<FaMobile />}
          color="bg-purple-500"
        />
      </div> */}

      <ProductsFilters
        data={data.products}
        brandsFilter={brandsFilter}
        setBrandsFilter={setBrandsFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        dictionary={dictionary}
      />
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 w-full">
        {/* <ProductsTable products={products} /> */}
        {filteredProduct?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400 text-xl font-bold">
              {dictionary.productsPages.no_products_found}
            </p>
          </div>
        ) : (
          <ProductTable data={filteredProduct} lang={lang} dictionary={dictionary} />
        )}
      </div>
    </div>
  );
};

export default ProductsPage;

const DashboardSkeleton = () => (
  <div className="p-6 space-y-6 w-full h-full dark:bg-gray-900">
    <div className="flex justify-between items-center">
      <div className="h-10 w-48 bg-gray-200 rounded-md animate-pulse" />
      <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
      ))}
    </div>
    <div className="h-[400px] bg-gray-200 rounded-lg animate-pulse" />
  </div>
);

const AnalyticCard = ({ title, value, value2, icon, color }) => (
  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
    <div className="flex items-center space-x-4">
      <div className={`p-4 rounded-full ${color} text-white`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold dark:text-gray-500">
          {value}
          {!value2 == 0 && `(${value2})`}
        </p>
      </div>
    </div>
  </div>
);
