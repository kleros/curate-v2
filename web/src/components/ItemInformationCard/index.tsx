import React from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import { useToggle } from "react-use";
import { Button, Card } from "@kleros/ui-components-library";
import AliasDisplay from "components/RegistryInfo/AliasDisplay";
import RemoveModal from "../Modal/RemoveModal";
import { ItemDetailsFragment } from "src/graphql/graphql";
import { Policies } from "../InformationCard/Policies";
import FieldsDisplay from "./FieldsDisplay";
import StatusDisplay from "./StatusDisplay";
import Skeleton from "react-loading-skeleton";

const StyledCard = styled(Card)`
  display: flex;
  width: 100%;
  height: auto;
  flex-direction: column;
  margin-bottom: 64px;
`;

const TopInfo = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px 32px;
`;

const TopLeftInfo = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 16px;
  padding-top: 16px;
`;

const TopRightInfo = styled.div`
  display: flex;
  flex-direction: row;
  gap: 48px;
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: ${({ theme }) => theme.stroke};
  margin: ${responsiveSize(20, 28)} 32px;
`;

const BottomInfo = styled.div`
  display: flex;
  padding: 0 32px;
  padding-bottom: 12px;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: space-between;
`;

interface IItemInformationCard extends ItemDetailsFragment {
  className?: string;
  chainId?: number;
  policyURI: string;
}

const ItemInformationCard: React.FC<IItemInformationCard> = ({
  chainId = 100,
  className,
  registerer,
  status,
  disputed,
  policyURI,
  props,
}) => {
  const [isRemoveItemModalOpen, toggleRemoveItemModal] = useToggle(false);

  return (
    <>
      <StyledCard {...{ className }}>
        <TopInfo>
          <TopLeftInfo>{props ? <FieldsDisplay {...{ props }} /> : <Skeleton height={80} width={160} />}</TopLeftInfo>
          <TopRightInfo>
            <StatusDisplay {...{ status, disputed }} />
          </TopRightInfo>
        </TopInfo>
        <Divider />
        <BottomInfo>
          {registerer?.id ? <AliasDisplay address={registerer.id} /> : <Skeleton height={24} />}
          <Button variant="secondary" text={"Remove Item"} onClick={toggleRemoveItemModal} />
        </BottomInfo>
        <Policies policyURI={policyURI} />
      </StyledCard>
      {isRemoveItemModalOpen ? <RemoveModal isItem toggleModal={toggleRemoveItemModal} /> : null}
    </>
  );
};
export default ItemInformationCard;
