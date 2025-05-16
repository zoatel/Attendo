"use client";

import BG from "@/components/bg";
import SideMenu from "@/components/sidemenu/Sidemenu";
import React from "react";
import BatchHall from "@/components/batch/BatchHall";
import CourseModal from "@/components/courses/CourseModal";

export default function BatchPage() {
  // Handlers

  return (
    <>
      <div className=" w-full h-screen flex py-10 px-20 justify-center items-center relative ">
        <BG />
        <div className="w-full h-full flex flex-row justify-center items-center bg-amber-700 rounded-2xl overflow-clip shadow-xl ">
          <SideMenu />
          <BatchHall />
        </div>

        <CourseModal />
      </div>
    </>
  );
}
