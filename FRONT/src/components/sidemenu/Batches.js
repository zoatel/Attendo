"use client";
import React, { useState } from "react";
import useContextCustomHook from "../globalcontext";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Batches({}) {
  const router = useRouter();

  // Handlers
  const goToRouterHandler = (path) => {
    router.push(path);
  };

  return (
    <div className="w-full">
      <div
        onClick={() => goToRouterHandler("/batches")}
        className={`flex justify-between items-center px-8 py-2 text-xl font-medium bg-gray-50 text-gray-600  cursor-pointer transition-3d`}
      >
        <span>Batches</span>
      </div>
    </div>
  );
}
