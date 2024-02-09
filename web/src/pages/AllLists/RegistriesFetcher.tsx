import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWindowSize } from "react-use";
import { useListRootPath, decodeListURIFilter } from "utils/uri";
import { useAccount } from "wagmi";
// import { useRegistriesQuery } from "hooks/queries/useRegistriesQuery";
import RegistriesDisplay from "components/RegistriesDisplay";
import { BREAKPOINT_LANDSCAPE } from "styles/landscapeStyle";
import { isUndefined } from "utils/index";
import { lists } from "consts/index";

const RegistriesFetcher: React.FC = () => {
  const { page, order, filter } = useParams();
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const location = useListRootPath();
  const screenIsBig = width > BREAKPOINT_LANDSCAPE;
  const registriesPerPage = screenIsBig ? 9 : 3;
  const pageNumber = parseInt(page ?? "1", 10);
  const registrySkip = registriesPerPage * (pageNumber - 1);
  const { address } = useAccount();

  // const { data: escrowData } = useRegistriesQuery(address!, registriesPerPage, registrySkip);

  // const { data: userData } = useUserQuery(address);
  // const totalEscrows = userData?.user?.totalEscrows;
  // const totalPages = useMemo(
  //   () => (!isUndefined(totalEscrows) ? Math.ceil(totalEscrows / registriesPerPage) : 1),
  //   [totalEscrows, registriesPerPage]
  // );

  return (
    <RegistriesDisplay
      registries={lists}
      totalRegistries={10}
      currentPage={pageNumber}
      setCurrentPage={(newPage: number) => navigate(`${location}/${newPage}/${order}/${filter}`)}
      totalPages={2}
      registriesPerPage={registriesPerPage}
    />
  );
};

export default RegistriesFetcher;
