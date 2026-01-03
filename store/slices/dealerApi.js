import { apiSlice } from "../api/apiSlice";

export const dealerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchDealers: builder.query({
      query: (searchTerm) => `/dealers`,
      providesTags: ["dealers"],
    }),

    fetchSingleDealer: builder.query({
      query: (id) => `/dealers/${id}`,
      providesTags: ["dealer"],
    }),

    addDealer: builder.mutation({
      query: (dealer) => ({
        url: "/dealers",
        method: "POST",
        body: dealer,
      }),
      invalidatesTags: ["dealers"],
    }),

    updateDealer: builder.mutation({
      query: (dealer) => ({
        url: `/dealers/${dealer.id}`,
        method: "PUT",
        body: dealer,
      }),
      invalidatesTags: ["dealers","dealer"],
    }),

    deleteDealer: builder.mutation({
      query: (id) => ({
        url: `/dealers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["dealers","dealer"],
    }),
    updateBillingAddress: builder.mutation({
      query: (data) => ({
        url: `/dealers/billingaddress/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["dealers","dealer"],
    }),
    addDocument: builder.mutation({
      query: (data) => ({
        url: `/dealers/documents`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["dealers","dealer"],
    }),
    addSignedContract: builder.mutation({
      query: (data) => ({
        url: `/dealers/signedcontract`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["dealers","dealer"],
    }),
    deleteSignedContract: builder.mutation({
      query: (id) => ({
        url: `/dealers/signedcontract/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["dealers","dealer"],
    }),
    addSalesPoint: builder.mutation({
      query: (data) => ({
        url: `/dealers/salepoint`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["dealers","dealer"],
    }),
    updateSalesPoint: builder.mutation({
      query: (data) => ({
        url: `/dealers/salepoint/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["dealers" ,"dealer"],
    }),
    getAllNonActiveSimByDealer:builder.query({
      query: (id) => ({
        url: `activation/serialnumbers/dealer/${id}/nonactivated`,
        method: "GET",
      }),
      providesTags: ["dealers"],
    })
    
  }),
});

export const {
  useFetchDealersQuery,
  useFetchSingleDealerQuery,
  useAddDealerMutation,
  useUpdateDealerMutation,
  useDeleteDealerMutation,
  useUpdateBillingAddressMutation,
  useAddDocumentMutation,
  useAddSignedContractMutation,
  useDeleteSignedContractMutation,
  useAddSalesPointMutation,
  useUpdateSalesPointMutation,
  useDeleteSalesPointMutation,

  useGetAllNonActiveSimByDealerQuery,
} = dealerApi;

