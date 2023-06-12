import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export type DialogAction = {
  name: string;
  className?: string;
  leading?: React.ReactNode;
  onClick: (event: React.MouseEvent, close: () => void) => void;
};

export interface DialogProps extends PropsWithChildren {
  open: boolean;
  unmount?: boolean;
  title: string;
  className?: string;
  onClose: () => void;
  actions?: DialogAction[];
}

export default function ModalDialog({
  open,
  unmount,
  title,
  onClose,
  className,
  children,
  actions = [],
}: DialogProps) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={onClose}
        unmount={unmount}
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
              <Dialog.Panel
                className={twMerge(
                  `w-full max-w-md transform overflow-hidden rounded-2xl bg-white 
                  p-6 text-left align-middle shadow-xl transition-all`,
                  className
                )}
              >
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {title}
                </Dialog.Title>

                <div className="flex flex-col gap-5">
                  <>{children}</>
                  <div className="flex flex-row gap-2 justify-end">
                    {actions.map((action, idx) => {
                      return (
                        <button
                          key={idx}
                          onClick={(e) => action.onClick(e, onClose)}
                          className={twMerge(
                            `min-w-[150px] flex flex-row shadow-md items-center gap-2 px-4 py-2 text-white rounded-md 
                            ${
                              action.leading != null
                                ? " justify-between"
                                : " justify-center"
                            }`,
                            action.className
                          )}
                        >
                          {action.leading && <>{action.leading}</>}
                          <span>{action.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
