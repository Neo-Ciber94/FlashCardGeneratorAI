import FlashCard from "@/lib/components/FlashCard";
import { FlashCardModel } from "@/lib/models/flashcard";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { CubeIcon, PlusIcon, ArchiveIcon } from "@heroicons/react/outline";
import { PAGE_TITLE } from "@/lib/common/constants";
import Link from "next/link";
import Head from "next/head";
import { FlashcardService } from "@/lib/services/flashCardService";
import type { Auth } from "@aws-amplify/auth";
import { withSSRContext } from "aws-amplify";
import { TopicModel } from "@/lib/models/topic";

type TopicFlashCardParam = { flashCards: FlashCardModel[]; topic: TopicModel };

export const getServerSideProps: GetServerSideProps<
  TopicFlashCardParam
> = async (context) => {
  const topicId = context.params?.topicId;

  if (typeof topicId !== "string") {
    throw new Error("Invalid topic id");
  }

  const amplifyContext = withSSRContext(context);
  const auth = amplifyContext.Auth as typeof Auth;
  const user = await auth.currentAuthenticatedUser();

  const flashCardService = new FlashcardService();
  const { flashCards, topic } = await flashCardService.getAll(
    topicId,
    user.username
  );

  return {
    props: {
      flashCards,
      topic,
    },
  };
};

export default function FlashCardPage({
  flashCards,
  topic,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>{`${PAGE_TITLE} | ${topic.name}`}</title>
      </Head>

      <div className="px-4 md:px-20 py-4">
        <h1 className="font-bold text-xl text-gray-700">{topic.name}</h1>

        <div className="my-2 flex flex-row justify-center sm:justify-end gap-2 mt-5">
          <Link
            href={`/topics/${topic.id}/flashcards/generate`}
            className="min-w-[150px] flex flex-row shadow-md items-center gap-2 px-4 py-2 text-white rounded-md bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-400"
          >
            <div className="w-5 h-5" style={{ transform: "rotateY(180deg)" }}>
              <CubeIcon />
            </div>
            <span>Generate</span>
          </Link>

          <Link
            href={`/topics/${topic.id}/flashcards/new`}
            className="min-w-[150px] flex flex-row shadow-md items-center gap-2 px-4 py-2 text-white rounded-md bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-400"
          >
            <div className="w-5 h-5">
              <PlusIcon />
            </div>
            <span>Add New</span>
          </Link>
        </div>

        {flashCards.length === 0 && (
          <div className="text-center text-4xl text-gray-300 mt-20">
            <div className="flex flex-row gap-3 justify-center items-center">
              <div className="w-12 h-12">
                <ArchiveIcon />
              </div>
              <span>No FlashCards</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-4">
          {flashCards.map((flashCard) => {
            return <FlashCard flashCard={flashCard} key={flashCard.id} />;
          })}
        </div>
      </div>
    </>
  );
}
