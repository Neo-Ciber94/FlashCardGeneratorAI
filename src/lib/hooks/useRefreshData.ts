import { useRouter } from "next/router";

export function useRefreshData(): () => void {
    const router = useRouter();
    return () => router.replace(router.asPath);
}