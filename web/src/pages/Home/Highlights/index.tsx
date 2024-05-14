import React, { useMemo } from "react";
import styled from "styled-components";
import { BREAKPOINT_LANDSCAPE } from "styles/landscapeStyle";
import { useWindowSize } from "react-use";
import { Button } from "@kleros/ui-components-library";
import Header from "./Header";
import RegistryCard from "components/RegistryCard";
import { SkeletonRegistryCard, SkeletonRegistryListItem } from "components/StyledSkeleton";
import { useIsListView } from "context/IsListViewProvider";
import { DEFAULT_CHAIN } from "consts/chains";
import { isUndefined } from "utils/index";
import { listOfListsAddresses } from "utils/listOfListsAddresses";
import { useNavigateAndScrollTop } from "hooks/useNavigateAndScrollTop";
import { useItemsQuery } from "queries/useItemsQuery";
import { useRegistriesByIdsQuery } from "queries/useRegistriesByIdsQuery";
import { mapFromSubgraphStatus } from "components/RegistryCard/StatusBanner";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 32px;
`;

const GridContainer = styled.div`
  --gap: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, max(274px, (100% - var(--gap) * 2)/3)), 1fr));
  align-items: center;
  gap: var(--gap);
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
`;

const StyledButton = styled(Button)`
  margin: 0 auto;
`;

const HighlightedLists = () => {
  const navigateAndScrollTop = useNavigateAndScrollTop();
  const { isListView } = useIsListView();
  const { width } = useWindowSize();
  const screenIsBig = useMemo(() => width > BREAKPOINT_LANDSCAPE, [width]);
  const { data: itemsData, isLoading: isItemsDataLoading } = useItemsQuery(0, 6, {
    registry: listOfListsAddresses[DEFAULT_CHAIN],
  });

  // TODO: Json.parse can throw error
  const registryIds = useMemo(
    () =>
      itemsData
        ? itemsData?.items
            .map((item) => item?.props[0]?.value?.toLowerCase() ?? undefined)
            .filter((id) => !isUndefined(id))
        : [],
    [itemsData]
  );

  const { data: registriesData, isLoading: isRegistriesDataLoading } = useRegistriesByIdsQuery(registryIds);

  const combinedListsData = useMemo(() => {
    return registriesData?.registries.map((registry) => {
      const registryAsItem = itemsData?.items.find((item) => item?.props[0]?.value?.toLowerCase() === registry.id);
      return {
        ...registry,
        totalItems: registry.items.length,
        status: registryAsItem?.status,
        disputed: registryAsItem?.disputed,
        itemId: registryAsItem?.id,
      };
    });
  }, [registriesData, itemsData]);

  const registriesLoading = isUndefined(combinedListsData) || isItemsDataLoading || isRegistriesDataLoading;

  return (
    <Container>
      <Header />
      {isListView && screenIsBig ? (
        <ListContainer>
          {registriesLoading
            ? [...Array(6)].map((_, i) => <SkeletonRegistryListItem key={i} />)
            : combinedListsData?.map((registry, i) => (
                <RegistryCard
                  key={i}
                  {...registry}
                  totalItems={registry.totalItems}
                  status={mapFromSubgraphStatus(registry.status, registry.disputed)}
                />
              ))}
        </ListContainer>
      ) : (
        <GridContainer>
          {registriesLoading
            ? [...Array(6)].map((_, i) => <SkeletonRegistryCard key={i} />)
            : combinedListsData?.map((registry, i) => (
                <RegistryCard
                  key={i}
                  {...registry}
                  totalItems={registry.totalItems}
                  status={mapFromSubgraphStatus(registry.status, registry.disputed)}
                />
              ))}
        </GridContainer>
      )}
      <StyledButton
        onClick={() => navigateAndScrollTop("/lists/display/1/desc/all")}
        text="Show All"
        variant="secondary"
      />
    </Container>
  );
};

export default HighlightedLists;
