// Utility functions for formatting dates, times, and test scores

export const formatDuration = (seconds) => {
  if (seconds === null || seconds === undefined || isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

export const formatPercentage = (score, maxScore) => {
  if (!maxScore || maxScore <= 0) return 0;
  return Math.round((Number(score) / Number(maxScore)) * 100);
};
