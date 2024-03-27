import React from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import { Status } from "consts/status";
import RegistryCard from "components/RegistryCard";
import { useSubmitListContext } from "context/SubmitListContext";
import { getIpfsUrl } from "utils/getIpfsUrl";

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
  const { listMetadata } = useSubmitListContext();
  return (
    <Container>
      <StyledP>Check how the list is displayed on the home page:</StyledP>
      <RegistryCard
        id={1}
        title={listMetadata.title}
        status={Status.Pending}
        logoURI={getIpfsUrl(listMetadata?.logoURI)}
        chainId={1}
        totalItems={23}
      />
    </Container>
  );
};
export default HomePageDisplay;
