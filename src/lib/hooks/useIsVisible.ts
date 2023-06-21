import { useState, useEffect, useRef, RefObject, MutableRefObject } from "react";

export function useIsVisible<T extends Element>(): [RefObject<T>, boolean] {
    const ref = useRef<T>(null);
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

    return [ref, isIntersecting];
}

export function useIsVisibleWithRef<T extends Element>(ref: RefObject<T>) {
    const [isIntersecting, setIntersecting] = useState(false);

    useEffect(() => {
        if (ref?.current == null) {
            return;
        }

        const observer = new IntersectionObserver(([entry]) =>
            setIntersecting(entry.isIntersecting)
        );

        observer.observe(ref.current!);
        return () => {
            observer.disconnect();
        };
    }, [ref]);

    return isIntersecting
}