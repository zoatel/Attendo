"use client";

import BG from "@/components/bg";
import SideMenu from "@/components/sidemenu/Sidemenu";
import React, { useEffect } from "react";
import ClassesHall from "@/components/classes/ClassesHall";
import ClassModal from "@/components/classes/ClassModal";
import { useParams } from "next/navigation";
import useContextCustomHook from "@/components/globalcontext";

export default function CoursePage() {
  const { id } = useParams();
  const { setCourseId, courses } = useContextCustomHook();

  if (!id) {
    return <p>Loading...</p>;
  }

  const Course = courses.find((c) => c.courseId === Number(id));

  if (!Course) {
    return <p>Course not found!</p>;
  }

  // Handlers
  useEffect(() => {
    setCourseId(Course.courseId);
  }, [Course]);
  return (
    <>
      <div className=" w-full h-screen flex py-10 px-20 justify-center items-center relative ">
        <BG />
        <div className="w-full h-full flex flex-row justify-center items-center bg-amber-700 rounded-2xl overflow-clip shadow-xl">
          <SideMenu />
          <ClassesHall id={id} />
        </div>
        <ClassModal />
      </div>
    </>
  );
}
