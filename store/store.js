import { configureStore } from "@reduxjs/toolkit";

import { apiSlice } from "./api/apiSlice";

import filterSliceReducer from "./slices/filterSlice";
import dealerSliceReducer from "./slices/dealerSlice";
// configure store for redux

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    filter: filterSliceReducer,
    dealer: dealerSliceReducer
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
