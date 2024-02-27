import React from "react";
import styled, { css } from "styled-components";
import { Card } from "@kleros/ui-components-library";
import { useIsList } from "context/IsListProvider";
import { landscapeStyle } from "styles/landscapeStyle";
import { lists } from "consts/index";
import StatusBanner from "./StatusBanner";
import RegistryInfo from "./RegistryInfo";
import { useNavigateAndScrollTop } from "hooks/useNavigateAndScrollTop";

const StyledCard = styled(Card)`
  width: 100%;
  height: 274px;
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

const RegistryCard: React.FC<IListCard> = ({ id, title, logoURI, totalItems, status, chainId, overrideIsList }) => {
  const { isList } = useIsList();
  const navigateAndScrollTop = useNavigateAndScrollTop();

  return (
    <>
      {!isList || overrideIsList ? (
        <StyledCard hover onClick={() => navigateAndScrollTop(`/lists/${id.toString()}/display/1/desc/all`)}>
          <StatusBanner {...{ status, chainId }} />
          <RegistryInfo {...{ title, logoURI, totalItems, status, chainId }} />
        </StyledCard>
      ) : (
        <StyledListItem hover onClick={() => navigateAndScrollTop(`/lists/${id.toString()}/display/desc/all`)}>
          <RegistryInfo {...{ title, logoURI, totalItems, status, chainId }} isList />
        </StyledListItem>
      )}
    </>
  );
};

export default RegistryCard;
