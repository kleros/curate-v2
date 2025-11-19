import React from "react";
import { responsiveSize } from "styles/responsiveSize";
import { Card } from "@kleros/ui-components-library";
import ListPageDisplay from "./ListPageDisplay";
import HomePageDisplay from "./HomePageDisplay";
import clsx from "clsx";

const ListPreview: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-full gap-8 mt-6">
      <h2 className="mb-0 w-full text-center text-klerosUIComponentsSecondaryPurple">Preview</h2>
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
        <HomePageDisplay />
        <ListPageDisplay />
        <div className="absolute w-full h-full" />
      </Card>
    </div>
  );
};

export default ListPreview;
