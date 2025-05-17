import React from "react";

const AddCourseModal = ({
  show,
  onClose,
  onSubmit,
  form,
  onInputChange,
  loading,
  allBatches,
  classrooms,
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
          Add New Course
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Course Name"
            value={form.title}
            onChange={onInputChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          {/* Batch Dropdown */}
          <select
            name="batch"
            value={form.batch}
            onChange={onInputChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="" disabled>
              Select Batch
            </option>
            {allBatches.map((batch) => (
              <option key={batch.id} value={batch.id}>
                {batch.title}
              </option>
            ))}
          </select>
          {/* Classroom Dropdown */}
          <select
            name="classroom"
            value={form.classroom}
            onChange={onInputChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="" disabled>
              Select Classroom
            </option>
            {classrooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.hallName} (Node: {room.nodeID})
              </option>
            ))}
          </select>
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={onInputChange}
            className="w-full border rounded px-3 py-2"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded mt-4 hover:bg-indigo-700 transition"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Course"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCourseModal;
