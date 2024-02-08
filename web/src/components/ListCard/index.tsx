import React from "react";
import styled, { css } from "styled-components";
import { useNavigate } from "react-router-dom";
import { Card } from "@kleros/ui-components-library";
import { useIsList } from "context/IsListProvider";
import { landscapeStyle } from "styles/landscapeStyle";
import { lists } from "consts/index";
import StatusBanner from "./StatusBanner";
import ListInfo from "./ListInfo";

const StyledCard = styled(Card)`
  width: 100%;
  height: 274px;

  ${landscapeStyle(
    () =>
      css`
        width: max(calc((100% - 48px) * 0.333), 348px);
      `
  )}
`;

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

type List = (typeof lists)[number];
interface IListCard extends List {
  overrideIsList?: boolean;
}

const ListCard: React.FC<IListCard> = ({ id, title, logoURI, totalItems, status, chainId, overrideIsList }) => {
  const { isList } = useIsList();

  const navigate = useNavigate();
  return (
    <>
      {!isList || overrideIsList ? (
        <StyledCard hover onClick={() => navigate(`/lists/${id.toString()}`)}>
          <StatusBanner {...{ status, chainId }} />
          <ListInfo {...{ title, logoURI, totalItems, status, chainId }} />
        </StyledCard>
      ) : (
        <StyledListItem hover onClick={() => navigate(`/lists/${id.toString()}`)}>
          <ListInfo {...{ title, logoURI, totalItems, status, chainId }} isList />
        </StyledListItem>
      )}
    </>
  );
};

export default ListCard;
