import React from "react";

const Input = ({
  htmlfor,
  title,
  id,
  autocomplete,
  placeholder,
  type = "text",
}) => (
  <div className="mb-4">
    <label
      htmlFor={htmlfor}
      className="block text-md font-medium text-gray-400 ml-2 mb-1"
    >
      {title}
    </label>
    <input
      id={id}
      name={id}
      type={type}
      autoComplete={autocomplete}
      required
      className="transition-3d relative block w-full h-12 px-3 py-2 border-2 border-gray-300 placeholder-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-400 focus:border-indigo-400 focus:z-10 sm:text-lg"
      placeholder={placeholder}
    />
  </div>
);

export default Input;
