import React from "react";

const AddBatchModal = ({
  show,
  onClose,
  onSubmit,
  batchForm,
  onInputChange,
  loading,
}) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] flex items-center justify-center z-50">
      <div className="bg-white rounded-xl px-16 py-12 w-full max-w-md relative">
        <button
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 text-xl cursor-pointer"
          onClick={onClose}
        >
          ❌
        </button>
        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-500">
          Add New Batch
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block text-gray-500 text-lg font-medium">
            Enter Batch Name
          </label>
          <input
            type="text"
            name="title"
            placeholder="Batch Name"
            value={batchForm.title}
            onChange={onInputChange}
            className={`transition-3d relative block w-full h-12 px-3 py-2 border-2 ${"border-gray-300"} placeholder-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-400 focus:border-indigo-400 focus:z-10 sm:text-lg`}
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-xl text-lg font-semibold mt-4 hover:bg-indigo-700 transition"
            disabled={loading}
          >
            Add Batch
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBatchModal;
