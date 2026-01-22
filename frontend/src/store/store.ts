import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import { loadAuthState, saveAuthState } from "./persist";

const persistedAuth = loadAuthState();

export const store = configureStore({
  preloadedState: persistedAuth ? { auth: persistedAuth } : undefined,
  reducer: {
    auth: authReducer,
  },
});

store.subscribe(() => {
  saveAuthState(store.getState().auth);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
