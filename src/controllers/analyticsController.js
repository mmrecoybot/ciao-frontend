// const {
//   startOfDay,
//   endOfDay,
//   startOfWeek,
//   endOfWeek,
//   startOfMonth,
//   endOfMonth,
//   subMonths,
//   subDays,
// } = require("date-fns");
// const prisma = require("../config/db");

// // --- Analytics Controller Functions ---

// // Sales Analytics (aggregates completed orders)
// const getSalesAnalytics = async (req, res) => {
//   try {
//     const { timeframe = "daily" } = req.query;
//     const now = new Date();
//     let startDate, endDate;

//     // Validate timeframe parameter
//     const validTimeframes = ["daily", "weekly", "monthly", "yearly"];
//     if (!validTimeframes.includes(timeframe)) {
//       return res
//         .status(400)
//         .json({ success: false, error: "Invalid timeframe provided" });
//     }

//     switch (timeframe) {
//       case "weekly":
//         startDate = startOfWeek(now);
//         endDate = endOfWeek(now);
//         break;
//       case "monthly":
//         startDate = startOfMonth(now);
//         endDate = endOfMonth(now);
//         break;
//       case "yearly":
//         startDate = new Date(now.getFullYear(), 0, 1);
//         endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999); // Ensure end of year includes last day
//         break;
//       default: // daily
//         startDate = startOfDay(now);
//         endDate = endOfDay(now);
//     }

//     // Aggregate sales data from NON-DELETED, completed orders within the timeframe
//     const salesData = await prisma.order.groupBy({
//       // Grouping by createdAt day might be too granular for aggregate; consider date functions or other grouping strategies.
//       // For now, keeping original groupBy logic but adding deletedAt filter.
//       // Note: Prisma's groupBy doesn't natively support grouping by arbitrary date parts like day/week/month easily.
//       // Aggregating total sums for the period is more common for this type of query.
//       by: ["createdAt"], // Original grouping
//       where: {
//         createdAt: {
//           gte: startDate,
//           lte: endDate,
//         },
//         status: "completed", // Only completed orders
//         deletedAt: null, // Only include non-deleted orders
//       },
//       _sum: {
//         total: true,
//         tax: true,
//         discount: true,
//         subtotal: true,
//       },
//       _count: true,
//     });

//     // Get sales trends (e.g., count by status over a period) from NON-DELETED orders
//     const salesTrends = await prisma.order.groupBy({
//       by: ["status"],
//       where: {
//         createdAt: {
//           gte: subDays(now, 30), // Last 30 days
//         },
//         deletedAt: null, // Only include non-deleted orders
//       },
//       _sum: {
//         total: true,
//       },
//       _count: true,
//     });

//     res.status(200).json({
//       // Use status 200
//       success: true,
//       data: {
//         salesData, // Aggregated data for the timeframe
//         salesTrends, // Status breakdown over last 30 days
//         timeframe,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching sales analytics:", error);
//     res
//       .status(500)
//       .json({
//         success: false,
//         error: error.message || "Internal Server Error",
//       });
//   }
// };

// // Product Analytics (top products, category performance, engagement)
// const getProductAnalytics = async (req, res) => {
//   try {
//     // Get top products by total sales (totalSales must be calculated/maintained elsewhere)
//     // Find only NON-DELETED products
//     const topProducts = await prisma.product.findMany({
//       where: { deletedAt: null }, // Only include non-deleted products
//       take: 10,
//       orderBy: {
//         totalSales: "desc", // totalSales must be updated when orders are completed
//       },
//       select: {
//         id: true,
//         name: true,
//         totalSales: true, // Total sales derived from completed order items (needs calculation logic)
//         viewCount: true, // Needs view tracking logic (updateProductViews helper)
//         dealer_price: true,
//         retail_price: true,
//         margin: true,
//         _count: {
//           select: {
//             // Count only non-deleted related items
//             OrderItem: { where: { deletedAt: null } }, // Count non-deleted order items
//             CartItem: { where: { deletedAt: null } }, // Count non-deleted cart items
//           },
//         },
//       },
//     });

