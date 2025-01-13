import React from "react";
import styled from "styled-components";

import { hoverShortTransitionTiming } from "styles/commonStyles";

import { Link } from "react-router-dom";

import CurateLogo from "svgs/header/curate.svg";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const StyledCurateLogo = styled(CurateLogo)`
  ${hoverShortTransitionTiming}
  max-height: 48px;
  width: auto;

  &:hover {
    path {
      fill: ${({ theme }) => theme.white}BF;
    }
  }
`;

const Logo: React.FC = () => (
  <Container>
    {" "}
    <Link to={"/"}>
      <StyledCurateLogo />
    </Link>
  </Container>
);

export default Logo;
