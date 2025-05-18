import React from "react";

const DeleteCourseModal = ({ show, onClose }) => {
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
          Delete Course
        </h2>
        <p className="text-gray-700 text-xl text-center font-semibold">
          كلم بودا ابعتله ايميلك يبعته لياسين يديك اكسس ع الداتا بيز وامسح من
          هناك انت
        </p>
      </div>
    </div>
  );
};

export default DeleteCourseModal;
