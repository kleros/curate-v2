import React from "react";
import styled, { css } from "styled-components";
import { Card } from "@kleros/ui-components-library";
import { useIsListView } from "context/IsListViewProvider";
import { landscapeStyle } from "styles/landscapeStyle";
import StatusBanner from "./StatusBanner";
import RegistryInfo from "./RegistryInfo";
import { useNavigateAndScrollTop } from "hooks/useNavigateAndScrollTop";
import { GetRegistriesByIdsQuery } from "src/graphql/graphql";
import { Status } from "src/consts/status";

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

type List = GetRegistriesByIdsQuery["registries"][number];
interface IListCard extends List {
  overrideIsListView?: boolean;
  itemId?: string;
  totalItems: number;
  status: Status;
}

const RegistryCard: React.FC<IListCard> = ({ id, itemId, title, logoURI, totalItems, status, overrideIsListView }) => {
  const { isListView } = useIsListView();
  const navigateAndScrollTop = useNavigateAndScrollTop();

  const registryAddressAndItemId = `${id}-${itemId}`;

  return (
    <>
      {!isListView || overrideIsListView ? (
        <StyledCard hover onClick={() => navigateAndScrollTop(`/lists/${registryAddressAndItemId}/display/1/desc/all`)}>
          <StatusBanner {...{ status }} />
          <RegistryInfo {...{ title, logoURI, totalItems, status }} />
        </StyledCard>
      ) : (
        <StyledListItem
          hover
          onClick={() => navigateAndScrollTop(`/lists/${registryAddressAndItemId}/display/desc/all`)}
        >
          <RegistryInfo {...{ title, logoURI, totalItems, status }} isListView />
        </StyledListItem>
      )}
    </>
  );
};

export default RegistryCard;
