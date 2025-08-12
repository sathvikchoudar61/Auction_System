import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";
const ADMIN_API_URL = "http://localhost:5000/admin";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isVerified: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (email, password, name, phonenumber) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
        phonenumber,
      });
      const { user } = response.data;
      set({
        user,
        isAuthenticated: true,
        isVerified: user.isVerified, // Ensure isVerified is updated
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const { user } = response.data;
      set({
        user,
        isAuthenticated: true,
        isVerified: user.isVerified,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        isVerified: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      const { user } = response.data;
      set({
        user,
        isAuthenticated: true,
        isVerified: user.isVerified,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      const { user } = response.data;
      set({
        user,
        isAuthenticated: true,
        isVerified: user.isVerified,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false, isVerified: false });
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error sending reset password email",
      });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error resetting password",
      });
      throw error;
    }
  },

  userdatafrombackend: async () => {
    try {
      const response = await axios.get(`${ADMIN_API_URL}/users`);
      set({ user: response.data });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error fetching user data',
      });
    }
  },
  
  eventonedatafrombackend: async () => {
    try {
      const response = await axios.get(`${ADMIN_API_URL}/event-1`);
      set({ user: response.data });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error fetching event data',
      });
    }
  },
}));
