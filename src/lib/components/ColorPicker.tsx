import { ColorSwatchIcon } from "@heroicons/react/outline";
import { useMemo, useState } from "react";
import ContrastColor from "contrast-color";

interface ColorPickerProps {
  color?: string;
  colorList: string[];
  onChange: (color: string) => void;
}

export default function ColorPicker({
  colorList,
  onChange,
  ...rest
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState<string>(rest.color ?? colorList[0]);
  const cc = useMemo(
    () => new ContrastColor().contrastColor({ bgColor: color }),
    [color]
  );

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    onChange(newColor);
  };

  return (
    <>
      <button
        type="button"
        className="min-w-[150px] flex flex-row shadow-md items-center gap-2 px-4 py-2 rounded-md"
        style={{ backgroundColor: color }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-5 h-5 font-bold" style={{ color: cc }}>
          <ColorSwatchIcon />
        </div>
        <span className="font-bold" style={{ color: cc }}>
          Color
        </span>
      </button>

      <dialog open={isOpen} className="bg-white p-5 shadow-md inset-0">
        <h2 className="mb-2 text-xl font-bold">Colors</h2>

        <div className="flex flex-row flex-wrap gap-4">
          {colorList.map((c) => {
            return (
              <button
                key={c}
                onClick={() => handleColorChange(c)}
                style={{ backgroundColor: c }}
                type="button"
                className={`h-10 w-10 rounded-full  ${
                  c === color ? "border-4 border-black/20" : ""
                }`}
              ></button>
            );
          })}
        </div>
      </dialog>
    </>
  );
}
