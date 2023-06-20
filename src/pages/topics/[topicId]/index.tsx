import FlashCard from "@/lib/components/FlashCard";
import { FlashCardModel } from "@/lib/models/flashcard";
import { InferGetServerSidePropsType } from "next";
import { CubeIcon, PlusIcon, ArchiveIcon } from "@heroicons/react/outline";
import { PAGE_TITLE } from "@/lib/common/constants";
import Link from "next/link";
import Head from "next/head";
import { FlashcardService } from "@/lib/services/flashCardService";
import { TopicModel } from "@/lib/models/topic";
import { withAuthGetServerSideProps } from "@/lib/utils/withAuthGetServerSideProps";
import { useState } from "react";
import GenerateFlashCardsEditor from "@/lib/components/GenerateFlashCardsEditor";
import { useRefreshData } from "@/lib/hooks/useRefreshData";
import BreadCrumb from "@/lib/components/Breadcrumb";
import { Reorder } from "framer-motion";

type Params = { flashCards: FlashCardModel[]; topic: TopicModel };

export const getServerSideProps = withAuthGetServerSideProps<Params>(
  async (user, context) => {
    const topicId = context.params?.topicId;

    try {
      if (typeof topicId !== "string") {
        throw new Error("Invalid topic id");
      }

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
    } catch (err) {
      console.error(err);
      return {
        notFound: true,
      };
    }
  }
);

export default function FlashCardPage({
  topic,
  ...rest
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [open, setOpen] = useState(false);
  const refreshData = useRefreshData();
  const [flashCards, _setFlashCards] = useState(rest.flashCards || []);

  return (
    <>
      <Head>
        <title>{`${PAGE_TITLE} | ${topic.name}`}</title>
      </Head>

      <div className="px-4 py-4 md:px-20">
        <BreadCrumb
          segments={[
            {
              name: "Topics",
              to: "/",
            },
          ]}
        />

        <h1 className="text-xl font-bold text-gray-700">{topic.name}</h1>

        <div className="my-2 mt-5 flex flex-col justify-center gap-2 xs:flex-row sm:justify-end">
          <button
            onClick={() => setOpen(true)}
            className="flex min-w-[150px] flex-row items-center gap-2 rounded-md bg-indigo-500 px-4 py-2 text-white shadow-md hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-400"
          >
            <div className="h-5 w-5" style={{ transform: "rotateY(180deg)" }}>
              <CubeIcon />
            </div>
            <span>Generate</span>
          </button>

          <Link
            href={`/topics/${topic.id}/flashcards/new`}
            className="flex min-w-[150px] flex-row items-center gap-2 rounded-md bg-red-500 px-4 py-2 text-white shadow-md hover:bg-red-600 focus:ring-4 focus:ring-red-400"
          >
            <div className="h-5 w-5">
              <PlusIcon />
            </div>
            <span>Add New</span>
          </Link>
        </div>

        {flashCards.length === 0 && (
          <div className="mt-20 text-center text-4xl text-gray-300">
            <div className="flex flex-row items-center justify-center gap-3">
              <div className="h-12 w-12">
                <ArchiveIcon />
              </div>
              <span>No FlashCards</span>
            </div>
          </div>
        )}

        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {flashCards.map((flashCard) => {
            return (
              <div key={flashCard.id}>
                <FlashCard
                  flashCard={flashCard}
                  afterDelete={() => {
                    refreshData();
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <GenerateFlashCardsEditor
        topicId={topic.id}
        open={open}
        onClose={() => setOpen(false)}
        onGenerate={(data) => {
          console.log(data);
          refreshData();
        }}
      />
    </>
  );
}
