import {
  DocumentDuplicateIcon,
  DotsVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import { TopicModel } from "../models/topic";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { Menu } from "@headlessui/react";
dayjs.extend(relativeTime);

export interface TopicCardProps {
  topic: TopicModel;
  onEdit?: (topic: TopicModel) => void;
  onDelete?: (topic: TopicModel) => void;
}

export default function TopicCard({ topic, onEdit, onDelete }: TopicCardProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (onEdit) {
      onEdit(topic);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (onDelete) {
      onDelete(topic);
    }
  };

  return (
    <>
      <Link href={`/topics/${topic.id}`}>
        <div
          className=" border border-gray-200 rounded-lg shadow-md p-2 flex flex-col justify-between gap-3 
      transition-shadow hover:shadow-lg hover:shadow-red-200 duration-300"
        >
          <div className="flex flex-row items-center gap-3 px-1 py-6">
            <div className="w-8 h-8 text-red-500 flex-grow-0 flex-shrink-0 ml-3">
              <DocumentDuplicateIcon />
            </div>
            <p className="text-black">{topic.name}</p>

            <Menu as="div" className="ml-auto">
              <div className="rounded-full p-1 group hover:bg-gray-100 duration-300 transition-all ">
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
                  <Menu.Item
                    as={"div"}
                    onClick={handleEdit}
                    className="w-[150px] px-5 py-1 hover:bg-gray-100 flex flex-row justify-between gap-2 items-center"
                  >
                    <div className="h-5 w-5 text-red-500">
                      <PencilIcon />
                    </div>
                    <span>Edit</span>
                  </Menu.Item>
                  <Menu.Item
                    as={"div"}
                    onClick={handleDelete}
                    className="w-[150px] px-5 py-1 hover:bg-gray-100 flex flex-row justify-between gap-2 items-center"
                  >
                    <div className="h-5 w-5 text-red-500">
                      <TrashIcon />
                    </div>
                    <div>Delete</div>
                  </Menu.Item>
                </Menu.Items>
              </div>
            </Menu>
          </div>

          <div className="w-full">
            <hr />
            <small className="mt-3 flex flex-row justify-between text-[10px] text-gray-400">
              {/* <span>4 cards</span> */}
              <span></span>
              <span>Last modified {dayjs(topic.lastModified).fromNow()}</span>
            </small>
          </div>
        </div>
      </Link>
    </>
  );
}
