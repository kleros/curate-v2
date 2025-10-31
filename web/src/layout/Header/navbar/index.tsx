import React from "react";
import styled from "styled-components";
import { useToggle } from "react-use";
import { useAccount } from "wagmi";
import { useLockOverlayScroll } from "hooks/useLockOverlayScroll";
import { useOpenContext } from "../MobileHeader";
import DappList from "./DappList";
import Explore from "./Explore";
import ConnectWallet from "components/ConnectWallet";
import LightButton from "components/LightButton";
import { Overlay } from "components/Overlay";
import OverlayPortal from "components/OverlayPortal";
import KlerosSolutionsIcon from "svgs/menu-icons/kleros-solutions.svg";
import Menu from "./Menu";
import Help from "./Menu/Help";
import Settings from "./Menu/Settings";
import { DisconnectWalletButton } from "./Menu/Settings/General";

export interface ISettings {
  toggleIsSettingsOpen: () => void;
}

export interface IHelp {
  toggleIsHelpOpen: () => void;
}

export interface IDappList {
  toggleIsDappListOpen: () => void;
}

const NavBar: React.FC = () => {
  const { isConnected } = useAccount();
  const [isDappListOpen, toggleIsDappListOpen] = useToggle(false);
  const [isHelpOpen, toggleIsHelpOpen] = useToggle(false);
  const [isSettingsOpen, toggleIsSettingsOpen] = useToggle(false);
  const { isOpen } = useOpenContext();
  useLockOverlayScroll(isOpen);

  return (
    <>
      <div
        className={
          "absolute top-16 left-0 right-0 max-h-[calc(100vh-64px)] overflow-y-auto z-1 bg-klerosUIComponentsWhiteBackground shadow-default p-6 [&_hr]:my-6 " +
          `origin-top transform-${isOpen ? "scaleY(1)" : "scaleY(0)"} visibility-${
            isOpen ? "visible" : "hidden"
          } transition-[transform,visibility] duration-[klerosUIComponentsTransitionSpeed] ease-in-out`
        }
      >
        <LightButton
          text="Kleros Solutions"
          onClick={() => {
            toggleIsDappListOpen();
          }}
          Icon={KlerosSolutionsIcon}
        />
        <hr />
        <Explore isMobileNavbar={true} />
        <hr />
        <div className="flex gap-4 justify-between flex-wrap">
          <ConnectWallet />
          {isConnected && (
            <div className="flex items-center">
              <DisconnectWalletButton />
            </div>
          )}
        </div>
        <hr />
        <Menu {...{ toggleIsHelpOpen, toggleIsSettingsOpen }} />
        <br />
      </div>
      {(isDappListOpen || isHelpOpen || isSettingsOpen) && (
        <OverlayPortal>
          <Overlay>
            {isDappListOpen && <DappList {...{ toggleIsDappListOpen }} />}
            {isHelpOpen && <Help {...{ toggleIsHelpOpen }} />}
            {isSettingsOpen && <Settings {...{ toggleIsSettingsOpen }} />}
          </Overlay>
        </OverlayPortal>
      )}
    </>
  );
};

export default NavBar;
