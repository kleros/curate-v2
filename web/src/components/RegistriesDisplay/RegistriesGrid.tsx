import React, { useMemo } from "react";
import { useWindowSize } from "react-use";
import { useParams } from "react-router-dom";
import { SkeletonRegistryCard, SkeletonRegistryListItem } from "../StyledSkeleton";
import { StandardPagination } from "@kleros/ui-components-library";
import { useIsListView } from "context/IsListViewProvider";
import { isUndefined } from "utils/index";
import { decodeListURIFilter } from "utils/uri";
// import { RegistryDetailsFragment } from "queries/useCasesQuery";
import RegistryCard from "components/RegistryCard";
import { mapFromSubgraphStatus } from "../RegistryCard/StatusBanner";
import { LG_BREAKPOINT } from "~src/styles/breakpoints";

export interface IRegistriesGrid {
  registries?: [];
  registriesLoading?: boolean;
  currentPage: number;
  setCurrentPage: (newPage: number) => void;
  registriesPerPage: number;
  totalPages: number;
  showPagination?: Boolean;
}

const RegistriesGrid: React.FC<IRegistriesGrid> = ({
  registries,
  registriesLoading,
  registriesPerPage,
  totalPages,
  currentPage,
  setCurrentPage,
  showPagination,
}) => {
  const { filter } = useParams();
  const decodedFilter = decodeListURIFilter(filter ?? "all");
  const { id: searchValue } = decodedFilter;
  const { isListView } = useIsListView();
  const { width } = useWindowSize();
  const screenIsBig = useMemo(() => width > LG_BREAKPOINT, [width]);

  return (
    <>
      {isListView && screenIsBig ? (
        <div className="flex flex-col justify-center gap-2">
          {isUndefined(registries) || registriesLoading
            ? [...Array(registriesPerPage)].map((_, i) => <SkeletonRegistryListItem key={i} />)
            : registries.map((registry) => {
                return (
                  <RegistryCard
                    key={registry.id}
                    {...registry}
                    status={mapFromSubgraphStatus(registry.status, registry.disputed)}
                  />
                );
              })}
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,max(274px,(100%-16px*2)/3)),1fr))] items-center gap-4">
          {isUndefined(registries) || registriesLoading
            ? [...Array(registriesPerPage)].map((_, i) => <SkeletonRegistryCard key={i} />)
            : registries.map((registry) => {
                return (
                  <RegistryCard
                    key={registry.id}
                    {...registry}
                    overrideIsListView
                    status={mapFromSubgraphStatus(registry.status, registry.disputed)}
                  />
                );
              })}
        </div>
      )}

      {isUndefined(searchValue) && showPagination ? (
        <StandardPagination
          className="mt-6 mx-auto"
          currentPage={currentPage}
          numPages={Math.ceil(totalPages ?? 0)}
          callback={(page: number) => setCurrentPage(page)}
        />
      ) : null}
    </>
  );
};

export default RegistriesGrid;
