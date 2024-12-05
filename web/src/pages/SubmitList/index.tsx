import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import styled, { css } from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import { useAccount } from "wagmi";
import ConnectWallet from "components/ConnectWallet";
import HeroImage from "components/HeroImage";
import { landscapeStyle } from "styles/landscapeStyle";
import Timeline from "./Timeline";
import Title from "./ListParameters/Title";
import Description from "./ListParameters/Description";
import LogoUpload from "./ListParameters/LogoUpload";
import Policy from "./ListParameters/Policy";
import Deposit from "./ItemParameters/Deposit";
import Fields from "./ItemParameters/Fields";
import ItemPreview from "./ItemParameters/ItemPreview";
import CustomName from "./ItemParameters/CustomName";
import AdvancedParameters from "./AdvancedParameters";
import DeployList from "./DeployList";
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

const StyledLabel = styled.label`
  display: none;

  ${landscapeStyle(
    () => css`
      display: flex;
      color: ${({ theme }) => theme.secondaryPurple};
      margin-bottom: 20px;
      padding-left: ${responsiveSize(25, 65)};
    `
  )}
`;

const SubmitList: React.FC = () => {
  const location = useLocation();

  const { isConnected } = useAccount();
  const isTimelineHidden =
    location.pathname.includes("/list-preview") ||
    location.pathname.includes("/item-preview") ||
    location.pathname.includes("/advanced") ||
    location.pathname.includes("/deploy");

  return (
    <>
      <HeroImage />
      <Container>
        {isConnected && !isTimelineHidden ? <StyledLabel>Create a List</StyledLabel> : null}
        {isConnected ? (
          <StyledEnsureAuth>
            <MiddleContentContainer>
              {isConnected && !isTimelineHidden ? <Timeline /> : null}
              <Routes>
                <Route index element={<Navigate to="title" replace />} />
                <Route path="/title/*" element={<Title />} />
                <Route path="/description/*" element={<Description />} />
                <Route path="/logo/*" element={<LogoUpload />} />
                <Route path="/policy/*" element={<Policy />} />
                <Route path="/deposit/*" element={<Deposit />} />
                <Route path="/fields/*" element={<Fields />} />
                <Route path="/item-preview/*" element={<ItemPreview />} />
                <Route path="/custom/*" element={<CustomName />} />
                <Route path="/advanced/*" element={<AdvancedParameters />} />
                <Route path="/deploy/*" element={<DeployList />} />
              </Routes>
            </MiddleContentContainer>
          </StyledEnsureAuth>
        ) : (
          <ConnectWalletContainer>
            To create a new list, connect first
            <hr />
            <ConnectWallet />
          </ConnectWalletContainer>
        )}
      </Container>
    </>
  );
};

export default SubmitList;
