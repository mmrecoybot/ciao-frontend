
// "use client";
// import { useFetchSingleOrdersQuery } from "@/store/slices/orderApi";
// import { Calendar, Printer } from "lucide-react";
// import Loading from "../../components/Loading";
// import OrderItem from "../_components/OrderItem";
// import OrderSummary from "../_components/OrderSummary";
// import { getStatusStyle } from "../_components/OrderTable";
// import { VoucherTemplateOrder } from "../_components/VoucherTemplate";
// import SingleOrder from "../_components/AdminDashboard";
// import BackButton from "@/app/[lang]/(customer)/customer/components/ui/BackButton";

// const OrderDetails = ({ params }) => {
//   const { data: order , isLoading } = useFetchSingleOrdersQuery(params.orderId);

//   if (isLoading) return <Loading />;

//   return (
//     <div className="p-6 w-full xs:px-2  space-y-6">
//       {/* Header */}
//       {/* <div className="flex justify-between xs:flex-col xs:gap-2  items-center">
//         <div>
//           <h1 className="text-2xl dark:text-gray-500 font-bold">
//             Order {order?.order_number}
//           </h1>
//           <p className="text-gray-500 flex items-center gap-2">
//             <Calendar className="w-4 h-4" />
//             {order?.createdAt.slice(0, 10)}
//           </p>
//         </div>
//         <div className="flex items-center  gap-2">
//           <button
//             onClick={handlePrint}
//             className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 inline-flex gap-2"
//           >
//             <Printer /> Print
//           </button>

//           <span
//             className={`${getStatusStyle(
//               order?.status
//             )} px-2 py-1 rounded-full`}
//           >
//             {order?.status}
//           </span>
//         </div>
//       </div> */}

//       {/* Order Summary Cards */}
//       {/* <OrderSummary order={order} /> */}

//       {/* Order Items */}
//       {/* <OrderItem order={order} /> */}
//       <BackButton />
//       <SingleOrder order={order} lang={params.lang} />
//     </div>
//   );
// };

// export default OrderDetails;

import React from 'react';
import OrderDetails from './OrderDetails';
import { getDictionary } from '@/app/[lang]/dictionary';

const OrderDetailsHomePage =async ({ params }) => {

    const { lang } = params;
    const dictionary = await getDictionary(lang);

  return (
    <>
      <OrderDetails params={params} dictionary={dictionary} />
    </>

  );
};

export default OrderDetailsHomePage;
