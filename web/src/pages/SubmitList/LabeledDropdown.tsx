import { DropdownSelect, ISelect } from "@kleros/ui-components-library";
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const StyledLabel = styled.label`
  width: 100%;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.primaryText};
`;

interface ILabeledDropdown extends ISelect {
  label: string;
}
const LabeledDropdown: React.FC<ILabeledDropdown> = ({ label, ...props }) => {
  return (
    <Container>
      <StyledLabel id={label}>{label}</StyledLabel>
      <DropdownSelect {...props} />
    </Container>
  );
};

export default LabeledDropdown;
