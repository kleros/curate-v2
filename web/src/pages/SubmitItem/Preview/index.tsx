import React from "react";
import { Card } from "@kleros/ui-components-library";
import NavigationButtons from "../NavigationButtons";
import ListDisplay from "./ListDisplay";
import ItemDisplay from "./ItemDisplay";
import clsx from "clsx";

const Preview: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-full py-0 px-fluid-10-130">
      <h2 className="text-2xl text-center font-semibold mb-8 w-[84vw] lg:w-auto">Preview</h2>
      <Card
        className={clsx(
          "relative flex flex-col gap-8 w-full h-auto min-h-[100px]",
          "border-dashed border-klerosUIComponentsPrimaryBlue bg-klerosUIComponentsMediumBlue",
          "mb-fluid-0-16 py-fluid-24-48 px-fluid-24-32"
        )}
      >
        <ListDisplay />
        <ItemDisplay />
        <div className="absolute w-full h-full" />
      </Card>
      <NavigationButtons prevRoute="../policy" />
    </div>
  );
};

export default Preview;
