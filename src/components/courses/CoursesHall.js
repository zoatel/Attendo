"use client";

import { useRouter } from "next/navigation";
import React from "react";
import useContextCustomHook from "@/components/globalcontext";

export default function CourseHall() {
  const router = useRouter();
  const { courses, setShowModal } = useContextCustomHook();

  // Handlers
  const goToRouterHandler = (path) => {
    router.push(path);
  };

  function addCourseHandler() {
    setShowModal(() => true);
  }

  return (
    <>
      <div className="h-full w-full bg-clr-hall px-24 py-12 flex flex-col justify-center items-start gap-y-8">
        <div className="h-fit w-full flex flex-col justify-center items-start gap-y-2 ">
          <div className="capitalize text-md font-medium text-gray-500 cursor-pointer hover:underline">
            courses
          </div>
          <div className="capitalize text-4xl font-bold ">Courses</div>
        </div>
        <div className="w-full h-full rounded-2xl bg-white p-20 grid grid-cols-5 grid-rows-2 gap-x-10  ">
          {courses.map((course) => {
            return (
              <React.Fragment key={course.courseId}>
                <div
                  className="w-52 h-52 border-2 border-gray-100 rounded-xl justify-center items-center flex flex-col gap-4 hover:bg-indigo-100 transition-3d cursor-pointer hover:border-indigo-600"
                  onClick={() => {
                    goToRouterHandler(`/home/${course.courseId}`);
                  }}
                >
                  <div className="w-fit h-fit rounded-full overflow-clip border-2 border-indigo-700 ">
                    <img src={course.courseImg} alt="" className="w-24 h-24" />
                  </div>
                  <div className="flex justify-center items-center flex-col">
                    <div className="text-lg font-bold text-gray-700">
                      {course.courseName}
                    </div>
                    <div className="text-md text-gray-400">
                      contain {course.studentsNo} student
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}

          <div
            className="w-52 h-52 border-2 border-gray-50 rounded-xl bg-gray-50 text-9xl text-white flex justify-center items-center text-center cursor-pointer hover:bg-indigo-100 hover:border-indigo-600 transition-3d"
            onClick={addCourseHandler}
          >
            +
          </div>
        </div>
      </div>
    </>
  );
}
