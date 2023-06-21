import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";
import { useIsVisible } from "../hooks/useIsVisible";
import { PropsWithChildren, useEffect, useState } from "react";

export interface AnimateOnVisibleProps extends HTMLMotionProps<"div"> {}

export default function AnimateOnVisible({
  children,
  ...rest
}: PropsWithChildren<AnimateOnVisibleProps>) {
  const [ref, isVisible] = useIsVisible<HTMLDivElement>();
  const [alreadyVisible, setAlreadyVisible] = useState(isVisible);

  useEffect(() => {
    if (isVisible && !alreadyVisible) {
      setAlreadyVisible(true);
    }
  }, [alreadyVisible, isVisible]);

  return (
    <>
      <AnimatePresence>
        {alreadyVisible && <motion.div {...rest}>{children}</motion.div>}
      </AnimatePresence>
      <div ref={ref} className="h-0 w-0"></div>
    </>
  );
}
