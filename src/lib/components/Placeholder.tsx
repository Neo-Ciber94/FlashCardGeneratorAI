import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export interface PlaceHolderProps {
  className?: string;
}

export default function PlaceHolder({ className }: PlaceHolderProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function handleResize() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className={twMerge(
        "flex h-full w-full items-center justify-center border-2 border-dashed border-black/70 font-bold text-2xl",
        className
      )}
    >
      {dimensions.height} x {dimensions.width}
    </div>
  );
}
