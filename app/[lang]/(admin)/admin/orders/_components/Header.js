import { ShoppingCart } from "lucide-react";
import { ShoppingBasket } from "lucide-react";
import { ShoppingBag } from "lucide-react";
import { IoReload } from "react-icons/io5";

export default function OrderHeader({ refresh, setRefresh, dictionary }) {
  const handleRefresh = () => {
    setRefresh(true);
  };
  return (
    <div className="flex justify-between items-center xs:flex-col xs:gap-2 mb-6 bg-emerald-200 p-2 px-5 rounded-xl text-gray-600">
      <div className="flex items-center gap-2">
        <ShoppingBasket size={70} />
        <div>
          <h1 className="text-2xl font-bold">{dictionary.orderPages.orders}</h1>
          <p className="text-gray-500 mt-1 capitalize dark:text-gray-300">
            {dictionary.orderPages.manage_and_track_your_orders}
          </p>
        </div>
      </div>
      <div className="flex gap-4 xs:flex-col xs:gap-2">
        <button
          onClick={handleRefresh}
          className="bg-gray-900 dark:bg-slate-500 inline-flex justify-center items-center gap-2 px-4 py-2 font-medium rounded-md text-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800 dark:text-gray-300 dark:hover:bg-slate-700"
        >
          <IoReload className={refresh ? "animate-spin" : ""} />
          {dictionary.orderPages.refresh}
        </button>
      </div>
    </div>
  );
}
