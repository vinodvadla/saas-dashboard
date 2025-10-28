import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import clientSlice from "./slices/clientSlice";
import chargerSlice from "./slices/chargersSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    client: clientSlice,
    charger: chargerSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
