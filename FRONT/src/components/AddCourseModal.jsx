import Select from "react-select";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FiFile } from "react-icons/fi";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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

  const classroomOptions = classrooms.map((room) => ({
    value: room.id,
    label: `${room.hallName} (Node: ${room.nodeID})`,
  }));

  const batchOptions = allBatches.map((batch) => ({
    value: batch.id,
    label: batch.title,
  }));

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const storageRef = ref(
          storage,
          `courseImages/${file.name}-${Date.now()}`
        );
        try {
          // رفع الصورة
          await uploadBytes(storageRef, file);
          // جلب رابط الصورة
          const downloadURL = await getDownloadURL(storageRef);

          onInputChange({
            target: { name: "image", value: downloadURL },
          });
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
    },
    [onInputChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: false,
  });

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] flex items-center justify-center z-50">
      <div className="bg-white rounded-xl px-16 py-12 w-full max-w-md relative">
        <button
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 text-xl cursor-pointer"
          onClick={() => {
            onInputChange({
              target: { name: "image", value: "" },
            });
            onClose();
          }}
        >
          ❌
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
            className="transition-3d block w-full h-12 px-3 py-2 border-2 border-gray-300 placeholder-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-400 focus:border-indigo-400 sm:text-lg"
            required
          />

          {/* Batch Dropdown with react-select */}
          <div className="text-black text-lg ">
            <Select
              name="batch"
              options={batchOptions}
              value={batchOptions.find((opt) => opt.value === form.batch)}
              onChange={(selectedOption) =>
                onInputChange({
                  target: { name: "batch", value: selectedOption.value },
                })
              }
              placeholder="Select Batch"
              styles={{
                control: (base) => ({
                  ...base,
                  height: "48px",
                  borderRadius: "0.5rem",
                  borderColor: "#d1d5dc",
                  boxShadow: "none",
                  borderWidth: "2px",
                  "&:hover": {
                    borderColor: "#7c86ff",
                  },
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? "#eef2ff" : "#fff",
                  color: "#1f2937",
                }),
              }}
              required
            />
          </div>

          {/* Classroom Dropdown with react-select */}
          <div className="text-black text-lg">
            <Select
              name="classroom"
              options={classroomOptions}
              value={classroomOptions.find(
                (opt) => opt.value === form.classroom
              )}
              onChange={(selectedOption) =>
                onInputChange({
                  target: { name: "classroom", value: selectedOption.value },
                })
              }
              placeholder="Select Classroom"
              styles={{
                control: (base) => ({
                  ...base,
                  height: "48px",
                  borderRadius: "0.5rem",
                  borderColor: "#d1d5dc",
                  borderWidth: "2px",
                  boxShadow: "none",
                  "&:hover": {
                    borderColor: "#7c86ff",
                  },
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? "#eef2ff" : "#fff",
                  borderColor: state.isFocused ? "#7c86ff" : "#d1d5dc",
                  color: "#7c86ff",
                }),
              }}
              required
            />
          </div>

          {/* <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={onInputChange}
            className="transition-3d block w-full h-12 px-3 py-2 border-2 border-gray-300 placeholder-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-400 focus:border-indigo-400 sm:text-lg"
          /> */}

          <div
            {...getRootProps()}
            className="border-2  border-dashed border-gray-400 h-44 p-5 flex flex-col items-center justify-center text-center rounded-lg cursor-pointer hover:border-indigo-400 transition"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="text-indigo-500">Drop the image here ...</p>
            ) : form.image ? (
              <img
                src={form.image}
                alt="Preview"
                className="h-full object-contain rounded"
              />
            ) : (
              <>
                <FiFile className="text-5xl text-gray-400 mb-2" />
                <p className="text-gray-500">
                  Drag & drop course image here, or click to select
                </p>
              </>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-xl text-lg font-semibold mt-4 hover:bg-indigo-700 transition"
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
