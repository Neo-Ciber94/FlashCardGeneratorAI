import FlashCard from "@/lib/components/FlashCard";
import { FlashCardModel } from "@/lib/models/flashcard";
import { faker } from "@faker-js/faker";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { CubeIcon, PlusIcon } from "@heroicons/react/outline";
import { PAGE_TITLE, PASTEL_COLORS } from "@/lib/common/constants";
import Link from "next/link";
import Head from "next/head";

export const getServerSideProps: GetServerSideProps<{
  flashCards: FlashCardModel[];
}> = async ({ params }) => {
  faker.seed(Math.random() * 1000);

  const topicId = params?.topicId;

  if (typeof topicId !== "string") {
    throw new Error("Invalid topic id");
  }

  const flashCards: FlashCardModel[] = faker.helpers.multiple(
    () => ({
      topicId,
      id: faker.string.uuid(),
      title: faker.word.words({ count: faker.number.int({ min: 3, max: 8 }) }),
      content: faker.lorem.paragraphs({ min: 1, max: 2 }),
      lastModified: faker.date.past({ years: 3 }).getTime(),
      owner: faker.string.uuid(),
      color: faker.helpers.arrayElement(PASTEL_COLORS),
      isAiGenerated: false,
    }),
    {
      count: Math.ceil(Math.random() * 30),
    }
  );

  return {
    props: {
      flashCards,
    },
  };
};

export default function FlashCardPage({
  flashCards,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>{PAGE_TITLE} | Topic</title>
      </Head>

      <div className="px-4 md:px-20 py-4">
        <h1 className="font-bold text-3xl text-gray-700">
          <span className="mr-2">Topic</span>
          <span className="opacity-40">Flashcards</span>
        </h1>

        <div className="my-2 flex flex-row justify-center sm:justify-end gap-2 mt-5">
          <Link
            href="/topics/flashcards/generate"
            className="min-w-[150px] flex flex-row shadow-md items-center gap-2 px-4 py-2 text-white rounded-md bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-400"
          >
            <div className="w-5 h-5" style={{ transform: "rotateY(180deg)" }}>
              <CubeIcon />
            </div>
            <span>Generate</span>
          </Link>

          <Link
            href="/topics/flashcards/new"
            className="min-w-[150px] flex flex-row shadow-md items-center gap-2 px-4 py-2 text-white rounded-md bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-400"
          >
            <div className="w-5 h-5">
              <PlusIcon />
            </div>
            <span>Add New</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-4">
          {flashCards.map((flashCard) => {
            return <FlashCard flashCard={flashCard} key={flashCard.id} />;
          })}
        </div>
      </div>
    </>
  );
}
