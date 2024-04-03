import React from "react";
import styled from "styled-components";
import WithHelpTooltip from "components/WithHelpTooltip";

const Container = styled.p`
  margin: 0px;
`;

export interface INumberField {
  value: string;
  detailed?: boolean;
  label?: string;
}
const NumberField: React.FC<INumberField> = ({ value, detailed, label }) => {
  return (
    <Container>{detailed ? <WithHelpTooltip tooltipMsg={label ?? ""}>{value}</WithHelpTooltip> : value}</Container>
  );
};

export default NumberField;