//     // Get category performance (includes products and aggregates their sales/views)
//     // Find only NON-DELETED categories themselves
//     const categoryPerformance = await prisma.category.findMany({
//       where: { deletedAt: null }, // Only include non-deleted categories
//       include: {
//         _count: {
//           select: {
//             products: { where: { deletedAt: null } }, // Count non-deleted products within category
//           },
//         },
//         products: {
//           where: { deletedAt: null }, // Only include non-deleted products in the relation
//           select: {
//             id: true, // Include ID for debugging/mapping
//             totalSales: true, // Needs calculation
//             viewCount: true, // Needs calculation
//           },
//         },
//       },
//     });

//     // Aggregate product engagement metrics by category
//     // Aggregate only for NON-DELETED products
//     const productEngagement = await prisma.product.groupBy({
//       by: ["categoryId"],
//       where: { deletedAt: null }, // Aggregate only non-deleted products
//       _sum: {
//         viewCount: true, // Sum view counts of non-deleted products
//         totalSales: true, // Sum total sales of non-deleted products
//       },
//       // Note: If categoryId is null for some products, they will be grouped under null.
//       // If category itself is deleted, products linked to it won't appear here due to product deletedAt filter.
//     });

//     res.status(200).json({
//       // Use status 200
//       success: true,
//       data: {
//         topProducts, // Top non-deleted products
//         categoryPerformance, // Non-deleted categories with non-deleted product aggregates
//         productEngagement, // Aggregates from non-deleted products by category
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching product analytics:", error);
//     res
//       .status(500)
//       .json({
//         success: false,
//         error: error.message || "Internal Server Error",
//       });
//   }
// };

// // User Analytics (new users, cart abandonment, engagement, retention)
// const getUserAnalytics = async (req, res) => {
//   try {
//     const now = new Date();
//     const lastMonth = subMonths(now, 1);

//     // Count new NON-DELETED users in the last month
//     const newUsersCount = await prisma.user.count({
//       where: {
//         createdAt: {
//           gte: lastMonth,
//         },
//         deletedAt: null, // Only count non-deleted users
//       },
//     });

//     // Find NON-DELETED carts updated in the last month
//     const activeCartsLastMonth = await prisma.cart.findMany({
//       where: {
//         updatedAt: {
//           gte: lastMonth,
//         },
//         deletedAt: null, // Only include non-deleted carts
//       },
//       include: {
//         items: { where: { deletedAt: null } }, // Only include non-deleted items in the include
//       },
//     });

//     // Total number of NON-DELETED users (for abandonment rate base)
//     const totalUsersCount = await prisma.user.count({
//       where: { deletedAt: null },
//     });

//     // Aggregate user engagement by role from NON-DELETED users
//     const userEngagement = await prisma.user.groupBy({
//       by: ["roleId"],
//       where: { deletedAt: null }, // Aggregate only non-deleted users
//       _count: true,
//       // The 'having' clause filters groups based on the count
//       // Having count gt 0 seems redundant here as groupBy will only return roles with users
//       // Removing the redundant having clause
//       // having: { roleId: { _count: { gt: 0 } } }
//     });

//     // Get customer retention (users with more than 1 order) from NON-DELETED users and NON-DELETED orders
//     const customerRetention = await prisma.order.groupBy({
//       by: ["userId"],
//       where: { deletedAt: null }, // Only include non-deleted orders
//       _count: true,
//       having: {
//         userId: {
//           _count: {
//             gt: 1,
//           },
//         },
//       },
//     });

//     // Calculate total NON-DELETED carts (for abandonment rate base)
//     const totalCartsCount = await prisma.cart.count({
//       where: { deletedAt: null },
//     });

//     // Abandonment Rate Calculation: This is a complex metric and often depends on definition.
//     // The current code just returns the count of active carts updated in the last month.
//     // A common definition is (Total Carts - Completed Orders) / Total Carts.
//     // Let's provide the count of active carts with items as "potentially abandoned" candidates.
//     const cartsWithItemsCount = activeCartsLastMonth.filter(
//       (cart) => cart.items.length > 0
//     ).length;

