import React, { useEffect, useState } from "react";
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
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const words = ["Lists", "Knowledge"];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex === 0 ? 1 : 0));
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <StyledHeader>
      <StyledH1>
        Community Curated <StyledSpan>{words[currentWordIndex]}</StyledSpan>
      </StyledH1>
    </StyledHeader>
  );
};

export default Header;
