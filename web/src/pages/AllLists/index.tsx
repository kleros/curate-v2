import React from "react";
import styled from "styled-components";
import { Route, Routes } from "react-router-dom";
import { useAccount, useNetwork } from "wagmi";
import { DEFAULT_CHAIN } from "consts/chains";
import RegistriesFetcher from "./RegistriesFetcher";
// import RegistryDetails from "./RegistryDetails";

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

const AllLists: React.FC = () => {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const isOnSupportedChain = chain?.id === DEFAULT_CHAIN;

  return (
    <Container>
      <Routes>
        <Route path="/display/:page/:order/:filter" element={<RegistriesFetcher />} />
        {/* <Route path="/:id/*" element={<RegistryDetails />} /> */}
      </Routes>
    </Container>
  );
};

export default AllLists;
