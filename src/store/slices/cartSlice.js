import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      
      // Check if product already exists in cart
      const existingItem = state.items.find((item) => item.id === product.id);
      
      if (existingItem) {
        // If exists and stock allows, increase quantity
        if (existingItem.quantity < existingItem.stock) {
          existingItem.quantity += 1;
        }
      } else {
        // Add new product with quantity 1
        state.items.push({
          ...product,
          quantity: 1,
        });
      }
      
      // Recalculate totals
      state.totalItems = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      
      state.totalAmount = state.items.reduce((total, item) => {
        const discountedPrice =
          item.price - (item.price * item.discountPercentage) / 100;
        return total + discountedPrice * item.quantity;
      }, 0);
    },

    increaseQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find((product) => product.id === id);
      
      if (item && item.quantity < item.stock) {
        item.quantity += 1;
        
        // Update totals
        state.totalItems = state.items.reduce(
          (total, item) => total + item.quantity,
          0
        );
        
        state.totalAmount = state.items.reduce((total, item) => {
          const discountedPrice =
            item.price - (item.price * item.discountPercentage) / 100;
          return total + discountedPrice * item.quantity;
        }, 0);
      }
    },

    decreaseQuantity: (state, action) => {
      const id = action.payload;
      const itemIndex = state.items.findIndex((product) => product.id === id);
      
      if (itemIndex === -1) return;
      
      const item = state.items[itemIndex];
      item.quantity -= 1;
      
      if (item.quantity <= 0) {
        state.items.splice(itemIndex, 1);
      }
      
      // Update totals
      state.totalItems = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      
      state.totalAmount = state.items.reduce((total, item) => {
        const discountedPrice =
          item.price - (item.price * item.discountPercentage) / 100;
        return total + discountedPrice * item.quantity;
      }, 0);
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
      
      state.totalItems = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      
      state.totalAmount = state.items.reduce((total, item) => {
        const discountedPrice =
          item.price - (item.price * item.discountPercentage) / 100;
        return total + discountedPrice * item.quantity;
      }, 0);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;