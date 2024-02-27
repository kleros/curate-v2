import React, { useMemo } from "react";
import styled from "styled-components";
import { useWindowSize } from "react-use";
import { useParams } from "react-router-dom";
import { SkeletonRegistryCard, SkeletonRegistryListItem } from "../StyledSkeleton";
import { StandardPagination } from "@kleros/ui-components-library";
import { BREAKPOINT_LANDSCAPE } from "styles/landscapeStyle";
import { useIsList } from "context/IsListProvider";
import { isUndefined } from "utils/index";
import { decodeListURIFilter } from "utils/uri";
// import { RegistryDetailsFragment } from "queries/useCasesQuery";
import RegistryCard from "components/RegistryCard";

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

const StyledPagination = styled(StandardPagination)`
  margin-top: 24px;
  margin-left: auto;
  margin-right: auto;
`;

export interface IRegistriesGrid {
  registries?: [];
  currentPage: number;
  setCurrentPage: (newPage: number) => void;
  registriesPerPage: number;
  totalPages: number;
}

const RegistriesGrid: React.FC<IRegistriesGrid> = ({
  registries,
  registriesPerPage,
  totalPages,
  currentPage,
  setCurrentPage,
}) => {
  const { filter } = useParams();
  const decodedFilter = decodeListURIFilter(filter ?? "all");
  const { id: searchValue } = decodedFilter;
  const { isList } = useIsList();
  const { width } = useWindowSize();
  const screenIsBig = useMemo(() => width > BREAKPOINT_LANDSCAPE, [width]);

  return (
    <>
      {isList && screenIsBig ? (
        <ListContainer>
          {isUndefined(registries)
            ? [...Array(registriesPerPage)].map((_, i) => <SkeletonRegistryListItem key={i} />)
            : registries.map((registry) => {
                return <RegistryCard key={registry.id} {...registry} />;
              })}
        </ListContainer>
      ) : (
        <GridContainer>
          {isUndefined(registries)
            ? [...Array(registriesPerPage)].map((_, i) => <SkeletonRegistryCard key={i} />)
            : registries.map((registry) => {
                return <RegistryCard key={registry.id} {...registry} overrideIsList />;
              })}
        </GridContainer>
      )}

      {isUndefined(searchValue) ? (
        <StyledPagination
          currentPage={currentPage}
          numPages={Math.ceil(totalPages ?? 0)}
          callback={(page: number) => setCurrentPage(page)}
        />
      ) : null}
    </>
  );
};

export default RegistriesGrid;
