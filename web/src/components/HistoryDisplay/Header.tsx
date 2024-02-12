import React from "react";
import styled from "styled-components";
import HistoryIcon from "assets/svgs/icons/history.svg";

const HeaderContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const StyledP = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.primaryText};
`;

const SVGContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    fill: ${({ theme }) => theme.primaryText};
    height: 16px;
    width: 17px;
  }
`;
const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <SVGContainer>
        <HistoryIcon />
      </SVGContainer>
      <StyledP>History</StyledP>
    </HeaderContainer>
  );
};

export default Header;
