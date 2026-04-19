"use client";

import dynamic from "next/dynamic";

const ExitIntentModal = dynamic(() => import("@/components/ExitIntentModal"), {
  ssr: false,
});

export default function LazyExitIntent() {
  return <ExitIntentModal />;
}
