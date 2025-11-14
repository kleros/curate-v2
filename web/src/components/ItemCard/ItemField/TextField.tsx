import React from "react";
import WithHelpTooltip from "components/WithHelpTooltip";
import TruncatedText from "components/TruncatedText";

export interface ITextField {
  value: string;
  detailed?: boolean;
  label?: string;
}
const TextField: React.FC<ITextField> = ({ value, detailed, label }) => {
  return (
    <p className="m-0">
      {detailed ? (
        <WithHelpTooltip tooltipMsg={label ?? ""}>{value}</WithHelpTooltip>
      ) : (
        <TruncatedText text={value} maxLength={100} />
      )}
    </p>
  );
};

export default TextField;
