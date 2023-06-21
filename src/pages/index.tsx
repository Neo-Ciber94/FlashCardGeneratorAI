import { PASTEL_COLORS } from "@/lib/common/constants";
import FlashCardBase from "@/lib/components/FlashCardBase";
import Rotable from "@/lib/components/Rotable";
import React, { useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import { useIsVisible } from "@/lib/hooks/useIsVisible";
import AnimateOnVisible from "@/lib/components/AnimateOnVisible";

export default function HomePage() {
  return (
    <div>
      <CallToAction />
      <Features />
      <PoweredBy />
    </div>
  );
}

function CallToAction() {
  return (
    <section className="flex flex-col items-center justify-between gap-5 px-5 py-32 lg:flex-row lg:px-24">
      <div className="w-full text-left lg:w-4/12">
        <h1 className="mb-10 text-2xl font-bold sm:text-5xl">
          Supercharge your learning with SmartFlash!
        </h1>

        <p className="rounded-md bg-red-100 p-5 text-sm">
          Take control of your knowledge and boost your memory retention. Start
          mastering new concepts today and unlock your full learning potential.
        </p>
      </div>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, translateX: 50 }}
          animate={{ opacity: 1, translateX: 0 }}
          exit={{ opacity: 0, translateX: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mt-10 flex h-[400px] w-full flex-row justify-center px-0 md:w-8/12 lg:mt-0 lg:w-full lg:px-16">
            <div
              className="relative flex h-full w-full flex-row justify-center overflow-hidden rounded-md border border-gray-200/70 bg-white shadow-md sm:w-[600px]"
              style={{
                transform: "rotate3d(1, 1, 1, 5deg)",
                perspective: 1000,
                transformStyle: "preserve-3d",
              }}
            >
              <Image
                alt="FlashCards Page"
                src="/images/flashcards-page.png"
                className="w-full object-contain"
                fill
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function Features() {
  const features = [
    "Our flashcard application can help you get the most out of your education by helping you learn more effectively and efficiently",
    "Easily organize your flashcards by topic so you can study more effectively",
    "Our AI-powered flashcard generator will help you create flashcards with the most important information from your text",
  ];

  return (
    <section className="m-10 flex flex-col justify-center rounded-lg bg-red-100 px-12 py-24">
      <h1 className="mb-10 text-center text-5xl font-bold text-black">
        Features
      </h1>
      <div className="flex flex-col items-center justify-around gap-5 md:flex-row">
        {features.map((feature, idx) => {
          return (
            <AnimateOnVisible
              key={idx}
              className="flex-grow basis-1/3"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.5, delay: idx * 0.4 }}
            >
              <Rotable>
                <FlashCardBase
                  title={feature}
                  bgColor={PASTEL_COLORS[idx]}
                  className="text-center hover:scale-95"
                />
              </Rotable>
            </AnimateOnVisible>
          );
        })}
      </div>
    </section>
  );
}

function PoweredBy() {
  return (
    <section className="flex flex-col items-center justify-between gap-5 px-0 py-32 lg:px-24">
      <AnimateOnVisible
        initial={{ opacity: 0, translateX: -100 }}
        animate={{ opacity: 1, translateX: 0 }}
        exit={{ opacity: 0, translateX: -100 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-center text-xl font-bold sm:text-3xl">
          Powered By
        </h1>
      </AnimateOnVisible>

      <div className="relative h-[200px] w-[60vw] max-w-[600px]">
        <a href="https://docs.amplify.aws/" target="_blank">
          <Image
            alt="AWS Amplify"
            src="/images/amplify-logo.png"
            fill
            className="object-contain"
          />
        </a>
      </div>
    </section>
  );
}
