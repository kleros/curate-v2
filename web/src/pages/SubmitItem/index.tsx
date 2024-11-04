import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import { useAccount } from "wagmi";
import ConnectWallet from "components/ConnectWallet";
import Timeline from "./Timeline";
import Policy from "./Policy";
import Preview from "./Preview";
import Header from "./Header";
import ItemField from "./ItemField";
import { useRegistryDetailsQuery } from "hooks/queries/useRegistryDetailsQuery";
import { useRegistryDetailsContext } from "context/RegistryDetailsContext";
import EnsureAuth from "components/EnsureAuth";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${({ theme }) => theme.lightBackground};
  padding: ${responsiveSize(24, 32)};
  padding-top: ${responsiveSize(24, 28)};
  padding-bottom: ${responsiveSize(76, 96)};
  max-width: 1780px;
  margin: 0 auto;
`;

const ConnectWalletContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: ${({ theme }) => theme.primaryText};
`;

const StyledEnsureAuth = styled(EnsureAuth)`
  align-self: center;
`;

const MiddleContentContainer = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
`;

const SubmitItem: React.FC = () => {
  const location = useLocation();
  const { id } = useParams();
  const [registryAddress, _] = id?.split("-");

  const { data: registryDetails } = useRegistryDetailsQuery(registryAddress?.toLowerCase());
  const { setRegistryDetails } = useRegistryDetailsContext();

  useEffect(() => {
    if (registryDetails && registryDetails?.registry) {
      setRegistryDetails({
        ...registryDetails.registry,
      });
    }
  }, [registryDetails, setRegistryDetails]);

  const { isConnected } = useAccount();
  const isPreviewPage = location.pathname.includes("/preview");

  return (
    <>
      {<Header />}
      <Container>
        {isConnected ? (
          <StyledEnsureAuth>
            <MiddleContentContainer>
              {isConnected && !isPreviewPage ? <Timeline /> : null}
              <Routes>
                <Route index element={<Navigate to="item-field/0" replace />} />
                <Route path="/item-field/:id" element={<ItemField />} />
                <Route path="/policy/*" element={<Policy />} />
                <Route path="/preview/*" element={<Preview />} />
              </Routes>
            </MiddleContentContainer>
          </StyledEnsureAuth>
        ) : (
          <ConnectWalletContainer>
            To submit a new item, connect first
            <hr />
            <ConnectWallet />
          </ConnectWalletContainer>
        )}
      </Container>
    </>
  );
};

export default SubmitItem;
