import { apiSlice } from "../api/apiSlice";

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchProducts: builder.query({
      query: (searchTerm) => `/shop/products`,
      providesTags: ["products"],
    }),

    fetchSingleProducts: builder.query({
      query: (id) => `/shop/products/${id}`,
    }),

    addProduct: builder.mutation({
      query: (product) => ({
        url: "/shop/products",
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["products"],
    }),

    updateProduct: builder.mutation({
      query: (product) => ({
        url: `/shop/products/${product.id}`,
        method: "PUT",
        body: product,
      }),
      invalidatesTags: ["products"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/shop/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["products", "product"],
    }),
  }),
});

export const {
  useAddProductMutation,
  useDeleteProductMutation,
  useFetchProductsQuery,
  useFetchSingleProductsQuery,
  useUpdateProductMutation,
} = productsApi;
