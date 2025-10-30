import React from "react";

import { useToggle } from "react-use";
import { useAccount } from "wagmi";

import KlerosSolutionsIcon from "svgs/menu-icons/kleros-solutions.svg";

import { DEFAULT_CHAIN } from "consts/chains";
import { useLockOverlayScroll } from "hooks/useLockOverlayScroll";

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

const DesktopHeader: React.FC = () => {
  const [isDappListOpen, toggleIsDappListOpen] = useToggle(false);
  const [isHelpOpen, toggleIsHelpOpen] = useToggle(false);
  const [isSettingsOpen, toggleIsSettingsOpen] = useToggle(false);
  const { isConnected, chainId } = useAccount();
  const isDefaultChain = chainId === DEFAULT_CHAIN;
  useLockOverlayScroll(isDappListOpen || isHelpOpen || isSettingsOpen);

  return (
    <>
      <div className="hidden absolute h-16 landscape-900:flex landscape-900:items-center landscape-900:justify-between landscape-900:w-full landscape-900:relative">
        <div className="flex gap-2">
          <div className="flex items-center">
            <LightButton
              text=""
              onClick={() => {
                toggleIsDappListOpen();
              }}
              Icon={() => <KlerosSolutionsIcon className="fill-white!" />}
            />
          </div>
          <Logo />
        </div>

        <div className="flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Explore />
        </div>

        <div className={`flex ml-2 [&_canvas]:w-5 gap-[${responsiveSize(4, 8)}]`}>
          <div
            className="[&_label]:cursor-pointer [&_label]:text-white"
            onClick={isConnected && isDefaultChain ? toggleIsSettingsOpen : undefined}
          >
            <ConnectWallet />
          </div>
          <Menu {...{ toggleIsHelpOpen, toggleIsSettingsOpen }} />
        </div>
      </div>
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
