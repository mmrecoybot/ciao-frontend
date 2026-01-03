import { apiSlice } from "../api/apiSlice";

export const subCategoriesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchSubCategories: builder.query({
      query: () => "/shop/subcategories",
      providesTags: ["subcategories"],
    }),
    fetchSingleSubCategory: builder.query({
      query: (id) => `/shop/subcategories/${id}`,
    }),
    addSubCategory: builder.mutation({
      query: (subCategory) => ({
        url: "/shop/subcategories",
        method: "POST",
        body: subCategory,
      }),
      invalidatesTags: ["subcategories"],
    }),

    updateSubCategory: builder.mutation({
      query: (subCategory) => ({
        url: `/shop/subcategories/${subCategory.id}`,
        method: "PUT",
        body: subCategory,
      }),
      invalidatesTags: ["subcategories"],
    }),
    deleteSubCategory: builder.mutation({
      query: (id) => ({
        url: `/shop/subcategories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["subcategories"],
    }),
  }),
});

export const {
  useFetchSubCategoriesQuery,
  useFetchSingleSubCategoryQuery,
  useAddSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = subCategoriesApi;
