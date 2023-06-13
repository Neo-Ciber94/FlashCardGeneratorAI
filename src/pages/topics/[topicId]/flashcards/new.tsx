import ColorPicker from "@/lib/components/ColorPicker";
import { PAGE_TITLE, PASTEL_COLORS } from "@/lib/common/constants";
import { useState } from "react";
import ContrastColor from "contrast-color";
import Color from "color";
import Head from "next/head";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateFlashCardModel,
  createFlashCardModel,
} from "@/lib/models/flashcard";
import { PlusIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { deferred } from "@/lib/utils/promises";
import toast from "react-hot-toast";
import { getResponseError, getErrorMessage } from "@/lib/utils/getErrorMessage";

export default function NewFlashCardPage() {
  const router = useRouter();
  const [color, setColor] = useState(PASTEL_COLORS[0]);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateFlashCardModel>({
    resolver: zodResolver(createFlashCardModel),
    defaultValues: {
      color,
      topicId: String(router.query.topicId),
    },
  });

  const lineColor = new ContrastColor({
    fgDarkColor: "teal",
    fgLightColor: "black",
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.target.focus({ preventScroll: true });

    const target = e.target as HTMLTextAreaElement;
    target.style.minHeight = "auto";
    target.style.minHeight = `${target.scrollHeight}px`;
    window.scrollTo({ top: target.scrollHeight });
  };

  const submit = async (input: CreateFlashCardModel) => {
    const notifier = deferred<void>();
    toast.promise(notifier.promise, {
      loading: "Loading...",
      success: "Topic was created successfully",
      error: (msg) => msg,
    });

    try {
      const res = await fetch("/api/flashcards", {
        method: "POST",
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        throw new Error(await getResponseError(res));
      }

      const json = await res.json();
      console.log(json);
      notifier.resolve();
      reset();

      router.push(`/topics/${String(router.query.topicId)}`)
    } catch (err) {
      notifier.reject(getErrorMessage(err));
      console.log(err);
    }
  };

  return (
    <>
      <Head>
        <title>{`${PAGE_TITLE} | New`}</title>
      </Head>
      <div className="mt-5 mx-4 sm:mx-10 lg:mx-28">
        <form onSubmit={handleSubmit(submit)}>
          <div className="flex flex-row justify-end my-4 gap-4">
            <button
              type="submit"
              className="min-w-[150px] flex flex-row shadow-md 
                  items-center gap-2 px-4 py-2 text-white rounded-md
                  bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-400"
            >
              <div className="w-5 h-5">
                <PlusIcon />
              </div>
              <span>Create</span>
            </button>

            <Controller
              name="color"
              control={control}
              render={({ field }) => {
                return (
                  <ColorPicker
                    color={field.value}
                    onChange={(newColor) => {
                      field.onChange(newColor);
                      setColor(newColor);
                    }}
                    colorList={PASTEL_COLORS}
                  />
                );
              }}
            />
          </div>

          <hr className="mt-8 mb-4" />

          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="font-bold text-xl">
              Title
            </label>
            <input
              {...register("title")}
              id="title"
              className="shadow-md border border-gray-200 w-full rounded-md h-9 px-4 outline-none"
              style={{
                backgroundColor: color,
              }}
            />

            {errors.title && (
              <small className="text-red-500 italic">
                {errors.title?.message}
              </small>
            )}
          </div>

          <div className="h-full mt-4">
            <label htmlFor="content" className="font-bold text-xl mb-2 block">
              Content
            </label>
            <textarea
              {...register("content")}
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
