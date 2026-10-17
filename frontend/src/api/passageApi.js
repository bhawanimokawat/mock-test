import apiClient from "./client";

export const passageApi = {
  // Fetch list of published passages
  getPassages: async () => {
    const response = await apiClient.get("/passages");
    return response.data;
  },

  // Fetch single passage details
  getPassageById: async (id) => {
    const response = await apiClient.get(`/passages/${id}`);
    return response.data;
  },
};
