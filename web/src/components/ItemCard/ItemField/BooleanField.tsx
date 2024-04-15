import React from "react";
import styled from "styled-components";
import WithHelpTooltip from "components/WithHelpTooltip";

const Container = styled.p`
  margin: 0px;
  display: flex;
  gap: 8px;
  align-items: center;
`;

export interface IBooleanField {
  value: string;
  label: string;
  detailed?: boolean;
  description?: string;
}
const BooleanField: React.FC<IBooleanField> = ({ value, label, detailed, description }) => {
  const text = value ? `true` : `false`;
  return (
    <Container>
      {detailed ? (
        <>
          {label}: <WithHelpTooltip tooltipMsg={description ?? ""}>{text}</WithHelpTooltip>
        </>
      ) : (
        <WithHelpTooltip tooltipMsg={label ?? ""}>{text}</WithHelpTooltip>
      )}
    </Container>
  );
};

export default BooleanField;
