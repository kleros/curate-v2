import React from "react";
import WithHelpTooltip from "components/WithHelpTooltip";

export interface IBooleanField {
  value: string;
  label: string;
  detailed?: boolean;
  description?: string;
}
const BooleanField: React.FC<IBooleanField> = ({ value, label, detailed, description }) => {
  const text = value ? `true` : `false`;
  return (
    <p className="flex gap-2 items-center m-0">
      {detailed ? (
        <>
          {label}: <WithHelpTooltip tooltipMsg={description ?? ""}>{text}</WithHelpTooltip>
        </>
      ) : (
        <WithHelpTooltip tooltipMsg={label ?? ""}>{text}</WithHelpTooltip>
      )}
    </p>
  );
};

export default BooleanField;
