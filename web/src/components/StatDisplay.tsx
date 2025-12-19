import React from "react";
import { cn } from "src/utils";

export type IColors = "green" | "blue" | "purple" | "orange";
interface IStatDisplay {
  title: string;
  text: string | React.ReactNode;
  subtext: string | React.ReactNode;
  icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  color: IColors;
}

const StatDisplay: React.FC<IStatDisplay> = ({ title, text, subtext, icon: Icon, color, ...props }) => {
  return (
    <div className="flex items-center gap-2 max-w-[192px] lg:mb-fluid-16-30" {...props}>
      <div
        className={cn(
          "flex items-center justify-center h-12 w-12 rounded-[50%]",
          "[&_svg]:h-5 [&_svg]:w-5",
          color === "green" && "bg-klerosUIComponentsSuccessLight [&_svg]:fill-klerosUIComponentsSuccess",
          color === "blue" && "bg-klerosUIComponentsMediumBlue [&_svg]:fill-klerosUIComponentsPrimaryBlue",
          color === "purple" && "bg-klerosUIComponentsMediumPurple [&_svg]:fill-klerosUIComponentsSecondaryPurple",
          color === "orange" && "bg-klerosUIComponentsWarningLight [&_svg]:fill-klerosUIComponentsWarning"
        )}
      >
        {<Icon />}
      </div>
      <div className="leading-5">
        <label>{title}</label>
        <h1>{text}</h1>
        <label className="text-xs">{subtext}</label>
      </div>
    </div>
  );
};

export default StatDisplay;
