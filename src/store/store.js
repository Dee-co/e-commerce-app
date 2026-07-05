import { configureStore } from "@reduxjs/toolkit";

import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import favoriteReducer from "./slices/favouriteSlice";
export const store = configureStore({
  reducer: {
    product: productReducer,
    cart: cartReducer,
    favorite: favoriteReducer,
  },
});