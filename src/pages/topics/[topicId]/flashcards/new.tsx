import { PAGE_TITLE } from "@/lib/common/constants";
import Head from "next/head";
import { CreateFlashCardModel } from "@/lib/models/flashcard";
import FlashCardEditor from "@/lib/components/FlashCardEditor";
import { getErrorMessage, getResponseError } from "@/lib/utils/getErrorMessage";
import { deferred } from "@/lib/utils/promises";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import BreadCrumb from "@/lib/components/Breadcrumb";

export default function NewFlashCardPage() {
  const router = useRouter();

  const handleSubmit = async (
    input: CreateFlashCardModel,
    reset: () => void
  ) => {
    const notifier = deferred<void>();
    toast.promise(notifier.promise, {
      loading: "Loading...",
      success: "Flashcard was created successfully",
      error: (msg) => msg,
    });

    try {
      const res = await fetch("/api/flashcards", {
        method: "POST",
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
        <title>{`${PAGE_TITLE} | New`}</title>
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

        <FlashCardEditor action="create" onSubmit={handleSubmit} />
      </div>
    </>
  );
}
