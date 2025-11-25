import React from "react";
import { Tooltip } from "@kleros/ui-components-library";
import HelpIcon from "svgs/menu-icons/help.svg";

interface IWithHelpTooltip {
  tooltipMsg: string;
  place?: "bottom" | "left" | "right" | "top";
  children?: React.ReactNode;
}

const WithHelpTooltip: React.FC<IWithHelpTooltip> = ({ tooltipMsg, children, place }) => (
  <div className="flex items-center">
    {children}
    <Tooltip small text={tooltipMsg} {...{ place }}>
      <HelpIcon className="flex items-center fill-klerosUIComponentsSecondaryText ml-2 w-3 h-3 lg:w-3.5 lg:h-3.5" />
    </Tooltip>
  </div>
);

export default WithHelpTooltip;
