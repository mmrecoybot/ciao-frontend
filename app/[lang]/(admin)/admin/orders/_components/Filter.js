export default function OrderFilterAndSearch({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dealerFilter,
  setDealerFilter,

  dateFilter,
  setDateFilter,
  dictionary,
  data,
}) {
  const dealers = Array.from(
    new Set(
      data?.map((order) =>
        order.user?.dealer?.companyName
          ? order.user?.dealer?.companyName
          : "N/A",
      ),
    ),
  );
  return (
    <div className="bg-white dark:bg-gray-800 dark:text-gray-500 p-4 rounded-lg shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative ">
          <input
            type="text"
            placeholder={dictionary.orderPages.search_orders}
            className="w-full px-4 py-2 border bg-inherit rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Status Filter */}
        <select
          className="px-4 py-2 border rounded-md bg-inherit focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">{dictionary.orderPages.all_status}</option>
          <option value="pending">{dictionary.orderPages.pending}</option>
          <option value="processing">{dictionary.orderPages.processing}</option>
          <option value="shipped">{dictionary.orderPages.shipped}</option>
          <option value="delivered">{dictionary.orderPages.delivered}</option>
          <option value="cancelled">{dictionary.orderPages.cancelled}</option>
        </select>

        {/* Payment Filter */}
        <select
          className="px-4 py-2 border rounded-md bg-inherit focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={dealerFilter}
          onChange={(e) => setDealerFilter(e.target.value)}
        >
          <option value="All">{dictionary.simPage.all_dealers}</option>
          {dealers.map((dealer) => (
            <option key={dealer} value={dealer}>
              {dealer}
            </option>
          ))}
        </select>
        <input
          type="date"
          className="px-4 py-2 border rounded-md bg-inherit focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={dateFilter}
          title="Order date"
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>
    </div>
  );
}
