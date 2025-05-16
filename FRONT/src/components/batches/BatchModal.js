"use client";
import React, { useState } from "react";
import useContextCustomHook from "@/components/globalcontext";

export default function BatchModal() {
  const { batches, setBatches, showBatchModal, setShowBatchModal } =
    useContextCustomHook();
  const [btch, setBtch] = useState({
    batchName: "",
    batchId: -1,
  });

  function confirmBatchAdditionHandler() {
    const lastBatch = setBatches[setBatches.length - 1];

    const newBatch = {
      batchId: lastBatch ? lastBatch.batchId + 1 : 0,
      batchName: btch.batchName,
    };

    setBatches([...batches, newBatch]);

    setBtch({
      batchName: "",
      batchId: -1,
    });

    setShowBatchModal(false);
  }

  // Handlers

  return (
    <>
      {showBatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.7)] ">
          <div className="bg-white rounded-xl p-8 w-[500px] space-y-6 shadow-xl relative">
            <button
              onClick={() => setShowBatchModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-center text-indigo-600">
              Add New Batch
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 mb-1">
                  Enter Batch Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={btch.batchName}
                  onChange={(e) =>
                    setBtch({ ...btch, batchName: e.target.value })
                  }
                />
              </div>
            </div>
            <button
              onClick={confirmBatchAdditionHandler}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
            >
              Add Batch
            </button>
          </div>
        </div>
      )}
    </>
  );
}
