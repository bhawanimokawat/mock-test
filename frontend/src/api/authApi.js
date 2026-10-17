import apiClient from "./client";

export const authApi = {
  // Register a new user
  register: async (userData) => {
    const response = await apiClient.post("/auth/register", userData);
    return response.data;
  },

  // Login existing user
  login: async (credentials) => {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  },

  // Get current logged-in user profile
  getMe: async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },
};
