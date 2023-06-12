import { PAGE_TITLE } from "@/lib/common/constants";
import TopicCard from "@/lib/components/TopicCard";
import { TopicModel } from "@/lib/models/topic";
import { TopicService } from "@/lib/services/topicService";
import { ArchiveIcon, PlusIcon } from "@heroicons/react/outline";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";

export const getServerSideProps: GetServerSideProps<{
  topics: TopicModel[];
}> = async () => {
  const topicService = new TopicService();
  const topics = await topicService.getAll();

  return {
    props: { topics },
  };
};

export default function TopicListPage({
  topics,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>{`${PAGE_TITLE} | Topics`}</title>
      </Head>

      <div className="px-4 md:px-20 py-4">
        <h1 className="font-bold text-3xl text-gray-700">
          <span>Topics</span>
        </h1>

        <div className="my-2 flex flex-row justify-center sm:justify-end gap-2 mt-5">
          <button className="min-w-[150px] flex flex-row shadow-md items-center gap-2 px-4 py-2 text-white rounded-md bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-400">
            <div className="w-5 h-5">
              <PlusIcon />
            </div>
            <span>New Topic</span>
          </button>
        </div>

        {topics.length === 0 && (
          <div className="text-center text-4xl text-gray-300 my-12">
            <div className="flex flex-row gap-3 justify-center items-center">
              <div className="w-12 h-12">
                <ArchiveIcon />
              </div>
              <span>No Topics</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10 mt-4">
          {topics.map((topic) => {
            return <TopicCard topic={topic} key={topic.id} />;
          })}
        </div>
      </div>
    </>
  );
}
