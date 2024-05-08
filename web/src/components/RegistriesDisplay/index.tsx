import React from "react";
import RegistriesGrid, { IRegistriesGrid } from "./RegistriesGrid";
import Header from "pages/Home/Header";
import StatsAndFilters from "components/StatsAndFilters";
import Search from "../Search";

interface IRegistriesDisplay extends IRegistriesGrid {
  registries: [];
  registriesLoading?: boolean;
  totalRegistries?: number;
  title?: string;
  className?: string;
}

const RegistriesDisplay: React.FC<IRegistriesDisplay> = ({
  registries,
  registriesLoading,
  currentPage,
  setCurrentPage,
  totalRegistries,
  registriesPerPage,
  className,
  totalPages,
}) => {
  return (
    <div {...{ className }}>
      <Header />
      <Search isList />
      <StatsAndFilters fields={[{ label: "Lists", value: totalRegistries?.toString() }]} isListFilter />
      {!registriesLoading && registries?.length === 0 ? (
        <h1>No lists found</h1>
      ) : (
        <RegistriesGrid
          {...{
            registries,
            registriesPerPage,
            totalPages,
            currentPage,
            setCurrentPage,
            registriesLoading,
          }}
        />
      )}
    </div>
  );
};

export default RegistriesDisplay;
