import React from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import { Status } from "consts/status";
import InformationCard from "components/InformationCard";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${responsiveSize(32, 24)};
`;

const StyledP = styled.p`
  color: ${({ theme }) => theme.primaryBlue};
  margin: 0;
`;

const StyledInformationCard = styled(InformationCard)`
  margin: 0px;
`;

const ListPageDisplay: React.FC = () => {
  return (
    <Container>
      <StyledP>Check how the list is displayed on the List page:</StyledP>
      <StyledInformationCard
        title="List title goes here"
        description="List description"
        chainId={1}
        status={Status.Included}
        logoURI="https://ipfs.kleros.io//ipfs/QmNNSDkpyDX1wB4NNFdAzaHsJihpvgNVV89zCH8FH9CVAz/ledger-white.png"
      />
    </Container>
  );
};
export default ListPageDisplay;
