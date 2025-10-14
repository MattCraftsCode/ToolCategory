"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const PRIMARY_COLOR = "#ff7d68";

export function RouteProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);
  const firstLoadRef = useRef(true);

  const clearTimers = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  };

  const startProgress = () => {
    clearTimers();
    setVisible(true);
    setProgress(8);

    intervalRef.current = setInterval(() => {
      setProgress((current) => {
        if (current >= 90) {
          return current;
        }
        return current + Math.random() * 10;
      });
    }, 200);
  };

  const finishProgress = () => {
    clearTimers();
    setProgress(100);
    resetTimerRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 250);
  };

  useEffect(() => {
    if (firstLoadRef.current) {
      firstLoadRef.current = false;
      return () => {};
    }

    finishProgress();

    return () => {
      startProgress();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  useEffect(() => () => clearTimers(), []);

  if (!visible && progress === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-0 left-0 z-[9998] h-[3px] w-full bg-transparent">
      <div
        className="h-full origin-left transform-gpu transition-[width,opacity] duration-200"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
          backgroundColor: PRIMARY_COLOR,
          boxShadow: `0 0 6px ${PRIMARY_COLOR}`,
        }}
      />
    </div>
  );
}
