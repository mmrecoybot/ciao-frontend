import { apiSlice } from "../api/apiSlice";

export const bannerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchBanners: builder.query({
      query: () => "/shop/banners",
      providesTags: ["banners"],
    }),

    fetchBanner: builder.query({
      query: (id) => `/shop/banners/${id}`,
      providesTags: ["banner"],
    }),
    addBanner: builder.mutation({
      query: (banner) => ({
        url: "/shop/banners",
        method: "POST",
        body: banner,
      }),
      invalidatesTags: ["banners"],
    }),
    updateBanner: builder.mutation({
      query: (banner) => ({
        url: `/shop/banners/${banner.id}`,
        method: "PUT",
        body: banner,
      }),
      invalidatesTags: ["banners", "banner"],
    }),
    deleteBanner: builder.mutation({
      query: (id) => ({
        url: `/shop/banners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["banners", "banner"],
    }),
  }),
});

export const {
  useFetchBannersQuery,
  useFetchBannerQuery,
  useAddBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannerApi;
