import { PAGE_TITLE } from "@/lib/common/constants";
import Head from "next/head";
import { FlashCardModel, UpdateFlashCardModel } from "@/lib/models/flashcard";
import FlashCardEditor from "@/lib/components/FlashCardEditor";
import { getErrorMessage, getResponseError } from "@/lib/utils/getErrorMessage";
import { deferred } from "@/lib/utils/promises";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { InferGetServerSidePropsType } from "next";
import { FlashcardService } from "@/lib/services/flashCardService";
import { withAuthGetServerSideProps } from "@/lib/utils/withAuthGetServerSideProps";
import BreadCrumb from "@/lib/components/Breadcrumb";

export const getServerSideProps = withAuthGetServerSideProps<{
  flashCard: FlashCardModel;
}>(async (user, context) => {
  const topicId = String(context.params?.topicId);
  const flashCardId = String(context.params?.id);
  const flashCardService = new FlashcardService();
  const flashCard = await flashCardService.getById(
    topicId,
    flashCardId,
    user.username
  );

  if (flashCard == null) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      flashCard,
    },
  };
});

export default function EditFlashCardPage({
  flashCard,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const handleSubmit = async (
    input: UpdateFlashCardModel,
    reset: () => void
  ) => {
    const notifier = deferred<void>();
    toast.promise(notifier.promise, {
      loading: "Loading...",
      success: "Flashcard was updated successfully",
      error: (msg) => msg,
    });

    try {
      const res = await fetch("/api/flashcards", {
        method: "PUT",
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        throw new Error(await getResponseError(res));
      }

      const _json = await res.json();
      notifier.resolve();
      reset();

      router.push(`/topics/${String(router.query.topicId)}`);
    } catch (err) {
      notifier.reject(getErrorMessage(err));
      console.error(err);
    }
  };

  return (
    <>
      <Head>
        <title>{`${PAGE_TITLE} | Edit`}</title>
      </Head>
      <div className="mx-4 mt-5 sm:mx-10 lg:mx-28">
        <BreadCrumb
          segments={[
            {
              name: "Topics",
              to: "/topics",
            },
          ]}
        />

        <FlashCardEditor
          action="edit"
          flashCard={flashCard}
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
}
