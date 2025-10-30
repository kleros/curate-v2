import React from "react";
import { Button } from "@kleros/ui-components-library";

interface ILightButton {
  text: string;
  Icon?: React.FC<React.SVGAttributes<SVGElement>>;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
  isMobileNavbar?: boolean;
}

const LightButton: React.FC<ILightButton> = ({ text, Icon, onClick, disabled, className, isMobileNavbar }) => (
  <Button
    variant="primary"
    small
    className={
      "transition duration-100 bg-transparent p-2 rounded-[7px] landscape-900:[&_button-svg]:mr-0" +
      "[&_button-text]:text-KlerosUIComponentsPrimaryText [&_button-text]:font-normal" +
      `[&_button-svg]:${isMobileNavbar ? "fill-KlerosUIComponentsSecondaryText" : "fill-white-75"}` +
      `hover:[&_button-svg]:${
        isMobileNavbar ? "fill-KlerosUIComponentsPrimaryText" : "fill-white"
      } hover:bg-white-low-opacity-strong` +
      `${className}`
    }
    {...{ text, Icon, onClick, disabled }}
  />
);

export default LightButton;
