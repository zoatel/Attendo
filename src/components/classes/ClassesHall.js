"use client";

import { useRouter } from "next/navigation";
import React from "react";
import useContextCustomHook from "@/components/globalcontext";

export default function ClassesHall({ id }) {
  const router = useRouter();
  const { classes, courses, setShowClassModal, ShowClassModal } =
    useContextCustomHook();
  const Course = courses.find((c) => c.courseId === Number(id));

  if (!Course) {
    return <p>Course not found!</p>;
  }

  // Handlers
  const goToRouterHandler = (path) => {
    router.push(path);
  };

  function addClassHandler() {
    setShowClassModal(() => true);
    console.log(ShowClassModal);
  }

  return (
    <>
      <div className="h-full w-full bg-clr-hall px-24 py-12 flex flex-col justify-center items-start gap-y-8">
        <div className="h-fit w-full flex flex-col justify-center items-start gap-y-2 ">
          <div className="capitalize text-md font-medium text-gray-500 cursor-pointer">
            <span
              className="hover:underline"
              onClick={() => {
                goToRouterHandler("/home");
              }}
            >
              courses
            </span>
            {" >> "}
            <span
              className="hover:underline"
              onClick={() => {
                goToRouterHandler(`/home/${Course.courseId}`);
              }}
            >
              {Course.courseName}
            </span>
          </div>
          <div className="capitalize text-4xl font-bold ">Classes</div>
        </div>
        <div className="w-full h-full rounded-2xl bg-white p-16 grid grid-cols-4 grid-rows-5 gap-y-8 ">
          {classes.map((cls) => {
            return (
              <React.Fragment key={cls.classId}>
                <div
                  className="w-64 h-20 border-2 border-gray-100 rounded-xl justify-center items-center flex flex-col gap-4 hover:bg-indigo-100 transition-3d cursor-pointer hover:border-indigo-600"
                  onClick={() => {
                    goToRouterHandler(
                      `/home/${Course.courseId}/${cls.classId}`
                    );
                  }}
                >
                  <div className="text-lg font-medium text-gray-700 capitalize">
                    {cls.className ? cls.className : `class ${cls.classNo}`}
                  </div>
                </div>
              </React.Fragment>
            );
          })}

          <div
            className="w-64 h-20 border-2 border-gray-100 rounded-xl bg-gray-100 text-7xl text-white flex justify-center items-center text-center cursor-pointer hover:bg-indigo-100 hover:border-indigo-600 transition-3d"
            onClick={addClassHandler}
          >
            +
          </div>
        </div>
      </div>
    </>
  );
}
