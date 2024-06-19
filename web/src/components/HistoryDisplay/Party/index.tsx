import React from "react";
import styled from "styled-components";
import AliasDisplay from "components/RegistryInfo/AliasDisplay";
import { RequestDetailsFragment } from "src/graphql/graphql";
import DocIcon from "svgs/icons/doc.svg";
import { useToggle } from "react-use";
import JustificationModal from "./JustificationModal";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

const StyledLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ theme }) => theme.primaryBlue};
  cursor: pointer;
`;

const StyledDoc = styled(DocIcon)`
  width: 16px;
  height: 16px;
  fill: ${({ theme }) => theme.primaryBlue};
`;

interface IParty {
  request: RequestDetailsFragment;
  isRemoval?: boolean;
}

const Party: React.FC<IParty> = ({ request, isRemoval = false }) => {
  const [isOpen, toggleModal] = useToggle(false);
  return (
    <Container>
      <label>by</label>
      <AliasDisplay address={request?.challenger?.id ?? ""} />
      <label>-</label>
      <StyledLabel onClick={toggleModal}>
        <StyledDoc /> Justification
      </StyledLabel>
      {isOpen && <JustificationModal {...{ request, toggleModal, isRemoval }} />}
    </Container>
  );
};

export default Party;
