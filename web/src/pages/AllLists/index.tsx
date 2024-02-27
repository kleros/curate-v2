import React from "react";
import styled from "styled-components";
import { Route, Routes } from "react-router-dom";
import { useAccount, useNetwork } from "wagmi";
import { DEFAULT_CHAIN } from "consts/chains";
import RegistriesFetcher from "./RegistriesFetcher";
import RegistryDetails from "./RegistryDetails";
import ItemDisplay from "./Item";
import Breadcrumb from "./StyledBreadcrumb";
import HomeIcon from "svgs/icons/home.svg";

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

const AllLists: React.FC = () => {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const isOnSupportedChain = chain?.id === DEFAULT_CHAIN;

  return (
    <Container>
      <Breadcrumb items={breadcrumbItems} />
      <Routes>
        <Route path="/display/:page/:order/:filter" element={<RegistriesFetcher />} />
        <Route path="/:id/item/:itemId" element={<ItemDisplay />} />
        <Route path="/:id/*" element={<RegistryDetails />} />
      </Routes>
    </Container>
  );
};

export default AllLists;
