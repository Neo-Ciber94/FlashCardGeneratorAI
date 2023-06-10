import TopicCard from "@/lib/components/TopicCard";
import { TopicModel } from "@/lib/models/topic";
import { faker } from "@faker-js/faker";
import { PlusIcon } from "@heroicons/react/outline";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

export const getServerSideProps: GetServerSideProps<{
  topics: TopicModel[];
}> = async () => {
  faker.seed(299);

  const topics: TopicModel[] = faker.helpers.multiple(
    () => ({
      id: faker.string.uuid(),
      name: faker.word.verb(),
      owner: "fake-user-id",
      lastModified: faker.date.past({ years: 4 }).getTime(),
    }),
    { count: 7 }
  );

  return {
    props: {
      topics,
    },
  };
};

export default function TopicListPage({
  topics,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10 mt-4">
        {topics.map((topic) => {
          return <TopicCard topic={topic} key={topic.id} />;
        })}
      </div>
    </div>
  );
}
