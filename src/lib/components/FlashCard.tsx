import ContrastColor from "contrast-color";
import { FlashCardModel } from "../models/flashcard";
import { Transition, Dialog } from "@headlessui/react";
import { useState, Fragment } from "react";
import Color from "color";
import { globalFont } from "../layout/Layout";

declare module "react" {
  interface CSSProperties {
    "--card-color"?: string;
    "--line-accent"?: string;
  }
}

export interface FlashCardProps {
  flashCard: FlashCardModel;
}

export default function FlashCard({ flashCard }: FlashCardProps) {
  const cc = new ContrastColor();
  const borderColor = new Color(flashCard.color).darken(0.05).fade(0.05);
  const [isOpen, setIsOpen] = useState(false);
  const lineColor = new ContrastColor({
    fgDarkColor: "teal",
    fgLightColor: "black",
  });

  // TODO: Translate to the center of the screen?
  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className={`shadow-lg py-7 px-4 h-64 sm:w-52 w-10/12 mx-auto items-center justify-center rounded-lg
        cursor-pointer transition-all duration-300 ${
          isOpen ? "opacity-0 scale-105" : "opacity-100 scale-100 pattern"
        }`}
        style={{
          backgroundColor: flashCard.color,
          color: cc.contrastColor({ bgColor: flashCard.color }),
          border: `2px solid ${borderColor}`,
          "--card-color": flashCard.color,
          "--line-accent": new Color(
            lineColor.contrastColor({ bgColor: flashCard.color })
          )
            .fade(0.6)
            .toString(),
        }}
      >
        <div className="font-bold text-base">{flashCard.title}</div>
      </div>

      <FlashCardPreview
        flashCard={flashCard}
        open={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

interface FlashCardModalProps {
  flashCard: FlashCardModel;
  open: boolean;
  onClose: () => void;
}

function FlashCardPreview({ flashCard, open, onClose }: FlashCardModalProps) {
  const cc = new ContrastColor();
  const borderColor = new Color(flashCard.color).darken(0.05).fade(0.05);
  const [isFlip, setIsFlip] = useState(false);
  const lineContrastColor = new ContrastColor({
    fgDarkColor: "teal",
    fgLightColor: "black",
  });

  const lineColor = new Color(
    lineContrastColor.contrastColor({ bgColor: flashCard.color })
  )
    .fade(0.6)
    .toString();

  const handleClose = () => {
    onClose();
    setIsFlip(false);
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-50"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-50"
            >
              <Dialog.Panel
                onClick={() => setIsFlip((x) => !x)}
                className={`w-full min-h-[400px]
                      text-lg relative max-w-lg rounded-2xl 
                      text-left align-middle shadow-xl transition-all cursor-pointer flip-card pattern ${
                        globalFont.className
                      } ${isFlip ? "flipped" : ""}`}
                style={{
                  backgroundColor: flashCard.color,
                  color: cc.contrastColor({ bgColor: flashCard.color }),
                  border: `2px solid ${borderColor}`,
                  "--card-color": flashCard.color,
                  "--line-accent": lineColor.toString(),
                }}
              >
                <div className="font-bold flip-card-front px-4 py-6">
                  {flashCard.title}
                </div>
                <div
                  className="font-bold flip-card-back px-4 pattern rounded-2xl py-6"
                  style={{
                    "--card-color": new Color(flashCard.color)
                      .darken(0.05)
                      .toString(),
                    "--line-accent": lineColor.toString(),
                  }}
                >
                  <p className="font-bold text-2xl underline mb-3">Answer</p>
                  <span>{flashCard.content}</span>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
