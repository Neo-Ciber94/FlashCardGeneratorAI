import "@/styles/globals.css";
import "@/lib/aws/awsConfig";
import "@aws-amplify/ui-react/styles.css";
import type { AppProps } from "next/app";
import Layout from "@/lib/layout/Layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
