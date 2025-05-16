"use client";

import { useRouter } from "next/navigation";
import React from "react";
import useContextCustomHook from "@/components/globalcontext";

export default function ClassHall({ clsId }) {
  const router = useRouter();
  const { courseId, classes, courses, setShowModal } = useContextCustomHook();
  const Class = classes.find((c) => c.classId === Number(clsId));

  if (!Class) {
    return <p>Class not found!</p>;
  }
  const Course = courses.find((c) => c.courseId === Number(courseId));

  if (!Course) {
    return <p>Course not found!</p>;
  }

  // Handlers
  const goToRouterHandler = (path) => {
    router.push(path);
  };

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
            {" >> "}
            <span
              className="hover:underline"
              onClick={() => {
                goToRouterHandler(`/home/${Course.courseId}/${Class.classId}`);
              }}
            >
              class {Class.classNo}
            </span>
          </div>
          <div className="capitalize text-4xl font-bold ">
            class {Class.classNo}
          </div>
        </div>
        <div className="w-full h-full rounded-2xl bg-white p-16 grid grid-cols-4 grid-rows-5 gap-y-8 "></div>
      </div>
    </>
  );
}
