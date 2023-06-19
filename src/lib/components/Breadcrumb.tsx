import { ChevronRightIcon } from "@heroicons/react/outline";
import Link from "next/link";

interface BreadcrumbSegment {
  name: string;
  to: string;
}

export interface BreadCrumbProps {
  segments: BreadcrumbSegment[];
}

export default function BreadCrumb({ segments }: BreadCrumbProps) {
  return (
    <div className="flex flex-row items-center gap-3 py-2">
      {segments.map((segment, idx) => {
        return (
          <Link
            href={segment.to}
            key={idx}
            className="flex flex-row items-center gap-1 text-base font-bold text-red-500 transition-colors duration-300 hover:text-red-600 hover:underline"
          >
            <span>{segment.name}</span>
            <div className="h-5 w-5">
              <ChevronRightIcon />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
