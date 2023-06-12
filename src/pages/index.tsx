import { PAGE_TITLE } from "@/lib/common/constants";
import TopicEditorDialog from "@/lib/components/TopicEditorDialog";
import TopicCard from "@/lib/components/TopicCard";
import { TopicModel } from "@/lib/models/topic";
import { TopicService } from "@/lib/services/topicService";
import { ArchiveIcon, PlusIcon, TrashIcon } from "@heroicons/react/outline";
import { withSSRContext } from "aws-amplify";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useState } from "react";
import type { Auth } from "@aws-amplify/auth";
import { useRefreshGetServerSideProps as useRefreshData } from "@/lib/hooks/useRefreshData";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import ModalDialog from "@/lib/components/ModalDialog";

export const getServerSideProps: GetServerSideProps<{
  topics: TopicModel[];
}> = async (context) => {
  const amplifyContext = withSSRContext(context);
  const auth = amplifyContext.Auth as typeof Auth;
  const user = await auth.currentAuthenticatedUser();
  const topicService = new TopicService();
  const topics = await topicService.getAll(user.username);

  return {
    props: { topics },
  };
};

export default function TopicListPage({
  topics,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [open, setOpen] = useState(false);
  const [deletingTopic, setDeletingTopic] = useState<TopicModel>();
  const [editingTopic, setEditingTopic] = useState<TopicModel>();
  const router = useRouter();
  const refreshData = useRefreshData();

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
          <button
            onClick={() => setOpen(true)}
            className="min-w-[150px] flex flex-row shadow-md items-center gap-2 px-4 py-2 text-white rounded-md bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-400"
          >
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
            return (
              <TopicCard
                topic={topic}
                key={topic.id}
                onDelete={(topic) => {
                  setDeletingTopic(topic);
                }}
                onEdit={(topic) => {
                  setEditingTopic(topic);
                  console.log("edit");
                  setOpen(true);
                }}
              />
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
              "bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-400",
            onClick: (_, close) => {
              console.log("delete");
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
