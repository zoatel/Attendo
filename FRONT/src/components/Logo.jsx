import React from "react";

const Logo = () => (
  <div className="flex flex-col items-center mb-2">
    <img
      src="/logo.png"
      alt="Attendo Logo"
      className="mb-2"
      style={{ maxWidth: "auto", height: "auto", width: "auto" }}
      draggable={false}
    />
  </div>
);

export default Logo;
