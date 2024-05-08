import React from "react";
import styled from "styled-components";
import { Route, Routes } from "react-router-dom";
import { RegistryDetailsProvider } from "context/RegistryDetailsContext";
import RegistriesFetcher from "./RegistriesFetcher";
import RegistryDetails from "./RegistryDetails";
import ItemDisplay from "./ItemDisplay";
import Breadcrumb from "./StyledBreadcrumb";

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

const AllLists: React.FC = () => (
  <Container>
    <Breadcrumb />
    <Routes>
      <Route path="/display/:page/:order/:filter" element={<RegistriesFetcher />} />
      <Route path="/item/:itemId" element={<ItemDisplay />} />
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
