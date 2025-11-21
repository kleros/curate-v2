import React from "react";
import { responsiveSize } from "styles/responsiveSize";
import { Card } from "@kleros/ui-components-library";
import NavigationButtons from "../../NavigationButtons";
import ListDisplay from "./ListDisplay";
import ItemDisplay from "./ItemDisplay";
import clsx from "clsx";

const ItemPreview: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-8 w-full py-0" style={{ paddingInline: responsiveSize(10, 130) }}>
      <h2 className="w-full text-center text-klerosUIComponentsSecondaryPurple">Item Preview</h2>
      <Card
        className={clsx(
          "relative flex flex-col gap-8 w-full h-auto min-h-[100px]",
          "border-dashed border-klerosUIComponentsPrimaryBlue bg-klerosUIComponentsMediumBlue"
        )}
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
      <NavigationButtons prevRoute="/submit-list/fields" nextRoute="/submit-list/custom" />
    </div>
  );
};

export default ItemPreview;
