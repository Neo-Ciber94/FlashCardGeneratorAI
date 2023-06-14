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
      <div className="rounded-full p-1 group hover:bg-black/10 duration-300 transition-all ">
        <Menu.Button
          className="w-5 h-5 text-gray-400 group-hover:text-gray-500"
          onClick={(e) => e.stopPropagation()}
        >
          <DotsVerticalIcon />
        </Menu.Button>
      </div>

      {/* Use the `Transition` component. */}
      <div className="relative">
        <Menu.Items
          onClick={(e) => e.stopPropagation()}
          className={
            "bg-white border border-gray-100 rounded-md shadow-lg py-2 w-full min-w-max absolute -translate-x-28"
          }
        >
          {items.map((item, idx) => {
            return (
              <Menu.Item
                key={idx}
                as={"div"}
                onClick={item.onClick}
                className="w-[150px] px-5 py-1 hover:bg-gray-100 flex flex-row justify-between gap-2 items-center"
              >
                {item.leading}
                <span>{item.name}</span>
              </Menu.Item>
            );
          })}
        </Menu.Items>
      </div>
    </Menu>
  );
}
