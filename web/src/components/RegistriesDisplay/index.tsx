import React from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import { Breadcrumb } from "@kleros/ui-components-library";
import Search from "./Search";
import RegistriesGrid, { IRegistriesGrid } from "./RegistriesGrid";
import HomeIcon from "svgs/icons/home.svg";
import Header from "pages/Home/Header";
import StatsAndFilters from "components/StatsAndFilters";

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
  { text: "All Lists", value: "1" },
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
  className,
  totalPages,
}) => {
  return (
    <div {...{ className }}>
      <StyledBreadcrumb items={breadcrumbItems} />
      <Header />
      <Search />
      <StatsAndFilters fields={[{ label: "Lists", value: totalRegistries?.toString() }]} isListFilter />
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
