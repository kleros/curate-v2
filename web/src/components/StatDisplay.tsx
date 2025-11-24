import React from "react";
import clsx from "clsx";
import { cn } from "src/utils";

export type IColors = "green" | "blue" | "purple" | "orange";
interface IStatDisplay {
  title: string;
  text: string | React.ReactNode;
  subtext: string | React.ReactNode;
  icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  color: IColors;
}

const landscapeMarginBottomCalc = "lg:mb-[calc(16px+(30-16)*(min(max(100vw,375px),1250px)-375px)/(1250-375))]";

const StatDisplay: React.FC<IStatDisplay> = ({ title, text, subtext, icon: Icon, color, ...props }) => {
  return (
    <div className={clsx("flex items-center gap-2 max-w-[192px]", landscapeMarginBottomCalc)} {...props}>
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
        <h1 className="m-0">{text}</h1>
        <label className="text-xs">{subtext}</label>
      </div>
    </div>
  );
};

export default StatDisplay;
