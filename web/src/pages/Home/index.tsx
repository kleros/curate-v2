import React from "react";
import styled, { css } from "styled-components";

import { responsiveSize } from "styles/responsiveSize";
import { MAX_WIDTH_LANDSCAPE, landscapeStyle } from "styles/landscapeStyle";

import HeroImage from "components/HeroImage";
import Header from "./Header";
import Stats from "./Stats";
import HighlightedLists from "./Highlights";

const Container = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.lightBackground};
  padding: 16px 16px 40px;
  max-width: ${MAX_WIDTH_LANDSCAPE};
  margin: 0 auto;

  ${landscapeStyle(
    () => css`
      padding: 16px ${responsiveSize(0, 132)} 60px;
    `
  )}
`;

const Home: React.FC = () => {
  return (
    <>
      <HeroImage />
      <Container>
        <Header />
        <Stats />
        <HighlightedLists />
      </Container>
    </>
  );
};

export default Home;
