import { apiSlice } from "../api/apiSlice";

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchOrders: builder.query({
      query: () => "/shop/orders",
      providesTags: ["orders"],
    }),
    fetchOrdersByUser: builder.query({
      query: (id) => `/shop/orders/user/${id}`,
      providesTags: ["orders"],
    }),
    fetchSingleOrders: builder.query({
      query: (id) => `/shop/orders/${id}`,
      providesTags: ["order"],
    }),
    addOrder: builder.mutation({
      query: (order) => ({
        url: "/shop/orders",
        method: "POST",
        body: order,
      }),
      invalidatesTags: ["orders", "carts"],
    }),
    updateOrder: builder.mutation({
      query: (order) => ({
        url: `/shop/orders/${order.id}`,
        method: "PUT",
        body: order,
      }),
      invalidatesTags: ["orders", "order"],
    }),
  }),
});

export const {
  useFetchOrdersQuery,
  useFetchOrdersByUserQuery,
  useFetchSingleOrdersQuery,
  useAddOrderMutation,
  useUpdateOrderMutation,
} = ordersApi;
