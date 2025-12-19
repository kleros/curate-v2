import React from "react";
import PreviousButton from "./PreviousButton";
import NextButton from "./NextButton";
import SubmitItemButton from "./SubmitItemButton";

interface NavigationButtonsProps {
  prevRoute?: string;
  nextRoute?: string;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ prevRoute, nextRoute }) => {
  return (
    <div className="flex flex-wrap justify-center gap-6 mt-fluid-32-24">
      {prevRoute && <PreviousButton prevRoute={prevRoute} />}
      {prevRoute === "../policy" ? <SubmitItemButton /> : <NextButton nextRoute={nextRoute} />}
    </div>
  );
};

export default NavigationButtons;
