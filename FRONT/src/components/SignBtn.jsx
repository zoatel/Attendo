import React from "react";

const SignBtn = ({ title }) => (
  <div className="mt-8">
    <button
      type="submit"
      className="cursor-pointer group relative w-full flex justify-center py-3 px-12 text-md capitalize font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition-3d"
    >
      {title}
    </button>
  </div>
);

export default SignBtn;
