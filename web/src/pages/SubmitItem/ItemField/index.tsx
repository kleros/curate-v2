import React from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { responsiveSize } from "styles/responsiveSize";
import { Field } from "@kleros/ui-components-library";
import { useSubmitItemContext } from "context/SubmitItemContext";
import Title from "../Title";
import NavigationButtons from "../NavigationButtons";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledField = styled(Field)`
  width: 80vw;
  margin-bottom: ${responsiveSize(68, 40)};

  input {
    font-size: 16px;
  }

  small {
    margin-top: 6px;
    svg {
      margin-top: 8px;
    }
  }

  ${landscapeStyle(
    () => css`
      width: ${responsiveSize(200, 720)};
    `
  )};
`;

const ItemField: React.FC = () => {
  const { fieldOne, setFieldOne } = useSubmitItemContext();

  const handleWrite = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFieldOne(event.target.value);
  };

  return (
    <Container>
      <Title text="Item Field 1" />
      <StyledField
        value={fieldOne}
        onChange={handleWrite}
        variant={"info"}
        message={"Item Field 1 description requirements go here"}
      />
      <NavigationButtons prevRoute="/lists/1/list/1/desc/all" nextRoute="/submit-item/policy" />
    </Container>
  );
};

export default ItemField;
