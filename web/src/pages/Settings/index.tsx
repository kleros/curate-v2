import React from "react";
import { Route, Routes } from "react-router-dom";
import EmailConfirmation from "./EmailConfirmation";
import { cn } from "~src/utils";

const landscapePaddingInlineCalc = "lg:px-[calc(0px+(132-0)*(min(max(100vw,375px),1250px)-375px)/(1250-375))]";

const Settings: React.FC = () => {
  return (
    <div
      className={cn(
        "w-full max-w-landscape my-0 mx-auto pt-8 pb-10 px-4 bg-klerosUIComponentsLightBackground",
        "lg:pt-12 lg:pb-16",
        landscapePaddingInlineCalc
      )}
    >
      <Routes>
        <Route path="email-confirmation" element={<EmailConfirmation />} />
      </Routes>
    </div>
  );
};

export default Settings;
