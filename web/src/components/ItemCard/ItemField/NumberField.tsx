import React from "react";
import styled from "styled-components";
import WithHelpTooltip from "components/WithHelpTooltip";

const Container = styled.p`
  margin: 0px;
  display: flex;
  gap: 8px;
  align-items: center;
`;

export interface INumberField {
  value: string;
  detailed?: boolean;
  label?: string;
  description: string;
}
const NumberField: React.FC<INumberField> = ({ value, detailed, label, description }) => {
  return (
    <Container>
      {detailed ? (
        <>
          {label}: <WithHelpTooltip tooltipMsg={description ?? ""}>{value}</WithHelpTooltip>
        </>
      ) : (
        <WithHelpTooltip tooltipMsg={label ?? ""}>{value}</WithHelpTooltip>
      )}
    </Container>
  );
};

export default NumberField;
