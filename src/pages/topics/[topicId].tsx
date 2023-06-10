import FlashCard from "@/lib/components/FlashCard";
import { FlashCardModel } from "@/lib/models/flashcard";
import { faker } from "@faker-js/faker";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

export const getServerSideProps: GetServerSideProps<{
  flashCards: FlashCardModel[];
}> = async ({ params }) => {
  faker.seed(Math.random() * 1000);

  const COLORS = [
    "#ff6961",
    "#77dd77",
    "#fdfd96",
    "#84b6f4",
    "#fdcae1",
    "#7052ff",
    "#ff7360",
    "#ffff51",
    "#d06aff",
  ];

  const topicId = params?.topicId;

  if (typeof topicId !== "string") {
    throw new Error("Invalid topic");
  }

  const flashCards: FlashCardModel[] = faker.helpers.multiple(
    () => ({
      topicId,
      id: faker.string.uuid(),
      title: faker.word.words({
        count: faker.number.int({ min: 3, max: 8 }),
      }),
      content: faker.lorem.paragraphs({ min: 1, max: 2 }),
      lastModified: faker.date.past({ years: 3 }).getTime(),
      owner: faker.string.uuid(),
      color: faker.helpers.arrayElement(COLORS),
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
    <div className="px-4 md:px-20 py-4">
      <h1 className="font-bold text-3xl text-gray-700">
        <span className="mr-2">Topic</span>
        <span className="opacity-50">Flashcards</span>
      </h1>

      <div className="flex flex-row justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-10">
          {flashCards.map((flashCard) => {
            return <FlashCard flashCard={flashCard} key={flashCard.id} />;
          })}
        </div>
      </div>
    </div>
  );
}
