import { Transition, Dialog } from "@headlessui/react";
import { CubeIcon, XIcon } from "@heroicons/react/outline";
import { Fragment, useRef, useState } from "react";
import { globalFont } from "../layout/Layout";

const MAX_TEXT_LENGTH = 2000;

export interface GenerateFlashCardsEditorProps {
  open: boolean;
  onClose: () => void;
}

export default function GenerateFlashCardsEditor({
  open,
  onClose,
}: GenerateFlashCardsEditorProps) {
  const [text, setText] = useState("");

  const handleClose = () => {
    onClose();
  };

  const handleGenerate = () => {
    console.log("Generate");
  };

  return (
    // Use the `Transition` component at the root level
    <Transition show={open} as={Fragment}>
      <Dialog onClose={handleClose} unmount>
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

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center p-4 text-center ">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={"w-full rounded-lg bg-white p-4"}>
                <div className="flex w-full flex-row justify-end">
                  <button
                    onClick={handleClose}
                    className="h-6 w-6 text-red-400 hover:text-red-500"
                  >
                    <XIcon />
                  </button>
                </div>
                <Dialog.Title
                  className={`text-2xl font-bold ${globalFont.className}`}
                >
                  Generate FlashCards
                </Dialog.Title>
                <textarea
                  onInput={(e) => setText(e.currentTarget.value)}
                  placeholder="Write the topic or text you would like to use to generate the flashcards..."
                  className={`mt-3 h-[65vh] min-h-max w-full resize-none rounded-sm bg-transparent p-4 outline-none placeholder:italic`}
                ></textarea>

                <div className="flex w-full flex-row justify-start text-xs text-gray-400">
                  {text.length} / {MAX_TEXT_LENGTH}
                </div>
                <div className="flex flex-row justify-end">
                  <button
                    onClick={handleGenerate}
                    className="flex min-w-[150px] flex-row items-center justify-center gap-2 rounded-md bg-indigo-500 px-4 py-2 text-white shadow-md hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-400"
                  >
                    <span>Generate</span>
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
