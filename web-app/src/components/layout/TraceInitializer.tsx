"use client";

import { useEffect } from "react";
import { initTracing } from "@/lib/tracing.client";

export default function TraceInitializer() {
  useEffect(() => {
    console.log("🛠️ TraceInitializer: useEffect triggered");
    initTracing();
  }, []);

  return null;
}
