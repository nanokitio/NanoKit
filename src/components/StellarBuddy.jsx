"use client";

import Lottie from "lottie-react";
import stellar from "@/assets/lottie/Stellar IA Buddy (Remix)(2).json";

export default function StellarBuddy() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <Lottie
        animationData={stellar}
        loop={true}
        autoplay={true}
        className="w-[420px] h-[420px] max-w-full"
      />
    </div>
  );
}
