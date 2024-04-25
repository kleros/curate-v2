import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWindowSize } from "react-use";
import { useListRootPath, decodeListURIFilter } from "utils/uri";
import RegistriesDisplay from "components/RegistriesDisplay";
import { BREAKPOINT_LANDSCAPE } from "styles/landscapeStyle";
import { DEFAULT_CHAIN } from "consts/chains";
import { listOfListsAddresses } from "utils/listOfListsAddresses";
// import { isUndefined } from "utils/index";
// import { OrderDirection } from "src/graphql/graphql";
import { useItemsQuery } from "queries/useItemsQuery";
import { useRegistriesByIdsQuery } from "queries/useRegistriesByIdsQuery";
import { isUndefined } from "utils/index";
import { useCounter } from "queries/useCounter";

const RegistriesFetcher: React.FC = () => {
  const { page, order, filter } = useParams();
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const location = useListRootPath();
  const screenIsBig = width > BREAKPOINT_LANDSCAPE;
  const registriesPerPage = screenIsBig ? 9 : 3;
  const pageNumber = parseInt(page ?? "1", 10);
  const registrySkip = registriesPerPage * (pageNumber - 1);
  const decodedFilter = decodeListURIFilter(filter ?? "all");

  // const { data: registriesData } = useRegistriesQuery(
  //   registrySkip,
  //   registriesPerPage,
  //   decodedFilter,
  //   order === "asc" ? OrderDirection.Asc : OrderDirection.Desc
  // );

  // console.log(registriesData);

  const { data: itemsData } = useItemsQuery(registrySkip, registriesPerPage, {
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

  const { data: registriesData } = useRegistriesByIdsQuery(registryIds);

  const combinedListsData = useMemo(() => {
    return registriesData?.registries.map((registry) => {
      const registryAsItem = itemsData?.items.find((item) => item?.props[0]?.value?.toLowerCase() === registry.id);
      return {
        ...registry,
        totalItems: registry.items.length,
        status: registryAsItem?.status,
        itemId: registryAsItem?.id,
      };
    });
  }, [registriesData, itemsData]);

  const { data: counterData } = useCounter();
  const totalRegistries = counterData?.counter?.totalRegistries;
  const totalPages = useMemo(
    () => (!isUndefined(totalRegistries) ? Math.ceil(totalRegistries / registriesPerPage) : 1),
    [totalRegistries, registriesPerPage]
  );

  return (
    <RegistriesDisplay
      registries={combinedListsData}
      totalRegistries={totalRegistries}
      currentPage={pageNumber}
      setCurrentPage={(newPage: number) => navigate(`${location}/${newPage}/${order}/${filter}`)}
      totalPages={totalPages}
      registriesPerPage={registriesPerPage}
    />
  );
};

export default RegistriesFetcher;
