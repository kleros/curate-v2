import React from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
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

interface IItemDisplay {}

const ItemDisplay: React.FC<IItemDisplay> = ({}) => {
  return (
    <Container>
      <StyledP>Check how the item is displayed on the Item page:</StyledP>
      <StyledInformationCard
        title={"Title"}
        description={"description"}
        chainId={1}
        status="included"
        logoURI="https://ipfs.kleros.io//ipfs/QmNNSDkpyDX1wB4NNFdAzaHsJihpvgNVV89zCH8FH9CVAz/ledger-white.png"
        isItem
      />
    </Container>
  );
};
export default ItemDisplay;
