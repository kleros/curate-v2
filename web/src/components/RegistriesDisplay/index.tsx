import React from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import { Breadcrumb } from "@kleros/ui-components-library";
import Search from "./Search";
import StatsAndFilters from "./StatsAndFilters";
import RegistriesGrid, { IRegistriesGrid } from "./RegistriesGrid";
import HomeIcon from "svgs/icons/home.svg";

const StyledTitle = styled.h1`
  margin-bottom: ${responsiveSize(32, 48)};
`;

const StyledHomeIcon = styled(HomeIcon)`
  path {
    fill: ${({ theme }) => theme.secondaryText};
  }
  margin-bottom: 3.5px;
`;

const StyledBreadcrumb = styled(Breadcrumb)`
  margin-bottom: 32px;
  align-items: center;
`;

const breadcrumbItems = [
  { text: <StyledHomeIcon />, value: "0" },
  { text: "All Lists", value: "0" },
];

interface IRegistriesDisplay extends IRegistriesGrid {
  registries: [];
  totalRegistries?: number;
  title?: string;
  className?: string;
}

const RegistriesDisplay: React.FC<IRegistriesDisplay> = ({
  registries,
  currentPage,
  setCurrentPage,
  totalRegistries,
  registriesPerPage,
  title = "Community Curated Lists",
  className,
  totalPages,
}) => {
  return (
    <div {...{ className }}>
      <StyledBreadcrumb items={breadcrumbItems} />
      <StyledTitle>{title}</StyledTitle>
      <Search />
      <StatsAndFilters totalRegistries={7} />

      {registries?.length === 0 ? (
        <h1>No lists found</h1>
      ) : (
        <RegistriesGrid
          registries={registries}
          {...{
            registriesPerPage,
            totalPages,
            currentPage,
            setCurrentPage,
          }}
        />
      )}
    </div>
  );
};

export default RegistriesDisplay;
