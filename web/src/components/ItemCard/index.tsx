import React from "react";
import styled, { css } from "styled-components";
import { Button, Card } from "@kleros/ui-components-library";
import { landscapeStyle } from "styles/landscapeStyle";
import { useNavigateAndScrollTop } from "hooks/useNavigateAndScrollTop";
import { responsiveSize } from "styles/responsiveSize";
import StatusBanner, { mapFromSubgraphStatus } from "../RegistryCard/StatusBanner";
import ArrowIcon from "svgs/icons/arrow.svg";
import { ItemDetailsFragment } from "src/graphql/graphql";
import ItemField from "./ItemField";

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
  grid-template-rows: repeat(3, min-content);
  grid-template-columns: 1fr min-content;
  column-gap: ${responsiveSize(12, 32, 900)};
  row-gap: 8px;
  padding: 16px;
  ${landscapeStyle(
    () => css`
      height: 64px;
      justify-content: space-between;
      grid-template-rows: 1fr;
      grid-template-columns: 1fr ${responsiveSize(100, 150, 900)} max-content;
      padding: 0 32px;
    `
  )}
`;

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

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: start;
  width: max-content;
  gap: 16px;
  grid-column: span 2;
  ${landscapeStyle(
    () => css`
      flex-direction: row;
      align-items: center;
      grid-column: span 1;
      gap: ${responsiveSize(16, 36, 900)};
    `
  )}
`;
interface IItemCard extends ItemDetailsFragment {}

const ItemCard: React.FC<IItemCard> = ({ id, status, disputed, props }) => {
  const navigateAndScrollTop = useNavigateAndScrollTop();

  // sort the props
  const sortedProps = sortItemProps(props);

  return (
    <StyledListItem hover onClick={() => navigateAndScrollTop(`/lists/1/item/${id.toString()}`)}>
      <Container>
        <FieldsContainer>{sortedProps.map((prop) => prop.isIdentifier && <ItemField {...prop} />)}</FieldsContainer>
        <StatusBanner {...{ status: mapFromSubgraphStatus(status, disputed) }} isList />
        <StyledButton text="Open" Icon={ArrowIcon} />
      </Container>
    </StyledListItem>
  );
};

type ItemProp = ItemDetailsFragment["props"][number];

export const sortItemProps = (props: ItemDetailsFragment["props"]) => {
  const itemSort = (a: ItemProp, b: ItemProp) => {
    // props will show on the item card in this order
    const order = { image: 1, text: 2, address: 3, file: 4, link: 5 };

    const typeA = order[a.type] || Infinity;
    const typeB = order[b.type] || Infinity;

    if (typeA < typeB) {
      return -1;
    } else if (typeA > typeB) {
      return 1;
    } else {
      return a.label.localeCompare(b.label);
    }
  };
  return props.sort(itemSort);
};

export default ItemCard;
