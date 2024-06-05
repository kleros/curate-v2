import React, { useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useWindowSize } from "react-use";
import { useListRootPath, decodeListURIFilter } from "utils/uri";
import RegistriesDisplay from "components/RegistriesDisplay";
import { BREAKPOINT_LANDSCAPE } from "styles/landscapeStyle";
import { useItemsQuery } from "queries/useItemsQuery";
import { useRegistriesByIdsQuery } from "queries/useRegistriesByIdsQuery";
import { isUndefined } from "utils/index";
import { OrderDirection } from "src/graphql/graphql";
import { useRegistryDetailsQuery } from "hooks/queries/useRegistryDetailsQuery";
import { List_filters } from "consts/filters";
import { sortRegistriesByIds } from "utils/sortRegistriesByIds";
import { MAIN_CURATE_ADDRESS } from "src/consts";

const RegistriesFetcher: React.FC = () => {
  const { page, order, filter } = useParams();
  const [searchParmams] = useSearchParams();
  const keywords = searchParmams.get("keywords");

  const navigate = useNavigate();
  const { width } = useWindowSize();
  const location = useListRootPath();
  const screenIsBig = width > BREAKPOINT_LANDSCAPE;
  const registriesPerPage = screenIsBig ? 9 : 3;
  const pageNumber = parseInt(page ?? "1", 10);
  const registrySkip = registriesPerPage * (pageNumber - 1);

  const decodedFilter = decodeListURIFilter(filter ?? "all");
  const { data: mainCurate } = useRegistryDetailsQuery(MAIN_CURATE_ADDRESS);

  // get items from the main curate as these are the registries
  const { data: itemsData, isLoading: isItemDataLoading } = useItemsQuery(
    registrySkip,
    registriesPerPage,
    {
      registry: MAIN_CURATE_ADDRESS,
      ...decodedFilter,
    },
    order === "asc" ? OrderDirection.Asc : OrderDirection.Desc,
    keywords
  );

  const registryIds = useMemo(
    () =>
      itemsData
        ? (itemsData?.items
            .map((item) => item?.props[0]?.value?.toLowerCase() ?? undefined)
            .filter((id) => !isUndefined(id)) as string[])
        : [],
    [itemsData]
  );

  // get registries by id
  const { data: registriesData, isLoading: isRegistriesDataLoading } = useRegistriesByIdsQuery(registryIds);

  const sortedRegstries = useMemo(
    () => (registriesData?.registries ? sortRegistriesByIds(registryIds, registriesData?.registries) : []),
    [registriesData]
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

  const totalRegistries = useMemo<number>(() => {
    if (!mainCurate || !mainCurate.registry) return 0;
    switch (JSON.stringify(decodedFilter)) {
      case JSON.stringify(List_filters.Disputed):
        return mainCurate.registry.numberOfDisputed;
      case JSON.stringify(List_filters.Included):
        return mainCurate.registry.numberOfRegistered;
      case JSON.stringify(List_filters.Removed):
        return mainCurate.registry.numberOfAbsent;
      case JSON.stringify(List_filters.Pending):
        return mainCurate.registry.numberOfPending;
      case JSON.stringify(List_filters.Active):
        return mainCurate.registry.totalItems - mainCurate.registry.numberOfAbsent;
      default:
        return mainCurate.registry.totalItems;
    }
  }, [mainCurate, decodedFilter]);

  const totalPages = useMemo(
    () => (!isUndefined(totalRegistries) ? Math.ceil(totalRegistries / registriesPerPage) : 1),
    [totalRegistries, registriesPerPage]
  );

  return (
    <RegistriesDisplay
      registries={combinedListsData}
      totalRegistries={totalRegistries}
      registriesLoading={isItemDataLoading || isRegistriesDataLoading}
      currentPage={pageNumber}
      setCurrentPage={(newPage: number) => navigate(`${location}/${newPage}/${order}/${filter}`)}
      totalPages={totalPages}
      registriesPerPage={registriesPerPage}
      showPagination={!keywords}
    />
  );
};

export default RegistriesFetcher;
