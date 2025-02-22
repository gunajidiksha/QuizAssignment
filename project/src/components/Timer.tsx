import React, { useEffect, useState } from 'react';
import { Timer as TimerIcon } from 'lucide-react';
import clsx from 'clsx';

interface TimerProps {
  duration: number;
  onTimeout: () => void;
  isActive: boolean;
}

export function Timer({ duration, onTimeout, isActive }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [duration, onTimeout, isActive]);

  // Reset timer when it becomes active again
  useEffect(() => {
    if (isActive) {
      setTimeLeft(duration);
    }
  }, [isActive, duration]);

  const isLowTime = timeLeft <= 5;

  return (
    <div className={clsx(
      "flex items-center gap-2 text-lg font-semibold transition-colors duration-300",
      isLowTime && "text-red-600"
    )}>
      <TimerIcon className={clsx(
        "w-5 h-5",
        isLowTime && "animate-pulse"
      )} />
      <span>{timeLeft}s</span>
    </div>
  );
}