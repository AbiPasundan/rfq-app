import { configureStore } from '@reduxjs/toolkit';
import { rfqApi } from './services/rfqApi';

export const store = configureStore({
  reducer: {
    [rfqApi.reducerPath]: rfqApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rfqApi.middleware),
});