// export default DashboardPage;
"use client";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
// import { Package, Users, Building2, Zap } from "lucide-react";

import {
  Building2,
  LoaderPinwheel,
  Package,
  SignalMedium,
  Users,
  Zap,
} from "lucide-react";
// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  }).format(value);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

// Convert the order status data for Chart.js
const getOrderStatusChartData = (data = []) => ({
  labels: data?.map((item) => item.status),
  datasets: [
    {
      data: data.map((item) => item.count),
      backgroundColor: "#6366f1",
      borderColor: "#6366f1",
      borderWidth: 1,
    },
  ],
});

// Convert the revenue data for Chart.js
const getRevenueChartData = (data = []) => ({
  labels: data.map((item) => item.month),
  datasets: [
    {
      data: data.map((item) => item.revenue),
      borderColor: "#6366f1",
      tension: 0.4,
      fill: false,
    },
  ],
});

const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800",
      processing: "bg-blue-100 text-blue-800",
      delivered: "bg-green-100 text-green-800",
      active: "bg-green-100 text-green-800",
    };
    return colors[status.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
        status
      )}`}
    >
      {status}
    </span>
  );
};

export default function Dashboard({ analytics: data = {} }) {
  console.log(data);

  return (
    <div className="p-6 bg-gray-50 min-h-screen w-full">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Products</p>
              <p className="text-2xl font-semibold">
                {data?.summary?.totalProducts || 0}
              </p>
            </div>
            <Package className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Users</p>
              <p className="text-2xl font-semibold">
                {data?.summary?.totalUsers || 0}
              </p>
            </div>
            <Users className="text-purple-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Dealers</p>
              <p className="text-2xl font-semibold">
                {data?.summary?.totalDealers || 0}
              </p>
            </div>
            <Building2 className="text-orange-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Activations</p>
              <p className="text-2xl font-semibold">
                {data?.summary?.totalActivations || 0}
              </p>
            </div>
            <Package className="text-yellow-500" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Pending Activations</p>
              <p className="text-2xl font-semibold">
                {data?.activationMetrics?.totalPending || 0}
              </p>
            </div>
            <LoaderPinwheel className="text-yellow-500" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Completed Activations
              </p>
              <p className="text-2xl font-semibold">
                {data?.activationMetrics?.totalCompleted || 0}
              </p>
            </div>
            <Zap className="text-yellow-500" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Orders</p>
              <p className="text-2xl font-semibold">
                {data?.summary?.totalOrders || 0}
              </p>
            </div>
            <Package className="text-blue-500" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Pending Orders</p>
              <p className="text-2xl font-semibold">
                {data?.recentOrders?.totalPending || 0}
              </p>
            </div>
            <Zap className="text-blue-500" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Completed Orders</p>
              <p className="text-2xl font-semibold">
                {data?.recentOrders?.totalCompleted || 0}
              </p>
            </div>
            <LoaderPinwheel className="text-blue-500" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Inactive Sims</p>
              <p className="text-2xl font-semibold">
                {data?.summary?.serialDistribution || 0}
              </p>
            </div>
            <SignalMedium className="text-blue-500" size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            Order Status Distribution
          </h2>
          <div className="h-64">
            <Bar
              data={getOrderStatusChartData(data.orderStatusDistribution)}
              options={chartOptions}
            />
          </div>
        </div>

        {/* Recent Revenue Trend */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Revenue Trend</h2>
          <div className="h-64">
            <Line
              data={getRevenueChartData(data.revenueByMonth)}
              options={chartOptions}
            />
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Order ID</th>
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {data?.recentOrders?.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="py-2">{order.orderNumber}</td>
                    <td className="py-2">{formatDate(order.createdAt)}</td>
                    <td className="py-2">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-2">{formatCurrency(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activations */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Activations</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Client</th>
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.activationMetrics?.recentActivations?.map(
                  (activation) => (
                    <tr key={activation.id} className="border-b">
                      <td className="py-2 capitalize">{activation.client}</td>
                      <td className="py-2">
                        {formatDate(activation.createdAt)}
                      </td>
                      <td className="py-2">
                        <StatusBadge status={activation.status} />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Top Products</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Image</th>
                  <th className="text-left py-2">Product</th>
                  <th className="text-left py-2">Total Sales</th>
                  <th className="text-left py-2">Retail Price</th>
                  {/* <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Status</th> */}
                </tr>
              </thead>
              <tbody>
                {data?.topProducts?.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="py-2">
                      <img
                        src={product.image}
                        alt={product.product}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="py-2 capitalize">{product.product}</td>
                    <td className="py-2">{product.quantity}</td>
                    <td className="py-2">
                      {formatCurrency(product.retail_price)}
                    </td>
                    {/* <td className="py-2">{formatDate(product.createdAt)}</td>
                    <td className="py-2">
                      <StatusBadge status={product.status} />
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
