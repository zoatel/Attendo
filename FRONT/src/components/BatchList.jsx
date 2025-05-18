import React from "react";

const BatchList = ({
  batches,
  setActiveBatch,
  setShowBatchModal,
  showBatchModal,
  batchForm,
  handleBatchInputChange,
  handleAddBatch,
  loading,
}) => (
  <>
    <div className="flex flex-wrap gap-3 ">
      {batches.map((batch) => (
        <div
          key={batch.id}
          className="w-56 h-18 bg-white border-2 relative text-lg font-semibold text-gray-400 hover:text-gray-700 border-gray-200 rounded-2xl flex flex-col items-center justify-center shadow cursor-pointer  hover:bg-indigo-50 hover:border-indigo-300 transition-3d"
          onClick={() => setActiveBatch(batch)}
        >
          {batch.title}
        </div>
      ))}
      {/* Add Batch Card */}
      <div
        className="w-56 h-18 flex items-center justify-center border-2 border-gray-200 bg-gray-100 rounded-2xl cursor-pointer text-5xl leading-none text-white hover:bg-indigo-200 hover:border-indigo-400 transition"
        onClick={() => setShowBatchModal(true)}
      >
        <span className="relative top-[-5px]">+</span>
      </div>
    </div>
  </>
);

export default BatchList;
