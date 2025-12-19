import React from "react";
import WithHelpTooltip from "components/WithHelpTooltip";

export interface INumberField {
  value: string;
  detailed?: boolean;
  label?: string;
  description: string;
}
const NumberField: React.FC<INumberField> = ({ value, detailed, label, description }) => {
  return (
    <p className="flex gap-2 items-center">
      {detailed ? (
        <>
          {label}: <WithHelpTooltip tooltipMsg={description ?? ""}>{value}</WithHelpTooltip>
        </>
      ) : (
        <WithHelpTooltip tooltipMsg={label ?? ""}>{value}</WithHelpTooltip>
      )}
    </p>
  );
};

export default NumberField;
