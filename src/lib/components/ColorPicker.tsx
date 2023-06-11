import { ColorSwatchIcon } from "@heroicons/react/outline";
import { Fragment, useMemo, useState } from "react";
import ContrastColor from "contrast-color";
import { Dialog, Transition } from "@headlessui/react";
import { globalFont } from "../layout/Layout";

interface ColorPickerProps {
  title?: string;
  color?: string;
  colorList: string[];
  onChange: (color: string) => void;
}

export default function ColorPicker({
  title = "Color",
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

  <Transition show={isOpen} as={Fragment}>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className={`relative z-50 ${globalFont.className}`}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-lg rounded-md bg-white">
              <div className="p-4">
                <Dialog.Title className="font-bold text-xl">
                  {title}
                </Dialog.Title>

                <div className="flex flex-row flex-wrap p-4 gap-4 mx-auto">
                  {colorList.map((c) => {
                    return (
                      <div
                        key={c}
                        onClick={() => handleColorChange(c)}
                        style={{ backgroundColor: c }}
                        className={`h-10 w-10 rounded-full shadow cursor-pointer hover:border-2 hover:border-black/30 ${
                          c === color ? "border-2 border-black/20" : ""
                        }`}
                      ></div>
                    );
                  })}
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
  </Transition>

    </>
  );
}
