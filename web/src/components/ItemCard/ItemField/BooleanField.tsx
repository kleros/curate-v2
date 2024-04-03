import React from "react";
import styled from "styled-components";
import WithHelpTooltip from "components/WithHelpTooltip";

const Container = styled.p`
  margin: 0px;
`;

export interface IBooleanField {
  value: string;
  label: string;
  detailed?: boolean;
  description?: string;
}
const BooleanField: React.FC<IBooleanField> = ({ value, label, detailed, description }) => {
  const text = value === "true" ? `is${label}` : `not${label}`;
  return (
    <Container>{detailed ? <WithHelpTooltip tooltipMsg={description ?? ""}>{text}</WithHelpTooltip> : text}</Container>
  );
};

export default BooleanField;
