import TopicCard from "@/lib/components/TopicCard";
import { TopicModel } from "@/lib/models/topic";
import { faker } from "@faker-js/faker";
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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10 mt-10">
        {topics.map((topic) => {
          return <TopicCard topic={topic} key={topic.id} />;
        })}
      </div>
    </div>
  );
}
