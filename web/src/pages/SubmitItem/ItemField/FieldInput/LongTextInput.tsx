import React from "react";
import { IFieldInput } from ".";
import { Textarea } from "@kleros/ui-components-library";
import styled, { css } from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import { landscapeStyle } from "styles/landscapeStyle";

const StyledField = styled(Textarea)`
  width: 80vw;
  margin-bottom: ${responsiveSize(68, 40)};
  height: fit-content;
  textarea {
    resize: vertical;
  }

  input {
    font-size: 16px;
  }

  svg {
    margin-top: 8px;
  }
  small {
    margin-top: 6px;
  }

  ${landscapeStyle(
    () => css`
      width: ${responsiveSize(200, 720)};
    `
  )};
`;

const LongTextInput: React.FC<IFieldInput> = ({ fieldProp, handleWrite }) => {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleWrite(event.target.value);
  };
  return (
    <StyledField value={fieldProp.value} onChange={handleChange} variant={"info"} message={fieldProp.description} />
  );
};

export default LongTextInput;
