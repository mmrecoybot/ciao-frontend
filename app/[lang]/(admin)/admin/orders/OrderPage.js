"use client";

import { useFetchOrdersQuery } from "@/store/slices/orderApi";
import { useSession } from "next-auth/react";
import React, { useEffect, useState, useMemo } from "react"; // Import useMemo
import Loading from "../components/Loading";
import NoDataFound from "../components/NoDataFound";
import OrderFilterAndSearch from "./_components/Filter";
import OrderHeader from "./_components/Header";
import OrderTable from "./_components/OrderTable";
import OrderStats from "./_components/Stats";

// ITEMS_PER_PAGE constant is not needed if you use rowsPerPage state
// const ITEMS_PER_PAGE = 10; // Adjust this value based on your needs

const OrderPage = ({ params: { lang }, dictionary }) => {
  const { data: session } = useSession();

  const {
    data: allOrders,
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
  } = useFetchOrdersQuery();

  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dealerFilter, setDealerFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt", // Changed default key to match sorting logic
    direction: "desc",
  });
  const [rowsPerPage, setRowsPerPage] = useState(20); // Using state for flexibility

  // Memoize the filtering logic
  const filterOrders = (orders = []) => {
    return orders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;
      const matchesDealer =
        dealerFilter === "All" ||
        (order.user &&
          order.user.dealer &&
          order.user.dealer.companyName === dealerFilter); // Add checks for nested properties
      const matchesDate =
        dateFilter === "" ||
        (order.createdAt &&
          new Date(order.createdAt).toLocaleDateString() ===
            new Date(dateFilter).toLocaleDateString());
      return matchesSearch && matchesStatus && matchesDealer && matchesDate;
    });
  };

  const filteredOrders = useMemo(() => {
    return filterOrders(allOrders);
  }, [allOrders, searchTerm, statusFilter, dealerFilter, dateFilter]); // Re-run filter when these dependencies change

  // Memoize the sorting logic
  const sortOrders = (orders = []) => {
    // Create a shallow copy before sorting to avoid modifying the original array
    return [...orders].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined)
        return sortConfig.direction === "asc" ? 1 : -1;
      if (bValue === null || bValue === undefined)
        return sortConfig.direction === "asc" ? -1 : 1;

      if (typeof aValue === "string") {
        // Case-insensitive string comparison
        const comparison = aValue
          .toLowerCase()
          .localeCompare(bValue.toLowerCase());
        return sortConfig.direction === "asc" ? comparison : -comparison;
      } else if (aValue instanceof Date || typeof aValue === "number") {
        // Date or number comparison
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
      }
      // Fallback for other types or equal values
      return 0;
    });
  };

  const sortedFilteredOrders = useMemo(() => {
    // Apply sort only if filteredOrders exist
    return filteredOrders ? sortOrders(filteredOrders) : [];
  }, [filteredOrders, sortConfig]); // Re-run sort when filtered data or sort config changes

  // Memoize the pagination logic
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    // Apply slice only if sortedFilteredOrders exist
    return sortedFilteredOrders ? sortedFilteredOrders.slice(start, end) : [];
  }, [sortedFilteredOrders, currentPage, rowsPerPage]); // Re-run slice when sorted data, page, or rowsPerPage changes

  // Effect to update displayed orders when the paginated data changes
  useEffect(() => {
    // This effect will run whenever paginatedOrders reference changes,
    // which happens when sortedFilteredOrders, currentPage, or rowsPerPage change
    setDisplayedOrders(paginatedOrders);
    // Optional: Log to see when this runs
    // console.log("Setting displayed orders", paginatedOrders.length);
  }, [paginatedOrders]); // Only depend on the final data slice

  // Effect to refetch data on refresh signal
  useEffect(() => {
    if (refresh) {
      setCurrentPage(1); // Reset to page 1 on refresh
      refetch();
      setRefresh(false);
    }
  }, [refresh, refetch]);

  // Effect to reset pagination when filters or sort change
  useEffect(() => {
    // Reset to page 1 when filter or sort criteria change
    // This ensures you don't end up on a blank page if the filtered data set is smaller
    // console.log("Filters/Sort changed, resetting to page 1");
    setCurrentPage(1);
  }, [
    searchTerm,
    statusFilter,
    dealerFilter,
    dateFilter,
    sortConfig,
    rowsPerPage,
  ]); // Add rowsPerPage here too

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  // Calculate total pages based on the *filtered* data count
  const totalItems = filteredOrders?.length || 0;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    // You might want to display a specific error message here
    console.error("Error fetching orders:", error);
    return <div className="p-6 text-red-500">Error loading orders.</div>;
  }

  return (
    <div className="p-6 text-gray-500 w-full overflow-hidden mb-10">
      <OrderHeader
        refresh={refresh}
        setRefresh={setRefresh}
        dictionary={dictionary}
      />
      {/* Pass allOrders for total stats before filtering/pagination */}
      <OrderStats orders={allOrders || []} dictionary={dictionary} />
      <OrderFilterAndSearch
        data={allOrders} // Maybe pass filteredOrders here if filter options should be based on current filters? But allOrders makes sense for showing *all* possible options.
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dealerFilter={dealerFilter}
        setDealerFilter={setDealerFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        dictionary={dictionary}
      />

      {/* Check filteredOrders length for NoDataFound */}
      {filteredOrders.length > 0 ? (
        <>
          <OrderTable
            orders={displayedOrders} // Pass the paginated slice
            sortConfig={sortConfig}
            handleSort={handleSort}
            lang={lang}
            dictionary={dictionary}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            totalItems={totalItems} // Pass total filtered items for display like "Showing X of Y"
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage} // If you want a rows per page selector
          />
          {/* Assuming you want to use the imported Pagination component */}
        </>
      ) : (
        <NoDataFound title="Orders" dictionary={dictionary} />
      )}
    </div>
  );
};

export default OrderPage;
