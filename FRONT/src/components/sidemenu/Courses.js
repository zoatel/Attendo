"use client";
import React, { useState } from "react";
import useContextCustomHook from "../globalcontext";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Courses({}) {
  const router = useRouter();
  const { courses } = useContextCustomHook();
  const [showCourses, setShowCourses] = useState(false);

  // Handlers
  const goToRouterHandler = (path) => {
    router.push(path);
  };

  return (
    <div className="w-full">
      <div
        onClick={() => setShowCourses(!showCourses)}
        className={`flex justify-between items-center px-8 py-2 text-xl font-medium ${
          !showCourses
            ? "bg-gray-50 text-gray-600"
            : "bg-gray-100 text-indigo-600"
        }  cursor-pointer transition-3d hover:bg-gray-100 hover:text-indigo-600`}
      >
        <span>Courses</span>
        {showCourses ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {showCourses && (
        <div className="bg-gray-50 overflow-hidden">
          {courses.map((course) => {
            return (
              <React.Fragment key={course.courseId}>
                <div
                  className="flex flex-row justify-center items-center py-2 hover:border-l-4 hover:bg-indigo-50 hover:border-b-indigo-600 hover:text-indigo-600 text-gray-500 text-lg font-medium w-full transition-1d capitalize cursor-pointer"
                  onClick={() => {
                    goToRouterHandler(`/home/${course.courseId}`);
                  }}
                >
                  {course.courseName}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}
