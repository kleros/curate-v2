import React from "react";
import { AddressOrName, IdenticonOrAvatar } from "../ConnectWallet/AccountDisplay";
import { useEnsAddress } from "wagmi";
import { isAddress } from "viem";
import Skeleton from "react-loading-skeleton";
import { cn } from "~src/utils";

interface IAlias {
  address: string;
  className?: string;
}

const AliasDisplay: React.FC<IAlias> = ({ address, className }) => {
  const { data: addressFromENS, isLoading } = useEnsAddress({
    enabled: !isAddress(address),
    name: address,
    chainId: 1,
  });

  const finalAddress = addressFromENS ?? address;

  return (
    <div className={cn("flex items-center gap-2 min-h-8", className)}>
      {isLoading ? <Skeleton width={30} height={24} /> : <IdenticonOrAvatar address={finalAddress} size="24" />}
      <div className="flex [&>label]:text-sm [&>label]:text-klerosUIComponentsPrimaryText">
        {isLoading ? <Skeleton width={30} height={24} /> : <AddressOrName address={finalAddress} />}&nbsp;
      </div>
    </div>
  );
};

export default AliasDisplay;
