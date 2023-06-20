import { useEffect, useState } from "react";

export interface LoadingIndicatorProps {
  delay?: number | null;
}

export default function LoadingIndicator({ delay }: LoadingIndicatorProps) {
  // If the delay is set to null, we show the indicator immediately
  const [show, setShow] = useState(delay === null);

  useEffect(() => {
    if (delay === null) {
      return;
    }

    const delayMs = delay ?? 500;
    const timeoutId = setTimeout(() => setShow(true), delayMs);
    return () => {
      clearTimeout(timeoutId);
    };
  });

  if (!show) {
    return;
  }

  return (
    <div className="w-full animate-pulse animate-bounce p-3 text-center text-2xl text-gray-400/50">
      Loading...
    </div>
  );
}
