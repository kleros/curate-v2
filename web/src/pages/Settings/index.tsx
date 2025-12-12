import React from "react";
import { Route, Routes } from "react-router-dom";
import EmailConfirmation from "./EmailConfirmation";
import clsx from "clsx";

const Settings: React.FC = () => {
  return (
    <div
      className={clsx(
        "w-full max-w-landscape my-0 mx-auto pt-8 pb-10 px-4 bg-klerosUIComponentsLightBackground",
        "lg:px-fluid-0-32 lg:pt-12 lg:pb-16"
      )}
    >
      <Routes>
        <Route path="email-confirmation" element={<EmailConfirmation />} />
      </Routes>
    </div>
  );
};

export default Settings;
