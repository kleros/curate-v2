import React from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import { useToggle } from "react-use";
import { Button, Card } from "@kleros/ui-components-library";
import { getStatusColor, getStatusLabel, mapFromSubgraphStatus } from "components/RegistryCard/StatusBanner";
import AliasDisplay from "components/RegistryInfo/AliasDisplay";
import EtherscanIcon from "svgs/icons/etherscan.svg";
import { Status } from "consts/status";
import RemoveModal from "../Modal/RemoveModal";
import { ItemDetailsFragment } from "src/graphql/graphql";
import { Policies } from "../InformationCard/Policies";
import ItemField from "../ItemCard/ItemField";

const StyledCard = styled(Card)`
  display: flex;
  width: 100%;
  height: auto;
  flex-direction: column;
  margin-bottom: 64px;
`;

const StatusContainer = styled.div<{ status: Status; isList: boolean }>`
  display: flex;
  margin-top: 18px;
  .dot {
    ::before {
      content: "";
      display: inline-block;
      height: 8px;
      width: 8px;
      border-radius: 50%;
      margin-right: 8px;
    }
  }
  ${({ theme, status }) => {
    const [frontColor] = getStatusColor(status, theme);
    return `
      .front-color {
        color: ${frontColor};
      }
      .dot {
        ::before {
          background-color: ${frontColor};
        }
      }
    `;
  }};
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

const StyledEtherscanIcon = styled(EtherscanIcon)`
  display: flex;
  height: 16px;
  width: 16px;
  margin-top: 20px;
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

const FieldsContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 16px;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;
interface IItemInformationCard extends ItemDetailsFragment {
  className?: string;
  chainId?: number;
}

const ItemInformationCard: React.FC<IItemInformationCard> = ({
  chainId = 100,
  className,
  registerer,
  status,
  disputed,
  props,
}) => {
  const [isRemoveItemModalOpen, toggleRemoveItemModal] = useToggle(false);

  // filter out fields based on type and display accordingly
  const imageFields = props.filter((prop) => prop.type === "image");
  const addressFields = props.filter((prop) => prop.type === "address");
  const linkFields = props.filter((prop) => prop.type === "link");
  const fileFields = props.filter((prop) => prop.type === "file");
  const textFields = props.filter((prop) => prop.type === "text");
  const restOfFields = props.filter((prop) => !["text", "address", "link", "image", "file"].includes(prop.type));

  const displayField = addressFields.length || linkFields.length || fileFields.length;
  return (
    <>
      <StyledCard {...{ className }}>
        <TopInfo>
          <TopLeftInfo>
            <FieldsContainer>
              {imageFields.map((field) => (
                <ItemField {...field} detailed />
              ))}
              {textFields.map((field) => (
                <ItemField {...field} detailed />
              ))}
            </FieldsContainer>
            {displayField ? (
              <FieldsContainer>
                {addressFields.map((field) => (
                  <ItemField {...field} detailed />
                ))}
                {linkFields.map((field) => (
                  <ItemField {...field} detailed />
                ))}
                {fileFields.map((field) => (
                  <ItemField {...field} detailed />
                ))}
              </FieldsContainer>
            ) : null}
            <FieldsContainer>
              {restOfFields.map((field) => (
                <ItemField {...field} detailed />
              ))}
            </FieldsContainer>
          </TopLeftInfo>
          <TopRightInfo>
            <StyledEtherscanIcon />
            <StatusContainer {...{ status: mapFromSubgraphStatus(status, disputed), isList: false }}>
              <label className="front-color dot">{getStatusLabel(mapFromSubgraphStatus(status, disputed))}</label>
            </StatusContainer>
          </TopRightInfo>
        </TopInfo>
        <Divider />
        <BottomInfo>
          <AliasDisplay address={registerer.id} />
          <Button variant="secondary" text={"Remove Item"} onClick={toggleRemoveItemModal} />
        </BottomInfo>
        <Policies />
      </StyledCard>
      {isRemoveItemModalOpen ? <RemoveModal isItem toggleModal={toggleRemoveItemModal} /> : null}
    </>
  );
};
export default ItemInformationCard;
