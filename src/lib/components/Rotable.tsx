import React, { PropsWithChildren, useEffect, useRef, useState } from "react";

export interface RotableProps {
  degrees?: number;
}

export default function Rotable({
  children,
  degrees = 6,
}: PropsWithChildren<RotableProps>) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const { current } = ref;

    if (!current) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      const rect = current.getBoundingClientRect();
      const cursorX = event.x;
      const width = rect.width;
      const left = rect.left;

      if (current.matches(":hover")) {
        if (cursorX > left && cursorX < left + width * 0.4) {
          setRotation(-degrees);
        } else if (cursorX > left + width * 0.6 && cursorX < left + width) {
          setRotation(degrees);
        } else {
          setRotation(0);
        }
      } else {
        setRotation(0);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [degrees]);

  return (
    <div
      ref={ref}
      className="h-full w-full transition-transform duration-300"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {children}
    </div>
  );
}
