import { useState, useEffect, useRef } from "react";

export const useTimer = (deadlineAt, onExpire) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    if (!deadlineAt) return 0;
    const diff = Math.floor((new Date(deadlineAt).getTime() - Date.now()) / 1000);
    return Math.max(0, diff);
  });

  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (!deadlineAt) return;

    // Recalculate immediate difference
    const computeDiff = () => {
      const diff = Math.floor((new Date(deadlineAt).getTime() - Date.now()) / 1000);
      return Math.max(0, diff);
    };

    const initialDiff = computeDiff();
    setTimeLeft(initialDiff);

    if (initialDiff <= 0) {
      if (onExpireRef.current) onExpireRef.current();
      return;
    }

    const intervalId = setInterval(() => {
      const diff = computeDiff();
      setTimeLeft(diff);

      if (diff <= 0) {
        clearInterval(intervalId);
        if (onExpireRef.current) {
          onExpireRef.current();
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [deadlineAt]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isExpiringSoon = timeLeft > 0 && timeLeft <= 300; // Under 5 minutes
  const isCritical = timeLeft > 0 && timeLeft <= 60; // Under 1 minute

  return {
    timeLeft,
    formatted: `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
    isExpiringSoon,
    isCritical,
    isExpired: timeLeft <= 0,
  };
};

export default useTimer;
