import { Field } from "@kleros/ui-components-library";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { responsiveSize } from "styles/responsiveSize";

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
export default StyledField;
