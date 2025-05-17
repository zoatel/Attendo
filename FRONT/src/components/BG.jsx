import React from "react";

const BG = () => (
  <>
    {/* Background image */}
    <img
      src="../../public/bg.png"
      alt="background"
      className="fixed inset-0 w-full h-full object-cover -z-10 opacity-60"
      draggable={false}
    />
    {/* Decorative shapes (example, adjust as needed) */}
    <div className="absolute top-20 left-10 w-24 h-24 bg-gradient-to-br from-pink-200 to-pink-400 rounded-full opacity-40 blur-2xl" />
    <div className="absolute bottom-20 left-32 w-32 h-32 bg-gradient-to-br from-green-200 to-blue-200 rounded-lg opacity-30 blur-2xl rotate-12" />
    <div className="absolute bottom-10 right-20 w-40 h-40 bg-gradient-to-br from-yellow-200 to-pink-200 rounded-full opacity-40 blur-2xl" />
    <div className="absolute top-32 right-40 w-16 h-16 border-4 border-pink-200 rounded-full opacity-40" />
    {/* Add more shapes as needed for your design */}
  </>
);

export default BG;
