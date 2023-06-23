import { STATUS_CODES } from "http";
import { NextApiRequest } from "next";

export interface ErrorPageProps {
  statusCode: number;
  message?: string;
}

export default function ErrorPage({ statusCode = 500, message }: ErrorPageProps) {
  return (
    <h1 className="flex h-[60vh] w-full flex-row items-center justify-center gap-2 text-xl sm:text-2xl">
      <span className="text-red-500/50">{statusCode}</span>
      <span className="text-red-500/50">|</span>
      <span className="text-red-500/50">
        {STATUS_CODES[statusCode] || message}
      </span>
    </h1>
  );
}

interface ErrorPageInitialProps {
  res: NextApiRequest;
  err: { statusCode: number };
}

ErrorPage.getInitialProps = ({ res, err }: ErrorPageInitialProps) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
