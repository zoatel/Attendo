"use client";

import BG from "@/components/bg";
import SideMenu from "@/components/sidemenu/Sidemenu";
import React from "react";
import ClassHall from "@/components/class/ClassHall";
import { useParams } from "next/navigation";

export default function ClassPage() {
  const { clsid } = useParams();

  if (!clsid) {
    return <p>Loading...</p>;
  }
  // Handlers

  return (
    <>
      <div className=" w-full h-screen flex py-10 px-20 justify-center items-center relative ">
        <BG />
        <div className="w-full h-full flex flex-row justify-center items-center bg-amber-700 rounded-2xl overflow-clip shadow-xl">
          <SideMenu />
          <ClassHall clsId={clsid} />
        </div>
      </div>
    </>
  );
}
