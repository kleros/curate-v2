import React from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import { Status } from "consts/status";
import RegistryCard from "components/RegistryCard";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${responsiveSize(32, 24)};
`;

const StyledP = styled.p`
  color: ${({ theme }) => theme.primaryBlue};
  margin: 0;
`;

const HomePageDisplay: React.FC = () => {
  return (
    <Container>
      <StyledP>Check how the list is displayed on the home page:</StyledP>
      <RegistryCard
        id={1}
        title="List title goes here"
        status={Status.Pending}
        logoURI="https://ipfs.kleros.io//ipfs/QmNNSDkpyDX1wB4NNFdAzaHsJihpvgNVV89zCH8FH9CVAz/ledger-white.png"
        chainId={1}
        totalItems={23}
      />
    </Container>
  );
};
export default HomePageDisplay;
