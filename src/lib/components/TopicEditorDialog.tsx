import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateTopicModel,
  TopicModel,
  createTopicModel,
  updateTopicModel,
} from "../models/topic";
import { toast } from "react-hot-toast";
import { getErrorMessage, getResponseError } from "../utils/getErrorMessage";
import { deferred } from "../utils/promises";

export interface TopicEditorDialogProps {
  topic?: TopicModel;
  open: boolean;
  onClose: () => void;
  onSucceed?: () => void;
}

export default function TopicEditorDialog({
  topic,
  open,
  onClose,
  onSucceed,
}: TopicEditorDialogProps) {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTopicModel>({
    resolver: zodResolver(topic ? updateTopicModel : createTopicModel),
    defaultValues: topic,
  });

  const submit = async (input: CreateTopicModel) => {
    const notifier = deferred<void>();
    toast.promise(notifier.promise, {
      loading: "Loading...",
      success: topic
        ? "Topic was updated successfully"
        : "Topic was created successfully",
      error: (msg) => msg,
    });

    try {
      let res: Response;

      if (topic) {
        res = await fetch("/api/topics", {
          method: "PUT",
          body: JSON.stringify(input),
        });
      } else {
        res = await fetch("/api/topics", {
          method: "POST",
          body: JSON.stringify(input),
        });
      }

      if (!res.ok) {
        throw new Error(await getResponseError(res));
      }

      const json = await res.json();
      console.log(json);
      notifier.resolve();
      reset();

      if (onSucceed) {
        onSucceed();
      }
    } catch (err) {
      notifier.reject(getErrorMessage(err));
      console.log(err);
    } finally {
      onClose();
    }
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose} unmount>
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
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  New Topic
                </Dialog.Title>
                <form onSubmit={handleSubmit(submit)}>
                  <div className="mt-2">
                    <input
                      placeholder="Name"
                      className="w-full p-2 rounded-md outline-none border-2 border-gray-300"
                      {...register("name")}
                    />

                    {errors.name && (
                      <small className="text-red-400 italic">
                        {errors.name.message}
                      </small>
                    )}
                  </div>
                  <button
                    className="ml-auto min-w-[150px] justify-center flex flex-row shadow-md 
                  items-center gap-2 px-4 py-2 text-white rounded-md mt-4
                  bg-violet-500 hover:bg-violet-600 focus:ring-4 focus:ring-violet-400"
                  >
                    <span>Create</span>
                  </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
