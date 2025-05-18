import React from "react";

const Top = () => (
  <div className="flex flex-col items-center mb-2 w-full h-fit relative">
    <img
      src="/top.png"
      alt="Attendo Logo top"
      className="mb-2"
      style={{ maxWidth: "auto", height: "auto", width: "auto" }}
      draggable={false}
    />
    <img
      src="/tri.png"
      alt="custom shape"
      className="absolute top-[20px] right-8 w-5 h-5 animate-float-top-horizontal opacity-80 "
    />
    <img
      src="/square.png"
      alt="custom shape"
      className="absolute bottom-[35px] left-7 w-4 h-4 animate-float-top opacity-80 "
    />
  </div>
);

export default Top;
