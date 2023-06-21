import { useState, useEffect } from "react";

export function useIsVisible<T extends Element>(ref: React.RefObject<T>) {
    const [isIntersecting, setIntersecting] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) =>
            setIntersecting(entry.isIntersecting)
        );

        observer.observe(ref.current!);
        return () => {
            observer.disconnect();
        };
    }, [ref]);

    return isIntersecting;
}