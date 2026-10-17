import apiClient from "./client";

export const attemptApi = {
  // Start a new test attempt for a passage
  startAttempt: async (passageId) => {
    const response = await apiClient.post("/attempts/start", { passageId });
    return response.data;
  },

  // Get all questions and attempt state for the test
  getAttemptQuestions: async (attemptId) => {
    const response = await apiClient.get(`/attempts/${attemptId}/questions`);
    return response.data;
  },

  // Save an answer for a specific question during test
  saveAnswer: async (attemptId, questionId, answer) => {
    const response = await apiClient.put(`/attempts/${attemptId}/answers/${questionId}`, {
      answer,
    });
    return response.data;
  },

  // Submit test attempt for evaluation (triggering AI grading)
  submitAttempt: async (attemptId) => {
    const response = await apiClient.post(`/attempts/${attemptId}/submit`);
    return response.data;
  },
};