//     res.status(200).json({
//       // Use status 200
//       success: true,
//       data: {
//         newUsersCount: newUsersCount, // Count of new non-deleted users
//         activeCartsLastMonthWithItems: cartsWithItemsCount, // Count of non-deleted carts updated in last month with non-deleted items
//         // Consider adding total users/carts for rate calculation on client
//         totalUsersCount: totalUsersCount,
//         totalActiveCartsCount: totalCartsCount,
//         userEngagement, // Non-deleted users grouped by role
//         customerRetentionCount: customerRetention.length, // Count of non-deleted users with >1 non-deleted order
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching user analytics:", error);
//     res
//       .status(500)
//       .json({
//         success: false,
//         error: error.message || "Internal Server Error",
//       });
//   }
// };

// // Dealer Analytics (dealer performance, credit utilization)
// const getDealerAnalytics = async (req, res) => {
//   try {
//     // Find all NON-DELETED dealers and include related non-deleted counts and data
//     const dealerPerformance = await prisma.dealer.findMany({
//       where: { deletedAt: null }, // Only include non-deleted dealers
//       include: {
//         _count: {
//           select: {
//             User: { where: { deletedAt: null } }, // Count non-deleted users linked to dealer
//             salePoints: { where: { deletedAt: null } }, // Count non-deleted sale points linked to dealer
//           },
//         },
//         // CreditDetails is a one-to-one. Include it even if soft-deleted, but filter within the CreditDetails controller GET.
//         // For analytics, maybe we only care about non-deleted credit records? Let's filter here for consistency.
//         creditDetails: { where: { deletedAt: null } }, // Include only non-deleted credit details
//         User: {
//           where: { deletedAt: null }, // Include only non-deleted users linked to dealer
//           select: {
//             id: true, // Include user ID
//             Order: {
//               where: { deletedAt: null }, // Include only non-deleted orders from these users
//               select: {
//                 id: true, // Include order ID
//                 total: true,
//                 status: true,
//               },
//             },
//           },
//         },
//         salePoints: { where: { deletedAt: null } }, // Include only non-deleted sale points
//       },
//     });

//     // Calculate credit utilization for dealers with NON-DELETED CreditDetails
//     const creditUtilization = dealerPerformance
//       .filter((dealer) => dealer.creditDetails) // Only process dealers who have non-deleted credit details included
//       .map((dealer) => ({
//         dealerId: dealer.id,
//         companyName: dealer.companyName,
//         // Use the included creditDetails which is already filtered by deletedAt
//         creditLimit: dealer.creditDetails.assignedCreditLimit || 0, // Assuming these fields exist and are Decimal/Float
//         utilized: dealer.creditDetails.invoicesToPay || 0,
//         available: dealer.creditDetails.availableCreditLimit || 0,
//       }));

//     res.status(200).json({
//       // Use status 200
//       success: true,
//       data: {
//         dealerPerformance, // Non-deleted dealers with aggregates/relations filtered for soft delete
//         creditUtilization, // Derived from non-deleted dealers and non-deleted credit details
//         totalDealers: dealerPerformance.length, // Count of non-deleted dealers
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching dealer analytics:", error);
//     res
//       .status(500)
//       .json({
//         success: false,
//         error: error.message || "Internal Server Error",
//       });
//   }
// };

// // Activation Analytics (activation status, company performance, offer performance)
// const getActivationAnalytics = async (req, res) => {
//   try {
//     // Group NON-DELETED activations by status and company
//     const activationStats = await prisma.activation.groupBy({
//       by: ["status", "companyId"],
//       where: { deletedAt: null }, // Aggregate only non-deleted activations
//       _count: true,
//       orderBy: {
//         _count: {
//           _all: "desc",
//         },
//       },
//     });

