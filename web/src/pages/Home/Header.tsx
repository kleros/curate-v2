import React from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledH1 = styled.h1`
  font-size: ${responsiveSize(21, 24)};
  font-weight: 500;
  margin-bottom: 48px;
  letter-spacing: 1px;
`;

const StyledSpan = styled.span`
  color: ${({ theme }) => theme.secondaryPurple};
`;

const Header: React.FC = () => {
  return (
    <StyledHeader>
      <StyledH1>
        Community Curated <StyledSpan>Lists</StyledSpan>
      </StyledH1>
    </StyledHeader>
  );
};

export default Header;
