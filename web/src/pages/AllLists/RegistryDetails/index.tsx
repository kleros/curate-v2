import React from "react";
import styled from "styled-components";
import { Breadcrumb } from "@kleros/ui-components-library";
import HomeIcon from "svgs/icons/home.svg";
import { IRegistriesGrid } from "components/RegistriesDisplay/RegistriesGrid";
import InformationCard from "./InformationCard";
import Tabs from "./Tabs";
import List from "./List";
import History from "./History";
import { Navigate, Route, Routes } from "react-router-dom";

const StyledBreadcrumb = styled(Breadcrumb)`
  margin-bottom: 32px;
  align-items: center;
`;

const StyledHomeIcon = styled(HomeIcon)`
  path {
    fill: ${({ theme }) => theme.secondaryText};
  }
  margin-bottom: 3.5px;
`;

const breadcrumbItems = [
  { text: <StyledHomeIcon />, value: "0" },
  { text: "All Lists", value: "1" },
  { text: "Address Tags", value: "2" },
];

interface IRegistryDetails extends IRegistriesGrid {
  items: [];
  totalItems?: number;
  title?: string;
  className?: string;
}

const RegistryDetails: React.FC<IRegistryDetails> = ({
  items,
  logoURI = "https://ipfs.kleros.io//ipfs/QmZPeWnzHGKwvnckQE2QrdRJiUFqQXvQEZGFHdEAh7raHN/fno.png",
  title = "Address Tags",
  description = "A list of public name tags, associated with Ethereum mainnet contract addresses.",
  totalItems = 3,
  className,
}) => {
  return (
    <div {...{ className }}>
      <StyledBreadcrumb items={breadcrumbItems} />
      <InformationCard title={title} logoURI={logoURI} description={description} />
      <Tabs />
      <Routes>
        <Route path="list" element={<List />} />
        <Route path="history" element={<History />} />
        <Route path="*" element={<Navigate to="list" replace />} />
      </Routes>
    </div>
  );
};

export default RegistryDetails;
