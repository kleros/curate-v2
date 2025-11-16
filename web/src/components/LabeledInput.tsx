import React, { ReactNode } from "react";
import { cn, isUndefined } from "utils/index";
import WithHelpTooltip from "./WithHelpTooltip";
import { TextField } from "@kleros/ui-components-library";

const ElementWrapper: React.FC<{ children: ReactNode; alignRight?: boolean }> = ({ children, alignRight = false }) => {
  return <div className={cn("flex items-start w-full", alignRight ? "justify-end" : "justify-start")}>{children}</div>;
};

const Label: React.FC<{
  label: string;
  tooltipMsg?: string;
  alignRight?: boolean;
  top?: boolean;
}> = ({ label, tooltipMsg, alignRight, top }) => {
  return (
    <div className={cn(top ? "mb-3" : "mt-3")}>
      {tooltipMsg ? (
        <WithHelpTooltip tooltipMsg={tooltipMsg} place="top">
          <label
            className={cn(
              alignRight ? "text-end float-right" : "text-start float-left",
              top ? "text-klerosUIComponentsPrimaryText" : "text-klerosUIComponentsSecondaryText"
            )}
          >
            {label}
          </label>
        </WithHelpTooltip>
      ) : (
        <label
          className={cn(
            alignRight ? "text-end float-right" : "text-start float-left",
            top ? "text-klerosUIComponentsPrimaryText" : "text-klerosUIComponentsSecondaryText"
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
};

interface LabelOptions {
  text: React.ReactElement | string;
  tooltipMsg?: string;
  tooltipPlace?: "top" | "bottom" | "left" | "right";
}
interface ILabeledInput {
  topLeftLabel?: LabelOptions;
  topRightLabel?: LabelOptions;
  bottomLeftLabel?: LabelOptions;
  bottomRightLabel?: LabelOptions;
}

const LabeledInput: React.FC<ILabeledInput> = (props) => {
  const { topLeftLabel, topRightLabel, bottomLeftLabel, bottomRightLabel } = props;

  return (
    <div className="grid auto-cols-auto w-full h-min">
      {/* top left label */}
      {!isUndefined(topLeftLabel) && typeof topLeftLabel.text === `string` ? (
        <Label label={topLeftLabel.text} tooltipMsg={topLeftLabel.tooltipMsg} top />
      ) : null}

      {!isUndefined(topLeftLabel) && isReactElement(topLeftLabel.text) ? (
        <ElementWrapper>{topLeftLabel.text}</ElementWrapper>
      ) : null}

      {/* top right label */}
      {!isUndefined(topRightLabel) && typeof topRightLabel.text === `string` ? (
        <Label label={topRightLabel.text} alignRight tooltipMsg={topRightLabel.tooltipMsg} top />
      ) : null}

      {!isUndefined(topRightLabel) && isReactElement(topRightLabel.text) ? (
        <ElementWrapper alignRight>{topRightLabel.text}</ElementWrapper>
      ) : null}

      <TextField {...props} className="col-span-2 w-full" />

      {/* bottom left label */}
      {!isUndefined(bottomLeftLabel) && typeof bottomLeftLabel.text === `string` ? (
        <Label label={bottomLeftLabel.text} tooltipMsg={bottomLeftLabel.tooltipMsg} />
      ) : null}

      {!isUndefined(bottomLeftLabel) && isReactElement(bottomLeftLabel.text) ? (
        <ElementWrapper>{bottomLeftLabel.text}</ElementWrapper>
      ) : null}

      {/* bottom right label */}
      {!isUndefined(bottomRightLabel) && typeof bottomRightLabel.text === `string` ? (
        <Label label={bottomRightLabel.text} alignRight tooltipMsg={bottomRightLabel.tooltipMsg} />
      ) : null}

      {!isUndefined(bottomRightLabel) && isReactElement(bottomRightLabel.text) ? (
        <ElementWrapper alignRight>{bottomRightLabel.text}</ElementWrapper>
      ) : null}
    </div>
  );
};

function isReactElement(value: string | React.ReactElement): value is React.ReactElement {
  return React.isValidElement(value);
}
export default LabeledInput;
