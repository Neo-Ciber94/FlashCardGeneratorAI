import "@/styles/globals.css";
import "@/lib/aws/awsConfig";
import "@aws-amplify/ui-react/styles.css";
import type { AppProps } from "next/app";
import Layout from "@/lib/layout/Layout";
import { Toaster } from "react-hot-toast";
import Head from "next/head";
import { PAGE_TITLE } from "@/lib/common/constants";
import { Authenticator } from "@aws-amplify/ui-react";
import { ErrorBoundary } from "@/lib/components/ErrorBoundary";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>{PAGE_TITLE}</title>
      </Head>

      <ErrorBoundary>
        <Authenticator.Provider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <Toaster />
        </Authenticator.Provider>
      </ErrorBoundary>
    </>
  );
}
