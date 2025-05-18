import React from "react";

const BGHome = () => (
  <>
    <img
      src="/tri.png"
      alt="custom shape"
      className="absolute top-37 right-80 w-18 h-18 animate-float-horizontal opacity-60  "
    />
    <img
      src="/corner.png"
      alt="custom shape"
      className="absolute top-0 right-0 w-48 h-48  opacity-60 "
    />
    <img
      src="/corner.png"
      alt="custom shape"
      className="absolute bottom-0 right-0 w-24 h-24 rotate-90 opacity-60 "
    />

    <div className="absolute top-[550px] right-[470px] w-24 h-24 bg-gradient-to-tr from-green-200 to-green-300 opacity-75 animate-pulse blur-lg pentagon -rotate-12 animate-float" />

    <div className="absolute  top-24 left-1/2 rounded-full w-12 h-12 bg-gradient-to-br from-pink-300 to-fuchsia-500 rotate-12 opacity-70  animate-float-horizontal blur-[1px]" />

    {/* شكل 2 - مربع بدوران */}
    <div
      className={` absolute bottom-[180px] left-[760px] w-[100px] h-[100px] gra bg-gradient-to-br  from-green-200 to-blue-300 rounded-lg opacity-100 rotate-45  animate-spin-slow blur-[1px]`}
    />

    {/* شكل 3 - دائرة أسفل يمين */}
    <div className="absolute bottom-10 right-20 w-40 h-40 bg-gradient-to-br from-yellow-100 to-pink-200 rounded-full opacity-100 animate-float blur-[1px]" />

    {/* شكل 5 - مستطيل مائل */}
    <div className="absolute -bottom-44 left-80 w-60 h-72 border-2 border-blue-300 rotate-12 opacity-100 animate-float blur-[1px]" />

    {/* شكل 6 - بيضاوي متدرج */}
  </>
);

export default BGHome;
