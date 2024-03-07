import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWindowSize } from "react-use";
import { useListRootPath, decodeListURIFilter } from "utils/uri";
import RegistriesDisplay from "components/RegistriesDisplay";
import { BREAKPOINT_LANDSCAPE } from "styles/landscapeStyle";
import { isUndefined } from "utils/index";
import { lists } from "consts/index";
import { useCounterQuery, useRegistriesQuery } from "queries/useRegistriesQuery";
import { OrderDirection } from "src/graphql/graphql";

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

  const { data: registriesData } = useRegistriesQuery(
    registrySkip,
    registriesPerPage,
    decodedFilter,
    order === "asc" ? OrderDirection.Asc : OrderDirection.Desc
  );

  console.log(registriesData);

  const { data: counterData } = useCounterQuery();
  const totalRegistries = counterData?.counter?.totalRegistries;
  const totalPages = useMemo(
    () => (!isUndefined(totalRegistries) ? Math.ceil(totalRegistries / registriesPerPage) : 1),
    [totalRegistries, registriesPerPage]
  );

  return (
    <RegistriesDisplay
      registries={lists}
      totalRegistries={totalRegistries}
      currentPage={pageNumber}
      setCurrentPage={(newPage: number) => navigate(`${location}/${newPage}/${order}/${filter}`)}
      totalPages={totalPages}
      registriesPerPage={registriesPerPage}
    />
  );
};

export default RegistriesFetcher;
