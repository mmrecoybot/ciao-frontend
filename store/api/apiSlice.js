import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_APP_URL_API}/api/v1`,
    prepareHeaders: async (headers) => {
      const token = await getSession();
      if (token) {
        headers.set("Authorization", `Bearer ${token.user.accessToken}`);
      }
      return headers;
    },
  }),

  tagTypes: [
    "brands",
    "stocks",
    "stock",
    "products",
    "product",
    "customers",
    "customer",
    "orders",
    "order",
    "users",
    "user",
    "customerProfiles",
    "companies",
    "notifications",
    "notification",
    "categories",
    "subCategories",
    "category",
    "subCategory",
    "roles",
    "role",
    "permissions",
    "permission",
    "activations",
    "activation",
    "carts",
    "cart",
    "tariffs",
    "tariff",
    "dealers",
    "dealer",
    "sims",
    "sim",
  ],

  endpoints: (builder) => ({}),
});
