import React, { useMemo } from "react";
import { Button } from "@kleros/ui-components-library";
import Header from "./Header";
import RegistryCard from "components/RegistryCard";
import { SkeletonRegistryCard } from "components/StyledSkeleton";
import { isUndefined } from "utils/index";
import { useNavigateAndScrollTop } from "hooks/useNavigateAndScrollTop";
import { useItemsQuery } from "queries/useItemsQuery";
import { useRegistriesByIdsQuery } from "queries/useRegistriesByIdsQuery";
import { mapFromSubgraphStatus } from "components/RegistryCard/StatusBanner";
import { sortRegistriesByIds } from "utils/sortRegistriesByIds";
import { Status } from "src/graphql/graphql";
import { List_filters } from "consts/filters";
import { encodeListURIFilter } from "utils/uri";
import { MAIN_CURATE_ADDRESS } from "src/consts";

const HighlightedLists = () => {
  const navigateAndScrollTop = useNavigateAndScrollTop();

  const { data: itemsData, isLoading: isItemsDataLoading } = useItemsQuery(0, 6, {
    registry: MAIN_CURATE_ADDRESS,
    ...List_filters.Active,
  });

  const registryIds = useMemo(
    () =>
      itemsData
        ? (itemsData?.items
            .map((item) => item?.props[0]?.value?.toLowerCase() ?? undefined)
            .filter((id) => !isUndefined(id)) as string[])
        : [],
    [itemsData]
  );

  const { data: registriesData, isLoading: isRegistriesDataLoading } = useRegistriesByIdsQuery(registryIds);

  const sortedRegstries = useMemo(
    () => (registriesData?.registries ? sortRegistriesByIds(registryIds, registriesData?.registries) : []),
    [registriesData, registryIds]
  );

  const combinedListsData = useMemo(() => {
    return sortedRegstries.map((registry) => {
      const registryAsItem = itemsData?.items.find((item) => item?.props[0]?.value?.toLowerCase() === registry.id);
      return {
        ...registry,
        totalItems: registry.items.length,
        status: registryAsItem?.status,
        disputed: registryAsItem?.disputed,
        itemId: registryAsItem?.id,
      };
    });
  }, [sortedRegstries, itemsData]);

  const registriesLoading = isUndefined(combinedListsData) || isItemsDataLoading || isRegistriesDataLoading;

  return (
    <div className="flex flex-col w-full justify-center gap-8">
      <Header />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,max(274px,(100%-16px*2)/3)),1fr))] items-center gap-4">
        {registriesLoading
          ? [...Array(6)].map((_, i) => <SkeletonRegistryCard key={i} />)
          : combinedListsData?.map((registry, i) => (
              <RegistryCard
                key={i}
                {...registry}
                totalItems={registry.totalItems}
                status={mapFromSubgraphStatus(
                  registry.status ?? Status.RegistrationRequested,
                  registry.disputed ?? false
                )}
                overrideIsListView
              />
            ))}
      </div>
      <Button
        className="mx-auto"
        onPress={() => navigateAndScrollTop(`/lists/display/1/desc/${encodeListURIFilter(List_filters.Active)}`)}
        text="Show All"
        variant="secondary"
      />
    </div>
  );
};

export default HighlightedLists;
