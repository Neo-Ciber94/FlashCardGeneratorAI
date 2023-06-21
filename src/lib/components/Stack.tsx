import { PropsWithChildren, Children } from "react";
import { twMerge } from "tailwind-merge";

export interface StackProps {
  displacementX: number;
  displacementY: number;
  className?: string;
}

export default function Stack(props: PropsWithChildren<StackProps>) {
  const { displacementX: x, displacementY: y, className, children } = props;

  return (
    <div
      className={twMerge(
        "relative flex h-full w-full flex-row items-center justify-center",
        className
      )}
    >
      {Children.map(children, (child, idx) => {
        return (
          <div
            key={idx}
            className="absolute"
            style={{
              transform: `translate(${x * idx}px, ${y * idx}px)`,
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
