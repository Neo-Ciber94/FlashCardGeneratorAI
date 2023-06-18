import { Transition, Dialog } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import React, { Fragment, useEffect, useRef } from "react";
import { globalFont } from "../layout/Layout";
import { useForm } from "react-hook-form";
import {
  GenerateFlashCardModel,
  MAX_GENERATE_FLASH_CARD_TEXT_LENGTH,
} from "../models/generate";
import { toast } from "react-hot-toast";
import { deferred } from "../utils/promises";
import { getErrorMessage, getResponseError } from "../utils/getErrorMessage";
import { FlashCardModel } from "../models/flashcard";

export interface GenerateFlashCardsEditorProps {
  topicId: string;
  open: boolean;
  onClose: () => void;
  onGenerate?: (flashCards: FlashCardModel[]) => void;
}

export default function GenerateFlashCardsEditor({
  topicId,
  open,
  onClose,
  onGenerate,
}: GenerateFlashCardsEditorProps) {
  const abortControllerRef = useRef(new AbortController());
  const {
    register,
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<GenerateFlashCardModel>({
    defaultValues: {
      text: "",
      topicId,
    },
  });

  const { text: currentText } = watch();
  const isTextTooLarge =
    currentText.length > MAX_GENERATE_FLASH_CARD_TEXT_LENGTH;

  useEffect(() => {
    if (!isSubmitting) {
      return;
    }

    const abortController = abortControllerRef.current;
    return () => {
      console.log("aborted");
      abortController.abort();
    };
  }, [isSubmitting]);

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    onClose();
    reset();
  };

  const submit = async (data: GenerateFlashCardModel) => {
    const notifier = deferred<void>();
    toast.promise(notifier.promise, {
      loading: "Generating...",
      success: "Flashcards generated successfully",
      error: (msg) => msg,
    });

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(await getResponseError(res));
      }

      const result = await res.json();
      if (onGenerate) {
        onGenerate(result);
      }

      notifier.resolve();
    } catch (err) {
      console.error(err);
      notifier.reject(getErrorMessage(err));
    }
  };

  return (
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
                  {...register("text")}
                  placeholder="Write the topic or text you would like to use to generate the flashcards..."
                  className={`mt-3 h-[65vh] min-h-max w-full resize-none rounded-sm bg-transparent p-4 outline-none placeholder:italic`}
                ></textarea>

                <div
                  className={`flex w-full flex-row justify-start text-xs ${
                    isTextTooLarge ? "text-red-600" : "text-gray-400"
                  } `}
                >
                  {currentText.length} /{MAX_GENERATE_FLASH_CARD_TEXT_LENGTH}
                </div>
                <div className="flex flex-row justify-end">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmit(submit)}
                    className="flex min-w-[150px] flex-row items-center justify-center gap-2 rounded-md bg-indigo-500 px-4 py-2 text-white shadow-md hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-400 disabled:opacity-50"
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
