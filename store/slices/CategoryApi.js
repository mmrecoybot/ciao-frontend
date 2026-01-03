import { apiSlice } from "../api/apiSlice";

export const categoriesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchCategories: builder.query({
      query: () => "/shop/categories",
      providesTags: ["categories"],
    }),
    fetchSingleCategory: builder.query({
      query: (id) => `/shop/categories/${id}`,
    }),
    addCategory: builder.mutation({
      query: (category) => ({
        url: "/shop/categories",
        method: "POST",
        body: category,
      }),
      invalidatesTags: ["categories"],
    }),

    updateCategory: builder.mutation({
      query: (category) => ({
        url: `/shop/categories/${category.id}`,
        method: "PUT",
        body: category,
      }),
      invalidatesTags: ["categories"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/shop/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["categories"],
    }),
  }),
});

export const {
  useFetchCategoriesQuery,
  useFetchSingleCategoryQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
