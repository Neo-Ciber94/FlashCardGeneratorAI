import { Menu } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/outline";

export type ContextItem = {
  name: string;
  onClick: (event: React.MouseEvent) => void;
  leading: React.ReactNode;
};

export interface ContextMenuProps {
  items: ContextItem[];
}

export default function ContextMenu({ items }: ContextMenuProps) {
  return (
    <Menu as="div" className="ml-auto">
      {({ close }) => {
        return (
          <>
            <div className="group rounded-full p-1 transition-all duration-300 hover:bg-black/10 ">
              <Menu.Button
                className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                onClick={(e) => e.stopPropagation()}
              >
                <DotsVerticalIcon />
              </Menu.Button>
            </div>
            <div className="relative">
              <Menu.Items
                onClick={(e) => e.stopPropagation()}
                className={
                  "absolute w-full min-w-max -translate-x-28 rounded-md border border-gray-100 bg-white py-2 shadow-lg"
                }
              >
                {items.map((item, idx) => {
                  return (
                    <Menu.Item
                      key={idx}
                      as={"div"}
                      onClick={(e) => {
                        item.onClick(e);
                        close();
                      }}
                      className="flex w-[150px] flex-row items-center justify-between gap-2 px-5 py-1 hover:bg-gray-100"
                    >
                      {item.leading}
                      <span>{item.name}</span>
                    </Menu.Item>
                  );
                })}
              </Menu.Items>
            </div>
          </>
        );
      }}
    </Menu>
  );
}
