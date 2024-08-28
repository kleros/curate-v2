import React from "react";
import styled from "styled-components";
import WithHelpTooltip from "components/WithHelpTooltip";
import TruncatedText from "components/TruncatedText";

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
    <Container>
      {detailed ? (
        <WithHelpTooltip tooltipMsg={label ?? ""}>{value}</WithHelpTooltip>
      ) : (
        <TruncatedText text={value} maxLength={100} />
      )}
    </Container>
  );
};

export default TextField;
