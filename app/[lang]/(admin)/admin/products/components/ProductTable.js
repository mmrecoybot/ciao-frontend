"use client";

import { useState } from "react";
import { FullscreenIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DeleteButton from "./DeleteButton";
import Pagination from "../../components/Pagination";

const ITEMS_PER_PAGE = 10;

export default function ProductsTable({ data = [], lang, dictionary }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const paginatedData = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-4">
      {/* Table Scrollable Wrapper */}
      <div className="overflow-y-auto max-h-[70vh] rounded-lg border">
        <table className="min-w-full bg-white dark:bg-gray-900 dark:text-gray-400">
          <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {dictionary.userPages.image}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {dictionary.personalDataPage.name}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {dictionary.productsPages.brand}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {dictionary.productsPages.retail_price}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {dictionary.productsPages.dealer_price}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {dictionary.productsPages.purchase_price}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {dictionary.productsPages.category}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {dictionary.productsPages.product_code}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {dictionary.activation.actions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4">
                  <Image
                    src={
                      product.variations[0]?.img?.startsWith("/") ||
                      product.variations[0]?.img?.startsWith("http")
                        ? product.variations[0].img
                        : "/placeholder.jpg"
                    }
                    width={50}
                    height={50}
                    alt={product.name}
                    className="h-12 w-12 object-cover rounded-md"
                  />
                </td>
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">{product.brand?.name}</td>
                <td className="px-6 py-4">€{product.retail_price}</td>
                <td className="px-6 py-4">€{product.dealer_price}</td>
                <td className="px-6 py-4">€{product.purchase_price}</td>
                <td className="px-6 py-4">{product.category?.name}</td>
                <td className="px-6 py-4">{product.product_code}</td>
                <td className="px-6 py-4 flex gap-2">
                  <Link
                    href={`/${lang}/admin/products/${product.id}`}
                    className="flex items-center border rounded p-2 gap-2 text-blue-600 hover:underline">
                    <FullscreenIcon className="w-5 h-5" />
                    {dictionary.productsPages.details}
                  </Link>
                  <DeleteButton
                    productId={product.id}
                    label={dictionary.bannerPages.delete}
                    lang={lang}
                    dictionary={dictionary}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
