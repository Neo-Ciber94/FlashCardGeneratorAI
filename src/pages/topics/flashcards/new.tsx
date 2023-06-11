import ColorPicker from "@/lib/components/ColorPicker";
import { PAGE_TITLE, PASTEL_COLORS } from "@/lib/common/constants";
import { useRef, useState } from "react";
import ContrastColor from "contrast-color";
import Color from "color";
import Head from "next/head";

export default function NewFlashCardPage() {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [color, setColor] = useState(PASTEL_COLORS[0]);
  const lineColor = new ContrastColor({
    fgDarkColor: "teal",
    fgLightColor: "black",
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.target.focus({ preventScroll: true });

    const { current } = textAreaRef;
    if (current) {
      const target = e.target as HTMLTextAreaElement;
      current.style.minHeight = "auto";
      current.style.minHeight = `${target.scrollHeight}px`;
      window.scrollTo({ top: target.scrollHeight });
    }
  };

  return (
    <>
      <Head>
        <title>{`${PAGE_TITLE} | New`}</title>
      </Head>
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
              className="resize-none min-h-[300px] py-7 overflow-hidden pattern shadow-md border border-gray-200 bg-transparent w-full h-full leading-6 px-4 outline-none"
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
              onInput={handleChange}
            ></textarea>
          </div>
        </form>
      </div>
    </>
  );
}
