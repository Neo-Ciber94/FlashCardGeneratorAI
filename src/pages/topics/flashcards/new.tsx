import ColorPicker from "@/lib/components/ColorPicker";
import { PASTEL_COLORS } from "@/lib/common/constants";
import { useEffect, useMemo, useRef, useState } from "react";
import ContrastColor from "contrast-color";
import Color from "color";

export default function NewFlashCardPage() {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [color, setColor] = useState(PASTEL_COLORS[0]);
  const lineColor = new ContrastColor({
    fgDarkColor: "teal",
    fgLightColor: "black",
  });

  return (
    <div className="mt-5 mx-4 sm:mx-10 lg:mx-28">
      <form>
        <div className="flex flex-row justify-end my-4">
          <ColorPicker
            onChange={setColor}
            color={color}
            colorList={PASTEL_COLORS}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="font-bold text-xl">
            Title
          </label>
          <input
            id="title"
            className="shadow-md border border-gray-200 w-full rounded-md h-9 px-4 outline-none"
            style={{
              backgroundColor: color,
            }}
          />
        </div>

        <div className="h-full mt-4">
          <label htmlFor="content" className="font-bold text-xl mb-2 block">
            Content
          </label>
          <textarea
            ref={textAreaRef}
            id="content"
            className="min-h-[300px] overflow-hidden pattern shadow-md border border-gray-200 bg-transparent w-full h-full leading-6 px-4 outline-none"
            rows={10}
            style={{
              backgroundColor: color,
              "--card-color": color,
              "--line-accent": new Color(
                lineColor.contrastColor({ bgColor: color })
              )
                .fade(0.4)
                .toString(),
            }}
            onChange={(e) => {
              const { current } = textAreaRef;
              if (current) {
                const target = e.target as HTMLTextAreaElement;
                current.style.height = "auto";
                current.style.height = `${target.scrollHeight}px`;
              }
            }}
          ></textarea>
        </div>
      </form>
    </div>
  );
}
