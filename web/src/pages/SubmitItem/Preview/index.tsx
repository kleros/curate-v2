import React from "react";
import { responsiveSize } from "styles/responsiveSize";
import { Card } from "@kleros/ui-components-library";
import NavigationButtons from "../NavigationButtons";
import ListDisplay from "./ListDisplay";
import ItemDisplay from "./ItemDisplay";

const Preview: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-full py-0" style={{ paddingInline: responsiveSize(10, 130) }}>
      <h2 className="text-center font-semibold mb-8 w-[84vw] lg:w-auto">Preview</h2>
      <Card
        className="relative flex flex-col gap-8 w-full h-auto min-h-[100px]"
        style={{
          marginBottom: responsiveSize(0, 16),
          paddingBlock: responsiveSize(24, 48),
          paddingInline: responsiveSize(24, 32),
        }}
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
