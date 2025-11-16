import React from "react";

export const ErrorButtonMessage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex gap-1 items-center justify-center m-3 text-klerosUIComponentsError text-sm">{children}</div>
  );
};