//     // Get company performance (includes activations and tariffs)
//     // Find only NON-DELETED companies themselves
//     const companyPerformance = await prisma.company.findMany({
//       where: { deletedAt: null }, // Only include non-deleted companies
//       include: {
//         _count: {
//           Activation: { where: { deletedAt: null } }, // Count non-deleted activations for the company
//         },
//         Activation: {
//           where: { deletedAt: null }, // Include only non-deleted activations
//           select: {
//             id: true, // Include ID
//             status: true,
//             categoryOffer: true,
//             categoryTarrif: true,
//           },
//         },
//         Tarrif: {
//           where: { deletedAt: null }, // Include only non-deleted tariffs
//           include: {
//             _count: {
//               Activation: { where: { deletedAt: null } }, // Count non-deleted activations for the tariff
//             },
//           },
//         },
//       },
//     });

//     // Group NON-DELETED activations by offer category
//     const offerPerformance = await prisma.activation.groupBy({
//       by: ["categoryOffer"],
//       where: { deletedAt: null }, // Aggregate only non-deleted activations
//       _count: true,
//     });

//     res.status(200).json({
//       // Use status 200
//       success: true,
//       data: {
//         activationStats, // Aggregates from non-deleted activations
//         companyPerformance, // Non-deleted companies with aggregates/relations filtered for soft delete
//         offerPerformance, // Aggregates from non-deleted activations
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching activation analytics:", error);
//     res
//       .status(500)
//       .json({
//         success: false,
//         error: error.message || "Internal Server Error",
//       });
//   }
// };

// // Revenue Forecasting (based on historical completed orders)
// const getRevenueForecast = async (req, res) => {
//   try {
//     // Get historical completed sales data from NON-DELETED orders
//     const historicalData = await prisma.order.groupBy({
//       by: ["createdAt"], // Grouping by createdAt day might be too granular for this
//       // Consider grouping by date only if you need daily points
//       // Example: Convert createdAt to date string or use database functions if available and supported by Prisma
//       where: {
//         status: "completed",
//         createdAt: {
//           gte: subMonths(new Date(), 3), // Last 3 months
//         },
//         deletedAt: null, // Only include non-deleted orders
//       },
//       _sum: {
//         total: true,
//       },
//       orderBy: { createdAt: "asc" }, // Order for time series analysis
//     });

//     // Helper functions (calculateMovingAverage, analyzeSeasonalPatterns) operate on the result array.
//     // As long as the input array `historicalData` only contains data from non-deleted orders,
//     // these functions don't need internal soft delete filtering.

//     // Calculate moving averages based on the filtered historical data
//     const dailyMA = calculateMovingAverage(historicalData, 7); // 7-day moving average
//     const weeklyMA = calculateMovingAverage(historicalData, 30); // 30-day moving average

//     // Calculate seasonal patterns based on the filtered historical data
//     const seasonalPatterns = analyzeSeasonalPatterns(historicalData);

//     res.status(200).json({
//       // Use status 200
//       success: true,
//       data: {
//         historicalData, // Data from non-deleted orders
//         forecast: {
//           dailyMA,
//           weeklyMA,
//           seasonalPatterns,
//         },
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching revenue forecast:", error);
//     res
//       .status(500)
//       .json({
//         success: false,
//         error: error.message || "Internal Server Error",
//       });
//   }
// };

// // Helper Functions (Assumed to exist and process arrays)
// // They don't need soft delete filters themselves, as they operate on data already fetched.
// // const calculateMovingAverage = (data, window) => { ... };
// // const analyzeSeasonalPatterns = (data) => { ... };
// // const startOfWeek = (date) => { ... };
// // const endOfWeek = (date) => { ... };
// // const startOfMonth = (date) => { ... };
// // const endOfMonth = (date) => { ... };
// // const subMonths = (date, amount) => { ... };
// // const subDays = (date, amount) => { ... };

// module.exports = {
//   getSalesAnalytics, // Filters Orders by deletedAt
//   getProductAnalytics, // Filters Product, OrderItem, CartItem, Category by deletedAt
//   getUserAnalytics, // Filters User, Cart, CartItem, Order by deletedAt
//   getDealerAnalytics, // Filters Dealer, User, Order, SalePoint, CreditDetails by deletedAt
//   getActivationAnalytics, // Filters Activation, Company, Tarrif by deletedAt
//   getRevenueForecast, // Filters Order by deletedAt
// };
// const prisma = require("../config/db");

