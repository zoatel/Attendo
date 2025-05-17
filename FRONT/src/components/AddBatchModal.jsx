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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-md relative">
        <button
          className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-600">
          Add New Batch
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block text-gray-700">Enter Batch Name</label>
          <input
            type="text"
            name="title"
            placeholder="Batch Name"
            value={batchForm.title}
            onChange={onInputChange}
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
  );
};

export default AddBatchModal;
