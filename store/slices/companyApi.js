import { apiSlice } from "../api/apiSlice";

export const companyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchCompanies: builder.query({
      query: (searchTerm) => `/activation/companies`,
      providesTags: ["companies"],
    }),

    fetchSingleCompany: builder.query({
      query: (id) => `/activation/companies/${id}`,
    }),

    addCompany: builder.mutation({
      query: (company) => ({
        url: "/activation/companies",
        method: "POST",
        body: company,
      }),
      invalidatesTags: ["companies"],
    }),

    updateCompany: builder.mutation({
      query: (company) => ({
        url: `/activation/companies/${company.id}`,
        method: "PUT",
        body: company,
      }),
      invalidatesTags: ["companies"],
    }),
    deleteCompany: builder.mutation({
      query: (id) => ({
        url: `/activation/companies/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["companies", "activation"],
    }),
  }),
});

export const {
  useFetchCompaniesQuery,
  useFetchSingleCompanyQuery,
  useAddCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
} = companyApi;
