"use client";

import { useRouter } from "next/navigation";
import React from "react";
import useContextCustomHook from "@/components/globalcontext";
import StudentsTable from "./StudentTable";

export default function BatchHall() {
  const router = useRouter();
  const { courses, setShowModal } = useContextCustomHook();

  // Handlers
  const goToRouterHandler = (path) => {
    router.push(path);
  };

  return (
    <>
      <div className="h-full w-full bg-clr-hall px-24 py-12 flex flex-col justify-center items-start gap-y-8">
        <div className="h-fit w-full flex flex-col justify-center items-start gap-y-2 ">
          <div className="capitalize text-4xl font-bold ">Batches</div>
        </div>
        <div className="w-full h-full rounded-2xl bg-white p-10 ">
          <StudentsTable />
        </div>
      </div>
    </>
  );
}
