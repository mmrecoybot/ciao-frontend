import { apiSlice } from "../api/apiSlice";

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchCart: builder.query({
      query: () => `/shop/carts`,
      providesTags: ["carts"],
    }),

    fetchCartById: builder.query({
      query: (id) => `/shop/carts/${id}`,
      providesTags: ["cart"],
    }),
    fetchCartByUser: builder.query({
      query: (id) => `/shop/carts/user/${id}`,
      providesTags: ["carts"],
    }),
    addCartItem: builder.mutation({
      query: (cartItem) => ({
        url: "/shop/carts",
        method: "POST",
        body: cartItem,
      }),
      invalidatesTags: ["carts"],
    }),

    updateCartItem: builder.mutation({
      query: (cartItem) => ({
        url: `/shop/carts/${cartItem.id}`,
        method: "PUT",
        body: cartItem,
      }),
      invalidatesTags: ["carts", "cart"],
    }),

    deleteCartItem: builder.mutation({
      query: (id) => ({
        url: `/shop/carts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["carts", "cart"],
    }),
    clearCart: builder.mutation({
      query: (id) => ({
        url: `/shop/carts/clear/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["carts", "cart"],
    }),
  }),
});

export const {
  useFetchCartQuery,
  useFetchCartByIdQuery,
  useFetchCartByUserQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
  useCheckoutCartMutation,
  useClearCartMutation,
} = cartApi;
