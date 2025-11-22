import React from "react";

import { useNavigate } from "react-router-dom";

import { Button } from "@kleros/ui-components-library";

import Arrow from "svgs/icons/arrow-left.svg";
import PaperClip from "svgs/icons/paperclip.svg";

import { responsiveSize } from "styles/responsiveSize";
import clsx from "clsx";

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate(-1);
  };

  return (
    <div className="flex justify-between items-center w-full mb-9">
      <div className="flex flex-row items-center gap-2">
        <PaperClip
          width={responsiveSize(16, 24)}
          height={responsiveSize(16, 24)}
          className="fill-klerosUIComponentsSecondaryPurple/69"
        />
        <h1 className="m-0" style={{ fontSize: responsiveSize(20, 24) }}>
          Attachment File
        </h1>{" "}
      </div>
      <Button
        className={clsx(
          "bg-transparent p-0",
          "[&_.button-text]:text-klerosUIComponentsPrimaryBlue [&_.button-text]:font-normal",
          "[&_.button-svg_path]:fill-klerosUIComponentsPrimaryBlue",
          "focus:bg-transparent hover:bg-transparent",
          "focus:[&_.button-svg_path]:fill-klerosUIComponentsSecondaryBlue hover:[&_.button-svg_path]:fill-klerosUIComponentsSecondaryBlue",
          "focus:[&_.button-text]:text-klerosUIComponentsSecondaryBlue hover:[&_.button-text]:text-klerosUIComponentsSecondaryBlue"
        )}
        text="Return"
        Icon={Arrow}
        onClick={handleReturn}
      />
    </div>
  );
};

export default Header;
