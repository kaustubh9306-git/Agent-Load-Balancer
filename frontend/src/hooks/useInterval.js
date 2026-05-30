import { useEffect, useRef } from "react";

// React-friendly setInterval that always calls the latest callback.
export default function useInterval(callback, delayMs) {
  const saved = useRef(callback);

  useEffect(() => {
    saved.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delayMs == null) return undefined;
    const id = setInterval(() => saved.current?.(), delayMs);
    return () => clearInterval(id);
  }, [delayMs]);
}

