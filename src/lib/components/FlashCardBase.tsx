import ContrastColor from "contrast-color";
import Color from "color";
import { twMerge } from "tailwind-merge";
import { CSSProperties } from "react";

interface FlashCardBaseProps {
  title: string;
  className?: string;
  bgColor: string;
  style?: CSSProperties;
}

export default function FlashCardBase({
  title,
  className,
  bgColor,
  style,
}: FlashCardBaseProps) {
  const cc = new ContrastColor();
  const borderColor = new Color(bgColor).darken(0.05).fade(0.05);
  const lineColor = new ContrastColor({
    fgDarkColor: "teal",
    fgLightColor: "black",
  });

  return (
    <div
      className={twMerge(
        `pattern relative mx-auto h-64 w-full cursor-pointer items-center justify-center rounded-lg px-4
      py-6 shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-black/20`,
        className
      )}
      style={{
        backgroundColor: bgColor,
        color: cc.contrastColor({ bgColor }),
        border: `2px solid ${borderColor}`,
        "--card-color": bgColor,
        "--line-accent": new Color(lineColor.contrastColor({ bgColor }))
          .fade(0.4)
          .toString(),
        ...style,
      }}
    >
      <div className="text-base font-bold">{title}</div>
    </div>
  );
}
