import React from "react";
import styled from "styled-components";
import PaperIcon from "svgs/icons/paper.svg";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-top: 3px solid ${({ theme }) => theme.secondaryPurple};
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  background-color: ${({ theme }) => theme.whiteBackground};
`;

const SVGContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    fill: ${({ theme }) => theme.secondaryPurple};
    height: 24px;
    width: 24px;
  }
`;
const Header: React.FC = () => {
  return (
    <Container>
      <SVGContainer>
        <PaperIcon />
      </SVGContainer>
      <p>Highlights</p>
    </Container>
  );
};

export default Header;
