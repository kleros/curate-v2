import React from "react";
import styled, { css } from "styled-components";
import { Button, Card } from "@kleros/ui-components-library";
import { landscapeStyle } from "styles/landscapeStyle";
import { items } from "consts/index";
import { useNavigateAndScrollTop } from "hooks/useNavigateAndScrollTop";
import { responsiveSize } from "styles/responsiveSize";
import StatusBanner from "../RegistryCard/StatusBanner";
import EtherscanIcon from "svgs/icons/etherscan.svg";
import GlobeIcon from "svgs/icons/globe.svg";
import { shortenAddress } from "utils/shortenAddress";
import ArrowIcon from "svgs/icons/arrow.svg";

const StyledListItem = styled(Card)`
  display: flex;
  flex-grow: 1;
  width: 100%;
  height: max-content;
  ${landscapeStyle(
    () => css`
      height: 64px;
    `
  )}
`;

const Container = styled.div`
  width: 100%;
  height: max-content;
  align-items: center;
  display: grid;
  grid-template-rows: repeat(4, min-content);
  grid-template-columns: 1fr min-content;
  column-gap: ${responsiveSize(12, 32, 900)};
  row-gap: 8px;
  padding: 16px;
  h3,
  .address,
  .ens {
    grid-column: span 2;
  }
  ${landscapeStyle(
    () => css`
      height: 64px;
      justify-content: space-between;
      grid-template-rows: 1fr;
      grid-template-columns: ${responsiveSize(200, 250, 900)} ${responsiveSize(120, 150, 900)} 1fr ${responsiveSize(
          100,
          150,
          900
        )} max-content;
      padding: 0 32px;

      h3 {
        grid-column: 1;
      }
      .address {
        grid-column: 2;
      }
      .ens {
        grid-column: 3;
      }
    `
  )}
`;

const StyledTitle = styled.h3`
  font-weight: 400;
  margin: 0px;
`;

const TruncatedTitle = ({ text, maxLength }) => {
  const truncatedText = text.length <= maxLength ? text : text.slice(0, maxLength) + "…";
  return <StyledTitle>{truncatedText}</StyledTitle>;
};

const StyledButton = styled(Button)`
  background-color: transparent;
  padding: 0;
  flex-direction: row-reverse;
  gap: 8px;
  .button-text {
    color: ${({ theme }) => theme.primaryBlue};
    font-weight: 400;
  }

  :focus,
  :hover {
    background-color: transparent;
  }
`;

// these are temporary, items will have custom fields?
const DisplayContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const StyledEtherscanIcon = styled(EtherscanIcon)`
  display: flex;
  height: 16px;
  width: 16px;
`;

const StyledP = styled.p`
  color: ${({ theme }) => theme.primaryBlue};
  margin: 0;
`;
const StyledGlobeIcon = styled(GlobeIcon)`
  display: flex;
  height: 16px;
  width: 16px;
`;

type Item = (typeof items)[number];
interface IItemCard extends Item {}

const ItemCard: React.FC<IItemCard> = ({ id, title, address, website, status }) => {
  const navigateAndScrollTop = useNavigateAndScrollTop();

  return (
    <StyledListItem hover onClick={() => navigateAndScrollTop(`/lists/1/item/${id.toString()}`)}>
      <Container>
        <TruncatedTitle text={title} maxLength={100} />
        <DisplayContainer className="address">
          <StyledEtherscanIcon />
          <StyledP>{shortenAddress("0x922911F4f80a569a4425fa083456239838F7F003")}</StyledP>
        </DisplayContainer>
        <DisplayContainer className="ens">
          <StyledGlobeIcon />
          <StyledP>metamask.io</StyledP>
        </DisplayContainer>
        <StatusBanner {...{ status }} isList />
        <StyledButton text="Open" Icon={ArrowIcon} />
      </Container>
    </StyledListItem>
  );
};

export default ItemCard;
