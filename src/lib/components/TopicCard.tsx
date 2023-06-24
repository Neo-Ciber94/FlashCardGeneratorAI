import {
  DocumentDuplicateIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import { TopicModel } from "../models/topic";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import ContextMenu from "./ContextMenu";
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
          className=" flex flex-col justify-between gap-3 rounded-lg border border-gray-200 dark:border-white/10
          p-2 shadow-md transition-shadow duration-300 hover:shadow-lg hover:shadow-red-200 dark:hover:shadow-red-200/10"
        >
          <div className="flex flex-row items-center gap-3 px-1 py-6">
            <div className="ml-3 h-8 w-8 flex-shrink-0 flex-grow-0 text-red-500">
              <DocumentDuplicateIcon />
            </div>
            <p className="line-clamp-3 text-black dark:text-white">
              {topic.name}
            </p>

            <ContextMenu
              items={[
                {
                  name: "Edit",
                  onClick: handleEdit,
                  leading: (
                    <div className="h-5 w-5 text-red-500">
                      <PencilIcon />
                    </div>
                  ),
                },
                {
                  name: "Delete",
                  onClick: handleDelete,
                  leading: (
                    <div className="h-5 w-5 text-red-500">
                      <TrashIcon />
                    </div>
                  ),
                },
              ]}
            />
          </div>

          <div className="w-full">
            <hr className="dark:opacity-30" />
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
