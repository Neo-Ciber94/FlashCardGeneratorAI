import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";
import { useIsVisible, useIsVisibleWithRef } from "../hooks/useIsVisible";
import { PropsWithChildren, forwardRef, useEffect, useState } from "react";

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
    <div ref={ref} className="w-full h-full">
      <AnimatePresence>
        {alreadyVisible && <motion.div {...rest}>{children}</motion.div>}
      </AnimatePresence>
    </div>
  );
}
