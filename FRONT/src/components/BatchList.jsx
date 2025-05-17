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
    <div className="flex flex-wrap gap-8">
      {batches.map((batch) => (
        <div
          key={batch.id}
          className="w-64 h-16 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow text-lg font-semibold cursor-pointer hover:bg-indigo-50 transition"
          onClick={() => setActiveBatch(batch)}
        >
          {batch.title}
        </div>
      ))}
      {/* Add Batch Card */}
      <div
        className="w-64 h-16 flex items-center justify-center border-2 border-indigo-200 bg-indigo-50 rounded-lg cursor-pointer text-4xl text-indigo-300 hover:bg-indigo-100 transition"
        onClick={() => setShowBatchModal(true)}
      >
        <span>+</span>
      </div>
    </div>
    {/* Add Batch Modal */}
    {showBatchModal && (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 w-full max-w-md relative">
          <button
            className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-xl"
            onClick={() => setShowBatchModal(false)}
          >
            &times;
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
    )}
  </>
);

export default BatchList;
