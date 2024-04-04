import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWindowSize } from "react-use";
import { useListRootPath, decodeListURIFilter } from "utils/uri";
import RegistriesDisplay from "components/RegistriesDisplay";
import { BREAKPOINT_LANDSCAPE } from "styles/landscapeStyle";
import { isUndefined } from "utils/index";
import { OrderDirection } from "src/graphql/graphql";
import { useItemsQuery } from "~src/hooks/queries/useItemsQuery";
import { useRegistriesByIdsQuery } from "~src/hooks/queries/useRegistriesByIdsQuery";

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

  const { data: itemsData } = useItemsQuery(0, 9, { registry: "0x1db24bae1b932c53430db2cdb3b61d4690ca108e" });
  const registryIds = useMemo(() => itemsData?.items.map((item) => JSON.parse(item.data).address) || [], [itemsData]);

  const { data: registriesData } = useRegistriesByIdsQuery(registryIds);
  const combinedListsData = useMemo(() => {
    return registriesData?.registries.map((registry) => {
      const registryAsItem = itemsData.items.find((item) => JSON.parse(item.data).address === registry.id);

      return {
        ...registry,
        totalItems: registry.items.length,
        status: registryAsItem.status,
      };
    });
  }, [registriesData, itemsData]);

  // const { data: counterData } = useCounterQuery();
  // const totalRegistries = counterData?.counter?.totalRegistries;
  // const totalPages = useMemo(
  //   () => (!isUndefined(totalRegistries) ? Math.ceil(totalRegistries / registriesPerPage) : 1),
  //   [totalRegistries, registriesPerPage]
  // );

  return (
    <RegistriesDisplay
      registries={combinedListsData}
      totalRegistries={10}
      currentPage={pageNumber}
      setCurrentPage={(newPage: number) => navigate(`${location}/${newPage}/${order}/${filter}`)}
      totalPages={2}
      registriesPerPage={registriesPerPage}
    />
  );
};

export default RegistriesFetcher;
