import React, { useCallback } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { Button } from "@kleros/ui-components-library";
import { SUPPORTED_CHAINS, DEFAULT_CHAIN } from "consts/chains";
import AccountDisplay from "./AccountDisplay";
import { useWeb3Modal, useWeb3ModalState } from "@web3modal/wagmi/react";

export const SwitchChainButton: React.FC = () => {
  const { switchChain, isLoading } = useSwitchChain();
  const handleSwitch = useCallback(() => {
    if (!switchChain) {
      console.error("Cannot switch network. Please do it manually.");
      return;
    }
    try {
      switchChain({ chainId: DEFAULT_CHAIN });
    } catch (err) {
      console.error(err);
    }
  }, [switchChain]);

  return (
    <Button
      isLoading={isLoading}
      disabled={isLoading}
      text={`Switch to ${SUPPORTED_CHAINS[DEFAULT_CHAIN].name}`}
      onClick={handleSwitch}
    />
  );
};

const ConnectButton: React.FC<{ className?: string }> = ({ className }) => {
  const { open } = useWeb3Modal();
  const { open: isOpen } = useWeb3ModalState();
  return (
    <Button
      {...{ className }}
      disabled={isOpen}
      small
      text={"Connect"}
      onClick={async () => open({ view: "Connect" })}
    />
  );
};

const ConnectWallet: React.FC = () => {
  const { isConnected, chain } = useAccount();

  if (isConnected) {
    if (chain?.id !== DEFAULT_CHAIN) {
      return <SwitchChainButton />;
    } else return <AccountDisplay />;
  } else return <ConnectButton />;
};

export default ConnectWallet;
