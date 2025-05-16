"use client";

import { useRouter } from "next/navigation";
import React from "react";
import useContextCustomHook from "@/components/globalcontext";

export default function BatchesHall() {
  const router = useRouter();
  const { batches, setBatches, setShowBatchModal } = useContextCustomHook();

  // Handlers
  const goToRouterHandler = (path) => {
    router.push(path);
  };

  function addBatchHandler() {
    setShowBatchModal(() => true);
  }

  return (
    <>
      <div className="h-full w-full bg-clr-hall px-24 py-12 flex flex-col justify-center items-start gap-y-8">
        <div className="h-fit w-full flex flex-col justify-center items-start gap-y-2 ">
          <div className="capitalize text-4xl font-bold ">Batches</div>
        </div>
        <div className="w-full h-full rounded-2xl bg-white p-16 grid grid-cols-4 grid-rows-5 gap-y-8 ">
          {batches.map((batch) => {
            return (
              <React.Fragment key={batch.batchId}>
                <div
                  className="w-64 h-20 border-2 border-gray-100 rounded-xl justify-center items-center flex flex-col gap-4 hover:bg-indigo-100 transition-3d cursor-pointer hover:border-indigo-600"
                  onClick={() => {
                    goToRouterHandler(`/batches/${batch.batchId}`);
                  }}
                >
                  <div className="text-lg font-medium text-gray-700 capitalize">
                    {batch.batchName}
                  </div>
                </div>
              </React.Fragment>
            );
          })}

          <div
            className="w-64 h-20 border-2 border-gray-100 rounded-xl bg-gray-100 text-7xl text-white flex justify-center items-center text-center cursor-pointer hover:bg-indigo-100 hover:border-indigo-600 transition-3d"
            onClick={addBatchHandler}
          >
            +
          </div>
        </div>
      </div>
    </>
  );
}
