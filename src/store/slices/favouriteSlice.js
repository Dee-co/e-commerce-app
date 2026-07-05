import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    addToFavorite: (state, action) => {
      const product = action.payload;
      const exists = state.items.find((item) => item.id === product.id);
      if (!exists) {
        state.items.push(product);
      }
    },

    removeFromFavorite: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
    },

    toggleFavorite: (state, action) => {
      const product = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item.id === product.id
      );

      if (existingIndex >= 0) {
        state.items.splice(existingIndex, 1);
      } else {
        state.items.push(product);
      }
    },

    clearFavorites: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToFavorite,
  removeFromFavorite,
  toggleFavorite,
  clearFavorites,
} = favoriteSlice.actions;

export default favoriteSlice.reducer;