import React from "react";
import styled from "styled-components";
import { Route, Routes } from "react-router-dom";
import { RegistryDetailsProvider } from "context/RegistryDetailsContext";
import RegistriesFetcher from "./RegistriesFetcher";
import RegistryDetails from "./RegistryDetails";
import ItemDisplay from "./ItemDisplay";
import Breadcrumb from "./StyledBreadcrumb";
import HomeIcon from "svgs/icons/home.svg";
import { items } from "src/consts";

const Container = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.lightBackground};
  padding: calc(24px + (136 - 24) * (min(max(100vw, 375px), 1250px) - 375px) / 875);
  padding-top: calc(32px + (80 - 32) * (min(max(100vw, 375px), 1250px) - 375px) / 875);
  padding-bottom: calc(76px + (96 - 76) * (min(max(100vw, 375px), 1250px) - 375px) / 875);
  max-width: 1780px;
  margin: 0 auto;
`;

export const ConnectWalletContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: ${({ theme }) => theme.primaryText};
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

const AllLists: React.FC = () => (
  <Container>
    <Breadcrumb items={breadcrumbItems} />
    <Routes>
      <Route path="/display/:page/:order/:filter" element={<RegistriesFetcher />} />
      <Route path="/:id/item/:itemId" element={<ItemDisplay />} />
      <Route
        path="/:id/*"
        element={
          <RegistryDetailsProvider>
            <RegistryDetails />
          </RegistryDetailsProvider>
        }
      />
    </Routes>
  </Container>
);

export default AllLists;