const prisma = require("../config/db");

async function getOrderStatusDistribution() {
  const results = await prisma.order.groupBy({
    by: ["status"],
    _count: true,
  });

  return results.map((item) => ({
    status: item.status,
    count: item._count,
  }));
}

async function getTopProducts(limit = 5) {
  const results = await prisma.orderItem.findMany({
    select: {
      productId: true,
      quantity: true,
      product: {
        select: {
          name: true,
          variations: {
            select: {
              img: true,
            },
          },
          retail_price: true,
        },
      },
    },
  });
  const groupedResults = results.reduce((acc, item) => {
    const productId = item.productId;
    if (!acc[productId]) {
      acc[productId] = {
        productId,
        quantity: 0,
        product: item.product,
      };
    }
    acc[productId].quantity += item.quantity;
    return acc;
  }, {});
  return Object.values(groupedResults)
    .map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      product: item.product.name,
      image: item.product.variations[0].img,
      retail_price: item.product.retail_price,
    }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit);
}

async function getRecentOrders(limit = 5) {
  const [totalPending, totalCompleted, recentOrders] = await Promise.all([
    prisma.order.count({
      where: { status: "pending" },
    }),
    prisma.order.count({
      where: { status: "delivered" },
    }),
    prisma.order.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        total: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
  ]);

  return {
    totalPending,
    totalCompleted,
    recentOrders,
  };
}

async function getActivationMetrics() {
  const [totalPending, totalCompleted, recentActivations] = await Promise.all([
    prisma.activation.count({ where: { status: "pending" } }),
    prisma.activation.count({ where: { status: "active" } }),
    prisma.activation.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        client: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    totalPending,
    totalCompleted,
    recentActivations,
  };
}

async function getRevenueByMonth(months = 6) {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: startDate },
      status: "delivered",
    },
    select: {
      total: true,
      createdAt: true,
    },
  });

  const revenueMap = new Map();
  orders.forEach((order) => {
    const monthYear = order.createdAt.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    revenueMap.set(
      monthYear,
      (revenueMap.get(monthYear) || 0) + Number(order.total)
    );
  });

  return Array.from(revenueMap.entries()).map(([month, revenue]) => ({
    month,
    revenue,
  }));
}

async function getDashboardAnalytics() {
  try {
    const [
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue,
      totalDealers,
      totalActivations,
      orderStatusDistribution,
      topProducts,
      recentOrders,
      activationMetrics,
      revenueByMonth,
      serialDistribution,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.user.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: "Completed" },
      }),
      prisma.dealer.count(),
      prisma.activation.count(),
      getOrderStatusDistribution(),
      getTopProducts(),
      getRecentOrders(),
      getActivationMetrics(),
      getRevenueByMonth(),
      prisma.serialNumber.count({
        where:{
          Activation:{
            none:{}
          }
        }
      }),
    ]);

    return {
      summary: {
        totalOrders,
        totalProducts,
        totalUsers,
        totalRevenue: Number(totalRevenue._sum.total) || 0,
        totalDealers,
        totalActivations,
        serialDistribution
      },
      orderStatusDistribution,
      topProducts,
      recentOrders,
      activationMetrics,
      revenueByMonth,
    };
  } catch (error) {
    throw new Error(`Failed to fetch dashboard analytics: ${error.message}`);
  }
}

async function handleGetDashboardAnalytics(req, res) {
  try {
    const analytics = await getDashboardAnalytics();
    res.json(analytics);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch dashboard analytics",
      details: error.message,
    });
  }
}
const analytics = {
  handleGetDashboardAnalytics,
  getDashboardAnalytics,
  getRevenueByMonth,
  getOrderStatusDistribution,
  getTopProducts,
  getRecentOrders,
  getActivationMetrics,
};
module.exports = analytics;