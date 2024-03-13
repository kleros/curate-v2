import React from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";

const Container = styled.h1`
  width: 84vw;
  text-align: center;
  margin: 0px;
  ${landscapeStyle(
    () => css`
      width: auto;
    `
  )}
`;

interface IHeader {
  text: string;
}

const Header: React.FC<IHeader> = ({ text }) => {
  return <Container>{text}</Container>;
};
export default Header;
