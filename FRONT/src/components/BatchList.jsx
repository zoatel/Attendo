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
          className="w-56 h-18 bg-white border-2  text-lg font-semibold text-gray-400 hover:text-gray-700 border-gray-200 rounded-2xl flex flex-col items-center justify-center shadow cursor-pointer  hover:bg-indigo-50 hover:border-indigo-300 transition-3d"
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
    {/* Add Batch Modal
    {showBatchModal && (
      <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)]  flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 w-full max-w-md relative">
          <button
            className="absolute top-4 right-5 text-gray-400 hover:text-gray-700 text-xl cursor-pointer"
            onClick={() => setShowBatchModal(false)}
          >
            ❌
          </button>
          <h2 className="text-2xl font-bold text-center mb-6 text-indigo-600">
            Add New Batch
          </h2>
          <form onSubmit={handleAddBatch} className="space-y-4">
            <label className="block text-gray-700">Enter Batch Name</label>
            <input
              type="text"
              name="title"
              placeholder="Batch Name"
              value={batchForm.title}
              onChange={handleBatchInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded mt-4 hover:bg-indigo-700 transition"
              disabled={loading}
            >
              Add Batch
            </button>
          </form>
        </div>
      </div>
    )} */}
  </>
);

export default BatchList;
