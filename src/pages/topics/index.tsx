import { PAGE_TITLE } from "@/lib/common/constants";
import TopicEditorDialog from "@/lib/components/TopicEditorDialog";
import TopicCard from "@/lib/components/TopicCard";
import { TopicModel } from "@/lib/models/topic";
import { TopicService } from "@/lib/services/topicService";
import { ArchiveIcon, PlusIcon } from "@heroicons/react/outline";
import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useState } from "react";
import { useRefreshData } from "@/lib/hooks/useRefreshData";
import ModalDialog from "@/lib/components/ModalDialog";
import { deferred } from "@/lib/utils/promises";
import toast from "react-hot-toast";
import { getErrorMessage, getResponseError } from "@/lib/utils/getErrorMessage";
import { withAuthGetServerSideProps } from "@/lib/utils/withAuthGetServerSideProps";
import { AnimatePresence, motion } from "framer-motion";

export const getServerSideProps = withAuthGetServerSideProps<{
  topics: TopicModel[];
}>(async (user) => {
  const topicService = new TopicService();
  const topics = await topicService.getAll(user.username);

  return {
    props: { topics },
  };
});

export default function TopicListPage({
  topics,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [open, setOpen] = useState(false);
  const [deletingTopic, setDeletingTopic] = useState<TopicModel>();
  const [editingTopic, setEditingTopic] = useState<TopicModel>();
  const refreshData = useRefreshData();

  const handleDelete = async (close: () => void) => {
    const notifier = deferred<void>();
    toast.promise(notifier.promise, {
      loading: "Loading...",
      success: "Topic was deleted",
      error: (msg) => msg,
    });

    if (deletingTopic == null) {
      throw new Error("no topic to delete");
    }

    try {
      const res = await fetch(`/api/topics/${deletingTopic.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(await getResponseError(res));
      }

      notifier.resolve();
      refreshData();
    } catch (err) {
      notifier.reject(getErrorMessage(err));
      console.error(err);
    } finally {
      close();
    }
  };

  return (
    <>
      <Head>
        <title>{`${PAGE_TITLE} | Topics`}</title>
      </Head>

      <div className="px-4 py-4 md:px-20">
        <h1 className="text-3xl font-bold text-gray-700 dark:text-white">
          <span>Topics</span>
        </h1>

        <div className="my-2 mt-5 flex flex-row justify-center gap-2 sm:justify-end">
          <button
            onClick={() => setOpen(true)}
            className="flex min-w-full flex-row items-center gap-2 rounded-md bg-red-500 px-4 py-2 text-white shadow-md hover:bg-red-600 focus:ring-4 focus:ring-red-400 sm:min-w-[150px]"
          >
            <div className="h-5 w-5">
              <PlusIcon />
            </div>
            <span>New Topic</span>
          </button>
        </div>

        {topics.length === 0 && (
          <div className="my-12 text-center text-4xl text-gray-300">
            <div className="flex flex-row items-center justify-center gap-3">
              <div className="h-12 w-12">
                <ArchiveIcon />
              </div>
              <span>No Topics</span>
            </div>
          </div>
        )}

        <div className="mt-4 grid grid-cols-1 gap-10 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {topics.map((topic) => {
            return (
              <AnimatePresence key={topic.id}>
                <motion.div
                  key="topic"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <TopicCard
                    topic={topic}
                    onDelete={(topic) => {
                      setDeletingTopic(topic);
                    }}
                    onEdit={(topic) => {
                      setEditingTopic(topic);
                      setOpen(true);
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            );
          })}
        </div>
      </div>

      <TopicEditorDialog
        topic={editingTopic}
        open={open}
        onClose={() => {
          setOpen(false);
          setEditingTopic(undefined);
        }}
        onSucceed={() => {
          refreshData();
          setEditingTopic(undefined);
        }}
      />

      <ModalDialog
        title="Delete Topic?"
        open={Boolean(deletingTopic)}
        onClose={() => setDeletingTopic(undefined)}
        actions={[
          {
            name: "Delete",
            className:
              "bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-400 shadow-md rounded-md",
            onClick: (_, close) => handleDelete(close),
          },
          {
            name: "Cancel",
            className:
              "bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:ring-gray-400 shadow-md rounded-md",
            onClick(_, close) {
              close();
            },
          },
        ]}
      >
        <div className="py-2">
          <span>Are you sure do you want to delete this topic?</span>
        </div>
      </ModalDialog>
    </>
  );
}
