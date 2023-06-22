import { STATUS_CODES } from "http";

export interface ErrorPageProps {
  statusCode: number;
  message?: string;
}

export default function ErrorPage({ statusCode, message }: ErrorPageProps) {
  return (
    <h1 className="flex h-[60vh] w-full flex-row items-center justify-center text-xl sm:text-2xl gap-2">
      <span className="text-red-500/50">{statusCode}</span>
      <span className="text-red-500/50">|</span>
      <span className="text-red-500/50">
        {STATUS_CODES[statusCode] || message}
      </span>
    </h1>
  );
}
