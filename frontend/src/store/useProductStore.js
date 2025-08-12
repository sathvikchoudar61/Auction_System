import { create } from "zustand";
import axios from "axios";

export const useProductStore = create((set) => ({
  products: [],
  product: null,
  error: null,
  loading: false,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      set({ products: response.data, loading: false });
    } catch (error) {
      set({ error: "Error fetching products", loading: false });
    }
  },

  fetchProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`http://localhost:5000/api/products/${id}`); // Fixed: Use backticks
      set({ product: response.data, loading: false });
    } catch (error) {
      set({ error: "Error fetching product details", loading: false });
    }
  },

  placeBid: async (id, bidAmount) => {
    set({ error: null });
    try {
      const response = await axios.post(`http://localhost:5000/api/products/${id}/bid`, { bidAmount }); // Fixed: Use backticks
      set({ product: response.data.product }); // Update the state with new product data
    } catch (error) {
      set({ error: error.response?.data?.message || "Error placing bid" });
      throw error; // Throw error to be caught in the component
    }
  },
}));