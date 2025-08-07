import { configureStore } from "@reduxjs/toolkit";
import reducers from "../Reducers";

export const store = configureStore({
  reducer: reducers,
});

export default store;
