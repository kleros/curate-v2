import React from "react";
import styled from "styled-components";
import HeroImage from "components/HeroImage";
import { responsiveSize } from "styles/responsiveSize";

const Container = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.lightBackground};
  padding: ${responsiveSize(32, 72)} ${responsiveSize(24, 132)} ${responsiveSize(76, 96)};
  max-width: 1780px;
  margin: 0 auto;
`;

const Home: React.FC = () => {
  return (
    <>
      <HeroImage />
      <Container>Home</Container>
    </>
  );
};

export default Home;
