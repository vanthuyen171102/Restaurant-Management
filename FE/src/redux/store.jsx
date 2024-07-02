import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "./slices/authSlice";
import sidebarReducer from "./slices/sidebarSlice";
import userSlice from "./slices/userSlice";
import timeSlice from "./slices/timeSlice";

const store = configureStore({
  reducer: {
    auth: authenticationReducer,
    sidebar: sidebarReducer, // Sử dụng reducer từ slice sidebarSlice cho slice sidebar
    user: userSlice,
    time: timeSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
