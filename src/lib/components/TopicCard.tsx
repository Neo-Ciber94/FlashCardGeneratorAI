import { DocumentDuplicateIcon } from "@heroicons/react/outline";
import { TopicModel } from "../models/topic";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
dayjs.extend(relativeTime);

export interface TopicCardProps {
  topic: TopicModel;
}

export default function TopicCard({ topic }: TopicCardProps) {
  return (
    <Link href={`/topics/${topic.id}`}>
      <div
        className=" border border-gray-200 rounded-lg shadow-md p-2 flex flex-col justify-between gap-3 
      transition-shadow hover:shadow-lg hover:shadow-red-200 duration-300"
      >
        <div className="flex flex-row gap-3 px-4 py-6">
          <div className="w-8 h-8 text-red-500 flex-grow-0 flex-shrink-0">
            <DocumentDuplicateIcon />
          </div>
          <p className="text-black">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolor,
            voluptate magnam.
          </p>
        </div>

        <div className="w-full">
          <hr />
          <small className="mt-3 flex flex-row justify-end text-[10px] text-gray-400">
            Last modified {dayjs(topic.lastModified).fromNow()}
          </small>
        </div>
      </div>
    </Link>
  );
}
