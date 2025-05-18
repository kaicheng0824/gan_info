"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// This component will be dynamically imported with SSR disabled
const DynamicMap = dynamic(
  () => import("./DynamicMap"),
  { ssr: false }
);

export default function MapView() {
  return <DynamicMap />;
}