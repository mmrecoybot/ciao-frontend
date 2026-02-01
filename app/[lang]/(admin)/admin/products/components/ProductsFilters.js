import { AiOutlineSearch } from "react-icons/ai";

const ProductsFilters = ({
  searchTerm,
  setSearchTerm,
  brandsFilter,
  setBrandsFilter,
  categoryFilter,
  setCategoryFilter,
  data, // এটি এখন একটি অ্যারে
  dictionary,
}) => {
  // ডাটা সেফলি হ্যান্ডেল করা (অ্যারে না হলে খালি অ্যারে)
  const products = Array.isArray(data) ? data : [];

  // ইউনিক ব্র্যান্ড এবং ক্যাটাগরি লিস্ট তৈরি
  const brands = Array.from(
    new Set(products.map((p) => p.brand?.name).filter(Boolean)),
  );
  const categories = Array.from(
    new Set(products.map((p) => p.category?.name).filter(Boolean)),
  );

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* সার্চ বক্স */}
        <div className="relative border rounded flex items-center px-3 col-span-2">
          <input
            type="text"
            placeholder={dictionary.productsPages.search_products}
            className="w-full px-4 py-2 bg-inherit outline-none dark:text-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <AiOutlineSearch className="text-2xl text-gray-400" />
        </div>

        {/* ব্র্যান্ড ড্রপডাউন */}
        <select
          className="px-4 py-2 border rounded-md bg-inherit focus:outline-none focus:ring-2 capitalize dark:text-gray-400 focus:ring-blue-500"
          value={brandsFilter}
          onChange={(e) => setBrandsFilter(e.target.value)}
        >
          <option value="All">{dictionary.productsPages.all_brands}</option>
          {brands.map((brand, index) => (
            <option key={index} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        {/* ক্যাটাগরি ড্রপডাউন */}
        <select
          className="px-4 py-2 border rounded-md bg-inherit focus:outline-none focus:ring-2 capitalize dark:text-gray-400 focus:ring-blue-500"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">
            {dictionary.customerComponents.all_categories}
          </option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProductsFilters;
