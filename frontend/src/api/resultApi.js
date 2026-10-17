import apiClient from "./client";

export const resultApi = {
  // Fetch detailed test result for an attempt
  getAttemptResult: async (attemptId) => {
    const response = await apiClient.get(`/attempts/${attemptId}/result`);
    return response.data;
  },

  // Fetch student past test attempt history
  getAttemptHistory: async () => {
    const response = await apiClient.get("/attempts/history");
    return response.data;
  },
};
