import { useRouter } from "next/router";

export function useRefreshGetServerSideProps(): () => void {
    const router = useRouter();
    return () => router.replace(router.asPath);
}