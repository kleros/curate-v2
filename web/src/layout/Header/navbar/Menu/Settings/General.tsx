import React, { useMemo } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { Button } from "@kleros/ui-components-library";
import { AddressOrName, ChainDisplay, IdenticonOrAvatar } from "components/ConnectWallet/AccountDisplay";
import { EnsureChain } from "components/EnsureChain";

export const DisconnectWalletButton: React.FC = () => {
  const { disconnect } = useDisconnect();
  return <Button text={`Disconnect`} onClick={() => disconnect()} />;
};

const General: React.FC = () => {
  const { address, chain } = useAccount();

  const addressExplorerLink = useMemo(() => {
    return `${chain?.blockExplorers?.default.url}/address/${address}`;
  }, [address, chain]);

  return (
    <div className="flex justify-center p-4">
      <EnsureChain>
        <div className="flex flex-col justify-center mt-3">
          {address && (
            <div className="flex flex-col gap-3">
              <div className="flex justify-center mt-3">
                <IdenticonOrAvatar size="48" />
              </div>
              <div className="flex justify-center [&>label]:text-base [&>label]:font-semibold [&>label]:text-klerosUIComponentsPrimaryText">
                <a
                  href={addressExplorerLink}
                  rel="noreferrer"
                  target="_blank"
                  className="no-underline hover:underline [&_label]:cursor-pointer [&_label]:text-klerosUIComponentsPrimaryBlue"
                >
                  <AddressOrName />
                </a>
              </div>
              <div className="flex h-[34px] gap-2 justify-center items-center before:content-[''] before:w-2 before:h-2 before:rounded-[50%] before:bg-klerosUIComponentsSuccess [&>label]:text-klerosUIComponentsSuccess">
                <ChainDisplay />
              </div>
              <div className="flex justify-center mt-4">
                <DisconnectWalletButton />
              </div>
            </div>
          )}
        </div>
      </EnsureChain>
    </div>
  );
};

export default General;
