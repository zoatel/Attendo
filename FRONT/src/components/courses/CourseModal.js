"use client";

import React, { useState } from "react";
import useContextCustomHook from "@/components/globalcontext";

export default function CourseModal() {
  const { courses, setCourses, showModal, setShowModal } =
    useContextCustomHook();
  const [course, setCourse] = useState({
    courseImg: "",
    courseName: "",
    studentsNo: 0,
    courseId: -1,
    courseBatch: -1,
  });

  // Handlers
  function confirmCourseAdditionHandler() {
    setCourse({
      ...course,
      courseId: courses[courses.length - 1].courseId + 1,
    });

    setCourses([...courses, course]);

    setCourse({
      courseImg: "",
      courseName: "",
      studentsNo: 0,
      courseId: -1,
      courseBatch: -1,
    });
    setShowModal(() => false);
  }

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.7)] ">
          <div className="bg-white rounded-xl p-8 w-[500px] h-[700px] space-y-6 shadow-xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-center text-indigo-600">
              Add New Course
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 mb-1">Course Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={course.courseName}
                  onChange={(e) =>
                    setCourse({ ...course, courseName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Course batch</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={course.courseBatchId}
                  onChange={(e) =>
                    setCourse({
                      ...course,
                      courseBatchId: parseInt(e.target.value),
                    })
                  }
                >
                  <option value="">Select a batch</option>
                  {courses.map((course) => {
                    return (
                      <React.Fragment key={course.courseId}>
                        <option value={course.courseBatchId}>
                          {course.courseBatchId}
                        </option>
                      </React.Fragment>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Classroom</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={course.courseClassroom}
                  onChange={(e) =>
                    setCourse({
                      ...course,
                      courseClassroom: parseInt(e.target.value),
                    })
                  }
                >
                  <option value="">Select a Classroom</option>
                  {courses.map((course) => {
                    return (
                      <React.Fragment key={course.courseId}>
                        <option value={course.courseClassroom}>
                          {course.courseClassroom}
                        </option>
                      </React.Fragment>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-gray-600 mb-1">
                  Course Image URL
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={course.courseImg}
                  onChange={(e) =>
                    setCourse({ ...course, courseImg: e.target.value })
                  }
                />
              </div>
            </div>
            <button
              onClick={confirmCourseAdditionHandler}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
            >
              Add Course
            </button>
          </div>
        </div>
      )}
    </>
  );
}
