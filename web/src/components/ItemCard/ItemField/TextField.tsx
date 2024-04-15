import React from "react";
import styled from "styled-components";
import WithHelpTooltip from "components/WithHelpTooltip";

const Container = styled.p`
  margin: 0px;
`;

export interface ITextField {
  value: string;
  detailed?: boolean;
  label?: string;
}
const TextField: React.FC<ITextField> = ({ value, detailed, label }) => {
  return (
    <Container>{detailed ? <WithHelpTooltip tooltipMsg={label ?? ""}>{value}</WithHelpTooltip> : value}</Container>
  );
};

export default TextField;
