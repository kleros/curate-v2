import React from "react";

export const Overlay: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className="fixed top-0 left-0 w-screen h-screen bg-black-low-opacity z-30">{children}</div>
);
