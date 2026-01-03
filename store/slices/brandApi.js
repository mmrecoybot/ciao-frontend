import { apiSlice } from "../api/apiSlice";

export const brandsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchBrands: builder.query({
      query: () => "/shop/brands",
      providesTags: ["brands"],
    }),
    fetchBrand: builder.query({
      query: (id) => `/shop/brands/${id}`,
      providesTags: ["brand"],
    }),
    addBrand: builder.mutation({
      query: (brand) => ({
        url: "/shop/brands",
        method: "POST",
        body: brand,
      }),
      invalidatesTags: ["brands"],
    }),

    updateBrand: builder.mutation({
      query: (brand) => ({
        url: `/shop/brands/${brand.id}`,
        method: "PUT",
        body: brand,
      }),
      invalidatesTags: ["brands"],
    }),
    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `/shop/brands/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["brands"],
    }),
  }),
});

export const {
  useAddBrandMutation,
  useFetchBrandQuery,
  useFetchBrandsQuery,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandsApi;
