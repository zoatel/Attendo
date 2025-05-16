"use client";
import React, { useState, useEffect } from "react";
import useContextCustomHook from "@/components/globalcontext";

export default function ClassModal() {
  const { classes, setClasses, showClassModal, setShowClassModal } =
    useContextCustomHook();
  const [cls, setCls] = useState({
    classNo: 0,
    classId: -1,
    className: "",
  });

  function confirmClassAdditionHandler() {
    const lastClass = classes[classes.length - 1];

    const newClass = {
      classNo: lastClass ? lastClass.classNo + 1 : 1,
      classId: lastClass ? lastClass.classId + 1 : 0,
      className: cls.className,
    };

    setClasses([...classes, newClass]);

    setCls({
      classNo: 0,
      classId: -1,
      className: "",
    });

    setShowClassModal(false);
  }

  // Handlers

  return (
    <>
      {showClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.7)] ">
          <div className="bg-white rounded-xl p-8 w-[500px] space-y-6 shadow-xl relative">
            <button
              onClick={() => setShowClassModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-center text-indigo-600">
              Add New Class
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 mb-1">
                  Enter Class Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={cls.className}
                  onChange={(e) =>
                    setCls({ ...cls, className: e.target.value })
                  }
                />
              </div>
            </div>
            <button
              onClick={confirmClassAdditionHandler}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
            >
              Add Class
            </button>
          </div>
        </div>
      )}
    </>
  );
}
