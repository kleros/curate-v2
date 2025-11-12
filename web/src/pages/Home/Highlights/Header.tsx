import clsx from "clsx";
import React from "react";
import PaperIcon from "svgs/icons/paper.svg";

const Header: React.FC = () => {
  return (
    <div
      className={clsx(
        "flex justify-center items-center gap-2",
        "bg-klerosUIComponentsWhiteBackground border-t-[3px] border-t-klerosUIComponentsSecondaryPurple rounded-t-[3px]"
      )}
    >
      <div
        className={clsx(
          "flex items-center justify-center",
          "[&_svg]:h-6 [&_svg]:w-6 [&_svg]:fill-klerosUIComponentsSecondaryPurple"
        )}
      >
        <PaperIcon />
      </div>
      <p className="my-4">Highlights</p>
    </div>
  );
};

export default Header;
