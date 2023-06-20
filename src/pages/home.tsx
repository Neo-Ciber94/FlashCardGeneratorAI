import { PASTEL_COLORS } from "@/lib/common/constants";
import FlashCardBase from "@/lib/components/FlashCardBase";
import PlaceHolder from "@/lib/components/Placeholder";
import Rotable from "@/lib/components/Rotable";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function HomePage() {
  return (
    <div>
      <CallToAction />
      <Features />
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
      <div className="h-[400px] w-8/12 px-0 lg:w-full lg:px-16">
        <PlaceHolder />
      </div>
    </section>
  );
}

function Features() {
  const features = ["Feature 1", "Feature 2", "Feature 3"];
  return (
    <section className="m-10 flex flex-col justify-center rounded-lg bg-black px-12 py-24">
      <h1 className="mb-10 text-center text-5xl font-bold text-white">
        Features
      </h1>
      <div className="flex flex-col items-center justify-around gap-5 md:flex-row">
        {features.map((feature, idx) => {
          return (
            <Rotable key={idx}>
              <FlashCardBase
                key={idx}
                title={feature}
                bgColor={PASTEL_COLORS[idx]}
                className="text-center hover:scale-95"
              />
            </Rotable>
          );
        })}
      </div>
    </section>
  );
}

