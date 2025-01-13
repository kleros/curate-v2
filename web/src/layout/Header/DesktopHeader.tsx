import React from "react";
import styled, { css } from "styled-components";

import { useToggle } from "react-use";
import { useAccount } from "wagmi";

import KlerosSolutionsIcon from "svgs/menu-icons/kleros-solutions.svg";

import { DEFAULT_CHAIN } from "consts/chains";
import { useLockOverlayScroll } from "hooks/useLockOverlayScroll";

import { landscapeStyle } from "styles/landscapeStyle";
import { responsiveSize } from "styles/responsiveSize";

import ConnectWallet from "components/ConnectWallet";
import LightButton from "components/LightButton";
import OverlayPortal from "components/OverlayPortal";
import { Overlay } from "components/Overlay";

import Logo from "./Logo";
import DappList from "./navbar/DappList";
import Explore from "./navbar/Explore";
import Menu from "./navbar/Menu";
import Help from "./navbar/Menu/Help";
import Settings from "./navbar/Menu/Settings";

const Container = styled.div`
  display: none;
  position: absolute;
  height: 64px;

  ${landscapeStyle(
    () => css`
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      position: relative;
    `
  )};
`;

const LeftSide = styled.div`
  display: flex;
  gap: 8px;
`;

const MiddleSide = styled.div`
  display: flex;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const RightSide = styled.div`
  display: flex;
  gap: ${responsiveSize(4, 8)};

  margin-left: 8px;
  canvas {
    width: 20px;
  }
`;

const LightButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StyledKlerosSolutionsIcon = styled(KlerosSolutionsIcon)`
  fill: ${({ theme }) => theme.white} !important;
`;

const ConnectWalletContainer = styled.div<{ isConnected: boolean; isDefaultChain: boolean }>`
  label {
    color: ${({ theme }) => theme.white};
    cursor: pointer;
  }
`;

const DesktopHeader: React.FC = () => {
  const [isDappListOpen, toggleIsDappListOpen] = useToggle(false);
  const [isHelpOpen, toggleIsHelpOpen] = useToggle(false);
  const [isSettingsOpen, toggleIsSettingsOpen] = useToggle(false);
  const { isConnected, chainId } = useAccount();
  const isDefaultChain = chainId === DEFAULT_CHAIN;
  useLockOverlayScroll(isDappListOpen || isHelpOpen || isSettingsOpen);

  return (
    <>
      <Container>
        <LeftSide>
          <LightButtonContainer>
            <LightButton
              text=""
              onClick={() => {
                toggleIsDappListOpen();
              }}
              Icon={StyledKlerosSolutionsIcon}
            />
          </LightButtonContainer>
          <Logo />
        </LeftSide>

        <MiddleSide>
          <Explore />
        </MiddleSide>

        <RightSide>
          <ConnectWalletContainer
            {...{ isConnected, isDefaultChain }}
            onClick={isConnected && isDefaultChain ? toggleIsSettingsOpen : undefined}
          >
            <ConnectWallet />
          </ConnectWalletContainer>
          <Menu {...{ toggleIsHelpOpen, toggleIsSettingsOpen }} />
        </RightSide>
      </Container>
      {(isDappListOpen || isHelpOpen || isSettingsOpen) && (
        <OverlayPortal>
          <Overlay>
            {isDappListOpen && <DappList {...{ toggleIsDappListOpen, isDappListOpen }} />}
            {isHelpOpen && <Help {...{ toggleIsHelpOpen, isHelpOpen }} />}
            {isSettingsOpen && <Settings {...{ toggleIsSettingsOpen, isSettingsOpen }} />}
          </Overlay>
        </OverlayPortal>
      )}
    </>
  );
};
export default DesktopHeader;
